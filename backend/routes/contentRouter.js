import express from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
  addComment,
  addReply,
  createVideo,
  deleteVideo,
  fetchVideo,
  getAllVideos,
  getLikedVideos,
  getSavedVideos,
  getViews,
  toggleVideoDisLikes,
  toggleVideoLikes,
  toggleVideoSave,
  updateVideo,
} from "../controller/videoController.js";
import {
  addShortComment,
  addShortReply,
  createShort,
  deleteShort,
  fetchShort,
  getAllShorts,
  getLikedShorts,
  getsavedShort,
  getShortViews,
  toggleShortDislike,
  toggleShortLike,
  toggleShortSave,
  updateShort,
} from "../controller/shortController.js";
import {
  createPlaylist,
  deletePlaylist,
  fetchPlayList,
  getSavedPlaylists,
  toggleSavePlaylist,
  updatePlayList,
} from "../controller/playlistController.js";
import {
  addPostComment,
  addPostReply,
  createPost,
  deletePost,
  getAllPosts,
  toggleLikePost,
} from "../controller/postController.js";
import {
  filterCategoryWithAi,
  searchWithAi,
} from "../controller/aiController.js";
const contentRouter = express.Router();

contentRouter.post(
  "/createvideo",
  isAuth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);
contentRouter.get("/getallvideos", getAllVideos);

contentRouter.post(
  "/create-short",
  isAuth,
  upload.single("shorturl"),
  createShort
);
contentRouter.get("/getallshorts", getAllShorts);
contentRouter.put("/video-like/:videoId", isAuth, toggleVideoLikes);
contentRouter.put("/video-dislike/:videoId", isAuth, toggleVideoDisLikes);
contentRouter.put("/video-save/:videoId", isAuth, toggleVideoSave);
contentRouter.put("/video-views/:videoId", isAuth, getViews);
contentRouter.post("/video-addvideocomment/:videoId", isAuth, addComment);
contentRouter.post(
  "/video-addvideoreply/:videoId/:commentId",
  isAuth,
  addReply
);
contentRouter.put(
  "/updatevideo/:videoId",
  isAuth,
  upload.single("thumbnail"),
  updateVideo
);
contentRouter.delete("/deletevideo/:videoId", isAuth, deleteVideo);
contentRouter.get("/fetchvideo/:videoId", fetchVideo);

contentRouter.put("/short-like/:shortId", isAuth, toggleShortLike);
contentRouter.put("/short-dislike/:shortId", isAuth, toggleShortDislike);
contentRouter.put("/short-save/:shortId", isAuth, toggleShortSave);
contentRouter.post("/short-addcomment/:shortId", isAuth, addShortComment);
contentRouter.post(
  "/short-addreply/:shortId/:commentId",
  isAuth,
  addShortReply
);
contentRouter.put("/short-views/:shortId", isAuth, getShortViews);
contentRouter.put("/updateshort/:shortId", isAuth, updateShort);
contentRouter.delete("/deleteshort/:shortId", isAuth, deleteShort);
contentRouter.get("/fetchshort/:shortId", isAuth, fetchShort);

contentRouter.post("/create-playlist", isAuth, createPlaylist);
contentRouter.put("/playlist-save/:playlistId", isAuth, toggleSavePlaylist);
contentRouter.put("/updateplayList/:playlistId", isAuth, updatePlayList);
contentRouter.delete("/deleteplaylist/:playlistId", isAuth, deletePlaylist);
contentRouter.get("/fetchplaylist/:playlistId", isAuth, fetchPlayList);

contentRouter.post("/create-post", isAuth, upload.single("image"), createPost);
contentRouter.get("/getallposts", getAllPosts);
contentRouter.put("/post-like/:postId", isAuth, toggleLikePost);
contentRouter.put("/post-addcomment/:postId", isAuth, addPostComment);
contentRouter.put("/post-addreply/:postId/:commentId", isAuth, addPostReply);
contentRouter.delete("/deletepost/:postId", isAuth, deletePost);




contentRouter.get("/getlikedvideos", isAuth, getLikedVideos);
contentRouter.get("/getlikedshorts", isAuth, getLikedShorts);

contentRouter.get("/getsavedvideos", isAuth, getSavedVideos);
contentRouter.get("/getsavedshorts", isAuth, getsavedShort);
contentRouter.get("/getsavedplaylists", isAuth, getSavedPlaylists);
contentRouter.post("/search", isAuth, searchWithAi);
contentRouter.post("/filter", isAuth, filterCategoryWithAi);

export default contentRouter;
