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
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { fetchUserOrders } from "@/actions/orderactions";
import Link from "next/link";

export default function OrdersContent() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserOrders(session.user.email).then((data) => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [session]);

  if (loading)
    return (
      <div className="text-center py-20 font-bold">Loading your orders...</div>
    );

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black text-[#253D4E] mb-8">My Orders</h1>

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
                className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row gap-4 items-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden p-2">
                  <img
                    src={order.items[0]?.image}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-black text-[#253D4E]">
                    {order.items[0]?.name}{" "}
                    {order.items.length > 1 &&
                      `+ ${order.items.length - 1} more`}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    ID: #{order._id.slice(-6)}
                  </p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black">
                      {order.status}
                    </span>
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-black flex items-center gap-1">
                      <FiClock /> {timeStr}
                    </span>
                  </div>
                </div>

                <div className="text-right border-t md:border-none pt-4 md:pt-0 w-full md:w-auto">
                  <p className="text-[10px] text-gray-400 font-black uppercase">
                    Paid
                  </p>
                  <p className="font-black text-xl text-[#253D4E]">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400">
                    {dateStr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border">
            <FiShoppingBag className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="font-bold text-gray-400">No orders here yet!</p>
            <Link href="/" className="text-[#3BB77E] font-bold underline">
              Go Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
