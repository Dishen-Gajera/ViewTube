import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";

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

function AllVideosPage() {
  const [duration, setDuration] = useState("");
  const { allVideosData } = useSelector((state) => state.content);

  useEffect(() => {
    if (Array.isArray(allVideosData) && allVideosData.length > 0) {
      allVideosData.forEach((videos) => {
        getVideoduration(videos.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formatedTime }));
        });
      });
    }
  }, [allVideosData]);
  return (
    <div className=" flex flex-wrap  md:justify-start gap-6 mb-12 items-center justify-center">
      {allVideosData?.map((video) => {
        return (
          <VideoCard
            key={video._id}
            thumbnail={video.thumbnail}
            title={video.title}
            channellogo={video?.channel?.avatar}
            channelName={video?.channel?.name}
            duration={duration[video?._id] || "0.00"}
            id={video?._id}
            views={video?.views}
          />
        );
      })}
    </div>
  );
}

export default AllVideosPage;
