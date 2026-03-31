"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCouponsAdmin, deleteCouponAdmin, toggleCouponStatusAdmin } from "@/actions/adminactions";
import { FiPlus, FiTrash2, FiTag, FiCheckCircle, FiXCircle } from "react-icons/fi";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "react-toastify";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const loadCoupons = async () => {
    setLoading(true);
    const data = await getCouponsAdmin();
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    const formData = new FormData();
    formData.append("id", deleteModal.id);
    const res = await deleteCouponAdmin(formData);
    if (res.success) {
      toast.success("Coupon deleted successfully");
      loadCoupons();
    } else {
      toast.error("Failed to delete coupon");
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleToggle = async (id, currentStatus) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("isActive", currentStatus.toString());
    await toggleCouponStatusAdmin(formData);
    loadCoupons();
  };

  if (loading && coupons.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#3BB77E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <DeleteConfirmation 
        isOpen={deleteModal.isOpen}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Coupon?"
        message="This will permanently disable this discount code. Do you want to proceed?"
      />

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
                  "bg-indigo-50 text-indigo-500 border-indigo-100", // Indigo
                  "bg-purple-50 text-purple-500 border-purple-100", // Purple
                  "bg-pink-50 text-pink-500 border-pink-100", // Pink
                ];
                const theme = colorVariants[index % colorVariants.length];
                
                return (
                <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
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
                      {c.freeDelivery && c.discountValue === 0 ? "Free Delivery" : (
                        c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`
                      )}
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-0.5 capitalize">{c.freeDelivery && c.discountValue === 0 ? "Shipping" : c.discountType}</p>
                  </td>
                  <td className="p-5 align-middle">
                    <span className="text-[#253D4E] font-black text-[13px]">
                      {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "None"}
                    </span>
                  </td>
                  <td className="p-5 align-middle text-center">
                    <button 
                      onClick={() => handleToggle(c._id, c.isActive)}
                      className={`group relative px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 mx-auto overflow-hidden ${
                        c.isActive ? "bg-green-50 text-[#3BB77E] hover:bg-rose-50" : "bg-rose-50 text-rose-500 hover:bg-green-50"
                      }`}
                    >
                      {c.isActive ? (
                        <>
                          <span className="flex items-center gap-1 group-hover:hidden"><FiCheckCircle /> Active</span>
                          <span className="hidden group-hover:flex items-center gap-1 text-rose-500"><FiXCircle /> Disable</span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1 group-hover:hidden"><FiXCircle /> Disabled</span>
                          <span className="hidden group-hover:flex items-center gap-1 text-[#3BB77E]"><FiCheckCircle /> Make Active</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-5 text-right align-middle">
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, id: c._id })}
                      className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
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
