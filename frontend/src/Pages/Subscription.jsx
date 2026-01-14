import React from "react";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import { useState } from "react";
import { useEffect } from "react";
import VideoCard from "../components/VideoCard";
import PlaylistCard from "../components/PlaylistCard";
import { FaList } from "react-icons/fa";
import PostCard from "../components/PostCard";
import {RiUserCommunityFill} from 'react-icons/ri'

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

function Subscription() {
  const [duration, setDuration] = useState("");

  const navigate = useNavigate();
  const {
    subscribedChannels,
    subscribedVideos,
    subscribedShorts,
    subscribedPlaylists,
    subscribedPosts,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (Array.isArray(subscribedVideos) && subscribedVideos.length > 0) {
      subscribedVideos.forEach((videos) => {
        getVideoduration(videos.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formatedTime }));
        });
      });
    }
  }, [subscribedVideos]);
  return (
    <div className="px-6 py-4 min-h-screen">
      {!subscribedChannels && (
        <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
          No Subscribed Channel
        </div>
      )}

      {/* subscribed channel */}

      <div className="flex gap-6 overflow-x-auto pb-6 pt-[30px]">
        {subscribedChannels?.map((ch) => {
          return (
            <div
              key={ch._id}
              className="flex flex-col items-center shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => navigate("/channelpage/" + ch._id)}
            >
              <img
                src={ch.avatar}
                alt=""
                className="w-18 h-18 rounded-full border-2 border-gray-600 object-cover shadow-md"
              />
              <span className="mt-2 text-sm text-gray-300 font-medium text-center truncate w-20">
                {ch.name}
              </span>
            </div>
          );
        })}
      </div>
      {/* shorts section */}
      {subscribedShorts?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-orange-600" /> Subscribed
            Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {subscribedShorts?.map((short) => {
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
      {subscribedVideos?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="w-7 h-7 text-orange-600" /> Subscribed Videos
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {subscribedVideos?.map((video) => {
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
      {subscribedPlaylists?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2 mt-9">
            <FaList className="w-7 h-7 text-orange-600" /> Subscribed PlayList
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {subscribedPlaylists?.map((pl) => {
              return (
                <PlaylistCard
                  id={pl._id}
                  saveby={pl.saveby}
                  title={pl.title}
                  videos={pl.videos}
                  key={pl._key}
                />
              );
            })}
          </div>
        </>
      )}
      {subscribedPosts?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2 mt-9">
            <RiUserCommunityFill className="w-7 h-7 text-orange-600" /> Subscribed Posts
          </h2>
          <div className="flex flex-wrap gap-1 pb-10">
          {subscribedPosts?.map((p) => {
            return (
              <PostCard
                key={p._id}
                post={p}
              />
            );
          })}
          
        </div>
        </>
      )}
     
    </div>
  );
}

export default Subscription;
