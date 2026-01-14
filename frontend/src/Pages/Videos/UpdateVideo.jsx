import axios, { all } from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { showAlertHandler } from "../../components/CustomAlert";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { setAllVideosData } from "../../Redux/contentSlice";
import { setChannelData } from "../../Redux/userSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function UpdateVideo() {
  const dispatch = useDispatch();
  const { videoId } = useParams();
  const { channelData } = useSelector((state) => state.user);
  const { allVideosData } = useSelector((state) => state.content);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [decsription, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialThumbnail, setInitialThumbnail] = useState("");
    const [loading1,setLoading1]=useState(false);
  const navigate = useNavigate();

  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };

  useEffect(() => {
    const fetchVideo = async () => {
      console.log("hay");
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetchvideo/${videoId}`,
          { withCredentials: true }
        );
        console.log(res.data);

        setVideo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setTags(res.data.tags.join(","));
        setInitialThumbnail(res.data.thumbnail);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handelUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", decsription);
      formData.append(
        "tags",
        JSON.stringify(tags.split(",").map((t) => t.trim()))
      );

      if (thumbnail) formData.append("thumbnail", thumbnail);
      setLoading(true);

      const result = await axios.put(
        `${serverUrl}/api/content/updatevideo/${videoId}`,
        formData,
        { withCredentials: true }
      );

      setLoading(false);
      console.log(result.data);
      showAlertHandler("video updated successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handelDelete = async () => {
    if (!window.confirm("Are You sure to delete this video")) return;

    try {
      setLoading1(true);
      await axios.delete(`${serverUrl}/api/content/deletevideo/${videoId}`, {
        withCredentials: true,
      });
      showAlertHandler("Video deleted successfully");
      navigate("/");
      setLoading1(false);

    } catch (error) {
      console.log(error);
      setLoading1(false);

    }
  };

  //   const uploadVideo = async () => {
  //     if (title.current?.value.trim().length === 0) {
  //       showAlertHandler("Title is required");
  //       return;
  //     }

  //     const formData = new FormData();
  //     formData.append("title", title.current.value);
  //     formData.append("description", description.current.value);
  //     formData.append(
  //       "tags",
  //       JSON.stringify(tags.current.value.split(",").map((tag) => tag.trim()))
  //     );
  //     formData.append("video", videourl);
  //     formData.append("thumbnail", thumbnail);
  //     formData.append("channelId", channelData._id);
  //     try {
  //       setLoading(true);
  //       const result = await axios.post(
  //         `${serverUrl}/api/content/createvideo`,
  //         formData,
  //         { withCredentials: true }
  //       );
  //       console.log(result.data);
  //       dispatch(setAllVideosData([...(allVideosData || []), result.data]));
  //       const updatedChannel = {
  //         ...channelData,
  //         videos: [...(channelData.videos || []), result.data._id],
  //       };
  //       dispatch(setChannelData(updatedChannel));
  //       setLoading(false);
  //       showAlertHandler("Video Upload SuccessFully");
  //       navigate("/");
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //       showAlertHandler(error.response.data.message);
  //     }
  //   };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5">
      <div className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* upload video */}

          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Enter video Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Enter decsription "
            value={decsription}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Enter video tags e.g (#viewtube,#video)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* upload thumbnail */}
          <label htmlFor="thumbnail" className="block cursor-pointer">
            {thumbnail || initialThumbnail ? (
              <img
                src={
                  thumbnail ? URL.createObjectURL(thumbnail) : initialThumbnail
                }
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
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 items-center justify-center "
            disabled={loading || !title}
            onClick={handelUpdate}
          >
            {loading ? <ClipLoader size={20} color="black" /> : "Update Video"}
          </button>

          <button className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 items-center justify-center " onClick={handelDelete}>
            {loading1 ? <ClipLoader size={20} color="black" /> : "Delete Video"}
          </button>

          {loading && (
            <p className="text-center text-gray-300 text-sm animate-pulse">
              Video Updating... please wait...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateVideo;
