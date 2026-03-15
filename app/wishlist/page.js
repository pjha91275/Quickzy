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
              className="grid grid-cols-1 md:grid-cols-6 gap-6 p-6 items-center hover:bg-gray-50/50 transition-colors group cursor-pointer"
            >
              {/* Product Info */}
              <div className="col-span-1 md:col-span-3 flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  <img 
                    src={item.image || item.img} 
                    alt={item.name} 
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" 
                  />
                </div>
                <div>
                  <h3 className="font-black text-[#253D4E] text-lg leading-tight mb-1 group-hover:text-[#3BB77E] transition-colors">{item.name}</h3>
                  <p className="text-[#3BB77E] font-bold text-sm tracking-tight">{item.unit}</p>
                </div>
              </div>

              {/* Price */}
              <div className="text-center">
                <p className="text-2xl font-black text-[#3BB77E]">₹{item.price}</p>
              </div>

              {/* Add to Cart */}
              <div className="text-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  className="bg-[#DEF9EC] text-[#3BB77E] px-6 py-3 rounded-xl font-black hover:bg-[#3BB77E] hover:text-white transition-all inline-flex items-center gap-2 group/cart"
                >
                  <FiShoppingCart className="group-hover/cart:animate-bounce" />
                  Add to Cart
                </button>
              </div>

              {/* Remove */}
              <div className="text-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const id = item._id || item.id;
                    setAnimatingHeart(id);
                    toggleWishlist(item);
                    setTimeout(() => setAnimatingHeart(null), 400);
                  }}
                  className={`p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all ${animatingHeart === (item._id || item.id) ? "animate-heart-pop" : ""}`}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
