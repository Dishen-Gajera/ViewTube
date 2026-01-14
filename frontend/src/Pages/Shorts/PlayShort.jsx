import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaPlay,
  FaPause,
  FaDownload,
  FaBookmark,
  FaArrowDown,
} from "react-icons/fa";
import Description from "../../components/Description";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
const IconButton = ({ icon: Icon, active, label, count, onClick }) => {
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div
        className={`${
          active ? "bg-white" : "bg-[#000000] border border-gray-700 "
        } p-3 rounded-full hover:bg-gray-700 transition`}
      >
        <Icon
          size={20}
          className={` ${active ? "text-black" : "text-white"}`}
        />
      </div>
      <span className="text-xs mt-1 flex gap-1">
        {count !== undefined && Number(count) >= 1_000_000
          ? Math.floor(Number(count) / 1_000_000) + "M"
          : Number(count) >= 1_000
          ? Math.floor(Number(count) / 1_000) + "k"
          : Number(count) || 0}
        <span>{label}</span>
      </span>
    </button>
  );
};

function PlayShort() {
  const { shortId } = useParams();
  const { allShortsData } = useSelector((state) => state.content);
  const selectedShort = allShortsData?.find((s) => s._id === shortId);
  const [shortList, setShortList] = useState([]);
  const shortRef = useRef([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openComments, setOpenComments] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [viewdShort, setViewdshort] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = shortRef.current[index];
          if (video) {
            if (entry.isIntersecting) {
              (video.muted = false), video.play();
              setActiveIndex(index);
              const currentshortId = shortList[index]._id;
              if (!viewdShort.includes(currentshortId)) {
                handleAddView(currentshortId);
                setViewdshort((prev) => [...prev, currentshortId]);
              }
            } else {
              (video.muted = true), video.pause();
            }
          }
        });
      },
      { threshold: 0.7 }
    );
    shortRef.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [shortList, viewdShort]);
  useEffect(() => {
    if (!allShortsData || allShortsData.length === 0) return;

    let suffled = [...allShortsData].sort(() => Math.random() - 0.5);
    if (selectedShort) {
      const selected = allShortsData.find(
        (short) => short._id === selectedShort._id
      );
      const remaining = allShortsData.filter(
        (short) => short._id !== selectedShort._id
      );
      if (selected) {
        suffled = [...remaining].sort(() => Math.random() - 0.5);
        setShortList([selected, ...suffled]);
      } else {
        setShortList(suffled);
      }
    } else {
      setShortList(suffled);
    }
  }, [allShortsData]);
  useEffect(() => {
    const addhistory = async () => {
      try {
        const short = shortList[activeIndex];
        if (!short) {
          return;
        }
        const result = await axios.post(
          `${serverUrl}/api/user/addhistory`,
          { contentid: short._id, contenttype: "Short" },
          { withCredentials: true }
        );
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    addhistory();
  }, [activeIndex, shortList]);

  const tooglePlay = (index) => {
    const video = shortRef.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayIndex(null);
      } else {
        video.pause();
        setPlayIndex(index);
      }
    }
  };

  const handleToggleSubscribe = async (channelId) => {
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        { channelId },
        { withCredentials: true }
      );
      const updated = shortList?.map((short) =>
        short?.channel._id === channelId
          ? {
              ...short,
              channel: {
                ...short.channel,
                subscribers: result.data.subscribers,
              },
            }
          : short
      );

      setShortList(updated);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handletoggleLike = async (shortId) => {
    if (!shortId) {
      return;
    }
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short-like/${shortId}`,
        {},
        { withCredentials: true }
      );
      const updatedShorts = shortList?.map((short) =>
        short?._id === shortId
          ? {
              ...short,
              likes: result.data.likes,
              dislikes: result.data.dislikes,
            }
          : short
      );
      setShortList(updatedShorts);
    } catch (error) {
      console.log(error);
    }
  };

  const handelToggleDislike = async (shortId) => {
    if (!shortId) {
      return;
    }
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short-dislike/${shortId}`,
        {},
        { withCredentials: true }
      );
      const updatedShorts = shortList?.map((short) =>
        short?._id === shortId
          ? {
              ...short,
              likes: result.data.likes,
              dislikes: result.data.dislikes,
            }
          : short
      );
      setShortList(updatedShorts);
    } catch (error) {
      console.log(error);
    }
  };

  const handletogglesave = async (shortId) => {
    if (!shortId) return;
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short-save/${shortId}`,
        {},
        { withCredentials: true }
      );
      const updatedShorts = shortList?.map((short) =>
        short._id === shortId ? { ...short, saveby: result.data.saveby } : short
      );
      setShortList(updatedShorts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddView = async (shortId) => {
    if (!shortId) {
      return;
    }
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short-views/${shortId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handelAddComment = async (shortId) => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/content/short-addcomment/${shortId}`,
        { message: newComment.trim() },
        { withCredentials: true }
      );
      const updatedShorts = shortList.map((short) =>
        short._id === shortId
          ? { ...short, comments: result.data.comments }
          : short
      );
      console.log(updatedShorts);
      setShortList(updatedShorts);
      setNewComment("");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleReply = async (shortId, commentId, replyText) => {
    if (!shortId || !commentId || !replyText.trim()) return;
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/short-addreply/${shortId}/${commentId}`,
        { message: replyText.trim() },
        { withCredentials: true }
      );
      const updatedShorts = shortList?.map((short) =>
        short?._id === shortId
          ? { ...short, comments: result.data.comments }
          : short
      );
      setShortList(updatedShorts);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-[calc(100vh-95px)] w-full overflow-y-scroll snap-y snap-mandatory md:mt-13">
      {shortList?.map((short, index) => {
        return (
          <div
            key={short._id}
            className="min-h-full w-full flex md:items-center items-start justify-center snap-start pt-10 md:pt-0 "
          >
            <div className="relative w-[420px] md:w-[350px] md:aspect-9/16 sm:aspect-11/15  aspect-10/15 bg-black rounded-2xl overflow-hidden shadow-xl border-gray-700 cursor-pointer">
              <video
                src={short?.shorturl}
                ref={(el) => (shortRef.current[index] = el)}
                data-index={index}
                className="w-full h-full object-cover"
                loop
                playsInline
                autoPlay
                onClick={() => tooglePlay(index)}
              />
              {playIndex === index && (
                <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                  <FaPlay className="text-white text-lg" />
                </div>
              )}
              {playIndex !== index && (
                <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                  <FaPause className="text-white text-lg" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 left-0 p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent text-white space-y-1">
                <div className="flex items-center justify-start gap-2">
                  <img
                    src={short?.channel?.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full border border-gray-700"
                    onClick={() =>
                      navigate("/channelpage/" + short?.channel?._id)
                    }
                  />
                  <span
                    className="text-sm text-gray-300"
                    onClick={() =>
                      navigate("/channelpage/" + short?.channel?._id)
                    }
                  >
                    @{(short?.channel?.name || "").toLowerCase()}
                  </span>
                  <button
                    className={`${
                      short?.channel?.subscribers?.includes(userData?._id)
                        ? "bg-[#000000a1] text-white border border-gray-700"
                        : "bg-white text-black"
                    } text-xs px-2.5 py-2.5 rounded-full cursor-pointer `}
                    onClick={() => handleToggleSubscribe(short?.channel?._id)}
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader size={20} color="gray" />
                    ) : (
                      `${
                        short?.channel?.subscribers?.includes(userData?._id)
                          ? "Unsubscribe"
                          : "Subscribe"
                      }`
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-start">
                  <h3 className="font-bold text-lg line-clamp-1">
                    {short?.title}
                  </h3>
                </div>
                {short?.tags?.length !== 0 && short?.tags[0] !== "" && (
                  <div>
                    {short?.tags?.map((tag, index) => {
                      return (
                        <span
                          key={index}
                          className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
                {short?.description && (
                  <Description text={short?.description} />
                )}
              </div>
              <div className="absolute md:right-3 md:bottom-28 flex flex-col items-center gap-5 text-white right-0 bottom-20">
                <IconButton
                  icon={FaThumbsUp}
                  label={"Likes"}
                  active={short?.likes?.includes(userData?._id)}
                  count={short?.likes?.length}
                  onClick={() => handletoggleLike(short._id)}
                />
                <IconButton
                  icon={FaThumbsDown}
                  label={"Dislikes"}
                  active={short?.dislikes?.includes(userData?._id)}
                  count={short?.dislikes?.length}
                  onClick={() => handelToggleDislike(short._id)}
                />
                <IconButton
                  icon={FaComment}
                  label={"Comments"}
                  onClick={() => setOpenComments((prev) => !prev)}
                  count={short?.comments?.length}
                />

                <IconButton
                  icon={FaBookmark}
                  label={"Save"}
                  active={short?.saveby?.includes(userData?._id)}
                  onClick={() => handletogglesave(short._id)}
                />
              </div>
              {openComments && (
                <div className="absolute left-0 bottom-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">Comments</h3>
                    <button>
                      <FaArrowDown
                        size={20}
                        onClick={() => setOpenComments((prev) => !prev)}
                      />
                    </button>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-gray-900 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="bg-black px-4 py-2 border border-gray-700 rounded-xl"
                      onClick={() => handelAddComment(short._id)}
                    >
                      {loading ? (
                        <ClipLoader size={20} color="white" />
                      ) : (
                        "Post"
                      )}
                    </button>
                  </div>
                  <div className="space y-3 mt-4">
                    {short?.comments.length === 0 && (
                      <p className="text-sm text-gray-400">No commentrs</p>
                    )}
                    {short?.comments?.map((comment) => {
                      return (
                        <div
                          key={comment?._id}
                          className="bg-gray-800/40 p-2 rounded-lg mb-1"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src={comment?.author?.photourl}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />

                            <h3 className="text-sm font-semibold">
                              @{comment?.author?.username?.toLowerCase()}
                            </h3>
                          </div>
                          <p className="text-sm ml-8">{comment?.message}</p>

                          <ReplySection
                            comment={comment}
                            shortId={short?._id}
                            handleReply={handleReply}
                          />
                          <div className="ml-12 mt-2 space-y-2">
                            {comment?.replies?.map((reply) => {
                              return (
                                <div
                                  key={reply?._id}
                                  className="bg-gray-800/40 p-2 rounded-lg mb-1"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <img
                                      src={reply?.author?.photourl}
                                      alt=""
                                      className="w-6 h-6 rounded-full"
                                    />

                                    <h3 className="text-sm font-semibold">
                                      @{reply?.author?.username?.toLowerCase()}
                                    </h3>
                                  </div>
                                  <p className="text-sm ml-8">
                                    {reply?.message}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ReplySection = ({ shortId, comment, handleReply, loading2 }) => {
  const [replyText, setReplyText] = useState("");
  const [shoeRelpyInput, setShowRelpyInput] = useState(false);
  return (
    <div className="">
      {shoeRelpyInput && (
        <div className="flex gap-2 mt-1 ml-4 py-2">
          <input
            type="text"
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
            placeholder="Add a reply"
            onChange={(e) => setReplyText(e.target.value)}
            value={replyText}
          />

          <button
            onClick={() => {
              handleReply(shortId, comment._id, replyText);
              setShowRelpyInput(false);
              setReplyText("");
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm disabled:bg-gray-700 "
            disabled={!replyText.trim() || loading2}
          >
            Reply
          </button>
        </div>
      )}
      <button
        onClick={() => setShowRelpyInput((prev) => !prev)}
        className="ml-8 my-2 text-xs text-gray-400 "
      >
        {loading2 ? <ClipLoader size={20} color={"white"} /> : "Relpy"}
      </button>
    </div>
  );
};

export default PlayShort;
