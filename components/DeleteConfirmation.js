"use client";
import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function DeleteConfirmation({ isOpen, onCancel, onConfirm, title, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCancel}></div>
      <div className="bg-white rounded-[32px] p-8 max-w-sm w-full relative z-10 shadow-2xl border border-rose-50 animate-in fade-in zoom-in duration-300 text-center">
        <button onClick={onCancel} className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 transition-colors">
          <FiX size={20} />
        </button>
        
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto text-rose-500 shadow-inner">
          <FiAlertTriangle size={40} className="animate-bounce" />
        </div>
        
        <h3 className="text-2xl font-black text-[#253D4E] mb-2 uppercase tracking-tight">
          {title || "Wait! Are you sure?"}
        </h3>
        
        <p className="text-gray-500 text-sm font-bold mb-8 leading-relaxed">
          {message || "This action is permanent and cannot be undone. Are you absolutely sure you want to delete this?"}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full !bg-[#f43f5e] text-white py-4 rounded-2xl font-black text-base hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 active:scale-95 translate-y-0 hover:-translate-y-1 cursor-pointer"
          >
            Yes, Delete Permanently
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-black text-base hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95 cursor-pointer"
          >
            No, Keep it safe
          </button>
        </div>
      </div>
    </div>
  );
}
