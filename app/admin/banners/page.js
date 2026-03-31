"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBannersAdmin, deleteBannerAdmin, updateBannerAdmin } from "@/actions/adminactions";
import { FiPlus, FiTrash2, FiImage, FiLink } from "react-icons/fi";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "react-toastify";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [previews, setPreviews] = useState({});

  const loadBanners = async () => {
    setLoading(true);
    const data = await getBannersAdmin();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleImageChange = (id, file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [id]: url }));
    }
  };

  /* Algorithm: HTML Stripper for cleaning banner text */
  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, ' ') : '';

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    const formData = new FormData();
    formData.append("id", deleteModal.id);
    const res = await deleteBannerAdmin(formData);
    if (res.success) {
      toast.success("Banner deleted successfully");
      loadBanners();
    } else {
      toast.error("Failed to delete banner");
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleUpdateBanner = async (formData) => {
    const res = await updateBannerAdmin(formData);
    if (res.success) {
      toast.success("Banner updated successfully");
      // Clear preview for this banner
      const id = formData.get("id");
      setPreviews(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      loadBanners();
    } else {
      toast.error(res.error || "Failed to update banner");
    }
  };

  if (loading && banners.length === 0) {
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
        title="Remove Banner?"
        message="This will remove the promotion from your homepage permanently. Proceed?"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">Banner Management</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Upload and rotate your homepage promotions</p>
        </div>
        <Link href="/admin/banners/new" className="bg-[#3BB77E] hover:bg-[#29A56C] text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2 transition-colors text-sm shadow-lg shadow-green-100/50">
          <FiPlus className="text-lg" /> Create New Banner
        </Link>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F4F6FA] border-b border-gray-100">
                {/* Visual Preview */}
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Banner Info</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Link</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right rounded-tr-3xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 font-black">No banners uploaded yet.</td>
                </tr>
              ) : null}
              {banners.map((b) => (
                <tr key={b._id} className="hover:bg-[#F2FBF6] transition-colors group relative">
                  <td colSpan="5" className="p-0">
                    <form action={handleUpdateBanner} className="grid grid-cols-[160px_1fr_120px_1fr_100px] items-center w-full group/edit">
                      <input type="hidden" name="id" value={b._id} />
                      
                      {/* Visual (Image) Column */}
                      <div className="p-5">
                        <label className="relative w-32 h-20 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden cursor-pointer hover:border-[#3BB77E] transition-all group/img">
                          <input 
                            type="file" 
                            name="image" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(b._id, e.target.files[0])}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest z-10 text-center">
                            {previews[b._id] ? "Image Selected" : "Change Image"}
                          </div>
                          {previews[b._id] || b.image ? (
                            <img src={previews[b._id] || b.image} alt="Banner" className="w-full h-full object-cover" />
                          ) : (
                            <FiImage className="text-gray-300 text-2xl" />
                          )}
                        </label>
                      </div>

                      {/* Content details and taglines */}
                      <div className="p-5 min-w-[300px]">
                        <div className="flex flex-col gap-1">
                          <textarea name="title" defaultValue={b.title || ""} className="bg-transparent font-black text-[#253D4E] text-[13px] border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-1.5 w-full outline-none focus:ring-4 focus:ring-[#3BB77E]/10 transition-all resize-none h-[40px] leading-tight" placeholder="Title (Plain Text)"></textarea>
                          {b.type !== "footer" && (
                            <input name="subtitle" defaultValue={b.subtitle || b.tag || ""} className="bg-transparent text-[11px] text-gray-400 font-bold border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-1 w-full outline-none focus:ring-4 focus:ring-[#3BB77E]/10 transition-all" placeholder="Subtitle / Tag" />
                          )}
                        </div>
                      </div>

                      {/* Type Column */}
                      <div className="p-5">
                        <select name="type" defaultValue={b.type} className="bg-transparent text-[10px] uppercase font-black tracking-widest px-2 py-1.5 rounded-lg border border-transparent hover:border-gray-200 focus:border-[#3BB77E] outline-none transition-all cursor-pointer">
                          <option value="hero">Hero</option>
                          <option value="footer">Footer</option>
                        </select>
                      </div>

                      {/* Navigation destination */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 bg-transparent border border-transparent hover:border-gray-200 focus-within:border-[#3BB77E] focus-within:bg-white group/link rounded px-2 py-1.5 transition-all">
                          <FiLink className="text-gray-400 shrink-0 text-xs" />
                          <input name="shopLink" defaultValue={decodeURIComponent(b.shopLink || "/shop")} className="bg-transparent text-[12px] font-bold text-blue-500 w-full outline-none" placeholder="/shop" />
                        </div>
                      </div>

                      {/* Action controls */}
                      <div className="p-5 text-right flex items-center justify-end gap-2">
                        <div className="opacity-0 group-focus-within/edit:opacity-100 group-hover/edit:opacity-100 transition-all duration-300">
                          <button type="submit" className="bg-[#3BB77E] text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-md hover:bg-[#29a56c] transition-colors cursor-pointer active:scale-95 whitespace-nowrap">
                            Save Edits
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, id: b._id })}
                          className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
