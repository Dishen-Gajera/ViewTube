import React from "react";
import { useNavigate } from "react-router-dom";

function ShortCard({ shortUrl, title, channelName, avatar, views, id }) {
  const navigate = useNavigate();
  return (
    <div
      className="w-41 sm:w-48 cursor-pointer"
      onClick={()=>navigate("/playShort/" + id)}
    >
      <div className="rounded-xl overflow-hidden bg-black w-full h-60 ">
        <video
          src={shortUrl}
          className="w-full h-full object-cover"
          muted
          playsInline
          onContextMenu={(e) => e.preventDefault()}
          preload="metadata"
        />
      </div>
      <div className="space-y-1 w-full p-3 bg-transparent rounded-xl">
        <h3 className="text-sm font-semibold text-white line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center justify-start gap-1">
          <img
            src={avatar}
            alt=""
            className="w-4 h-4 object-cover rounded-full"
          />
          <p className="text-xs text-gray-400 line-clamp-2">{channelName}</p>
        </div>
        <p className="text-xs text-gray-400">{Number(views)>=1_000_000?Math.floor(Number(views)/1_000_000) + "M":Number(views)>=1_000?Math.floor(Number(views)/1_000)+"k":Number(views) || 0} views</p>
      </div>
    </div>
  );
}

export default ShortCard;
