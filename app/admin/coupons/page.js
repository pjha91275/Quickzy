import React from "react";
import Link from "next/link";
import { getCouponsAdmin, deleteCouponAdmin, toggleCouponStatusAdmin } from "@/actions/adminactions";
import { FiPlus, FiTrash2, FiTag, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default async function CouponsPage() {
  const coupons = await getCouponsAdmin();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">Coupon Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Create and manage active discount codes</p>
        </div>
        <Link href="/admin/coupons/new" className="bg-[#3BB77E] hover:bg-[#29A56C] text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2 transition-colors text-sm shadow-lg shadow-green-100/50">
          <FiPlus className="text-lg" /> Create New Coupon
        </Link>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F4F6FA] border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest rounded-tl-3xl">Coupon Code</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Discount Info</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Min Order</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 font-black">No coupons created yet.</td>
                </tr>
              ) : null}
              {coupons.map((c, index) => {
                const colorVariants = [
                  "bg-[#DEF9EC] text-[#3BB77E] border-green-100", // Green
                  "bg-blue-50 text-blue-500 border-blue-100", // Blue
                  "bg-orange-50 text-orange-500 border-orange-100", // Orange
                  "bg-purple-50 text-purple-500 border-purple-100", // Purple
                  "bg-pink-50 text-pink-500 border-pink-100", // Pink
                ];
                const theme = colorVariants[index % colorVariants.length];
                
                return (
                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5 align-middle">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl relative overflow-hidden ${theme}`}>
                       <FiTag className="text-lg shrink-0" />
                       <span className="font-black text-[#253D4E] text-[15px] tabular-nums tracking-wider">{c.code}</span>
                       {!c.isActive && (
                         <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
                       )}
                    </div>
                  </td>
                  <td className="p-5 align-middle">
                    <p className="font-black text-[#253D4E] text-[15px]">
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-0.5 capitalize">{c.discountType}</p>
                  </td>
                  <td className="p-5 align-middle">
                    <span className="text-[#253D4E] font-black text-[13px]">
                      {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "None"}
                    </span>
                  </td>
                  <td className="p-5 align-middle text-center">
                    <form action={toggleCouponStatusAdmin} className="inline-block relative z-10">
                      <input type="hidden" name="id" value={c._id} />
                      <input type="hidden" name="isActive" value={c.isActive ? "true" : "false"} />
                      <button type="submit" title="Toggle Status" className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 mx-auto ${
                        c.isActive ? "bg-green-50 text-[#3BB77E] hover:bg-red-50 hover:text-red-500" : "bg-red-50 text-red-500 hover:bg-green-50 hover:text-[#3BB77E]"
                      }`}>
                        {c.isActive ? <><FiCheckCircle /> Active</> : <><FiXCircle /> Disabled</>}
                      </button>
                    </form>
                  </td>
                  <td className="p-5 text-right align-middle">
                    <form action={deleteCouponAdmin} className="inline-block relative z-10">
                      <input type="hidden" name="id" value={c._id} />
                      <button type="submit" className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100">
                        <FiTrash2 className="text-xl" />
                      </button>
                    </form>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
