"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiRefreshCw,
  FiGrid,
  FiHeadphones,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
      <header className="w-full bg-white border-b relative font-sans z-50">
        {/* Main Header */}
        <div className="container mx-auto p-4 flex justify-between items-center gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex flex-col">
              <div className="flex items-center leading-none">
                <img
                  src="/logo.png"
                  alt="Quickzy Logo"
                  className="w-12 h-12 md:w-16 md:h-16 object-contain group-hover:scale-110 transition-transform"
                />
                <div className="text-2xl md:text-3xl lg:text-4xl font-black text-[#3BB77E] tracking-tight ml-2">
                  Quickzy
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-bold ml-14 md:ml-20 whitespace-nowrap">
                Fast. Fresh. Delivered in a Zap.
              </span>
            </div>
          </Link>

          {/* Search - Hidden on small mobile, simplified on small tablet */}
          <div className="hidden sm:flex flex-1 max-w-2xl border-2 border-[#BCE3C9] rounded-md items-center h-11 relative">
            <div className="px-4 border-r hidden lg:block text-sm font-bold text-gray-700 whitespace-nowrap">
              All Categories <IoIosArrowDown className="inline ml-1" />
            </div>
            <input
              type="text"
              placeholder="Search for items..."
              className="flex-1 px-4 outline-none text-sm text-gray-600 h-full w-full bg-transparent"
            />
            <button className="h-full px-5 bg-[#3BB77E] text-white flex items-center justify-center rounded-r-sm hover:bg-[#29A56C] transition-colors">
              <FiSearch className="text-xl" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 md:gap-5 lg:gap-6 items-center text-[#253D4E] shrink-0">
            <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all group">
              <div className="relative">
                <FiRefreshCw className="text-2xl" />
                <span className="absolute -top-1 -right-2 bg-[#3BB77E] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#3BB77E]">
                Compare
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all group">
              <div className="relative">
                <FiHeart className="text-2xl" />
                <span className="absolute -top-1 -right-2 bg-[#3BB77E] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-[#3BB77E]">
                Wishlist
              </span>
            </div>
            <Link
              href="/cart"
              className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all group"
            >
              <div className="relative">
                <FiShoppingCart className="text-2xl" />
                <span className="absolute -top-1 -right-2 bg-[#3BB77E] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-500 group-hover:text-[#3BB77E]">
                Cart
              </span>
            </Link>

            {/* User Account / Login */}
            <div className="relative group/account">
              {!isLoggedIn ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-all group outline-none"
                >
                  <FiUser className="text-2xl" />
                  <span className="hidden sm:block text-sm font-medium text-gray-500 group-hover:text-[#3BB77E]">
                    Login
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1 cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] font-bold text-xs uppercase">
                    JD
                  </div>
                  <span className="hidden sm:block text-sm font-black text-[#253D4E] group-hover:text-[#3BB77E]">
                    My Account <IoIosArrowDown className="inline text-[10px]" />
                  </span>
                </div>
              )}

              <div className="hidden absolute top-full right-0 mt-4 w-48 bg-white border rounded-xl shadow-xl p-4 z-50 group-hover/account:block animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col gap-3">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/profile"
                        className="text-sm font-bold text-gray-600 hover:text-[#3BB77E] flex items-center gap-2 border-b pb-2"
                      >
                        <FiUser className="text-lg" /> My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="text-sm font-bold text-gray-600 hover:text-[#3BB77E] flex items-center gap-2 border-b pb-2"
                      >
                        <FiHeart className="text-lg" /> Orders
                      </Link>
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2 pt-1 transition-colors"
                      >
                        <FiX className="text-lg" /> Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-xs font-bold text-[#3BB77E] hover:underline"
                    >
                      Login / Register
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hamburger (Mobile/Tablet) */}
            <button
              className="lg:hidden p-2 text-2xl text-[#253D4E]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Bottom Nav (Desktop) */}
        <div className="border-t hidden lg:block bg-white">
          <div className="container mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex gap-10 items-center h-full">
              <button className="bg-[#3BB77E] text-white px-6 py-2.5 rounded-md flex items-center gap-2 font-black text-sm hover:bg-[#29A56C] transition-colors shadow-sm">
                <FiGrid className="text-lg" /> Browse All Categories{" "}
                <IoIosArrowDown />
              </button>

              <nav className="flex gap-8 font-bold text-[#253D4E] text-sm">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-[#3BB77E] hover:text-[#29A56C] transition-colors"
                >
                  Hot Deals
                </Link>
                <Link
                  href="/"
                  className="hover:text-[#3BB77E] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="hover:text-[#3BB77E] transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/shop"
                  className="hover:text-[#3BB77E] transition-colors flex items-center gap-1"
                >
                  Shop <IoIosArrowDown className="text-xs" />
                </Link>
                <Link
                  href="/vendors"
                  className="hover:text-[#3BB77E] transition-colors flex items-center gap-1"
                >
                  Vendors <IoIosArrowDown className="text-xs" />
                </Link>
                <Link
                  href="/blog"
                  className="hover:text-[#3BB77E] transition-colors flex items-center gap-1"
                >
                  Blog <IoIosArrowDown className="text-xs" />
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-[#3BB77E] transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <FiHeadphones className="text-4xl text-[#253D4E]" />
              <div className="text-right">
                <div className="text-[#3BB77E] text-2xl font-black leading-none">
                  +91 1800-419
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  24/7 Delivery Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Mobile Drawer */}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 pb-4 border-b">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-black text-[#3BB77E]">
                  Quickzy
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl text-gray-400 hover:text-red-500"
              >
                <FiX />
              </button>
            </div>

            <div className="mb-8">
              <div className="flex border rounded-md p-2 bg-gray-50 focus-within:border-[#3BB77E] transition-colors">
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="bg-transparent flex-1 outline-none text-sm px-2"
                />
                <FiSearch className="text-gray-400" />
              </div>
            </div>

            <nav className="flex flex-col gap-5 font-bold text-[#253D4E] overflow-y-auto flex-1 pb-10">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-2 border-b border-gray-50 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-2 border-b border-gray-50 transition-colors flex justify-between items-center"
              >
                Shop <IoIosArrowDown className="text-xs" />
              </Link>
              <Link
                href="/vendors"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-2 border-b border-gray-50 transition-colors"
              >
                Vendors
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-2 border-b border-gray-50 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-2 border-b border-gray-50 transition-colors"
              >
                Contact
              </Link>

              <div className="mt-auto space-y-6 pt-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border flex items-center justify-center text-[#3BB77E]">
                    <FiHeadphones className="text-xl" />
                  </div>
                  <div>
                    <p className="font-black text-[#3BB77E] leading-none">
                      +91 1800-419
                    </p>
                    <p className="text-[10px] text-gray-400">
                      24/7 Delivery Support
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 text-[#253D4E] text-xl">
                  <Link href="#" className="hover:text-[#3BB77E]">
                    <FiUser />
                  </Link>
                  <Link href="#" className="hover:text-[#3BB77E]">
                    <FiHeart />
                  </Link>
                  <Link href="/cart" className="hover:text-[#3BB77E]">
                    <FiShoppingCart />
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
