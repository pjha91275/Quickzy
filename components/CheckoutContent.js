"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiShoppingBag,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiShield,
  FiUser,
  FiSave,
} from "react-icons/fi";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createOrder, initiateRazorpayOrder } from "@/actions/orderactions";
import { saveCheckoutDetails } from "@/actions/useractions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CheckoutContent() {
  const { data: session, update, status } = useSession();
  const { cartItems, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(""); // empty initially to force selection
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Local form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Update local state when session loads
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhone(session.user.phone || "");
      setAddress(session.user.address?.text || "");
    }
  }, [session]);

  const total = subtotal + 25;

  const handleSaveDetails = async () => {
    if (status !== "authenticated") {
      return toast.error("Please login to save your details!");
    }
    if (!name || !phone || !address) {
      return toast.error("Please fill all contact and address fields!");
    }
    setIsSaving(true);
    const res = await saveCheckoutDetails(session.user.email, {
      name,
      phone,
      address,
    });
    if (res.success) {
      toast.success("Details saved successfully!");
      await update(); // refresh session data
    }
    setIsSaving(false);
  };

  const handlePlaceOrder = async () => {
    // 1. Authentication Check
    if (status !== "authenticated") {
      return toast.error("Please login before placing the order!");
    }

    // 2. Validations
    if (cartItems.length === 0) return toast.error("Your cart is empty!");
    if (!name) return toast.error("Please enter your name!");
    if (!phone) return toast.error("Please enter your phone number!");
    if (!address) return toast.error("Please enter your delivery address!");
    if (!paymentMethod) return toast.error("Please select a payment method!");

    setIsPlacing(true);

    const baseData = {
      userEmail: session.user.email,
      items: cartItems,
      totalAmount: total,
      address: address,
      phoneNumber: phone,
    };

    // Online Payment Flow
    if (paymentMethod === "online") {
      try {
        const orderId = await initiateRazorpayOrder(total);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: "INR",
          name: "Quickzy",
          description: "Order Payment",
          order_id: orderId,
          handler: async (response) => {
            const res = await createOrder({
              ...baseData,
              paymentMethod: "Online",
              paymentStatus: "Paid",
              razorpay_payment_id: response.razorpay_payment_id,
            });
            if (res.success) {
              toast.success("Payment Received & Order Placed!");
              clearCart();
              setTimeout(() => {
                setIsPlacing(false);
                router.push("/orders");
              }, 1000);
            } else {
              setIsPlacing(false);
              toast.error("Order creation failed. Please contact support.");
            }
          },
          prefill: { name: name, email: session.user.email, contact: phone },
          theme: { color: "#3BB77E" },
          modal: {
            ondismiss: () => {
              setIsPlacing(false);
              toast.info("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        toast.error("Failed to start payment. Check your keys!");
        setIsPlacing(false);
      }
      return;
    }

    // COD Flow
    const res = await createOrder({
      ...baseData,
      paymentMethod: "COD",
      paymentStatus: "Pending",
    });

    if (res.success) {
      toast.success("Order placed successfully!");
      clearCart();
      setTimeout(() => {
        setIsPlacing(false);
        router.push("/orders");
      }, 1000);
    } else {
      toast.error("Something went wrong. Try again.");
      setIsPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-10 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-[#253D4E] mb-8 flex items-center gap-3">
          <FiShield className="text-[#3BB77E]" /> Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Address Section */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[#253D4E] flex items-center gap-2">
                  <FiUser className="text-[#3BB77E]" /> Your Details
                </h3>
                {status === "authenticated" && (
                  <button
                    onClick={handleSaveDetails}
                    disabled={isSaving}
                    className="text-xs font-black bg-[#DEF9EC] text-[#3BB77E] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#3BB77E] hover:text-white transition-all disabled:opacity-50"
                  >
                    <FiSave /> {isSaving ? "Saving..." : "Save for next time"}
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border p-3 rounded-xl font-bold text-sm outline-none focus:border-[#3BB77E]"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border p-3 rounded-xl font-bold text-sm outline-none focus:border-[#3BB77E]"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Delivery Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50 border p-3 rounded-xl font-bold text-sm outline-none focus:border-[#3BB77E] resize-none"
                  placeholder="Enter your flat, building, street name..."
                />
              </div>
            </div>

            {/* Payment Selection */}
            <div className="bg-white rounded-2xl p-6 border shadow-sm">
              <h3 className="font-black text-[#253D4E] mb-6 flex items-center gap-2">
                <FiCreditCard className="text-[#3BB77E]" /> Payment Method
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${paymentMethod === "cash" ? "border-[#3BB77E] bg-[#DEF9EC]/20" : "border-gray-50 bg-gray-50"} group`}
                >
                  <p
                    className={`font-black text-sm mb-1 ${paymentMethod === "cash" ? "text-[#3BB77E]" : "text-[#253D4E]"}`}
                  >
                    Cash / UPI on Delivery
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    Pay at your doorstep
                  </p>
                </button>
                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${paymentMethod === "online" ? "border-[#3BB77E] bg-[#DEF9EC]/20" : "border-gray-50 bg-gray-50"}`}
                >
                  <p
                    className={`font-black text-sm mb-1 ${paymentMethod === "online" ? "text-[#3BB77E]" : "text-[#253D4E]"}`}
                  >
                    Online Payment
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold">
                    Safe & Secure via Razorpay
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-[#253D4E] rounded-2xl p-6 text-white sticky top-4 shadow-xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <FiShoppingBag /> Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm gap-4">
                    <span className="opacity-70 font-bold">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-black">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-xs font-bold opacity-60">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-bold opacity-60">
                  <span>Delivery Fee</span>
                  <span>₹25</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-black">Grand Total</span>
                  <span className="text-2xl font-black text-[#3BB77E]">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing || cartItems.length === 0}
                className="w-full bg-[#3BB77E] text-white py-4 rounded-xl font-black mt-8 hover:bg-[#29A56C] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPlacing ? (
                  <>Processing...</>
                ) : (
                  <>
                    {paymentMethod === "online"
                      ? "Pay & Place Order"
                      : "Place Order"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
