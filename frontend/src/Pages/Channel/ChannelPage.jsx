import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import VideoCard from "../../components/VideoCard";
import ShortCard from "../../components/ShortCard";
import PlaylistCard from "../../components/PlaylistCard";
import PostCard from "../../components/PostCard";

function ChannelPage() {
  const { channelId } = useParams();
  const { allChannelData, userData } = useSelector((state) => state.user);
  const channeData = allChannelData?.find((c) => c._id === channelId);
  const [channel, setchanneldata] = useState(channeData);
  const isSubscribed = channel?.subscribers?.some(
    (sub) => sub._id === userData?._id || sub === userData._id
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");
  const [duration, setDuration] = useState("");

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

  useEffect(() => {
    if (Array.isArray(channel?.videos) && channel?.videos?.length > 0) {
      channel?.videos.forEach((videos) => {
        getVideoduration(videos.videourl, (formatedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formatedTime }));
        });
      });
    }
  }, []);
  const toggleSubscribe = async () => {
    if (!channel._id) return;
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        { channelId: channel._id },
        { withCredentials: true }
      );

      // const updatedVideos = allVideosData.map((v) =>
      //   v.channel._id === video.channel._id
      //     ? {
      //         ...v,
      //         channel: { ...channel, subscribers: result.data.subscribers },
      //       }
      //     : v
      // );
      // dispatch(setAllVideosData(updatedVideos));
      setchanneldata((prev) => ({
        ...prev,
        subscribers: result.data.subscribers,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="text-white min-h-[calc(100vh-95px)] pt-2.5 ">
      {/* banner */}
      <div className="relative">
        <img
          src={channel?.banner}
          alt=""
          className="w-full md:h-60 h-30 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
      </div>

      {/* channelinfo */}

      <div className="relative flex items-center gap-6 p-5 rounded-xl bg-linear-to-r from-gray-900 via-black to-gray-900 shadow-xl flex-wrap">
        <div>
          <img
            src={channel?.avatar}
            alt=""
            className="rounded-full md:w-28 md:h-28  w-20 h-20 border-4 border-gray-800 shadow-lg hover:scale-105 hover:ring-4 hover:ring-orange-600 transition-transform duration-300"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-wide">
            {channel?.name}
          </h1>
          <p className="text-gray-400 mt-1">
            <span className="font-semibold text-white">
              {Number(channel?.subscribers?.length) >= 1_000_000
                ? Math.floor(Number(channel?.subscribers?.length) / 1_000_000) +
                  "M"
                : Number(channel?.subscribers?.length) >= 1_000
                ? Math.floor(Number(channel?.subscribers?.length) / 1_000) + "k"
                : Number(channel?.subscribers?.length) || 0}{" "}
            </span>
            Subscribers
            <span className="font-semibold text-white">
              {" "}
              {channel?.videos?.length}{" "}
            </span>
            Videos
          </p>
          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
            {channel?.category}
          </p>
        </div>
        <button
          className={`px-5 py-2 rounded-4xl border border-gray-600 ml-5 text-md ${
            isSubscribed
              ? "bg-black text-white hover:bg-orange-600 hover:text-black"
              : "bg-white text-black hover:bg-orange-600 hover:text-black"
          } `}
          onClick={toggleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={24} color="gray" />
          ) : isSubscribed ? (
            "Unsubscribe"
          ) : (
            "Subscribe"
          )}
        </button>
      </div>

      {/* tabs */}

      <div className="flex gap-8 px-6 border-b border-gray-800 mb-6 relative overflow-x-auto">
        {["Videos", "Shorts", "Playlists", "CommunityPosts"].map((tab) => {
          return (
            <button
              onClick={() => setActiveTab(tab)}
              key={tab}
              className={`py-1.5 relative font-medium transition ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
      {activeTab === "Videos" && (
        <div className="flex flex-wrap gap-4 pb-10">
          {channel?.videos?.map((v) => {
            return (
              <VideoCard
                key={v._id}
                id={v._id}
                thumbnail={v.thumbnail}
                duration={duration[v?._id] || "0.00"}
                channellogo={channel.avatar}
                title={v.title}
                channelName={channel.name}
                views={v.views}
              />
            );
          })}
        </div>
      )}
      {activeTab === "Shorts" && (
        <div className="flex flex-wrap gap-1 pb-10">
          {channel?.shorts?.map((s) => {
            return (
              <ShortCard
                key={s._id}
                id={s._id}
                title={s.title}
                channelName={channel.name}
                views={s.views}
                avatar={channel.avatar}
                shortUrl={s.shorturl}
              />
            );
          })}
        </div>
      )}
      {activeTab === "Playlists" && (
        <div className="flex flex-wrap gap-1 pb-10">
          {channel?.playlists
            ?.filter((pl) => pl.videos.length !== 0)
            .map((p) => {
              return (
                <PlaylistCard
                  key={p._id}
                  id={p._id}
                  title={p.title}
                  saveby={p.saveby}
                  videos={p.videos}
                />
              );
            })}
        </div>
      )}
      {activeTab === "CommunityPosts" && (
        <div className="flex flex-wrap gap-1 pb-10 md:flex-col">
          {channel?.communityposts?.map((p) => {
            return <PostCard key={p._id} post={p} />;
          })}
        </div>
      )}
    </div>
  );
}

export default ChannelPage;
