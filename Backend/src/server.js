import express from "express";
import authRouter from "./routes/auth.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js"
import cors from "cors";
import path from "path";

dotenv.config();
 
const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  })
}

connectDB().then(() => {
  console.log("Database connection established");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
}).catch((err) => {
    console.error("Database cannot be connected");
});