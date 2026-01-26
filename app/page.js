"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import {
  FiArrowRight,
  FiShoppingCart,
  FiStar,
  FiPhoneCall,
  FiMail,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaYoutube,
  FaApple,
  FaGooglePlay,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";

const categories = [
  {
    name: "Milk & Dairy",
    img: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=200&auto=format&fit=crop",
    count: 45,
    bg: "bg-blue-50",
  },
  {
    name: "Fruits",
    img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=200&auto=format&fit=crop",
    count: 32,
    bg: "bg-orange-50",
  },
  {
    name: "Tea & Coffee",
    img: "https://images.unsplash.com/photo-1594631252845-29fc4586d5bc?q=80&w=200&auto=format&fit=crop",
    count: 28,
    bg: "bg-amber-50",
  },
  {
    name: "Snacks",
    img: "https://images.unsplash.com/photo-1626132646529-5006375bc858?q=80&w=200&auto=format&fit=crop",
    count: 86,
    bg: "bg-yellow-50",
  },
  {
    name: "Personal Care",
    img: "https://images.unsplash.com/photo-1512496011216-369fd0347ecb?q=80&w=200&auto=format&fit=crop",
    count: 54,
    bg: "bg-pink-50",
  },
  {
    name: "Cleaning",
    img: "https://images.unsplash.com/photo-1550963295-019dfc40c81e?q=80&w=200&auto=format&fit=crop",
    count: 42,
    bg: "bg-purple-50",
  },
  {
    name: "Beverages",
    img: "https://images.unsplash.com/photo-1527960669566-f882ba85a4ed?q=80&w=200&auto=format&fit=crop",
    count: 65,
    bg: "bg-teal-50",
  },
  {
    name: "Vegetables",
    img: "https://images.unsplash.com/photo-1597362868123-a509f5211d33?q=80&w=200&auto=format&fit=crop",
    count: 72,
    bg: "bg-green-50",
  },
  {
    name: "Bakery",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=200&auto=format&fit=crop",
    count: 34,
    bg: "bg-orange-100",
  },
  {
    name: "Paan Corner",
    img: "https://images.unsplash.com/photo-1596797038558-bc439226cb8e?q=80&w=200&auto=format&fit=crop",
    count: 12,
    bg: "bg-red-50",
  },
];

const products = [
  {
    name: "Amul Taaza Milk (1L)",
    price: "₹66",
    oldPrice: "₹72",
    img: "https://images.unsplash.com/photo-1528750955923-30c722059a4c?q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    tag: "Hot",
    vendor: "Amul",
    discount: "8%",
  },
  {
    name: "Haldiram's Aloo Bhujia",
    price: "₹95",
    oldPrice: "₹110",
    img: "https://images.unsplash.com/photo-1601050690597-96a92ec4e508?q=80&w=400&auto=format&fit=crop",
    rating: 4.5,
    tag: "Sale",
    vendor: "Haldiram",
    discount: "13%",
  },
  {
    name: "Coca-Cola (1.25L)",
    price: "₹65",
    oldPrice: "₹75",
    img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=400&auto=format&fit=crop",
    rating: 4.6,
    tag: "Best",
    vendor: "Coca Cola",
    discount: "13%",
  },
  {
    name: "Britannia Good Day",
    price: "₹20",
    oldPrice: "₹25",
    img: "https://images.unsplash.com/photo-1558961363-fa4fdfc51ecd?q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    vendor: "Britannia",
    discount: "20%",
  },
  {
    name: "Lay's Magic Masala",
    price: "₹20",
    oldPrice: "₹22",
    img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=400&auto=format&fit=crop",
    rating: 4.4,
    vendor: "Lay's",
    discount: "10%",
  },
  {
    name: "Surf Excel Matic",
    price: "₹240",
    oldPrice: "₹280",
    img: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    tag: "Hot",
    vendor: "Unilever",
    discount: "14%",
  },
  {
    name: "Nescafe Classic Jar",
    price: "₹185",
    oldPrice: "₹210",
    img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop",
    rating: 4.8,
    vendor: "Nestle",
    discount: "12%",
  },
  {
    name: "Tata Tea Premium",
    price: "₹310",
    oldPrice: "₹340",
    img: "https://images.unsplash.com/photo-1594142411985-78082f42a78f?q=80&w=400&auto=format&fit=crop",
    rating: 4.7,
    vendor: "Tata Consumer",
    discount: "9%",
  },
  {
    name: "Maggi Masala Pk of 12",
    price: "₹168",
    oldPrice: "₹180",
    img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    tag: "Sale",
    vendor: "Nestle",
    discount: "7%",
  },
  {
    name: "Dettol Liquid Soap",
    price: "₹89",
    oldPrice: "₹99",
    img: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=400&auto=format&fit=crop",
    rating: 4.6,
    vendor: "Reckitt",
    discount: "10%",
  },
];

const dealsOfTheDay = [
  {
    name: "Ariel Matic Liquid",
    price: "₹320",
    oldPrice: "₹380",
    img: "https://images.unsplash.com/photo-1610915641743-34e8e19d77e4?q=80&w=600&auto=format&fit=crop",
    bg: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop",
    vendor: "P&G",
    discount: "15%",
  },
  {
    name: "Dairy Milk Silk",
    price: "₹160",
    oldPrice: "₹180",
    img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600&auto=format&fit=crop",
    bg: "https://images.unsplash.com/photo-1634591942007-88cc10bd0962?q=80&w=1000&auto=format&fit=crop",
    vendor: "Mondelez",
    discount: "11%",
  },
  {
    name: "Dabur Honey (500g)",
    price: "₹210",
    oldPrice: "₹240",
    img: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?q=80&w=600&auto=format&fit=crop",
    bg: "https://images.unsplash.com/photo-1613533816434-2e92ec4e508?q=80&w=1000&auto=format&fit=crop",
    vendor: "Dabur",
    discount: "12%",
  },
  {
    name: "Lizol Floor Cleaner",
    price: "₹345",
    oldPrice: "₹380",
    img: "https://images.unsplash.com/photo-1584622723133-7833788900c1?q=80&w=600&auto=format&fit=crop",
    bg: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
    vendor: "Reckitt",
    discount: "9%",
  },
];

const topSelling = [
  {
    name: "Parle-G Gold",
    price: "₹10",
    oldPrice: "₹12",
    img: "https://images.unsplash.com/photo-1558961363-fa4fdfc51ecd?q=80&w=150&auto=format&fit=crop",
    rating: 4.9,
    vendor: "Parle",
    discount: "16%",
  },
  {
    name: "Saffola Gold (5L)",
    price: "₹845",
    oldPrice: "₹950",
    img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=150&auto=format&fit=crop",
    rating: 4.8,
    vendor: "Marico",
    discount: "11%",
  },
  {
    name: "Fortune Atta (10kg)",
    price: "₹415",
    oldPrice: "₹450",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=150&auto=format&fit=crop",
    rating: 4.7,
    vendor: "Adani Wilmar",
    discount: "8%",
  },
];

const trending = [
  {
    name: "Dark Fantasy Choco",
    price: "₹35",
    oldPrice: "₹45",
    img: "https://images.unsplash.com/photo-1558961363-fa4fdfc51ecd?q=80&w=150&auto=format&fit=crop",
    rating: 4.8,
    vendor: "ITC",
    discount: "22%",
  },
  {
    name: "Kissan Ketchup",
    price: "₹120",
    oldPrice: "₹140",
    img: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?q=80&w=150&auto=format&fit=crop",
    rating: 4.6,
    vendor: "HUL",
    discount: "14%",
  },
  {
    name: "Red Label Tea",
    price: "₹480",
    oldPrice: "₹520",
    img: "https://images.unsplash.com/photo-1594142411985-78082f42a78f?q=80&w=150&auto=format&fit=crop",
    rating: 4.7,
    vendor: "HUL",
    discount: "8%",
  },
];

const recentlyAdded = [
  {
    name: "Lindt Dark Chocolate",
    price: "₹245",
    oldPrice: "₹295",
    img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=150&auto=format&fit=crop",
    rating: 4.9,
    vendor: "Lindt",
    discount: "17%",
  },
  {
    name: "Epigamia Yogurt",
    price: "₹45",
    oldPrice: "₹50",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=150&auto=format&fit=crop",
    rating: 4.7,
    vendor: "Drums Food",
    discount: "10%",
  },
  {
    name: "Hershey's Syrup",
    price: "₹185",
    oldPrice: "₹210",
    img: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?q=80&w=150&auto=format&fit=crop",
    rating: 4.8,
    vendor: "Hershey's",
    discount: "12%",
  },
];

const topRated = [
  {
    name: "Daawat Rozana Rice",
    price: "₹385",
    oldPrice: "₹450",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=150&auto=format&fit=crop",
    rating: 5.0,
    vendor: "Daawat",
    discount: "14%",
  },
  {
    name: "Everest Masala",
    price: "₹65",
    oldPrice: "₹75",
    img: "https://images.unsplash.com/photo-1596797038558-bc439226cb8e?q=80&w=150&auto=format&fit=crop",
    rating: 4.9,
    vendor: "Everest",
    discount: "13%",
  },
  {
    name: "Cadbury Bournvita",
    price: "₹210",
    oldPrice: "₹230",
    img: "https://images.unsplash.com/photo-1550963295-019dfc40c81e?q=80&w=150&auto=format&fit=crop",
    rating: 4.9,
    vendor: "Mondelez",
    discount: "9%",
  },
];

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* --- Hero Slider --- */}
        <section
          className="bg-blue-50 rounded-3xl overflow-hidden relative h-[420px] flex items-center px-8 md:px-16 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=2574&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-blue-50/40 to-transparent"></div>
          <div className="relative z-10 max-w-xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              Instant Delivery at your doorstep
            </h1>
            <p className="text-gray-500 text-lg md:text-xl tracking-wide max-w-md">
              Get groceries, electronics, and essentials delivered in 10
              minutes.
            </p>
            <div className="bg-white rounded-full p-2 flex max-w-md shadow-md border border-gray-100">
              <input
                type="text"
                placeholder="Search for essentials..."
                className="flex-1 px-4 outline-none text-gray-600 bg-transparent"
              />
              <button className="bg-green-600 text-white rounded-full px-6 md:px-8 py-3 font-bold hover:bg-green-700 transition">
                Order Now
              </button>
            </div>
          </div>
        </section>

        {/* --- Featured Categories --- */}
        <section>
          <div className="flex items-center gap-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Categories
            </h2>
            <div className="flex gap-4 text-sm font-semibold text-gray-600">
              <span className="cursor-pointer hover:text-green-600">
                Cake & Milk
              </span>
              <span className="cursor-pointer hover:text-green-600">
                Coffees & Teas
              </span>
              <span className="cursor-pointer hover:text-green-600">
                Pet Foods
              </span>
              <span className="cursor-pointer hover:text-green-600">
                Vegetables
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`${cat.bg} hover:shadow-lg transition-shadow border rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer group`}
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <h6 className="font-bold text-gray-700 text-sm">{cat.name}</h6>
                <p className="text-[14px] text-gray-400">{cat.count} items</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Banners --- */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-amber-100 rounded-2xl p-8 relative overflow-hidden h-64 flex items-center group cursor-pointer shadow-sm hover:shadow-md transition">
            <div className="relative z-10 max-w-[180px]">
              <h4 className="font-bold text-xl mb-4 text-gray-800 leading-tight">
                Premium Fresh Quality Products
              </h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                Shop Now <FiArrowRight />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1628102422295-a461c3605658?q=80&w=400&auto=format&fit=crop"
                alt="fruits"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="bg-pink-100 rounded-2xl p-8 relative overflow-hidden h-64 flex items-center group cursor-pointer shadow-sm hover:shadow-md transition">
            <div className="relative z-10 max-w-[180px]">
              <h4 className="font-bold text-xl mb-4 text-gray-800 leading-tight">
                Healthy Breakfast & Instant Tea
              </h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                Shop Now <FiArrowRight />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=400&auto=format&fit=crop"
                alt="breakfast"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="bg-blue-100 rounded-2xl p-8 relative overflow-hidden h-64 flex items-center group cursor-pointer shadow-sm hover:shadow-md transition">
            <div className="relative z-10 max-w-[180px]">
              <h4 className="font-bold text-xl mb-4 text-gray-800 leading-tight">
                The Best Grocery Deals Online
              </h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                Shop Now <FiArrowRight />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop"
                alt="vegetables"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* --- Popular Products --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Popular Products
            </h2>
            <div className="flex gap-4 text-sm font-semibold text-gray-600 hidden md:flex">
              <span className="text-green-600 underline">All</span>
              <span>Milks & Dairies</span>
              <span>Coffees & Teas</span>
              <span>Pet Foods</span>
              <span>Meats</span>
              <span>Vegetables</span>
              <span>Fruits</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((prod, idx) => (
              <div
                key={idx}
                className="bg-white border hover:shadow-xl hover:border-green-300 transition-all rounded-2xl p-4 relative group"
              >
                {prod.tag && (
                  <span
                    className={`absolute top-0 left-0 text-white text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10 ${prod.tag === "Hot" ? "bg-pink-500" : prod.tag === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
                  >
                    {prod.tag}
                  </span>
                )}
                <div className="h-40 flex items-center justify-center text-9xl group-hover:scale-105 transition-transform cursor-pointer overflow-hidden p-4">
                  <img
                    src={prod.img}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-gray-400 mb-2">Snack</div>
                <h3 className="font-bold text-gray-700 text-sm mb-1 leading-snug cursor-pointer hover:text-green-600">
                  {prod.name}
                </h3>
                <div className="flex mb-2 text-yellow-400 text-xs">
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
                  <span className="text-gray-400 ml-2">({prod.rating})</span>
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  By{" "}
                  <span className="text-green-600 font-bold">
                    {prod.vendor}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold text-lg">
                        {prod.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs line-through">
                        {prod.oldPrice}
                      </span>
                      <span className="text-green-600 text-xs font-bold">
                        ({prod.discount})
                      </span>
                    </div>
                  </div>
                  <button className="bg-green-100 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg transition-colors font-bold text-xs flex items-center gap-2">
                    Add <FiShoppingCart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Daily Best Sells --- */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                Daily Best Sells
              </h2>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition shadow-sm border">
                  <FiArrowRight className="rotate-180" />
                </button>
                <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition shadow-sm border">
                  <FiArrowRight />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-600">
              <span className="text-green-600 cursor-pointer">All</span>
              <span className="hover:text-green-600 cursor-pointer">
                Deals Of the Day
              </span>
              <span className="hover:text-green-600 cursor-pointer transition">
                Beauty
              </span>
              <span className="hover:text-green-600 cursor-pointer transition">
                Bread & Juice
              </span>
              <span className="hover:text-green-600 cursor-pointer transition">
                Drinks
              </span>
              <span className="hover:text-green-600 cursor-pointer transition">
                Milks
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Banner */}
            <div
              className="lg:w-1/4 h-[520px] bg-cover bg-center rounded-2xl p-10 flex flex-col justify-start relative overflow-hidden shadow-md border"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop')",
              }}
            >
              <div className="relative z-10">
                <h3 className="text-white text-5xl font-extrabold mb-10 leading-tight">
                  Premium Products Best Quality
                </h3>
                <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 w-fit hover:bg-green-700 transition shadow-lg">
                  Order Now <FiArrowRight className="text-sm" />
                </button>
              </div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Cards Grid */}
            <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Daawat Basmati Rice (5kg)",
                  price: "₹450",
                  old: "₹520",
                  img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop",
                  cat: "Staples",
                  sold: 108,
                  total: 387,
                  badge: "13%",
                  badgeColor: "bg-green-400",
                },
                {
                  name: "Happilo Premium Almonds",
                  price: "₹180",
                  old: "₹210",
                  img: "https://images.unsplash.com/photo-1508061214226-826a7be7870a?q=80&w=400&auto=format&fit=crop",
                  cat: "Dry Fruits",
                  sold: 82,
                  total: 83,
                  badge: "15%",
                  badgeColor: "bg-red-400",
                  extraBadge: "New",
                  extraColor: "bg-green-400",
                },
                {
                  name: "Fresh Whole Chicken (1kg)",
                  price: "₹240",
                  old: "₹280",
                  img: "https://images.unsplash.com/photo-1604544215162-44af3e09880c?q=80&w=400&auto=format&fit=crop",
                  cat: "Meat",
                  sold: 60,
                  total: 80,
                  badge: "10%",
                  badgeColor: "bg-green-400",
                },
                {
                  name: "Dabur Organic Honey",
                  price: "₹165",
                  old: "₹190",
                  img: "https://images.unsplash.com/photo-14713330bcc21-50394c4422e4?q=80&w=400&auto=format&fit=crop",
                  cat: "Groceries",
                  sold: 102,
                  total: 262,
                  badge: "12%",
                  badgeColor: "bg-green-400",
                  extraBadge: "Hot",
                  extraColor: "bg-green-400",
                },
              ].map((prod, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-2xl p-6 relative group hover:shadow-xl transition-all h-full flex flex-col"
                >
                  {/* Badges */}
                  <div className="absolute top-0 left-0 flex flex-col">
                    <span
                      className={`${prod.badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-tl-2xl rounded-br-2xl shadow-sm`}
                    >
                      {prod.badge}
                    </span>
                    {prod.extraBadge && (
                      <span
                        className={`${prod.extraColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-tl-2xl rounded-br-2xl mt-1 shadow-sm`}
                      >
                        {prod.extraBadge}
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <div className="h-48 flex items-center justify-center text-9xl mb-6 group-hover:scale-105 transition-transform overflow-hidden p-6">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-wider">
                      {prod.cat}
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 hover:text-green-600 cursor-pointer leading-tight">
                      {prod.name}
                    </h4>

                    {/* Rating placeholder */}
                    <div className="flex gap-0.5 text-yellow-400 text-[10px] mb-4">
                      <FiStar className="fill-current" />{" "}
                      <FiStar className="fill-current" />{" "}
                      <FiStar className="fill-current" />{" "}
                      <FiStar className="fill-current" />{" "}
                      <FiStar className="text-gray-200" />
                      <span className="text-gray-400 ml-1">(4)</span>
                    </div>

                    <div className="text-[10px] text-gray-400 mb-2">
                      By{" "}
                      <span className="text-green-600 font-bold">
                        {prod.vendor || "Quickzy"}
                      </span>
                    </div>

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-green-600 font-bold text-xl leading-none">
                        {prod.price}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-[10px] font-bold line-through">
                          {prod.old}
                        </span>
                        <span className="text-green-600 text-[10px] font-bold">
                          ({prod.badge})
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-3 text-xs">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${(prod.sold / prod.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-gray-700 font-bold">
                        Sold:{" "}
                        <span className="text-gray-400">
                          {prod.sold} / {prod.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md">
                    <FiShoppingCart className="text-sm" /> Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Deals of The Day --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Deals Of The Day
            </h2>
            <a
              href="#"
              className="text-gray-500 text-sm hover:text-green-600 flex items-center gap-1"
            >
              All Deals <FiArrowRight />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealsOfTheDay.map((deal, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Background Image / Placeholder */}
                <div
                  className="h-85 bg-cover bg-center transition-transform group-hover:scale-105 duration-700"
                  style={{
                    backgroundImage: `url('${deal.bg}')`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                </div>
                {/* Content Overlay/Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
                  <h4 className="font-bold text-gray-800 text-sm mb-2 truncate">
                    {deal.name}
                  </h4>
                  <div className="flex gap-2 mb-3 justify-center">
                    <div className="bg-yellow-100 rounded p-1 text-center min-w-[32px]">
                      <span className="block font-bold text-green-600 text-xs">
                        02
                      </span>
                      <span className="text-[10px] text-gray-500">Days</span>
                    </div>
                    <div className="bg-yellow-100 rounded p-1 text-center min-w-[32px]">
                      <span className="block font-bold text-green-600 text-xs">
                        22
                      </span>
                      <span className="text-[10px] text-gray-500">Hrs</span>
                    </div>
                    <div className="bg-yellow-100 rounded p-1 text-center min-w-[32px]">
                      <span className="block font-bold text-green-600 text-xs">
                        18
                      </span>
                      <span className="text-[10px] text-gray-500">Min</span>
                    </div>
                    <div className="bg-yellow-100 rounded p-1 text-center min-w-[32px]">
                      <span className="block font-bold text-green-600 text-xs">
                        04
                      </span>
                      <span className="text-[10px] text-gray-500">Sec</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    By{" "}
                    <span className="text-green-600 font-bold">
                      {deal.vendor}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white">
                    <div className="flex flex-col">
                      <span className="text-green-600 font-bold text-lg leading-tight">
                        {deal.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs line-through">
                          {deal.oldPrice}
                        </span>
                        <span className="text-green-600 text-xs font-bold">
                          ({deal.discount})
                        </span>
                      </div>
                    </div>
                    <button className="bg-green-100 text-green-600 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-md transition-colors font-bold text-xs flex items-center gap-1">
                      Add <FiShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Top Selling / Trending / Recently / Top Rated --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Top Selling */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400">
              Top Selling
            </h3>
            <div className="space-y-6">
              {topSelling.map((prod, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-sm mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="flex text-yellow-400 text-[10px] mb-1">
                      {[...Array(5)].map((_, j) => (
                        <FiStar
                          key={j}
                          className={
                            j < Math.floor(prod.rating)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-gray-400 mb-1">
                      By{" "}
                      <span className="text-green-600 font-bold">
                        {prod.vendor}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 font-bold text-sm">
                        {prod.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[10px] line-through">
                          {prod.oldPrice}
                        </span>
                        <span className="text-green-600 text-[10px] font-bold">
                          ({prod.discount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Trending Products */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400">
              Trending Products
            </h3>
            <div className="space-y-6">
              {trending.map((prod, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-sm mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="flex text-yellow-400 text-[10px] mb-1">
                      {[...Array(5)].map((_, j) => (
                        <FiStar
                          key={j}
                          className={
                            j < Math.floor(prod.rating)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-gray-400 mb-1">
                      By{" "}
                      <span className="text-green-600 font-bold">
                        {prod.vendor}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 font-bold text-sm">
                        {prod.price}
                      </span>
                      <span className="text-gray-400 text-xs line-through ml-2">
                        {prod.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Recently Added */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400">
              Recently added
            </h3>
            <div className="space-y-6">
              {recentlyAdded.map((prod, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-sm mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="flex text-yellow-400 text-[10px] mb-1">
                      {[...Array(5)].map((_, j) => (
                        <FiStar
                          key={j}
                          className={
                            j < Math.floor(prod.rating)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-gray-400 mb-1">
                      By{" "}
                      <span className="text-green-600 font-bold">
                        {prod.vendor}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 font-bold text-sm">
                        {prod.price}
                      </span>
                      <span className="text-gray-400 text-xs line-through ml-2">
                        {prod.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Top Rated */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400">
              Top Rated
            </h3>
            <div className="space-y-6">
              {topRated.map((prod, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-sm mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="flex text-yellow-400 text-[10px] mb-1">
                      {[...Array(5)].map((_, j) => (
                        <FiStar
                          key={j}
                          className={
                            j < Math.floor(prod.rating)
                              ? "fill-current"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-gray-400 mb-1">
                      By{" "}
                      <span className="text-green-600 font-bold">
                        {prod.vendor}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 font-bold text-sm">
                        {prod.price}
                      </span>
                      <span className="text-gray-400 text-xs line-through ml-2">
                        {prod.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Footer Top --- */}
        <div className="bg-green-100 rounded-3xl p-10 md:p-14 mt-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
            <div className="max-w-4xl">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                Stay home & get your daily <br /> needs from our shop
              </h2>
              <p className="text-gray-500 mb-8">
                Start Your Daily Shopping with{" "}
                <span className="text-green-600">Quickzy</span>
              </p>
              <div className="bg-white rounded-full p-2 flex max-w-sm">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 outline-none text-gray-600"
                />
                <button className="bg-green-600 text-white rounded-full px-8 py-3 font-semibold hover:bg-green-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="w-130 absolute right-10 bottom-0">
            <img
              src="footer_banner.png"
              alt="Delivery"
              className="w-full mix-blend-multiply"
            />
          </div>
        </div>
      </main>

      {/* Footer Features */}
      <footer className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10 pb-8 border-b">
          {[
            { title: "Best prices & offers", img: "best_price.png" },
            { title: "Free delivery", img: "free_delivery.png" },
            { title: "Great daily deal", img: "great_deals.png" },
            { title: "Wide assortment", img: "wide_asortments.png" },
            { title: "Easy returns", img: "easy_returns.png" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg p-6 flex items-center gap-4 text-sm font-bold text-gray-700 hover:shadow-md transition shadow-sm"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-12 h-12 object-contain"
              />
              <span>{item.title}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-sm text-gray-500 pb-8 border-b">
          {/* Logo & Contact */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌿</span>
              <div>
                <span className="text-2xl font-bold text-green-600 leading-none block">
                  Quickzy
                </span>
                <span className="text-[10px] text-gray-400 block">
                  Quick Commerce & Instant Delivery
                </span>
              </div>
            </div>
            <p className="mb-4">
              Instant delivery of electronics, groceries & more.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2 items-start">
                <FiMapPin className="text-green-600 mt-1 shrink-0" />{" "}
                <span>
                  <strong>Address:</strong> 124, Phase III, Udyog Vihar, Sector
                  19, Gurgaon, Haryana 122016
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <FiPhoneCall className="text-green-600 shrink-0" />{" "}
                <span>
                  <strong>Call Us:</strong> +91 1800-QUICKZY
                </span>
              </li>
              <li className="fi-mail flex gap-2 items-center">
                <FiMail className="text-green-600 shrink-0" />{" "}
                <span>
                  <strong>Email:</strong> support@quickzy.com
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <FiClock className="text-green-600 shrink-0" />{" "}
                <span>
                  <strong>Hours:</strong> 24/7 Delivery Available
                </span>
              </li>
            </ul>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-lg text-gray-800 mb-4">Company</h4>
            <ul className="space-y-2 cursor-pointer">
              <li>About Us</li>
              <li>Delivery Information</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Contact Us</li>
              <li>Support Center</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800 mb-4">Account</h4>
            <ul className="space-y-2 cursor-pointer">
              <li>Sign In</li>
              <li>View Cart</li>
              <li>My Wishlist</li>
              <li>Track My Order</li>
              <li>Help Ticket</li>
              <li>Shipping Details</li>
              <li>Compare products</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800 mb-4">Corporate</h4>
            <ul className="space-y-2 cursor-pointer">
              <li>Become a Vendor</li>
              <li>Affiliate Program</li>
              <li>Farm Business</li>
              <li>Farm Careers</li>
              <li>Our Suppliers</li>
              <li>Accessibility</li>
              <li>Promotions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800 mb-4">Popular</h4>
            <ul className="space-y-2 cursor-pointer">
              <li>Milk & Flavoured Milk</li>
              <li>Butter and Margarine</li>
              <li>Eggs Substitutes</li>
              <li>Marmalades</li>
              <li>Sour Cream and Dips</li>
              <li>Tea & Kombucha</li>
              <li>Cheese</li>
            </ul>
          </div>

          {/* Install App */}
          <div>
            <h4 className="font-bold text-lg text-gray-800 mb-4">
              Install App
            </h4>
            <p className="mb-4">From App Store or Google Play</p>
            <div className="flex gap-2 mb-6 rounded-lg">
              <div className="w-30 h-15 ">
                <img
                  src="appstore.png"
                  alt="appstore"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-30 h-15 rounded-lg ">
                <img
                  src="playstore.png"
                  alt="playstore"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="mb-4">Secured Payment Gateways</p>
            <div className="flex gap-2 text-3xl text-gray-600">
              <img
                src="visa.png"
                alt="visa, mastercard, amex, discover"
                className="hover:text-blue-900 transition"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            © 2026, <strong className="text-green-600">Quickzy</strong> -
            Instant Delivery Platform. All rights reserved
          </div>
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-3">
              <FiPhoneCall className="text-3xl text-gray-500" />
              <div>
                <div className="text-green-600 text-xl font-bold">
                  1800-419-0000
                </div>
                <div className="text-[10px]">Working 8:00 - 22:00</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhoneCall className="text-3xl text-gray-500" />
              <div>
                <div className="text-green-600 text-xl font-bold">
                  1800-419-1111
                </div>
                <div className="text-[10px]">24/7 Support Center</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-gray-800 mr-2">Follow Us</span>
            <div className="bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 transition">
              <FaFacebookF />
            </div>
            <div className="bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 transition">
              <FaTwitter />
            </div>
            <div className="bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 transition">
              <FaInstagram />
            </div>
            <div className="bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 transition">
              <FaPinterest />
            </div>
            <div className="bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700 transition">
              <FaYoutube />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
