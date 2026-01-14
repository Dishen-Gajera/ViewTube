import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Post from "../model/postModel.js";

export const createPost = async (req, res) => {
  const { content, channelId } = req.body;

  try {
    if (!channelId || !content) {
      return res
        .status(400)
        .json({ message: "channel id or content is required" });
    }
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const post = await Post.create({ content, channel: channelId, image });
    await Channel.findByIdAndUpdate(channelId, {
      $push: { communityposts: post._id },
    });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "createpost error" + error });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("channel")
      .populate({ path: "comments.author", select: "username photourl email" })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email",
      });
    if (!posts) {
      return res.status(400).json({ message: "No post found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "getAllPost error" + error });
  }
};

export const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;
  try {
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }
    const post = await Post.findById(postId).select("likes");
    const isLiked = post.likes.includes(userId);
    let updatedLikes;
    if (isLiked) {
      updatedLikes = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      ).select("likes");
    } else {
      updatedLikes = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      ).select("likes");
    }
    return res.status(200).json(updatedLikes);
  } catch (error) {
    return res.status(500).json({ message: "togglelikes error" + error });
  }
};

export const addPostComment = async (req, res) => {
  const { postId } = req.params;
  const { message } = req.body;
  const userId = req.userId;
  try {
    if (!postId || !message.trim()) {
      return res
        .status(400)
        .json({ message: "postId and message is required" });
    }
    const newComments = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { author: userId, message } } },
      { new: true }
    )
      .select("comments")
      .populate({ path: "comments.author", select: "username photourl email" })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email",
      });
    return res.status(200).json(newComments);
  } catch (error) {
    return res.status(500).json({ message: "add post comment error" + error });
  }
};

export const addPostReply = async (req, res) => {
  const { postId, commentId } = req.params;
  const { message } = req.body;
  const userId = req.userId;
  try {
    if (!postId || !commentId) {
      return res
        .status(400)
        .json({ message: "postId and vommentid is required" });
    }

    const newComments = await Post.findOneAndUpdate(
      { _id: postId, "comments._id": commentId },
      { $push: { "comments.$.replies": { author: userId, message } } },
      { new: true }
    )
      .select("comments")
      .populate({ path: "comments.author", select: "username photourl email" })
      .populate({
        path: "comments.replies.author",
        select: "username pho                      tourl email",
      });
    return res.status(200).json(newComments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "add post reply comment error" + error });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).select("channel");

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    await Channel.findByIdAndUpdate(post.channel, {
      $pull: { communityposts: post._id },
    });

    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "delete post error" + error });
  }
};
