"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { deleteProductAdmin, getProductsAdmin, updateProductAdmin } from "@/actions/adminactions";
import { FiPlus, FiTrash2, FiImage } from "react-icons/fi";
import { useStore } from "@/context/StoreContext";
import { toast } from "react-toastify";
import DeleteConfirmation from "./DeleteConfirmation";

export default function ProductsListContent({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const { storeData } = useStore();
  const lastSyncRef = useRef("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [previews, setPreviews] = useState({});

  // Algorithm: Data Synchronization logic (Syncing Admin List with StoreContext Global Promotions)
  const performSync = useCallback((currentProducts, pool) => {
    if (!pool?.length || !currentProducts?.length) return;

    const productMap = new Map();
    pool.forEach(p => {
      const idStr = (p._id || p.id)?.toString();
      if (idStr) productMap.set(idStr, p);
    });

    let updatesFound = 0;
    const syncedItems = currentProducts.map(item => {
      const liveProd = productMap.get((item._id || item.id)?.toString());
      if (!liveProd) return item;

      const livePrice = parseFloat(liveProd.price);
      const priceMismatch = Math.abs((item.price || 0) - livePrice) > 0.1;
      const discountMismatch = item.discount !== liveProd.discount;

      if (priceMismatch || discountMismatch) {
        updatesFound++;
        return { 
          ...item, 
          price: livePrice, 
          oldPrice: liveProd.oldPrice, 
          discount: liveProd.discount 
        };
      }
      return item;
    });

    if (updatesFound > 0) {
      const syncFingerprint = syncedItems.map(i => `${i._id}-${i.price}-${i.discount}`).join("|");
      if (syncFingerprint === lastSyncRef.current) return;
      
      lastSyncRef.current = syncFingerprint;
      setProducts(syncedItems);
    }
  }, []);

  useEffect(() => {
    if (!storeData.fullPool?.length || !products.length) return;
    performSync(products, storeData.fullPool);
  }, [storeData.fullPool, products, performSync]);

  const handleImageChange = (id, file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [id]: url }));
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    const formData = new FormData();
    formData.append("id", deleteModal.id);
    const res = await deleteProductAdmin(formData);
    if (res.success) {
      toast.success("Product deleted successfully");
      const updated = await getProductsAdmin();
      setProducts(updated);
    } else {
      toast.error(res.error || "Failed to delete product");
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleUpdateProduct = async (formData) => {
    const res = await updateProductAdmin(formData);
    if (res.success) {
      toast.success("Product updated successfully");
      // Clear preview
      const id = formData.get("id");
      setPreviews(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      const updated = await getProductsAdmin();
      setProducts(updated);
    } else {
      toast.error(res.error || "Failed to update product");
    }
  };

  return (
    <div>
      <DeleteConfirmation 
        isOpen={deleteModal.isOpen}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Product?"
        message="This will remove this item from your catalog and users will no longer see it. Proceed?"
      />
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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F4F6FA] border-b border-gray-100">
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest rounded-tl-3xl">Visual</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Price (Live)</th>
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
                <tr key={p._id} className="hover:bg-[#F2FBF6] transition-colors relative">
                  <td colSpan="5" className="p-0">
                    <form action={handleUpdateProduct} className="grid grid-cols-[100px_1fr_180px_150px_130px] items-center w-full group/edit">
                      <input type="hidden" name="id" value={p._id} />
                      
                      {/* Image Column */}
                      <div className="p-5">
                        <label className="relative w-14 h-14 bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden group/img hover:border-[#3BB77E] transition-all">
                          <input 
                            type="file" 
                            name="image" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(p._id, e.target.files[0])}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-black uppercase tracking-tight z-10 text-center leading-tight px-1">
                            {previews[p._id] ? "Selected" : "Swap"}
                          </div>
                          <img src={previews[p._id] || p.image || "/logo.png"} alt={p.name} className="max-w-full max-h-full object-contain" />
                        </label>
                      </div>

                      {/* Details Column (Name & Unit) */}
                      <div className="p-5 pr-2">
                        <input name="name" defaultValue={p.name} className="bg-transparent font-black text-[#253D4E] text-[15px] border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-1 w-full outline-none transition-all mb-1" placeholder="Product Name" />
                        <input name="unit" defaultValue={p.unit} className="bg-transparent text-[11px] text-gray-400 font-bold border border-transparent hover:border-gray-200 focus:border-[#3BB77E] focus:bg-white rounded px-2 py-0.5 w-full outline-none transition-all italic" placeholder="Unit (e.g. 1KG)" />
                      </div>

                      {/* Category Column */}
                      <div className="p-5">
                        <select name="category" defaultValue={p.category} className="w-full bg-transparent text-[10px] uppercase font-black tracking-widest px-2 py-1.5 rounded-lg border border-transparent hover:border-gray-200 focus:border-[#3BB77E] outline-none transition-all cursor-pointer">
                          {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                        {/* Price Column */}
                        <div className="p-5 flex flex-col gap-1.5 min-w-[150px]">
                           <div className="flex items-center gap-1 bg-transparent border border-transparent hover:border-gray-200 focus-within:border-[#3BB77E] focus-within:bg-white rounded px-2 py-1 transition-all">
                              <span className="font-black text-[#3BB77E] text-lg">₹</span>
                              <input required name="price" type="number" min="15" defaultValue={p.price} className="bg-transparent font-black text-lg text-[#3BB77E] w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                           </div>
                           <div className="flex items-center gap-1 bg-transparent border border-transparent hover:border-gray-200 focus-within:border-[#3BB77E] focus-within:bg-white rounded px-2 py-1 transition-all opacity-70">
                              <span className="font-bold text-gray-400 text-xs">MRP ₹</span>
                              <input name="oldPrice" type="number" min="15" defaultValue={p.oldPrice || ""} className="bg-transparent font-bold text-xs text-gray-400 w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0" />
                           </div>
                        </div>

                      {/* Action Column */}
                      <div className="p-5 text-right flex items-center justify-end gap-2">
                        <div className="opacity-0 group-focus-within/edit:opacity-100 group-hover/edit:opacity-100 transition-all duration-300">
                          <button type="submit" className="bg-[#3BB77E] text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-md hover:bg-[#29a56c] transition-colors cursor-pointer active:scale-95 whitespace-nowrap">
                            Save Edits
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, id: p._id })}
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

