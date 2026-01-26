"use client";
import React from "react";
import Link from "next/link";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiRefreshCw,
  FiGrid,
  FiHeadphones,
} from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineLocationMarker } from "react-icons/hi";

const Navbar = () => {
  return (
    <header className="w-full bg-white border-b relative font-sans">
      {/* Main Header */}
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-4xl font-bold text-green-600 flex items-center">
            <span className="text-3xl">🌿</span>Quickzy
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto border border-green-500 border-2 rounded-md flex items-center h-12 relative">
          <div className="px-4 border-r hidden md:block text-sm font-semibold text-gray-700">
            All Categories <IoIosArrowDown className="inline ml-1" />
          </div>
          <input
            type="text"
            placeholder="Search for items..."
            className="flex-1 px-4 outline-none text-sm text-gray-600 h-full w-full"
          />
          <div className="flex gap-8 bg-green-400 px-2 py-3">
            <div>Search</div>
            <div>
              <FiSearch className="text-gray-600 absolute right-4 text-xl" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-6 items-center text-gray-500 text-sm">
          <div className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="relative">
              <FiRefreshCw className="text-2xl" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                3
              </span>
            </div>
            <span className="hidden lg:block">Compare</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="relative">
              <FiHeart className="text-2xl" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                6
              </span>
            </div>
            <span className="hidden lg:block">Wishlist</span>
          </div>
          <Link
            href="/cart"
            className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-transform"
          >
            <div className="relative">
              <FiShoppingCart className="text-2xl" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                2
              </span>
            </div>
            <span className="hidden lg:block">Cart</span>
          </Link>
          <div className="flex items-center gap-1 cursor-pointer hover:-translate-y-1 transition-transform">
            <FiUser className="text-2xl" />
            <span className="hidden lg:block">Account</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="border-t hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center h-12">
          <div className="bg-green-600 text-white px-6 h-full flex items-center gap-2 font-bold cursor-pointer hover:bg-green-700 transition-colors">
            <FiGrid /> Browse All Categories <IoIosArrowDown />
          </div>

          <nav className="flex gap-8 font-semibold text-gray-700 text-sm">
            <Link href="/" className="flex items-center gap-1 text-green-600">
              Home <IoIosArrowDown />
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-1 hover:text-green-600"
            >
              About
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-1 hover:text-green-600"
            >
              Shop <IoIosArrowDown />
            </Link>
            <Link
              href="/vendors"
              className="flex items-center gap-1 hover:text-green-600"
            >
              Vendors <IoIosArrowDown />
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-1 hover:text-green-600"
            >
              Blog <IoIosArrowDown />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1 hover:text-green-600"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <FiHeadphones className="text-3xl text-gray-800" />
            <div>
              <div className="text-green-600 text-xl font-bold">
                +91 1800-QUICKZY
              </div>
              <div className="text-xs text-gray-400">24/7 Delivery Support</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
