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
  FiFileText,
  FiPrinter,
  FiX,
  FiShield,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { fetchUserOrders } from "@/actions/orderactions";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function OrdersContent() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

    const interval = setInterval(() => {
      setRefresh(prev => prev + 1);
    }, 60000);

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
      <div id="orders-page-content" className="container mx-auto px-4 max-w-4xl print:hidden">
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
            
            const orderSeed = parseInt(order._id.slice(-2), 16) || 0;
            const deliveryMinutes = (orderSeed % (15 - 8 + 1)) + 8;
            
            const timeDiffMs = Math.max(0, now - orderDate);
            const timeDiffMins = Math.floor(timeDiffMs / 60000);
            const remainingMins = Math.max(0, deliveryMinutes - timeDiffMins);
            const isDelivered = order.status === "Delivered" || (order.status === "Processing" && remainingMins <= 0);

            const timeStr = orderDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata"
            });
            const arrivalTime = new Date(orderDate.getTime() + deliveryMinutes * 60000).toLocaleString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata"
            });
            const dateStr = orderDate.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

            return (
              <div
                key={order._id}
                className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 group mb-6"
              >
                {/* Order Header */}
                <div className="bg-gray-50/50 p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
                   <div className="flex items-center justify-between w-full md:w-auto gap-4 text-[10px] md:text-[12px] font-black uppercase tracking-widest text-gray-400">
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 text-[#253D4E] shadow-sm">
                         {/* STANDARDIZED ID: last 6 characters uppercase */}
                         ID: <span className="text-[#3BB77E]">#{order._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 text-[#253D4E] shadow-sm">
                         <FiCalendar className="text-[#3BB77E]" /> {dateStr}
                      </div>
                   </div>

                   <div className="w-full md:w-auto text-center">
                      {order.status === "Pending" ? (
                         <div className="flex items-center justify-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 text-slate-500 font-black shadow-sm">
                            <FiClock className="animate-pulse" /> Order Pending
                         </div>
                      ) : order.status === "Cancelled" ? (
                         <div className="flex items-center justify-center gap-2 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 text-red-600 font-black shadow-lg">
                            <FiX /> Order Cancelled
                         </div>
                      ) : isDelivered ? (
                        <div className="flex items-center justify-center gap-2 bg-[#3BB77E] px-4 py-1.5 rounded-full border border-[#3BB77E]/20 text-white shadow-lg shadow-green-100">
                           <FiCheckCircle /> Delivered Successfully
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 bg-[#DEF9EC] px-4 py-1.5 rounded-full border border-[#3BB77E]/20 text-[#3BB77E] animate-pulse">
                           <FiTruck /> Arriving in {remainingMins} mins
                        </div>
                      )}
                   </div>

                    <div className="flex flex-wrap items-center justify-between md:justify-end w-full md:w-auto gap-4 mt-2 md:mt-0">
                       <div className="text-[#253D4E] font-black text-xl">
                         ₹{formatCurrency(order.totalAmount)}
                       </div>
                       <div className="flex items-center gap-3">
                          {order.status !== "Delivered" && order.status !== "Cancelled" && (
                            <button 
                               onClick={async (e) => {
                                  e.stopPropagation();
                                  if(confirm("Are you sure you want to cancel this order?")) {
                                     const { cancelOrderUser } = await import("@/actions/orderactions");
                                     const res = await cancelOrderUser(order._id);
                                     if(res.success) {
                                        const { toast } = await import("react-toastify");
                                        toast.success("Order cancelled successfully");
                                        setRefresh(prev => prev + 1);
                                     }
                                  }
                               }}
                               className="flex items-center gap-2 bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all px-4 py-2 rounded-xl text-xs font-black uppercase"
                            >
                               <FiX /> Cancel
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedInvoice(order)}
                            className="flex items-center gap-2 bg-white border-2 border-slate-100 hover:border-[#3BB77E] hover:text-[#3BB77E] transition-all px-4 py-2 rounded-xl text-xs font-black uppercase"
                          >
                             <FiFileText /> Invoice
                          </button>
                       </div>
                    </div>
                 </div>

                <div className="p-6 space-y-4">
                   {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center bg-gray-50/30 p-4 rounded-2xl border border-transparent hover:border-[#DEF9EC] transition-all">
                         <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 p-2 flex-shrink-0">
                            <img 
                              src={(item.image || "").startsWith("http") ? item.image : `https://res.cloudinary.com/dnafzpa8x/image/upload/${(item.image || "").startsWith("/") ? item.image.slice(1) : item.image || "v1774149230/quickzy/brand/logo_without_name.png"}`} 
                              alt={item.name} 
                              className="w-full h-full object-contain mx-auto" 
                            />
                         </div>
                         <div className="flex-1">
                            <Link href={`/product/${item.productId || (item._id || item.id)}`} className="hover:text-[#3BB77E] transition-colors">
                              <h4 className="font-bold text-[#253D4E] text-sm leading-tight">{item.name}</h4>
                            </Link>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{item.category} • {item.unit || "Single Unit"}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-[#253D4E]">₹{formatCurrency(item.price)}</p>
                            <p className="text-[10px] text-gray-400 font-bold">Qty: {item.quantity || 1}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="px-8 py-3 bg-slate-800 text-white flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <div className="flex items-center gap-2">
                      <FiClock className="text-[#3BB77E]" /> Ordered At: {timeStr}
                   </div>
                   <div className="flex items-center gap-2 text-right">
                      <FiCheckCircle className="text-[#3BB77E]" /> {isDelivered ? "Delivered At:" : "Estimated Arrival:"} {arrivalTime}
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

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:static print:p-0 print:block">
           <div className="absolute inset-0 bg-[#253D4E]/60 backdrop-blur-md print:hidden" onClick={() => setSelectedInvoice(null)}></div>
           <div className="bg-white w-full max-w-2xl rounded-[40px] relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:rounded-none print:shadow-none">
              <div className="flex justify-between items-center p-6 border-b bg-gray-50/50 print:hidden">
                 <div className="flex items-center gap-3">
                    <img src="https://res.cloudinary.com/dnafzpa8x/image/upload/v1774149230/quickzy/brand/logo_without_name.png" className="w-8 h-8 object-contain" alt="Quickzy" />
                    <span className="font-black text-slate-800 tracking-tight">TAX INVOICE</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-[#3BB77E]"
                    >
                      <FiPrinter />
                    </button>
                    <button 
                      onClick={() => setSelectedInvoice(null)}
                      className="p-3 bg-red-50 border border-red-100 rounded-2xl hover:bg-red-100 transition-all text-red-500"
                    >
                      <FiX />
                    </button>
                 </div>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto print:p-0 print:overflow-visible" id="printable-invoice">
                 <div className="flex justify-between mb-10 print:mt-10">
                    <div>
                       <h2 className="text-3xl font-black text-[#253D4E] mb-2">Order Summary</h2>
                       {/* STANDARDIZED ID: Changed from slice(-10) to slice(-6).toUpperCase() */}
                       <p className="text-sm font-bold text-gray-400 uppercase">Order ID: #{selectedInvoice._id.slice(-6).toUpperCase()}</p>
                       <p className="text-sm font-bold text-gray-400">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-[#3BB77E] uppercase tracking-widest mb-1">Delivered To</p>
                       <p className="text-sm font-bold text-[#253D4E] max-w-[200px] leading-tight">{selectedInvoice.address}</p>
                       <p className="text-sm font-bold text-gray-400 mt-1">{selectedInvoice.phoneNumber}</p>
                    </div>
                 </div>

                 <div className="border-2 border-slate-50 rounded-3xl overflow-hidden mb-8">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50">
                          <tr>
                             <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</th>
                             <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Qty</th>
                             <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Amount</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {selectedInvoice.items.map((item, i) => (
                            <tr key={i}>
                               <td className="p-4">
                                  <p className="font-bold text-[#253D4E] text-sm">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold">{item.category}</p>
                               </td>
                               <td className="p-4 text-center font-bold text-sm">{item.quantity || 1}</td>
                               <td className="p-4 text-right font-black text-sm">₹{formatCurrency(item.price)}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 <div className="flex flex-col items-end space-y-3">
                    <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-gray-400">
                       <span>Subtotal</span>
                       <span>₹{formatCurrency(selectedInvoice.totalAmount - 25 + (selectedInvoice.discount || 0))}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-[#3BB77E]">
                         <span>Discount</span>
                         <span>-₹{formatCurrency(selectedInvoice.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between w-full max-w-[200px] text-xs font-bold text-gray-400">
                       <span>Delivery</span>
                       <span>₹25.00</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[240px] pt-4 border-t border-slate-100">
                       <span className="font-black text-[#253D4E]">Total Paid</span>
                       <span className="text-2xl font-black text-[#3BB77E]">₹{formatCurrency(selectedInvoice.totalAmount)}</span>
                    </div>
                    <p className="text-right text-[10px] font-black text-slate-300 uppercase italic">Paid via {selectedInvoice.paymentMethod}</p>
                 </div>

                 <div className="mt-12 pt-8 border-t border-dashed border-slate-200 text-center">
                    <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-full text-[10px] font-black uppercase mb-4">
                       <FiShield /> Sample Document
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed max-w-sm mx-auto italic">
                       This is a project demonstration only and not an actual commercial invoice. No business transaction or legal liability is implied.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          #orders-page-content, header, nav, footer, button, .print-hidden { 
             display: none !important; 
          }
          body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important;
          }
          #printable-invoice {
            visibility: visible !important;
            display: block !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            padding: 40px !important;
            margin: 0 !important;
            background: white !important;
            overflow: visible !important;
          }
          @page { size: auto; margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}
