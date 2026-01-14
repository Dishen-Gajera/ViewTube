import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlertHandler } from "./CustomAlert";
import axios from "axios";
import { serverUrl } from "../App";
import { setChannelData } from "../Redux/userSlice";

function Content() {
  const [activeTab, setActiveTab] = useState("Videos");
  const { channelData } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are yoou sure to delete this post")) return;

    try {
      await axios.delete(`${serverUrl}/api/content/deletepost/${postId}`, {
        withCredentials: true,
      });
      showAlertHandler("Post deleted successfully");
      const updatePosts = channelData.communityposts.filter(
        (p) => p._id !== postId
      );
      dispatch(setChannelData({ ...channelData, communityposts: updatePosts }));
    } catch (error) {
      console.log(error);
      showAlertHandler(error?.response?.data?.message);
    }
  };
  return (
    <div className=" text-white min-h-screen pt-5 px-4 sm:px-6 mb-16">
      <div className="flex flex-wrap gap-6 border-b border-gray-800 mb-6">
        <div className="flex gap-8 px-6 border-b border-gray-800 mb-6 relative overflow-x-auto">
          {["Videos", "Shorts", "Playlists", "CommunityPosts"].map((tab) => {
            return (
              <button
                onClick={() => setActiveTab(tab)}
                key={tab}
                className={`py-1.5 relative font-medium transition ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-8">
        {/* for videos */}

        {activeTab === "Videos" && (
          <div>
            <div className="hidden md:block overflow-y-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Thunbnail</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Edit</th>
                    <th className="p-3 text-left">View</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.videos.map((v) => {
                    return (
                      <tr
                        className="border-t border-gray-700 hover:bg-gray-800/40"
                        key={v._id}
                      >
                        <td className="p-3">
                          <img
                            src={v.thumbnail}
                            alt=""
                            className="w-20 h-12 rounded object-cover"
                          />
                        </td>
                        <td className="p-3 text-start">{v.title}</td>
                        <td className="p-3 text-start">
                          {" "}
                          {Number(v?.views) >= 1_000_000
                            ? Math.floor(Number(v?.views) / 1_000_000) + "M"
                            : Number(v?.views) >= 1_000
                            ? Math.floor(Number(v?.views) / 1_000) + "k"
                            : Number(v?.views) || 0}
                        </td>
                        <td className="p-3">
                          <FaEdit
                            className="cursor-pointer hover:text-orange-400"
                            onClick={() => {
                              navigate("/vtstudio/updatevideo/" + v._id);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* for small devices */}

            <div className="grid gap-4 md:hidden">
              {channelData?.videos?.map((v) => {
                return (
                  <div
                    key={v._id}
                    className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    <img
                      src={v.thumbnail}
                      alt=""
                      className="w-full h-40 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <h3 className="text-base font-semibold">{v.title}</h3>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                      <span>
                        {Number(v?.views) >= 1_000_000
                          ? Math.floor(Number(v?.views) / 1_000_000) + "M"
                          : Number(v?.views) >= 1_000
                          ? Math.floor(Number(v?.views) / 1_000) + "k"
                          : Number(v?.views) || 0}
                      </span>
                      <FaEdit
                        className="cursor-pointer hover:text-orange-400 "
                        onClick={() => {
                          navigate("/vtstudio/updatevideo/" + v._id);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Shorts" && (
          <div>
            <div className="hidden md:block overflow-y-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Preview</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Edit</th>
                    <th className="p-3 text-left">View</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.shorts.map((s) => {
                    return (
                      <tr
                        className="border-t border-gray-700 hover:bg-gray-800/40"
                        key={s._id}
                      >
                        <td className="p-3">
                          <video
                            src={s.shorturl}
                            className="w-16 h-24 bg-black rounded"
                            muted
                            playsInline
                            preload="metadata"
                          ></video>
                        </td>
                        <td className="p-3 text-start">{s.title}</td>
                        <td className="p-3 text-start">
                          {" "}
                          {Number(s?.views) >= 1_000_000
                            ? Math.floor(Number(s?.views) / 1_000_000) + "M"
                            : Number(s?.views) >= 1_000
                            ? Math.floor(Number(s?.views) / 1_000) + "k"
                            : Number(s?.views) || 0}
                        </td>
                        <td className="p-3">
                          <FaEdit
                            className="cursor-pointer hover:text-orange-400"
                            onClick={() =>
                              navigate("/vtstudio/updateshort/" + s._id)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* for small devices */}

            <div className="grid gap-4 md:hidden">
              {channelData?.shorts?.map((s) => {
                return (
                  <div
                    key={s._id}
                    className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border"
                  >
                    <video
                      src={s.shorturl}
                      className="w-full aspect-9/16 object-cover sm:aspect-11/15"
                      muted
                      playsInline
                      controls
                    ></video>
                    <div className="flex-1 p-4">
                      <h3 className="text-base font-semibold">{s.title}</h3>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                      <span>
                        {Number(s?.views) >= 1_000_000
                          ? Math.floor(Number(s?.views) / 1_000_000) + "M"
                          : Number(s?.views) >= 1_000
                          ? Math.floor(Number(s?.views) / 1_000) + "k"
                          : Number(s?.views) || 0}
                      </span>
                      <FaEdit
                        className="cursor-pointer hover:text-orange-400 "
                        onClick={() =>
                          navigate("/vtstudio/updateshort/" + s._id)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Playlists" && (
          <div>
            <div className="hidden md:block overflow-y-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Thunbnail</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Total Videos</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.playlists
                    .filter((p) => p.videos.length !== 0)
                    .map((pl) => {
                      return (
                        <tr
                          className="border-t border-gray-700 hover:bg-gray-800/40"
                          key={pl._id}
                        >
                          <td className="p-3">
                            <img
                              src={pl?.videos[0]?.thumbnail}
                              alt=""
                              className="w-20 h-12 rounded object-cover"
                            />
                          </td>
                          <td className="p-3 text-start">{pl.title}</td>
                          <td className="p-3 text-start">{pl.videos.length}</td>
                          <td className="p-3">
                            <FaEdit
                              className="cursor-pointer hover:text-orange-400"
                              onClick={() => {
                                navigate("/vtstudio/updateplaylist/" + pl._id);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* for small devices */}

            <div className="grid gap-4 md:hidden">
              {channelData?.playlists
                ?.filter((p) => p.videos.length !== 0)
                .map((pl) => {
                  return (
                    <div
                      key={pl._id}
                      className="bg-[#1c1c1c] border rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                    >
                      <img
                        src={pl.videos[0].thumbnail}
                        alt=""
                        className="w-full h-32 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <h3 className="text-base font-semibold">{pl.title}</h3>
                      </div>
                      <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                        <span>{pl.videos.length}</span>
                        <FaEdit
                          className="cursor-pointer hover:text-orange-400 "
                          onClick={() => {
                            navigate("/vtstudio/updateplaylist/" + pl._id);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {activeTab === "CommunityPosts" && (
          <div>
            <div className="hidden md:block overflow-y-auto">
              <table className="min-w-full border border-gray-700 rounded-lg">
                <thead className="bg-gray-800 text-sm">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Post</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {channelData?.communityposts.map((c) => {
                    return (
                      <tr
                        className="border-t border-gray-700 hover:bg-gray-800/40"
                        key={c._id}
                      >
                        <td className="p-3">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt=""
                              className="w-20 h-12 rounded object-cover"
                            />
                          ) : (
                            <div>No Image</div>
                          )}
                        </td>
                        <td className="p-3 text-start">{c.content}</td>
                        <td className="p-3 text-start">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <MdDelete
                            className="cursor-pointer hover:text-orange-400"
                            size={20}
                            onClick={() => handleDeletePost(c._id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* for small devices */}

            <div className="grid gap-4 md:hidden">
              {channelData?.communityposts?.map((c) => {
                return (
                  <div
                    key={c._id}
                    className="bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    {c.image && (
                      <img
                        src={c.image}
                        alt=""
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="flex-1 p-4">
                      <h3 className="text-base font-semibold">{c.content}</h3>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      <MdDelete
                        className="cursor-pointer hover:text-orange-400 "
                        size={20}
                        onClick={() => handleDeletePost(c._id)}
                      />
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
}

export default Content;
