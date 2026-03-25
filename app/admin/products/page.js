import React from "react";
import Link from "next/link";
import { getProductsAdmin, deleteProductAdmin } from "@/actions/adminactions";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default async function ProductsPage() {
  const products = await getProductsAdmin();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#253D4E]">Products</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage your live store catalog</p>
        </div>
        <Link href="/admin/products/new" className="bg-[#3BB77E] hover:bg-[#29A56C] text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2 transition-colors text-sm shadow-lg shadow-green-100/50">
          <FiPlus className="text-lg" /> Add New Product
        </Link>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F4F6FA] border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest rounded-tl-3xl">Image</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right rounded-tr-3xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 font-black">No products found. Start by adding one!</td>
                </tr>
              ) : null}
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-[#F2FBF6] transition-colors group">
                  <td className="p-5">
                    <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-center shrink-0">
                      <img src={p.image || "/logo.png"} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="font-black text-[#253D4E] text-[15px]">{p.name || "Unnamed File"}</p>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">{p.unit || "N/A"}</p>
                  </td>
                  <td className="p-5">
                    <span className="bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-black text-[#3BB77E] text-lg">₹{p.price}</span>
                      {p.oldPrice > 0 && <span className="text-xs text-gray-400 line-through font-bold">₹{p.oldPrice}</span>}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    {/* Server Action Form replacing Client AJAX logic to fit Next.js standard */}
                    <form action={deleteProductAdmin} className="inline-block">
                      <input type="hidden" name="id" value={p._id} />
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
