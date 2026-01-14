import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";

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
function RecommendedContent() {
  const { recommendedContent } = useSelector((state) => state.user);
  const [duration, setDuration] = useState("");

  const allVideos = [
    ...(recommendedContent?.recommendedVideos || []),
    ...(recommendedContent?.remainingVideos || []),
  ];

  const allShorts = [
    ...(recommendedContent?.recommendedShorts || []),
    ...(recommendedContent?.remainingShorts || []),
  ];

  useEffect(() => {
    if (Array.isArray(allVideos) && allVideos.length > 0) {
      allVideos.forEach((videos) => {
        getVideoduration(videos.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formatedTime }));
        });
      });
    }
  }, [allVideos]);

  if (!allVideos.length && !allShorts.length) {
    return null;
  }
  return (
    <div className="px-6 py-4 mb-5">
      {allVideos.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-6 mb-12">
            {allVideos?.map((video) => {
              return (
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
              );
            })}
          </div>
        </div>
      )}
      {allShorts?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-1">
            <SiYoutubeshorts className="w-6 h-6 text-orange-600" />
            Shorts
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {allShorts?.map((short) => {
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
        </div>
      )}
    </div>
  );
}

export default RecommendedContent;
