import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChannelData } from "../../Redux/userSlice";
import { showAlertHandler } from "../../components/CustomAlert";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePlaylist() {
  const { playlistId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { channelData } = useSelector((state) => state.user);
  const [videoData, setVideoData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [playlist, setPlaylist] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleselectVideo = (videoId) => {
    setSelectedVideos((prev) => {
      return prev?.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
    });
  };

  useEffect(() => {
    if (channelData && channelData?.videos) {
      setVideoData(channelData?.videos);
    }
  }, []);

  useEffect(() => {
    const fetchPlalist = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/content/fetchplaylist/${playlistId}`,
          { withCredentials: true }
        );
        console.log(result.data);
        setPlaylist(result.data);
        setTitle(result.data.title);
        setDescription(result.data.description);
        setSelectedVideos(result.data.videos.map((v) => v._id));
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlalist();
  }, [playlistId]);

  //   const handelCreatePlayList = async () => {

  //     if (selectedVideos.length === 0) {
  //       showAlertHandler("please select atlease one video");
  //       return;
  //     }
  //     try {
  //       setLoading(true);
  //       const result = await axios.post(
  //         `${serverUrl}/api/content/create-playlist`,
  //         {
  //           channelId: channelData._id,
  //           title,
  //           description,
  //           videoIds: selectedVideos,
  //         },
  //         { withCredentials: true }
  //       );
  //       dispatch(
  //         setChannelData({
  //           ...channelData,
  //           playlists: [...channelData.playlists, result.data],
  //         })
  //       );
  //       showAlertHandler("playlist created");
  //       navigate("/");
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     }
  //   };

  const handleUpdate = async () => {
    try {
      const currentVideos = playlist.videos.map((v) => v._id.toString());
      const newVideos = selectedVideos.map((v) => v.toString());
      const addVideos = newVideos.filter((id) => !currentVideos.includes(id));
      const removeVideos = currentVideos.filter(
        (id) => !newVideos.includes(id)
      );
      setLoading(true);

      const res = await axios.put(
        `${serverUrl}/api/content/updateplaylist/${playlistId}`,
        {
          title,
          description,
          addVideos,
          removeVideos,
        },
        { withCredentials: true }
      );
      showAlertHandler("Playlist update succeesfully");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      showAlertHandler(error.response.data.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("are you sure to delete this playlist")) return;
    try {
      setLoading2(true);

      await axios.delete(
        `${serverUrl}/api/content/deleteplaylist/${playlistId}`,
        { withCredentials: true }
      );
      showAlertHandler("Playlist deleted successfully");
      setLoading2(false);
    } catch (error) {
      console.log(error);
      showAlertHandler(error?.response?.data?.message);
      setLoading2(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="PlayList Title *"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <textarea
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="PlayList Discription *"
            required
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <div>
            <p className="mb-3 text-lg font-semibold">Select Videos</p>
            {videoData?.length == 0 ? (
              <p className="text-sm text-gray-400">
                No videos found for this channel
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
                {videoData?.map((video) => {
                  return (
                    <div
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 p-2 ${
                        selectedVideos?.includes(video._id)
                          ? "border-orange-500"
                          : "border-gray-700"
                      }`}
                      key={video._id}
                      onClick={() => toggleselectVideo(video?._id)}
                    >
                      <img
                        src={video?.thumbnail}
                        alt=""
                        className="w-full h-28 object-cover"
                      />
                      <p className="p-2 text-sm truncate">{video?.title}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex-items-center justify-center"
            disabled={!title.trim() || selectedVideos.length === 0 || loading}
            onClick={handleUpdate}
          >
            {loading ? <ClipLoader /> : "Update Playlist"}
          </button>
          <button
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex-items-center justify-center"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading2 ? <ClipLoader /> : "Delete Playlist"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default UpdatePlaylist;
