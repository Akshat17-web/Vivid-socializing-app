import express from "express";
import { protectRoute } from "../middleware/auth_user.js";
import { generateStreamToken } from "../config/stream.js";

const chatRouter = express.Router();

chatRouter.get("/token", protectRoute , async(req, res) => {
    try{
        const token = generateStreamToken(req.user.id);
        res.status(200).json({token});
    }catch(err){
        console.log("Error in getting Stream Token : ", err.message);
        res.status(500).json({message: "Internal Server Error"});
    }
});

export default chatRouter;