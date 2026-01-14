import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const calculateRevenue = (views, type) => {
  if (type === "video") {
    if (views < 1000) return 0;
    return Math.floor((views / 1000) * 50);
  }
  if (type === "short") {
    if (views < 10000) return 0;
    return Math.floor((views / 10000) * 50);
  }
  return 0;
};

function Revenue() {
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const videoRevenueData = (channelData?.videos || []).map((video) => ({
    title:
      video.title.length > 10 ? video.title.slice(0, 15) + "..." : video.title,
    revenue: calculateRevenue(video.views || 0, "video"),
  }));

  const shortRevenueData = (channelData?.shorts || []).map((short) => ({
    title:
      short.title.length > 10 ? short.title.slice(0, 10) + "..." : short.title,
    revenue: calculateRevenue(short.views || 0, "short"),
  }));

  const totalRevenue =
    videoRevenueData.reduce((sum, v) => sum + v.revenue, 0) +
    shortRevenueData.reduce((sum, v) => sum + v.revenue, 0);
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 text-white space-y-8 mb-[50px]">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <RiMoneyRupeeCircleFill className="text-orange-400" size={30} /> Revenue
        Analytics
      </h1>

      {/* Revenue rules */}

      <div className="bg-linear-to-r from-orange-700 to-orange-400 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          💡 Revenue Rules
        </h2>
        <ul>
          <li>{`🎥 Videos -> ₹50 per 1,000 views (after first 1,000)`}</li>
          <li>{`🎬 Shorts -> ₹50 per 1,0000 views (after first 1,0000)`}</li>
        </ul>
      </div>

      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Vieeo revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={"revenue"}
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Vieeo revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={"revenue"}
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[#0f0f0f] border border-gray-700 rounded-lg p-4 text-center">
        <h2 className="text-lg font-semibold mb-2">Total Estimated Revenue</h2>
        <p className="text-3xl font-bold text-yellow-400">₹ {totalRevenue}</p>
      </div>
    </div>
  );
}

export default Revenue;
