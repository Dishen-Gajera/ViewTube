import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { showAlertHandler } from "../../components/CustomAlert";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { setChannelData } from "../../Redux/userSlice";
import { ClipLoader } from "react-spinners";

function CreatePost() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handelCreatePost = async () => {
    if (!content.trim()) {
      showAlertHandler("content is required");
      return;
    }
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("content", content.trim());
      if (image) {
        formdata.append("image", image);
      }
      formdata.append("channelId", channelData._id);
      const result = await axios.post(
        `${serverUrl}/api/content/create-post`,
        formdata,
        { withCredentials: true }
      );
      dispatch(
        setChannelData({
          ...channelData,
          communityposts: [...channelData.communityposts, result.data],
        })
      );
      showAlertHandler("Post Created");
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col items-center justify-center pt-5">
      <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4">
        <textarea
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-28"
          placeholder="Write somting for your community"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />

        <label
          htmlFor="image"
          className="flex items-center space-x-3 cursor-pointer w-full"
        >
          {!image && <FaImage className="text-2xl text-gray-300" />}
          {!image && <span>Add Image optional</span>}

          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && (
            <div className="mt-1 w-full">
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="w-full rounded-lg max-h-64 object-cover"
              />
            </div>
          )}
        </label>
        <button
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
          disabled={!content.trim() || loading}
          onClick={handelCreatePost}
        >
          {loading ? <ClipLoader size={20} color="black" /> : "Create Post"}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
