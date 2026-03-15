"use client";
import React from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiShoppingCart,
} from "react-icons/fi";
import { 
  HiMiniTruck, 
  HiMiniReceiptPercent, 
  HiMiniShieldCheck 
} from "react-icons/hi2";

export default function ProductContent({ product, similarProducts }) {
  const [selectedPack, setSelectedPack] = React.useState("single");

  if (!product) return null;

  // Calculate pricing
  const isDouble = selectedPack === "double";
  const displayPrice = isDouble ? Math.round(product.price * 2 * 0.9) : product.price;
  const displayOldPrice = isDouble ? product.oldPrice * 2 : product.oldPrice;
  const doubleDiscount = Math.round(((displayOldPrice - displayPrice) / displayOldPrice) * 100);
  const displayDiscountBadge = isDouble ? `${doubleDiscount}%` : product.discount;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumb - Clean & Small */}
        <nav className="flex items-center text-[11px] font-bold text-gray-400 gap-1.5 mb-8">
          <Link href="/" className="hover:text-[#3BB77E]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-[#3BB77E]">{product.category}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left Side: Image Gallery */}
          <div className="space-y-8">
            <div className="bg-white border-2 border-slate-50 rounded-3xl p-8 flex items-center justify-center overflow-hidden h-[450px] lg:h-[500px]">
              <img
                src={product.image || product.img}
                alt={product.name}
                className="max-h-full object-contain hover:scale-110 transition-transform duration-500"
              />
            </div>
            


            {/* Product Details Section (Folded below image on desktop, or keep for later) */}
            <div className="hidden md:block pt-10 border-t">
               <h3 className="text-lg font-black text-[#253D4E] mb-4">Product Details</h3>
               <div className="space-y-4 text-sm font-medium text-gray-600 leading-relaxed">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">Description</span>
                    <p>{product.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 border-t pt-3">
                    <span className="text-gray-400 text-xs">Vendor</span>
                    <p className="text-[#3BB77E] font-bold">{product.vendor}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Side: Quick Buy Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black text-[#253D4E] leading-tight">
                {product.name}
              </h1>
              {/* Dummy Time/Speed Info */}
              <div className="flex items-center gap-2">
                 <div className="bg-[#DEF9EC] text-[#3BB77E] px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                   10 MINS
                 </div>
                 <span className="text-gray-300">|</span>
                 <p className="text-xs font-bold text-gray-400">Freshly Handpicked</p>
              </div>
            </div>

            <div className="space-y-5">
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Select Pack Size</p>
               <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setSelectedPack("single")}
                    className={`flex-1 border-2 px-5 py-3.5 rounded-2xl text-sm font-black flex flex-col items-start transition-all ${selectedPack === "single" ? 'border-[#3BB77E] bg-[#DEF9EC] text-slate-800' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                  >
                     <span>{product.unit} (Single)</span>
                     <span className={`text-[11px] ${selectedPack === "single" ? 'text-[#3BB77E]' : 'opacity-60'}`}>₹{product.price}</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPack("double")}
                    className={`flex-1 border-2 px-5 py-3.5 rounded-2xl text-sm font-black flex flex-col items-start transition-all relative ${selectedPack === "double" ? 'border-[#3BB77E] bg-[#DEF9EC] text-slate-800' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                  >
                     <span className="absolute -top-3 right-4 bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">COMBO SAVINGS</span>
                     <span>{parseInt(product.unit) * 2} {product.unit.replace(/[0-9]/g, '').trim()} (Double)</span>
                     <span className={`text-[11px] ${selectedPack === "double" ? 'text-[#3BB77E]' : 'opacity-60'}`}>₹{displayPrice}</span>
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-1.5 p-6 bg-slate-50 rounded-[32px] border border-slate-100/50">
               <div className="flex items-baseline gap-3">
                 <span className="text-4xl font-black text-slate-800 tracking-tight">₹{displayPrice}</span>
                 <span className="text-lg text-slate-300 line-through font-bold whitespace-nowrap">₹{displayOldPrice}</span>
                 <span className="text-[11px] bg-pink-500 text-white px-2.5 py-1 rounded-lg font-black italic shadow-lg shadow-pink-100 uppercase">{displayDiscountBadge} OFF</span>
               </div>
               <p className="text-[11px] text-slate-400 font-bold tracking-wide italic">Price inclusive of all taxes</p>
            </div>

            <div className="w-full">
              <button className="w-full md:w-auto md:min-w-[200px] bg-[#3BB77E] text-white py-4 px-10 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-[#29A56C] transition-all flex items-center justify-center gap-3 active:scale-95">
                Add to Cart
              </button>
            </div>

            {/* Why Shop List */}
            <div className="pt-10 space-y-6">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">Benefits of Shopping from Quickzy</h4>
              
              <div className="space-y-5">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <HiMiniTruck className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h6 className="text-xs font-black text-slate-800">Superfast Delivery</h6>
                    <p className="text-[11px] font-bold text-gray-400">Get your order in under 15 minutes.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <HiMiniReceiptPercent className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h6 className="text-xs font-black text-slate-800">Best Prices & Offers</h6>
                    <p className="text-[11px] font-bold text-gray-400">Find the lowest prices with high discounts.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <HiMiniShieldCheck className="text-[#3BB77E]" size={24} />
                  </div>
                  <div>
                    <h6 className="text-xs font-black text-slate-800">Wide Assortment</h6>
                    <p className="text-[11px] font-bold text-gray-400">Choose from thousands of fresh products.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Product Details */}
        <div className="md:hidden mt-12 pt-10 border-t">
          <h3 className="text-lg font-black text-[#253D4E] mb-4">Product Details</h3>
          <p className="text-sm font-medium text-gray-600 leading-relaxed italic">{product.description}</p>
        </div>

        {/* Similar Products */}
        <div className="mt-24 border-t pt-16">
          <h2 className="text-xl font-black text-[#253D4E] mb-10 flex items-center gap-2">
            Customers also bought <span className="w-10 h-1 bg-[#3BB77E]/20 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {similarProducts.map((prod) => (
              <div
                key={prod._id || prod.id}
                className="bg-white border-2 border-gray-50 hover:border-green-100 hover:shadow-2xl transition-all rounded-3xl p-4 group flex flex-col relative"
              >
                <Link
                  href={`/product/${prod.id_custom || prod.id}`}
                  className="flex flex-col flex-grow text-inherit no-underline"
                >
                  <div className="h-32 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src={prod.image || prod.img}
                      alt={prod.name}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <h4 className="font-bold text-[#253D4E] text-[13px] group-hover:text-[#3BB77E] line-clamp-2 h-10 mb-2 leading-tight">
                    {prod.name}
                  </h4>
                </Link>
                <div className="flex justify-between items-center mt-auto pt-2">
                  <Link
                    href={`/product/${prod.id_custom || prod.id}`}
                    className="text-[#3BB77E] font-black no-underline text-sm"
                  >
                    ₹{prod.price}
                  </Link>
                  <button className="bg-[#DEF9EC] text-[#3BB77E] p-2 rounded-xl hover:bg-[#3BB77E] hover:text-white transition-colors">
                    <FiShoppingCart size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
