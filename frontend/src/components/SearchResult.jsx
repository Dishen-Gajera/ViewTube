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

function SearchResult({ SearchResults }) {
  const [duration, setDuration] = useState("");
  useEffect(() => {
    if (
      Array.isArray(SearchResults?.videos) &&
      SearchResults?.videos.length > 0
    ) {
      SearchResults?.videos.forEach((videos) => {
        getVideoduration(videos.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formatedTime }));
        });
      });
    }
  }, [SearchResults?.videos]);

  const isEmpty =
    (!SearchResults?.videos || SearchResults?.videos.length === 0) &&
    (!SearchResults?.shorts || SearchResults?.shorts.length === 0) &&
    (!SearchResults?.channels || SearchResults?.channels.length === 0) &&
    (!SearchResults?.playlists || SearchResults?.playlists.length === 0);
  return (
    <div className="px-6 py-4 bg-[#00000051] border border-gray-800 mb-5">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>

      {isEmpty ? (
        <p className="text-gray-400 text-lg">No results found</p>
      ) : (
        <>
          {SearchResults?.channels?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Channels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {SearchResults.channels.map((ch) => {
                  return (
                    <ChannelCard
                      key={ch._id}
                      id={ch._id}
                      name={ch.name}
                      avatar={ch.avatar}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {SearchResults?.videos?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <div className="flex flex-wrap  md:justify-start gap-6 mb-12 items-center justify-center">
                {SearchResults?.videos?.map((video) => {
                  return (

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

                  );
                })}
              </div>
            </div>
          )}
          {SearchResults?.shorts?.length > 0 && (
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
          {SearchResults?.playlists?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Playlists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {SearchResults?.playlists?.map((pl) => {
                  return (
                    <PlaylistCard
                      id={pl._id}
                      title={pl.title}
                      videos={pl.videos}
                      key={pl._id}
                      saveby={pl.saveby}
                    />
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

export default SearchResult;
