"use client";
import React, { useState } from "react";
import { FiTrash2, FiShoppingCart, FiHeart } from "react-icons/fi";
import Link from "next/link";
// import { useWishlist } from "@/context/WishlistContext"; // TODO: You will create this later
// import { useCart } from "@/context/CartContext";

export default function Wishlist() {
  // --- INSTRUCTION FOR BACKEND IMPLEMENTATION ---
  // When you implement backend, you will remove this dummy state and use your context.
  // const { wishlistItems, removeFromWishlist } = useWishlist();
  // const { addToCart } = useCart();
  
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      name: "Fresh Organic Apple",
      price: 120,
      image: "https://i.ibb.co/8Yk26D4/apple.png",
      inStock: true,
    },
    {
      id: "2",
      name: "Farm Fresh Eggs",
      price: 80,
      image: "https://i.ibb.co/3mNksH5/eggs.png",
      inStock: false,
    }
  ]);

  const handleRemove = (id) => {
    // Dummy temp function
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    // REAL FUNCTION LATER: removeFromWishlist(id);
  };

  const handleAddToCart = (item) => {
    // Dummy temp function
    alert("Added to cart: " + item.name);
    // REAL FUNCTION LATER: addToCart(item);
  };

  return (
    <main className="container mx-auto px-4 py-10 min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-[#253D4E] flex items-center gap-3">
          Your Wishlist
        </h1>
        <p className="text-gray-400 font-bold">
          <span className="text-[#3BB77E]">{wishlistItems.length}</span> items
        </p>
      </div>

      <div className="overflow-x-auto">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-2xl">
            <FiHeart className="mx-auto text-gray-200 mb-4" size={64} />
            <h3 className="text-xl font-black text-gray-400">Wishlist empty!</h3>
            <Link href="/" className="text-[#3BB77E] font-bold mt-2 hover:underline inline-block">
              Add some products
            </Link>
          </div>
        ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-[#ececec] text-[#253D4E] font-bold text-sm">
              <tr>
                <th className="py-4 px-6 rounded-l-xl">Product</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wishlistItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-6 px-6">
                    <div className="flex flex-row items-center gap-6">
                      <div className="w-24 h-24 border rounded-xl bg-white p-2">
                        <img
                          src={item.image || item.img}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h4 className="font-black text-[#253D4E] text-lg hover:text-[#3BB77E] cursor-pointer">
                        {item.name}
                      </h4>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <span className="text-2xl font-black text-[#253D4E]">
                      ₹{item.price}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    {item.inStock ? (
                      <span className="text-[#3BB77E] font-bold bg-[#DEF9EC] px-3 py-1 rounded-md">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-md">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className={`font-black px-6 py-2 rounded-md flex items-center gap-2 ${
                          item.inStock 
                            ? "bg-[#3BB77E] text-white hover:bg-[#29a56c]" 
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FiShoppingCart /> Add
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 text-2xl ml-2"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
