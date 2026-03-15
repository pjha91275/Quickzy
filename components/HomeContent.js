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
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

// Utility for randomizing product display
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function HomeContent({ products, categories }) {
  const { addToCart } = useCart();
  const router = useRouter();

  // Derived state for various sections
  const [shuffledProducts, setShuffledProducts] = React.useState([]);
  const [allPopular, setAllPopular] = React.useState([]);
  const [activePopularFilter, setActivePopularFilter] = React.useState("All");

  const [bannerSearchTerm, setBannerSearchTerm] = React.useState("");

  const [shuffledDeals, setShuffledDeals] = React.useState([]);
  const [shuffledTopSelling, setShuffledTopSelling] = React.useState([]);
  const [shuffledTrending, setShuffledTrending] = React.useState([]);
  const [shuffledRecentlyAdded, setShuffledRecentlyAdded] = React.useState([]);
  const [shuffledTopPicks, setShuffledTopPicks] = React.useState([]);
  const [shuffledDailyBest, setShuffledDailyBest] = React.useState([]);

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const banners = [
    {
      title: (
        <>
          Fresh Grocery <br />
          <span className="text-[#3BB77E]">Delivered in 10 Mins</span>
        </>
      ),
      subtitle: "Save up to 50% on your first order",
      image: "/hero-banner-1.png",
      tag: "Quickzy: Fresh. Fast. Delivered.",
      bgColor: "bg-[#DEF9EC]",
      btnText: "Order Now",
      dbCategory: null, // No specific category for the first banner
      shopLink: "/shop",
    },
    {
      title: (
        <>
          Pure Dairy <br />
          <span className="text-[#3BB77E]">Morning Freshness</span>
        </>
      ),
      subtitle: "Get fresh milk and dairy delivered daily",
      image: "/hero-banner-2.png",
      tag: "Quickzy: Fresh Dairy",
      bgColor: "bg-blue-50",
      btnText: "Shop Dairy",
      dbCategory: "Milk & Dairy",
      shopLink: `/shop?category=${encodeURIComponent("Milk & Dairy")}`,
    },
    {
      title: (
        <>
          Tropical Fruits <br />
          <span className="text-[#3BB77E]">Juicy & Healthy</span>
        </>
      ),
      subtitle: "Handpicked premium quality fruits for you",
      image: "/hero-banner-3.png",
      tag: "Quickzy: Fresh Fruits",
      bgColor: "bg-orange-50",
      btnText: "Browse Fruits",
      dbCategory: "Fruits",
      shopLink: "/shop?category=Fruits",
    },
    {
      title: (
        <>
          Latest Gadgets <br />
          <span className="text-[#3BB77E]">& Wearables</span>
        </>
      ),
      subtitle: "Experience technology at your doorstep",
      image: "/hero-banner-4.png",
      tag: "Quickzy: Electronics",
      bgColor: "bg-pink-50",
      btnText: "View Gadgets",
      dbCategory: "Electronics",
      shopLink: "/shop?category=Electronics",
    },
    {
      title: (
        <>
          Home Cleaning <br />
          <span className="text-[#3BB77E]">Essentials</span>
        </>
      ),
      subtitle: "Everything you need for a sparkling home",
      image: "/hero-banner-5.png",
      tag: "Quickzy: Household",
      bgColor: "bg-purple-50",
      btnText: "Clean Now",
      dbCategory: "Household Essentials",
      shopLink: `/shop?category=${encodeURIComponent("Household Essentials")}`,
    },
  ];

  const promotions = {
    petFoodBanner:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop",
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    // 1. Pick at least one from each category for diversity in Popular Products
    const itemPerCategory = categories
      .map((cat) => {
        let catProducts = [];
        catProducts = products.filter((p) => {
          // Simple dynamic check: matches if category name is same, 
          // or if one contains the other (e.g. Dairy matches Milk & Dairy)
          const pCat = p.category.toLowerCase();
          const target = cat.name.toLowerCase();
          return pCat === target || target.includes(pCat) || pCat.includes(target) || p.name.toLowerCase().includes(target.split(" ")[0]);
        });
        return shuffleArray(catProducts)[0];
      })
      .filter(Boolean);

    // Fill Popular Products with more items up to 15, ensuring they are unique
    const getUniqueProducts = (arr) => {
      const seen = new Set();
      return arr.filter((p) => {
        const id = p._id || p.id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    };

    const finalPopular = getUniqueProducts([
      ...itemPerCategory,
      ...shuffleArray(products),
    ]).slice(0, 15);

    setAllPopular(finalPopular);
    setShuffledProducts(finalPopular);

    // 2. Derive other sections from products NOT used in Popular section
    const pool = shuffleArray(
      products.filter(
        (p) =>
          !finalPopular.find((pop) => (pop._id || pop.id) === (p._id || p.id)),
      ),
    );

    // 3. APPLY "HOT DEAL" TAG (Logic: Top 7 highest discounts)
    // Combine both list to find the global winners
    const allCandidates = [...finalPopular, ...pool.slice(0, 4)];
    
    // Sort by discount percentage (strip % and convert to number)
    const sortedByDiscount = [...allCandidates].sort((a, b) => {
      const getNum = (str) => parseInt(str?.replace("%", "") || "0");
      return getNum(b.discount) - getNum(a.discount);
    });

    const hotDealIds = new Set(sortedByDiscount.slice(0, 7).map(p => p._id || p.id));

    const applyHotDeal = (p) => ({
      ...p,
      tag: hotDealIds.has(p._id || p.id) ? "Hot Deal" : p.tag,
      tagColor: hotDealIds.has(p._id || p.id) ? "bg-orange-500" : null
    });

    const finalPopularTagged = finalPopular.map(applyHotDeal);
    const dailyBestTagged = pool.slice(0, 4).map((p) => {
      const base = applyHotDeal(p);
      return {
        ...base,
        sold: Math.floor(Math.random() * 100) + 50,
        total: 200,
      };
    });

    setAllPopular(finalPopularTagged);
    setShuffledProducts(finalPopularTagged);
    setShuffledDailyBest(dailyBestTagged);

    // Deals of the Day: 4 items
    setShuffledDeals(
      pool.slice(4, 8).map((p) => ({
        ...p,
        bg: "bg-gray-50",
      })),
    );

    // Column lists: 3 items each
    setShuffledTopSelling(pool.slice(8, 11));
    setShuffledTrending(pool.slice(11, 14));
    setShuffledRecentlyAdded(pool.slice(14, 17));
    setShuffledTopPicks(pool.slice(17, 20)); // Used for Top Picks
  }, [products, categories]);

  const handleBannerSearch = () => {
    const searchTerm = bannerSearchTerm.trim().toLowerCase();

    // 1. If search is empty -> Go to current banner shop page
    if (!searchTerm) {
      window.location.href = banners[currentSlide].shopLink;
      return;
    }

    // 2. Exact Category Match?
    const catMatch = categories.find(c => c.name.toLowerCase() === searchTerm);
    if (catMatch) {
      window.location.href = `/shop?category=${encodeURIComponent(catMatch.name)}`;
      return;
    }

    // 3. Search for a product (global search)
    const foundProduct = products.find((p) => {
      return p.name.toLowerCase().includes(searchTerm);
    });

    if (foundProduct) {
      window.location.href = `/product/${foundProduct.id_custom || foundProduct._id}`;
    } else {
      // 4. Fallback: Search results in Shop Page
      window.location.href = `/shop?search=${encodeURIComponent(bannerSearchTerm)}`;
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* --- Hero Slider --- */}
        <section
          onClick={() =>
            (window.location.href = banners[currentSlide].shopLink)
          }
          className={`${banners[currentSlide].bgColor} rounded-3xl overflow-hidden relative h-[450px] flex items-center px-8 md:px-16 transition-colors duration-700 cursor-pointer shadow-sm hover:shadow-md`}
        >
          {/* Custom refined background with subtle logo pattern */}
          <div className="absolute inset-0 transition-opacity duration-700 opacity-100">
            <div className="absolute inset-0 opacity-5 rotate-12 flex flex-wrap gap-20 p-10 pointer-events-none select-none grayscale contrast-200">
              {Array(10)
                .fill()
                .map((_, i) => (
                  <img
                    key={i}
                    src="/hero-banner-1.png"
                    className="w-48 h-48"
                    alt=""
                  />
                ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>

          <div className="relative z-10 max-w-xl space-y-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#253D4E] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm mb-4">
              <img src="/logo.png" className="w-4 h-4" alt="" />
              {banners[currentSlide].tag}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#253D4E] leading-[1.1]">
              {banners[currentSlide].title}
            </h1>
            <p className="text-gray-500 font-bold text-lg md:text-xl">
              {banners[currentSlide].subtitle}
            </p>
            
            {/* Global Search Bar (Static) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-full p-2 flex max-w-md shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all relative z-50 mt-6"
            >
              <input
                type="text"
                placeholder="Search for essentials..."
                className="flex-1 px-5 outline-none text-gray-700 bg-transparent font-medium"
                value={bannerSearchTerm}
                onChange={(e) => setBannerSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBannerSearch()}
              />
              <button
                onClick={handleBannerSearch}
                className="bg-[#3BB77E] text-white rounded-full px-8 md:px-10 py-3.5 font-black hover:bg-[#29A56C] transition shadow-lg hover:shadow-[#3BB77E]/30"
              >
                Search
              </button>
            </div>
          </div>

          {/* Floating Product Image for Carousel */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden md:flex items-center justify-center p-12">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                key={currentSlide}
                src={banners[currentSlide].image}
                alt="banner-product"
                className="max-h-full max-w-full object-contain animate-slideInRight"
              />
            </div>
          </div>

          {/* Dots Navigation */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20"
          >
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(i);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === i ? "w-8 bg-[#3BB77E]" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </section>

        {/* --- Featured Categories --- */}
        <section>
          <div className="flex justify-between items-center gap-10 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Categories
            </h2>
            <div className="flex gap-4 text-sm font-semibold text-gray-600 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat, i) => (
                <Link
                  key={i}
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="cursor-pointer hover:text-green-600 whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`${cat.bg} hover:shadow-lg transition-shadow border rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer group`}
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image || cat.img}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <h6 className="font-bold text-gray-700 text-sm whitespace-nowrap">
                  {cat.name}
                </h6>
                <p className="text-[12px] text-gray-400">{cat.count} items</p>
              </Link>
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
              <Link
                href="/shop?category=Fruits"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors"
              >
                Shop Now <FiArrowRight />
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform text-right">
              <img
                src={
                  categories.find((c) => c.name === "Fruits")?.image ||
                  categories.find((c) => c.name === "Fruits")?.img
                }
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
              <Link
                href="/shop?category=Electronics"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors"
              >
                Shop Now <FiArrowRight />
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img
                src={
                  categories.find((c) => c.name === "Electronics")?.image ||
                  categories.find((c) => c.name === "Electronics")?.img
                }
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
              <Link
                href="/shop?category=Household%20Essentials"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors"
              >
                Shop Now <FiArrowRight />
              </Link>
            </div>
            <div className="absolute -right-4 -bottom-4 w-48 h-48 group-hover:scale-110 transition-transform">
              <img
                src={
                  categories.find((c) => c.name === "Cleaning Essentials")
                    ?.image ||
                  categories.find((c) => c.name === "Cleaning Essentials")?.img
                }
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
              {[
                "All",
                "Electronics",
                "Milk & Dairy",
                "Personal Care",
                "Snacks",
                "Vegetables",
              ].map((cat) => (
                <span
                  key={cat}
                  onClick={() => {
                    setActivePopularFilter(cat);
                    if (cat === "All") {
                      setShuffledProducts(allPopular);
                    } else {
                      const filtered = products.filter((p) => {
                        const target = cat.toLowerCase();
                        const pCat = p.category.toLowerCase();
                        return pCat === target || target.includes(pCat) || pCat.includes(target) || p.name.toLowerCase().includes(target.split(" ")[0]);
                      });
                      setShuffledProducts(shuffleArray(filtered));
                    }
                  }}
                  className={`cursor-pointer transition-all ${activePopularFilter === cat ? "text-green-600 underline underline-offset-4" : "hover:text-green-600"}`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {shuffledProducts.map((prod) => (
              <div
                key={prod._id || prod.id}
                className="bg-white border hover:shadow-xl hover:border-green-300 transition-all rounded-2xl p-4 relative group"
              >
                {prod.tag && (
                  <span
                    className={`absolute top-0 left-0 text-white text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10 ${prod.tag === "Hot Deal" ? "bg-orange-500" : prod.tag === "Hot" ? "bg-pink-500" : prod.tag === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
                  >
                    {prod.tag}
                  </span>
                )}
                <Link
                  href={`/product/${prod.id_custom || prod.id}`}
                  className="block"
                >
                  <div className="h-40 flex items-center justify-center group-hover:scale-105 transition-transform cursor-pointer overflow-hidden p-4">
                    <img
                      src={prod.image || prod.img}
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
                        ₹{prod.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs line-through">
                        ₹{prod.oldPrice}
                      </span>
                      <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-black italic uppercase">
                        {prod.discount} OFF
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-green-100 text-green-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-lg transition-colors font-bold text-xs flex items-center gap-2"
                  >
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
            <Link
              href="/shop"
              className="lg:w-1/4 h-[520px] bg-cover bg-center rounded-2xl p-10 flex flex-col justify-start relative overflow-hidden shadow-md border group cursor-pointer"
              style={{
                backgroundImage: `url('${promotions.petFoodBanner}')`,
              }}
            >
              <div className="relative z-20">
                <h6 className="text-white/80 font-bold mb-2 uppercase tracking-widest text-xs">Fresh & Fast</h6>
                <h3 className="text-white text-5xl font-extrabold mb-10 leading-tight">
                  Premium Products Best Quality
                </h3>
                <div className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 w-fit group-hover:bg-green-700 transition shadow-lg">
                  Order Now <FiArrowRight className="text-sm" />
                </div>
              </div>
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors z-10"></div>
            </Link>

            {/* Cards Grid */}
            <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {shuffledDailyBest.map((prod) => (
                <div
                  key={prod._id || prod.id}
                  className="bg-white border rounded-2xl p-6 relative group hover:shadow-xl transition-all h-full flex flex-col"
                >
                  {/* Badges */}
                  <div className="absolute top-0 left-0 flex flex-col z-10">
                    {prod.tag && (
                      <span
                        className={`${prod.tagColor || "bg-pink-500"} text-white text-[10px] font-bold px-3 py-1.5 rounded-tl-2xl rounded-br-2xl shadow-sm`}
                      >
                        {prod.tag}
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <Link
                    href={`/product/${prod.id_custom || prod.id}`}
                    className="h-48 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform overflow-hidden p-6 cursor-pointer"
                  >
                    <img
                      src={prod.image || prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-grow">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-wider">
                      {prod.category}
                    </div>
                    <Link href={`/product/${prod.id_custom || prod.id}`}>
                      <h4 className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 hover:text-green-600 cursor-pointer leading-tight">
                        {prod.name}
                      </h4>
                    </Link>

                    <div className="flex mb-4">
                      <span className="text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                        {prod.unit || "Unit"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-[#3BB77E] font-black text-xl leading-none">
                            ₹{prod.price}
                          </span>
                          <span className="text-slate-400 text-[10px] font-bold line-through">
                             ₹{prod.oldPrice}
                          </span>
                        </div>
                        <span className="bg-blue-500 text-white text-[9px] px-1.5 py-1 rounded font-black italic uppercase">
                           {prod.discount || "SALE"} OFF
                        </span>
                      </div>
                      
                      {/* Progress Bar moved here */}
                      <div className="space-y-1 text-[10px]">
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${(prod.sold / prod.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-gray-400 font-bold flex justify-between">
                          <span>Sold: {prod.sold}/{prod.total}</span>
                          <span className="text-green-600">{(prod.sold/prod.total*100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(prod)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
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
            {shuffledDeals.map((deal) => (
              <div
                key={deal._id || deal.id}
                className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border"
              >
                <div
                  className={`h-64 ${deal.bg} transition-transform group-hover:scale-105 duration-700 p-8 flex items-center justify-center`}
                >
                  <img
                    src={deal.image || deal.img}
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
                        ₹{deal.price}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs line-through">
                          ₹{deal.oldPrice}
                        </span>
                        <span className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black italic uppercase">
                          {deal.discount || "SALE"} OFF
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
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
              Top Selling
            </h3>
            <div className="space-y-6">
              {shuffledTopSelling.map((prod) => (
                <div
                  key={prod._id || prod.id}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.image || prod.img}
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
              {shuffledTrending.map((prod) => (
                <div
                  key={prod._id || prod.id}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.image || prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-[13px] mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="text-green-600 font-bold text-sm">
                      ₹{prod.price}{" "}
                      <span className="text-gray-300 text-[10px] line-through ml-1">
                        ₹{prod.oldPrice}
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
              {shuffledRecentlyAdded.map((prod) => (
                <div
                  key={prod._id || prod.id}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.image || prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-[13px] mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="text-green-600 font-bold text-sm">
                      ₹{prod.price}{" "}
                      <span className="text-gray-300 text-[10px] line-through ml-1">
                        ₹{prod.oldPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-green-400 font-sans uppercase text-[15px] tracking-wide">
              Top Picks
            </h3>
            <div className="space-y-6">
              {shuffledTopPicks.map((prod) => (
                <div
                  key={prod._id || prod.id}
                  className="flex gap-4 group cursor-pointer items-center"
                >
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 border shrink-0">
                    <img
                      src={prod.image || prod.img}
                      alt={prod.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-700 text-[13px] mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {prod.name}
                    </h5>
                    <div className="text-green-600 font-bold text-sm">
                      ₹{prod.price}{" "}
                      <span className="text-gray-300 text-[10px] line-through ml-1">
                        ₹{prod.oldPrice}
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
              backgroundImage: "url('/footer_banner.png')",
            }}
          ></div>
          <div className="relative z-10 max-w-lg space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-[#253D4E] leading-tight">
              Stay home & get your daily <br />
              <span className="text-[#3BB77E]">needs from our shop</span>
            </h2>
            <p className="text-gray-500 font-bold text-lg md:text-xl">
              Start Your Daily Shopping with{" "}
              <span className="text-[#3BB77E]">Quickzy</span>
            </p>
            <div className="bg-white rounded-full p-2 flex max-w-md shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 outline-none text-gray-700 bg-transparent font-medium"
              />
              <button className="bg-[#3BB77E] text-white rounded-full px-8 md:px-10 py-3.5 font-black hover:bg-[#29A56C] transition shadow-lg shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* --- Service Features --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-[#F4F6FA] p-6 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-[#BCE3C9]">
            <img src="/best_price.png" className="w-12 h-12" alt="" />
            <div>
              <h6 className="font-black text-[#253D4E] text-sm">Best prices</h6>
              <p className="text-xs text-gray-400 font-bold">Orders ₹500+</p>
            </div>
          </div>
          <div className="bg-[#F4F6FA] p-6 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-[#BCE3C9]">
            <img src="/free_delivery.png" className="w-12 h-12" alt="" />
            <div>
              <h6 className="font-black text-[#253D4E] text-sm">
                Free delivery
              </h6>
              <p className="text-xs text-gray-400 font-bold">
                24/7 help center
              </p>
            </div>
          </div>
          <div className="bg-[#F4F6FA] p-6 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-[#BCE3C9]">
            <img src="/great_deals.png" className="w-12 h-12" alt="" />
            <div>
              <h6 className="font-black text-[#253D4E] text-sm">Great deals</h6>
              <p className="text-xs text-gray-400 font-bold">
                When you sign up
              </p>
            </div>
          </div>
          <div className="bg-[#F4F6FA] p-6 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-[#BCE3C9]">
            <img src="/wide_asortments.png" className="w-12 h-12" alt="" />
            <div>
              <h6 className="font-black text-[#253D4E] text-sm">Wide range</h6>
              <p className="text-xs text-gray-400 font-bold">Mega Discounts</p>
            </div>
          </div>
          <div className="bg-[#F4F6FA] p-6 rounded-2xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-[#BCE3C9]">
            <img src="/easy_returns.png" className="w-12 h-12" alt="" />
            <div>
              <h6 className="font-black text-[#253D4E] text-sm">
                Easy returns
              </h6>
              <p className="text-xs text-gray-400 font-bold">Within 30 days</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
