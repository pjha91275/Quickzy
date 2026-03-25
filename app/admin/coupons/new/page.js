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
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/coupons" className="w-10 h-10 bg-white border text-gray-500 rounded-full flex items-center justify-center hover:bg-green-100 hover:text-green-700">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Coupon</h1>
          <p className="text-sm text-gray-500">Generate a discount code with usage limits</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8 border shadow-sm space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Coupon Code <span className="text-red-500">*</span></label>
            <div className="relative">
               <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input required type="text" name="code" className="w-full pl-10 bg-gray-50 border rounded-lg py-3 px-4 text-sm font-bold uppercase text-gray-800 outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. WELCOME50" />
            </div>
            <p className="text-[10px] text-gray-400 ml-1">Will be converted to UPPERCASE.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Discount Type <span className="text-red-500">*</span></label>
            <select required name="discountType" className="w-full bg-gray-50 border rounded-lg py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-green-500">
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Discount Value <span className="text-red-500">*</span></label>
            <input required type="number" name="discountValue" min="1" className="w-full bg-gray-50 border rounded-lg py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 50" />
          </div>
          
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase ml-1">Minimum Order Value (₹) <span className="text-red-500">*</span></label>
             <input type="number" name="minOrderAmount" defaultValue="0" min="0" className="w-full bg-gray-50 border rounded-lg py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-green-500" placeholder="0 for no minimum" />
          </div>
        </div>

        {/* Usage Limits additions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Global Usage Limit <span className="text-red-500">*</span></label>
            <input type="number" required name="totalUsageLimit" defaultValue="100" min="1" className="w-full bg-gray-50 border rounded-lg py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-green-500" placeholder="Total times it can be used" />
          </div>
          
          <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase ml-1">Limit Per User <span className="text-red-500">*</span></label>
             <input type="number" required name="usageLimitPerUser" defaultValue="1" min="1" className="w-full bg-gray-50 border rounded-lg py-3 px-4 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-green-500" placeholder="Times 1 user can use it" />
          </div>
        </div>

        {/* Global Submit */}
        <div className="pt-6 mt-4 border-t">
          <button disabled={loading} type="submit" className="w-full bg-green-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "Saving..." : <><FiSave /> Activate Coupon</>}
          </button>
        </div>

      </form>
    </div>
  );
}
