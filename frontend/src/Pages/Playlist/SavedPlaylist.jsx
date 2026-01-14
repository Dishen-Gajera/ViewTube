import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../App";
import { FaList } from "react-icons/fa";
import PlaylistCard from "../../components/PlaylistCard";

function SavedPlaylist() {
  const [savedPlaylist, setSavedPlaylist] = useState([]);

  useEffect(() => {
    const fetchSavedPlaylist = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/content/getsavedplaylists`,
          { withCredentials: true }
        );

        console.log(result.data);
        const playlist = result.data.filter((pl) => pl.videos.length !== 0);

        setSavedPlaylist(playlist);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSavedPlaylist();
  }, []);

  return (
    <>
      {!savedPlaylist ||
        (savedPlaylist.length == 0 && (
          <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
            No Saved Content Found
          </div>
        ))}
      <div className="p-6 min-h-screen bg-black text-white mt-10 lg:mt-5">
        <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
          <FaList className="w-7 h-7 text-orange-600" /> Saved PlayList
        </h2>
        <div className="flex flex-wrap gap-6">
          {savedPlaylist?.map((pl) => {
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
      </div>
    </>
  );
}

export default SavedPlaylist;
