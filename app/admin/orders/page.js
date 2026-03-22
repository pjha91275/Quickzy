import React from "react";
import { getOrdersAdmin, updateOrderStatusAdmin } from "@/actions/adminactions";
import { FiShoppingBag, FiClock, FiMapPin, FiPhone } from "react-icons/fi";

const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "Processing": "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  "Delivered": "bg-[#DEF9EC] text-[#3BB77E]",
  "Cancelled": "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const orders = await getOrdersAdmin();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">Order Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Review and update live customer orders</p>
        </div>
        <div className="bg-[#DEF9EC] px-5 py-3 rounded-2xl border border-green-100 flex items-center gap-3 text-sm font-black text-[#253D4E] shadow-sm">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3BB77E] shadow-sm">
            <FiShoppingBag className="text-lg" /> 
          </div>
          {orders.length} Total Orders
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F4F6FA] border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest rounded-tl-3xl">Order Info</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer Details</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Items Cart</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Amount & Payment</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right rounded-tr-3xl">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 font-black">No recent orders placed.</td>
                </tr>
              ) : null}
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
                return (
                  <tr key={order._id} className="hover:bg-[#F2FBF6] transition-colors group">
                    <td className="p-5 align-top">
                      <p className="font-black text-[#253D4E] text-[13px] tracking-wide mb-1 flex items-center gap-1">
                         #{(order._id || "").slice(-6).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest mt-1">
                        <FiClock /> {date}
                      </p>
                    </td>
                    <td className="p-5 align-top">
                      <p className="text-[13px] font-black text-gray-800 break-all mb-1">{order.userEmail}</p>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mb-2 mt-1.5">
                        <FiPhone className="text-gray-400 shrink-0" /> {order.phoneNumber}
                      </p>
                      <div className="flex items-start gap-1.5 bg-white border border-gray-100 p-2 rounded-xl">
                         <FiMapPin className="text-gray-400 mt-0.5 shrink-0 text-xs" />
                         <p className="text-[10px] text-gray-500 leading-tight font-bold max-w-[200px]">{order.address}</p>
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto no-scrollbar select-none pr-2">
                        {order.items?.map((item, idx) => (
                           <p key={idx} className="text-[12px] font-bold text-[#253D4E] flex items-center gap-2">
                             <span className="text-white bg-[#3BB77E] px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums">x{item.quantity}</span> 
                             <span className="truncate max-w-[150px]">{item.name}</span>
                           </p>
                        ))}
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      <p className="font-black text-[#253D4E] text-lg mb-2">₹{order.totalAmount}</p>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                        order.paymentMethod === "COD" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-blue-50 border-blue-200 text-blue-600"
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-5 align-top text-right min-w-[180px]">
                      {/* Server Action Form replacing Client AJAX logic to fit Next.js standard */}
                      <form action={updateOrderStatusAdmin} className="flex flex-col items-end gap-2">
                        <input type="hidden" name="id" value={order._id} />
                        <select 
                           name="status"
                           defaultValue={order.status}
                           className={`outline-none border-none text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl cursor-pointer shadow-sm focus:ring-4 focus:ring-[#3BB77E]/20 appearance-none text-center block w-full transition-colors ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                        >
                           <option value="Pending">Pending</option>
                           <option value="Processing">Processing</option>
                           <option value="Out for Delivery">Out For Delivery</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                        </select>
                        <button type="submit" className="text-[10px] uppercase font-black tracking-widest text-[#3BB77E] opacity-0 group-hover:opacity-100 transition-opacity hover:underline mt-1">
                          Apply Status
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
