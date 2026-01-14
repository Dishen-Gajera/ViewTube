import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../../App";
import { showAlertHandler } from "../../components/CustomAlert";
import { useNavigate, useParams } from "react-router-dom";
import { setAllShortsData } from "../../Redux/contentSlice";
import { setChannelData } from "../../Redux/userSlice";

function UpdateShort() {
  const { shortId } = useParams();
  const { channelData } = useSelector((state) => state.user);
  const { allShortsData } = useSelector((state) => state.content);

  const [title, setTitle] = useState("");
  const [description, setDiscription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShort = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetchshort/${shortId}`,
          { withCredentials: true }
        );
        setTitle(res.data.title);
        setDiscription(res.data.description);
        setTags(res.data.tags?.join(","));
      } catch (error) {
        console.log(error);
      }
    };
    fetchShort();
  }, [shortId]);

  const updateShort = async () => {
    try {
      setLoading(true);
      const result = await axios.put(
        `${serverUrl}/api/content/updateshort/${shortId}`,
        {
          title,
          description,
          tags: JSON.stringify(
            tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          ),
        },
        { withCredentials: true }
      );
      showAlertHandler("Video Update Successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      showAlertHandler(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleDeleteShort = async () => {
    if (!window.confirm("Are you sure to delete this short")) return;
    try {
      setLoading2(true);

      const resutl = await axios.delete(
        `${serverUrl}/api/content/deleteshort/${shortId}`,
        { withCredentials: true }
      );
      showAlertHandler("Video deletes successfully");
      setLoading2(false);
      navigate("/");
    } catch (error) {
      showAlertHandler(error?.response?.data?.message);
      setLoading2(false);
    }
  };

  return (
    <div className="w-full min-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 md:mt-20">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg flex flex-col items-center justify-centergap-6">
          {/* left side */}

          {/* right side */}
          <div className="flex flex-col space-y-4 w-full">
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
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
              disabled={!title || loading}
              onClick={updateShort}
            >
              {loading ? <ClipLoader /> : "Update Short"}
            </button>
            <button
              className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
              disabled={loading2}
              onClick={handleDeleteShort}
            >
              {loading2 ? <ClipLoader /> : "Delete Short"}
            </button>
            {loading && (
              <p className="text-center text-sm text-gray-300 animate-pulse">
                Short Updating... Please wait...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UpdateShort;
