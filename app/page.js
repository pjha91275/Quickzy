"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { FiArrowRight, FiShoppingCart, FiStar } from "react-icons/fi";

const categories = [
  { name: "Cake & Milk", img: "🍰", count: 14 },
  { name: "Organic Kiwi", img: "🥝", count: 28 },
  { name: "Peach", img: "🍑", count: 14 },
  { name: "Red Apple", img: "🍎", count: 54 },
  { name: "Snack", img: "🍩", count: 56 },
  { name: "Vegetables", img: "🥦", count: 72 },
  { name: "Strawberry", img: "🍓", count: 36 },
  { name: "Black plum", img: "🍇", count: 12 },
  { name: "Custard apple", img: "🍏", count: 34 },
  { name: "Coffee & Tea", img: "☕", count: 89 },
];

const products = [
  { name: "Foster Farms Takeout Crispy Wings", price: "$12.00", oldPrice: "$15.00", img: "🍗", rating: 4.5, tag: "Hot" },
  { name: "Organic Cage-Grade A Large Eggs", price: "$4.00", oldPrice: "$5.50", img: "🥚", rating: 4.0, tag: "Sale" },
  { name: "Haagen-Dazs Caramel Cone Ice Cream", price: "$22.00", oldPrice: "$25.00", img: "🍦", rating: 5.0, tag: "Best" },
  { name: "Gorton's Beer Battered Fish Fillets", price: "$14.00", oldPrice: "$18.00", img: "🐟", rating: 4.2, tag: "Sale" },
  { name: "Seeds of Change Organic Quinoa", price: "$5.00", oldPrice: "$7.00", img: "🌾", rating: 4.7 },
  { name: "Canada Dry Ginger Ale - 2L Bottle", price: "$1.50", oldPrice: "$2.00", img: "🥤", rating: 4.6 },
  { name: "Blue Diamond Almonds Lightly Salted", price: "$9.00", oldPrice: "$11.00", img: "🥜", rating: 4.3 },
  { name: "Chobani Complete Vanilla Greek Yogurt", price: "$3.00", oldPrice: "$4.00", img: "🥣", rating: 4.8 },
  { name: "Encore Seafoods Stuffed Alaskan", price: "$15.00", oldPrice: "$19.00", img: "🦐", rating: 4.1 },
  { name: "Angie's Boomchickapop Sweet & Salty", price: "$3.49", oldPrice: "$4.50", img: "🍿", rating: 4.9 },
];

const dailyBestSells = [
  { name: "Seeds of Change Organic Quinoa", price: "$5.00", oldPrice: "$7.00", img: "🌾", rating: 4.7 },
  { name: "Angie's Boomchickapop Sweet", price: "$3.49", oldPrice: "$4.50", img: "🍿", rating: 4.9 },
  { name: "Foster Farms Takeout Crispy", price: "$12.00", oldPrice: "$15.00", img: "🍗", rating: 4.5 },
  { name: "Blue Diamond Almonds Lightly", price: "$9.00", oldPrice: "$11.00", img: "🥜", rating: 4.3 },
];

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* --- Hero Slider --- */}
        <section className="bg-green-100 rounded-3xl overflow-hidden relative h-[400px] flex items-center px-16 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100/90 to-transparent"></div>
          <div className="relative z-10 max-w-lg space-y-6">
            <h1 className="text-6xl font-bold text-gray-800 leading-tight">Fresh Vegetables <br /> Big discount</h1>
            <p className="text-gray-500 text-xl tracking-wide">Save up to 50% off on your first order</p>
            <div className="bg-white rounded-full p-2 flex max-w-sm shadow-sm">
              <input type="email" placeholder="Your email address" className="flex-1 px-4 outline-none text-gray-600" />
              <button className="bg-green-600 text-white rounded-full px-8 py-3 font-semibold hover:bg-green-700 transition">Subscribe</button>
            </div>
          </div>
        </section>

        {/* --- Featured Categories --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Categories</h2>
            <div className="flex gap-4 text-sm font-semibold text-gray-600">
              <span className="cursor-pointer hover:text-green-600">Cake & Milk</span>
              <span className="cursor-pointer hover:text-green-600">Coffees & Teas</span>
              <span className="cursor-pointer hover:text-green-600">Pet Foods</span>
              <span className="cursor-pointer hover:text-green-600">Vegetables</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white hover:shadow-lg transition-shadow border rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer group">
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.img}</span>
                <h6 className="font-bold text-gray-700 text-xs">{cat.name}</h6>
                <p className="text-[10px] text-gray-400">{cat.count} items</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Banners --- */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-yellow-100 rounded-lg p-8 relative overflow-hidden h-60 flex items-center">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-4 text-gray-800">Everyday Fresh & <br />Clean with Our <br />Products</h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1">Shop Now <FiArrowRight /></button>
            </div>
            <div className="absolute right-0 bottom-0 text-8xl opacity-20">🧅</div>
          </div>
          <div className="bg-pink-100 rounded-lg p-8 relative overflow-hidden h-60 flex items-center">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-4 text-gray-800">Make your Breakfast <br />Healthy and Easy</h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1">Shop Now <FiArrowRight /></button>
            </div>
            <div className="absolute right-0 bottom-0 text-8xl opacity-20">🥛</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-8 relative overflow-hidden h-60 flex items-center">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-4 text-gray-800">The best Organic <br />Products Online</h4>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1">Shop Now <FiArrowRight /></button>
            </div>
            <div className="absolute right-0 bottom-0 text-8xl opacity-20">🥦</div>
          </div>
        </section>

        {/* --- Popular Products --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Popular Products</h2>
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
              <div key={idx} className="bg-white border hover:shadow-xl hover:border-green-300 transition-all rounded-2xl p-4 relative group">
                {prod.tag && <span className={`absolute top-0 left-0 text-white text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10 ${prod.tag === 'Hot' ? 'bg-pink-500' : prod.tag === 'Sale' ? 'bg-blue-400' : 'bg-orange-400'}`}>{prod.tag}</span>}
                <div className="h-40 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform cursor-pointer">{prod.img}</div>
                <div className="text-xs text-gray-400 mb-2">Snack</div>
                <h3 className="font-bold text-gray-700 text-sm mb-1 leading-snug cursor-pointer hover:text-green-600">{prod.name}</h3>
                <div className="flex mb-2 text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.floor(prod.rating) ? "fill-current" : "text-gray-300"} />)}
                  <span className="text-gray-400 ml-2">({prod.rating})</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-green-600 font-bold text-lg">{prod.price}</span>
                    <span className="text-gray-400 text-sm line-through ml-2">{prod.oldPrice}</span>
                  </div>
                  <button className="bg-green-100 text-green-600 hover:bg-green-600 hover:text-white p-2 rounded-md transition-colors font-bold text-xs flex items-center gap-1">Add <FiShoppingCart /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Daily Best Sells --- */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Best Sells</h2>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Banner */}
            <div className="lg:w-1/4 bg-[url('https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=2542&auto=format&fit=crop')] bg-cover bg-center rounded-2xl p-8 flex flex-col justify-start relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6">Bring nature into your home</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1 w-fit hover:bg-green-700 transition">Shop Now <FiArrowRight /></button>
              </div>
            </div>
            {/* Cards */}
            <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {dailyBestSells.map((prod, idx) => (
                <div key={idx} className="bg-white border hover:shadow-lg transition-shadow rounded-2xl p-4">
                  <div className="h-32 flex items-center justify-center text-5xl mb-4">{prod.img}</div>
                  <h4 className="font-bold text-gray-700 text-sm mb-2">{prod.name}</h4>
                  <div className="flex mb-4 text-yellow-400 text-xs">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className={i < Math.floor(prod.rating) ? "fill-current" : "text-gray-300"} />)}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-600 font-bold">{prod.price}</span>
                      <span className="text-gray-400 text-xs line-through ml-2">{prod.oldPrice}</span>
                    </div>
                    <button className="bg-green-600 text-white p-2 rounded text-xs font-bold hover:bg-green-700 w-full ml-4">Add to cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Footer Top --- */}
        <div className="bg-green-50 rounded-3xl p-10 md:p-14 mt-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">Stay home & get your daily <br /> needs from our shop</h2>
              <p className="text-gray-500 mb-8">Start You'r Daily Shopping with <span className="text-green-600">Nest Mart</span></p>
              <div className="bg-white rounded-full p-2 flex max-w-sm">
                <input type="email" placeholder="Your email address" className="flex-1 px-4 outline-none text-gray-600" />
                <button className="bg-green-600 text-white rounded-full px-8 py-3 font-semibold hover:bg-green-700 transition">Subscribe</button>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1583623025817-d180a4795b29?q=80&w=2576&auto=format&fit=crop" alt="Delivery" className="w-80 mix-blend-multiply" />
          </div>
        </div>

      </main>

      {/* Footer Features */}
      <footer className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {["Best prices & offers", "Free delivery", "Great daily deal", "Wide assortment", "Easy returns"].map((item, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 flex items-center justify-center gap-3 text-sm font-semibold text-gray-600">
              <div className="bg-green-200 p-2 rounded-full text-green-700">✓</div>
              {item}
            </div>
          ))}
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between gap-8 text-sm text-gray-500">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌿</span>
              <span className="text-2xl font-bold text-green-600">Nest</span>
            </div>
            <p className="mb-2">Address: 5171 W Campbell Ave</p>
            <p className="mb-2">Call Us: <span className="text-green-600 font-bold">(+91) - 540-025-124553</span></p>
            <p>Email: sale@Nest.com</p>
            <p>Hours: 10:00 - 18:00, Mon - Sat</p>
          </div>
          {/* Simple Footer Links */}
          <div><h4 className="font-bold text-lg text-gray-800 mb-4">Company</h4><ul className="space-y-2"><li>About Us</li><li>Delivery Information</li><li>Privacy Policy</li><li>Terms & Conditions</li></ul></div>
          <div><h4 className="font-bold text-lg text-gray-800 mb-4">Account</h4><ul className="space-y-2"><li>Sign In</li><li>View Cart</li><li>My Wishlist</li><li>Track My Order</li></ul></div>
          <div><h4 className="font-bold text-lg text-gray-800 mb-4">Corporate</h4><ul className="space-y-2"><li>Become a Vendor</li><li>Affiliate Program</li><li>Farm Business</li><li>Farm Careers</li></ul></div>
          <div><h4 className="font-bold text-lg text-gray-800 mb-4">Popular</h4><ul className="space-y-2"><li>Milk & Flavoured Milk</li><li>Butter and Margarine</li><li>Eggs Substitutes</li><li>Marmalades</li></ul></div>
        </div>
      </footer>
    </div>
  );
}
