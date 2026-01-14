import React from "react";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector } from "react-redux";
import ShortCard from "./ShortCard";

function AllShortsPage() {
  const { allShortsData } = useSelector((state) => state.content);
  const latestShort = allShortsData?.slice(0, 10) || [];
  return (
    <div className="px-6 py-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-1">
        <SiYoutubeshorts className="w-6 h-6 text-orange-600" />
        Shorts
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {latestShort?.map((short) => {
          return (
            <div className="shrink-0 " key={short?._id}>
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
  );
}

export default AllShortsPage;
