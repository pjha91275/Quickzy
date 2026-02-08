"use client";
import React from "react";
import { FiArrowRight, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { allProducts as products } from "@/data/products";

const categories = [
  {
    name: "Milk & Dairy",
    img: "https://www.jiomart.com/images/product/original/494271401/heritage-golden-cow-milk-1-l-pouch-product-images-o494271401-p610079697-0-202410071813.jpg?im=Resize=(420,420)",
    count: 5,
    bg: "bg-blue-50",
  },
  {
    name: "Fruits",
    img: "https://m.media-amazon.com/images/I/51fWm14UXiL._AC_UL640_FMwebp_QL65_.jpg",
    count: 5,
    bg: "bg-orange-50",
  },
  {
    name: "Tea & Coffee",
    img: "https://m.media-amazon.com/images/I/41O76L+6oDL._SY300_SX300_QL70_FMwebp_.jpg",
    count: 3,
    bg: "bg-amber-50",
  },
  {
    name: "Snacks",
    img: "https://m.media-amazon.com/images/I/41VxPV-rWsL._SY300_SX300_QL70_FMwebp_.jpg",
    count: 6,
    bg: "bg-yellow-50",
  },
  {
    name: "Personal Care",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ0W4YGyIeHyvdg7KaIXIzHbTxcVT4nwviIH2JrzF0nDK26Ope46NqSr5c_2GsGAAvWnjp2-e5QrNNWoVVTGix1xBYUZzs991zfyghM9kwJiXCnMB-ojsimEg",
    count: 3,
    bg: "bg-pink-50",
  },
  {
    name: "Cleaning Essentials",
    img: "https://m.media-amazon.com/images/I/616ZqasKGuL.jpg",
    count: 5,
    bg: "bg-purple-50",
  },
  {
    name: "Beverages",
    img: "https://www.bigbasket.com/media/uploads/p/l/251023_11-coca-cola-soft-drink.jpg",
    count: 4,
    bg: "bg-teal-50",
  },
  {
    name: "Vegetables",
    img: "https://www.bigbasket.com/media/uploads/p/l/10000069_20-capsicum-green.jpg",
    count: 5,
    bg: "bg-green-50",
  },
  {
    name: "Electronics",
    img: "https://m.media-amazon.com/images/I/61S9aVnRZDL.jpg",
    count: 6,
    bg: "bg-orange-100",
  },
  {
    name: "Stationery",
    img: "https://www.bigbasket.com/media/uploads/p/l/1212080_1-classmate-notebook-a4-ruled.jpg",
    count: 3,
    bg: "bg-red-50",
  },
];

// Product lists are now derived from the main 'products' import
const dealsOfTheDay = products.slice(0, 4);
const topSelling = products.slice(4, 7);
const trending = products.slice(7, 10);
const recentlyAdded = products.slice(10, 13);
const topRated = products.slice(13, 16);

// Utility for randomizing product display
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [shuffledProducts, setShuffledProducts] = React.useState(products);
  const [shuffledDeals, setShuffledDeals] = React.useState(dealsOfTheDay);
  const [shuffledTopSelling, setShuffledTopSelling] =
    React.useState(topSelling);
  const [shuffledTrending, setShuffledTrending] = React.useState(trending);
  const [shuffledRecentlyAdded, setShuffledRecentlyAdded] =
    React.useState(recentlyAdded);
  const [shuffledTopRated, setShuffledTopRated] = React.useState(topRated);

  React.useEffect(() => {
    // Only shuffle on the client after mounting
    setShuffledProducts(shuffleArray(products));
    setShuffledDeals(shuffleArray(dealsOfTheDay));
    setShuffledTopSelling(shuffleArray(topSelling));
    setShuffledTrending(shuffleArray(trending));
    setShuffledRecentlyAdded(shuffleArray(recentlyAdded));
    setShuffledTopRated(shuffleArray(topRated));
  }, []);

  return (
    <>
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* --- Hero Slider --- */}
        <section className="bg-[#DEF9EC] rounded-3xl overflow-hidden relative h-[420px] flex items-center px-8 md:px-16">
          {/* Custom refined background with subtle logo pattern */}
          <div className="absolute inset-0 bg-[#DEF9EC]">
            <div className="absolute inset-0 opacity-5 rotate-12 flex flex-wrap gap-20 p-10 pointer-events-none select-none grayscale contrast-200">
              {Array(10)
                .fill()
                .map((_, i) => (
                  <img
                    key={i}
                    src="/hero-banner.png"
                    className="w-48 h-48"
                    alt=""
                  />
                ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#DEF9EC] via-[#DEF9EC]/40 to-transparent"></div>

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#253D4E] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm mb-4">
              <img src="/logo.png" className="w-4 h-4" alt="" />
              Quickzy: Fresh. Fast. Delivered.
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#253D4E] leading-[1.1]">
              Fresh Grocery <br />
              <span className="text-[#3BB77E]">Delivered in 10 Mins</span>
            </h1>
            <p className="text-gray-500 font-bold text-lg md:text-xl">
              Save up to 50% on your first order
            </p>
            <div className="bg-white rounded-full p-2 flex max-w-md shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all">
              <input
                type="text"
                placeholder="Search for essentials..."
                className="flex-1 px-5 outline-none text-gray-700 bg-transparent font-medium"
              />
              <button className="bg-[#3BB77E] text-white rounded-full px-8 md:px-10 py-3.5 font-black hover:bg-[#29A56C] transition shadow-lg hover:shadow-[#3BB77E]/30">
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
                Electronics
              </span>
              <span className="cursor-pointer hover:text-green-600">
                Dairies
              </span>
              <span className="cursor-pointer hover:text-green-600">
                Bakery
              </span>
              <span className="cursor-pointer hover:text-green-600">
                Snacks
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
                <h6 className="font-bold text-gray-700 text-sm whitespace-nowrap">
                  {cat.name}
                </h6>
                <p className="text-[12px] text-gray-400">{cat.count} items</p>
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
                src="https://m.media-amazon.com/images/I/51fWm14UXiL._AC_UL640_FMwebp_QL65_.jpg"
                alt="fruits"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="bg-pink-100 rounded-2xl p-8 relative overflow-hidden h-64 flex items-center group cursor-pointer shadow-sm hover:shadow-md transition">
            <div className="relative z-10 max-w-[180px]">
              <h4 className="font-bold text-xl mb-4 text-gray-800 leading-tight">
                Latest Gadgets & Hearables
              </h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                Shop Now <FiArrowRight />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img
                src="https://m.media-amazon.com/images/I/313U7Xx9b4L._SY300_SX300_QL70_FMwebp_.jpg"
                alt="earphones"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="bg-blue-100 rounded-2xl p-8 relative overflow-hidden h-64 flex items-center group cursor-pointer shadow-sm hover:shadow-md transition">
            <div className="relative z-10 max-w-[180px]">
              <h4 className="font-bold text-xl mb-4 text-gray-800 leading-tight">
                Daily Household Essentials
              </h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                Shop Now <FiArrowRight />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img
                src="https://m.media-amazon.com/images/I/616ZqasKGuL.jpg"
                alt="cleaning"
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
              <span>Electronics</span>
              <span>Dairies</span>
              <span>Personal Care</span>
              <span>Snacks</span>
              <span>Stationery</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {shuffledProducts.map((prod, idx) => (
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
                <Link href={`/product/${prod.id}`} className="block">
                  <div className="h-40 flex items-center justify-center group-hover:scale-105 transition-transform cursor-pointer overflow-hidden p-4">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-wider">
                    {prod.category}
                  </div>
                  <h3 className="font-bold text-gray-700 text-[14px] mb-1 leading-snug cursor-pointer hover:text-green-600 h-10 line-clamp-2">
                    {prod.name}
                  </h3>
                  <div className="flex mb-2">
                    <span className="text-[11px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                      {prod.unit || "Unit"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    By{" "}
                    <span className="text-green-600 font-bold">
                      {prod.vendor}
                    </span>
                  </div>
                </Link>
                <div className="flex justify-between items-center mt-3">
                  <Link href={`/product/${prod.id}`} className="flex flex-col">
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
                  </Link>
                  <button className="bg-green-100 text-green-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg transition-colors font-bold text-xs flex items-center gap-2">
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
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Banner */}
            <div
              className="lg:w-1/4 h-[520px] bg-cover bg-center rounded-2xl p-10 flex flex-col justify-start relative overflow-hidden shadow-md border"
              style={{
                backgroundImage:
                  "url('https://m.media-amazon.com/images/I/413Z3Mfz-hL._SY300_SX300_QL70_FMwebp_.jpg')",
              }}
            >
              <div className="relative z-20">
                <h3 className="text-white text-5xl font-extrabold mb-10 leading-tight">
                  Premium Products Best Quality
                </h3>
                <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 w-fit hover:bg-green-700 transition shadow-lg">
                  Order Now <FiArrowRight className="text-sm" />
                </button>
              </div>
              <div className="absolute inset-0 bg-gray-500/40 z-10"></div>
            </div>

            {/* Cards Grid */}
            <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Fresh Royal Gala Apple",
                  price: "180",
                  old: "220",
                  unit: "1kg",
                  img: "https://www.bigbasket.com/media/uploads/p/l/40033819_9-apple-royal-gala-economy.jpg",
                  cat: "Fruits",
                  sold: 145,
                  total: 200,
                  badge: "18%",
                  badgeColor: "bg-green-400",
                },
                {
                  name: "Fresh Hybrid Tomato",
                  price: "30",
                  old: "40",
                  unit: "1kg",
                  img: "https://www.bigbasket.com/media/uploads/p/l/10000201_15-tomato-hybrid.jpg",
                  cat: "Vegetables",
                  sold: 82,
                  total: 100,
                  badge: "25%",
                  badgeColor: "bg-red-400",
                },
                {
                  name: "Sony WH-CH520 Headlines",
                  price: "3,990",
                  old: "5,990",
                  unit: "1 Pcs",
                  img: "https://m.media-amazon.com/images/I/41PA8xgXx4L._AC_UY436_FMwebp_QL65_.jpg",
                  cat: "Electronics",
                  sold: 60,
                  total: 80,
                  badge: "33%",
                  badgeColor: "bg-green-400",
                },
                {
                  name: "Milton ThermoSteel Flask",
                  price: "845",
                  old: "1,050",
                  unit: "1 Pcs",
                  img: "https://m.media-amazon.com/images/I/41lTfXSregL._SY300_SX300_QL70_FMwebp_.jpg",
                  cat: "Household",
                  sold: 102,
                  total: 262,
                  badge: "19%",
                  badgeColor: "bg-green-400",
                },
              ].map((prod, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-2xl p-6 relative group hover:shadow-xl transition-all h-full flex flex-col"
                >
                  {/* Badges */}
                  <div className="absolute top-0 left-0 flex flex-col z-10">
                    <span
                      className={`${prod.badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-tl-2xl rounded-br-2xl shadow-sm`}
                    >
                      {prod.badge}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="h-48 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform overflow-hidden p-6">
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

                    <div className="flex mb-4">
                      <span className="text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                        {prod.unit || "Unit"}
                      </span>
                    </div>

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-[#3BB77E] font-black text-xl leading-none">
                        ₹{prod.price}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-[10px] font-bold line-through">
                          ₹{prod.old}
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shuffledDeals.map((deal, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border"
              >
                <div
                  className={`h-64 ${deal.bg} transition-transform group-hover:scale-105 duration-700 p-8 flex items-center justify-center`}
                >
                  <img
                    src={deal.img}
                    alt={deal.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 bg-white relative">
                  <h4 className="font-bold text-gray-800 text-sm mb-2 truncate">
                    {deal.name}
                  </h4>
                  <div className="flex gap-2 mb-3">
                    <div className="bg-yellow-100 rounded p-1 text-center flex-1">
                      <span className="block font-bold text-green-600 text-xs text-center">
                        02
                      </span>
                      <span className="text-[10px] text-gray-500 text-center">
                        Days
                      </span>
                    </div>
                    <div className="bg-yellow-100 rounded p-1 text-center flex-1">
                      <span className="block font-bold text-green-600 text-xs text-center">
                        22
                      </span>
                      <span className="text-[10px] text-gray-500 text-center">
                        Hrs
                      </span>
                    </div>
                    <div className="bg-yellow-100 rounded p-1 text-center flex-1">
                      <span className="block font-bold text-green-600 text-xs text-center">
                        18
                      </span>
                      <span className="text-[10px] text-gray-500 text-center">
                        Mins
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-green-600 font-bold text-lg leading-tight">
                        {deal.price}
                      </span>
                      <span className="text-gray-400 text-xs line-through">
                        {deal.oldPrice}
                      </span>
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
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
              Top Selling
            </h3>
            <div className="space-y-6">
              {shuffledTopSelling.map((prod, i) => (
                <div
                  key={i}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-[13px] mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="text-green-600 font-bold text-sm">
                      {prod.price}{" "}
                      <span className="text-gray-300 text-[10px] line-through ml-1">
                        {prod.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
              Trending
            </h3>
            <div className="space-y-6">
              {shuffledTrending.map((prod, i) => (
                <div
                  key={i}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-[13px] mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="text-green-600 font-bold text-sm">
                      {prod.price}{" "}
                      <span className="text-gray-300 text-[10px] line-through ml-1">
                        {prod.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
              Recently added
            </h3>
            <div className="space-y-6">
              {shuffledRecentlyAdded.map((prod, i) => (
                <div
                  key={i}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-[13px] mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="text-green-600 font-bold text-sm">
                      {prod.price}{" "}
                      <span className="text-gray-300 text-[10px] line-through ml-1">
                        {prod.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
              Top Rated
            </h3>
            <div className="space-y-6">
              {shuffledTopRated.map((prod, i) => (
                <div
                  key={i}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-[13px] mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="text-green-600 font-bold text-sm">
                      {prod.price}{" "}
                      <span className="text-gray-300 text-[10px] line-through ml-1">
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
        <div className="bg-[#ECF7F3] rounded-3xl p-10 md:p-14 mt-10 relative overflow-hidden border border-gray-100 shadow-sm min-h-[450px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-right md:bg-right opacity-100"
            style={{
              backgroundImage: "url('/footer-green-white.png')",
            }}
          ></div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-[#253D4E] mb-6 leading-tight">
              Get Everything in <br /> Minutes!
            </h2>
            <p className="text-gray-600 text-lg mb-10 font-bold">
              Start your daily shopping with{" "}
              <span className="text-[#3BB77E]">Quickzy</span>
            </p>
            <div className="bg-white rounded-full p-1.5 flex max-w-md shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 outline-none text-gray-700 bg-transparent font-medium"
              />
              <button className="bg-[#3BB77E] text-white rounded-full px-8 py-3.5 font-bold hover:bg-[#29A56C] transition shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* --- Footer Bar Features --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-10 border-t">
          {[
            {
              title: "Best prices & offers",
              desc: "For all electronic goods",
              img: "🏷️",
            },
            {
              title: "Free delivery",
              desc: "Instant within 10 mins",
              img: "⚡",
            },
            {
              title: "Great daily deal",
              desc: "Save up to 60% daily",
              img: "💰",
            },
            { title: "Wide assortment", desc: "Mega 10k+ Products", img: "🛒" },
            { title: "Easy returns", desc: "Instant Refund Policy", img: "✅" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-green-100"
            >
              <div className="text-3xl">{f.img}</div>
              <div>
                <h5 className="font-bold text-gray-800 text-sm whitespace-nowrap">
                  {f.title}
                </h5>
                <p className="text-gray-400 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
