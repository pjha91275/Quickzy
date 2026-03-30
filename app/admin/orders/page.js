export const dynamic = "force-dynamic";
import React from "react";
import { getOrdersAdmin } from "@/actions/adminactions";
import { FiShoppingBag } from "react-icons/fi";
import AdminOrdersList from "@/components/AdminOrdersList";

export default async function OrdersPage() {
  const orders = await getOrdersAdmin();

  return (
    <div className="max-w-7xl mx-auto pb-20 px-0 min-[400px]:px-4 xl:px-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#253D4E] tracking-tight mb-1">
            Live <span className="text-[#3BB77E]">Orders</span>
          </h1>
          <p className="text-sm md:text-base font-bold text-gray-500">
            Real-time management dashboard for store transactions.
          </p>
        </div>
        <div className="bg-[#3BB77E] text-white px-5 py-3 rounded-[1.4rem] flex items-center gap-3 shadow-lg shadow-green-200/40 border border-white/10 self-start md:self-center transition-transform hover:scale-105 duration-300">
          <div className="bg-white/10 p-2 rounded-xl">
            <FiShoppingBag className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl leading-none">{orders.length}</span>
            <span className="text-[10px] uppercase font-black tracking-widest opacity-80 mt-1">Total Orders</span>
          </div>
        </div>
      </div>

      {/* Responsive Orders Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white shadow-2xl shadow-gray-200/60 overflow-hidden">
         <AdminOrdersList initialOrders={orders} />
      </div>
    </div>
  );
}
