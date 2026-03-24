"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiImage, FiTag } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <FiHome /> },
    { name: "Products", href: "/admin/products", icon: <FiBox /> },
    { name: "Orders", href: "/admin/orders", icon: <FiShoppingBag /> },
    { name: "Coupons", href: "/admin/coupons", icon: <FiTag /> },
    { name: "Users", href: "/admin/users", icon: <FiUsers /> },
    { name: "Banners", href: "/admin/banners", icon: <FiImage /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r shadow-sm hidden md:flex flex-col shrink-0 min-h-screen sticky top-0">
        <div className="p-6">
          <h2 className="text-xl font-black text-[#253D4E] tracking-tight">
            Admin <span className="text-[#3BB77E]">Panel</span>
          </h2>
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-1">
            Store Management
          </p>
        </div>
        <nav className="flex flex-col gap-2 px-4 pb-6 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-[#3BB77E] text-white shadow-md shadow-green-100"
                    : "text-gray-500 hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
                }`}
              >
                <div className="text-lg">{link.icon}</div>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
        {/* Mobile Nav inside content for simplicity, visible only on small screens */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
           {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#3BB77E] text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {link.icon} {link.name}
              </Link>
            );
          })}
        </div>
        
        <div className="bg-white rounded-3xl shadow-sm border p-6 md:p-8 min-h-[75vh]">
          {children}
        </div>
      </main>
    </div>
  );
}
