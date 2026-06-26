import express from "express";
import { protectRoute } from "../middleware/auth_user.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

const userRouter = express.Router();

userRouter.use(protectRoute);

userRouter.get("/feed", async (req, res) => {
  try {
    // const currUser = req.user;
    // const excludedIds = [...currUser.friends, currUser._id];
    // if(!currUser.isOnboarded){
    //   return res.status(403).json({message: "You are not allowed to view the feed until you are onboarded"});
    // }
    const loggedInUser = req.user;
    const seenIds = await FriendRequest.find({
      $or: [{ sender: loggedInUser._id }, { recipient: loggedInUser._id }],
    });
    const knownUsers = seenIds.flatMap((row) => {
      if (row.sender.toString() === loggedInUser._id.toString()) {
        return row.recipient;
      }
      if (row.recipient.toString() === loggedInUser._id.toString()) {
        return row.sender;
      }
    });
    knownUsers.push(loggedInUser._id);

    const recommendedUsers = await User.find({
      _id: { $nin: knownUsers },
      isOnboarded: true,
    });
    res.status(200).json(recommendedUsers);
  } catch (err) {
    console.error("Error in getting recommended user : ", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/friends", async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage",
      );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.friends);
  } catch (err) {
    console.error("Error in getting friends: ", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/friend-request/:toUserId", async (req, res) => {
  try {
    const myId = req.user._id;
    const recipientId = req.params.toUserId;
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }
    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friend with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipient, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendReq = new FriendRequest({
      sender: myId,
      recipient: recipient,
    });
    await friendReq.save();
    res.status(201).json(friendReq);
  } catch (err) {
    console.error("Error in sending friend request", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.put("/friend-request/:reqId/accept", async (req, res) => {
  try {
    const requestId = req.params.reqId;
    const friendReq = await FriendRequest.findById(requestId);
    if (!friendReq) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendReq.recipient.toString() != req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendReq.status = "accepted";
    await friendReq.save();

    await User.findByIdAndUpdate(friendReq.sender, {
      $addToSet: { friends: friendReq.recipient },
    });
    await User.findByIdAndUpdate(friendReq.recipient, {
      $addToSet: { friends: friendReq.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.log("Error in accepting friend request", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/friend-requests", async (req, res) => {
  try {
    const currUser = req.user;
    const incommingReqs = await FriendRequest.find({
      recipient: currUser._id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage",
    );

    const acceptedReqs = await FriendRequest.find({
      sender: currUser._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incommingReqs, acceptedReqs });
  } catch (err) {
    console.log("Error in getting pending friend requests", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/friend-request-sent", async (req, res) => {
  try {
    const sentRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage",
    );
    res.status(200).json(sentRequests);
  } catch (err) {
    console.log("Error in getting sent friend requests ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default userRouter;
