import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import contentRouter from "./routes/contentRouter.js";

dotenv.config();
connectDb();

const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin:
      "https://viewtube-frontend-bnn3xlwv4-dishen-gajeras-projects.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/content", contentRouter);

export default app;
