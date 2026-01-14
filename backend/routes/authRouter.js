import express from "express";
import upload from "../middleware/multer.js";
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUP,
  varifyOtp,
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", upload.single("photourl"), signUP);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/googleauth", upload.single("photourl"), googleAuth);
authRouter.post("/sendotp", sendOtp);
authRouter.post("/varifyotp", varifyOtp);
authRouter.post("/resetpassword", resetPassword);

export default authRouter;
