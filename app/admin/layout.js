"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiImage, FiTag, FiMenu, FiX, FiGrid } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

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
      {/* Sidebar - Desktop Only */}
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
        {/* Mobile Nav Top Bar - Replaced Tabs with Hamburger */}
        <div className="md:hidden mb-6">
           <div 
             className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex justify-between items-center cursor-pointer active:scale-95 transition-all"
             onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
           >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E]">
                  <FiGrid className="text-xl" />
                </div>
                <div>
                  <h2 className="font-black text-[#253D4E] leading-none">Admin Menu</h2>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    {navLinks.find(l => l.href === pathname)?.name || "Select Tab"}
                  </p>
                </div>
              </div>
              <IoIosArrowDown className={`text-gray-300 transition-transform duration-300 ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
           </div>

           <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAdminMenuOpen ? 'max-h-[500px] mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white border border-gray-100 rounded-[32px] p-3 shadow-xl grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsAdminMenuOpen(false)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${
                        isActive
                          ? "bg-[#3BB77E] text-white shadow-lg shadow-green-100"
                          : "bg-gray-50 text-gray-500 hover:bg-[#DEF9EC] hover:text-[#3BB77E]"
                      }`}
                    >
                      <div className="text-xl mb-1">{link.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-tighter">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
           </div>
        </div>
        
        <div className="bg-white rounded-[40px] md:rounded-3xl shadow-sm border p-6 md:p-8 min-h-[75vh]">
          {children}
        </div>
      </main>
    </div>
  );
}
