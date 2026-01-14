import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import User from "../model/userModel.js";
import Video from "../model/videoModel.js";
import Short from "../model/shortModel.js";
import { title } from "process";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "get current user error" + error });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;
    const existingUserChannel = await Channel.findOne({ owner: userId });
    if (existingUserChannel) {
      return res.status(400).json({ message: "user already have a channel" });
    }
    const existChannelName = await Channel.findOne({ name });
    if (existChannelName) {
      return res.status(400).json({
        message: "Channel name already exist please chose another name",
      });
    }
    let avatar;
    let banner;

    if (req.files?.avatar) {
      avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    }
    if (req.files?.banner) {
      banner = await uploadOnCloudinary(req.files.banner[0].path);
    }

    const channel = await Channel.create({
      owner: userId,
      name,
      description,
      category,
      avatar,
      banner,
    });

    const user = await User.findByIdAndUpdate(userId, {
      username: name,
      photourl: avatar,
      channel: channel._id,
    });

    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: "createchannel error" + error });
  }
};

export const getChannel = async (req, res) => {
  try {
    const userId = req.userId;
    const channel = await Channel.findOne({ owner: userId })
      .populate("owner")
      .populate("videos")
      .populate("shorts communityposts")
      .populate({path:"playlists",populate:{path:"videos"}})
    if (!channel) {
      return res.status(400).json({ message: "channel does not exist" });
    }

    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: "get channel error" + error });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;
    let channel = await Channel.findOne({ owner: userId }).populate("owner");

    if (!channel) {
      return res.status(404).json({ message: "channel not exist" });
    }
    if (name && name !== channel.name) {
      const existChannel = await Channel.findOne({ name });
      if (existChannel) {
        return res.status(400).json({
          message:
            "channel name already exist please chose another channel name",
        });
      }
      channel.name = name;
    }

    if (description) {
      channel.description = description;
    }
    if (category) {
      channel.category = category;
    }

    if (req.files?.avatar) {
      const avataru = await uploadOnCloudinary(req.files.avatar[0].path);
      channel.avatar = avataru;
    }
    if (req.files?.banner) {
      const banneru = await uploadOnCloudinary(req.files.banner[0].path);
      channel.banner = banneru;
    }

    await User.findByIdAndUpdate(
      userId,
      {
        username: name,
        photourl: channel.avatar || null,
      },
      { new: true }
    );
    console.log(channel);

    await channel.save();
    console.log(channel);

    channel = await channel.populate("owner");
    console.log(channel);

    return res.status(200).json(channel);
  } catch (error) {
    console.error("updateChannel error:", error);
    return res.status(500).json({ message: "update channel error" + error });
  }
};

export const toggleSubscribe = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId;
    if (!channelId) {
      return res.status(400).json({ message: "ChannelId is required" });
    }
    const channel = await Channel.findById(channelId).select("subscribers");

    const isSubscribed = channel.subscribers.includes(userId);
    let updatedSubscribers;
    if (isSubscribed) {
      updatedSubscribers = await Channel.findByIdAndUpdate(
        channel._id,
        {
          $pull: { subscribers: userId },
        },
        { new: true }
      ).select("subscribers");
    } else {
      updatedSubscribers = await Channel.findByIdAndUpdate(
        channel._id,
        {
          $addToSet: { subscribers: userId },
        },
        { new: true }
      ).select("subscribers");
    }

    return res.status(200).json(updatedSubscribers);
  } catch (error) {
    return res.status(500).json({ message: "toogle subscribe error" + error });
  }
};

export const getAllChannelData = async (req, res) => {
  try {
    const channels = await Channel.find()
      .select("-password")
      .populate("videos shorts subscribers")
      .populate({
        path: "communityposts",
        populate: {
          path: "channel comments.author comments.replies.author",
          select: "username photourl email",
        },
      })
      .populate({
        path: "playlists",
        populate: { path: "videos", populate: { path: "channel" } },
      });
    if (!channels) {
      return res.status(400).json({ message: "No channel Data Found" });
    }
    return res.status(200).json(channels);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "get allChannelData error" + error });
  }
};

export const getSubscribedData = async (req, res) => {
  try {
    const userId = req.userId;
    const subscribedChannels = await Channel.find({
      subscribers: userId,
    })
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      })
      .populate({
        path: "shorts",
        populate: { path: "channel", select: "name avatar" },
      })
      .populate({
        path: "playlists",
        populate: { path: "channel", select: "name avatar" },
        populate: {
          path: "videos",
          populate: { path: "channel", select: "name  avatar email" },
        },
      })
      .populate({
        path: "communityposts",
        populate: [
          { path: "channel", select: "name avatar" },
          {
            path: "comments.author",
            select: "username photourl email",
          },
          {
            path: "comments.replies.author",
            select: "username email photourl",
          },
        ],
      });

    if (!subscribedChannels) {
      return res.status(400).json({ message: "No Channel subscribed" });
    }

    const videos = subscribedChannels.flatMap((ch) => ch.videos);
    const shorts = subscribedChannels.flatMap((ch) => ch.shorts);
    const playlists = subscribedChannels.flatMap((ch) => ch.playlists);
    const posts = subscribedChannels.flatMap((ch) => ch.communityposts);

    return res.status(200).json({
      subscribedChannels,
      videos,
      shorts,
      playlists,
      posts,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "get subscribed channel error" + error });
  }
};

export const addHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { contentid, contenttype } = req.body;

    if (!["Video", "Short"].includes(contenttype)) {
      return res.status(400).json({ message: "Inv" });
    }
    let content;
    if (contenttype === "Video") {
      content = await Video.findById(contentid);
    } else {
      content = await Short.findById(contentid);
    }
    if (!content) {
      return res.status(400).json(`${contenttype} not found`);
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { history: { contentid, contenttype } },
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        history: { contentid, contenttype, watchedAt: new Date() },
      },
    });
    res.status(200).json({ message: "Added to history" });
  } catch (error) {
    return res.status(500).json({ message: "Add history error" + error });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .populate({
        path: "history.contentid",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      })
      .select("history");
    if (!user) {
      return res.status(400).json("User Not found");
    }

    const sortedHistory = [...user.history].sort(
      (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
    );
    return res.status(200).json(sortedHistory);
  } catch (error) {
    return res.status(500).json({ message: "get history error" + error });
  }
};

export const getRecommededContet = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId)
      .populate("history.contentid")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const historyKeywords = user.history?.map((h) => h.contentid?.title || "");
    const likedVideos = await Video.find({ likes: userId });
    const likedShorts = await Short.find({ likes: userId });
    const savedVideos = await Video.find({ saveby: userId });
    const savedShorts = await Short.find({ saveby: userId });

    const likedSavedkeywords = [
      ...likedVideos.map((v) => v.title),
      ...likedShorts.map((s) => s.title),
      ...savedVideos.map((v) => v.title),
      ...savedShorts.map((s) => s.title),
    ];
    const allKeywords = [...(historyKeywords || []), ...likedSavedkeywords]
      .filter(Boolean)
      .map((k) => k.split(" "))
      .flat();

    const videoCondition = [];
    const shortCondition = [];

    allKeywords.forEach((kw) => {
      videoCondition.push(
        { title: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } }
      );
      shortCondition.push(
        { title: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } }
      );
    });

    const recommendedVideos = await Video.find({
      $or: videoCondition,
    }).populate("channel", "name avatar");
    const recommendedShorts = await Short.find({
      $or: shortCondition,
    }).populate("channel", "name avatar");
    const recommandedVideoIds = recommendedVideos.map((v) => v._id);
    const recommandedShortIds = recommendedShorts.map((s) => s._id);

    const remainingVideos = await Video.find({
      _id: { $nin: recommandedVideoIds },
    })
      .sort({ createdAt: -1 })
      .populate("channel", "avatar name");
    const remainingShorts = await Short.find({
      _id: { $nin: recommandedShortIds },
    })
      .sort({ createdAt: -1 })
      .populate("channel", "avatar name");

    return res.status(200).json({
      recommendedVideos,
      recommendedShorts,
      remainingVideos,
      remainingShorts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "get recommandded error" + error });
  }
};
