import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const Connection_Uri = process.env.MONGO_URI

export const connectDB = async () => {
  const conn = await mongoose.connect(
    Connection_Uri,
  );
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
