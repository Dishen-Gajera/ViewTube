import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Short from "../model/shortModel.js";

export const createShort = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;

    if (!title || !channelId) {
      return res
        .status(400)
        .json({ message: "Short title and channelid is require" });
    }
    let shorturl;
    if (req.file) {
      shorturl = await uploadOnCloudinary(req.file.path);
    }
    if (!shorturl) {
      return res.status(400).json({ message: "Short video is require" });
    }
    let channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(400).json({ message: "You have not channel" });
    }
    let parsedtag = [];
    if (tags) {
      try {
        parsedtag = JSON.parse(tags);
      } catch (error) {
        parsedtag = [];
      }
    }

    const short = await Short.create({
      channel: channelId,
      title,
      description,
      tags: parsedtag,
      shorturl,
    });
    channel.shorts.push(short._id);
    await channel.save();
    return res.status(200).json(short);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "create short error" + error });
  }
};

export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .sort({ createdAt: -1 })
      .populate("channel")
      .populate({ path: "comments.author", select: "username photourl email" })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email",
      });
    if (!shorts) {
      return res.status(400).json({ message: "Shorts not found" });
    }

    return res.status(200).json(shorts);
  } catch (error) {
    return res.status(500).json({ message: "get All shorts error" + error });
  }
};

export const toggleShortLike = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;
    if (!shortId) {
      return res.status(400).json({ message: "shortId is required" });
    }
    const short = await Short.findById(shortId).select("likes");
    const isLiked = short.likes.includes(userId);
    let updatedLikes;
    if (isLiked) {
      updatedLikes = await Short.findByIdAndUpdate(
        shortId,
        {
          $pull: { likes: userId },
        },
        { new: true }
      ).select("likes dislikes");
    } else {
      updatedLikes = await Short.findByIdAndUpdate(
        shortId,

        { $pull: { dislikes: userId }, $addToSet: { likes: userId } },
        { new: true }
      ).select("likes dislikes");
    }
    return res.status(200).json(updatedLikes);
  } catch (error) {
    return res.status(500).json({ message: "toggleshorts like error" + error });
  }
};

export const toggleShortDislike = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    if (!shortId) {
      return res.status(400).json({ message: "ShortId is required" });
    }
    const short = await Short.findById(shortId).select("dislikes");
    const isdislike = short.dislikes.includes(userId);
    let updatedDislikes;
    if (isdislike) {
      updatedDislikes = await Short.findByIdAndUpdate(
        shortId,
        { $pull: { dislikes: userId } },
        { new: true }
      ).select("dislikes likes");
    } else {
      updatedDislikes = await Short.findByIdAndUpdate(
        shortId,
        { $pull: { likes: userId }, $addToSet: { dislikes: userId } },
        { new: true }
      ).select("dislikes likes");
    }
    return res.status(200).json(updatedDislikes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "toggleshorts dislike error" + error });
  }
};

export const toggleShortSave = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;
    if (!shortId) {
      return res.status(400).json({ message: "short id is required" });
    }
    const short = await Short.findById(shortId).select("saveby");
    const issave = short.saveby.includes(userId);
    let updatedsave;
    if (issave) {
      updatedsave = await Short.findByIdAndUpdate(
        shortId,
        { $pull: { saveby: userId } },
        { new: true }
      ).select("saveby");
    } else {
      updatedsave = await Short.findByIdAndUpdate(
        shortId,
        { $addToSet: { saveby: userId } },
        { new: true }
      ).select("saveby");
    }
    return res.status(200).json(updatedsave);
  } catch (error) {
    res.status(500).json({ message: "togglesave short error" + error });
  }
};

export const addShortComment = async (req, res) => {
  const { shortId } = req.params;
  const userId = req.userId;
  const { message } = req.body;
  try {
    if (!shortId || !message) {
      return res
        .status(400)
        .json({ message: "short Id and message is reqquired" });
    }
    const newComments = await Short.findByIdAndUpdate(
      shortId,
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
    return res
      .status(500)
      .json({ message: "shorts add comment error" + error });
  }
};

export const addShortReply = async (req, res) => {
  const { shortId, commentId } = req.params;
  const { message } = req.body;
  const userId = req.userId;
  try {
    if (!shortId || !commentId || !message) {
      return res
        .status(400)
        .json({ message: "shortId commentId or meaage is required" });
    }
    const updatedComments = await Short.findOneAndUpdate(
      { _id: shortId, "comments._id": commentId },
      { $push: { "comments.$.replies": { author: userId, message } } },
      { new: true }
    )
      .select("comments")
      .populate({ path: "comments.author", select: "username photourl email" })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email",
      });

    return res.status(200).json(updatedComments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "allshortready raply error" + error });
  }
};

export const getShortViews = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!shortId) {
      return res.status(400).json({ message: "videoid is required" });
    }
    const updatedViews = await Short.findByIdAndUpdate(
      shortId,
      { $inc: { views: 1 } },
      { new: true }
    ).select("views");

    return res.status(200).json(updatedViews);
  } catch (error) {
    return res.status(500).json({ message: "get views error" + error });
  }
};

export const getLikedShorts = async (req, res) => {
  try {
    const userId = req.userId;
    const likedShorts = await Short.find({ likes: userId })
      .populate("channel", "name avatar")
      .populate("likes", "username");
    if (!likedShorts) {
      return res.status(400).json({ message: "Liked shorts not found" });
    }
    res.status(200).json(likedShorts);
  } catch (error) {
    return res.status(500).json({ message: "get likes shorts error" + error });
  }
};

export const getsavedShort = async (req, res) => {
  try {
    const userId = req.userId;
    const savedShorts = await Short.find({ saveby: userId })
      .populate("channel", "username avatar")
      .populate("saveby", "username");
    if (!savedShorts) {
      return res.status(400).json({ message: "no short videos saved" });
    }
    return res.status(200).json(savedShorts);
  } catch (error) {
    return res.status(500).json({ message: "get saved shorts error" + error });
  }
};

export const fetchShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!shortId) {
      return res.status(400).json({ meaage: "shortId is required" });
    }
    const short = await Short.findById(shortId)
      .populate("channel", "name avatar")
      .populate("likes", "username photourl");

    if (!short) {
      return res.status(400).json({ message: "short is not found" });
    }
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: "fetch short  error" + error });
  }
};

export const updateShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { title, description, tags } = req.body;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "Video not found" });
    }
    if (title) short.title = title;
    if (description) short.description = description;
    if (tags) {
      try {
        short.tags = JSON.parse(tags);
      } catch (error) {
        short.tags = [];
      }
    }

    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: "short video  error" + error });
  }
};

export const deleteShort = async (req, res) => {
  const { shortId } = req.params;
  try {
    const short = await Short.findById(shortId).select("channel");

    if (!short) {
      return res.status(400).json({ message: "video not found" });
    }
    await Channel.findByIdAndUpdate(short.channel, {
      $pull: { shorts: short._id },
    });

    await Short.findByIdAndDelete(shortId);
    return res.status(200).json({ message: "Short deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "delete short error" + error });
  }
};
