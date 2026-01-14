import axios from "axios";
import React, { useState } from "react";
import { FaComment, FaHeart, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

function PostCard({ post }) {
  const { userData } = useSelector((state) => state.user);
  const [Liked, setLiked] = useState(post?.likes?.includes(userData._id));
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [comments, setComments] = useState(post?.comments);
  const handelLike = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/post-like/${post._id}`,
        {},
        { withCredentials: true }
      );
      setLikeCount(result.data.likes.length);
      setLiked(result.data.likes.includes(userData._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handelComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    try {
      setLoading(true);
      const result = await axios.put(
        `${serverUrl}/api/content/post-addcomment/${post._id}`,
        { message: newComment.trim() },
        { withCredentials: true }
      );
      setLoading(false);
      setComments((prev) => [result.data.comments.slice(-1)[0], ...prev]);
      setNewComment("");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleReply = async (commentId, replyText) => {
    if (!commentId || !replyText.trim()) return;
    try {
      setLoading2(true);
      const result = await axios.put(
        `${serverUrl}/api/content/post-addreply/${post._id}/${commentId}`,
        { message: replyText.trim() },
        { withCredentials: true }
      );

      setComments(result.data.comments);
      setLoading2(false);
    } catch (error) {
      console.log(error);
      setLoading2(false);
    }
  };

  return (
    <div className="w-100 md:w-160 bg-linear-to-br from-gray-900 via-black to-gray-900 rounded p-5 shadow-lg border border-gray-700 mb-[50px] relative">
      <p className="text-base text-gray-200">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          className="w-90 h-80 md:w-140 md:h-120 object-cover rounded-xl mt-4 shadow-md md:mx-auto"
        />
      )}

      <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
        <span className="italic text-gray-500">
          {new Date(post.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <div className="flex gap-6">
          <button
            onClick={handelLike}
            className={`flex items-center gap-2 cursor-pointer transition ${
              Liked ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            <FaHeart />
            {Number(likeCount) >= 1_000_000
              ? Math.floor(
                  Number(likeCount) / 1_000_000
                ) + "M"
              : Number(likeCount) >= 1_000
              ? Math.floor(Number(likeCount) / 1_000) +
                "k"
              : Number(likeCount) || 0}
          </button>
          <button
            className="flex items-center gap-2 hover:text-blue-400 cursor-pointer transition"
            onClick={() => setShowComments(true)}
          >
            <FaComment />
          </button>
        </div>
      </div>
      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-2xl border-t border-gray-700 max-h-[50%] overflow-y-auto space-y-2">
          <div className="flex items-center w-full justify-between py-2.5">
            <h3 className="text-gray-300 font-semibold mb-2">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-gray-400 hover:text-orange-500 transition"
            >
              <FaTimes size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-3 items-center">
            <img
              src={userData?.photourl}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Add a comment"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            />
            <button
              className="px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700 disabled:bg-gray-700"
              disabled={loading || !newComment.trim()}
              onClick={handelComment}
            >
              {loading ? <ClipLoader size={20} color="black" /> : "Post"}
            </button>
          </div>
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => {
                return (
                  <div
                    className="bg-gray-700 p-3 rounded-lg"
                    key={comment?._id}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={comment?.author?.photourl}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm font-semibold text-gray-200">
                        {comment.author.username}
                      </span>
                    </div>
                    <p className="text-gray-200 ml-8">{comment.message}</p>
                    <ReplySection comment={comment} handleReply={handleReply} />
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
              })
            ) : (
              <p>No comments Yet</p>
            )}
          </div>
        </div>
      )}
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
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 rounded-lg text-sm disabled:bg-gray-900"
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

export default PostCard;
