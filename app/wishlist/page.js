"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const WishlistPage = () => {
  const router = useRouter();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [animatingHeart, setAnimatingHeart] = React.useState(null);

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FiHeart className="text-gray-300 text-5xl" />
        </div>
        <h2 className="text-3xl font-black text-[#253D4E] mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Save your favorite items here to easily find and add them to your cart later.
        </p>
        <Link 
          href="/shop" 
          className="bg-[#3BB77E] text-white px-8 py-4 rounded-xl font-black hover:bg-[#29A56C] transition-all flex items-center gap-2 shadow-lg shadow-green-100"
        >
          Go Shopping <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#253D4E] mb-2">My Wishlist</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
          {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"} saved for later
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 p-6 bg-gray-50 border-b font-black text-[#253D4E] uppercase tracking-widest text-xs">
          <div className="col-span-3 text-left pl-4">Product Details</div>
          <div className="text-center">Price</div>
          <div className="text-center">Action</div>
          <div className="text-center">Remove</div>
        </div>

        <div className="divide-y divide-gray-100">
          {wishlistItems.map((item) => (
            <div 
              key={item._id || item.id} 
              onClick={() => router.push(`/product/${item.id_custom || item._id || item.id}`)}
              className="flex flex-col md:grid md:grid-cols-6 gap-4 md:gap-6 p-4 md:p-6 items-center hover:bg-gray-50/50 transition-colors group cursor-pointer border-b md:border-b-0 last:border-0 relative"
            >
              {/* Product Info */}
              <div className="w-full md:col-span-3 flex items-center gap-4 md:gap-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  <img 
                    src={item.image || item.img || "https://res.cloudinary.com/dnafzpa8x/image/upload/v1774149230/quickzy/brand/logo_without_name.png"} 
                    alt={item.name} 
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" 
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-black text-[#253D4E] text-base md:text-lg leading-tight mb-1 group-hover:text-[#3BB77E] transition-colors line-clamp-2">{item.name}</h3>
                  <p className="text-[#3BB77E] font-bold text-xs md:text-sm tracking-tight">{item.unit}</p>
                </div>
              </div>

              {/* Price & Actions Container for Mobile */}
              <div className="w-full flex md:contents items-center justify-between gap-2">
                {/* Price */}
                <div className="text-left md:text-center shrink-0">
                  <p className="text-2xl md:text-2xl font-black text-[#3BB77E]">₹{item.price}</p>
                  {(item.oldPrice || item.discount) && (
                    <div className="flex items-center md:justify-center gap-1.5 mt-0.5 md:mt-1">
                      {item.oldPrice && (
                        <span className="text-[#adadad] text-xs md:text-[10px] font-bold relative inline-block whitespace-nowrap">
                          ₹{item.oldPrice}
                          <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] bg-[#888]"></span>
                        </span>
                      )}
                      {item.discount && (
                        <span className="bg-[#FF7F50] text-white text-[10px] md:text-[9px] px-2.5 py-0.5 rounded font-black italic uppercase min-w-max inline-block whitespace-nowrap text-center">
                          {item.discount} OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Column (Add to Cart) */}
                <div className="md:col-span-1 flex items-center justify-end flex-grow md:justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="bg-[#DEF9EC] text-[#3BB77E] px-5 py-2.5 rounded-xl font-black hover:bg-[#3BB77E] hover:text-white transition-all inline-flex items-center gap-2 group/cart text-xs md:text-sm whitespace-nowrap shadow-sm"
                  >
                    <FiShoppingCart className="shrink-0 group-hover/cart:animate-bounce" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Remove Column (Heart Button) */}
                <div className="md:col-span-1 flex items-center justify-end md:justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const id = item._id || item.id;
                      setAnimatingHeart(id);
                      toggleWishlist(item);
                      setTimeout(() => setAnimatingHeart(null), 400);
                    }}
                    className={`absolute top-4 right-4 md:relative md:top-0 md:right-0 p-3 bg-red-50 rounded-xl transition-all group/heart w-max flex items-center justify-center ${animatingHeart === (item._id || item.id) ? "animate-heart-pop" : "hover:bg-red-100"}`}
                  >
                    <FiHeart size={18} className="text-red-500 fill-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
