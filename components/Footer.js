"use client";
import React from "react";
import { FiMapPin, FiPhoneCall, FiMail, FiClock } from "react-icons/fi";
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
  return (
    <footer className="bg-white border-t pt-20 pb-10 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-sm text-gray-500 pb-8 border-b">
        {/* Logo & Info */}
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🌿</span>
            <div>
              <span className="text-2xl font-bold text-[#3BB77E] leading-none block">
                Quickzy
              </span>
              <span className="text-[10px] text-gray-400 block font-bold">
                Essentials in a blink.
              </span>
            </div>
          </div>
          <p className="mb-4 font-medium leading-relaxed">
            Instant delivery of electronics, groceries, health care & more.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-2 items-start">
              <FiMapPin className="text-[#3BB77E] mt-1 shrink-0" />{" "}
              <span>
                <strong>Address:</strong> 124, Phase III, Udyog Vihar, Sector
                19, Gurgaon, Haryana 122016
              </span>
            </li>
            <li className="flex gap-2 items-center">
              <FiPhoneCall className="text-[#3BB77E] shrink-0" />{" "}
              <span>
                <strong>Call Us:</strong> +91 1800-419
              </span>
            </li>
            <li className="flex gap-2 items-center">
              <FiMail className="text-[#3BB77E] shrink-0" />{" "}
              <span>
                <strong>Email:</strong> support@quickzy.com
              </span>
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
        <div>
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Company
          </h4>
          <ul className="space-y-3 cursor-pointer font-medium hover:text-[#3BB77E] transition-colors">
            <li>About Us</li>
            <li>Delivery Information</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Account
          </h4>
          <ul className="space-y-3 cursor-pointer font-medium hover:text-[#3BB77E] transition-colors">
            <li>Sign In</li>
            <li>View Cart</li>
            <li>My Wishlist</li>
            <li>Track My Order</li>
            <li>Shipping Details</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Corporate
          </h4>
          <ul className="space-y-3 cursor-pointer font-medium hover:text-[#3BB77E] transition-colors">
            <li>Become a Vendor</li>
            <li>Affiliate Program</li>
            <li>Farm Business</li>
            <li>Our Suppliers</li>
            <li>Accessibility</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Popular
          </h4>
          <ul className="space-y-3 cursor-pointer font-medium hover:text-[#3BB77E] transition-colors">
            <li>Mobile & Gadgets</li>
            <li>Health & Beauty</li>
            <li>Dairy & Bread</li>
            <li>Kitchen Essentials</li>
            <li>Snacks & Drinks</li>
          </ul>
        </div>

        {/* App & Payment */}
        <div>
          <h4 className="font-bold text-lg text-[#253D4E] mb-6 underline decoration-[#3BB77E] decoration-2 underline-offset-8">
            Install App
          </h4>
          <p className="mb-4 font-medium">From App Store or Google Play</p>
          <div className="flex gap-2 mb-6">
            <div className="w-30 h-15 rounded-lg">
              <img
                src="appstore.png"
                alt="appstore"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-30 h-15 rounded-lg ">
              <img
                src="playstore.png"
                alt="playstore"
                className="w-full h-full object-contain"
              />
            </div>
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
          © 2026, <strong className="text-[#3BB77E]">Quickzy</strong> - Instant
          Delivery. All rights reserved
        </p>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaFacebookF />
          </div>
          <div className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaTwitter />
          </div>
          <div className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaInstagram />
          </div>
          <div className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaPinterest />
          </div>
          <div className="w-10 h-10 bg-[#3BB77E] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition shadow-inner shadow-black/20">
            <FaYoutube />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
