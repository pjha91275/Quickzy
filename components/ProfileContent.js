"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
  FiCamera,
} from "react-icons/fi";
import { updateProfile } from "@/actions/useractions";
import { toast } from "react-toastify";

export default function ProfileContent() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  // Load data when session is ready
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhone(session.user.phone || "");
      setAddress(session.user.address?.text || "");
      setAvatar(session.user.image || "");
    }
  }, [session]);

  const handleSave = async () => {
    if (!name || !phone) {
      return toast.error("Name and Phone are required!");
    }

    setLoading(true);
    const res = await updateProfile(session.user.email, {
      name,
      phone,
      "address.text": address,
      image: avatar, // In a real app, you'd upload the file first, but we'll save the URL for now
    });

    if (res.success) {
      toast.success("Profile updated successfully!");
      await update(); // This refreshes the session data on the client side
    } else {
      toast.error("Failed to update profile.");
    }
    setLoading(false);
  };

  // Simple mock image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we just show a toast as real upload requires an API route/Cloudinary
      toast.info(
        "Image selected! (In a real app, we'd upload this to Cloudinary now)",
      );
      // Mock: create a local preview URL
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] py-10 font-sans">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-black text-[#253D4E] mb-8">My Profile</h1>

        <div className="bg-white rounded-3xl shadow-sm border p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 pb-8 border-b">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] overflow-hidden border-4 border-white shadow-md">
                {avatar ? (
                  <img
                    src={avatar}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <FiUser size={40} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#3BB77E] p-2 rounded-full text-white cursor-pointer hover:scale-110 transition-all border-2 border-white shadow-lg">
                <FiCamera size={16} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div>
              <p className="text-xs font-black text-[#3BB77E] uppercase tracking-widest mb-1">
                Welcome Back,
              </p>
              <h2 className="text-2xl font-black text-[#253D4E]">
                {name || "Quickzy User"}
              </h2>
            </div>
          </div>

          {/* Form Section */}
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/20"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                Email (Read Only)
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200" />
                <input
                  type="text"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-300 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/20"
                  placeholder="Enter Mobile Number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                Delivery Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-5 text-gray-300" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#253D4E] outline-none focus:ring-2 focus:ring-[#3BB77E]/20 resize-none"
                  placeholder="Flat No, Building, Area..."
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#29A56C] transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FiSave /> Save Profile Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
