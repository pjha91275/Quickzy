"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProductAdmin } from "@/actions/adminactions";
import { FiSave, FiImage, FiArrowLeft, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-toastify";
import { useStore } from "@/context/StoreContext";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showNewCat, setShowNewCat] = useState(false);
  const { storeData } = useStore();
  const categories = storeData?.categories || [];


  /* Algorithm: Form Submission and Server Action trigger */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    try {
      const res = await saveProductAdmin(formData);
      if (res?.success) {
        toast.success("Hooray! Product added successfully.");
        router.push("/admin/products");
      } else {
        toast.error("Failed: " + (res?.error || "Unknown"));
      }
    } catch (err) {
      toast.error("An error occurred during upload.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, and WEBP formats are allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB.");
        e.target.value = "";
        return;
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:bg-[#DEF9EC] hover:text-[#3BB77E] transition-all shadow-sm">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">Add New Product</h1>
          <p className="text-sm text-gray-500 font-medium">Create a new item in your store's catalog</p>
        </div>
      </div>

      {/* Main inventory form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
        
        {/* Basic Information */}
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Product Name <span className="text-red-400">*</span></label>
            <input required type="text" name="name" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="e.g. Fresh Mangoes (Alphonso)" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Category <span className="text-red-400">*</span></label>
            <select 
              required 
              name="category" 
              onChange={(e) => setShowNewCat(e.target.value === "NEW_CATEGORY_TRIGGER")}
              className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30"
            >
              <option value="">Select a Category</option>
              {categories.map(c => {
                const name = typeof c === 'string' ? c : (c.name || "Grocery");
                return (
                  <option key={name} value={name}>{name}</option>
                );
              })}
              <option value="NEW_CATEGORY_TRIGGER" className="text-[#3BB77E] font-black italic">+ Add New Category...</option>
            </select>
          </div>
        </div>

        {/* Expanded Category Setup */}
        {showNewCat && (
          <div className="bg-[#F2FBF6] rounded-3xl p-6 border-2 border-dashed border-[#BCE3C9] animate-fadeIn space-y-6">
            <div className="flex items-center gap-3 text-[#3BB77E] mb-2">
              <FiPlus className="text-xl" />
              <h3 className="font-black text-sm uppercase tracking-widest">Setup New Category</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">New Category Name <span className="text-red-400">*</span></label>
                <input required={showNewCat} type="text" name="newCategoryName" className="w-full bg-white border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30 shadow-sm" placeholder="e.g. Organic Grains" />
                <p className="text-[10px] text-gray-400 font-bold ml-2 italic">Note: The visual asset of this first product will become the category cover.</p>
              </div>
            </div>
          </div>
        )}

        {/* Commercial and inventory units */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Sale Price (₹) <span className="text-red-400">*</span></label>
            <input required type="number" min="15" name="price" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">MRP (₹)</label>
            <input type="number" min="15" name="oldPrice" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Quantity Unit <span className="text-red-400">*</span></label>
            <input required type="text" name="unit" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="e.g. 1 kg, 500g, 1 Dozen" />
          </div>
        </div>

        {/* Promotional highlight text */}
        <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Discount Badge Text (Optional)</label>
            <input type="text" name="discount" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="e.g. 10% OFF, BESTSELLER" />
        </div>

        {/* Media management and preview */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Upload Visual Asset</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
             <div className="w-32 h-32 rounded-3xl bg-[#F4F6FA] border-2 border-dashed border-[#BCE3C9] flex items-center justify-center text-[#3BB77E] overflow-hidden relative shadow-inner">
               {preview ? (
                 <img src={preview} alt="Preview" className="w-[80%] h-[80%] object-contain" />
               ) : (
                 <FiImage className="text-4xl opacity-50" />
               )}
               {/* Hidden image input for Cloudinary upload */}
               <input required type="file" name="image" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
             <div className="flex-1">
               <p className="text-lg font-black text-[#253D4E] mb-1">Click the box to upload</p>
               <p className="text-sm text-gray-400 font-bold leading-relaxed">
                 PNG, JPG, or WEBP Preferred. Max size 2MB. <br/>
                 The image will be securely uploaded to Cloudinary.
               </p>
             </div>
          </div>
        </div>

        {/* Final submission control */}
        <div className="pt-6">
          <button disabled={loading} type="submit" className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#29A56C] transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-1">
            {loading ? (
              <span className="animate-pulse">Uploading to Cloudinary...</span>
            ) : (
              <><FiSave /> Publish Product</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
