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

  const [refresh, setRefresh] = useState(0);

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

    // Live countdown refresh every 1 minute
    const interval = setInterval(() => {
      setRefresh(prev => prev + 1);
    }, 60000);

    // Instant refresh when user comes back to the tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setRefresh(prev => prev + 1);
      }
    };
    window.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", handleVisibility);
    };
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

        <div className="space-y-6">
          {orders.map((order) => {
            const orderDate = new Date(order.createdAt);
            const now = new Date();
            
            // Pseudo-random delivery time between 8 and 15 mins based on last 2 chars of Order ID
            const orderSeed = parseInt(order._id.slice(-2), 16) || 0;
            const deliveryMinutes = (orderSeed % (15 - 8 + 1)) + 8;
            
            const timeDiffMs = Math.max(0, now - orderDate); // Guard against future server clock
            const timeDiffMins = Math.floor(timeDiffMs / 60000);
            const remainingMins = Math.max(0, deliveryMinutes - timeDiffMins);
            const isDelivered = remainingMins <= 0;

            const timeStr = orderDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const arrivalTime = new Date(orderDate.getTime() + deliveryMinutes * 60000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateStr = orderDate.toDateString();

            return (
              <div
                key={order._id}
                className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 group mb-6"
              >
                {/* Order Header */}
                <div className="bg-gray-50/50 p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
                   <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 text-[#253D4E]">
                         ID: <span className="text-[#3BB77E]">#{order._id.slice(-6)}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 text-[#253D4E]">
                         <FiCalendar className="text-[#3BB77E]" /> {dateStr}
                      </div>
                      
                      {isDelivered ? (
                        <div className="flex items-center gap-2 bg-[#3BB77E] px-4 py-1.5 rounded-full border border-[#3BB77E]/20 text-white shadow-lg shadow-green-100">
                           <FiCheckCircle /> Delivered Sucessfully
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#DEF9EC] px-4 py-1.5 rounded-full border border-[#3BB77E]/20 text-[#3BB77E] animate-pulse">
                           <FiTruck /> Arriving in {remainingMins} mins
                        </div>
                      )}
                   </div>
                   <div className="text-[#253D4E] font-black text-xl">
                      Total: ₹{order.totalAmount}
                   </div>
                </div>

                {/* Individual Item Cards Grouped */}
                <div className="p-6 space-y-4">
                   {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center bg-gray-50/30 p-4 rounded-2xl border border-transparent hover:border-[#DEF9EC] transition-all">
                         <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 p-2 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-[#253D4E] text-sm leading-tight">{item.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{item.category} • {item.unit || "Single Unit"}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-[#253D4E]">₹{item.price}</p>
                            <p className="text-[10px] text-gray-400 font-bold">Qty: 1</p>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Timing Footer */}
                <div className="px-8 py-3 bg-slate-800 text-white flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <div className="flex items-center gap-2">
                      <FiClock className="text-[#3BB77E]" /> Ordered At: {timeStr}
                   </div>
                   <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-[#3BB77E]" /> Estimated Arrival: {arrivalTime}
                   </div>
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
