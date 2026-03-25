import React from "react";
import { getOrdersAdmin, updateOrderStatusAdmin } from "@/actions/adminactions";
import { FiShoppingBag, FiClock, FiMapPin, FiPhone, FiMail, FiTag, FiUser } from "react-icons/fi";

const statusColors = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "Processing": "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  "Delivered": "bg-green-100 text-green-700",
  "Cancelled": "bg-red-100 text-red-700",
};

export default async function OrdersPage() {
  const orders = await getOrdersAdmin();

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#253D4E]">Order Management</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Review live customer orders easily</p>
        </div>
        <div className="bg-[#DEF9EC] text-[#3BB77E] px-5 py-3 rounded-xl flex items-center gap-3 shadow-sm border border-green-100">
          <FiShoppingBag className="text-xl" />
          <span className="font-black text-lg">{orders.length} Orders</span>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-[#f8f9fa] border-b border-gray-100">
              <tr>
                <th className="py-5 px-6 text-[11px] font-black tracking-widest text-[#253D4E]/60 uppercase">Order Info</th>
                <th className="py-5 px-6 text-[11px] font-black tracking-widest text-[#253D4E]/60 uppercase">Customer</th>
                <th className="py-5 px-6 text-[11px] font-black tracking-widest text-[#253D4E]/60 uppercase">Items</th>
                <th className="py-5 px-6 text-[11px] font-black tracking-widest text-[#253D4E]/60 uppercase">Amount</th>
                <th className="py-5 px-6 text-[11px] font-black tracking-widest text-[#253D4E]/60 uppercase text-right">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-gray-400 font-bold">
                    No recent orders found.
                  </td>
                </tr>
              )}
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium", timeStyle: "short"
                });
                return (
                  <tr key={order._id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="py-5 px-6 align-top">
                      <div className="flex flex-col gap-2">
                        <span className="font-black text-[#3BB77E] bg-[#DEF9EC] px-3 py-1 rounded-md text-xs w-fit">
                           #{String(order._id || "").slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5"><FiClock className="text-[#3BB77E]" /> {date}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <div className="space-y-1">
                        <p className="font-bold text-[#253D4E] text-sm flex items-center gap-2"><FiUser className="text-gray-400" /> {order.userEmail}</p>
                        <p className="text-xs font-bold text-gray-500 flex items-center gap-2"><FiPhone className="text-gray-400" /> {order.phoneNumber}</p>
                        <p className="text-[11px] text-gray-400 flex items-start gap-2 max-w-[220px] leading-snug mt-2 p-2 bg-gray-50 rounded-lg">
                           <FiMapPin className="text-gray-400 shrink-0 mt-0.5" />
                           <span className="line-clamp-2" title={order.address}>{order.address}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <div className="flex flex-col gap-2">
                        {order.items?.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                             <span className="font-bold text-gray-600 truncate max-w-[150px]" title={item.name}>
                               <span className="text-[#3BB77E]">x{item.quantity}</span> {item.name}
                             </span>
                             <span className="text-gray-400 font-black tracking-wide">₹{item.price * item.quantity}</span>
                           </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <div className="flex flex-col gap-1.5">
                        <p className="font-black text-[#253D4E] text-lg">₹{order.totalAmount}</p>
                        {order.couponCode && (
                          <div className="text-[10px] bg-green-50 text-[#3BB77E] font-black px-2 py-1 rounded w-fit flex items-center gap-1 border border-green-100">
                             <FiTag /> {order.couponCode} (-₹{order.discount})
                          </div>
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded w-fit mt-1 border ${order.paymentMethod === 'COD' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {order.paymentMethod === 'COD' ? 'Cash On Delivery' : 'Online Paid'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <form action={updateOrderStatusAdmin} className="flex flex-col gap-3 items-end">
                        <input type="hidden" name="id" value={order._id} />
                        <select 
                           name="status"
                           defaultValue={order.status}
                           className={`text-xs font-bold px-4 py-2.5 rounded-xl outline-none shadow-sm cursor-pointer w-[150px] appearance-none focus:ring-2 focus:ring-[#3BB77E]/20 transition-all ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                        >
                           <option value="Pending">🕒 Pending</option>
                           <option value="Processing">⏳ Processing</option>
                           <option value="Out for Delivery">🚚 Out For Delivery</option>
                           <option value="Delivered">✅ Delivered</option>
                           <option value="Cancelled">❌ Cancelled</option>
                        </select>
                        <button type="submit" className="text-[11px] text-gray-500 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#3BB77E]">
                           Update Status
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
