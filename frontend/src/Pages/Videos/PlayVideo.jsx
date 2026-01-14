import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaThumbsUp,
  FaThumbsDown,
  FaDownload,
  FaBookmark,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../../components/ShortCard";
import Description from "../../components/Description";
import axios from "axios";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { setAllVideosData } from "../../Redux/contentSlice";

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

function PlayVideo() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState("");
  const [showControls, setShowControls] = useState(false);
  const [isPlayling, setIsPlaying] = useState(false);
  const { allVideosData, allShortsData } = useSelector(
    (state) => state.content
  );
  const { userData } = useSelector((state) => state.user);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const comments = video?.comments || [];
  const [newComment, setNewComment] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const suggestedVideos =
    allVideosData?.filter((video) => video._id !== videoId).slice(0, 10) || [];
  const suggestedshorts = allShortsData?.slice(0, 10) || [];
  const [loading, setLoading] = useState(false);
  let isSubscribe = video?.channel?.subscribers?.includes(userData?._id);
  const subscribers = video?.channel?.subscribers?.length;

  useEffect(() => {
    if (!allVideosData) {
      return;
    }
    const currentVideo = allVideosData?.find((v) => v._id === videoId);

    if (currentVideo) {
      setVideo(currentVideo);
      setChannel(currentVideo.channel);
    }
  }, [videoId, allVideosData]);

  useEffect(() => {
    const viewsCount = async () => {
      if (!videoId) {
        return;
      }
      try {
        const result = await axios.put(
          `${serverUrl}/api/content/video-views/${videoId}`,
          {},
          { withCredentials: true }
        );
        const updatedVideo = allVideosData.map((v) =>
          v._id === result.data._id ? { ...v, views: result.data.views } : v
        );
        dispatch(setAllVideosData(updatedVideo));
      } catch (error) {
        console.log(error);
      }
    };
    viewsCount();
  }, [videoId]);

  useEffect(() => {
    const addhistory = async () => {
      if (!videoId) {
        return;
      }
      try {
        const result = await axios.post(
          `${serverUrl}/api/user/addhistory`,
          { contentid: videoId, contenttype: "Video" },
          { withCredentials: true }
        );
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    addhistory();
  }, [videoId]);

  const togglePlay = () => {
    if (!videoRef?.current) {
      return;
    }
    if (isPlayling) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const skpiForward = () => {
    if (videoRef?.current) {
      videoRef.current.currentTime += 10;
    }
  };
  const skipBackward = () => {
    if (videoRef?.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const handleUpdateTime = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  const handelSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;

    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return;
    const minute = Math.floor(time / 60);
    const second = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minute}:${second}`;
  };

  const handelVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVol(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };
  const handelMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;

    setIsMuted(!isMuted);
  };

  const handleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handelToggleLike = async () => {
    if (!video?._id) return;
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/video-like/${videoId}`,
        {},
        { withCredentials: true }
      );

      const updatedVideos = allVideosData.map((v) =>
        v._id === videoId
          ? { ...v, likes: result.data.likes, dislikes: result.data.dislikes }
          : v
      );
      dispatch(setAllVideosData(updatedVideos));
    } catch (error) {
      console.log(error);
    }
  };
  const handelToggleDislike = async () => {
    if (!video?._id) return;
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/video-dislike/${videoId}`,
        {},
        { withCredentials: true }
      );

      const updatedVideos = allVideosData.map((v) =>
        v._id === videoId
          ? { ...v, likes: result.data.likes, dislikes: result.data.dislikes }
          : v
      );
      dispatch(setAllVideosData(updatedVideos));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSubscribe = async () => {
    if (!channel._id) return;
    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/user/togglesubscribe`,
        { channelId: channel._id },
        { withCredentials: true }
      );
      const updatedVideos = allVideosData.map((v) =>
        v.channel._id === video.channel._id
          ? {
              ...v,
              channel: { ...channel, subscribers: result.data.subscribers },
            }
          : v
      );
      dispatch(setAllVideosData(updatedVideos));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handletogglesave = async () => {
    if (!video?._id) return;
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/video-save/${videoId}`,
        {},
        { withCredentials: true }
      );
      const updatedVideos = allVideosData.map((v) =>
        v._id === videoId ? { ...v, saveby: result.data.saveby } : v
      );
      dispatch(setAllVideosData(updatedVideos));
    } catch (error) {
      console.log(error);
    }
  };

  const handelComment = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading1(true);
      const result = await axios.post(
        `${serverUrl}/api/content/video-addvideocomment/${videoId}`,
        { message: newComment.trim() },
        { withCredentials: true }
      );
      const updatedVideos = allVideosData.map((v) =>
        v._id === videoId
          ? {
              ...v,
              comments: [
                result.data.comments.slice(-1)[0],
                ...result.data.comments.slice(0, -1),
              ],
            }
          : v
      );

      dispatch(setAllVideosData(updatedVideos));
      setNewComment("");
      setLoading1(false);
    } catch (error) {
      console.log(error);
      setLoading1(false);
    }
  };

  const handleReply = async (commentId, replyText) => {
    if (!commentId || !replyText.trim()) return;
    try {
      setLoading2(true);
      const result = await axios.post(
        `${serverUrl}/api/content/video-addvideoreply/${videoId}/${commentId}`,
        { message: replyText.trim() },
        { withCredentials: true }
      );

      const updatedVideos = allVideosData.map((v) =>
        v._id === videoId
          ? {
              ...v,
              comments: result.data.comments,
            }
          : v
      );
      console.log(updatedVideos);
      dispatch(setAllVideosData(updatedVideos));
      setLoading2(false);
    } catch (error) {
      console.log(error);
      setLoading2(false);
    }
  };

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1">
        {/* videoplayer */}
        <div
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            src={video?.videourl}
            className="w-full h-full object-contain"
            controls={false}
            autoPlay
            ref={videoRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleUpdateTime}
          />
          {showControls && (
            <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 "
                onClick={skipBackward}
              >
                <FaBackward size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 "
              >
                {isPlayling ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 "
                onClick={skpiForward}
              >
                <FaForward size={24} />
              </button>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradientto-t from-black/80 via-black/60 to-transparent sm:px-4 py-0.5 z-30">
            <input
              type="range"
              min={0}
              max={100}
              className="w-full accent-orange-600 "
              onChange={handelSeek}
              value={progress}
            />
            <div className="flex items-center justify-between mt-1 sm:mt-2 text-sm sm:text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <span>
                  {formatTime(currentTime)}/{formatTime(duration)}
                </span>
                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={skipBackward}
                >
                  <FaBackward size={14} />
                </button>

                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={togglePlay}
                >
                  {isPlayling ? <FaPause size={14} /> : <FaPlay size={14} />}
                </button>
                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={skpiForward}
                >
                  <FaForward size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={handelMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  onChange={handelVolume}
                  value={isMuted ? 0 : vol}
                  className="accent-orange-600 w-16 sm:w-24 h-1"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <button onClick={handleFullScreen}>
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>
        <h1 className="mt-4 text-lg sm:text-xl font-bold text-white flex gap-3 line-clamp-2">
          {video?.title}
        </h1>
        <p className="text-sm text-gray-400">{video?.views} views</p>
        <div className="flex flex-wrap items-center justify-between mt-2">
          <div className="flex items-center justify-start gap-4">
            <img
              src={channel?.avatar}
              alt=""
              className="w-12 h-12 rounded-full border-2 border-gray-600"
            />
            <div onClick={() => navigate("/channelpage/" + channel?._id)}>
              <h1 className="text-md font-bold">{channel?.name}</h1>
              <h3 className="text-[13px]">{Number(subscribers) >= 1_000_000
          ? Math.floor(Number(subscribers) / 1_000_000) + "M"
          : Number(subscribers) >= 1_000
          ? Math.floor(Number(subscribers) / 1_000) + "k"
          : Number(subscribers) || 0}</h3>
            </div>
            <button
              className={`px-5 py-2 rounded-4xl border border-gray-600 ml-5 text-md ${
                isSubscribe
                  ? "bg-black text-white hover:bg-orange-600 hover:text-black"
                  : "bg-white text-black hover:bg-orange-600 hover:text-black"
              } `}
              onClick={toggleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader />
              ) : isSubscribe ? (
                "Unsubscribe"
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <IconButton
              icon={FaThumbsUp}
              label={"Likes"}
              active={video?.likes?.includes(userData?._id)}
              count={video?.likes?.length}
              onClick={handelToggleLike}
            />
            <IconButton
              icon={FaThumbsDown}
              label={"Dislikes"}
              active={video?.dislikes?.includes(userData?._id)}
              count={video?.dislikes?.length}
              onClick={handelToggleDislike}
            />
            <IconButton
              icon={FaDownload}
              label={"Download"}
              onClick={() => {
                const link = document.createElement("a");
                link.href = video?.videourl;
                link.download = `${video?.title}.mp4`;
                link.click();
              }}
            />
            <IconButton
              icon={FaBookmark}
              label={"Save"}
              active={video?.saveby?.includes(userData?._id)}
              onClick={handletogglesave}
            />
          </div>
        </div>
        <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
          <h2 className="text-md font-semibold mb-2">Description</h2>
          <Description text={video?.description} />
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a comment"
              className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            />
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-600"
              onClick={handelComment}
              disabled={!newComment.trim() || loading}
            >
              {loading1 ? <ClipLoader /> : "Post"}
            </button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
            {comments?.map((comment) => {
              return (
                <div
                  key={comment._id}
                  className="p-3 bg-[#1a1a1a] rounded-lg shadow-sm text-sm"
                >
                  <div className="flex items-center justify-start gap-1">
                    <img
                      src={comment?.author?.photourl}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <h2 className="text-[13px]">
                      @{comment?.author?.username?.toLowerCase()}
                    </h2>
                  </div>
                  <p className="font-md px-5 py-3">{comment?.message}</p>
                  <ReplySection
                    comment={comment}
                    handleReply={handleReply}
                    loading2={loading2}
                  />

                  <div className="ml-4 mt-3 space-y-2">
                    {comment?.replies?.map((reply) => {
                      return (
                        <div
                          key={reply._id}
                          className="p-2 bg-[#2a2a2a] rounded"
                        >
                          <div className="flex items-center justify-start gap-1">
                            <img
                              src={reply?.author?.photourl}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <h2 className="text-[13px]">
                              @{(reply?.author?.username || "").toLowerCase()}
                            </h2>
                          </div>
                          <p className="px-5 py-2">{reply?.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[380px] px-4 py-4 border-t lg:border-t-0 lg:border border-gray-800 overflow-y-auto">
        <h2 className="flex items-center font-bold text-lg mb-3 gap-2">
          <SiYoutubeshorts className="text-orange-600" />
          Shorts
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-3 ">
          {suggestedshorts?.map((short) => {
            return (
              <div key={short._id}>
                <ShortCard
                  shortUrl={short?.shorturl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  avatar={short?.channel?.avatar}
                  id={short?._id}
                  views={short?.views}
                />
              </div>
            );
          })}
        </div>
        <div className="font-bold text-lg mt-4 mb-3">Up Next</div>
        <div className="space-y-3">
          {suggestedVideos.map((v) => {
            return (
              <div
                className="flex gap-2 sm:gap-3 cursor-pointer hover:bg[#1a1a1a] p-2 rounded-lg transition"
                key={v._id}
                onClick={() => navigate("/playvideo/" + v._id)}
              >
                <img
                  src={v?.thumbnail}
                  alt=""
                  className="w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold line-clamp-2 text-sm sm:text-base text-white">
                    {v?.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {v?.channel?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {Number(v?.views) >= 1_000_000
                      ? Math.floor(Number(v?.views) / 1_000_000) + "M"
                      : Number(v?.views) >= 1_000
                      ? Math.floor(Number(v?.views) / 1_000) + "k"
                      : Number(v?.views) || 0}
                    views
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ReplySection = ({ comment, handleReply, loading2 }) => {
  const [replyText, setReplyText] = useState("");
  const [shoeRelpyInput, setShowRelpyInput] = useState(false);
  return (
    <div className="">
      {shoeRelpyInput && (
        <div className="flex gap-2 mt-1 ml-4">
          <input
            type="text"
            className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600 text-sm"
            placeholder="Add a reply"
            onChange={(e) => setReplyText(e.target.value)}
            value={replyText}
          />

          <button
            onClick={() => {
              handleReply(comment._id, replyText);
              setShowRelpyInput(false);
              setReplyText("");
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm disabled:bg-gray-700"
            disabled={!replyText.trim() || loading2}
          >
            Reply
          </button>
        </div>
      )}
      <button
        onClick={() => setShowRelpyInput((prev) => !prev)}
        className="ml-4 text-xs text-gray-400 "
      >
        {loading2 ? <ClipLoader size={20} color={"white"} /> : "Relpy"}
      </button>
    </div>
  );
};

export default PlayVideo;
