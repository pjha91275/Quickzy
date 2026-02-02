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

const initialCart = [
  {
    id: 9,
    name: "Aashirvaad Atta (5kg)",
    price: 245.0,
    img: "https://www.bigbasket.com/media/uploads/p/l/126906_8-aashirvaad-atta-whole-wheat.jpg",
    category: "Grocery",
    weight: "5kg",
    stock: "In Stock",
  },
  {
    id: 22,
    name: "boAt Storm Smartwatch",
    price: 1999.0,
    img: "https://m.media-amazon.com/images/I/61S9aVnRZDL.jpg",
    category: "Electronics",
    weight: "Black",
    stock: "In Stock",
  },
  {
    id: 40,
    name: "Amul Fresh Paneer (200g)",
    price: 85.0,
    img: "https://m.media-amazon.com/images/I/81hD14MN91L._SX679_.jpg",
    category: "Dairy",
    weight: "200g",
    stock: "In Stock",
  },
];

export default function Cart() {
  const [items, setItems] = useState(initialCart);

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);

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
              There are <span className="text-[#3BB77E]">{items.length}</span>{" "}
              products in your cart
            </p>
          </div>

          <div className="overflow-x-auto">
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
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 border rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-[#253D4E] text-lg hover:text-[#3BB77E] transition-colors cursor-pointer leading-tight mb-2">
                            {item.name}
                          </h4>
                          <div className="flex gap-2 text-xs font-bold">
                            <span className="text-gray-400">{item.weight}</span>
                            <span className="text-[#3BB77E] px-2 bg-[#DEF9EC] rounded-sm">
                              {item.stock}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="text-2xl font-black text-[#253D4E]">
                        ₹{item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-4 border-2 border-[#3BB77E] w-fit px-4 py-2 rounded-md bg-white">
                        <button className="text-[#3BB77E] hover:scale-125 transition-transform">
                          <FiMinus />
                        </button>
                        <span className="font-bold text-lg min-w-[20px] text-center">
                          1
                        </span>
                        <button className="text-[#3BB77E] hover:scale-125 transition-transform">
                          <FiPlus />
                        </button>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span className="text-2xl font-black text-[#3BB77E]">
                        ₹{item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <button className="text-gray-400 hover:text-red-500 transition-colors text-2xl">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t pt-8">
            <Link
              href="/"
              className="bg-[#3BB77E] text-white px-8 py-4 rounded-md font-bold hover:bg-[#29A56C] transition shadow-lg flex items-center gap-2"
            >
              <FiArrowRight className="rotate-180" /> Continue Shopping
            </Link>
            <button className="bg-[#253D4E] text-white px-8 py-4 rounded-md font-bold hover:bg-black transition shadow-lg flex items-center gap-2">
              <FiRefreshCw /> Update Cart
            </button>
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
            <button className="w-full bg-[#3BB77E] text-white py-5 rounded-md font-black text-lg hover:bg-[#29A56C] transition shadow-xl shadow-[#3BB77E]/20 flex items-center justify-center gap-2">
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
