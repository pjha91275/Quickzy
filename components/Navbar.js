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
import { useSession, signOut } from "next-auth/react";

import AuthModal from "./AuthModal";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isLoggedIn = !!session;
  const userInitials = session?.user?.name
    ? session.user.name.charAt(0)
    : session?.user?.email?.charAt(0) || "U";

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => setIsAuthModalOpen(false)}
      />
      <header className="w-full bg-white border-b relative font-sans z-50">
        <div className="container mx-auto p-4 flex justify-between items-center gap-4 lg:gap-8">
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
                  <div className="w-8 h-8 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] font-extrabold text-xs uppercase overflow-hidden border border-[#3BB77E]/20">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-black text-[#253D4E] group-hover:text-[#3BB77E] truncate max-w-[100px]">
                    {session.user.name || "My Account"}{" "}
                    <IoIosArrowDown className="inline text-[10px]" />
                  </span>
                </div>
              )}

              <div className="hidden absolute top-full right-0 w-52 pt-4 z-50 group-hover/account:block animate-in fade-in slide-in-from-top-1">
                <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 flex flex-col gap-3">
                  {isLoggedIn ? (
                    <>
                      <div className="pb-3 border-b mb-1">
                        <p className="text-[10px] text-[#3BB77E] font-black uppercase tracking-widest mb-1">
                          Welcome
                        </p>
                        <p className="text-sm font-black text-[#253D4E] truncate">
                          {session.user.name || session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="text-sm font-bold text-gray-600 hover:text-[#3BB77E] flex items-center gap-2 transition-colors"
                      >
                        <FiUser className="text-lg" /> Profile Settings
                      </Link>
                      <Link
                        href="/orders"
                        className="text-sm font-bold text-gray-600 hover:text-[#3BB77E] flex items-center gap-2 transition-colors"
                      >
                        <FiHeart className="text-lg" /> Order History
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-2 pt-2 border-t mt-1 transition-colors text-left"
                      >
                        <FiX className="text-lg" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-xs font-bold text-[#3BB77E] hover:underline"
                    >
                      Sign In / Join Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              className="lg:hidden p-2 text-2xl text-[#253D4E]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Bottom Nav Section */}
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

        {/* Mobile Logic */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 pb-4 border-b">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
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
                className="hover:text-[#3BB77E] py-2 border-b border-gray-50 transition-colors"
              >
                Shop
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
                    <FiHeadphones />
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
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
