import React from "react";
import Link from "next/link";
import { getBannersAdmin, deleteBannerAdmin, updateBannerTextAdmin } from "@/actions/adminactions";
import { FiPlus, FiTrash2, FiImage, FiLink } from "react-icons/fi";

export default async function BannersPage() {
  const banners = await getBannersAdmin();

  // Helper to remove HTML tags so admins only see plain text
  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, ' ') : '';

  return (
    <div>
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
                    <div className={`w-32 h-20 rounded-2xl p-2 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden ${b.bgColor || "bg-gray-50"}`}>
                      {b.image ? (
                        <img src={b.image} alt="Banner" className="w-full h-full object-contain" />
                      ) : (
                        <FiImage className="text-gray-300 text-2xl" />
                      )}
                    </div>
                  </td>
                  <td className="p-5 min-w-[300px] align-middle">
                    <form action={updateBannerTextAdmin} className="flex flex-col gap-1 relative group/edit">
                      <input type="hidden" name="id" value={b._id} />
                      <textarea name="title" defaultValue={stripHtml(b.title).trim()} className="bg-transparent font-black text-[#253D4E] text-[13px] border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-1.5 w-full outline-none focus:ring-4 focus:ring-[#3BB77E]/10 transition-all resize-none h-[40px] leading-tight" placeholder="Title (Plain Text)"></textarea>
                      <input name="subtitle" defaultValue={b.subtitle || b.tag || ""} className="bg-transparent text-[11px] text-gray-400 font-bold border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-1 w-full outline-none focus:ring-4 focus:ring-[#3BB77E]/10 transition-all" placeholder="Subtitle / Tag" />
                      
                      <div className="absolute -bottom-7 right-2 opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 pointer-events-none group-focus-within/edit:pointer-events-auto group-focus-within/edit:opacity-100">
                        <button type="submit" className="bg-[#3BB77E] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg hover:bg-[#29a56c] pointer-events-auto">
                          Save Edits
                        </button>
                      </div>
                    </form>
                  </td>
                  <td className="p-5 align-middle">
                    <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg ${
                      b.type === "hero" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {b.type === "hero" ? "Hero Slider" : "Footer Wide"}
                    </span>
                  </td>
                  <td className="p-5 align-middle">
                    <span className="text-blue-500 font-bold text-[12px] flex items-center gap-1.5 max-w-[150px] truncate">
                      <FiLink className="shrink-0" /> {b.shopLink || "/shop"}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <form action={deleteBannerAdmin} className="inline-block relative z-10">
                      <input type="hidden" name="id" value={b._id} />
                      <button type="submit" className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
                        <FiTrash2 className="text-xl" />
                      </button>
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
