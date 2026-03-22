import React from "react";
import { FiTrendingUp, FiShoppingBag, FiUsers, FiBox } from "react-icons/fi";

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="p-6 rounded-2xl border bg-white flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
      <p className="text-2xl font-black text-[#253D4E]">{value}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#253D4E]">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Welcome back, Admin. Here is what's happening today.
        </p>
      </div>

      {/* Stats Grid - Using exact identical styling from project */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value="₹0"
          icon={<FiTrendingUp />}
          colorClass="bg-[#DEF9EC] text-[#3BB77E]"
        />
        <StatCard
          title="Total Orders"
          value="0"
          icon={<FiShoppingBag />}
          colorClass="bg-blue-50 text-blue-500"
        />
        <StatCard
          title="Total Products"
          value="0"
          icon={<FiBox />}
          colorClass="bg-purple-50 text-purple-500"
        />
        <StatCard
          title="Total Users"
          value="0"
          icon={<FiUsers />}
          colorClass="bg-orange-50 text-orange-500"
        />
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-black text-[#253D4E] mb-4">Recent Orders</h2>
        <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-400 font-bold border border-dashed border-gray-200">
          No recent orders to show just yet.
        </div>
      </div>
    </div>
  );
}
