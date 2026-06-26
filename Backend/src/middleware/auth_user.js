import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = async (req, res, next) =>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized - No token provided"});
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid token"});
        }
        const user = await User.findById(decoded._id).select("-password");
        if(!user){
            return res.status(401).json({message: "Unauthorized - User not found"});
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("ERRORR : " + err.message);
    }
}