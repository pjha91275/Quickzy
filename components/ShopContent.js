"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  FiShoppingCart,
  FiSearch,
  FiGrid,
  FiList,
  FiFilter,
  FiChevronRight,
  FiX,
  FiStar,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";

export default function ShopContent({ products, categories }) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const [view, setView] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // GUIDE: Step 1 - Create a state to hold the maximum price selected by the user.
  // We initialize it to 5000 so all products are visible by default.
  const [maxPrice, setMaxPrice] = useState(5000);

  // Sync state with URL
  React.useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else if (searchQuery) {
      // If there is a search query, we ensure category is "All" so it doesn't conflict
      setSelectedCategory("All");
    } else {
      setSelectedCategory("All");
    }
  }, [categoryQuery, searchQuery]);

  const filteredProducts = React.useMemo(() => {
    // 1. First, apply Category Filter (if any)
    let pool = products;
    if (selectedCategory !== "All") {
      pool = products.filter((p) => {
        if (selectedCategory === "Milk & Dairy") return p.category === "Dairy";
        if (selectedCategory === "Household Essentials")
          return p.category === "Household Essentials";
        if (selectedCategory === "Tea & Coffee")
          return (
            p.name.toLowerCase().includes("coffee") ||
            p.name.toLowerCase().includes("tea") ||
            p.name.toLowerCase().includes("nescafe")
          );
        if (selectedCategory === "Electronics")
          return p.category === "Electronics" || p.category === "Gadgets";
        if (selectedCategory === "Personal Care")
          return ["Personal Care", "Beauty", "Grooming"].includes(p.category);
        return p.category === selectedCategory;
      });
    }

    // 2. Second, apply Text Search Filter (if any from URL)
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      pool = pool.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      );
    }

    // 3. Third, apply Price Filter
    return pool.filter((p) => p.price <= maxPrice);
  }, [selectedCategory, maxPrice, searchQuery, products]);

  const [sortedProducts, setSortedProducts] = useState([]);

  React.useEffect(() => {
    setSortedProducts([...filteredProducts].sort(() => Math.random() - 0.5));
  }, [filteredProducts]);

  const handleCategoryClick = (name) => {
    router.push(`/shop?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-[#DEF9EC] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-[#253D4E] mb-2">
            {selectedCategory === "All"
              ? "Shop All Products"
              : selectedCategory}
          </h1>
          <nav className="flex items-center text-sm font-bold text-gray-500 gap-2">
            <Link href="/" className="text-[#3BB77E] hover:underline">
              Home
            </Link>
            <FiChevronRight />
            <span className="text-gray-400">Shop</span>
            {selectedCategory !== "All" && (
              <>
                <FiChevronRight />
                <span className="text-gray-400">{selectedCategory}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 space-y-8">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              Category
            </h3>
            <ul className="space-y-4">
              <li
                onClick={() => handleCategoryClick("All")}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedCategory === "All" ? "bg-[#3BB77E] text-white" : "bg-green-100 text-[#3BB77E]"}`}
                  >
                    <FiGrid size={14} />
                  </div>
                  <span
                    className={`font-bold text-sm transition-colors ${selectedCategory === "All" ? "text-[#3BB77E]" : "text-gray-600 group-hover:text-[#3BB77E]"}`}
                  >
                    All
                  </span>
                </div>
                <span className="bg-[#DEF9EC] text-[#3BB77E] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                  {products.length}
                </span>
              </li>
              {categories.map((cat, i) => (
                <li
                  key={cat._id || i}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image || cat.img}
                      alt={cat.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span
                      className={`font-bold text-sm transition-colors ${selectedCategory === cat.name ? "text-[#3BB77E]" : "text-gray-600 group-hover:text-[#3BB77E]"}`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="bg-[#DEF9EC] text-[#3BB77E] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                    {cat.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              Fill by Price
            </h3>
            <div className="space-y-6">
              {/* GUIDE: Step 3 - Connect the slider to the maxPrice state.
                  'value' makes it a controlled component.
                  'onChange' updates the state every time you slide. */}
              <input
                type="range"
                className="w-full accent-[#3BB77E] cursor-pointer"
                min="0"
                max="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>
                  From: <strong className="text-[#3BB77E]">₹0</strong>
                </span>
                <span>
                  {/* GUIDE: Step 4 - Display the current maxPrice dynamically in the UI. */}
                  To: <strong className="text-[#3BB77E]">₹{maxPrice}</strong>
                </span>
              </div>
              <button className="w-full bg-[#3BB77E] text-white py-3 rounded-lg font-black text-sm hover:bg-[#29A56C] transition-colors shadow-lg flex items-center justify-center gap-2">
                <FiFilter /> Filter
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              New products
            </h3>
            <div className="space-y-6">
              {products.slice(0, 3).map((item) => (
                <Link
                  key={item._id}
                  href={`/product/${item.id_custom || item.id}`}
                  className="flex gap-4 group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-[#3BB77E] transition-colors shrink-0">
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h5 className="font-bold text-[#253D4E] text-xs mb-1 group-hover:text-[#3BB77E] transition-colors line-clamp-2 leading-tight">
                      {item.name}
                    </h5>
                    <div className="flex items-center mb-1">
                      <span className="text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                        {item.unit}
                      </span>
                    </div>
                    <span className="text-[#3BB77E] font-black text-sm">
                      ₹{item.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border rounded-2xl mb-8 shadow-sm gap-4">
            <p className="text-sm text-gray-400 font-bold">
              We found{" "}
              <span className="text-[#3BB77E]">{sortedProducts.length}</span>{" "}
              items!
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-full px-4 py-2 bg-gray-50 cursor-pointer">
                <FiGrid
                  className={
                    view === "grid" ? "text-[#3BB77E]" : "text-gray-400"
                  }
                  onClick={() => setView("grid")}
                />
                <FiList
                  className={
                    view === "list" ? "text-[#3BB77E]" : "text-gray-400"
                  }
                  onClick={() => setView("list")}
                />
              </div>
            </div>
          </div>

          <div
            className={`grid gap-6 ${view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}
          >
            {sortedProducts.map((prod) => (
              <div
                key={prod._id}
                className="bg-white border hover:shadow-2xl hover:border-[#BCE3C9] transition-all rounded-2xl p-4 relative group flex flex-col h-full"
              >
                {prod.tag && (
                  <span
                    className={`absolute top-0 left-0 text-white text-[10px] font-black px-4 py-1.5 rounded-tl-2xl rounded-br-2xl z-10 ${prod.tag === "Hot" ? "bg-pink-500" : prod.tag === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
                  >
                    {prod.tag}
                  </span>
                )}
                <Link
                  href={`/product/${prod.id_custom || prod.id}`}
                  className="block flex-grow"
                >
                  <div className="h-44 flex items-center justify-center p-4 mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                    <img
                      src={prod.image || prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">
                      {prod.category}
                    </p>
                    <h3 className="text-sm font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors line-clamp-2 h-10 mb-2 leading-tight">
                      {prod.name}
                    </h3>
                    <div className="flex items-center mb-1">
                      <span className="text-[11px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                        {prod.unit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4 font-bold">
                      By <span className="text-[#3BB77E]">{prod.vendor}</span>
                    </p>
                  </div>
                </Link>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                  <Link href={`/product/${prod.id_custom || prod.id}`}>
                    <div>
                      <span className="text-lg font-black text-[#3BB77E]">
                        ₹{prod.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-300 line-through font-bold">
                          ₹{prod.oldPrice}
                        </span>
                        <span className="text-[10px] text-green-600 font-black">
                          {prod.discount} Off
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white p-2.5 rounded-lg transition-all shadow-sm"
                  >
                    <FiShoppingCart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
