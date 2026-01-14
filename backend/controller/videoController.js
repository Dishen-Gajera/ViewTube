import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";

export const createVideo = async (req, res) => {
  try {
    const { channelId, title, description, tags } = req.body;

    if (!channelId || !title || !req.files?.video || !req.files?.thumbnail) {
      return res.status(400).json({
        message: "channelId title video or thumbanail must be require",
      });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(400).json({ message: "Your channel not found" });
    }

    const videourl = await uploadOnCloudinary(req.files.video[0].path);
    const thumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);

    let parsedtag = [];
    if (tags) {
      try {
        parsedtag = await JSON.parse(tags);
      } catch (error) {
        parsedtag = [];
      }
    }

    const video = await Video.create({
      channel: channel._id,
      title,
      description,
      tags: parsedtag,
      videourl,
      thumbnail,
    });
    channel.videos.push(video._id);
    await channel.save();
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: "create video error" + error });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("channel")
      .populate({ path: "comments.author", select: "username photourl email" })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email",
      });
    if (!videos) {
      return res.status(400).json({ message: "Videos are not found" });
    }
    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: "get all videos error" + error });
  }
};
export const toggleVideoLikes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;
    if (!videoId) {
      return res.status(400).json({ message: "videoId is required" });
    }

    const video = await Video.findById(videoId).select("likes");
    const isLiked = video.likes.includes(userId);

    let updatedVideo;
    if (isLiked) {
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
    } else {
      await Video.findByIdAndUpdate(videoId, { $pull: { dislikes: userId } });
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $addToSet: { likes: userId },
        },
        { new: true }
      );
    }

    return res.status(200).json(updatedVideo);
  } catch (error) {
    return res.status(500).json({ message: "toggle like error" + error });
  }
};

export const toggleVideoDisLikes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;
    if (!videoId) {
      return res.status(400).json({ message: "VideoId is required" });
    }

    const video = await Video.findById(videoId).select("dislikes");
    const isDisliked = video.dislikes.includes(userId);
    let updatedVideo;
    if (isDisliked) {
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { dislikes: userId } },
        { new: true }
      )
        .select("likes")
        .select("dislikes");
    } else {
      await Video.findByIdAndUpdate(videoId, { $pull: { likes: userId } });

      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $addToSet: { dislikes: userId },
        },
        { new: true }
      )
        .select("likes")
        .select("dislikes");
    }
    return res.status(200).json(updatedVideo);
  } catch (error) {
    return res.status(500).json({ message: "toggledislike error" + error });
  }
};

export const toggleVideoSave = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;
    if (!videoId) {
      return res.status(400).json({ message: "videoid is required" });
    }
    const video = await Video.findById(videoId).select("saveby");
    const isSave = video.saveby.includes(userId);
    let updatedVideo;
    if (isSave) {
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { saveby: userId } },
        { new: true }
      ).select("saveby");
    } else {
      updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $addToSet: { saveby: userId } },
        { new: true }
      ).select("saveby");
    }
    return res.status(200).json(updatedVideo);
  } catch (error) {
    return res.status(500).json({ message: "toogle video" });
  }
};

export const getViews = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: "videoid is required" });
    }
    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    );

    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: "get views error" + error });
  }
};

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { message } = req.body;
    const userId = req.userId;
    if (!videoId) {
      return res.status(400).json({ message: "videoId is required" });
    }
    const newComment = await Video.findByIdAndUpdate(
      videoId,
      { $push: { comments: { author: userId, message } } },
      { new: true }
    )
      .select("comments")
      .populate({
        path: "comments.author",
        select: "username photourl email ",
      })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email",
      });
    return res.status(200).json(newComment);
  } catch (error) {
    return res.status(500).json({ message: "add comment error" + error });
  }
};

export const addReply = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;
    if (!videoId || !commentId) {
      return res
        .status(400)
        .json({ message: "videoId or commentId is required" });
    }
    const comment = await Video.findById(videoId).select("comments");
    const targetedComment = comment.comments.id(commentId);
    targetedComment.replies.push({ author: userId, message });
    await comment.save();

    const updatedComments = await Video.findById(videoId)
      .select("comments")
      .populate({ path: "comments.author", select: "username photourl email" })
      .populate({
        path: "comments.replies.author",
        select: "username photourl email",
      });
    res.status(200).json(updatedComments);
  } catch (error) {
    return res.status(500).json({ message: "add reply error" + error });
  }
};

export const getLikedVideos = async (req, res) => {
  try {
    const userId = req.userId;
    const likededVideos = await Video.find({ likes: userId })
      .populate("channel", "name avatar")
      .populate("likes", "username");
    if (!likededVideos) {
      return res.status(400).json({ message: "Liked video not found" });
    }
    res.status(200).json(likededVideos);
  } catch (error) {
    return res.status(500).json({ message: "getLIked error" + error });
  }
};

export const getSavedVideos = async (req, res) => {
  try {
    const userId = req.userId;
    const savedVideos = await Video.find({ saveby: userId })
      .populate("channel", "name avatar")
      .populate("saveby", "username");
    if (!savedVideos) {
      return res.status(400).json({ message: "saved videos not found" });
    }
    return res.status(200).json(savedVideos);
  } catch (error) {
    return res.status(500).json({ message: "get saved videos  error" + error });
  }
};

export const fetchVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ meaage: "videoId is required" });
    }
    const video = await Video.findById(videoId)
      .populate("channel", "name avatar")
      .populate("likes", "username photourl");

    if (!video) {
      return res.status(400).json({ message: "video is not found" });
    }
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: "fetch video  error" + error });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, tags } = req.body;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    if (title) video.title = title;
    if (description) video.description = description;
    if (tags) {
      try {
        video.tags = JSON.parse(tags);
      } catch (error) {
        video.tags = [];
      }
    }
    if (req.file) {
      const uploadThumbnail = await uploadOnCloudinary(req.file.path);
      video.thumbnail = uploadThumbnail;
    }
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: "update video  error" + error });
  }
};

export const deleteVideo = async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId).select("channel");

    if (!video) {
      return res.status(400).json({ message: "video not found" });
    }
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    await Video.findByIdAndDelete(videoId);
    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "delete video error" + error });
  }
};
