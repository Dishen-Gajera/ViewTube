import React from "react";
import ChannelCard from "./ChannelCard";
import ShortCard from "./ShortCard";
import PlaylistCard from "./PlaylistCard";
import VideoCard from "./VideoCard";
import { useState } from "react";
import { useEffect } from "react";
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

function FilterResult({ filterResults }) {
  const [duration, setDuration] = useState("");
  useEffect(() => {
    if (
      Array.isArray(filterResults?.videos) &&
      filterResults?.videos.length > 0
    ) {
      filterResults?.videos.forEach((videos) => {
        getVideoduration(videos.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formatedTime }));
        });
      });
    }
  }, [filterResults?.videos]);

  const isEmpty =
    (!filterResults?.videos || filterResults?.videos.length === 0) &&
    (!filterResults?.shorts || filterResults?.shorts.length === 0);
  return (
    <div className="px-6 py-4 bg-[#00000051] border border-gray-800 mb-5">
      <h2 className="text-2xl font-bold mb-4">Filter Results</h2>

      {isEmpty ? (
        <p className="text-gray-400 text-lg">No results found</p>
      ) : (
        <>
         
          {filterResults?.videos?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <div className="flex flex-wrap gap-6  md:justify-start justify-center">
                {filterResults?.videos?.map((video) => {
                  return (
                    <div key={video._id}>
                      <VideoCard
                        channelName={video.channel.name}
                        channellogo={video.channel.avatar}
                        id={video._id}
                        thumbnail={video.thumbnail}
                        title={video.title}
                        views={video.views}
                        key={video._id}
                        duration={duration[video._id] || "0:00"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {filterResults?.shorts?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {SearchResults?.shorts?.map((short) => {
                  return (
                    <div key={short._id} className="shrink-0">
                      <ShortCard
                        shortUrl={short?.shorturl}
                        title={short?.title}
                        avatar={short?.channel?.avatar}
                        channelName={short?.channel?.name}
                        views={short?.views}
                        id={short?._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
        </>
      )}
    </div>
  );
}

export default FilterResult;
