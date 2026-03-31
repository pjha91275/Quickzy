"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBannersAdmin, deleteBannerAdmin, updateBannerTextAdmin } from "@/actions/adminactions";
import { FiPlus, FiTrash2, FiImage, FiLink } from "react-icons/fi";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "react-toastify";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const loadBanners = async () => {
    setLoading(true);
    const data = await getBannersAdmin();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // remove html tags
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

  const handleUpdateText = async (e) => {
    const formData = new FormData(e.target);
    const res = await updateBannerTextAdmin(formData);
    if (res.success) {
      toast.success("Banner updated");
      loadBanners();
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
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest rounded-tl-3xl">Visual</th>
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
                <tr key={b._id} className="hover:bg-[#F2FBF6] transition-colors group">
                  <td className="p-5">
                    <div className={`w-32 h-20 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden ${b.bgColor || "bg-gray-50"}`}>
                      {b.image ? (
                        <img src={b.image} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <FiImage className="text-gray-300 text-2xl" />
                      )}
                    </div>
                  </td>
                  <td className="p-5 min-w-[300px] align-middle">
                    <form action={handleUpdateText} className="flex flex-col gap-1 relative group/edit">
                      <input type="hidden" name="id" value={b._id} />
                      <textarea name="title" defaultValue={stripHtml(b.title).trim()} className="bg-transparent font-black text-[#253D4E] text-[13px] border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-1.5 w-full outline-none focus:ring-4 focus:ring-[#3BB77E]/10 transition-all resize-none h-[40px] leading-tight" placeholder="Title (Plain Text)"></textarea>
                      {b.type !== "footer" && (
                        <input name="subtitle" defaultValue={b.subtitle || b.tag || ""} className="bg-transparent text-[11px] text-gray-400 font-bold border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-1 w-full outline-none focus:ring-4 focus:ring-[#3BB77E]/10 transition-all" placeholder="Subtitle / Tag" />
                      )}
                      
                      <div className="opacity-0 max-h-0 group-focus-within/edit:max-h-10 group-focus-within/edit:opacity-100 group-hover/edit:max-h-10 group-hover/edit:opacity-100 transition-all duration-300 overflow-hidden flex justify-end mt-1">
                        <button type="submit" className="bg-[#3BB77E] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md hover:bg-[#29a56c] transition-colors cursor-pointer active:scale-95">
                          Save Edits
                        </button>
                      </div>
                    </form>
                  </td>
                  <td className="p-5 align-middle">
                    <span className={`text-[9.5px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap ${
                      b.type === "hero" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {b.type === "hero" ? "Hero" : "Footer"}
                    </span>
                  </td>
                  <td className="p-5 align-middle">
                    <div className="text-blue-500 font-bold text-[12px] flex items-center gap-1.5 max-w-[180px] sm:max-w-[200px] lg:max-w-[400px] overflow-x-auto pb-1.5 whitespace-nowrap">
                      <FiLink className="shrink-0" /> {decodeURIComponent(b.shopLink || "/shop")}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, id: b._id })}
                      className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
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
