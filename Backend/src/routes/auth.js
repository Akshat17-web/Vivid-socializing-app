import express from "express";
import validator from "validator";
import User from "../models/User.js";
import { upsertStreamUser } from "../config/stream.js";
import { protectRoute } from "../middleware/auth_user.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({message: "All fields are required"});
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({message: "Enter a valid email Id"});
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({message: "Enter a strong password"});
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const formattedName = fullName.trim().split(/\s+/).join("+");
    const defaultAvatar = `https://eu.ui-avatars.com/api/?name=${formattedName}&size=250`;

    const newUser = new User({
      fullName,
      email,
      password,
      profilePic: defaultAvatar,
    });

    try{
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    }catch(err){
      console.log("Error creating Stream user: ", err);
    }

    await newUser.save();
    const token = await newUser.getJWT();
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({success: true, user:newUser});
  } catch (err) {
    console.error(err);
    res.status(500).send("ERROR: Internal server error");
  }
});

authRouter.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try{
    if(!email || !password){
      return res.status(400).json({message: "All field re required to login!"});
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({message: "Invalid eemail or password"});
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if(!isPasswordCorrect){
      return res.status(401).json({message: "Invalid email or password"});
    }
    const token = await user.getJWT();
    res.cookie("jwt", token, {
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
    res.status(200).json({success: true, user});
  }catch(err){
    res.status(500).send("Some INTERNAL ERROR occured");
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({success: true, message: "Logout successful"});
});

authRouter.post("/onboarding", protectRoute, async (req, res) => {
  try{
    const userId = req.user._id;
    const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;
    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true,
    }, {returnDocument: "after"})

    if(!updatedUser) return res.status(404).json({message:"User NOT found"});

    try{
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      })
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    }catch(err){
      console.log("Error updating Stream user during onboarding", err.message);
    }

    res.status(200).json({success:true, user: updatedUser});
  }catch(err){
    console.error("Onboarding error: ", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

authRouter.get("/me", protectRoute, (req, res) => {
  res.status(200).json({success: true, user: req.user});
});

export default authRouter;
