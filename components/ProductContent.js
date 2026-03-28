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
  FiShield,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";

export default function ProductContent({ product: productFromDb, similarProducts }) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { storeData } = useStore();
  const [selectedPack, setSelectedPack] = React.useState("single");
  const [animatingHeart, setAnimatingHeart] = React.useState(null);

  // Sync with global store to get ephemeral discounts
  const product = React.useMemo(() => {
    if (!storeData.fullPool?.length) return productFromDb;
    const synced = storeData.fullPool.find(p => (p.id_custom || p._id || p.id)?.toString() === (productFromDb.id_custom || productFromDb._id || productFromDb.id)?.toString());
    return synced || productFromDb;
  }, [storeData.fullPool, productFromDb]);

  const syncedSimilarProducts = React.useMemo(() => {
    if (!storeData.fullPool?.length) return similarProducts;
    return similarProducts.map(sp => {
      const synced = storeData.fullPool.find(p => (p.id_custom || p._id || p.id)?.toString() === (sp.id_custom || sp._id || sp.id)?.toString());
      return synced || sp;
    });
  }, [storeData.fullPool, similarProducts]);

  if (!product) return null;

  // Calculate pricing using additive logic (Cart Rule)
  const mrp = parseFloat(product.oldPrice) || parseFloat(product.price);
  const currentPrice = parseFloat(product.price);
  const originalDiscountPercent = product.discount ? parseFloat(String(product.discount).replace("%", "")) : (mrp > currentPrice ? ((mrp - currentPrice) / mrp * 100) : 0);
  
  const singlePrice = currentPrice;
  const singleOldPrice = mrp > currentPrice ? mrp : null;
  
  // Rule: 10% extra discount applied on MRP
  const comboDiscountPercent = originalDiscountPercent + 10;
  const comboPrice = Math.floor((mrp * 2) * (1 - comboDiscountPercent / 100));
  
  const isDouble = selectedPack === "double";
  const displayPrice = isDouble ? comboPrice : singlePrice;
  const displayOldPrice = isDouble ? (mrp * 2) : singleOldPrice;
  const displayDiscount = isDouble 
    ? `SAVE ${Math.round(comboDiscountPercent)}%` 
    : (product.discount ? `SAVE ${product.discount}` : null);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center text-[11px] font-bold text-gray-400 gap-1.5 mb-8">
          <Link href="/" className="hover:text-[#3BB77E]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-[#3BB77E]">{product.category}</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Gallery */}
          <div className="bg-white border-2 border-slate-50 rounded-3xl p-8 flex items-center justify-center overflow-hidden h-[450px] lg:h-[500px]">
             <img
               src={product.image || product.img}
               alt={product.name}
               className="max-h-full object-contain hover:scale-110 transition-transform duration-500"
             />
          </div>

          {/* Details */}
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
              <div className="flex items-center gap-2">
                 <div className="bg-[#DEF9EC] text-[#3BB77E] px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                   10 MINS
                 </div>
                 <span className="text-gray-300">|</span>
                 <p className="text-xs font-bold text-gray-400">Freshly Handpicked</p>
              </div>
            </div>

            <div className="space-y-6">
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Select Pack Size</p>
               <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedPack("single")}
                    className={`flex-1 border-2 p-3 rounded-2xl font-black flex flex-col items-center justify-center transition-all relative h-20 ${selectedPack === "single" ? 'border-[#3BB77E] bg-[#DEF9EC] text-slate-800' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                  >
                     {product.discount && (
                       <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF7F50] text-white text-[9px] px-2.5 py-1 rounded-lg font-black italic shadow-sm whitespace-nowrap uppercase">
                         SAVE {product.discount} OFF
                       </span>
                     )}
                     <span className="truncate text-sm opacity-70 mb-0.5">{product.unit} (Single)</span>
                     <div className="flex items-center gap-2">
                        <span className={`text-lg ${selectedPack === "single" ? 'text-[#3BB77E]' : 'text-slate-600'}`}>₹{singlePrice}</span>
                        {singleOldPrice && (
                          <span className="text-xs text-slate-400 line-through font-bold opacity-60">₹{singleOldPrice}</span>
                        )}
                     </div>
                  </button>
                  <button 
                    onClick={() => setSelectedPack("double")}
                    className={`flex-1 border-2 p-3 rounded-2xl font-black flex flex-col items-center justify-center transition-all relative h-20 ${selectedPack === "double" ? 'border-[#3BB77E] bg-[#DEF9EC] text-slate-800' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                  >
                     <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10.5px] px-3 py-1.5 rounded-lg font-black italic shadow-sm whitespace-nowrap uppercase tracking-tighter">
                       COMBO SAVING {parseInt(product.discount || 0) + 10}% OFF
                     </span>
                     <span className="truncate text-sm opacity-70 mb-0.5">2 x {product.unit} (Double)</span>
                     <div className="flex items-center gap-2">
                        <span className={`text-lg ${selectedPack === "double" ? 'text-[#3BB77E]' : 'text-slate-600'}`}>₹{comboPrice}</span>
                        <span className="text-xs text-slate-400 line-through font-bold opacity-60">₹{product.oldPrice ? product.oldPrice * 2 : product.price * 2}</span>
                     </div>
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-1 p-4 bg-slate-50 rounded-[30px] border border-slate-100/50">
                <div className="flex items-end gap-4">
                  <span className="text-4xl font-black text-slate-800 tracking-tight transform translate-y-1.5">₹{displayPrice}</span>
                  {displayOldPrice && displayOldPrice > displayPrice && (
                    <>
                      <div className="flex flex-col items-start pt-1">
                        <span className={`text-[11px] font-black text-white px-2.5 py-1 rounded-lg uppercase italic mb-1.5 shadow-md ${isDouble ? 'bg-[#7C3AED]' : 'bg-[#FF7F50]'}`}>
                           {isDouble ? `COMBO SAVING ${parseInt(product.discount || 0) + 10}% OFF` : `${displayDiscount} OFF`}
                        </span>
                        <span className="text-lg text-[#adadad] font-bold relative inline-block px-1">
                          ₹{displayOldPrice}
                          <span className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#888]"></span>
                        </span>
                      </div>
                    </>
                  )}
                </div>
               <p className="text-[11px] text-slate-400 font-bold tracking-wide italic">Price inclusive of all taxes</p>
            </div>

            <div className="w-full">
              {(() => {
                const itemInCart = cartItems.find((i) => (i._id || i.id) === (product._id || product.id));
                return itemInCart ? (
                  <div className="w-full md:w-fit md:min-w-[220px] bg-[#3BB77E] text-white py-4 px-8 rounded-2xl flex items-center justify-between shadow-xl shadow-green-100 gap-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(product._id || product.id, -1);
                      }}
                      className="hover:scale-110 transition-transform p-1"
                    >
                      <FiMinus size={22} strokeWidth={3} />
                    </button>
                    <span className="font-black text-2xl">{itemInCart.quantity}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(product._id || product.id, 1);
                      }}
                      className="hover:scale-110 transition-transform p-1"
                    >
                      <FiPlus size={22} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart({ ...product, price: displayPrice, pack: selectedPack })}
                    className="w-full md:w-fit md:min-w-[220px] bg-[#3BB77E] text-white py-4 px-10 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-[#29A56C] transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    Add to Cart
                  </button>
                );
              })()}
            </div>

          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 pt-16 border-t border-slate-100 mt-10">
            {/* Description */}
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

            {/* Features */}
            <div className="space-y-8">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">Benefits of Shopping from Quickzy</h4>
                <div className="flex flex-col gap-5 md:gap-6 mt-4">
                  <div className="flex gap-4 md:gap-6 items-start md:items-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#DEF9EC] flex items-center justify-center shrink-0 shadow-sm border border-[#3BB77E]/20 text-[#3BB77E] group-hover:bg-[#3BB77E] group-hover:text-white transition-all duration-300">
                      <FiZap className="text-xl md:text-2xl" />
                    </div>
                    <div className="flex-1 pt-1 md:pt-0">
                      <h6 className="text-[13px] md:text-[14px] font-black text-[#253D4E] tracking-tight leading-tight mb-1 md:mb-0">Rapid 15-Min Delivery</h6>
                      <p className="text-[11px] font-bold text-gray-400 leading-snug">Your orders delivered within 15 minutes or less.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 md:gap-6 items-start md:items-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 shadow-sm border border-amber-200/50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                      <FiShield className="text-xl md:text-2xl" />
                    </div>
                    <div className="flex-1 pt-1 md:pt-0">
                      <h6 className="text-[13px] md:text-[14px] font-black text-[#253D4E] tracking-tight leading-tight mb-1 md:mb-0">Grade-A Quality Assurance</h6>
                      <p className="text-[11px] font-bold text-gray-400 leading-snug">Strict quality checks for every single item.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 md:gap-6 items-start md:items-center group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm border border-blue-200/50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                      <FiLayers className="text-xl md:text-2xl" />
                    </div>
                    <div className="flex-1 pt-1 md:pt-0">
                      <h6 className="text-[13px] md:text-[14px] font-black text-[#253D4E] tracking-tight leading-tight mb-1 md:mb-0">Massive Product Range</h6>
                      <p className="text-[11px] font-bold text-gray-400 leading-snug">Find everything from farm fresh to electronics.</p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {syncedSimilarProducts.map((prod) => (
              <div 
                key={prod._id || prod.id}
                onClick={() => window.location.href = `/product/${prod.id_custom || prod.id}`}
                className="bg-white border hover:shadow-xl transition-all relative group flex flex-col cursor-pointer rounded-2xl p-3 md:p-4 hover:border-green-300"
              >
                {/* Hot Deal Tag */}
                {prod.discount && (
                  <span className="absolute top-0 left-0 bg-pink-500 text-white text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1.5 rounded-br-2xl rounded-tl-2xl z-10 italic uppercase leading-none">
                    Hot Deal
                  </span>
                )}
                
                {/* Wishlist Heart */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = prod._id || prod.id;
                    setAnimatingHeart(id);
                    toggleWishlist(prod);
                    setTimeout(() => setAnimatingHeart(null), 400);
                  }}
                  className={`absolute top-4 right-4 md:top-5 md:right-5 z-20 p-2 rounded-full transition-all ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop text-red-500" : "text-gray-300 hover:scale-110"}`}
                >
                  <FiHeart className={`text-lg md:text-xl ${isInWishlist(prod._id || prod.id) ? "text-red-500 fill-red-500" : ""}`} />
                </button>

                {/* Image */}
                <div className="flex items-center justify-center overflow-hidden mb-1 group-hover:scale-105 transition-transform h-32 md:h-40">
                  <img src={prod.image || prod.img} alt={prod.name} className="w-full h-full object-contain" />
                </div>

                {/* Info */}
                <div className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black mb-1">{prod.category}</div>
                <h3 className="font-bold text-[#253D4E] leading-tight hover:text-[#3BB77E] transition-colors line-clamp-2 mb-1 text-[13px] md:text-sm h-10 grow">
                  {prod.name}
                </h3>

                {/* Unit */}
                <div className="flex mb-2">
                  <span className="text-[9px] md:text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 md:px-3 py-1 rounded-md uppercase">{prod.unit || "Unit"}</span>
                </div>

                {/* Pricing & Cart Action */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                  <div>
                    <span className="text-lg font-black text-[#3BB77E]">₹{prod.price}</span>
                    {prod.oldPrice && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#adadad] text-[10px] font-bold relative">
                          ₹{prod.oldPrice}
                          <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] bg-[#888]"></span>
                        </span>
                        <span className="bg-[#FF7F50] text-white text-[8px] px-1.5 py-0.5 rounded font-black italic uppercase">
                          {prod.discount} OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add / Qty Controls */}
                  {(() => {
                    const itemInCart = cartItems.find((i) => (i._id || i.id) === (prod._id || prod.id));
                    return itemInCart ? (
                      <div className="flex items-center justify-between bg-[#3BB77E] text-white rounded-xl px-2 py-1 md:px-3 md:py-2 shadow-sm relative z-20 w-[75px] md:w-[90px]">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(prod._id || prod.id, -1);
                          }}
                          className="hover:scale-110 transition-transform flex items-center justify-center p-0.5"
                        >
                          <FiMinus size={14} strokeWidth={3} />
                        </button>
                        <span className="font-black text-xs md:text-sm px-1">{itemInCart.quantity}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(prod._id || prod.id, 1);
                          }}
                          className="hover:scale-110 transition-transform flex items-center justify-center p-0.5"
                        >
                          <FiPlus size={14} strokeWidth={3} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(prod);
                        }}
                        className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white p-2.5 md:px-4 md:py-2.5 rounded-xl transition-all shadow-sm md:font-black md:text-xs flex items-center justify-center gap-2 shrink-0 relative z-20 w-[75px] md:w-[90px]"
                      >
                        <span className="hidden md:inline">Add</span>
                        <FiShoppingCart size={18} className="md:w-4 md:h-4 w-[18px] h-[18px]" />
                      </button>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
