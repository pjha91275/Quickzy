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

// Helper for shuffle
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export default function HomeContent({ products, categories }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [animatingHeart, setAnimatingHeart] = React.useState(null);
  
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [activePopularFilter, setActivePopularFilter] = React.useState("All");
  const [bannerSearchTerm, setBannerSearchTerm] = React.useState("");
  const [footerEmail, setFooterEmail] = React.useState("");
  
  const [dataReady, setDataReady] = React.useState({
    popular: [],
    dailyBest: [],
    deals: [],
    topSelling: [],
    trending: [],
    recentlyAdded: [],
    topPicks: []
  });

  const banners = [
    {
      title: <>Fresh Grocery <br /><span className="text-[#3BB77E]">Within 15 Mins</span></>,
      subtitle: "Save up to 50% on your first order",
      image: "https://res.cloudinary.com/dnafzpa8x/image/upload/v1773743306/quickzy/banners/hero-banner-1.jpg",
      tag: "Quickzy: Fresh. Fast. Delivered.",
      bgColor: "bg-[#DEF9EC]",
      shopLink: "/shop",
    },
    {
      title: <>Pure Dairy <br /><span className="text-[#3BB77E]">Morning Freshness</span></>,
      subtitle: "Get fresh milk and dairy delivered daily",
      image: "https://res.cloudinary.com/dnafzpa8x/image/upload/v1773743307/quickzy/banners/hero-banner-2.png",
      tag: "Quickzy: Fresh Dairy",
      bgColor: "bg-[#e3f2fd]",
      shopLink: `/shop?category=${encodeURIComponent("Milk & Dairy")}`,
    },
    {
      title: <>Fresh Vegetables <br /><span className="text-[#3BB77E]">Straight from Farm</span></>,
      subtitle: "Get fresh onions, potatoes and more",
      image: "https://res.cloudinary.com/dnafzpa8x/image/upload/v1773743308/quickzy/banners/hero-banner-3.jpg",
      tag: "Quickzy: Farm Fresh",
      bgColor: "bg-[#fff3e0]",
      shopLink: "/shop?category=Vegetables",
    },
    {
      title: <>Latest Gadgets <br /><span className="text-[#3BB77E]">& Wearables</span></>,
      subtitle: "Experience technology at your doorstep",
      image: "https://res.cloudinary.com/dnafzpa8x/image/upload/v1773743310/quickzy/banners/hero-banner-4.png",
      tag: "Quickzy: Electronics",
      bgColor: "bg-[#fce4ec]",
      shopLink: "/shop?category=Electronics",
    },
    {
      title: <>Home Cleaners <br /><span className="text-[#3BB77E]">Shiny & Fresh</span></>,
      subtitle: "Everything you need for a sparkling home",
      image: "https://res.cloudinary.com/dnafzpa8x/image/upload/v1773743311/quickzy/banners/hero-banner-5.png",
      tag: "Quickzy: Household",
      bgColor: "bg-[#f3e5f5]",
      shopLink: `/shop?category=${encodeURIComponent("Household Essentials")}`,
    },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stable sections only once when products/categories load
  const [stableSections, setStableSections] = React.useState({
    dailyBest: [],
    deals: [],
    topSelling: [],
    trending: [],
    recentlyAdded: [],
    topPicks: []
  });

  React.useEffect(() => {
    if (!products.length || !categories.length) return;

    // Use a fixed seed for shuffling based on product count to keep it somewhat stable but random
    const pool = shuffleArray(products);
    const rawDailyBest = pool.slice(0, 4).map(p => ({
      ...p,
      sold: Math.floor(Math.random() * 100) + 50,
      total: 200,
    }));

    setStableSections({
      dailyBest: rawDailyBest,
      deals: pool.slice(4, 8).map(p => ({ ...p, bg: "bg-gray-50" })),
      topSelling: pool.slice(8, 11),
      trending: pool.slice(11, 14),
      recentlyAdded: pool.slice(14, 17),
      topPicks: pool.slice(17, 20)
    });
  }, [products, categories]);

  // Calculate popular items based on filter
  React.useEffect(() => {
    if (!products.length || !categories.length) return;

    const calculateHot = (list, percent) => {
      const count = Math.round(list.length * percent);
      const sorted = [...list].sort((a, b) => {
        const getNum = (v) => parseInt(v?.toString().replace("%", "") || "0");
        return getNum(b.discount) - getNum(a.discount);
      });
      const topIds = new Set(sorted.slice(0, count).map(p => p._id || p.id));
      return list.map(p => topIds.has(p._id || p.id) ? { ...p, tag: "Hot Deal", tagColor: "bg-red-500 italic uppercase" } : p);
    };

    let rawPopular = [];
    if (activePopularFilter === "All") {
      // 1 per category logic (for 11 categories)
      const itemPerCategory = categories.map(cat => {
        const catProducts = products.filter(p => {
          const pCat = p.category.toLowerCase();
          const target = cat.name.toLowerCase();
          return pCat === target || target.includes(pCat) || pCat.includes(target);
        });
        return shuffleArray(catProducts)[0];
      }).filter(Boolean);

      const seen = new Set();
      const getUnique = (arr) => arr.filter(p => {
        const id = p._id || p.id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      rawPopular = getUnique([...itemPerCategory, ...shuffleArray(products)]).slice(0, 15);
    } else {
      // Filter by category
      const filteredPool = products.filter(p => {
        const pCat = p.category.toLowerCase();
        const target = activePopularFilter.toLowerCase();
        return pCat === target || target.includes(pCat) || pCat.includes(target);
      });
      rawPopular = shuffleArray(filteredPool).slice(0, 15);
    }

    setDataReady(prev => ({
      ...prev,
      popular: calculateHot(rawPopular, 0.4),
      dailyBest: calculateHot(stableSections.dailyBest, 0.4),
      deals: stableSections.deals,
      topSelling: stableSections.topSelling,
      trending: stableSections.trending,
      recentlyAdded: stableSections.recentlyAdded,
      topPicks: stableSections.topPicks
    }));
  }, [products, categories, activePopularFilter, stableSections]);

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

  // Sub-component for product cards
  const ProductCard = ({ prod, isDailyBest, showProgress }) => (
    <div className={`bg-white border hover:shadow-xl transition-all relative group flex flex-col ${isDailyBest ? 'rounded-[30px] p-6 h-[500px]' : 'rounded-2xl p-4 hover:border-green-300'}`}>
      {prod.tag && (
        <span className={`absolute top-0 left-0 text-white text-[10px] font-bold px-4 py-1.5 rounded-br-2xl z-10 ${isDailyBest ? 'rounded-tl-[28px]' : 'rounded-tl-2xl'} ${prod.tagColor || (prod.tag === "Hot" ? "bg-pink-500" : "bg-orange-400")}`}>
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
        className={`absolute top-5 right-5 z-20 p-2 rounded-full transition-all ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop text-red-500" : "text-gray-300 hover:scale-110"}`}
      >
        <FiHeart className={`text-xl ${isInWishlist(prod._id || prod.id) ? "text-red-500 fill-red-500" : ""}`} />
      </button>

      <Link href={`/product/${prod.id_custom || prod.id}`} className={`flex items-center justify-center overflow-hidden mb-1 group-hover:scale-105 transition-transform ${isDailyBest ? 'h-60' : 'h-40'}`}>
        <img src={prod.image || prod.img} alt={prod.name} className="w-full h-full object-contain" />
      </Link>
      <div className="text-[10px] text-gray-400 uppercase font-black mb-1">{prod.category}</div>
      <Link href={`/product/${prod.id_custom || prod.id}`} className="grow">
        <h3 className={`font-bold text-[#253D4E] leading-tight hover:text-[#3BB77E] transition-colors line-clamp-2 mb-1 ${isDailyBest ? 'text-base' : 'text-sm'}`}>{prod.name}</h3>
      </Link>
      <div className="flex mb-2">
        <span className="text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-3 py-1 rounded-md uppercase">{prod.unit || "Unit"}</span>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex flex-col">
          <span className="text-[#3BB77E] font-black text-xl leading-none">₹{prod.price}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#adadad] text-[11px] font-bold relative">
              ₹{prod.oldPrice}
              <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1.5px] bg-[#888]"></span>
            </span>
            <span className="bg-[#FF7F50] text-white text-[10px] px-2 py-0.5 rounded font-black italic uppercase">
              {prod.discount} OFF
            </span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            addToCart(prod);
          }}
          className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white px-4 py-2.5 rounded-xl transition-all font-black text-xs flex items-center gap-2"
        >
          Add <FiShoppingCart />
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

  const ProductList = ({ title, items }) => (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
        {title}
      </h3>
      <div className="space-y-6">
        {items.map(prod => (
          <div key={prod._id || prod.id} className="flex gap-4 group items-center relative">
            <Link href={`/product/${prod.id_custom || prod.id}`} className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
              <img src={prod.image || prod.img} alt={prod.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
            </Link>
              <div className="flex-grow">
              <Link href={`/product/${prod.id_custom || prod.id}`}>
                <h5 className="font-bold text-gray-700 text-[13px] group-hover:text-[#3BB77E] transition-colors line-clamp-2 leading-tight mb-1">{prod.name}</h5>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-[#3BB77E] font-black text-sm leading-none">₹{prod.price}</span>
                <span className="text-[#adadad] text-[10px] font-bold relative">
                  ₹{prod.oldPrice}
                  <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] bg-[#888]"></span>
                </span>
              </div>
              <div className="mt-1">
                <span className="bg-[#FF7F50] text-white text-[9px] px-1.5 py-0.5 rounded font-black italic uppercase inline-block">
                  {prod.discount} OFF
                </span>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                const id = prod._id || prod.id;
                setAnimatingHeart(id);
                toggleWishlist(prod);
                setTimeout(() => setAnimatingHeart(null), 400);
              }}
              className={`p-1 hover:bg-red-50 rounded-full transition-all ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop" : ""}`}
            >
              <FiHeart className={`text-sm ${isInWishlist(prod._id || prod.id) ? "text-red-500 fill-red-500" : "text-gray-300"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Banner */}
      <section onClick={() => (window.location.href = banners[currentSlide].shopLink)} className={`${banners[currentSlide].bgColor} rounded-3xl overflow-hidden relative h-[450px] flex items-center px-8 md:px-16 transition-colors duration-700 cursor-pointer shadow-sm hover:shadow-md group`}>
        <div className="absolute inset-0 flex transition-opacity duration-700">
          <div className="w-1/2" />
          <div className="w-1/2 relative">
            <img src={banners[currentSlide].image} className="w-full h-full object-cover object-left" alt="" />
            <div className={`absolute inset-0 bg-gradient-to-r from-[${banners[currentSlide].bgColor.replace('bg-[', '').replace(']', '')}] via-transparent to-transparent`} />
          </div>
        </div>
        <div className="relative z-20 w-full md:w-1/2 space-y-6 animate-fadeIn pb-4">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#253D4E] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <img src="/logo.png" className="w-4 h-4" alt="" />{banners[currentSlide].tag}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[3.8rem] font-black text-[#253D4E] leading-[1.05] transition-all duration-300">{banners[currentSlide].title}</h1>
          <p className="text-gray-500 font-bold text-xl">{banners[currentSlide].subtitle}</p>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-full p-2 flex max-w-md shadow-2xl border-2 border-white focus-within:border-[#3BB77E] transition-all relative z-50">
            <input type="text" placeholder="Search for essentials..." className="flex-1 px-4 outline-none text-gray-700 font-bold" value={bannerSearchTerm} onChange={e => setBannerSearchTerm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBannerSearch()} />
            <button onClick={handleBannerSearch} className="bg-[#3BB77E] text-white rounded-full px-6 py-2 font-black hover:bg-[#29A56C] transition shadow-lg">Search</button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20" onClick={e => e.stopPropagation()}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === i ? "w-8 bg-[#3BB77E]" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`} />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Categories</h2>
          <div className="flex gap-4 text-sm font-semibold text-gray-600 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat, i) => (
              <Link key={i} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="hover:text-green-600 whitespace-nowrap">{cat.name}</Link>
            ))}
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
          { color: "bg-amber-100", title: "Premium Fresh Quality Products", cat: "Fruits" },
          { color: "bg-pink-100", title: "Latest Gadgets & Hearables", cat: "Electronics" },
          { color: "bg-blue-100", title: "Daily Household Essentials", cat: "Household Essentials" }
        ].map(p => (
          <div key={p.cat} className={`${p.color} rounded-2xl p-8 relative overflow-hidden h-64 flex items-center group cursor-pointer shadow-sm hover:shadow-md transition`}>
            <div className="relative z-10 max-w-[180px]">
              <h4 className="font-bold text-xl mb-4 text-gray-800 leading-tight">{p.title}</h4>
              <Link href={`/shop?category=${encodeURIComponent(p.cat)}`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors">Shop Now <FiArrowRight /></Link>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img src={categories.find(c => c.name === p.cat)?.image || categories.find(c => c.name === p.cat)?.img} alt="" className="w-full h-full object-contain" />
            </div>
          </div>
        ))}
      </section>

      {/* Popular Products */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Popular Products</h2>
          <div className="flex gap-4 text-sm font-semibold text-gray-600 hidden md:flex">
            {["All", "Electronics", "Milk & Dairy", "Snacks", "Vegetables", "Personal Care", "Grocery"].map(cat => (
              <span key={cat} onClick={() => setActivePopularFilter(cat)} className={`cursor-pointer transition-all ${activePopularFilter === cat ? "text-green-600 underline" : "hover:text-green-600"}`}>{cat}</span>
            ))}
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
          <Link href="/shop?category=Vegetables" className="lg:w-1/4 h-[500px] bg-cover bg-center rounded-[40px] p-10 flex flex-col justify-start relative overflow-hidden shadow-md group border" style={{ backgroundImage: "url('https://res.cloudinary.com/dnafzpa8x/image/upload/v1773743308/quickzy/banners/hero-banner-3.jpg')" }}>
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#adadad] text-xs font-bold relative">
                        ₹{deal.oldPrice}
                        <span className="absolute top-1/2 left-[-3px] w-[calc(100%+6px)] h-[1.5px] bg-[#888]"></span>
                      </span>
                      <span className="bg-[#FF7F50] text-white text-[9px] px-1.5 py-0.5 rounded font-black italic uppercase">
                        {deal.discount} OFF
                      </span>
                    </div>
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
        <ProductList title="Recently added" items={dataReady.recentlyAdded} />
        <ProductList title="Top Picks" items={dataReady.topPicks} />
      </section>

      {/* Newsletter / Footer Top */}
      <div className="bg-[#ECF7F3] rounded-[40px] p-10 md:p-14 mt-10 relative overflow-hidden border border-gray-100 shadow-sm flex items-center min-h-[400px]">
        <div className="absolute inset-0 bg-cover bg-no-repeat bg-right opacity-100" style={{ backgroundImage: "url('https://res.cloudinary.com/dnafzpa8x/image/upload/v1773743312/quickzy/banners/footer_banner.jpg')" }}></div>
        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-[#253D4E] leading-tight">Stay home & get your daily <br /><span className="text-[#3BB77E]">needs from our shop</span></h2>
          <div className="bg-white rounded-full p-2 flex max-w-md shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all">
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 outline-none text-gray-700 bg-transparent" value={footerEmail} onChange={e => setFooterEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleFooterLogin()} />
            <button onClick={handleFooterLogin} className="bg-[#3BB77E] text-white rounded-full px-8 py-3.5 font-black hover:bg-[#29A56C] transition shadow-lg">Login</button>
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
