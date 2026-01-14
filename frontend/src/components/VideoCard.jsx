import React from "react";
import { useNavigate } from "react-router-dom";

function VideoCard({
  thumbnail,
  duration,
  channellogo,
  title,
  channelName,
  views,
  id,
}) {
  const navigate = useNavigate();
  return (
    <div
      className="w-[360px] cursor-pointer"
      onClick={() => navigate("/playvideo/" + id)}
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="rounded-xl w-full h-[200px] border border-gray-800 object-cover"
        />
        <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-4 rounded font-semibold">
          {duration}
        </span>
      </div>
      <div className="flex mt-3 items-center">
        <img src={channellogo} alt="" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{channelName}</p>
          <p className="text-xs text-gray-400">{Number(views)>=1_000_000?Math.floor(Number(views)/1_000_000) + "M":Number(views)>=1_000?Math.floor(Number(views)/1_000)+"k":Number(views) || 0} views</p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
