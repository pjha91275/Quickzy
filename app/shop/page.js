"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FiStar,
  FiShoppingCart,
  FiSearch,
  FiGrid,
  FiList,
  FiFilter,
  FiChevronRight,
  FiX,
} from "react-icons/fi";

const categories = [
  { name: "Milk & Dairy", count: 45, icon: "🥛" },
  { name: "Fruits & Veggies", count: 32, icon: "🍎" },
  { name: "Snacks & Munchies", count: 86, icon: "🍪" },
  { name: "Personal Care", count: 54, icon: "🧼" },
  { name: "Cleaning Essentials", count: 42, icon: "🧹" },
  { name: "Beverages", count: 65, icon: "🥤" },
  { name: "Electronics", count: 34, icon: "🎧" },
];

const allProducts = [
  // From Homepage 'products' array
  {
    id: 1,
    name: "Apple Lightning Cable (1m)",
    price: 1499,
    oldPrice: 1900,
    img: "https://m.media-amazon.com/images/I/21ANdUsXdPL._SX342_SY445_QL70_FMwebp_.jpg",
    rating: 4.8,
    tag: "Hot",
    vendor: "Apple",
    category: "Electronics",
  },
  {
    id: 2,
    name: "BoAt Bassheads 100",
    price: 399,
    oldPrice: 599,
    img: "https://m.media-amazon.com/images/I/313U7Xx9b4L._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.5,
    tag: "Sale",
    vendor: "BoAt",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Energizer MAX AA (4pk)",
    price: 299,
    oldPrice: 350,
    img: "https://m.media-amazon.com/images/I/51WKnE4bvpL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.9,
    tag: "Best",
    vendor: "Energizer",
    category: "Gadgets",
  },
  {
    id: 4,
    name: "Nivea Men Face Wash",
    price: 185,
    oldPrice: 210,
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ0W4YGyIeHyvdg7KaIXIzHbTxcVT4nwviIH2JrzF0nDK26Ope46NqSr5c_2GsGAAvWnjp2-e5QrNNWoVVTGix1xBYUZzs991zfyghM9kwJiXCnMB-ojsimEg",
    rating: 4.7,
    vendor: "Nivea",
    category: "Personal Care",
  },
  {
    id: 5,
    name: "Dove Intense Repair",
    price: 450,
    oldPrice: 520,
    img: "https://m.media-amazon.com/images/I/31J9B3A8rIL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.6,
    vendor: "Dove",
    category: "Beauty",
  },
  {
    id: 6,
    name: "Maggi Masala (Pack of 12)",
    price: 168,
    oldPrice: 180,
    img: "https://www.jiomart.com/images/product/original/491410091/maggi-masala-ae-magic-6-g-pack-of-12-product-images-o491410091-p491410091-0-202305181146.jpg?im=Resize=(420,420)",
    rating: 4.9,
    tag: "Hot",
    vendor: "Nestle",
    category: "Food",
  },
  {
    id: 7,
    name: "Coca Cola (1.25L)",
    price: 65,
    oldPrice: 75,
    img: "https://www.bigbasket.com/media/uploads/p/l/251023_11-coca-cola-soft-drink.jpg",
    rating: 4.8,
    vendor: "Coca Cola",
    category: "Beverages",
  },
  {
    id: 8,
    name: "Lay's Classic Salted",
    price: 20,
    oldPrice: 22,
    img: "https://m.media-amazon.com/images/I/41VxPV-rWsL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.7,
    vendor: "Lay's",
    category: "Snacks",
  },
  {
    id: 9,
    name: "Aashirvaad Atta (5kg)",
    price: 245,
    oldPrice: 280,
    img: "https://www.bigbasket.com/media/uploads/p/l/126906_8-aashirvaad-atta-whole-wheat.jpg",
    rating: 4.9,
    vendor: "ITC",
    category: "Grocery",
  },
  {
    id: 10,
    name: "Amul Butter (500g)",
    price: 275,
    oldPrice: 290,
    img: "https://www.jiomart.com/images/product/original/490001392/amul-pasteurised-butter-500-g-product-images-o490001392-p490001392-0-202508291839.jpg?im=Resize=(420,420)",
    rating: 4.8,
    vendor: "Amul",
    category: "Dairy",
  },
  {
    id: 11,
    name: "Pilot V5 Blue (Pack of 3)",
    price: 180,
    oldPrice: 210,
    img: "https://m.media-amazon.com/images/I/312PBvXYmKL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.8,
    tag: "Sale",
    vendor: "Pilot",
    category: "Stationery",
  },
  {
    id: 12,
    name: "Classmate Notebooks (6pk)",
    price: 320,
    oldPrice: 380,
    img: "https://www.bigbasket.com/media/uploads/p/l/1212080_1-classmate-notebook-a4-ruled.jpg",
    rating: 4.7,
    vendor: "ITC",
    category: "Stationery",
  },
  {
    id: 13,
    name: "Dettol Liquid Original",
    price: 190,
    oldPrice: 220,
    img: "https://m.media-amazon.com/images/I/41XWa3YKg+L._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.8,
    vendor: "Dettol",
    category: "Health",
  },
  {
    id: 14,
    name: "Surf Excel Matic (1L)",
    price: 240,
    oldPrice: 280,
    img: "https://m.media-amazon.com/images/I/616ZqasKGuL.jpg",
    rating: 4.9,
    tag: "Hot",
    vendor: "Surf Excel",
    category: "Household",
  },
  {
    id: 15,
    name: "Pedigree Adult (1.2kg)",
    price: 310,
    oldPrice: 340,
    img: "https://m.media-amazon.com/images/I/712604bPj2L._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.7,
    vendor: "Pedigree",
    category: "Pet Food",
  },
  {
    id: 16,
    name: "Gillette Mach 3 (4ct)",
    price: 750,
    oldPrice: 850,
    img: "https://m.media-amazon.com/images/I/718Vmj9THoL._SX679_.jpg",
    rating: 4.8,
    vendor: "Gillette",
    category: "Grooming",
  },
  {
    id: 17,
    name: "Nescafe Gold (50g)",
    price: 320,
    oldPrice: 380,
    img: "https://m.media-amazon.com/images/I/41O76L+6oDL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.9,
    tag: "Best",
    vendor: "Nescafe",
    category: "Beverages",
  },
  {
    id: 18,
    name: "Cadbury Celebrations",
    price: 150,
    oldPrice: 180,
    img: "https://m.media-amazon.com/images/I/71WIIW0xOaL._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.8,
    vendor: "Cadbury",
    category: "Gifts",
  },
  {
    id: 19,
    name: "Real Fruit mixed (1L)",
    price: 110,
    oldPrice: 125,
    img: "https://www.bigbasket.com/media/uploads/p/l/1204481_1-real-fruit-power-juice-mixed.jpg",
    rating: 4.6,
    vendor: "Real",
    category: "Beverages",
  },
  {
    id: 20,
    name: "Wild Stone Deodorant",
    price: 245,
    oldPrice: 299,
    img: "https://m.media-amazon.com/images/I/611dsNJJjBL._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.7,
    vendor: "Wild Stone",
    category: "Grooming",
  },

  // From specific sections
  {
    id: 21,
    name: "Philips Series 3000 Trimmer",
    price: 1845,
    oldPrice: 2295,
    img: "https://m.media-amazon.com/images/I/41q1HlJ08ZL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.8,
    vendor: "Philips",
    category: "Grooming",
    tag: "Hot",
  },
  {
    id: 22,
    name: "boAt Storm Smartwatch",
    price: 1999,
    oldPrice: 3999,
    img: "https://m.media-amazon.com/images/I/61S9aVnRZDL.jpg",
    rating: 4.7,
    vendor: "BoAt",
    category: "Electronics",
    tag: "New",
  },
  {
    id: 23,
    name: "Lindt Excellence Dark",
    price: 245,
    oldPrice: 315,
    img: "https://m.media-amazon.com/images/I/51aFMIhl6TL._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.9,
    vendor: "Lindt",
    category: "Snacks",
  },
  {
    id: 24,
    name: "Heritage Toned Milk (1L)",
    price: 64,
    oldPrice: 68,
    img: "https://www.jiomart.com/images/product/original/494271401/heritage-golden-cow-milk-1- l-pouch-product-images-o494271401-p610079697-0-202410071813.jpg?im=Resize=(420,420)",
    rating: 4.8,
    vendor: "Heritage",
    category: "Dairy",
  },
  {
    id: 25,
    name: "Parle-G Gold (1kg)",
    price: 120,
    oldPrice: 140,
    img: "https://www.jiomart.com/images/product/original/491335633/parle-g-gold-biscuits-1-kg-product-images-o491335633-p491335633-0-202303221149.jpg?im=Resize=(420,420)",
    rating: 4.9,
    vendor: "Parle",
    category: "Snacks",
  },
  {
    id: 26,
    name: "Saffola Gold (5L)",
    price: 845,
    oldPrice: 950,
    img: "https://www.bigbasket.com/media/uploads/p/l/147491_9-saffola-gold-pro-healthy-lifestyle-edible-oil.jpg",
    rating: 4.8,
    vendor: "Marico",
    category: "Grocery",
  },
  {
    id: 27,
    name: "Britannia Cashew Cookies",
    price: 25,
    oldPrice: 30,
    img: "https://www.bigbasket.com/media/uploads/p/l/102102_4-britannia-good-day-cashew-cookies.jpg",
    rating: 4.7,
    vendor: "Britannia",
    category: "Snacks",
  },
  {
    id: 28,
    name: "Logitech B170 Mouse",
    price: 599,
    oldPrice: 899,
    img: "https://m.media-amazon.com/images/I/51uCYJqDrML._SX679_.jpg",
    rating: 4.8,
    vendor: "Logitech",
    category: "Electronics",
  },
  {
    id: 29,
    name: "SanDisk 64GB Pendrive",
    price: 499,
    oldPrice: 999,
    img: "https://m.media-amazon.com/images/I/61DjwgS4cbL._SX679_.jpg",
    rating: 4.7,
    vendor: "SanDisk",
    category: "Electronics",
  },
  {
    id: 30,
    name: "HP v236w USB 2.0 32GB",
    price: 349,
    oldPrice: 550,
    img: "https://m.media-amazon.com/images/I/61xNG4wjOuL.jpg",
    rating: 4.6,
    vendor: "HP",
    category: "Electronics",
  },
  {
    id: 31,
    name: "Kitchen Essentials Pan",
    price: 845,
    oldPrice: 950,
    img: "https://m.media-amazon.com/images/I/61VlNDf-RgL._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.9,
    vendor: "Kitchen Essentials",
    category: "Household",
  },
  {
    id: 32,
    name: "Milton Bottle (1L)",
    price: 445,
    oldPrice: 550,
    img: "https://m.media-amazon.com/images/I/71gRVwNdq-L._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.7,
    vendor: "Milton",
    category: "Household",
  },
  {
    id: 33,
    name: "Cello Maxwriter Pen",
    price: 50,
    oldPrice: 60,
    img: "https://m.media-amazon.com/images/I/51CVtuYNLrL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.8,
    vendor: "Cello",
    category: "Stationery",
  },
  {
    id: 34,
    name: "Happilo Roasted Almonds",
    price: 245,
    oldPrice: 350,
    img: "https://m.media-amazon.com/images/I/41jmDmSnwkL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 5.0,
    vendor: "Happilo",
    category: "Snacks",
  },
  {
    id: 35,
    name: "Hershey's Chocolate Syrup",
    price: 185,
    oldPrice: 210,
    img: "https://m.media-amazon.com/images/I/4196sepYxPL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.9,
    vendor: "Hershey's",
    category: "Beverages",
  },
  {
    id: 36,
    name: "Tata Salt Lite",
    price: 45,
    oldPrice: 50,
    img: "https://m.media-amazon.com/images/I/51UimLq2MXL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.9,
    vendor: "Tata Salt",
    category: "Grocery",
  },
  {
    id: 37,
    name: "Sony WH-CH520 Headphones",
    price: 3990,
    oldPrice: 5990,
    img: "https://m.media-amazon.com/images/I/41PA8xgXx4L._AC_UY436_FMwebp_QL65_.jpg",
    rating: 4.8,
    vendor: "Sony",
    category: "Electronics",
  },
  {
    id: 38,
    name: "Milton ThermoSteel Flask",
    price: 845,
    oldPrice: 1050,
    img: "https://m.media-amazon.com/images/I/51rdJTjBEnL.jpg",
    rating: 4.7,
    vendor: "Milton",
    category: "Household",
  },

  // New specific items for Shop page
  {
    id: 39,
    name: "Fortune Mustard Oil (1L)",
    price: 155,
    oldPrice: 180,
    img: "https://www.bigbasket.com/media/uploads/p/l/274145_14-fortune-mustard-oil-kachi-ghani.jpg",
    rating: 4.6,
    vendor: "Fortune",
    category: "Grocery",
  },
  {
    id: 40,
    name: "Amul Fresh Paneer (200g)",
    price: 85,
    oldPrice: 95,
    img: "https://www.bigbasket.com/media/uploads/p/l/127117_4-amul-fresh-paneer.jpg",
    rating: 4.8,
    vendor: "Amul",
    category: "Dairy",
  },
];

export default function Shop() {
  const [view, setView] = useState("grid");

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* --- Breadcrumbs & Header --- */}
      <div className="bg-[#DEF9EC] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-[#253D4E] mb-2">
            Snacks & Munchies
          </h1>
          <nav className="flex items-center text-sm font-bold text-gray-500 gap-2">
            <Link href="/" className="text-[#3BB77E] hover:underline">
              Home
            </Link>
            <FiChevronRight />
            <span className="text-gray-400">Shop</span>
            <FiChevronRight />
            <span className="text-gray-400">Products</span>
          </nav>

          {/* Quick Categories Bar */}
          <div className="flex flex-wrap shadow-sm gap-3 mt-8">
            {["Cabbage", "Broccoli", "Artichoke", "Celery", "Spinach"].map(
              (tag) => (
                <span
                  key={tag}
                  className="bg-white text-gray-600 px-4 py-1.5 rounded-md text-xs font-bold border flex items-center gap-1 cursor-pointer hover:text-[#3BB77E] transition-colors"
                >
                  <FiX className="text-[10px]" /> {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        {/* --- Sidebar --- */}
        <aside className="w-full md:w-1/4 space-y-8">
          {/* Filter by Category */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              Category
            </h3>
            <ul className="space-y-4">
              {categories.map((cat, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-gray-600 font-bold text-sm group-hover:text-[#3BB77E] transition-colors">
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

          {/* Fill by Price */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              Fill by Price
            </h3>
            <div className="space-y-6">
              <input
                type="range"
                className="w-full accent-[#3BB77E]"
                min="0"
                max="5000"
              />
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>
                  From: <strong className="text-[#3BB77E]">₹0</strong>
                </span>
                <span>
                  To: <strong className="text-[#3BB77E]">₹5000</strong>
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black text-[#253D4E]">Color</h4>
                {["Red (56)", "Green (78)", "Blue (54)"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-[#3BB77E]"
                    />
                    <span className="text-sm text-gray-500 font-medium group-hover:text-[#3BB77E]">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>

              <button className="w-full bg-[#3BB77E] text-white py-3 rounded-lg font-black text-sm hover:bg-[#29A56C] transition-colors shadow-lg flex items-center justify-center gap-2">
                <FiFilter className="text-lg" /> Filter
              </button>
            </div>
            <img
              src="https://www.bigbasket.com/media/uploads/p/l/10000069_20-capsicum-green.jpg"
              alt="ads"
              className="mt-10 rounded-xl opacity-20 grayscale"
            />
          </div>

          {/* New Products (Small list) */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              New Products
            </h3>
            <div className="space-y-6">
              {allProducts.slice(-3).map((prod) => (
                <div
                  key={prod.id}
                  className="flex gap-4 group cursor-pointer border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 shrink-0 border">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors leading-tight mb-2">
                      {prod.name}
                    </h5>
                    <div className="text-sm font-black text-[#3BB77E]">
                      ₹{prod.price}
                    </div>
                    <div className="flex text-yellow-400 text-[10px] mt-1">
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="text-gray-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="w-full md:w-3/4">
          {/* Top Bar */}
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border rounded-2xl mb-8 shadow-sm gap-4">
            <p className="text-sm text-gray-400 font-bold">
              We found{" "}
              <span className="text-[#3BB77E]">{allProducts.length}</span> items
              for you!
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
              <select className="bg-gray-50 border rounded-full px-4 py-2 text-xs font-bold text-gray-600 outline-none">
                <option>Show: 50</option>
                <option>Show: 100</option>
              </select>
              <select className="bg-gray-50 border rounded-full px-4 py-2 text-xs font-bold text-gray-600 outline-none">
                <option>Sort by: Featured</option>
                <option>Sort by: Price High to Low</option>
                <option>Sort by: Price Low to High</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div
            className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}
          >
            {allProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border hover:shadow-2xl hover:border-[#BCE3C9] transition-all rounded-2xl p-4 relative group flex flex-col h-full"
              >
                {/* Tag */}
                {prod.tag && (
                  <span
                    className={`absolute top-0 left-0 text-white text-[10px] font-black px-4 py-1.5 rounded-tl-2xl rounded-br-2xl z-10 
                    ${prod.tag === "Hot" ? "bg-pink-500" : prod.tag === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
                  >
                    {prod.tag}
                  </span>
                )}

                {/* Image Container */}
                <div className="h-44 flex items-center justify-center p-4 mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                  <img
                    src={prod.img}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info Container */}
                <div className="flex-grow">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">
                    {prod.category}
                  </p>
                  <h3 className="text-sm font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors line-clamp-2 h-10 mb-2 leading-tight">
                    {prod.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400 text-[10px]">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < Math.floor(prod.rating)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-black">
                      ({prod.rating})
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mb-4 font-bold">
                    By <span className="text-[#3BB77E]">{prod.vendor}</span>
                  </p>

                  {/* Pricing & Add Button */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                    <div>
                      <span className="text-lg font-black text-[#3BB77E]">
                        ₹{prod.price}
                      </span>
                      <p className="text-[11px] text-gray-300 line-through font-bold">
                        ₹{prod.oldPrice}
                      </p>
                    </div>
                    <button className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-xs font-black transition-all shadow-sm hover:shadow-inner active:scale-95">
                      Add <FiShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-16 gap-3">
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 cursor-pointer hover:bg-[#3BB77E] hover:text-white transition-all shadow-sm">
              1
            </span>
            <span className="w-10 h-10 rounded-full bg-[#3BB77E] text-white flex items-center justify-center text-sm font-bold cursor-pointer shadow-md">
              2
            </span>
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 cursor-pointer hover:bg-[#3BB77E] hover:text-white transition-all shadow-sm">
              3
            </span>
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 cursor-pointer hover:bg-[#3BB77E] hover:text-white transition-all shadow-sm">
              ...
            </span>
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 cursor-pointer hover:bg-[#3BB77E] hover:text-white transition-all shadow-sm">
              6
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
