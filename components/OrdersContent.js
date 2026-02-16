"use client";
import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiCalendar,
  FiChevronRight,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { fetchUserOrders } from "@/actions/orderactions";
import Link from "next/link";

export default function OrdersContent() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const data = await fetchUserOrders(session.user.email);
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      }
      setLoading(false);
    };

    if (status !== "loading") {
      getOrders();
    }
  }, [session, status]);

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-[#253D4E]">
        <div className="animate-pulse">Loading your orders...</div>
      </div>
    );

  if (status !== "authenticated") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <FiUser className="text-gray-200 mb-6" size={80} />
        <h2 className="text-2xl font-black text-[#253D4E]">
          Login to see orders
        </h2>
        <p className="text-gray-400 font-bold mt-2 text-center max-w-sm">
          Please sign in to your account to view your purchase history.
        </p>
        <Link
          href="/"
          className="bg-[#3BB77E] text-white px-8 py-4 rounded-xl font-black mt-8 hover:bg-[#29A56C] shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-10 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 font-sans">
          <h1 className="text-3xl font-black text-[#253D4E]">My Orders</h1>
          <p className="text-sm text-gray-400 font-bold mt-1">
            Check the status of your recent deliveries
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Date(order.createdAt);
            const timeStr = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateStr = date.toDateString();

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row gap-4 items-center hover:shadow-md transition-shadow group"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={order.items[0]?.image}
                    alt={order.items[0]?.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-black text-[#253D4E] text-lg">
                    {order.items[0]?.name}{" "}
                    {order.items.length > 1 &&
                      `+ ${order.items.length - 1} more`}
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1 text-[10px] uppercase font-black tracking-widest text-gray-400">
                    <span>ID: #{order._id.slice(-6)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#3BB77E]">
                      <FiCalendar /> {dateStr}
                    </span>
                  </div>

                  <div className="flex justify-center md:justify-start gap-4 mt-3">
                    <span
                      className={`text-[10px] px-3 py-1 rounded-full font-black flex items-center gap-1 ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <FiPackage /> {order.status}
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-black flex items-center gap-1">
                      <FiClock /> {timeStr}
                    </span>
                  </div>
                </div>

                <div className="text-center md:text-right border-t md:border-none pt-4 md:pt-0 w-full md:w-auto">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">
                    Total Paid
                  </p>
                  <p className="font-black text-2xl text-[#253D4E]">
                    ₹{order.totalAmount}
                  </p>
                  {order.paymentMethod === "Online" && (
                    <span className="text-[9px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded uppercase">
                      Verified Online
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="text-gray-200" size={40} />
            </div>
            <h3 className="text-xl font-black text-[#253D4E]">
              No orders here yet!
            </h3>
            <p className="text-gray-400 font-bold mt-2 mb-8">
              Ready to start your first zap order?
            </p>
            <Link
              href="/"
              className="bg-[#3BB77E] text-white px-8 py-4 rounded-xl font-black hover:bg-[#29A56C] transition-all shadow-lg scale-100 hover:scale-105 active:scale-95"
            >
              Go Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
