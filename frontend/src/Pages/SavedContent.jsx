import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../components/VideoCard";

const getVideoduration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;
  video.onloadedmetadata = () => {
    const totalSecond = Math.floor(video.duration);
    const minute = Math.floor(totalSecond / 60);
    const second = totalSecond % 60;
    callback(`${minute}:${second.toString().padStart(2, "0")}`);
  };
  video.onerror = () => {
    callback("0.00");
  };
};

function SavedContent() {
  const [savedVideos, setSavedVideos] = useState([]);
  const [savedShorts, setSavedShorts] = useState([]);
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/content/getsavedvideos`,
          { withCredentials: true }
        );
        setSavedVideos(result.data);
        const result1 = await axios.get(
          `${serverUrl}/api/content/getsavedshorts`,
          { withCredentials: true }
        );
        setSavedShorts(result1.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSavedContent();
  }, []);

  useEffect(() => {
    if (Array.isArray(savedVideos) && savedVideos.length > 0) {
      savedVideos.forEach((videos) => {
        getVideoduration(videos.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formatedTime }));
        });
      });
    }
  }, [savedVideos]);

  return (
    <>
      {(!savedVideos || savedVideos.length == 0) &&
        (!savedShorts || savedShorts.length == 0) && (
          <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
            No Saved Content Found
          </div>
        )}

      <div className="px-6 py-4 min-h-screen mt-1 lg:mt-5">
        {savedShorts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
              <SiYoutubeshorts className="w-7 h-7 text-orange-600" /> Saved
              Shorts
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {savedShorts?.map((short) => {
                return (
                  <div key={short._id} className="shrink-0">
                    <ShortCard
                      avatar={short.channel.avatar}
                      channelName={short.channel.name}
                      id={short._id}
                      views={short.views}
                      shortUrl={short.shorturl}
                      title={short.title}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
        {savedVideos.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
              <GoVideo className="w-7 h-7 text-orange-600" /> Saved Videos
            </h2>
            <div className="flex flex-wrap gap-6  md:justify-start justify-center">
              {savedVideos?.map((video) => {
                return (
                  <div key={video._id} className="shrink-0">
                    <VideoCard
                      channelName={video.channel.name}
                      channellogo={video.channel.avatar}
                      id={video._id}
                      thumbnail={video.thumbnail}
                      title={video.title}
                      views={video.views}
                      key={video._id}
                      duration={duration[video._id]}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SavedContent;
