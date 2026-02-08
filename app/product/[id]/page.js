"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiShield,
  FiTruck,
  FiRotateCcw,
} from "react-icons/fi";
import { allProducts } from "@/app/shop/page";

export default function ProductDetail() {
  const { id } = useParams();

  // Find the product by ID
  const product =
    allProducts.find((p) => p.id === parseInt(id)) || allProducts[0];

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Breadcrumb Area */}
      <div className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm font-bold text-gray-500 gap-2">
            <Link href="/" className="hover:text-[#3BB77E]">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#3BB77E]">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-400 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3BB77E] font-bold text-sm mb-8 transition-colors"
        >
          <FiArrowLeft /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Image */}
          <div className="bg-white border rounded-3xl p-8 flex items-center justify-center overflow-hidden aspect-square shadow-sm">
            <img
              src={product.img}
              alt={product.name}
              className="max-h-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            <div>
              <span className="text-[12px] font-black text-[#3BB77E] bg-[#DEF9EC] px-3 py-1 rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#253D4E] mt-4 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-400 font-bold text-sm">
                By{" "}
                <span className="text-[#3BB77E] underline cursor-pointer">
                  {product.vendor}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-[#3BB77E]">
                ₹{product.price}
              </span>
              <div className="flex flex-col">
                <span className="text-lg text-gray-300 line-through font-bold">
                  ₹{product.oldPrice}
                </span>
                <span className="text-xs text-pink-500 font-black">
                  {product.discount} OFF
                </span>
              </div>
            </div>

            {/* Quantity Selector Style (Dummy for UI) */}
            <div className="flex items-center gap-4 py-4 border-y border-gray-100">
              <span className="text-gray-400 font-black text-sm uppercase">
                Quantity:
              </span>
              <span className="text-[#253D4E] font-black text-lg bg-gray-50 px-4 py-2 rounded-xl border">
                {product.unit}
              </span>
            </div>

            <p className="text-gray-500 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 bg-[#3BB77E] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-[#29A56C] transition-all flex items-center justify-center gap-3 active:scale-95">
                <FiShoppingCart size={24} /> Add to Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <FiTruck className="text-[#3BB77E]" size={20} />
                <span className="text-[11px] font-black text-[#253D4E]">
                  Instant Delivery
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <FiRotateCcw className="text-[#3BB77E]" size={20} />
                <span className="text-[11px] font-black text-[#253D4E]">
                  Easy Returns
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <FiShield className="text-[#3BB77E]" size={20} />
                <span className="text-[11px] font-black text-[#253D4E]">
                  Quality Assured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-black text-[#253D4E] mb-8 border-b pb-4">
            You might also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {allProducts
              .filter(
                (p) => p.category === product.category && p.id !== product.id,
              )
              .slice(0, 5)
              .map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border hover:shadow-xl transition-all rounded-2xl p-4 group flex flex-col relative"
                >
                  <Link
                    href={`/product/${prod.id}`}
                    className="flex flex-col flex-grow text-inherit no-underline"
                  >
                    <div className="h-40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={prod.img}
                        alt={prod.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <h4 className="font-bold text-[#253D4E] text-sm group-hover:text-[#3BB77E] line-clamp-2 h-10 mb-2">
                      {prod.name}
                    </h4>
                  </Link>
                  <div className="flex justify-between items-center mt-auto pt-2">
                    <Link
                      href={`/product/${prod.id}`}
                      className="text-[#3BB77E] font-black no-underline"
                    >
                      ₹{prod.price}
                    </Link>
                    <button className="bg-[#DEF9EC] text-[#3BB77E] p-2 rounded-lg hover:bg-[#3BB77E] hover:text-white transition-colors">
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
