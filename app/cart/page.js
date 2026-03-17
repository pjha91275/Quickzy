"use client";
import React, { useState } from "react";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiShoppingBag,
  FiRefreshCw,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FiHeart } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function Cart() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3BB77E]"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
        <div className="bg-white max-w-md w-full rounded-[48px] p-12 text-center shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-24 h-24 bg-[#DEF9EC] text-[#3BB77E] rounded-full flex items-center justify-center mb-10 ring-8 ring-[#DEF9EC]/50 shadow-inner">
            <FiShoppingBag size={42} className="animate-bounce" />
          </div>
          
          <h1 className="text-4xl font-black text-[#253D4E] mb-4 tracking-tight">Your Cart</h1>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">
            Personalize your shopping experience. Please login to view and manage your cart.
          </p>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-auth"))}
            className="w-full bg-[#3BB77E] text-white py-5 rounded-[22px] font-black text-xl hover:bg-[#29A56C] transition-all shadow-xl shadow-[#3BB77E]/30 flex items-center justify-center gap-3 active:scale-95 translate-y-0 hover:-translate-y-1"
          >
            Login to Quickzy <FiArrowRight />
          </button>

          <div className="mt-10 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-6 w-full">
             <span className="flex-1 h-[1.5px] bg-gray-100"></span>
             OR
             <span className="flex-1 h-[1.5px] bg-gray-100"></span>
          </div>

          <Link href="/shop" className="mt-8 text-[#3BB77E] font-black text-sm hover:underline tracking-tight flex items-center gap-2 group">
             Explore Products <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 min-h-[60vh]">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* --- Cart Items --- */}
        <div className="lg:w-[70%]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black text-[#253D4E] flex items-center gap-3">
              Your Cart
            </h1>
            <p className="text-gray-400 font-bold">
              There are{" "}
              <span className="text-[#3BB77E]">{cartItems.length}</span>{" "}
              products in your cart
            </p>
          </div>

          <div className="overflow-x-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border">
                <FiShoppingBag
                  className="mx-auto text-gray-200 mb-4"
                  size={64}
                />
                <h3 className="text-xl font-black text-gray-400">
                  Cart is empty!
                </h3>
                <Link
                  href="/"
                  className="text-[#3BB77E] font-bold mt-2 inline-block hover:underline"
                >
                  Go Shopping
                </Link>
              </div>
            ) : (
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#ececec] text-[#253D4E] font-bold text-sm">
                  <tr>
                    <th className="py-4 px-6 rounded-l-xl">Product</th>
                    <th className="py-4 px-6">Unit Price</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6">Subtotal</th>
                    <th className="py-4 px-6 rounded-r-xl">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr
                      key={item._id || item.id}
                      onClick={() => router.push(`/product/${item.id_custom || item._id || item.id}`)}
                      className="group hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 border rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                            <img
                              src={item.image || item.img}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div>
                            <h4 className="font-black text-[#253D4E] text-lg group-hover:text-[#3BB77E] transition-colors leading-tight mb-2 flex items-center justify-between gap-4">
                              <span className="truncate">
                                {item.name}
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(item);
                                }}
                                className="shrink-0 hover:scale-110 transition-transform"
                              >
                                <FiHeart className={`text-xl ${isInWishlist(item._id || item.id) ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                              </button>
                            </h4>
                            <div className="flex gap-2 text-xs font-bold">
                              <span className="text-gray-400">
                                {item.unit || item.weight}
                              </span>
                              <span className="text-[#3BB77E] px-2 bg-[#DEF9EC] rounded-sm">
                                In Stock
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black text-[#253D4E]">
                            ₹{item.price}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#adadad] text-[10px] font-bold relative">
                              ₹{item.oldPrice}
                              <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] bg-[#888]"></span>
                            </span>
                            <span className="bg-[#FF7F50] text-white text-[9px] px-1.5 py-0.5 rounded font-black italic uppercase">
                              {item.discount} OFF
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div 
                          className="flex items-center gap-4 border-2 border-[#3BB77E] w-fit px-4 py-2 rounded-md bg-white shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item._id || item.id, -1)
                            }
                            className="text-[#3BB77E] hover:scale-125 transition-transform"
                          >
                            <FiMinus />
                          </button>
                          <span className="font-bold text-lg min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id || item.id, 1)
                            }
                            className="text-[#3BB77E] hover:scale-125 transition-transform"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <span className="text-2xl font-black text-[#3BB77E]">
                          ₹
                          {((item.price || 0) * (item.quantity || 1)).toFixed(
                            2,
                          )}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item._id || item.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors text-2xl"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t pt-8">
            <Link
              href="/"
              className="bg-[#3BB77E] text-white px-8 py-4 rounded-xl font-black hover:bg-[#29A56C] transition shadow-lg flex items-center gap-2"
            >
              <FiArrowRight className="rotate-180" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* --- Sidebar Summary --- */}
        <div className="lg:w-[30%] space-y-8">
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-[#253D4E]">Subtotal</h3>
                <span className="text-[#3BB77E] font-black text-2xl">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-b py-4">
                <span className="font-bold text-gray-500">Shipping</span>
                <span className="font-black text-[#253D4E]">Free Shipping</span>
              </div>
              <div className="flex justify-between items-center bg-[#f7f8f9] p-4 rounded-lg">
                <span className="font-black text-[#253D4E] text-lg">Total</span>
                <span className="text-[#3BB77E] font-black text-3xl">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                const hasLocation = localStorage.getItem("quickzy-guest-location") || session?.user?.address?.text;
                if (!hasLocation) {
                  e.preventDefault();
                  toast.warning("Please select a delivery location to proceed.");
                  window.dispatchEvent(new CustomEvent("open-location", { detail: { compulsory: true } }));
                } else {
                  window.location.href = "/checkout";
                }
              }}
              className="w-full bg-[#3BB77E] text-white py-5 rounded-md font-black text-lg hover:bg-[#29A56C] transition shadow-xl shadow-[#3BB77E]/20 flex items-center justify-center gap-2"
            >
              Proceed To CheckOut <FiArrowRight />
            </button>
          </div>

          <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-4">
            <h4 className="font-black text-[#253D4E] text-lg">Apply Coupon</h4>
            <p className="text-sm text-gray-400 font-medium">
              Using A Promo Code?
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                className="flex-1 border rounded-md px-4 outline-none focus:border-[#3BB77E]"
              />
              <button className="bg-[#253D4E] text-white px-4 py-2 rounded-md font-bold hover:bg-black transition">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
