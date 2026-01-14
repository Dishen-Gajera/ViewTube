import React from "react";
import { FaComment, FaEye, FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { channelData } = useSelector((state) => state.user);
  const totalVideosViews = (channelData?.videos || []).reduce(
    (acc, vid) => acc + (vid?.views || 0),
    0
  );
  const totalShortsViews = (channelData?.shorts || []).reduce(
    (acc, short) => acc + (short?.views || 0),
    0
  );
  const totalViews = totalShortsViews + totalVideosViews;
  const navigate = useNavigate();
  return (
    <div className="w-full text-white min-h-screen p-4 sm:p-6 space-y-6 mb-[50px]">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        <img
          src={channelData?.avatar}
          alt=""
          className="w-16 h-16 rounded-full object-cover border border-gray-700"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold">{channelData?.name}</h2>
          <p className="text-sm text-gray-400">
            {Number(channelData?.subscribers?.length) >= 1_000_000
              ? Math.floor(
                  Number(channelData?.subscribers?.length) / 1_000_000
                ) + "M"
              : Number(channelData?.subscribers?.length) >= 1_000
              ? Math.floor(Number(channelData?.subscribers?.length) / 1_000) +
                "k"
              : Number(channelData?.subscribers?.length) || 0}{" "}
            Total Subscribers
          </p>
        </div>
      </div>
      <div>
        <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
          Channel Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <AnalyticsCard
            label={"Views"}
            value={
              Number(totalViews) >= 1_000_000
                ? Math.floor(Number(totalViews) / 1_000_000) + "M"
                : Number(totalViews) >= 1_000
                ? Math.floor(Number(totalViews) / 1_000) + "k"
                : Number(totalViews) || 0
            }
            onClick={() => navigate("/vtstudio/analytics")}
          />
          <AnalyticsCard
            label={"Subscribers"}
            value={`
          +  ${
            Number(channelData?.subscribers?.length) >= 1_000_000
              ? Math.floor(
                  Number(channelData?.subscribers?.length) / 1_000_000
                ) + "M"
              : Number(channelData?.subscribers?.length) >= 1_000
              ? Math.floor(Number(channelData?.subscribers?.length) / 1_000) +
                "k"
              : Number(channelData?.subscribers?.length) || 0
          }
            `}
          />
        </div>
      </div>
      <div className="grid grid-col-1 md:grid-cols-2 gap-6">
        <div>
          {channelData?.videos?.length > 0 && (
            <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
              Latest Videos
            </h3>
          )}
          <div className="space-y-4">
            {channelData?.videos
              ?.slice()
              .reverse()
              .slice(0, 5)
              .map((video, idx) => {
                return (
                  <ContentCard
                    key={idx}
                    content={video}
                    onClick={() => navigate("/playvideo/" + video._id)}
                  />
                );
              })}
          </div>
        </div>
        <div>
          {channelData?.shorts?.length > 0 && (
            <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
              Latest Shorts
            </h3>
          )}
          <div className="space-y-4">
            {channelData?.shorts
              ?.slice()
              .reverse()
              .slice(0, 5)
              .map((short, idx) => {
                return (
                  <ContentCard1
                    key={idx}
                    content={short}
                    onClick={() => navigate("/playshort/" + short._id)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ label, value, onClick }) {
  return (
    <div
      className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 shadow-lg transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-2">
        {label}
      </div>
      <h4 className="text-lg sm:text-xl text-start font-bold">{value}</h4>
    </div>
  );
}

function ContentCard({ content, onClick }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition"
      onClick={onClick}
    >
      {/* thumbnail */}
      <img
        src={content.thumbnail}
        alt="thumbnail"
        className="w-full sm:w-40 h-48 sm:h-24"
      />

      {/* content info */}

      <div className="flex-1">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <h4 className="font-semibold text-sm sm:text-base line-clamp-2">
            {content?.title}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Publish {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/*  stats */}

        <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm">
          <span className="flex items-center gap-1">
            <FaEye />{" "}
            {Number(content?.views) >= 1_000_000
              ? Math.floor(Number(content?.views) / 1_000_000) + "M"
              : Number(content?.views) >= 1_000
              ? Math.floor(Number(content?.views) / 1_000) + "k"
              : Number(content?.views) || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp />
            {content?.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment />
            {content.comments.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContentCard1({ content, onClick }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition"
      onClick={onClick}
    >
      <video
        className="w-20 h-24 object-cover"
        src={content.shorturl}
        muted
        playsInline
        preload="metadata"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* content info */}

      <div className="flex-1">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <h4 className="font-semibold text-sm sm:text-base line-clamp-2">
            {content.title}
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Publish {new Date(content.createdAt).toLocaleDateString()}
          </p>
        </div>
        {/*  stats */}

        <div className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm">
          <span className="flex items-center gap-1">
            <FaEye />{" "}
            {Number(content?.views) >= 1_000_000
              ? Math.floor(Number(content?.views) / 1_000_000) + "M"
              : Number(content?.views) >= 1_000
              ? Math.floor(Number(content?.views) / 1_000) + "k"
              : Number(content?.views) || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaThumbsUp />
            {content?.likes?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FaComment />
            {content.comments.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
