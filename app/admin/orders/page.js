import React from "react";
import { getOrdersAdmin, updateOrderStatusAdmin } from "@/actions/adminactions";
import { FiShoppingBag, FiClock, FiMapPin, FiPhone, FiTag, FiUser } from "react-icons/fi";

const statusColors = {
  "Pending": "bg-slate-50 text-slate-500 border-slate-200",
  "Processing": "bg-[#DEF9EC] text-[#3BB77E] border-green-100",
  "Out for Delivery": "bg-amber-50 text-amber-600 border-amber-100",
  "Delivered": "bg-green-600 text-white border-green-700 shadow-sm",
  "Cancelled": "bg-red-50 text-red-600 border-red-100",
};

export default async function OrdersPage() {
  const orders = await getOrdersAdmin();

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#253D4E] tracking-tight">Order Management</h1>
          <p className="text-sm font-bold text-gray-500 mt-2">Oversee and process live customer transactions</p>
        </div>
        <div className="bg-[#3BB77E] text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-xl shadow-green-100 border border-[#3BB77E]/20">
          <FiShoppingBag className="text-2xl" />
          <span className="font-black text-xl">{orders.length} <span className="opacity-80 font-bold">Orders</span></span>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead className="bg-[#f8f9fa]/60 border-b border-gray-100">
              <tr>
                <th className="py-7 px-10 text-[11px] font-black tracking-[0.2em] text-[#253D4E]/40 uppercase">Order Details</th>
                <th className="py-7 px-10 text-[11px] font-black tracking-[0.2em] text-[#253D4E]/40 uppercase">Customer Info</th>
                <th className="py-7 px-10 text-[11px] font-black tracking-[0.2em] text-[#253D4E]/40 uppercase">Line Items</th>
                <th className="py-7 px-10 text-[11px] font-black tracking-[0.2em] text-[#253D4E]/40 uppercase">Total</th>
                <th className="py-7 px-10 text-[11px] font-black tracking-[0.2em] text-[#253D4E]/40 uppercase text-right">Processing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-gray-400 font-bold">
                    <div className="flex flex-col items-center gap-4">
                       <FiShoppingBag className="text-5xl opacity-10" />
                       <p className="text-lg opacity-40">No fresh orders found.</p>
                    </div>
                  </td>
                </tr>
              )}
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium", timeStyle: "short"
                });
                return (
                  <tr key={order._id} className="hover:bg-green-50/20 transition-all duration-300 group">
                    <td className="py-7 px-10 align-top">
                      <div className="flex flex-col gap-3">
                        <span className="font-black text-[#3BB77E] bg-[#DEF9EC] px-4 py-2 rounded-xl text-xs w-fit border border-[#3BB77E]/10 tracking-wider">
                           #{String(order._id || "").slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 flex items-center gap-2"><FiClock className="text-[#3BB77E]/50" /> {date}</span>
                      </div>
                    </td>
                    <td className="py-7 px-10 align-top">
                      <div className="space-y-2">
                        <p className="font-black text-[#253D4E] text-sm flex items-center gap-2.5 tracking-tight group-hover:text-[#3BB77E] transition-colors"><FiUser className="text-gray-300" /> {order.userEmail}</p>
                        <p className="text-[11px] font-black text-gray-400 flex items-center gap-2.5 uppercase tracking-tighter"><FiPhone className="text-gray-200" /> +91 {order.phoneNumber}</p>
                        <p className="text-[11px] text-gray-400 font-bold flex items-start gap-3 max-w-[240px] leading-relaxed mt-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                           <FiMapPin className="text-gray-300 shrink-0 mt-0.5" />
                           <span className="line-clamp-2" title={order.address}>{order.address}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-7 px-10 align-top">
                      <div className="flex flex-col gap-3">
                        {order.items?.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-[12px] border-b border-gray-50/50 pb-3 last:border-0 last:pb-0">
                             <div className="flex items-center gap-3">
                               <span className="bg-gray-100 text-[#253D4E] px-2 py-1 rounded-lg font-black text-[10px] uppercase">x{item.quantity}</span>
                               <span className="font-bold text-gray-600 truncate max-w-[140px]" title={item.name}>
                                 {item.name}
                               </span>
                             </div>
                             <span className="text-gray-400 font-black tracking-tight shrink-0">₹{item.price * item.quantity}</span>
                           </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-7 px-10 align-top">
                      <div className="flex flex-col gap-2.5">
                        <p className="font-black text-[#253D4E] text-2xl tracking-tighter">₹{order.totalAmount}</p>
                        {order.couponCode && (
                          <div className="text-[9px] bg-green-50 text-[#3BB77E] font-black px-2.5 py-1.5 rounded-lg w-fit flex items-center gap-2 border border-green-100 uppercase tracking-[0.1em]">
                             <FiTag className="text-xs" /> {order.couponCode}
                          </div>
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full w-fit mt-2 border ${order.paymentMethod === 'COD' ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-50' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50'}`}>
                          {order.paymentMethod === 'COD' ? 'COD' : 'Paid'}
                        </span>
                      </div>
                    </td>
                    <td className="py-7 px-10 align-top">
                      <form action={updateOrderStatusAdmin} className="flex flex-col gap-4 items-end">
                        <input type="hidden" name="id" value={order._id} />
                        <select 
                           name="status"
                           defaultValue={order.status}
                           className={`text-[11px] font-black uppercase tracking-[0.2em] px-5 py-4 rounded-2xl outline-none shadow-lg cursor-pointer w-[200px] appearance-none focus:ring-8 focus:ring-[#3BB77E]/5 border transition-all duration-300 ${statusColors[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                        >
                           <option value="Pending" className="text-gray-700 bg-white">● &nbsp; Pending</option>
                           <option value="Processing" className="text-[#3BB77E] bg-white">● &nbsp; Processing</option>
                           <option value="Out for Delivery" className="text-amber-600 bg-white">● &nbsp; In Transit</option>
                           <option value="Delivered" className="text-green-700 bg-white">● &nbsp; Delivered</option>
                           <option value="Cancelled" className="text-red-700 bg-white">● &nbsp; Cancelled</option>
                        </select>
                        <button type="submit" className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all hover:text-[#3BB77E] transform translate-y-2 group-hover:translate-y-0">
                           Confirm Sync
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
