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

const allProducts = [
  // --- Dairy (5 items) ---
  {
    id: 10,
    name: "Amul Butter (500g)",
    price: 275,
    oldPrice: 290,
    img: "https://www.jiomart.com/images/product/original/490001392/amul-pasteurised-butter-500-g-product-images-o490001392-p490001392-0-202508291839.jpg?im=Resize=(420,420)",
    rating: 4.4,
    vendor: "Amul",
    category: "Dairy",
    discount: "5%",
  },
  {
    id: 24,
    name: "Heritage Toned Milk (1L)",
    price: 64,
    oldPrice: 68,
    img: "https://www.jiomart.com/images/product/original/494271401/heritage-golden-cow-milk-1-l-pouch-product-images-o494271401-p610079697-0-202410071813.jpg?im=Resize=(420,420)",
    rating: 4.4,
    vendor: "Heritage",
    category: "Dairy",
    discount: "6%",
  },
  {
    id: 40,
    name: "Amul Fresh Paneer (200g)",
    price: 85,
    oldPrice: 95,
    img: "https://m.media-amazon.com/images/I/81hD14MN91L._SX679_.jpg",
    rating: 4.5,
    vendor: "Amul",
    category: "Dairy",
    discount: "11%",
  },
  {
    id: 41,
    name: "Mother Dairy Curd (400g)",
    price: 35,
    oldPrice: 40,
    img: "https://www.bigbasket.com/media/uploads/p/l/40006900_4-mother-dairy-ultimate-pouch-curd.jpg",
    rating: 4.1,
    vendor: "Mother Dairy",
    category: "Dairy",
    discount: "13%",
  },
  {
    id: 42,
    name: "Amul Cheese Slices (200g)",
    price: 155,
    oldPrice: 165,
    img: "https://www.bigbasket.com/media/uploads/p/l/104697_14-amul-cheese-slices.jpg",
    rating: 4.6,
    vendor: "Amul",
    category: "Dairy",
    discount: "6%",
  },

  // --- Fruits (5 items) ---
  {
    id: 43,
    name: "Fresh Banana (Robusta)",
    price: 45,
    oldPrice: 60,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000031_21-banana-robusta.jpg",
    rating: 4.3,
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "25%",
  },
  {
    id: 44,
    name: "Fresh Apple (Royal Gala)",
    price: 180,
    oldPrice: 220,
    img: "https://www.bigbasket.com/media/uploads/p/l/40033819_9-apple-royal-gala-economy.jpg",
    rating: 4.7,
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "18%",
  },
  {
    id: 45,
    name: "Fresh Orange (Imported)",
    price: 120,
    oldPrice: 150,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000266_25-orange-nagpur-regular.jpg",
    rating: 4.4,
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "20%",
  },
  {
    id: 46,
    name: "Fresh Grapes (Seedless)",
    price: 90,
    oldPrice: 110,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000115_18-grapes-bangalore-blue-with-seed.jpg",
    rating: 4.5,
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "18%",
  },
  {
    id: 47,
    name: "Fresh Pomegranate",
    price: 160,
    oldPrice: 200,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000269_31-pomegranate.jpg",
    rating: 4.8,
    vendor: "Quickzy Fresh",
    category: "Fruits",
    discount: "20%",
  },

  // --- Vegetables (5 items) ---
  {
    id: 48,
    name: "Fresh Tomato (Local)",
    price: 30,
    oldPrice: 40,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000201_15-tomato-hybrid.jpg",
    rating: 4.2,
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "25%",
  },
  {
    id: 49,
    name: "Fresh Onion (Nashik)",
    price: 40,
    oldPrice: 50,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000148_30-onion.jpg",
    rating: 4.6,
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "20%",
  },
  {
    id: 50,
    name: "Fresh Potato (New Crop)",
    price: 35,
    oldPrice: 45,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000159_26-potato.jpg",
    rating: 4.4,
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "22%",
  },
  {
    id: 51,
    name: "Fresh Cauliflower",
    price: 40,
    oldPrice: 60,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000074_19-cauliflower.jpg",
    rating: 4.1,
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "33%",
  },
  {
    id: 52,
    name: "Fresh Spinach (Palak)",
    price: 20,
    oldPrice: 30,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000188_12-palak-cleaned-without-root.jpg",
    rating: 4.7,
    vendor: "Quickzy Fresh",
    category: "Vegetables",
    discount: "33%",
  },

  // --- Beverages (4 items) ---
  {
    id: 7,
    name: "Coca Cola (1.25L)",
    price: 65,
    oldPrice: 75,
    img: "https://www.bigbasket.com/media/uploads/p/l/251023_11-coca-cola-soft-drink.jpg",
    rating: 4.5,
    vendor: "Coca Cola",
    category: "Beverages",
    discount: "13%",
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
    discount: "15%",
  },
  {
    id: 19,
    name: "Real Fruit mixed (1L)",
    price: 110,
    oldPrice: 125,
    img: "https://www.bigbasket.com/media/uploads/p/l/1204481_1-real-fruit-power-juice-mixed.jpg",
    rating: 4.1,
    vendor: "Real",
    category: "Beverages",
    discount: "12%",
  },
  {
    id: 35,
    name: "Hershey's Chocolate Syrup",
    price: 185,
    oldPrice: 210,
    img: "https://m.media-amazon.com/images/I/4196sepYxPL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.3,
    vendor: "Hershey's",
    category: "Beverages",
    discount: "12%",
  },

  // --- Snacks (6 items) ---
  {
    id: 8,
    name: "Lay's Classic Salted",
    price: 20,
    oldPrice: 22,
    img: "https://m.media-amazon.com/images/I/41VxPV-rWsL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.6,
    vendor: "Lay's",
    category: "Snacks",
    discount: "10%",
  },
  {
    id: 23,
    name: "Lindt Excellence Dark",
    price: 245,
    oldPrice: 315,
    img: "https://m.media-amazon.com/images/I/51aFMIhl6TL._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.8,
    vendor: "Lindt",
    category: "Snacks",
    discount: "22%",
  },
  {
    id: 25,
    name: "Parle-G Gold (1kg)",
    price: 120,
    oldPrice: 140,
    img: "https://www.jiomart.com/images/product/original/491335633/parle-g-gold-biscuits-1-kg-product-images-o491335633-p491335633-0-202303221149.jpg?im=Resize=(420,420)",
    rating: 4.7,
    vendor: "Parle",
    category: "Snacks",
    discount: "14%",
  },
  {
    id: 27,
    name: "Britannia Cashew Cookies",
    price: 25,
    oldPrice: 30,
    img: "https://m.media-amazon.com/images/I/71zTGI0xIML._SX679_.jpg",
    rating: 4.3,
    vendor: "Britannia",
    category: "Snacks",
    discount: "16%",
  },
  {
    id: 34,
    name: "Happilo Roasted Almonds",
    price: 245,
    oldPrice: 350,
    img: "https://m.media-amazon.com/images/I/41jmDmSnwkL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.7,
    vendor: "Happilo",
    category: "Snacks",
    discount: "30%",
  },
  {
    id: 53,
    name: "Haldiram's Bhujia (400g)",
    price: 95,
    oldPrice: 110,
    img: "https://www.bigbasket.com/media/uploads/p/l/1202860_2-haldirams-nagpur-bhujia-sev.jpg",
    rating: 4.8,
    vendor: "Haldiram",
    category: "Snacks",
    discount: "14%",
  },

  // --- Electronics & Gadgets (6 items) ---
  {
    id: 1,
    name: "Apple Lightning Cable (1m)",
    price: 1499,
    oldPrice: 1900,
    img: "https://m.media-amazon.com/images/I/21ANdUsXdPL._SX342_SY445_QL70_FMwebp_.jpg",
    rating: 4.3,
    tag: "Hot",
    vendor: "Apple",
    category: "Electronics",
    discount: "21%",
  },
  {
    id: 2,
    name: "BoAt Bassheads 100",
    price: 399,
    oldPrice: 599,
    img: "https://m.media-amazon.com/images/I/313U7Xx9b4L._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.1,
    tag: "Sale",
    vendor: "BoAt",
    category: "Electronics",
    discount: "33%",
  },
  {
    id: 3,
    name: "Energizer MAX AA (4pk)",
    price: 299,
    oldPrice: 350,
    img: "https://m.media-amazon.com/images/I/51WKnE4bvpL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.7,
    tag: "Best",
    vendor: "Energizer",
    category: "Gadgets",
    discount: "14%",
  },
  {
    id: 22,
    name: "boAt Storm Smartwatch",
    price: 1999,
    oldPrice: 3999,
    img: "https://m.media-amazon.com/images/I/61S9aVnRZDL.jpg",
    rating: 4.6,
    vendor: "BoAt",
    category: "Electronics",
    tag: "New",
    discount: "50%",
  },
  {
    id: 28,
    name: "Logitech B170 Mouse",
    price: 599,
    oldPrice: 899,
    img: "https://m.media-amazon.com/images/I/51uCYJqDrML._SX679_.jpg",
    rating: 4.6,
    vendor: "Logitech",
    category: "Electronics",
    discount: "33%",
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
    discount: "33%",
  },

  // --- Personal & Beauty (3 items) ---
  {
    id: 4,
    name: "Nivea Men Face Wash",
    price: 185,
    oldPrice: 210,
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ0W4YGyIeHyvdg7KaIXIzHbTxcVT4nwviIH2JrzF0nDK26Ope46NqSr5c_2GsGAAvWnjp2-e5QrNNWoVVTGix1xBYUZzs991zfyghM9kwJiXCnMB-ojsimEg",
    rating: 4.4,
    vendor: "Nivea",
    category: "Personal Care",
    discount: "12%",
  },
  {
    id: 5,
    name: "Dove Intense Repair",
    price: 450,
    oldPrice: 520,
    img: "https://m.media-amazon.com/images/I/31J9B3A8rIL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.2,
    vendor: "Dove",
    category: "Beauty",
    discount: "13%",
  },
  {
    id: 20,
    name: "Wild Stone Deodorant",
    price: 245,
    oldPrice: 299,
    img: "https://m.media-amazon.com/images/I/611dsNJJjBL._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.5,
    vendor: "Wild Stone",
    category: "Grooming",
    discount: "18%",
  },

  // --- Household (5 items) ---
  {
    id: 14,
    name: "Surf Excel Matic (1L)",
    price: 240,
    oldPrice: 280,
    img: "https://m.media-amazon.com/images/I/616ZqasKGuL.jpg",
    rating: 4.8,
    tag: "Hot",
    vendor: "Surf Excel",
    category: "Household",
    discount: "14%",
  },
  {
    id: 31,
    name: "Kitchen Essentials Pan",
    price: 845,
    oldPrice: 950,
    img: "https://m.media-amazon.com/images/I/61VlNDf-RgL._AC_UL640_FMwebp_QL65_.jpg",
    rating: 4.8,
    vendor: "Kitchen Essentials",
    category: "Household",
    discount: "11%",
  },
  {
    id: 32,
    name: "Milton Bottle (1L)",
    price: 445,
    oldPrice: 550,
    img: "https://m.media-amazon.com/images/I/31e+tH1FKML._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.4,
    vendor: "Milton",
    category: "Household",
    discount: "19%",
  },
  {
    id: 38,
    name: "Milton ThermoSteel Flask",
    price: 845,
    oldPrice: 1050,
    img: "https://m.media-amazon.com/images/I/41lTfXSregL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.4,
    vendor: "Milton",
    category: "Household",
    discount: "19%",
  },
  {
    id: 54,
    name: "Lizol Floor Cleaner (500ml)",
    price: 105,
    oldPrice: 120,
    img: "https://www.bigbasket.com/media/uploads/p/l/241732_10-lizol-disinfectant-surface-floor-cleaner-citrus.jpg",
    rating: 4.3,
    vendor: "Lizol",
    category: "Household",
    discount: "12%",
  },

  // --- Grocery (4 items) ---
  {
    id: 9,
    name: "Aashirvaad Atta (5kg)",
    price: 245,
    oldPrice: 280,
    img: "https://www.bigbasket.com/media/uploads/p/l/126906_8-aashirvaad-atta-whole-wheat.jpg",
    rating: 4.9,
    vendor: "ITC",
    category: "Grocery",
    discount: "12%",
  },
  {
    id: 26,
    name: "Saffola Gold (5L)",
    price: 845,
    oldPrice: 950,
    img: "https://www.bigbasket.com/media/uploads/p/l/147491_9-saffola-gold-pro-healthy-lifestyle-edible-oil.jpg",
    rating: 4.5,
    vendor: "Marico",
    category: "Grocery",
    discount: "11%",
  },
  {
    id: 36,
    name: "Tata Salt Lite",
    price: 45,
    oldPrice: 50,
    img: "https://m.media-amazon.com/images/I/51UimLq2MXL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.6,
    vendor: "Tata Salt",
    category: "Grocery",
    discount: "10%",
  },
  {
    id: 39,
    name: "Fortune Mustard Oil (1L)",
    price: 155,
    oldPrice: 180,
    img: "https://www.bigbasket.com/media/uploads/p/l/274145_14-fortune-mustard-oil-kachi-ghani.jpg",
    rating: 4.2,
    vendor: "Fortune",
    category: "Grocery",
    discount: "14%",
  },

  // --- Stationery (3 items) ---
  {
    id: 11,
    name: "Pilot V5 Blue (Pack of 3)",
    price: 180,
    oldPrice: 210,
    img: "https://m.media-amazon.com/images/I/312PBvXYmKL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.2,
    tag: "Sale",
    vendor: "Pilot",
    category: "Stationery",
    discount: "14%",
  },
  {
    id: 12,
    name: "Classmate Notebooks (6pk)",
    price: 320,
    oldPrice: 380,
    img: "https://www.bigbasket.com/media/uploads/p/l/1212080_1-classmate-notebook-a4-ruled.jpg",
    rating: 4.5,
    vendor: "ITC",
    category: "Stationery",
    discount: "16%",
  },
  {
    id: 33,
    name: "Cello Maxwriter Pen",
    price: 50,
    oldPrice: 60,
    img: "https://m.media-amazon.com/images/I/51CVtuYNLrL._SY300_SX300_QL70_FMwebp_.jpg",
    rating: 4.5,
    vendor: "Cello",
    category: "Stationery",
    discount: "17%",
  },
];

const shuffledProducts = [...allProducts].sort(() => Math.random() - 0.5);

const categoriesWithCount = [
  {
    name: "Milk & Dairy",
    count: 5,
    img: "https://www.jiomart.com/images/product/original/494271401/heritage-golden-cow-milk-1-l-pouch-product-images-o494271401-p610079697-0-202410071813.jpg?im=Resize=(420,420)",
  },
  {
    name: "Fruits",
    count: 5,
    img: "https://m.media-amazon.com/images/I/51fWm14UXiL._AC_UL640_FMwebp_QL65_.jpg",
  },
  {
    name: "Vegetables",
    count: 5,
    img: "https://www.bigbasket.com/media/uploads/p/l/10000069_20-capsicum-green.jpg",
  },
  {
    name: "Tea & Coffee",
    count: 3,
    img: "https://m.media-amazon.com/images/I/41O76L+6oDL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    name: "Snacks",
    count: 6,
    img: "https://m.media-amazon.com/images/I/41VxPV-rWsL._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    name: "Personal Care",
    count: 3,
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ0W4YGyIeHyvdg7KaIXIzHbTxcVT4nwviIH2JrzF0nDK26Ope46NqSr5c_2GsGAAvWnjp2-e5QrNNWoVVTGix1xBYUZzs991zfyghM9kwJiXCnMB-ojsimEg",
  },
  {
    name: "Cleaning Essentials",
    count: 5,
    img: "https://m.media-amazon.com/images/I/616ZqasKGuL.jpg",
  },
  {
    name: "Beverages",
    count: 4,
    img: "https://www.bigbasket.com/media/uploads/p/l/251023_11-coca-cola-soft-drink.jpg",
  },
  {
    name: "Electronics",
    count: 6,
    img: "https://m.media-amazon.com/images/I/61S9aVnRZDL.jpg",
  },
  {
    name: "Stationery",
    count: 3,
    img: "https://www.bigbasket.com/media/uploads/p/l/1212080_1-classmate-notebook-a4-ruled.jpg",
  },
];

export default function Shop() {
  const [view, setView] = useState("grid");
  const shuffledProducts = React.useMemo(
    () => [...allProducts].sort(() => Math.random() - 0.5),
    [],
  );

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-[#DEF9EC] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-[#253D4E] mb-2">
            Shop All Products
          </h1>
          <nav className="flex items-center text-sm font-bold text-gray-500 gap-2">
            <Link href="/" className="text-[#3BB77E] hover:underline">
              Home
            </Link>
            <FiChevronRight />
            <span className="text-gray-400">Shop</span>
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
              {categoriesWithCount.map((cat, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-8 h-8 object-contain"
                    />
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
              {[
                {
                  name: "boAt Storm Smartwatch",
                  price: "₹1,999",
                  img: "https://m.media-amazon.com/images/I/61S9aVnRZDL.jpg",
                  rating: 4.6,
                },
                {
                  name: "Fresh Royal Gala Apple",
                  price: "₹180",
                  img: "https://www.bigbasket.com/media/uploads/p/l/40033819_9-apple-royal-gala-economy.jpg",
                  rating: 4.7,
                },
                {
                  name: "Lindt Excellence Dark",
                  price: "₹245",
                  img: "https://m.media-amazon.com/images/I/51aFMIhl6TL._AC_UL640_FMwebp_QL65_.jpg",
                  rating: 4.8,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-[#3BB77E] transition-colors shrink-0">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h5 className="font-bold text-[#253D4E] text-xs mb-1 group-hover:text-[#3BB77E] transition-colors line-clamp-2 leading-tight">
                      {item.name}
                    </h5>
                    <div className="flex text-yellow-400 text-[10px] mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < Math.floor(item.rating)
                              ? "fill-current"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[#3BB77E] font-black text-sm">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border rounded-2xl mb-8 shadow-sm gap-4">
            <p className="text-sm text-gray-400 font-bold">
              We found{" "}
              <span className="text-[#3BB77E]">{allProducts.length}</span>{" "}
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
            className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}
          >
            {shuffledProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border hover:shadow-2xl hover:border-[#BCE3C9] transition-all rounded-2xl p-4 relative group flex flex-col h-full"
              >
                {prod.tag && (
                  <span
                    className={`absolute top-0 left-0 text-white text-[10px] font-black px-4 py-1.5 rounded-tl-2xl rounded-br-2xl z-10 ${prod.tag === "Hot" ? "bg-pink-500" : prod.tag === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
                  >
                    {prod.tag}
                  </span>
                )}
                <div className="h-44 flex items-center justify-center p-4 mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                  <img
                    src={prod.img}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">
                    {prod.category}
                  </p>
                  <h3 className="text-sm font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors line-clamp-2 h-10 mb-2 leading-tight">
                    {prod.name}
                  </h3>
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
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
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
                    <button className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white p-2.5 rounded-lg transition-all shadow-sm">
                      <FiShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
