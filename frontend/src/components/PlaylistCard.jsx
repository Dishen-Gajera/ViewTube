import React, { useState } from "react";
import { FaListUl, FaTimes, FaBookmark } from "react-icons/fa";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

function PlaylistCard({ id, title, videos, saveby }) {
  const thumbnail = videos[0]?.thumbnail;
  const [showVideos, setShowVideos] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [isSaved, setIsSaved] = useState(saveby?.includes(userData?._id));
  const handelSave = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/playlist-save/${id}`,
        {},
        { withCredentials: true }
      );
      const updateSave = result.data.saveby.includes(userData._id);
      setIsSaved(updateSave);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="relative w-60 h-40 rounded-xl overflow-hidden group shadow-lg bg-gray-900">
        <img
          src={thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-2">
          <h3 className="font-semibold text-white truncate">{title}</h3>
          <p>{videos.length} Videos</p>
          <button
            className={`absolute top-2 right-2 p-2 rounded-full transition border border-gray-70 ${
              isSaved
                ? "bg-white text-black hover:bg-gray-300"
                : "bg-black/70 text-white hover:bg-black"
            }`}
            onClick={handelSave}
          >
            <FaBookmark size={16} />
          </button>
          <button
            className="absolute bottom-2 right-2 bg-black/70 p-2 rounded-full text-white hover:bg-black transition"
            onClick={(e) => setShowVideos(true)}
          >
            <FaListUl size={16} />
          </button>
        </div>
      </div>
      {showVideos && (
        <div className="fixed inset-0 bg-[#00000032] flex justify-center z-50 backdrop-blur-sm">
          <div className="bg-linear-to-br from-gray-900 via-black to-gray-900 rounded-2xl w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 max-h-[85vh] overflow-y-auto shodow-2xl p-6 relative border border-gray-700">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setShowVideos(false)}
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl font-extrabold mb-3 text-white flex items-center gap-2">
              {title}
              <span className="text-gray-400 font-normal">- videos</span>
            </h2>
            <div className="h-0.5 bg-orange-600 mb-6 rounded-full"></div>
            <div className="flex items-center justify-around gap-5 flex-wrap">
              {videos?.map((v) => {
                return (
                  <VideoCard
                    key={v._id}
                    id={v._id}
                    thumbnail={v.thumbnail}
                    channellogo={v.channel.avatar}
                    title={v.title}
                    channelName={v.channel.name}
                    views={v.views}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaylistCard;
