import mongoose, { Schema } from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    saveby: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Playlist = mongoose.model("PlayList", PlaylistSchema);
export default Playlist;
