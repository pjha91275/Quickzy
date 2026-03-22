"use client";
import React from "react";
import {
  FiArrowRight,
  FiShoppingCart,
  FiClock,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiHeart,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "react-toastify";
import { useStore } from "@/context/StoreContext";

// Helper for shuffle
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function HomeContent({ products, categories, banners_db }) {
  // Separate hero and footer banners
  const heroBanners = banners_db?.filter(b => b.type === "hero") || [];
  const footerBanner = banners_db?.find(b => b.type === "footer");
  
  const banners = heroBanners; // For carousel logic

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [animatingHeart, setAnimatingHeart] = React.useState(null);
  
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [activePopularFilter, setActivePopularFilter] = React.useState("All");
  const [bannerSearchTerm, setBannerSearchTerm] = React.useState("");
  const [footerEmail, setFooterEmail] = React.useState("");
  const { storeData, initializeStore } = useStore();
  
  const [dataReady, setDataReady] = React.useState({
    popular: [],
    dailyBest: [],
    deals: [],
    topSelling: [],
    trending: [],
    recentlyAdded: [],
    topPicks: []
  });

  // Integrated ProductCard component that matches shop style on mobile
  const ProductCard = ({ prod, isDailyBest, showProgress }) => (
    <div 
      onClick={() => router.push(`/product/${prod.id_custom || prod.id}`)}
      className={`bg-white border hover:shadow-xl transition-all relative group flex flex-col cursor-pointer ${isDailyBest ? 'rounded-[30px] p-6 h-[500px]' : 'rounded-2xl p-3 md:p-4 hover:border-green-300'}`}
    >
      {prod.tag && (
        <span className={`absolute top-0 left-0 text-white text-[9px] md:text-[10px] font-bold px-3 md:px-4 py-1.5 rounded-br-2xl z-10 ${isDailyBest ? 'rounded-tl-[28px]' : 'rounded-tl-2xl'} ${prod.tagColor || (prod.tag === "Hot" ? "bg-pink-500" : "bg-orange-400")}`}>
          {prod.tag}
        </span>
      )}
      
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = prod._id || prod.id;
          setAnimatingHeart(id);
          toggleWishlist(prod);
          setTimeout(() => setAnimatingHeart(null), 400);
        }}
        className={`absolute top-4 right-4 md:top-5 md:right-5 z-20 p-2 rounded-full transition-all ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop text-red-500" : "text-gray-300 hover:scale-110"}`}
      >
        <FiHeart className={`text-lg md:text-xl ${isInWishlist(prod._id || prod.id) ? "text-red-500 fill-red-500" : ""}`} />
      </button>

      <Link href={`/product/${prod.id_custom || prod.id}`} className={`flex items-center justify-center overflow-hidden mb-1 group-hover:scale-105 transition-transform ${isDailyBest ? 'h-60' : 'h-32 md:h-40'}`}>
        <img src={prod.image || prod.img} alt={prod.name} className="w-full h-full object-contain" />
      </Link>
      <div className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black mb-1">{prod.category}</div>
      <Link href={`/product/${prod.id_custom || prod.id}`} className="grow">
        <h3 className={`font-bold text-[#253D4E] leading-tight hover:text-[#3BB77E] transition-colors line-clamp-2 mb-1 ${isDailyBest ? 'text-base' : 'text-[13px] md:text-sm'}`}>{prod.name}</h3>
      </Link>
      <div className="flex mb-2">
        <span className="text-[9px] md:text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 md:px-3 py-1 rounded-md uppercase">{prod.unit || "Unit"}</span>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
        <div>
          <span className="text-lg md:text-xl font-black text-[#3BB77E]">
            ₹{prod.price}
          </span>
          {prod.oldPrice && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#adadad] text-[10px] md:text-[11px] font-bold relative">
                ₹{prod.oldPrice}
                <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] md:h-[1.5px] bg-[#888]"></span>
              </span>
              <span className="bg-[#FF7F50] text-white text-[8px] md:text-[9px] px-1.5 py-0.5 md:px-2 rounded font-black italic uppercase">
                {prod.discount} OFF
              </span>
            </div>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            addToCart(prod);
          }}
          className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white p-2.5 md:px-4 md:py-2.5 rounded-xl transition-all shadow-sm md:font-black md:text-xs flex items-center justify-center gap-2 shrink-0 relative z-20"
        >
          <span className="hidden md:inline">Add</span>
          <FiShoppingCart size={18} className="md:w-4 md:h-4 w-[18px] h-[18px]" />
        </button>
      </div>
      {showProgress && (
        <div className="mt-4 space-y-1.5 pt-3 border-t border-gray-50">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#3BB77E]" style={{ width: `${(prod.sold / prod.total) * 100}%` }}></div>
          </div>
          <div className="text-gray-400 font-bold flex justify-between text-[11px]">
            <span>Sold: {prod.sold}/{prod.total}</span>
            <span className="text-[#3BB77E]">{(prod.sold/prod.total*100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );

  // Data fetched from Atlas via props

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // 1. DATA INITIALIZATION: Trigger store setup if not already done
  React.useEffect(() => {
    if (products?.length > 0 && categories?.length > 0) {
      initializeStore(products, categories);
    }
  }, [products, categories, initializeStore]);

  // 2. DATA READY SYNC: Map store data to local ready state
  React.useEffect(() => {
    if (!storeData.fullPool?.length) return;

    // Filter logic for popular section (dynamic)
    let rawPopular = [];
    if (activePopularFilter === "All") {
      rawPopular = storeData.popular_all;
    } else {
      const target = activePopularFilter.toLowerCase();
      rawPopular = storeData.fullPool.filter(p => {
        const pCat = (p.category || "").toLowerCase();
        return pCat === target || target.includes(pCat) || pCat.includes(target);
      }).slice(0, 15);
    }

    setDataReady({
      popular: rawPopular,
      dailyBest: storeData.dailyBest,
      deals: storeData.deals,
      topSelling: storeData.topSelling,
      trending: storeData.trending,
      recentlyAdded: storeData.recentlyAdded,
      topPicks: storeData.topPicks
    });
  }, [storeData, activePopularFilter]);

  const handleBannerSearch = () => {
    const term = bannerSearchTerm.trim().toLowerCase();
    if (!term) return (window.location.href = banners[currentSlide].shopLink);
    
    const catMatch = categories.find(c => c.name.toLowerCase() === term);
    if (catMatch) return (window.location.href = `/shop?category=${encodeURIComponent(catMatch.name)}`);

    const prod = products.find(p => p.name.toLowerCase().includes(term));
    if (prod) return (window.location.href = `/product/${prod.id_custom || prod._id}`);
    
    window.location.href = `/shop?search=${encodeURIComponent(bannerSearchTerm)}`;
  };

  const handleFooterLogin = () => {
    if (!footerEmail) return toast.warning("Please enter your email!");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(footerEmail)) return toast.error("Invalid email address!");
    
    localStorage.setItem("quickzy-login-email", footerEmail);
    window.dispatchEvent(new CustomEvent("open-auth", { detail: { step: 2 } }));
  };

  const router = useRouter();

  const ProductList = ({ title, items }) => (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
        {title}
      </h3>
      <div className="space-y-6">
        {items.map(prod => (
          <div 
            key={prod._id || prod.id} 
            onClick={() => router.push(`/product/${prod.id_custom || prod.id}`)}
            className="flex gap-4 group items-center relative cursor-pointer"
          >
            <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0 relative">
              <img src={prod.image || prod.img} alt={prod.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
              {prod.tag && (
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-lg z-10">
                  <span className="absolute top-[8px] left-[-22px] w-[85px] bg-[#f74b81] text-white text-[7px] font-black py-0.5 text-center -rotate-45 shadow-sm uppercase italic">
                    {prod.tag}
                  </span>
                </div>
              )}
            </div>
              <div className="flex-grow">
              <Link href={`/product/${prod.id_custom || prod.id}`}>
                <h5 className="font-bold text-gray-700 text-[13px] group-hover:text-[#3BB77E] transition-colors line-clamp-2 leading-tight mb-1">{prod.name}</h5>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-[#3BB77E] font-black text-sm leading-none">₹{prod.price}</span>
                {prod.oldPrice && (
                  <span className="text-[#adadad] text-[10px] font-bold relative">
                    ₹{prod.oldPrice}
                    <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] bg-[#888]"></span>
                  </span>
                )}
              </div>
              {prod.discount && (
                <div className="mt-1">
                  <span className="bg-[#FF7F50] text-white text-[9px] px-1.5 py-0.5 rounded font-black italic uppercase inline-block">
                    {prod.discount} OFF
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end justify-between h-full py-1">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const id = prod._id || prod.id;
                  setAnimatingHeart(id);
                  toggleWishlist(prod);
                  setTimeout(() => setAnimatingHeart(null), 400);
                }}
                className={`p-1 hover:bg-red-50 rounded-full transition-all ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop" : ""}`}
              >
                <FiHeart className={`text-sm ${isInWishlist(prod._id || prod.id) ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(prod);
                }}
                className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-2.5 py-1.5 rounded-lg transition-all font-black text-[10px] flex items-center gap-1 shadow-sm mt-1"
              >
                Add <FiShoppingCart />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Banner */}
      <section onClick={() => (window.location.href = banners[currentSlide].shopLink)} className={`rounded-3xl overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md group transition-colors duration-700`}>
        {/* Mobile: Full background image with text overlay */}
        <div className="md:hidden relative h-[250px] sm:h-[320px] w-full">
          <img src={banners[currentSlide].image} className="absolute inset-0 w-full h-full object-cover" alt="" />
          {/* Specific overlays for brightness control: Hero 1 & 5 (2%), Hero 2-4 (1%) */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${[1, 2, 3].includes(currentSlide) ? 'bg-black/[0.01]' : 'bg-black/[0.02]'}`} />
          <div className={`relative z-20 h-full flex flex-col px-5 ${currentSlide === 0 ? 'justify-between pt-10 pb-9' : 'justify-start pt-6 pb-12'}`}>
            <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-[#253D4E] px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm w-max shrink-0">
              <img src="/logo.png" className="w-3.5 h-3.5" alt="" />{banners[currentSlide].tag}
            </div>
            
            {/* 1st Banner: Minimal with spacing, Others: Balanced large text (reduced from 4xl to 1.95rem) */}
            {currentSlide !== 0 ? (
              <div className="mt-3 space-y-2">
                <h1 className="text-[1.95rem] font-black text-white leading-tight text-shadow-strong pr-2 transition-all duration-500" dangerouslySetInnerHTML={{ __html: banners[currentSlide].title }}></h1>
                <p className="text-white font-bold text-base text-shadow-medium transition-all duration-500">{banners[currentSlide].subtitle}</p>
              </div>
            ) : (
              <div className="flex-1" /> // Spacer for Slide 1 to push search bar to bottom
            )}

            <div onClick={e => e.stopPropagation()} className="bg-white rounded-full p-1 flex shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all relative z-50 shrink-0 mt-auto">
              <input type="text" placeholder="Search..." className="flex-1 px-3 outline-none text-gray-700 font-bold text-xs w-full min-w-0" value={bannerSearchTerm} onChange={e => setBannerSearchTerm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBannerSearch()} />
              <button onClick={handleBannerSearch} className="bg-[#3BB77E] text-white rounded-full px-4 py-1.5 font-black hover:bg-[#29A56C] transition shadow-lg text-xs shrink-0">Search</button>
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20" onClick={e => e.stopPropagation()}>
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === i ? "w-6 bg-[#3BB77E]" : "w-2.5 bg-white/60"}`} />
            ))}
          </div>
        </div>

        {/* Desktop: Original two-column layout */}
        <div className={`hidden md:flex ${banners[currentSlide].bgColor} h-[350px] md:h-[450px] items-center px-16 relative`}>
          <div className="absolute inset-0 flex transition-opacity duration-700">
            <div className="w-1/2" />
            <div className="w-1/2 relative">
              <img src={banners[currentSlide].image} className="w-full h-full object-cover object-left" alt="" />
              <div className={`absolute inset-0 bg-gradient-to-r from-[${banners[currentSlide]?.bgColor?.replace('bg-[', '').replace(']', '') || '#DEF9EC'}] via-transparent to-transparent`} />
            </div>
          </div>
          <div className="relative z-20 w-1/2 space-y-6 animate-fadeIn pb-4">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#253D4E] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              <img src="/logo.png" className="w-4 h-4" alt="" />{banners[currentSlide].tag}
            </div>
            <h1 className="text-5xl lg:text-[3.8rem] font-black text-[#253D4E] leading-[1.05] transition-all duration-300" dangerouslySetInnerHTML={{ __html: banners[currentSlide].title }}></h1>
            <p className="text-gray-500 font-bold text-xl">{banners[currentSlide].subtitle}</p>
            <div onClick={e => e.stopPropagation()} className="bg-white rounded-full p-2 flex max-w-md shadow-2xl border-2 border-white focus-within:border-[#3BB77E] transition-all relative z-50">
              <input type="text" placeholder="Search..." className="flex-1 px-4 outline-none text-gray-700 font-bold text-base w-full min-w-0" value={bannerSearchTerm} onChange={e => setBannerSearchTerm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBannerSearch()} />
              <button onClick={handleBannerSearch} className="bg-[#3BB77E] text-white rounded-full px-6 py-2 font-black hover:bg-[#29A56C] transition shadow-lg text-base shrink-0">Search</button>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20" onClick={e => e.stopPropagation()}>
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === i ? "w-8 bg-[#3BB77E]" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Featured Categories</h2>
          <div className="flex gap-4 text-sm font-semibold text-gray-600 w-full sm:w-auto">
            <div className="md:hidden w-full relative">
              <select 
                onChange={(e) => window.location.href = `/shop?category=${encodeURIComponent(e.target.value)}`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-[#253D4E] outline-none appearance-none"
                defaultValue=""
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <FiArrowRight rotate={90} />
              </div>
            </div>
            <div className="hidden md:flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat, i) => (
                <Link key={i} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="hover:text-green-600 whitespace-nowrap">{cat.name}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/shop?category=${encodeURIComponent(cat.name)}`} className={`${cat.bg} hover:shadow-lg transition-shadow border rounded-lg p-5 flex flex-col items-center justify-center text-center group`}>
              <div className="w-16 h-16 mb-4 flex items-center justify-center overflow-hidden"><img src={cat.image || cat.img} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" /></div>
              <h6 className="font-bold text-gray-700 text-[13px] leading-tight mb-1">{cat.name}</h6>
              <p className="text-[12px] text-gray-400">{cat.count} ITEMS</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banners */}
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { color: "bg-amber-100", title: "Premium Fresh Quality Products", cat: "Fruits", imgClass: "w-48 h-48 right-0 bottom-0 bg-white p-3 rounded-tl-2xl" },
          { color: "bg-pink-100", title: "Latest Gadgets & Hearables", cat: "Electronics", imgClass: "w-48 h-48 right-0 bottom-0 bg-white p-3 rounded-tl-2xl" },
          { color: "bg-blue-100", title: "Daily Household Essentials", cat: "Household Essentials", imgClass: "w-48 h-48 right-0 bottom-0 bg-white p-3 rounded-tl-2xl" }
        ].map(p => (
          <div key={p.cat} className={`${p.color} rounded-2xl p-8 relative overflow-hidden h-64 flex items-center group cursor-pointer shadow-sm hover:shadow-md transition`}>
            <div className="relative z-10 max-w-[180px]">
              <h4 className="font-bold text-xl mb-4 text-gray-800 leading-tight">{p.title}</h4>
              <Link href={`/shop?category=${encodeURIComponent(p.cat)}`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors">Shop Now <FiArrowRight /></Link>
            </div>
            <div className={`absolute transition-transform group-hover:scale-110 ${p.imgClass}`}>
              <img src={categories.find(c => c.name === p.cat)?.image || categories.find(c => c.name === p.cat)?.img} alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        ))}
      </section>

      {/* Popular Products */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Popular Products</h2>
          <div className="w-full sm:w-auto">
            <div className="md:hidden w-full relative">
              <select 
                value={activePopularFilter}
                onChange={(e) => setActivePopularFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-[#253D4E] outline-none appearance-none"
              >
                {["All", "Milk & Dairy", "Grocery", "Vegetables", "Snacks", "Beverages", "Household Essentials"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <FiArrowRight rotate={90} />
              </div>
            </div>
            <div className="hidden md:flex gap-4 text-sm font-semibold text-gray-600">
              {["All", "Milk & Dairy", "Grocery", "Vegetables", "Snacks", "Beverages", "Household Essentials"].map(cat => (
                <span key={cat} onClick={() => setActivePopularFilter(cat)} className={`cursor-pointer transition-all ${activePopularFilter === cat ? "text-green-600 underline" : "hover:text-green-600"}`}>{cat}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {dataReady.popular.map(prod => <ProductCard key={prod._id || prod.id} prod={prod} />)}
        </div>
      </section>

      {/* Daily Best Sells */}
      <section>
        <h2 className="text-3xl font-bold text-[#253D4E] mb-8">Daily Best Sells</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <Link href="/shop?category=Vegetables" className="lg:w-1/4 h-[500px] bg-cover bg-center rounded-[40px] p-10 flex flex-col justify-start relative overflow-hidden shadow-md group border" style={{ backgroundImage: "url('https://res.cloudinary.com/dnafzpa8x/image/upload/v1773944030/quickzy/banners/hero-banner-2.jpg')" }}>
            <div className="relative z-20">
              <h6 className="text-white/80 font-bold mb-2 uppercase tracking-widest text-xs">Recommended</h6>
              <h3 className="text-white text-[2.7rem] font-extrabold mb-8 leading-[1.1]">Premium and fresh Quality Products Guaranteed</h3>
              <div className="bg-[#3BB77E] text-white px-6 py-2.5 rounded-lg text-sm font-black flex items-center gap-2 hover:bg-[#29A56C] transition shadow-xl mt-4 max-w-max">Order Now <FiArrowRight /></div>
            </div>
            <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors z-10"></div>
          </Link>
          <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {dataReady.dailyBest.map(prod => <ProductCard key={prod._id || prod.id} prod={prod} isDailyBest showProgress />)}
          </div>
        </div>
      </section>

      {/* Deals of The Day */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Deals Of The Day</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataReady.deals.map((deal, idx) => (
            <div 
              key={idx} 
              onClick={() => router.push(`/product/${deal.id_custom || deal._id || deal.id}`)}
              className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border cursor-pointer"
            >
              <div className="h-64 bg-gray-50 p-8 flex items-center justify-center relative">
                <img src={deal.image || deal.img} alt={deal.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
                {deal.tag && (
                  <span className={`absolute top-0 left-0 text-white text-[10px] font-bold px-4 py-1.5 rounded-br-2xl z-10 rounded-tl-xl ${deal.tagColor || "bg-[#f74b81]"}`}>
                    {deal.tag}
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = deal._id || deal.id;
                    setAnimatingHeart(id);
                    toggleWishlist(deal);
                    setTimeout(() => setAnimatingHeart(null), 400);
                  }}
                  className={`absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-all ${animatingHeart === (deal._id || deal.id) ? "animate-heart-pop" : ""}`}
                >
                  <FiHeart className={`text-lg ${isInWishlist(deal._id || deal.id) ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
                </button>
              </div>
              <div className="p-4 bg-white relative">
                <h4 className="font-bold text-gray-800 text-sm mb-2 truncate group-hover:text-[#3BB77E] transition-colors">{deal.name}</h4>
                <div className="flex gap-2 mb-3">
                  {["Days", "Hrs", "Mins"].map((label, i) => (
                    <div key={i} className="bg-yellow-100 rounded p-1 text-center flex-1">
                      <span className="block font-bold text-green-600 text-xs text-center">{i === 0 ? "02" : i === 1 ? "22" : "18"}</span>
                      <span className="text-[10px] text-gray-500 text-center">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[#3BB77E] font-black text-xl leading-tight">₹{deal.price}</span>
                    {deal.oldPrice && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#adadad] text-xs font-bold relative">
                          ₹{deal.oldPrice}
                          <span className="absolute top-1/2 left-[-3px] w-[calc(100%+6px)] h-[1.5px] bg-[#888]"></span>
                        </span>
                        <span className="bg-[#FF7F50] text-white text-[9px] px-1.5 py-0.5 rounded font-black italic uppercase">
                          {deal.discount} OFF
                        </span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(deal);
                    }}
                    className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-4 py-2.5 rounded-xl transition-all font-black text-xs flex items-center gap-2"
                  >
                    Add <FiShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Column Lists */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ProductList title="Top Selling" items={dataReady.topSelling} />
        <ProductList title="Trending" items={dataReady.trending} />
        <ProductList title="Top Picks" items={dataReady.topPicks} />
        <ProductList title="Recently added" items={dataReady.recentlyAdded} />
      </section>

      <div className="rounded-[40px] mt-10 relative overflow-hidden border border-gray-100 shadow-sm min-h-[300px] md:min-h-[400px]">
        {/* Dynamic Footer Image from Atlas */}
        <img 
          src={footerBanner?.image || "https://res.cloudinary.com/dnafzpa8x/image/upload/v1774162639/quickzy/banners/footer-banner.jpg"} 
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 md:scale-100 scale-[2.2]" 
          alt="" 
        />
        {/* Clear overlay for text legibility */}
        <div className="absolute inset-0 bg-black/0 md:bg-black/10 transition-colors" />
        {/* Mobile: stacked layout — text top-left, email at bottom */}
        <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-14 min-h-[300px] md:min-h-[400px]">
          <div className="max-w-[280px] md:max-w-lg">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight transition-all text-shadow-strong">Stay home &amp; get <br />your daily <br /><span className="text-[#3BB77E]">needs from <br />our shop</span></h2>
          </div>
          <div className="mt-8">
            <div className="bg-white rounded-full p-1.5 md:p-2 flex max-w-sm md:max-w-md shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all">
              <input type="email" placeholder="Enter email" className="flex-1 px-4 md:px-5 outline-none text-xs md:text-base text-gray-700 bg-transparent min-w-0" value={footerEmail} onChange={e => setFooterEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleFooterLogin()} />
              <button onClick={handleFooterLogin} className="bg-[#3BB77E] text-white rounded-full px-5 md:px-8 py-2 md:py-3.5 font-black hover:bg-[#29A56C] transition shadow-lg text-xs md:text-base shrink-0">Login</button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { img: "/best_price.png", title: "Best prices", desc: "Orders ₹500+" },
          { img: "/free_delivery.png", title: "Free delivery", desc: "24/7 help center" },
          { img: "/great_deals.png", title: "Great deals", desc: "When you sign up" },
          { img: "/wide_asortments.png", title: "Wide range", desc: "Mega Discounts" },
          { img: "/easy_returns.png", title: "Easy returns", desc: "Within 30 days" }
        ].map(f => (
          <div key={f.title} className="bg-[#F4F6FA] p-6 rounded-2xl flex items-center gap-4 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-[#BCE3C9]">
            <img src={f.img} className="w-12 h-12" alt="" />
            <div><h6 className="font-black text-[#253D4E] text-sm">{f.title}</h6><p className="text-xs text-gray-400 font-bold">{f.desc}</p></div>
          </div>
        ))}
      </div>
    </main>
  );
}
