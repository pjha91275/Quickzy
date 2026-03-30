export const dynamic = "force-dynamic";
import React from "react";
import { RiMoneyRupeeCircleFill, RiShoppingBag3Fill, RiGroupFill, RiArchiveFill } from "react-icons/ri";
import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="p-6 rounded-2xl border bg-white flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${colorClass}`}>
      {icon}
    </div>
    <div className="shrink-0">
      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</h3>
      <p className="text-2xl font-black text-[#253D4E] leading-none">{value}</p>
    </div>
  </div>
);

export default async function AdminDashboard() {
  await connectDb();

  // Fetching real metrics concurrently for performance
  const [orders, productCount, userCount] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).lean(),
    Product.countDocuments(),
    User.countDocuments()
  ]);

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

  // Take top 5 for recent activity
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#253D4E]">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 font-bold mt-1">
          Welcome back, Admin. Here is what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Sales"
          value={`₹${totalSales.toLocaleString()}`}
          icon={<RiMoneyRupeeCircleFill className="text-[#3BB77E]" />}
          colorClass="bg-[#DEF9EC] shadow-inner"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={<RiShoppingBag3Fill className="text-blue-500" />}
          colorClass="bg-blue-50 shadow-inner"
        />
        <StatCard
          title="Total Products"
          value={productCount.toLocaleString()}
          icon={<RiArchiveFill className="text-purple-500" />}
          colorClass="bg-purple-50 shadow-inner"
        />
        <StatCard
          title="Total Users"
          value={userCount.toLocaleString()}
          icon={<RiGroupFill className="text-indigo-500" />}
          colorClass="bg-indigo-50 shadow-inner"
        />
      </div>

      {/* Recent Activity Section */}
      <div>
        <h2 className="text-xl font-black text-[#253D4E] mb-6">Recent Orders(Top 5)</h2>
        
        {recentOrders.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-400 font-bold border border-dashed border-gray-200">
            No recent orders to show just yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 border-b">
                    <th className="p-4 font-black">Order ID</th>
                    <th className="p-4 font-black">Date</th>
                    <th className="p-4 font-black">Amount</th>
                    <th className="p-4 font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-bold text-[#253D4E]">
                  {recentOrders.map((order) => (
                    <tr key={order._id?.toString()} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-4">#{order._id?.toString().slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-[#3BB77E]">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'Delivered' ? 'bg-[#DEF9EC] text-[#3BB77E]' :
                          order.status === 'Processing' ? 'bg-blue-50 text-blue-500' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-500' :
                          'bg-orange-50 text-orange-500'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
