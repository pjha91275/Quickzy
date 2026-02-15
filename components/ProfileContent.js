"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from "react-icons/fi";

export default function ProfileContent() {
  const { data: session } = useSession();

  // Local state for form fields
  const [name, setName] = useState(session?.user?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(session?.user?.address?.text || "");

  const handleSave = () => {
    alert("Profile settings saved! (Frontend only)");
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-black text-[#253D4E] mb-8">
          Your Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-6 border-b">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] overflow-hidden border">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <FiUser size={32} />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <FiSave className="text-white text-xl" />{" "}
                {/* Reusing save icon as a placeholder for upload */}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => console.log(e.target.files[0])}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-bold text-[#3BB77E]">
                Account Settings
              </p>
              <h2 className="text-xl font-black text-[#253D4E]">
                {session?.user?.name || "User"}
              </h2>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full bg-[#F4F6FA] border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/20"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Email Address (Locked)
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  disabled
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-gray-400 cursor-not-allowed"
                  value={session?.user?.email || ""}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  className="w-full bg-[#F4F6FA] border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Delivery Address
              </label>
              <div className="relative flex items-start">
                <FiMapPin className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  rows={3}
                  className="w-full bg-[#F4F6FA] border-none rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/20 resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your saved location"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#3BB77E] text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#29A56C] transition-all shadow-lg shadow-green-100"
          >
            <FiSave /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
