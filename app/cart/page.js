"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";

const initialCart = [
  { id: 1, name: "Foster Farms Takeout Crispy Wings", price: 12.00, img: "🍗", category: "Meats", weight: "500g" },
  { id: 2, name: "Organic Cage-Grade A Large Eggs", price: 4.00, img: "🥚", category: "Dairy", weight: "12 pcs" },
  { id: 3, name: "Seeds of Change Organic Quinoa", price: 5.00, img: "🌾", category: "Grains", weight: "1kg" },
];

export default function Cart() {
  const [items, setItems] = useState(initialCart);

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const shipping = 2.00;
  const total = subtotal + shipping;

  return (
    <>
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Cart Items --- */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <FiShoppingBag className="text-green-600" /> Your Cart
            </h1>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
              <div className="hidden md:grid grid-cols-5 p-4 border-b bg-gray-50 text-gray-500 font-semibold text-sm">
                <div className="col-span-2">Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Remove</div>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 p-4 items-center gap-4">
                    {/* Product Info */}
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                        {item.img}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-700 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.weight} • {item.category}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="font-bold text-green-600">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity (Simple UI) */}
                    <div className="flex items-center gap-3">
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-green-100 transition">
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="font-semibold text-sm">1</span>
                      <button className="p-1 rounded-full bg-gray-100 hover:bg-green-100 transition">
                        <FiPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Trash */}
                    <div>
                      <button className="text-gray-300 hover:text-red-500 transition">
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link href="/" className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all">
                <FiArrowRight className="rotate-180" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* --- Order Summary --- */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm p-6 border sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 border-b pb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-bold text-gray-800">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-gray-800">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-800 mb-8">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
                Checkout Now <FiArrowRight />
              </button>

              <div className="mt-6">
                <div className="bg-gray-50 rounded-lg p-3 flex gap-2 border border-dashed border-gray-300">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code" 
                    className="bg-transparent text-sm flex-1 outline-none"
                  />
                  <button className="text-green-600 font-bold text-sm">Apply</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- Simple Mini Footer (matching theme) --- */}
      <footer className="container mx-auto px-4 py-10 mt-10 border-t text-center text-gray-400 text-sm">
        <p>© 2024 Nest Mart. All rights reserved.</p>
      </footer>
    </>
  );
}
