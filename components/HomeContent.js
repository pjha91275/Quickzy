"use client";
import React from "react";
import { FiArrowRight, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";

// Utility for randomizing product display
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function HomeContent({ products, categories }) {
  const router = React.useMemo(() => {
    // We can't use useRouter directly in some environments, but Next.js usually likes it.
    // For now, let's stick to standard navigation or provide it via a custom hook if needed.
    // However, since this is a Client Component, we'll use window.location for simplicity
    // or import useRouter if we want the SPA experience.
    return typeof window !== "undefined" ? window.next?.router : null;
  }, []);

  // Derived state for various sections
  const [shuffledProducts, setShuffledProducts] = React.useState([]);
  const [allPopular, setAllPopular] = React.useState([]);
  const [activePopularFilter, setActivePopularFilter] = React.useState("All");

  const [bannerSearchTerms, setBannerSearchTerms] = React.useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const [shuffledDeals, setShuffledDeals] = React.useState([]);
  const [shuffledTopSelling, setShuffledTopSelling] = React.useState([]);
  const [shuffledTrending, setShuffledTrending] = React.useState([]);
  const [shuffledRecentlyAdded, setShuffledRecentlyAdded] = React.useState([]);
  const [shuffledTopRated, setShuffledTopRated] = React.useState([]);
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
      "https://m.media-amazon.com/images/I/413Z3Mfz-hL._SY300_SX300_QL70_FMwebp_.jpg",
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    // 1. Pick at least one from each category for Popular Products
    const itemPerCategory = categories
      .map((cat) => {
        let catProducts = [];
        if (cat.name === "Milk & Dairy") {
          catProducts = products.filter((p) => p.category === "Dairy");
        } else if (
          cat.name === "Household Essentials" ||
          cat.name === "Cleaning Essentials"
        ) {
          catProducts = products.filter(
            (p) =>
              p.category === "Household" ||
              p.category === "Household Essentials",
          );
        } else if (cat.name === "Tea & Coffee") {
          catProducts = products.filter(
            (p) =>
              p.name.toLowerCase().includes("coffee") ||
              p.name.toLowerCase().includes("tea") ||
              p.name.toLowerCase().includes("nescafe"),
          );
        } else if (cat.name === "Personal Care") {
          catProducts = products.filter((p) =>
            ["Personal Care", "Beauty", "Grooming"].includes(p.category),
          );
        } else if (cat.name === "Electronics") {
          catProducts = products.filter((p) =>
            ["Electronics", "Gadgets"].includes(p.category),
          );
        } else {
          catProducts = products.filter((p) => p.category === cat.name);
        }
        return shuffleArray(catProducts)[0];
      })
      .filter(Boolean);

    // Filter out items already picked, then shuffle the rest
    const remainingProducts = shuffleArray(
      products.filter(
        (p) =>
          !itemPerCategory.find(
            (picked) => (picked._id || picked.id) === (p._id || p.id),
          ),
      ),
    );

    // Fill until 15 items for Popular Products
    const fullPopular = [...itemPerCategory, ...remainingProducts];

    // Ensure uniqueness across all filters
    const getUniqueProducts = (arr) => {
      const seen = new Set();
      return arr.filter((p) => {
        const id = p._id || p.id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    };

    const finalPopular = getUniqueProducts(fullPopular).slice(0, 15);
    setAllPopular(finalPopular);
    setShuffledProducts(finalPopular);

    // 2. Derive other sections from remaining pool to minimize repetition
    const pool = shuffleArray(
      products.filter(
        (p) =>
          !fullPopular.find((pop) => (pop._id || pop.id) === (p._id || p.id)),
      ),
    );

    // Daily Best Sells: 4 items
    const dailyBestBase = pool.slice(0, 4).map((p) => ({
      ...p,
      sold: Math.floor(Math.random() * 100) + 50,
      total: 200,
      badge: p.discount || "Hot",
      badgeColor: "bg-green-400",
    }));
    setShuffledDailyBest(dailyBestBase);

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
    setShuffledTopRated(pool.slice(17, 20)); // Used for Customer Favorites
  }, [products, categories]);

  const handleBannerSearch = () => {
    const currentBanner = banners[currentSlide];
    const searchTerm = bannerSearchTerms[currentSlide].trim().toLowerCase();

    // 1. If search is empty -> Go to Category Shop Page
    if (!searchTerm) {
      window.location.href = currentBanner.shopLink;
      return;
    }

    // 2. Search for a product
    const foundProduct = products.find((p) => {
      // Logic for Category Matching (handles mapping Dairy -> Milk & Dairy etc)
      let matchesCategory = false;
      if (!currentBanner.dbCategory) {
        matchesCategory = true; // General search
      } else if (currentBanner.dbCategory === "Milk & Dairy") {
        matchesCategory = p.category === "Dairy";
      } else if (currentBanner.dbCategory === "Household Essentials") {
        matchesCategory =
          p.category === "Household" || p.category === "Household Essentials";
      } else {
        matchesCategory = p.category === currentBanner.dbCategory;
      }

      const matchesName = p.name.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesName;
    });

    if (foundProduct) {
      // 3. Match found in category -> Go to Product Page
      window.location.href = `/product/${foundProduct.id_custom || foundProduct._id}`;
    } else {
      // 4. Mismatch or No match -> Go to Category Shop Page (ignore product name as requested)
      window.location.href = currentBanner.shopLink;
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
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-full p-2 flex max-w-md shadow-xl border-2 border-white focus-within:border-[#3BB77E] transition-all"
            >
              <input
                type="text"
                placeholder="Search for essentials..."
                className="flex-1 px-5 outline-none text-gray-700 bg-transparent font-medium"
                value={bannerSearchTerms[currentSlide]}
                onChange={(e) =>
                  setBannerSearchTerms((prev) => ({
                    ...prev,
                    [currentSlide]: e.target.value,
                  }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleBannerSearch()}
              />
              <button
                onClick={handleBannerSearch}
                className="bg-[#3BB77E] text-white rounded-full px-8 md:px-10 py-3.5 font-black hover:bg-[#29A56C] transition shadow-lg hover:shadow-[#3BB77E]/30"
              >
                {banners[currentSlide].btnText}
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
                href="/shop?category=Cleaning%20Essentials"
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
                        if (cat === "Milk & Dairy")
                          return p.category === "Dairy";
                        if (cat === "Electronics")
                          return ["Electronics", "Gadgets"].includes(
                            p.category,
                          );
                        if (cat === "Personal Care")
                          return [
                            "Personal Care",
                            "Beauty",
                            "Grooming",
                          ].includes(p.category);
                        if (cat === "Cleaning Essentials")
                          return (
                            p.category === "Household" ||
                            p.category === "Cleaning Essentials"
                          );
                        if (cat === "Tea & Coffee")
                          return (
                            p.name.toLowerCase().includes("coffee") ||
                            p.name.toLowerCase().includes("tea") ||
                            p.name.toLowerCase().includes("nescafe")
                          );
                        return p.category === cat;
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
                    className={`absolute top-0 left-0 text-white text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10 ${prod.tag === "Hot" ? "bg-pink-500" : prod.tag === "Sale" ? "bg-blue-400" : "bg-orange-400"}`}
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
                      <span className="text-gray-400 text-xs line-through">
                        ₹{prod.oldPrice}
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
                backgroundImage: `url('${promotions.petFoodBanner}')`,
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
              {shuffledDailyBest.map((prod) => (
                <div
                  key={prod._id || prod.id}
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

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-[#3BB77E] font-black text-xl leading-none">
                        ₹{prod.price}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-[10px] font-bold line-through">
                          ₹{prod.oldPrice}
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
                      <span className="text-gray-400 text-xs line-through">
                        ₹{deal.oldPrice}
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
              Customer Favorites
            </h3>
            <div className="space-y-6">
              {shuffledTopRated.map((prod) => (
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
