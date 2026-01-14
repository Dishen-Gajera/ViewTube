import { GoogleGenAI } from "@google/genai";
import Channel from "../model/channelModel.js";
import dotenv from "dotenv";
import Video from "../model/videoModel.js";
import Short from "../model/shortModel.js";
import Playlist from "../model/playList.js";
dotenv.config();

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMENI_API_KEY,
    });

    const prompt = `You are a search assistant for a video streaming platform.
        The user query is: "${input}"

        Your job:
        -If query has typos, correct them.
        -If query has multiple words, break them into meaningful keywords.
        -Return only the corrected words(s), comma-separated.
        -Do not explain, only return keyword(s)like "name,unsername"etc not other any thig that gives error
        `;
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (error) {}

    let keyword = (response?.text || input).trim().replace(/[\n\r]+/g, "");
    let searchWords;
    if (response) {
      searchWords = keyword
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean);
    } else {
      searchWords = keyword
        .split(" ")
        .map((w) => w.trim())
        .filter(Boolean);
    }

    console.log(searchWords);
    const buildRegexQuery = (fields) => {
      return {
        $or: searchWords.map((word) => ({
          $or: fields.map((field) => ({
            [field]: { $regex: word, $options: "i" },
          })),
        })),
      };
    };

    const matchedChannels = await Channel.find(
      buildRegexQuery(["name"])
    ).select("_id name avatar");

    const channelIds = matchedChannels.map((c) => c._id);

    const videos = await Video.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");

    const shorts = await Short.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel");
    const playlists = await Playlist.find({
      $or: [
        buildRegexQuery(["title", "description"]),
        { channel: { $in: channelIds } },
      ],
    }).populate({
      path: "videos",
      populate: { path: "channel", select: "name avatar" },
    });

    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to search" + error });
  }
};

export const filterCategoryWithAi = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "search query is required" });
    }
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMENI_API_KEY,
    });

    const categories = [
      "Music",
      "Gaming",
      "Movies",
      "TV Shows",
      "News",
      "Trending",
      "Entertainment",
      "Education",
      "Science & Tech",
      "Travel",
      "Fashion",
      "Cooking",
      "Sports",
      "Pets",
      "Art",
      "Comedy",
      "Vlogs",
    ];

    const prompt = `You are a category classifier for a video streaming platform.
        The user query is: "${input}"

        Your job:
        -Match this query with the most relevant categorories from this list ${categories.join(
          ","
        )}
        -If more than one category fits return them comma-separated.
        -If nothing fits,return the single closest category.
        -Do not explain.Do not retun json. Only return category names.
        
        Example:"arijit singh songs"->"Music"
        -"free fire gameplay"->"Gaming"
        -"Netflix web series"->"TV shows"
        -"india latest news"->"News"
        -"funny animal videos"->"Comedy, Pets"
        -"fitness tips"->"Education, Sports"
        `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const keywordText = response.text.trim();
    const keywords = keywordText.split(",").map((k) => k.trim());
    const videoCondition = [];
    const shortsCondition = [];
    const channelCondition = [];
    console.log(keywords);

    keywords.forEach((kw) => {
      videoCondition.push(
        { title: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } }
      );
      shortsCondition.push(
        { title: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } }
      );
      channelCondition.push(
        { name: { $regex: kw, $options: "i" } },
        { category: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } }
      );
    });
    const videos = await Video.find({ $or: videoCondition }).populate({
      path: "channel",
      select: "name avatar",
    });
    const shorts = await Short.find({ $or: shortsCondition })
      .populate("channel", "name avatar")
      .populate("likes", "username photourl");
    const channels = await Channel.find({ $or: channelCondition })
      .populate("owner", "username photourl")
      .populate("subscribers", "username photourl")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      })
      .populate({ path: "shorts", populate: "channel", select: "name avatar" });

    return res.status(200).json({ videos, shorts, channels, keywords });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to categories" + error });
  }
};
