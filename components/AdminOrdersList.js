"use client";
import React, { useState, useEffect } from "react";
import { updateOrderStatusAdmin } from "@/actions/adminactions";
import { 
  FiShoppingBag, FiClock, FiMapPin, FiPhone, 
  FiUser, FiArrowRight, FiCheckCircle, FiX, 
  FiMail, FiCreditCard, FiPackage,
  FiZap, FiAlertTriangle, FiArrowUpRight, FiLock
} from "react-icons/fi";
import { toast } from "react-toastify";
import { formatCurrency } from "@/lib/utils";

const statusColors = {
  "Pending": "bg-slate-50 text-slate-500 border-slate-200",
  "Processing": "bg-[#DEF9EC] text-[#3BB77E] border-green-100",
  "Delivered": "bg-green-600 text-white border-green-700",
  "Cancelled": "bg-red-50 text-red-600 border-red-100",
};

export default function AdminOrdersList({ initialOrders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusMap(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleSave = async (orderId) => {
    const newStatus = statusMap[orderId];
    if (!newStatus) return;

    try {
      const formData = new FormData();
      formData.append("id", orderId);
      formData.append("status", newStatus);
      
      const res = await updateOrderStatusAdmin(formData);
      if (res) {
        toast.success("Sync successful!");
        const newMap = { ...statusMap };
        delete newMap[orderId];
        setStatusMap(newMap);
      }
    } catch (error) {
      toast.error("Failed to sync status.");
    }
  };

  const getOrderStatusInfo = (order) => {
    const orderDate = new Date(order.createdAt);
    const orderSeed = parseInt(order._id.slice(-2), 16) || 0;
    const deliveryMinutes = (orderSeed % (15 - 8 + 1)) + 8;
    const timeDiffMs = Math.max(0, currentTime - orderDate);
    const timeDiffMins = Math.floor(timeDiffMs / 60000);
    const remainingMins = Math.max(0, deliveryMinutes - timeDiffMins);
    const isLockdown = remainingMins <= 0 && order.status !== "Pending";
    
    return { isLockdown, remainingMins };
  };

  return (
    <>
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left min-w-[1240px] table-fixed overflow-visible">
          <thead className="bg-[#f8f9fa]/80 border-b border-gray-100/50 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase w-[15%]">ID & Track</th>
              <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase w-[22%]">Customer Details</th>
              <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase w-[22%]">Cart Summary</th>
              <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase text-center w-[16%]">Payment</th>
              <th className="py-7 px-8 text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase text-right w-[25%]">Fulfillment Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50">
            {initialOrders.length === 0 && (
              <tr><td colSpan="5" className="py-24 text-center text-gray-400 font-bold">No live orders.</td></tr>
            )}
            {initialOrders.map((order) => {
              const { isLockdown } = getOrderStatusInfo(order);
              const date = new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata"
              });
              let currentUIStatus = statusMap[order._id] || order.status;
              
              const isNaturalDelivery = isLockdown && currentUIStatus === "Processing";
              if (isNaturalDelivery) {
                 currentUIStatus = "Delivered";
              }
              
              const hasChanged = statusMap[order._id] && statusMap[order._id] !== order.status;

              return (
                <tr key={order._id} className="hover:bg-[#DEF9EC]/10 transition-all duration-300 group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="py-8 px-8 align-top">
                    <div className="flex flex-col gap-4">
                      <span className="font-black text-[#3BB77E] bg-[#DEF9EC] px-3 py-1.5 rounded-xl text-[10px] w-fit border border-[#3BB77E]/10 tracking-widest uppercase">
                        #{String(order._id || "").slice(-6).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-[#3BB77E]/50 shrink-0" size={10} />
                        <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-8 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] shrink-0 border border-gray-100 group-hover:bg-white transition-all shadow-sm overflow-hidden text-center">
                        {order.userImage ? <img src={order.userImage} className="w-full h-full object-cover" /> : <FiUser size={18} />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-black text-[#253D4E] leading-tight break-all">{order.userEmail}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">+91 {order.phoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-8 align-top">
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px] bg-gray-50/50 p-2 rounded-xl">
                          <span className="font-black text-[#3BB77E]">x{item.quantity}</span>
                          <span className="font-bold text-[#253D4E] truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-8 px-8 align-top text-center">
                    <div className="flex flex-col items-center gap-2 bg-gray-50/40 p-3 rounded-2xl border border-gray-100/40 group-hover:bg-white transition-all">
                      <p className="font-black text-[#253D4E] text-lg">₹{formatCurrency(order.totalAmount)}</p>
                      <span className="text-[8px] font-black uppercase bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{order.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-8 px-8 align-top text-right overflow-visible">
                    <div className="flex flex-col gap-3 items-end" onClick={(e) => e.stopPropagation()}>
                      <div className="relative rounded-[2rem] w-[190px]">
                        <select
                          disabled={isLockdown || (order.status === "Cancelled" && order.cancelledBy === "user")}
                          value={currentUIStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-[9px] font-black uppercase tracking-[0.2em] pl-6 pr-10 py-3.5 rounded-[2rem] outline-none cursor-pointer w-full appearance-none border-2 transition-all ${statusColors[isLockdown && currentUIStatus !== "Cancelled" ? "Delivered" : currentUIStatus]}`}
                        >
                          {!isLockdown && (
                            <option value="Pending" className="bg-white text-gray-700">
                               ● &nbsp; Pending
                            </option>
                          )}
                          {!isLockdown && (
                            <option value="Processing" className="bg-white text-[#3BB77E]">
                               ● &nbsp; Processing
                            </option>
                          )}
                          <option value="Delivered" className="bg-white text-green-700">● &nbsp; Delivered Successfully</option>
                          <option value="Cancelled" className="bg-white text-red-700">● &nbsp; Cancelled</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          {isLockdown || (order.status === "Cancelled" && order.cancelledBy === "user") ? <FiLock size={10} className={isLockdown && currentUIStatus !== "Cancelled" ? "text-white" : ""} /> : <FiArrowRight size={10} />}
                        </div>
                      </div>
                      
                      {hasChanged && (
                        <button onClick={() => handleSave(order._id)} className="bg-[#3BB77E] text-white text-[9px] font-black uppercase tracking-widest px-5 py-2 rounded-xl shadow-lg shadow-green-100 active:scale-95 transition-all flex items-center gap-2">
                          <FiCheckCircle size={12} /> Sync Changes
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View with Sync Detail */}
      <div className="lg:hidden px-4 py-8 space-y-6">
        {initialOrders.map((order) => {
          const { isLockdown } = getOrderStatusInfo(order);
          let currentUIStatus = statusMap[order._id] || order.status;
          
          const isNaturalDelivery = isLockdown && (currentUIStatus === "Processing");
          if (isNaturalDelivery) {
             currentUIStatus = "Delivered";
          }
          
          const hasChanged = statusMap[order._id] && statusMap[order._id] !== order.status;
          return (
            <div key={order._id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl p-6 relative" onClick={() => setSelectedOrder(order)}>
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className="text-[10px] font-black text-[#3BB77E] tracking-widest uppercase mb-1 block">#{String(order._id || "").slice(-6).toUpperCase()}</span>
                    <p className="text-xl font-black text-[#253D4E] tracking-tighter">₹{formatCurrency(order.totalAmount)}</p>
                 </div>
                 <div className={`p-2 rounded-xl border ${statusColors[isLockdown && currentUIStatus !== "Cancelled" ? "Delivered" : currentUIStatus]}`}>
                    {isLockdown || (order.status === "Cancelled" && order.cancelledBy === "user") ? <FiLock size={18} className={isLockdown && currentUIStatus !== "Cancelled" ? "text-white" : ""} /> : <FiZap size={18} />}
                 </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] shrink-0 border border-gray-100 overflow-hidden">
                    {order.userImage ? <img src={order.userImage} className="w-full h-full object-cover" /> : <FiUser />}
                 </div>
                 <div className="min-w-0">
                    <span className="text-xs font-black text-[#253D4E] block truncate">{order.userEmail}</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">+91 {order.phoneNumber}</span>
                 </div>
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-gray-50" onClick={e => e.stopPropagation()}>
                <select
                  disabled={isLockdown || (order.status === "Cancelled" && order.cancelledBy === "user")}
                  value={currentUIStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={`text-[9px] font-black uppercase tracking-[0.1em] px-5 py-4 rounded-2xl appearance-none border-2 transition-all ${statusColors[isLockdown && currentUIStatus !== "Cancelled" ? "Delivered" : currentUIStatus]}`}
                >
                  {!isLockdown && (
                    <option value="Pending" className="bg-white text-gray-700">
                      Pending
                    </option>
                  )}
                  {!isLockdown && (
                    <option value="Processing" className="bg-white text-[#3BB77E]">
                      Processing
                    </option>
                  )}
                  <option value="Delivered">Delivered Successfully</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {hasChanged && (
                  <button onClick={() => handleSave(order._id)} className="bg-[#3BB77E] text-white py-4 rounded-xl font-black text-[10px] uppercase shadow-lg">
                    Confirm Sync
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manifest Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[110] bg-gray-900/40 backdrop-blur-sm overflow-y-auto py-4 sm:py-8 no-scrollbar scroll-smooth">
          <div className="fixed inset-0" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-[95%] sm:w-full lg:max-w-5xl xl:max-w-6xl mx-auto z-[120] h-min">
             <div className="w-full bg-[#F4F6FA] rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-white/20 animate-fade-up h-auto overflow-hidden">
                
                <header className="bg-white border-b px-5 py-4 xl:px-10 xl:py-6 flex justify-between items-center sm:rounded-t-[3rem] relative z-20">
                   <div className="flex items-center gap-3">
                      <div className="p-2 xl:p-2.5 bg-[#DEF9EC] text-[#3BB77E] rounded-xl"><FiShoppingBag className="w-4 h-4 xl:w-6 xl:h-6" /></div>
                      <div>
                        <h2 className="text-sm lg:text-sm xl:text-2xl font-black text-[#253D4E]">Detailed <span className="text-[#3BB77E]">Manifest</span></h2>
                        <p className="text-[7px] lg:text-[7px] xl:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5 xl:mt-1">Ref: #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedOrder(null)} className="p-2 xl:p-4 bg-red-50 text-red-500 rounded-xl xl:rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100 flex items-center gap-2 xl:gap-3 font-black text-[8px] xl:text-[12px] uppercase tracking-widest shrink-0">
                     <FiX className="w-3 h-3 xl:w-5 xl:h-5" /> Close Page
                   </button>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 xl:space-y-10 relative z-10 h-auto">
                   <div className="grid grid-cols-12 gap-6 xl:gap-10 items-start">
                      <div className="col-span-12 xl:col-span-7 bg-white rounded-[2rem] xl:rounded-[3rem] p-6 xl:p-10 border shadow-sm space-y-6 xl:space-y-10">
                        <div className="flex items-center gap-4 xl:gap-8 pb-6 xl:pb-10 border-b border-gray-50">
                           <div className="w-14 xl:w-24 h-14 xl:h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shrink-0 overflow-hidden shadow-inner">
                              {selectedOrder.userImage ? <img src={selectedOrder.userImage} className="w-full h-full object-cover" /> : <FiUser className="w-8 xl:w-16 h-8 xl:h-16" />}
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="font-black text-[#253D4E] text-xl xl:text-4xl leading-tight truncate capitalize">{selectedOrder.userEmail.split('@')[0]}</p>
                              <div className="flex flex-col gap-1.5 xl:gap-3 mt-2 xl:mt-4">
                                 <p className="text-[10px] xl:text-[13px] font-bold text-[#3BB77E] flex items-center gap-2 break-all"><FiMail className="w-3 xl:w-4 h-3 xl:h-4"/> {selectedOrder.userEmail}</p>
                                 <p className="text-[10px] xl:text-[12px] font-black text-gray-400 flex items-center gap-2 tracking-widest"><FiPhone className="text-[#3BB77E] w-3 xl:w-4 h-3 xl:h-4"/> +91 {selectedOrder.phoneNumber}</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6 xl:space-y-8">
                           <div className="bg-gray-50 p-6 xl:p-8 rounded-[2rem] xl:rounded-[3rem] border border-gray-100 relative overflow-hidden group">
                              <h4 className="text-[9px] xl:text-[11px] font-black text-gray-400 uppercase tracking-[3px] mb-2 xl:mb-4 flex items-center gap-2"><FiMapPin className="text-[#3BB77E]" /> Shipping Link</h4>
                              <p className="text-xs xl:text-xl font-black text-[#253D4E] leading-relaxed relative z-10">{selectedOrder.address}</p>
                           </div>

                           <div className="grid grid-cols-2 gap-4 xl:gap-6">
                              <div className="bg-white p-4 xl:p-6 rounded-[1.5rem] xl:rounded-[2rem] border border-gray-100 flex items-center gap-3 xl:gap-5 shadow-sm">
                                <div className="w-8 xl:w-12 h-8 xl:h-12 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] shrink-0"><FiClock className="w-4 xl:w-6 h-4 xl:h-6"/></div>
                                <div className="min-w-0">
                                   <h4 className="text-[8px] xl:text-[9px] font-black text-gray-400 uppercase">Book Date</h4>
                                   <p className="text-[10px] xl:text-sm font-black text-[#253D4E] truncate">{new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}</p>
                                </div>
                              </div>
                              <div className="bg-white p-4 xl:p-6 rounded-[1.5rem] xl:rounded-[2rem] border border-gray-100 flex items-center gap-3 xl:gap-5 shadow-sm">
                                <div className="w-8 xl:w-12 h-8 xl:h-12 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] shrink-0"><FiZap className="w-4 xl:w-6 h-4 xl:h-6"/></div>
                                <div className="min-w-0">
                                   <h4 className="text-[8px] xl:text-[9px] font-black text-gray-400 uppercase">Live State</h4>
                                   <p className="text-[10px] xl:text-sm font-black text-[#3BB77E] uppercase tracking-widest truncate">
                                      {(getOrderStatusInfo(selectedOrder).isLockdown && selectedOrder.status === "Processing") || selectedOrder.status === "Delivered" ? "Delivered Successfully" : selectedOrder.status}
                                   </p>
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="col-span-12 xl:col-span-5 space-y-6 lg:space-y-10">
                         <div className="bg-white rounded-[2rem] xl:rounded-[3rem] p-6 lg:p-8 border shadow-sm">
                            <h3 className="text-[10px] xl:text-[11px] font-black text-gray-400 uppercase tracking-[3px] mb-6 xl:mb-8 flex items-center gap-2"><FiPackage className="text-[#3BB77E]"/> Cart Items</h3>
                            <div className="space-y-4 xl:space-y-6">
                               {selectedOrder.items?.map((item, idx) => (
                                 <div key={idx} className="flex gap-3 xl:gap-5 items-center bg-gray-50/50 p-4 xl:p-5 rounded-[1.5rem] lg:rounded-[2rem] border border-gray-50 overflow-hidden">
                                   <div className="w-12 xl:w-16 h-12 xl:h-16 bg-white rounded-xl xl:rounded-2xl border border-gray-100 p-2 shrink-0 shadow-sm text-center">
                                      <img src={item.image} className="w-full h-full object-contain mx-auto" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <div className="overflow-x-auto no-scrollbar py-1">
                                         <p className="font-black text-[#253D4E] text-[12px] xl:text-base whitespace-nowrap" title={item.name}>
                                            {item.name}
                                         </p>
                                      </div>
                                      <p className="text-[9px] xl:text-[12px] font-bold text-[#3BB77E] mt-0.5 xl:mt-1 tracking-wider uppercase">x{item.quantity} Qty</p>
                                   </div>
                                   <p className="font-black text-[#253D4E] text-[11px] xl:text-base shrink-0 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                      ₹{formatCurrency(item.price * item.quantity)}
                                   </p>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="bg-[#253D4E] rounded-[2rem] xl:rounded-[3rem] p-6 xl:p-10 text-white shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <div className="hidden xl:block"><FiCreditCard size={120} /></div>
                                <div className="hidden lg:xl:hidden lg:block"><FiCreditCard size={100} /></div>
                                <div className="hidden md:lg:hidden md:block"><FiCreditCard size={30} /></div>
                                <div className="md:hidden"><FiCreditCard size={60} /></div>
                             </div>
                            <div className="relative z-10">
                               <div className="flex justify-between items-center mb-6 xl:mb-10 border-b border-white/10 pb-6 xl:pb-10">
                                  <div>
                                     <span className="text-[9px] xl:text-[10px] font-black text-white/40 uppercase tracking-[3px] xl:tracking-[5px] block mb-1 xl:mb-2">Invoice Amount</span>
                                     <span className="text-2xl lg:text-3xl xl:text-5xl font-black tracking-tighter text-[#3BB77E]">₹{formatCurrency(selectedOrder.totalAmount || 0)}</span>
                                  </div>
                                  <div className="bg-white/10 px-3 py-2 xl:px-6 xl:py-4 rounded-xl lg:rounded-2xl border border-white/10 text-center shrink-0">
                                     <span className="text-[9px] xl:text-[11px] font-black uppercase tracking-widest text-[#3BB77E] outline-none">{selectedOrder.paymentStatus || 'CREDITED'}</span>
                                  </div>
                               </div>
                               <div className="grid grid-cols-2 gap-4 xl:gap-8">
                                  <div className="space-y-1 xl:space-y-2">
                                     <p className="text-[7px] lg:text-[7px] xl:text-[9px] font-black text-white/40 uppercase tracking-[4px]">Method</p>
                                     <div className="bg-white/5 py-2.5 xl:py-4 px-4 xl:px-6 rounded-xl xl:rounded-2xl font-black text-[8px] lg:text-[8px] xl:text-[11px] uppercase tracking-widest border border-white/5 truncate">
                                        {selectedOrder.paymentMethod} PAY
                                     </div>
                                  </div>
                                  <div className="space-y-1 xl:space-y-2">
                                     <p className="text-[7px] lg:text-[7px] xl:text-[9px] font-black text-white/40 uppercase tracking-[4px] text-right">Privacy</p>
                                     <div className="bg-white/5 py-2.5 xl:py-4 px-4 xl:px-6 rounded-xl xl:rounded-2xl font-black text-[8px] lg:text-[8px] xl:text-[11px] uppercase tracking-widest border border-white/5 text-right flex items-center justify-end gap-1 xl:gap-2">
                                        <FiCheckCircle size={14} className="text-[#3BB77E]" /> SECURE
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <footer className="p-6 xl:p-10 border-t bg-white sm:rounded-b-[3rem] text-center shrink-0 h-auto">
                   <p className="text-[7px] lg:text-[7px] xl:text-[9px] font-black text-gray-300 uppercase tracking-[6px] xl:tracking-[8px] mb-2">Authenticated Quickzy Admin Access</p>
                   <p className="text-[9px] lg:text-[9px] xl:text-[11px] font-black text-[#253D4E]/20">Manifest Zap Sync Engine v6.2</p>
                </footer>
             </div>
          </div>
          
          <style jsx>{`
            .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            :global(body) { overflow: hidden; }
          `}</style>
        </div>
      )}
    </>
  );
}
