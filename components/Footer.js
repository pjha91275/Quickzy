"use client";
import React from "react";
import { FiMapPin, FiPhoneCall, FiMail, FiClock, FiShoppingCart, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaYoutube,
  FaApple,
  FaGooglePlay,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const comingSoon = (e) => {
    e.preventDefault();
    toast.info("This feature is coming soon!");
  };

  return (
    <footer className="bg-white border-t pt-20 pb-10 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-12 text-sm text-gray-500 pb-8 border-b">
        {/* Logo & Info */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4 group cursor-pointer">
            <img
              src="/logo.png"
              alt="Quickzy"
              className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform"
            />
            <div>
              <span className="text-2xl font-black text-[#3BB77E] leading-none block">
                Quickzy
              </span>
              <span className="text-[10px] text-gray-400 block font-bold">
                Fast. Fresh. Delivered in a Zap.
              </span>
            </div>
          </Link>
          <p className="mb-4 font-medium leading-relaxed">
            Instant delivery of electronics, groceries, health care & more.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-2 items-start">
              <FiMapPin className="text-[#3BB77E] mt-1 shrink-0" />{" "}
              <span>
                <strong>Address:</strong> Flat 402, Sea View Apartments, Worli, Mumbai, Maharashtra 400018
              </span>
            </li>
            <li className="flex gap-2 items-center">
              <FiPhoneCall className="text-[#3BB77E] shrink-0" />{" "}
              <a href="tel:+911800419123" className="hover:text-[#3BB77E]">
                <strong>Call Us:</strong> +91 1800-419-123
              </a>
            </li>
            <li className="flex gap-2 items-center">
              <FiMail className="text-[#3BB77E] shrink-0" />{" "}
              <a href="mailto:shopquickzy@gmail.com?subject=Quickzy Support Inquiry" className="hover:text-[#3BB77E] whitespace-nowrap">
                <strong>Email:</strong> shopquickzy@gmail.com
              </a>
            </li>
            <li className="flex gap-2 items-center">
              <FiClock className="text-[#3BB77E] shrink-0" />{" "}
              <span>
                <strong>Hours:</strong> 24/7 Delivery Available
              </span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div className="col-span-1">
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Company
          </h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/about" className="hover:text-[#3BB77E] transition-colors">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-[#3BB77E] transition-colors">Our Blog</Link></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Delivery Information</a></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Privacy Policy</a></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Terms & Conditions</a></li>
            <li><Link href="/contact" className="hover:text-[#3BB77E] transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Account
          </h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/profile" className="hover:text-[#3BB77E] transition-colors">My Profile</Link></li>
            <li><Link href="/cart" className="hover:text-[#3BB77E] transition-colors">View Cart</Link></li>
            <li><Link href="/wishlist" className="hover:text-[#3BB77E] transition-colors">My Wishlist</Link></li>
            <li><Link href="/orders" className="hover:text-[#3BB77E] transition-colors">Track My Order</Link></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Shipping Details</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Corporate
          </h4>
          <ul className="space-y-3 font-medium">
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Become a Vendor</a></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Affiliate Program</a></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Farm Business</a></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Our Suppliers</a></li>
            <li><a href="#" onClick={comingSoon} className="hover:text-[#3BB77E] transition-colors">Accessibility</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Popular
          </h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/shop?category=Electronics" className="hover:text-[#3BB77E] transition-colors">Mobile & Gadgets</Link></li>
            <li><Link href="/shop?category=Personal Care" className="hover:text-[#3BB77E] transition-colors">Health & Beauty</Link></li>
            <li><Link href={`/shop?category=${encodeURIComponent('Milk & Dairy')}`} className="hover:text-[#3BB77E] transition-colors">Dairy & Bread</Link></li>
            <li><Link href="/shop?category=Household Essentials" className="hover:text-[#3BB77E] transition-colors">Kitchen Essentials</Link></li>
            <li><Link href="/shop?category=Snacks" className="hover:text-[#3BB77E] transition-colors">Snacks & Drinks</Link></li>
          </ul>
        </div>

        {/* App & Payment */}
        <div className="col-span-2 md:col-span-2 lg:col-span-1">
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Install App
          </h4>
          <p className="mb-4 font-medium">From App Store or Google Play</p>
          <div className="flex gap-2 mb-6">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="w-30 h-15 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src="appstore.png"
                alt="appstore"
                className="w-full h-full object-contain"
              />
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="w-30 h-15 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
              <img
                src="playstore.png"
                alt="playstore"
                className="w-full h-full object-contain"
              />
            </a>
          </div>
          <p className="mb-4">Secured Payment Gateways</p>
          <div className="flex gap-2 text-3xl text-gray-600">
            <img
              src="visa.png"
              alt="visa, mastercard, amex, discover"
              className="hover:text-blue-900 transition"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-bold font-sans">
        <p className="text-gray-400">
          © 2026, <Link href="/"><strong className="text-[#3BB77E] hover:underline">Quickzy</strong></Link> - Instant
          Delivery. All rights reserved
        </p>
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaInstagram />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaPinterest />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaYoutube />
          </a>
        </div>
      </div>

      {/* bottom signature */}
      <div className="mt-12 py-12 border-t border-gray-100 text-center group">
        <p className="text-[13px] md:text-sm font-black text-[#253D4E] tracking-tight flex items-center justify-center gap-2 cursor-default">
          Built to Deliver in a Zap 
          <span className="inline-flex items-center -mt-1 group-hover:animate-pulse">
            <FiShoppingCart size={20} className="text-[#3BB77E] stroke-[2.5]" />
            <FiZap size={18} className="text-amber-400 -ml-2 stroke-[2.5]" fill="currentColor" />
          </span> 
          by 
          <span className="text-[#3BB77E] text-[16px] md:text-lg lg:text-xl ml-1 transition-transform group-hover:scale-110 duration-500">
            Prince Jha
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
