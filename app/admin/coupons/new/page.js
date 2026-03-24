"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCouponAdmin } from "@/actions/adminactions";
import { FiSave, FiArrowLeft, FiTag } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-toastify";

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    try {
      const res = await saveCouponAdmin(formData);
      if (res?.success) {
        toast.success("Hooray! Coupon generated successfully.");
        router.push("/admin/coupons");
      } else {
        toast.error("Failed: " + (res?.error || "Unknown"));
      }
    } catch (err) {
      toast.error("An error occurred while creating coupon.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/coupons" className="w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:bg-[#DEF9EC] hover:text-[#3BB77E] transition-all shadow-sm">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">Create New Coupon</h1>
          <p className="text-sm text-gray-500 font-medium">Generate a new discount code for your customers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Coupon Code String <span className="text-red-400">*</span></label>
            <div className="relative">
               <FiTag className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3BB77E]" />
               <input required type="text" name="code" className="w-full pl-12 bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-black uppercase text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="e.g. WELCOME50, DIWALI20" />
            </div>
            <p className="text-[10px] text-gray-400 ml-2 font-bold">Characters are automatically converted to UPPERCASE.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Discount Type <span className="text-red-400">*</span></label>
            <select required name="discountType" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30">
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Discount Value Amount <span className="text-red-400">*</span></label>
            <input required type="number" name="discountValue" min="1" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="e.g. '50' for 50% or ₹50 flat" />
          </div>
          
          <div className="space-y-2">
             <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Minimum Order Value (₹) <span className="text-red-400">*</span></label>
             <input type="number" name="minOrderAmount" defaultValue="0" min="0" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="Leave 0 for no minimum" />
          </div>
        </div>

        {/* Global Submit */}
        <div className="pt-6 mt-4 border-t border-gray-50">
          <button disabled={loading} type="submit" className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#29A56C] transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-1">
            {loading ? (
              <span className="animate-pulse">Generating Code...</span>
            ) : (
              <><FiSave /> Activate Coupon</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
