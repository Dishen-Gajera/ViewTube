import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  addHistory,
  createChannel,
  getAllChannelData,
  getChannel,
  getHistory,
  getRecommededContet,
  getSubscribedData,
  getUser,
  toggleSubscribe,
  updateChannel,
} from "../controller/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express();

userRouter.get("/getcurrentuser", isAuth, getUser);
userRouter.post(
  "/createchannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createChannel
);
userRouter.get("/getchannel", isAuth, getChannel);
userRouter.post(
  "/updatechannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateChannel
);

userRouter.post("/togglesubscribe", isAuth, toggleSubscribe);

userRouter.get("/getallchannels", getAllChannelData);
userRouter.get("/subscribedcontent", isAuth, getSubscribedData);
userRouter.post("/addhistory", isAuth, addHistory);
userRouter.get("/gethistory", isAuth, getHistory);
userRouter.get("/recommendation", isAuth, getRecommededContet);

export default userRouter;
