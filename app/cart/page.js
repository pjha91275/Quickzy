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
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();

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
                      className="group hover:bg-gray-50 transition-colors"
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
                            <h4 className="font-black text-[#253D4E] text-lg hover:text-[#3BB77E] transition-colors cursor-pointer leading-tight mb-2">
                              {item.name}
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
                      <td className="py-6 px-6">
                        <span className="text-2xl font-black text-[#253D4E]">
                          ₹{item.price}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4 border-2 border-[#3BB77E] w-fit px-4 py-2 rounded-md bg-white shadow-sm">
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
                      <td className="py-6 px-6">
                        <span className="text-2xl font-black text-[#3BB77E]">
                          ₹
                          {((item.price || 0) * (item.quantity || 1)).toFixed(
                            2,
                          )}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <button
                          onClick={() => removeFromCart(item._id || item.id)}
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
            <Link
              href="/checkout"
              className="w-full bg-[#3BB77E] text-white py-5 rounded-md font-black text-lg hover:bg-[#29A56C] transition shadow-xl shadow-[#3BB77E]/20 flex items-center justify-center gap-2"
            >
              Proceed To CheckOut <FiArrowRight />
            </Link>
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
