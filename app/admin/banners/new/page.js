"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBannerAdmin } from "@/actions/adminactions";
import { FiSave, FiImage, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-toastify";

export default function NewBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    
    try {
      const res = await saveBannerAdmin(formData);
      if (res?.success) {
        toast.success("Hooray! Banner deployed successfully.");
        router.push("/admin/banners");
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
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/banners" className="w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:bg-[#DEF9EC] hover:text-[#3BB77E] transition-all shadow-sm">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">Upload New Banner</h1>
          <p className="text-sm text-gray-500 font-medium">Create a new slider hero promotion</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Banner Type <span className="text-red-400">*</span></label>
            <select required name="type" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30">
              <option value="hero">Hero Slider (Top)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Shop Navigation Link <span className="text-red-400">*</span></label>
            <input required type="text" name="shopLink" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="/shop?category=Vegetables" />
          </div>
        </div>

        {/* Text Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Main Title <span className="text-red-400">*</span></label>
            <textarea required name="title" rows={3} className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30 resize-none" placeholder="Everyday Essentials&#10;Within 15 Mins" />
          </div>
          
          <div className="flex flex-col gap-6">
             <div className="space-y-2">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Subtitle</label>
               <input type="text" name="subtitle" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="Save up to 50% on your first order" />
             </div>
             
             <div className="space-y-2">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Top Tagline</label>
               <input type="text" name="tag" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="Quickzy: Fresh. Fast. Delivered." />
             </div>
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Background Color CSS (Tailwind class) <span className="text-red-400">*</span></label>
            <input type="text" required name="bgColor" className="w-full bg-[#F4F6FA] border-none rounded-2xl py-4 px-5 text-[15px] font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/30" placeholder="bg-[#DEF9EC] or bg-pink-50" />
        </div>

        {/* Secure Cloudinary Image Upload Section */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] ml-2">Upload Transparent PNG/WebP <span className="text-red-400">*</span></label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
             <div className="w-full sm:w-[400px] h-48 rounded-3xl bg-[#F4F6FA] border-2 border-dashed border-[#BCE3C9] flex items-center justify-center text-[#3BB77E] overflow-hidden relative shadow-inner">
               {preview ? (
                 <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
               ) : (
                 <div className="flex flex-col items-center">
                    <FiImage className="text-4xl opacity-50 mb-2" />
                    <span className="font-bold opacity-50">Click to Browse</span>
                 </div>
               )}
               {/* Note: This naturally maps into formData to be sent safely to the Next server */}
               <input required type="file" name="image" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
             </div>
             <div className="flex-1">
               <p className="text-lg font-black text-[#253D4E] mb-1">Visual Requirements</p>
               <p className="text-sm text-gray-400 font-bold leading-relaxed">
                 - Prefer transparent PNG or WEBP.<br/>
                 - Max upload size is 5MB.<br/>
                 - The image will automatically be uploaded securely to Cloudinary and tracked in MongoDB.
               </p>
             </div>
          </div>
        </div>

        {/* Global Submit */}
        <div className="pt-6">
          <button disabled={loading} type="submit" className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#29A56C] transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-1">
            {loading ? (
              <span className="animate-pulse">Uploading to Cloudinary...</span>
            ) : (
              <><FiSave /> Publish Banner</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
