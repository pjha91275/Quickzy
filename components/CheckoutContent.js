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
  const { cartItems, total, discountAmount, appliedCoupon, clearCart, itemTotalCurrent, itemTotalOld, hasCartDiscount, handlingFeeCurrent, handlingFeeOld, deliveryFeeCurrent, deliveryFeeOld, isFreeFees, getProductPrices } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(""); // empty initially to force selection
  const [isPlacing, setIsPlacing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Local form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Validation Popup State
  const [validationModal, setValidationModal] = useState({
    isOpen: false,
    field: "", // "name", "phone", "address"
    defaultValue: ""
  });

  const nameInputRef = React.useRef(null);
  const phoneInputRef = React.useRef(null);
  const addressInputRef = React.useRef(null);

  // Update local state when session loads
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhone(session.user.phone || "");
      setAddress(session.user.address?.text || "");
    }
  }, [session]);


  const handleSaveDetails = async () => {
    if (status !== "authenticated") {
      return toast.error("Please login to save your details!");
    }
    if (!name || !phone || !address) {
      return toast.error("Please fill all contact and address fields!");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.toString().replace(/\D/g, ''))) {
      return toast.error("Please enter a valid 10-digit mobile number!");
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

    // 2. Validations with Smart Popup
    if (cartItems.length === 0) return toast.error("Your cart is empty!");

    if (!name) {
      toast.warn("Please enter the receiver's name to proceed!");
      return setValidationModal({
        isOpen: true,
        field: "receiver's name",
        defaultValue: session.user.name || ""
      });
    }
    if (!phone) {
      toast.warn("Please enter the phone number to proceed!");
      return setValidationModal({
        isOpen: true,
        field: "phone",
        defaultValue: session.user.phone || ""
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.toString().replace(/\D/g, ''))) {
      return toast.error("Please enter a valid 10-digit mobile number!");
    }
    if (!address) {
      toast.warn("Please enter the address to proceed!");
      return setValidationModal({
        isOpen: true,
        field: "address",
        defaultValue: session.user.address?.text || ""
      });
    }

    if (!paymentMethod) return toast.error("Please select a payment method!");

    setIsPlacing(true);

    const normalizeImg = (p) => {
      const img = p.image || p.img || "";
      if (img.startsWith("http")) return img;
      return `https://res.cloudinary.com/dnafzpa8x/image/upload/${img.startsWith("/") ? img.slice(1) : img || "v1774149230/quickzy/brand/logo_without_name.png"}`;
    };

    const baseData = {
      userEmail: session.user.email,
      items: cartItems.map(item => ({
        ...item,
        image: normalizeImg(item),
        productId: (item.id_custom || item._id || item.id)?.toString()
      })),
      totalAmount: total,
      address: address,
      phoneNumber: phone,
      discount: discountAmount || 0,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
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
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-black text-[#253D4E] mb-8 flex items-center gap-3">
          <FiShield className="text-[#3BB77E]" /> Secure Checkout
        </h1>

        <div className="grid lg:grid-cols-10 gap-8">
          <div className="lg:col-span-6 space-y-6">
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
                    Receiver's Name
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border p-3 rounded-xl font-bold text-sm outline-none focus:border-[#3BB77E]"
                    placeholder="Enter receiver's name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                    Phone Number
                  </label>
                  <input
                    ref={phoneInputRef}
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
                  ref={addressInputRef}
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
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#253D4E] rounded-2xl p-6 text-white sticky top-4 shadow-xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <FiShoppingBag /> Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, i) => {
                  const { itemTotalCurrent, itemTotalOld, hasDiscount, totalDiscount, isCombo } = getProductPrices(item);
                  return (
                    <div key={i} className="flex justify-between items-start text-xs gap-4 mb-4 last:mb-0">
                      <div className="flex flex-col gap-1">
                        <span className="opacity-90 font-black text-xs">
                          {item.quantity}x {item.name}
                        </span>
                        {hasDiscount && (
                          <span className={`${isCombo ? "bg-[#7C3AED]" : "bg-[#FF7F50]"} text-white text-[8px] font-black px-2 py-0.5 rounded-lg uppercase shadow-xl w-fit italic leading-none`}>
                            {isCombo ? `Combo Saving ${totalDiscount.toFixed(0)}% OFF` : `${totalDiscount.toFixed(0)}% OFF`}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-black text-xs text-[#3BB77E]">
                          ₹{itemTotalCurrent.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[9px] text-white/40 font-black line-through">
                            ₹{itemTotalOld.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                {/* Item(s) Total */}
                <div className="flex justify-between text-[12px] font-black uppercase tracking-[2px] text-white">
                  <span>Item(s) Total</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3BB77E] text-[15px]">₹{itemTotalCurrent.toFixed(2)}</span>
                    {hasCartDiscount && <span className="line-through text-white/40 font-black text-[12px]">₹{itemTotalOld.toFixed(2)}</span>}
                  </div>
                </div>

                {/* Handling Fee */}
                <div className="flex justify-between text-[12px] font-black uppercase tracking-[2px] text-white">
                  <span>Handling Fee</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3BB77E] text-[15px]">
                      {handlingFeeCurrent === 0 ? "FREE" : `₹${handlingFeeCurrent.toFixed(2)}`}
                    </span>
                    <span className="line-through text-white/40 font-black text-[12px]">₹{handlingFeeOld.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between text-[12px] font-black uppercase tracking-[2px] text-white">
                  <span>Delivery Fee</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#3BB77E] text-[15px]">
                      {deliveryFeeCurrent === 0 ? "FREE" : `₹${deliveryFeeCurrent.toFixed(2)}`}
                    </span>
                    <span className="line-through text-white/40 font-black text-[12px]">₹{deliveryFeeOld.toFixed(2)}</span>
                  </div>
                </div>

                {appliedCoupon && (
                  <div className="flex flex-col gap-1 py-3 px-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex justify-between text-[13px] font-black uppercase tracking-[2px] text-[#3BB77E]">
                      <span>Coupon: {appliedCoupon.code}</span>
                      <span className="whitespace-nowrap">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="font-black text-white text-lg">Grand Total</span>
                  <span className="text-3xl font-black text-[#3BB77E] drop-shadow-md">
                    ₹{total.toFixed(2)}
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

      {/* Smart Validation Modal */}
      {validationModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setValidationModal({ ...validationModal, isOpen: false })}></div>
          <div className="bg-white rounded-[30px] p-8 max-w-sm w-full relative z-10 shadow-2xl animate-float-slow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              {validationModal.field === "receiver's name" ? <FiUser className="text-red-500 text-2xl" /> :
                validationModal.field === "phone" ? <FiPhone className="text-red-500 text-2xl" /> :
                  <FiMapPin className="text-red-500 text-2xl" />}
            </div>
            <h3 className="text-xl font-black text-[#253D4E] text-center mb-2 uppercase tracking-tight">Missing Required Detail</h3>
            <p className="text-gray-500 text-center text-sm font-bold mb-8">
              Please provide your <span className="text-[#3BB77E]">{validationModal.field}</span> to proceed with the order.
            </p>

            <div className="space-y-3">
              {validationModal.defaultValue && (
                <button
                  onClick={() => {
                    if (validationModal.field === "receiver's name") setName(validationModal.defaultValue);
                    if (validationModal.field === "phone") setPhone(validationModal.defaultValue);
                    if (validationModal.field === "address") setAddress(validationModal.defaultValue);
                    setValidationModal({ ...validationModal, isOpen: false });
                    toast.success(`Used default ${validationModal.field} from profile!`);
                  }}
                  className="w-full bg-[#DEF9EC] text-[#3BB77E] py-4 rounded-xl font-black text-sm hover:bg-[#3BB77E] hover:text-white transition-all flex flex-col items-center gap-0.5"
                >
                  <span>Use Profile Default</span>
                  <span className="text-sm opacity-90 truncate max-w-full px-4 font-black">{validationModal.defaultValue}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setValidationModal({ ...validationModal, isOpen: false });
                  setTimeout(() => {
                    if (validationModal.field === "receiver's name") nameInputRef.current?.focus();
                    if (validationModal.field === "phone") phoneInputRef.current?.focus();
                    if (validationModal.field === "address") addressInputRef.current?.focus();
                  }, 300);
                }}
                className="w-full bg-gray-100 text-[#253D4E] py-4 rounded-xl font-black text-sm hover:bg-gray-200 transition-all"
              >
                Fill Manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
