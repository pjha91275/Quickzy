"use client";
import React, { useState } from "react";
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiShoppingBag,
  FiRefreshCw,
  FiTag,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FiHeart } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { validateCoupon, getActiveCoupons } from "@/actions/useractions";

export default function Cart() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems, updateQuantity, removeFromCart, total, discountAmount, appliedCoupon, saveCoupon, itemTotalCurrent, itemTotalOld, hasCartDiscount, handlingFeeCurrent, handlingFeeOld, deliveryFeeCurrent, deliveryFeeOld, isFreeFees, getProductPrices } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Fetch all active coupons on page load
  React.useEffect(() => {
    const fetchCoupons = async () => {
      const list = await getActiveCoupons();
      setAvailableCoupons(list);
    };
    fetchCoupons();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const res = await validateCoupon(couponCode, itemTotalCurrent, session?.user?.email, cartItems);
    if (res.success) {
      saveCoupon(res.coupon);
      toast.success("Coupon applied successfully!");
      setCouponCode("");
    } else {
      toast.error(res.message);
      setCouponCode("");
    }
    setCouponLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#3BB77E]"></div>
      </div>
    );
  }

  // Redirect or show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6 bg-gray-50/50 py-12 min-[400px]:py-20 lg:py-24">
        <div className="bg-white max-w-md w-full rounded-[48px] p-8 min-[400px]:p-12 text-center shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-24 h-24 bg-[#DEF9EC] text-[#3BB77E] rounded-full flex items-center justify-center mb-10 ring-8 ring-[#DEF9EC]/50 shadow-inner">
            <FiShoppingBag size={42} className="animate-bounce" />
          </div>

          <h1 className="text-4xl font-black text-[#253D4E] mb-4 tracking-tight">Your Cart</h1>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">
            Please login to view and manage your items.
          </p>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-auth"))}
            className="w-full bg-[#3BB77E] text-white py-4 min-[400px]:py-5 rounded-[22px] font-black text-lg min-[400px]:text-xl hover:bg-[#29A56C] transition-all shadow-xl shadow-[#3BB77E]/30 flex items-center justify-center gap-2 min-[400px]:gap-3 active:scale-95 translate-y-0 hover:-translate-y-1"
          >
            Login to Quickzy <FiArrowRight className="shrink-0" />
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
      <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
        {/* Main cart items list */}
        <div className="lg:w-[65%] xl:w-[70%]">
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
              <table className="w-full text-left">
                <thead className="bg-[#ececec] text-[#253D4E] font-bold text-sm">
                  <tr>
                    <th className="py-4 px-4 rounded-l-xl w-[40%]">Product</th>
                    <th className="py-4 px-4 text-center">Unit Price</th>
                    <th className="py-4 px-2 text-center">Quantity</th>
                    <th className="py-4 px-4 text-center">Subtotal</th>
                    <th className="py-4 px-4 rounded-r-xl text-center">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr
                      key={item._id || item.id}
                      onClick={() => router.push(`/product/${item.id_custom || item._id || item.id}`)}
                      className="group hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 border rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                            <img
                              src={item.image || item.img}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                            />
                            {item.discount && (
                              <span className="absolute top-0 left-0 bg-pink-500 text-white text-[8px] font-black px-2 py-0.5 rounded-br-xl rounded-tl-xl shadow-sm italic uppercase z-10 leading-none">
                                Hot Deal
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-black text-[#253D4E] text-base group-hover:text-[#3BB77E] transition-colors leading-tight mb-1 flex items-center justify-between gap-4">
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
                                <FiHeart className={`text-lg ${isInWishlist(item._id || item.id) ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                              </button>
                            </h4>
                            <div className="flex gap-2 text-[10px] font-bold">
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
                      <td className="py-6 px-4 text-center">
                        {(() => {
                          const { unitPriceCurrent, mrp, totalDiscount, isCombo, hasDiscount } = getProductPrices(item);
                          return (
                            <div className="flex flex-col items-center">
                              <span className="text-xl font-black text-[#253D4E]">
                                ₹{unitPriceCurrent.toFixed(2)}
                              </span>
                              {hasDiscount && (
                                <div className="flex flex-col items-center gap-1 mt-1">
                                  <span className="text-[#adadad] text-[11px] font-black line-through decoration-[1.5px] px-1">
                                    ₹{mrp.toFixed(2)}
                                  </span>
                                  <span className={`${isCombo ? "bg-[#7C3AED]" : "bg-[#FF7F50]"} text-white text-[10px] px-3 py-1 rounded-lg font-black italic uppercase shadow-md leading-none whitespace-nowrap`}>
                                    {isCombo ? `Combo Saving ${totalDiscount.toFixed(0)}% OFF` : `${totalDiscount.toFixed(0)}% OFF`}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-6 px-2">
                        <div
                          className="flex items-center gap-2 border-2 border-[#3BB77E] mx-auto w-fit px-3 py-1.5 rounded-md bg-white shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item._id || item.id, -1)
                            }
                            className="text-[#3BB77E] hover:scale-125 transition-transform p-1"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="font-bold text-base min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id || item.id, 1)
                            }
                            className="text-[#3BB77E] hover:scale-125 transition-transform p-1"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-center text-[#3BB77E] font-black text-xl">
                        {(() => {
                          const { itemTotalCurrent } = getProductPrices(item);
                          return `₹${itemTotalCurrent.toFixed(2)}`;
                        })()}
                      </td>
                      <td className="py-6 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item._id || item.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors text-xl"
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

          <div className="mt-12 flex flex-col justify-start items-start gap-6 border-t pt-8 w-full">
            <Link
              href="/"
              className="bg-[#3BB77E] text-white px-8 py-4 rounded-xl font-black hover:bg-[#29A56C] transition shadow-lg flex items-center gap-2 mb-2"
            >
              <FiArrowRight className="rotate-180" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Sidebar Summary Section */}
        <div className="lg:w-[35%] xl:w-[30%] space-y-8">
          <div className="bg-white border rounded-2xl p-5 lg:p-6 xl:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#253D4E] mb-8 pb-4 border-b">Cart Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center group mb-3">
                <span className="text-[14px] font-black text-[#253D4E]">
                  Items Total ({cartItems.length})
                </span>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3BB77E] font-black text-xl">
                      ₹{itemTotalCurrent.toFixed(2)}
                    </span>
                    {hasCartDiscount && (
                      <span className="text-gray-400 font-bold text-xs line-through decoration-[1px]">
                        ₹{itemTotalOld.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-[14px] font-black text-[#253D4E]">
                  Handling Fee
                </span>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3BB77E] font-black text-base">
                      {handlingFeeCurrent === 0 ? "FREE" : `₹${handlingFeeCurrent.toFixed(2)}`}
                    </span>
                    <span className="text-gray-400 font-bold text-xs line-through decoration-[1px]">
                      ₹{handlingFeeOld.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[14px] font-black text-[#253D4E]">Delivery Fee</span>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3BB77E] font-black text-base">
                      {deliveryFeeCurrent === 0 ? "FREE" : `₹${deliveryFeeCurrent.toFixed(2)}`}
                    </span>
                    <span className="text-gray-400 font-bold text-xs line-through decoration-[1px]">
                      ₹{deliveryFeeOld.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center py-4 bg-[#DEF9EC]/40 px-5 rounded-2xl border border-[#3BB77E]/20 mb-6 group transition-all">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-[#3BB77E] uppercase tracking-[2px] leading-none">Coupon Applied</span>
                    <span className="font-black text-[#253D4E] flex items-center gap-1.5 text-sm uppercase">
                      <FiRefreshCw className="text-[#3BB77E] animate-spin-slow" /> {appliedCoupon.code}
                    </span>
                  </div>
                  <span className="font-black text-[#3BB77E] text-xl">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="bg-[#253D4E] p-6 rounded-[22px] shadow-xl shadow-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-white/60 text-[10px] uppercase tracking-[3px]">Final Payable</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-white text-xl">Total</span>
                  <span className="text-[#3BB77E] font-black text-3xl drop-shadow-sm">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
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
                  router.push("/checkout");
                }
              }}
              className="w-full bg-[#3BB77E] text-white py-5 rounded-md font-black text-lg hover:bg-[#29A56C] transition shadow-xl shadow-[#3BB77E]/20 flex items-center justify-center gap-2"
            >
              Proceed To CheckOut <FiArrowRight />
            </button>
          </div>

          <div className="bg-white border rounded-2xl p-5 lg:p-6 xl:p-8 shadow-sm space-y-4">
            <h4 className="font-black text-[#253D4E] text-lg">Apply Coupon</h4>
            {appliedCoupon ? (
              <div className="bg-[#DEF9EC] p-4 rounded-xl border border-green-100 flex items-center justify-between">
                <div>
                  <p className="text-[#3BB77E] font-black uppercase tracking-wider text-sm flex items-center gap-2">
                    <FiRefreshCw className="animate-spin-slow" /> {appliedCoupon.code}
                  </p>
                  <p className="text-[#253D4E] text-xs font-bold mt-1">
                    Saving you ₹{discountAmount.toFixed(2)}!
                  </p>
                </div>
                <button onClick={() => saveCoupon(null)} className="text-red-500 font-bold hover:underline text-xs">
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 font-medium">Using A Promo Code?</p>
                <div className="flex flex-col xl:flex-row gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 border rounded-md px-4 py-2.5 outline-none focus:border-[#3BB77E] font-bold text-[#253D4E] uppercase text-sm"
                  />
                  <button
                    id="apply-btn"
                    disabled={couponLoading}
                    onClick={handleApplyCoupon}
                    className="bg-[#253D4E] text-white px-6 py-2.5 rounded-md font-bold hover:bg-black transition disabled:opacity-70 whitespace-nowrap"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              </>
            )}

            {availableCoupons.length > 0 && (
              <div className="w-full mt-6 border-t pt-6">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Available Offers</p>
                <div className="space-y-4">
                  {availableCoupons.map((c, index) => {
                    let isValidNow = itemTotalCurrent >= c.minOrderAmount;
                    
                    if (c.code === "FRESHVEG") {
                      const hasVegetable = cartItems.some(item => (item.category || "").toLowerCase().includes("vegetable"));
                      if (!hasVegetable) {
                        isValidNow = false;
                      }
                    }

                    const themes = [
                      { bg: "bg-[#E8F8F0]", text: "text-[#10b981]", border: "border-[#D1FAE5]" },
                      { bg: "bg-[#EEF5FF]", text: "text-[#3b82f6]", border: "border-[#DBEAFE]" },
                      { bg: "bg-[#F5F3FF]", text: "text-[#8b5cf6]", border: "border-[#EDE9FE]" },
                      { bg: "bg-[#FFF1F2]", text: "text-[#f43f5e]", border: "border-[#FFE4E6]" },
                      { bg: "bg-[#FEFCE8]", text: "text-[#eab308]", border: "border-[#FEF9C3]" },
                    ];
                    const theme = themes[index % themes.length];

                    return (
                      <div
                        key={c._id}
                        onClick={async () => {
                          if (isValidNow) {
                            if (appliedCoupon?.code === c.code) {
                              toast.info("This coupon is already applied!");
                              return;
                            }
                            setCouponLoading(true);
                            const res = await validateCoupon(c.code, itemTotalCurrent, session?.user?.email, cartItems);
                            setCouponLoading(false);
                            if (res.success) {
                              saveCoupon(res.coupon);
                              toast.success(`Switched to ${c.code}!`);
                              setCouponCode("");
                            } else {
                              toast.error(res.message);
                            }
                          } else {
                            if (c.code === "FRESHVEG" && itemTotalCurrent >= c.minOrderAmount) {
                               toast.info(`Add at least one vegetable item to unlock this coupon!`);
                            } else {
                               toast.info(`Add ₹${(c.minOrderAmount - itemTotalCurrent).toFixed(2)} more to unlock this coupon!`);
                            }
                          }
                        }}
                        className={`border rounded-xl p-4 transition-all ${isValidNow ? "cursor-pointer hover:shadow-md hover:bg-gray-50/50 border-gray-100" : "opacity-60 cursor-not-allowed bg-gray-50 border-gray-100"}`}
                      >
                        <div className="flex flex-col lg:flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-black flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] xl:text-sm uppercase tracking-wider ${isValidNow ? `${theme.bg} ${theme.text}` : "bg-gray-200 text-gray-400"}`}>
                              <FiTag size={14} className={isValidNow ? theme.text : "text-gray-400"} />
                              {c.code}
                            </span>
                            {appliedCoupon?.code === c.code && (
                              <span className="bg-[#3BB77E] text-white text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">
                                Applied
                              </span>
                            )}
                          </div>
                          <span className="text-sm xl:text-[11px] font-black text-[#253D4E] text-left leading-tight shrink-0">
                            {c.discountValue === 0
                              ? "Free Delivery & Handling"
                              : (c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`)
                            }
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-3">
                          {c.code === "FRESHVEG" ? "Requires at least 1 Vegetable in cart. " : ""}
                          {c.minOrderAmount > 0 ? `Valid on orders above ₹${c.minOrderAmount}` : "No minimum order value"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
