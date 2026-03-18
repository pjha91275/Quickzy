"use client";
import React from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiHeart,
  FiZap,
  FiTag,
  FiLayers,
  FiShield
} from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function ProductContent({ product, similarProducts }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedPack, setSelectedPack] = React.useState("single");
  const [animatingHeart, setAnimatingHeart] = React.useState(null);

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
          <div className="bg-white border-2 border-slate-50 rounded-3xl p-8 flex items-center justify-center overflow-hidden h-[450px] lg:h-[500px]">
             <img
               src={product.image || product.img}
               alt={product.name}
               className="max-h-full object-contain hover:scale-110 transition-transform duration-500"
             />
          </div>

          {/* Right Side: Quick Buy Info */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-black text-[#253D4E] leading-tight pr-4">
                  {product.name}
                </h1>
                <button 
                  onClick={() => {
                    setAnimatingHeart('main');
                    toggleWishlist(product);
                    setTimeout(() => setAnimatingHeart(null), 400);
                  }}
                  className={`bg-gray-50 p-3 rounded-2xl hover:scale-110 transition-transform shadow-sm border border-gray-100 ${animatingHeart === 'main' ? "animate-heart-pop" : ""}`}
                >
                  <FiHeart className={`text-2xl ${isInWishlist(product._id || product.id) ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                </button>
              </div>
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
                 {displayOldPrice && displayOldPrice > displayPrice && (
                   <>
                     <span className="text-lg text-[#adadad] font-bold whitespace-nowrap relative">
                       ₹{displayOldPrice}
                       <span className="absolute top-1/2 left-[-4px] w-[calc(100%+8px)] h-[2px] bg-[#888]"></span>
                     </span>
                     <span className="text-[11px] bg-[#FF7F50] text-white px-2.5 py-1 rounded-lg font-black italic shadow-lg shadow-orange-100 uppercase">{displayDiscountBadge} OFF</span>
                   </>
                 )}
               </div>
               <p className="text-[11px] text-slate-400 font-bold tracking-wide italic">Price inclusive of all taxes</p>
            </div>

            <div className="w-full">
              <button 
                onClick={() => addToCart({ ...product, price: displayPrice, pack: selectedPack })}
                className="w-full md:w-auto md:min-w-[200px] bg-[#3BB77E] text-white py-4 px-10 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-[#29A56C] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>

        {/* Details & Benefits Sync Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 pt-16 border-t border-slate-100 mt-10">
            {/* Product Details */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-[#253D4E] tracking-tight">Product Details</h3>
               <div className="space-y-4 text-sm font-medium text-gray-500 leading-relaxed">
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Description</span>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 pb-2">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Vendor</span>
                    <p className="text-[#3BB77E] font-bold">{product.vendor}</p>
                  </div>
               </div>
            </div>

            {/* Why Shop List */}
            <div className="space-y-8">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">Benefits of Shopping from Quickzy</h4>
                         <div className="space-y-6">
                  <div className="flex gap-6 items-center group">
                    <div className="w-14 h-14 rounded-2xl bg-[#DEF9EC] flex items-center justify-center shrink-0 shadow-sm border border-[#3BB77E]/20 text-[#3BB77E] group-hover:bg-[#3BB77E] group-hover:text-white transition-all duration-300">
                      <FiZap size={24} />
                    </div>
                    <div>
                      <h6 className="text-[14px] font-black text-[#253D4E] tracking-tight">Rapid 15-Min Delivery</h6>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5">Your orders delivered within 15 minutes or less.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-center group">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 shadow-sm border border-amber-200/50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                      <FiShield size={22} />
                    </div>
                    <div>
                      <h6 className="text-[14px] font-black text-[#253D4E] tracking-tight">Grade-A Quality Assurance</h6>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5">Strict quality checks for every single item.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-center group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm border border-blue-200/50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <FiLayers size={22} />
                    </div>
                    <div>
                      <h6 className="text-[14px] font-black text-[#253D4E] tracking-tight">Massive Product Range</h6>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5">Find everything from farm fresh to electronics.</p>
                    </div>
                  </div>
                </div>
            </div>
        </div>



        {/* Similar Products */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-xl font-black text-[#253D4E] mb-10 flex items-center gap-2">
            Customers also bought <span className="w-10 h-1 bg-[#3BB77E]/20 rounded-full"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {similarProducts.map((prod) => (
              <Link
                key={prod._id || prod.id}
                href={`/product/${prod.id_custom || prod.id}`}
                className="bg-white border-2 border-gray-50 hover:border-green-100 hover:shadow-2xl transition-all rounded-3xl p-4 group flex flex-col relative"
              >
                <div className="h-32 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                  <img
                    src={prod.image || prod.img}
                    alt={prod.name}
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex justify-between items-start mb-2 h-10 overflow-hidden">
                  <h4 className="font-bold text-[#253D4E] text-[13px] group-hover:text-[#3BB77E] line-clamp-2 leading-tight pr-2">
                    {prod.name}
                  </h4>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const id = prod._id || prod.id;
                      setAnimatingHeart(id);
                      toggleWishlist(prod);
                      setTimeout(() => setAnimatingHeart(null), 400);
                    }}
                    className={`text-lg hover:scale-110 transition-transform shrink-0 relative z-20 ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop" : ""}`}
                  >
                    <FiHeart size={16} className={isInWishlist(prod._id || prod.id) ? "text-red-500 fill-red-500" : "text-gray-300"} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-auto pt-2">
                  <span className="text-[#3BB77E] font-black text-sm">
                    ₹{prod.price}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(prod);
                    }}
                    className="bg-[#DEF9EC] text-[#3BB77E] p-2 rounded-xl hover:bg-[#3BB77E] hover:text-white transition-colors relative z-20"
                  >
                    <FiShoppingCart size={14} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
