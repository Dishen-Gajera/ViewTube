import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";
import Playlist from "../model/playList.js";

export const createPlaylist = async (req, res) => {
  const { channelId, title, description, videoIds } = req.body;
  try {
    if (!videoIds || !channelId) {
      return res
        .status(400)
        .json({ message: "videoid and channelid is require" });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(400).json({ message: "channel is not found" });
    }
    const videos = await Video.find({
      _id: { $in: videoIds },
      channel: channelId,
    });
    if (videoIds.length !== videos.length) {
      return res.status(400).json({ message: "some videos is not found" });
    }

    const playlist = await Playlist.create({
      title,
      description,
      videos: videoIds,
      channel: channelId,
    });
    await Channel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id },
    });
    return res.status(200).json(playlist);
  } catch (error) {
    return res.status(500).json({ message: "create play list error" + error });
  }
};

export const toggleSavePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.userId;

  try {
    if (!playlistId) {
      return res.status(400).json({ message: "playlist id is required" });
    }

    const playlist = await Playlist.findById(playlistId).select("saveby");
    const issaved = playlist.saveby.includes(userId);
    let updatedPlayList;
    if (issaved) {
      updatedPlayList = await Playlist.findByIdAndUpdate(
        playlist,
        {
          $pull: { saveby: userId },
        },
        { new: true }
      ).select("saveby");
    } else {
      updatedPlayList = await Playlist.findByIdAndUpdate(
        playlist,
        {
          $addToSet: { saveby: userId },
        },
        { new: true }
      ).select("saveby");
    }
    return res.status(200).json(updatedPlayList);
  } catch (error) {
    return res.status(500).json({ message: "save playlist error" + error });
  }
};

export const getSavedPlaylists = async (req, res) => {
  try {
    const userId = req.userId;
    const savedPlaylists = await Playlist.find({ saveby: userId })
      .populate("videos")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "username avatar email" },
      });
    if (!savedPlaylists) {
      return res.status(400).json({ message: "No play list saved" });
    }
    return res.status(200).json(savedPlaylists);
  } catch (error) {
    return res.status(500).json({ message: "get save playlist error" + error });
  }
};

export const fetchPlayList = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId)
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    return res.status(200).json(playlist);
  } catch (error) {
    return res.status(500).json({ message: "fetch playlist error" + error });
  }
};

export const updatePlayList = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title, description, addVideos = [], removeVideos = [] } = req.body;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "playlist not found" });
    }

    if (title) playlist.title = title;
    if (description) playlist.description = description;

    playlist.videos.push(...addVideos);
    playlist.videos = [...new Set(playlist.videos.map((v) => v.toString()))];
    playlist.videos = playlist.videos.filter(
      (v) => !removeVideos.includes(v.toString())
    );
    await playlist.save();
    return res.status(200).json(playlist);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "update playlist error" + error });
  }
};

export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = await Playlist.findById(playlistId).select("channel");

    if (!playlist) {
      return res.status(400).json({ message: "playlist not found" });
    }
    await Channel.findByIdAndUpdate(playlist.channel, {
      $pull: { playlists: playlist._id },
    });

    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    
    return res.status(500).json({ message: "delete Playlist error" + error });
  }
};
