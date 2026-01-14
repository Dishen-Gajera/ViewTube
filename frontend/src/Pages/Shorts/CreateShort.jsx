import axios from "axios";
import React, { useMemo, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";
import { showAlertHandler } from "../../components/CustomAlert";
import { useNavigate } from "react-router-dom";
import { setAllShortsData } from "../../Redux/contentSlice";
import { setChannelData } from "../../Redux/userSlice";

function CreateShort() {
  const { channelData } = useSelector((state) => state.user);
  const { allShortsData } = useSelector((state) => state.content);
  const [shorturl, setShorturl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDiscription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const videoPreview = useMemo(() => {
    return shorturl ? URL.createObjectURL(shorturl) : null;
  }, [shorturl]);

  const uploadShort = async (req, res) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (tags) {
      formData.append(
        "tags",
        JSON.stringify(tags?.split(",").map((tag) => tag.trim()))
      );
    }

    formData.append("channelId", channelData._id);
    formData.append("shorturl", shorturl);
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/content/create-short`,
        formData,
        { withCredentials: true }
      );
      console.log(result.data);
      dispatch(setAllShortsData([...(allShortsData || []), result.data]));
      const updatedChannel = {
        ...channelData,
        shorts: [...(channelData.shorts || []), result.data._id],
      };
      dispatch(setChannelData(updatedChannel));
      showAlertHandler("Short Uploading successfully");
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      showAlertHandler(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 md:mt-20">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* left side */}

          <div className="flex justify-center items-start">
            <label
              htmlFor="short"
              className="flex flex-col items-center justify-center border-2 border-dashed hover:border-orange-400 border-gray-500 rounded-lg cursor-pointer bg-[#181818] overflow-hidden w-[220px] aspect-9/16"
            >
              {shorturl ? (
                <video
                  src={videoPreview}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {" "}
                  <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-300 text-xs ">
                    Click to upload short video
                  </p>
                  <span className="text-[10px] text-gray-500">
                    MP4 or MOV -- Max 60s
                  </span>
                </div>
              )}
              <input
                type="file"
                id="short"
                onChange={(e) => setShorturl(e.target.files[0])}
                hidden
                accept="video/mp4,video/quicktime"
              />
            </label>
          </div>

          {/* right side */}
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <textarea
              placeholder="description"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setDiscription(e.target.value)}
              value={description}
            />
            <input
              type="text"
              placeholder="Tags  e.g   #short,#viewtube"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              onChange={(e) => setTags(e.target.value)}
              value={tags}
            />
            <button
              className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
              disabled={!shorturl || !title || loading}
              onClick={uploadShort}
            >
              {loading ? <ClipLoader /> : "Upload Short"}
            </button>
            {loading && (
              <p className="text-center text-sm text-gray-300 animate-pulse">
                Short Uploading... Please wait...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateShort;
