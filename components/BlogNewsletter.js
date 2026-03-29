"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function BlogNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.info("This feature is coming soon!");
      return;
    }
    // matching footer behavior
    toast.info("This feature is coming soon!");
    setEmail("");
  };

  return (
    <section className="pb-20 container mx-auto px-4">
      <div className="bg-[#253D4E] rounded-[32px] p-8 md:p-12 text-center text-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3BB77E]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Join our Newsletter</h2>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-8 uppercase tracking-widest leading-loose max-w-sm mx-auto">Weekly recipes and fresh commerce trends.</p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="flex-1 bg-white/10 rounded-xl px-6 py-3.5 outline-none focus:ring-2 ring-[#3BB77E] font-bold text-white placeholder-gray-500 transition-all" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-[#3BB77E] px-8 py-3.5 rounded-xl font-black hover:bg-[#29A56C] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-900/20"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
