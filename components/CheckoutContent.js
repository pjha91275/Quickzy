"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiShoppingBag,
  FiMapPin,
  FiPhone,
  FiClock,
  FiCreditCard,
  FiShield,
  FiCheck,
} from "react-icons/fi";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/actions/orderactions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CheckoutContent() {
  const { data: session } = useSession();
  const { cartItems, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isPlacing, setIsPlacing] = useState(false);
  const router = useRouter();

  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsPlacing(true);
    const orderData = {
      userEmail: session?.user?.email,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.img,
      })),
      totalAmount: total,
      paymentMethod: paymentMethod === "cash" ? "COD" : "Online",
      address: session?.user?.address?.text || "Default Address",
      phoneNumber: session?.user?.phone || "Not Provided",
    };

    const res = await createOrder(orderData);
    if (res.success) {
      toast.success("Order placed successfully!");
      clearCart();
      router.push("/orders");
    } else {
      toast.error("Failed to place order. Try again.");
    }
    setIsPlacing(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-10 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-[#253D4E] mb-8 flex items-center gap-3">
          <FiShield className="text-[#3BB77E]" /> Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Contact Info */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-[#253D4E]">
                <FiPhone className="text-[#3BB77E]" />
                <h3 className="font-black">Contact Details</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm font-bold text-[#253D4E]">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase mb-1 font-black">
                    Full Name
                  </p>
                  {session?.user?.name || "Quickzy User"}
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase mb-1 font-black">
                    Mobile Number
                  </p>
                  {session?.user?.phone || "Missing - Update in Profile"}
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3 text-[#253D4E]">
                  <FiMapPin className="text-[#3BB77E]" />
                  <h3 className="font-black">Delivery Address</h3>
                </div>
                <Link
                  href="/profile"
                  className="text-xs font-black text-[#3BB77E] hover:underline"
                >
                  Change
                </Link>
              </div>
              <div className="p-4 bg-[#DEF9EC]/30 rounded-xl border border-[#3BB77E]/20 text-sm font-bold text-[#253D4E]">
                {session?.user?.address?.text ||
                  "No address found. Please add in profile."}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[#3BB77E] text-xs font-black bg-[#DEF9EC] w-fit px-3 py-1.5 rounded-full">
                <FiClock /> Delivery in 12-15 Minutes
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-[#253D4E]">
                <FiCreditCard className="text-[#3BB77E]" />
                <h3 className="font-black">Payment Method</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label
                  className={`block p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "cash" ? "border-[#3BB77E] bg-[#DEF9EC]/20" : "border-gray-100"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="hidden"
                    onChange={() => setPaymentMethod("cash")}
                    checked={paymentMethod === "cash"}
                  />
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-black text-[#253D4E] text-sm">
                      Cash / UPI on Delivery
                    </p>
                    {paymentMethod === "cash" && (
                      <FiCheck className="text-[#3BB77E]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-bold">
                    Pay when your order arrives
                  </p>
                </label>
                <label
                  className={`block p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "online" ? "border-[#3BB77E] bg-[#DEF9EC]/20" : "border-gray-100"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="hidden"
                    onChange={() => setPaymentMethod("online")}
                    checked={paymentMethod === "online"}
                  />
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-black text-[#253D4E] text-sm">
                      Online Payment
                    </p>
                    {paymentMethod === "online" && (
                      <FiCheck className="text-[#3BB77E]" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-bold">
                    Razorpay (Cards, UPI, GPay)
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Order Summary */}
          <div className="space-y-6">
            <div className="bg-[#253D4E] rounded-2xl p-6 text-white shadow-xl sticky top-4">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <FiShoppingBag /> Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm items-start gap-4"
                  >
                    <span className="font-bold opacity-80 leading-tight flex-1">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-black whitespace-nowrap">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-sm font-bold">
                <div className="flex justify-between opacity-70">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between opacity-70">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2 text-[#3BB77E]">
                  <span>Total Payable</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing || cartItems.length === 0}
                className="w-full bg-[#3BB77E] text-white py-4 rounded-xl font-black mt-8 hover:bg-[#29A56C] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacing
                  ? "Placing Order..."
                  : paymentMethod === "online"
                    ? "Proceed to Payment"
                    : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
