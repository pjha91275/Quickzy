import React from "react";
import { getOrdersAdmin, updateOrderStatusAdmin } from "@/actions/adminactions";
import { FiShoppingBag, FiClock, FiMapPin, FiPhone, FiTag, FiUser, FiArrowRight, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const statusColors = {
  "Pending": "bg-slate-50 text-slate-500 border-slate-200",
  "Processing": "bg-[#DEF9EC] text-[#3BB77E] border-green-100",
  "Out for Delivery": "bg-amber-50 text-amber-600 border-amber-100",
  "Delivered": "bg-green-600 text-white border-green-700",
  "Cancelled": "bg-red-50 text-red-600 border-red-100",
};

export default async function OrdersPage() {
  const orders = await getOrdersAdmin();

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 xl:px-0">
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

      {/* Main Container - Responsive View */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white shadow-2xl shadow-gray-200/60 overflow-hidden">

        {/* desktop table view */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left min-w-[1240px] table-fixed overflow-visible">
            <thead className="bg-[#f8f9fa]/80 border-b border-gray-100/50 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase w-[13%]">ID & Time</th>
                <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase w-[21%]">Customer</th>
                <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase w-[22%]">Items List</th>
                <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase text-center w-[19%]">Amount</th>
                <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase text-right w-[25%]">Fulfillment Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-24 text-center text-gray-400 font-bold">
                    No orders found.
                  </td>
                </tr>
              )}
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium", timeStyle: "short"
                });
                return (
                  <tr key={order._id} className="hover:bg-[#DEF9EC]/10 transition-all duration-300 group">
                    <td className="py-8 px-8 align-top">
                      <div className="flex flex-col gap-4">
                        <span className="font-black text-[#3BB77E] bg-[#DEF9EC] px-4 py-2 rounded-xl text-xs w-fit border border-[#3BB77E]/10 tracking-widest">
                          #{String(order._id || "").slice(-6).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2 min-w-0">
                          <FiClock className="text-[#3BB77E]/50 shrink-0" />
                          <span className="text-[11px] font-bold text-gray-400 truncate">{date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-8 align-top">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-2xl bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] shrink-0 border border-gray-100 group-hover:bg-white transition-all shadow-sm overflow-hidden">
                            {order.userImage ? (
                              <img src={order.userImage} alt={order.userEmail} className="w-full h-full object-cover" />
                            ) : (
                              <FiUser className="text-sm" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black text-[#253D4E] truncate" title={order.userEmail}>{order.userEmail}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter opacity-70">+91 {order.phoneNumber}</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-gray-400 font-bold bg-gray-50/60 p-4 rounded-2xl border border-gray-100/50 leading-relaxed group-hover:bg-white transition-all shadow-sm">
                          <span className="line-clamp-2" title={order.address}>{order.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-8 align-top min-w-0">
                      <div className="flex flex-col gap-3 max-h-[160px] overflow-y-auto no-scrollbar scroll-smooth">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] bg-gray-50/50 p-3 rounded-2xl border border-transparent hover:bg-white hover:border-gray-100 transition-all cursor-default">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="bg-white text-[#3BB77E] px-2 py-0.5 rounded-lg font-black border border-gray-100 shadow-sm text-[9px] uppercase">x{item.quantity}</span>
                              <span className="font-bold text-[#253D4E] truncate min-w-0" title={item.name}>{item.name}</span>
                            </div>
                            <span className="text-gray-400 font-black tracking-tight ml-2 shrink-0">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-8 px-8 align-top text-center">
                      <div className="flex flex-col items-center gap-3 bg-gray-50/40 p-4 rounded-3xl border border-gray-100/40 group-hover:bg-white transition-all">
                        <p className="font-black text-[#253D4E] text-2xl tracking-tighter">₹{order.totalAmount}</p>
                        <span className={`text-[9px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border shadow-sm ${order.paymentMethod === 'COD' ? 'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-50/40' : 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50/40'}`}>
                          {order.paymentMethod} Payment
                        </span>
                      </div>
                    </td>
                    <td className="py-8 px-8 align-top text-right overflow-visible">
                      <form action={updateOrderStatusAdmin} className="flex flex-col gap-4 items-end overflow-visible">
                        <input type="hidden" name="id" value={order._id} />
                        <div className="relative group/sel rounded-[2rem] overflow-visible">
                          <select
                            name="status"
                            defaultValue={order.status}
                            className={`text-[11px] font-black uppercase tracking-[0.28em] pl-7 pr-12 py-5 rounded-[2rem] outline-none cursor-pointer w-[220px] appearance-none border-2 transition-all duration-300 active:scale-95 ${statusColors[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                          >
                            <option value="Pending" className="text-gray-700 bg-white">● &nbsp; Pending</option>
                            <option value="Processing" className="text-[#3BB77E] bg-white font-black">● &nbsp; Processing</option>
                            <option value="Out for Delivery" className="text-amber-600 bg-white">● &nbsp; In Transit</option>
                            <option value="Delivered" className="text-green-700 bg-white">● &nbsp; Delivered</option>
                            <option value="Cancelled" className="text-red-700 bg-white">● &nbsp; Cancelled</option>
                          </select>
                          <div className="absolute right-7 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 bg-white/20 p-1.5 rounded-full">
                            <FiArrowRight className="text-sm" />
                          </div>
                        </div>
                        <button type="submit" className="text-[10px] text-[#3BB77E] font-black uppercase tracking-[0.45em] flex items-center gap-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 pr-6 mt-1">
                          <FiCheckCircle className="text-sm" /> Save FulFillment
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* mobile card view */}
        <div className="lg:hidden p-5 space-y-6">
          {orders.length === 0 && (
            <div className="py-20 text-center text-gray-300 font-bold">No live orders.</div>
          )}
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium", timeStyle: "short"
            });
            return (
              <div key={order._id} className="bg-white rounded-[2rem] min-[400px]:rounded-[2.5rem] border border-gray-100 shadow-xl p-4 min-[400px]:p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-[#3BB77E] tracking-widest uppercase">#{String(order._id || "").slice(-6).toUpperCase()}</span>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-widest leading-none"><FiClock className="text-[#3BB77E]/50" /> {date}</span>
                  </div>
                  <p className="text-2xl font-black text-[#253D4E] tracking-tighter">₹{order.totalAmount}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] border border-gray-100 shrink-0 overflow-hidden shadow-sm">
                      {order.userImage ? (
                        <img src={order.userImage} alt={order.userEmail} className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="text-lg" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black text-[#253D4E] truncate">{order.userEmail}</span>
                      <span className="text-[11px] font-black text-gray-400 tracking-widest">+91 {order.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3 border border-gray-100/50">
                    <FiMapPin className="text-[#3BB77E] text-xs mt-1 shrink-0" />
                    <p className="text-xs font-bold text-gray-400 leading-relaxed line-clamp-2">{order.address}</p>
                  </div>

                  <form action={updateOrderStatusAdmin} className="flex items-center gap-3 pt-4">
                    <input type="hidden" name="id" value={order._id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className={`text-[9px] min-[380px]:text-[10px] font-black uppercase tracking-[0.05em] min-[380px]:tracking-[0.2em] px-3 min-[380px]:px-6 py-4 rounded-2xl outline-none cursor-pointer flex-1 appearance-none border-2 transition-all ${statusColors[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                    >
                      <option value="Pending">● &nbsp; Pending</option>
                      <option value="Processing">● &nbsp; Processing</option>
                      <option value="Out for Delivery">● &nbsp; In Transit</option>
                      <option value="Delivered">● &nbsp; Delivered</option>
                      <option value="Cancelled">● &nbsp; Cancelled</option>
                    </select>
                    <button type="submit" className="bg-[#3BB77E] text-white p-3 min-[380px]:p-4 rounded-2xl shadow-lg shadow-green-100 active:scale-90 transition-all">
                      <FiCheckCircle className="text-lg" />
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
