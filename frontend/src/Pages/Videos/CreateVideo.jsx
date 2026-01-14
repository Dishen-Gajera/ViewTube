import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { showAlertHandler } from "../../components/CustomAlert";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { setAllVideosData } from "../../Redux/contentSlice";
import { setChannelData } from "../../Redux/userSlice";

function CreateVideo() {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);
  const [videourl, setVideourl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const title = useRef();
  const description = useRef();
  const tags = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVideo = (e) => {
    setVideourl(e.target.files[0]);
  };
  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const uploadVideo = async () => {
    if (title.current?.value.trim().length === 0) {
      showAlertHandler("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.current.value);
    formData.append("description", description.current.value);
    formData.append(
      "tags",
      JSON.stringify(tags.current.value.split(",").map((tag) => tag.trim()))
    );
    formData.append("video", videourl);
    formData.append("thumbnail", thumbnail);
    formData.append("channelId", channelData._id);
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/content/createvideo`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setAllVideosData([...(allVideosData || []), result.data]));
      const updatedChannel = {
        ...channelData,
        videos: [...(channelData.videos || []), result.data._id],
      };
      dispatch(setChannelData(updatedChannel));
      setLoading(false);
      showAlertHandler("Video Upload SuccessFully");
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showAlertHandler(error.response.data.message);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <div className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* upload video */}

          <label
            htmlFor="video"
            className=" cursor-pointer border-gray-600 rounded-lg flex flex-col items-center justify-center p-1 hover:border-orange-500 transition"
          >
            {videourl ? (
              <video
                className="w-full"
                src={URL.createObjectURL(videourl)}
                controls
              />
            ) : (
              <div className="w-full h-30 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 mb-2">
                Click to uplaod Video
              </div>
            )}

            <input
              type="file"
              id="video"
              className="w-full p-3 mt-1 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              accept="video/*"
              onChange={handleVideo}
              hidden={!videourl}
            />
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Enter video Title *"
            ref={title}
            defaultvalue={title.current?.value}
            required
          />
          <textarea
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Enter decsription "
            defaultvalue={description.current?.value}
            ref={description}
            required
          />
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Enter video tags e.g (#viewtube,#video)"
            defaultvalue={tags.current?.value}
            ref={tags}
          />

          {/* upload thumbnail */}
          <label htmlFor="thumbnail" className="block cursor-pointer">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                className="w-full h-50 border border-gray-700 rounded-lg object-cover"
              />
            ) : (
              <div className="w-full h-30 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 mb-2">
                Click to uplaod thumbnail
              </div>
            )}
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              hidden
              onChange={handleThumbnail}
            />
          </label>
          <button
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 items-center justify-center "
            disabled={!videourl || !thumbnail || loading}
            onClick={uploadVideo}
          >
            {loading ? <ClipLoader size={20} color="black" /> : "Upload Video"}
          </button>
          {loading && (
            <p className="text-center text-gray-300 text-sm animate-pulse">
              Video Uploading... please wait...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateVideo;
