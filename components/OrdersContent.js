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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3BB77E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-10 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-black text-[#253D4E] mb-8">
          Order History
        </h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const dateObj = new Date(order.createdAt);
            const formattedDate = dateObj.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            });
            const formattedTime = dateObj.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            const expDate = new Date(order.expectedDelivery);
            const expTime = expDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center border overflow-hidden p-2 group-hover:bg-[#DEF9EC] transition-colors">
                    {order.items[0]?.image ? (
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <FiPackage size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors">
                      {order.items[0]?.name || "Product Name"}
                      {order.items.length > 1 && (
                        <span className="text-xs font-bold text-gray-400 ml-2">
                          +{order.items.length - 1} more
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      Order ID: #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {order.status === "Delivered" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiTruck className="animate-pulse" />
                        )}
                        {order.status}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md">
                        <FiClock className="text-xs" /> Exp: {expTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <p className="font-black text-[#253D4E] text-lg">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      Placed On
                    </p>
                    <div className="flex flex-col text-xs font-bold text-[#253D4E]">
                      <span>{formattedDate}</span>
                      <span className="text-[10px] opacity-50">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                  <FiChevronRight
                    className="text-gray-300 group-hover:text-[#3BB77E] group-hover:translate-x-1 transition-all"
                    strokeWidth={3}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border shadow-sm mt-10">
            <FiShoppingBag className="mx-auto text-gray-100 mb-6" size={80} />
            <h3 className="text-2xl font-black text-gray-300">
              No orders placed yet
            </h3>
            <p className="text-gray-400 font-bold mb-8 italic">
              Your shopping bag is waiting!
            </p>
            <Link
              href="/"
              className="bg-[#3BB77E] text-white px-8 py-3 rounded-xl font-black hover:bg-[#253D4E] transition shadow-lg inline-flex items-center gap-2"
            >
              Start Shopping <FiChevronRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
