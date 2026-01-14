import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../components/VideoCard";
import { useSelector } from "react-redux";

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

function HistoryContent() {
  const { videoHistory, shortHistory } = useSelector((state) => state.user);
  const [duration, setDuration] = useState("");
  const [videos, setVideos] = useState("");

  useEffect(() => {
    if (Array.isArray(videos) && videos.length > 0) {
      videos.forEach((v) => {
        const video = v.contentid;
        getVideoduration(video.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [video._id]: formatedTime }));
        });
      });
    }
  }, [videos]);

  useEffect(() => {
    const videoss = videoHistory?.filter((video) => video.contentid !== null);
    setVideos(videoss);
  }, [videoHistory]);

  return (
    <>
      {(!videos || videos?.length === 0) &&
        (!shortHistory || shortHistory?.length === 0) && (
          <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
            NO Content Found
          </div>
        )}

      <div className="px-6 py-4 min-h-screen mt-1 lg:mt-5">
        {shortHistory?.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
              <SiYoutubeshorts className="w-7 h-7 text-orange-600" />
              Short
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {shortHistory
                ?.filter((short) => short.contentid !== null)
                .map((s) => {
                  const short = s?.contentid;
                  return (
                    <div key={s._id} className="shrink-0">
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
        {videos?.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
              <GoVideo className="w-7 h-7 text-orange-600" /> Videos
            </h2>
            <div className="flex flex-wrap gap-6 md:justify-start justify-center">
              {videos?.map((v) => {
                const video = v.contentid;
                return (
                  <div key={v._id} className="shrink-0">
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

export default HistoryContent;
