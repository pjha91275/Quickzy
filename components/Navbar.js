"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiRefreshCw,
  FiGrid,
  FiHeadphones,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { fetchProdAndCat } from "@/actions/dbactions";

import AuthModal from "./AuthModal";
import LocationModal from "./LocationModal";
import { useCart } from "@/context/CartContext";

const Navbar = ({ initialCategories = [] }) => {
  const { cartItems, subtotal, totalItemsCount } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isNavCategoriesOpen, setIsNavCategoriesOpen] = useState(false);
  const [authModalStep, setAuthModalStep] = useState(1);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);

  const [guestAddress, setGuestAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("Select Location");

  // Sync address logic
  React.useEffect(() => {
    if (session?.user?.address?.text) {
      setCurrentAddress(session.user.address.text);
    } else {
      const gLoc = localStorage.getItem("quickzy-guest-location");
      const isConfirmed = localStorage.getItem("quickzy-location-confirmed");
      if (gLoc && isConfirmed) {
        setCurrentAddress(gLoc);
        setGuestAddress(gLoc);
      } else {
        setCurrentAddress("Select Location");
      }
    }
  }, [session]);

  // No longer auto-opening location from here (handled by LocationGuard)
  React.useEffect(() => {
    // Left empty or removed if no other logic needed
  }, [session]);

  // Listen for global auth open events (from footer or elsewhere)
  React.useEffect(() => {
    const handleOpenAuth = (e) => {
      const { step, email: passedEmail, error } = e.detail || {};
      if (step) setAuthModalStep(step);
      setIsAuthModalOpen(true);
      // We'll let AuthModal handle the LS email or passedEmail
    };
    const handleOpenLocation = () => {
      setIsLocationModalOpen(true);
    };
    window.addEventListener("open-auth", handleOpenAuth);
    window.addEventListener("open-location", handleOpenLocation);
    return () => {
      window.removeEventListener("open-auth", handleOpenAuth);
      window.removeEventListener("open-location", handleOpenLocation);
    };
  }, []);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState({ products: [], categories: initialCategories });

  // Fetch search data
  React.useEffect(() => {
    const loadSearchData = async () => {
      const result = await fetchProdAndCat();
      if (result) setData(result);
    };
    loadSearchData();
  }, []);

  // Update type-ahead suggestions
  React.useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();

    // Check Categories
    const matchedCategories = data.categories
      .filter((c) => (c.name || "").toLowerCase().includes(term))
      .map((c) => ({ ...c, type: "category" }));

    // Check Products
    const matchedProducts = data.products
      .filter(
        (p) =>
          (p.name || "").toLowerCase().includes(term) ||
          (p.category || "").toLowerCase().includes(term),
      )
      .map((p) => ({ ...p, type: "product" }));

    setSuggestions([...matchedCategories, ...matchedProducts].slice(0, 10));
  }, [searchTerm, data]);

  // Handle clicking a suggestion
  const handleSuggestionClick = (item) => {
    setSearchTerm(item.name);
    setSuggestions([]); // Close dropdown

    if (item.type === "category") {
      router.push(`/shop?category=${encodeURIComponent(item.name)}`);
    } else {
      router.push(`/product/${item.id_custom || item._id}`);
      // Force close suggestions for products specifically
      setTimeout(() => setSuggestions([]), 100);
    }
  };

  // Handle search submit
  const handleSearchExecution = () => {
    if (!searchTerm.trim()) return;

    const term = searchTerm.toLowerCase();

    // Match categories
    const categoryMatch = data.categories.find((c) => {
      const catName = (c.name || "").toLowerCase();
      return (
        catName === term || catName.includes(term) || term.includes(catName)
      );
    });

    if (categoryMatch) {
      router.push(`/shop?category=${encodeURIComponent(categoryMatch.name)}`);
      setSuggestions([]);
      return;
    }

    // Check if it's a specific product name (exact match)
    const exactProduct = data.products.find(
      (p) => (p.name || "").toLowerCase() === term,
    );
    if (exactProduct) {
      router.push(`/product/${exactProduct.id_custom || exactProduct._id}`);
      setSuggestions([]);
      return;
    }

    // Show generic search results page
    router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
    setSuggestions([]);
  };

  const isLoggedIn = !!session;
  const userInitials = session?.user?.name
    ? session.user.name.charAt(0)
    : session?.user?.email?.charAt(0) || "U";

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        initialStep={authModalStep}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => setIsAuthModalOpen(false)}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
      <header className="w-full bg-white border-b relative font-sans z-50">
        <div className="container mx-auto p-3.5 sm:p-4 flex flex-wrap md:flex-nowrap items-center justify-between md:justify-start gap-2 md:gap-2 lg:gap-3">
          {/* Left Side: Logo + Location */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="flex flex-col">
                <div className="flex items-center leading-none">
                  <div className="w-[44px] h-[44px] md:w-16 md:h-16 bg-white flex items-center justify-center rounded-lg shadow-sm border border-gray-50 overflow-hidden shrink-0">
                    <img
                      src="/logo.png"
                      alt="Quickzy Logo"
                      className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-xl md:text-2xl lg:text-xl xl:text-3xl font-black text-[#3BB77E] tracking-tight ml-2 -mt-0.5 leading-none">
                      Quickzy
                    </div>
                    <span className="text-[7.5px] sm:text-[8px] lg:text-[6.9px] lg:whitespace-normal lg:leading-tight lg:max-w-[85px] xl:text-[8px] xl:whitespace-nowrap xl:max-w-none text-gray-400 font-black ml-2 mt-0.5 block uppercase tracking-widest scale-95 origin-left">
                      Fast. Fresh. <br /> Delivered in a Zap.
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Location Trigger - Premium Blinkit Style */}
            <div
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex flex-col justify-center cursor-pointer hover:bg-gray-50 px-3 py-2.5 rounded-2xl transition-all group/loc border-l border-gray-100 ml-1 w-[130px] lg:w-[170px] xl:w-[220px] shrink-0 overflow-hidden"
            >
              <div className="flex items-center gap-1 leading-none mb-1">
                <span className="text-[13px] font-black text-[#253D4E] uppercase tracking-tight truncate">
                  {(localStorage.getItem("quickzy-location-confirmed") && currentAddress !== "Select Location") ? "Delivery within 15 Mins" : "Select Location"}
                </span>
                <IoIosArrowDown className="text-[10px] text-[#3BB77E] group-hover/loc:translate-y-0.5 transition-transform shrink-0" />
              </div>
              <span className="text-[12px] font-bold text-gray-400 truncate block">
                {currentAddress === "Select Location" ? "Set your delivery address" : currentAddress}
              </span>
            </div>
          </div>

          {/* Middle: Search Bar */}
          <div className="flex w-full md:w-auto md:flex-[1.5] lg:flex-[2.2] xl:flex-[2] order-last md:order-none mt-3 md:mt-0 border-2 border-[#BCE3C9] rounded-md items-center h-[44px] sm:h-[48px] relative">
            <div className="px-2 border-r hidden lg:block text-[11px] xl:text-sm xl:px-4 font-bold text-gray-700 whitespace-nowrap">
              All Categories
            </div>

            {/* UI PART: Bind value={searchTerm} and add an onChange to update the term. */}
            <input
              type="text"
              placeholder="Search for items, categories..."
              className="flex-1 px-4 outline-none text-sm text-gray-600 h-full w-full bg-transparent font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchExecution()}
            />

            {/* Part B: SUGGESTION DROPDOWN */}
            {suggestions.length > 0 && (
              <div className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((item) => (
                  <div
                    key={item._id || item.name}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-5 py-3 hover:bg-[#DEF9EC] cursor-pointer flex justify-between items-center group transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-black text-[#253D4E] group-hover:text-[#3BB77E] decoration-none transition-colors">
                        {item.name}
                      </span>
                      {item.type === "product" && (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          Within 15 Mins.
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest ${item.type === "category"
                          ? "bg-[#3BB77E] text-white"
                          : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              className="h-full px-5 bg-[#3BB77E] text-white flex items-center justify-center rounded-r-sm hover:bg-[#29A56C] transition-colors"
              onClick={handleSearchExecution}
            >
              <FiSearch className="text-xl" />
            </button>
          </div>

          {/* Right Side: Icons */}
          <div className="flex justify-end gap-[7px] md:gap-4 lg:gap-4 xl:gap-6 items-center text-[#253D4E] shrink-0 ml-auto md:ml-0 md:flex-1">
            <Link
              href="/wishlist"
              className="hidden lg:flex items-center justify-center gap-1 cursor-pointer hover:-translate-y-1 transition-all group h-[44px] sm:h-[48px]"
            >
              <div className="relative">
                <FiHeart className="text-[26px]" />
                <span className="absolute -top-1 -right-2 bg-[#3BB77E] text-white rounded-full w-[17px] h-[17px] text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
              </div>
              <span className="text-[15px] font-medium text-gray-500 group-hover:text-[#3BB77E] hidden xl:block">
                Wishlist
              </span>
            </Link>
            {cartItems.length === 0 ? (
              <div className="flex items-center justify-center min-w-[82px] sm:min-w-[125px] lg:min-w-[115px] xl:min-w-[125px] gap-1.5 px-2.5 sm:px-4 lg:px-4 xl:px-5 py-2 sm:py-3 bg-slate-50 rounded-xl text-slate-400 cursor-not-allowed border border-slate-100 shadow-inner group/cart whitespace-nowrap">
                <FiShoppingCart className="text-xl sm:text-2xl group-hover/cart:rotate-12 transition-transform" />
                <span className="text-xs sm:text-sm font-black tracking-tighter whitespace-nowrap">MY CART</span>
              </div>
            ) : (
              <Link
                href="/cart"
                className="flex items-center justify-center min-w-[82px] sm:min-w-[125px] lg:min-w-[115px] xl:min-w-[125px] gap-1.5 px-2.5 sm:px-4 lg:px-4 xl:px-5 py-2 sm:py-2.5 bg-[#3BB77E] text-white rounded-lg shadow-md hover:shadow-lg hover:bg-[#2e9262] transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="relative">
                  <FiShoppingCart className="text-xl sm:text-2xl" />
                </div>
                <div className="flex flex-col leading-none items-start">
                  <span className="text-[10px] sm:text-[11px] font-bold text-green-100">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</span>
                  <span className="text-xs sm:text-sm font-black mt-0.5">₹{subtotal.toFixed(0)}</span>
                </div>
              </Link>
            )}

            <div className="relative group/account">
              {!isLoggedIn ? (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center justify-center gap-1 cursor-pointer hover:-translate-y-1 transition-all group outline-none h-[42px] sm:h-[48px]"
                >
                  <FiUser className="text-[24px] md:text-[26px]" />
                  <span className="text-[13px] md:text-[15px] font-medium text-gray-500 group-hover:text-[#3BB77E]">
                    Login
                  </span>
                </button>
              ) : (
                <div 
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center justify-center gap-1 cursor-pointer group h-[42px] sm:h-[48px]"
                >
                  <div className="w-[32px] h-[32px] md:w-[34px] md:h-[34px] rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] font-extrabold text-[12px] md:text-[13px] uppercase overflow-hidden border border-[#3BB77E]/20">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt="User"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <span className="text-[13px] md:text-[15px] font-black text-[#253D4E] group-hover:text-[#3BB77E] truncate max-w-[90px] md:max-w-[100px]">
                    {session.user.name || "My Account"}{" "}
                    <IoIosArrowDown className="inline text-[10px]" />
                  </span>
                </div>
              )}

              <div className={`${isAccountDropdownOpen ? "block" : "hidden"} absolute top-full right-0 w-52 pt-4 z-50 lg:group-hover/account:block animate-in fade-in slide-in-from-top-1`}>
                {isAccountDropdownOpen && (
                  <div className="fixed inset-0 z-[-1]" onClick={(e) => { e.stopPropagation(); setIsAccountDropdownOpen(false); }} />
                )}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 flex flex-col gap-3">
                  {isLoggedIn ? (
                    <>
                      <div className="pb-3 border-b mb-1">
                        <p className="text-[10px] text-[#3BB77E] font-black uppercase tracking-widest mb-1">
                          Welcome
                        </p>
                        <p className="text-sm font-black text-[#253D4E] truncate">
                          {session.user.name || session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="text-sm font-bold text-gray-600 hover:text-[#3BB77E] flex items-center gap-2 transition-colors"
                      >
                        <FiUser className="text-lg" /> Profile Settings
                      </Link>
                      <Link
                        href="/orders"
                        className="text-sm font-bold text-gray-600 hover:text-[#3BB77E] flex items-center gap-2 transition-colors"
                      >
                        <FiHeart className="text-lg" /> Order History
                      </Link>
                      {session?.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="text-sm font-black text-[#3BB77E] hover:text-[#29A56C] flex items-center gap-2 transition-colors bg-[#DEF9EC] p-2 rounded-lg"
                        >
                          <FiGrid className="text-lg" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-2 pt-2 border-t mt-1 transition-colors text-left"
                      >
                        <FiX className="text-lg" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-xs font-bold text-[#3BB77E] hover:underline"
                    >
                      Sign In / Join Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              className="lg:hidden p-1.5 text-[1.4rem] md:text-2xl text-[#253D4E]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Bottom Nav Section */}
        <div className="border-t hidden lg:block bg-white">
          <div className="container mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex gap-10 items-center h-full">
              <div className="relative group/nav h-full flex items-center">
                <button 
                  onClick={() => setIsNavCategoriesOpen(!isNavCategoriesOpen)}
                  className="bg-[#3BB77E] text-white px-6 py-2.5 rounded-md flex items-center gap-2 font-black text-sm hover:bg-[#29A56C] transition-colors shadow-sm"
                >
                  <FiGrid className="text-lg" /> Browse All Categories{" "}
                  <IoIosArrowDown className={`transition-transform duration-300 ${isNavCategoriesOpen ? 'rotate-180' : 'group-hover/nav:rotate-180'}`} />
                </button>
                <div className={`${isNavCategoriesOpen ? 'block translate-y-0 opacity-100 pointer-events-auto' : 'hidden md:block opacity-0 translate-y-4 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto'} absolute top-[85%] left-0 w-full sm:w-[480px] bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-6 transition-all duration-300 z-50 overflow-hidden backdrop-blur-sm`}>
                  {isNavCategoriesOpen && (
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsNavCategoriesOpen(false)} />
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 px-4 max-h-[70vh] overflow-y-auto no-scrollbar relative z-10">
                    {data.categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F2FBF6] rounded-xl group/item transition-all border border-transparent hover:border-[#DEF9EC]"
                      >
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-lg p-2 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                          <img src={cat.image || cat.img} className="w-full h-full object-contain group-hover/item:scale-110 transition-transform" alt="" />
                        </div>
                        <span className="text-[11px] font-black text-[#253D4E] group-hover/item:text-[#3BB77E] uppercase tracking-wider">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <nav className="flex gap-8 font-bold text-[#253D4E] text-sm">
                <Link
                  href="/"
                  className={`hover:text-[#3BB77E] transition-colors ${pathname === "/" ? "text-[#3BB77E]" : ""}`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`hover:text-[#3BB77E] transition-colors ${pathname === "/about" ? "text-[#3BB77E]" : ""}`}
                >
                  About
                </Link>
                <Link
                  href="/shop"
                  className={`hover:text-[#3BB77E] transition-colors ${pathname === "/shop" ? "text-[#3BB77E]" : ""}`}
                >
                  Shop
                </Link>

                <Link
                  href="/blog"
                  className={`hover:text-[#3BB77E] transition-colors ${pathname === "/blog" ? "text-[#3BB77E]" : ""}`}
                >
                  Blog
                </Link>

                <Link
                  href="/contact"
                  className={`hover:text-[#3BB77E] transition-colors ${pathname === "/contact" ? "text-[#3BB77E]" : ""}`}
                >
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <FiHeadphones className="text-4xl text-[#253D4E]" />
              <div className="text-right">
                <a href="tel:+911800419" className="text-[#3BB77E] text-2xl font-black leading-none hover:underline">
                  +91 1800-419
                </a>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  24/7 Delivery Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Logic */}
        {isMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 pb-4 border-b">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-black text-[#3BB77E]">
                  Quickzy
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl text-gray-400 hover:text-red-500"
              >
                <FiX />
              </button>
            </div>
            <nav className="flex flex-col font-bold text-[#253D4E] overflow-y-auto flex-1 pb-[100px]">
              {/* Browse All Categories Dropdown */}
              <div className="border-b border-gray-50 py-3">
                <div
                  className={`flex items-center justify-between cursor-pointer w-full text-left bg-[#3BB77E] text-white px-3 py-2.5 rounded-xl shadow-sm transition-all hover:bg-[#29A56C] ${isMobileCategoriesOpen ? 'ring-2 ring-green-100' : ''}`}
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                >
                  <div className="flex items-center gap-2">
                    <FiGrid className="text-sm" />
                    <span className="font-black text-[14px]">Browse All Categories</span>
                  </div>
                  <IoIosArrowDown className={`text-white/80 transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-50/50 rounded-xl mt-2 ${isMobileCategoriesOpen ? 'max-h-[800px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                >
                  <div className="px-3 grid grid-cols-2 gap-2">
                    {data?.categories?.length > 0 ? (
                      data.categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileCategoriesOpen(false);
                          }}
                          className="flex flex-col items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#3BB77E] transition-all"
                        >
                          <img src={cat.image || cat.img} className="w-8 h-8 object-contain mb-1" alt="" />
                          <span className="text-[10px] font-bold text-gray-700 text-center uppercase tracking-tighter leading-tight">{cat.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-2 py-8 text-center bg-white/50 rounded-xl">
                        <div className="inline-block w-5 h-5 border-2 border-[#3BB77E] border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Preloading Categories...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-4 border-b border-gray-50 transition-colors font-black flex items-center gap-2"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-4 border-b border-gray-50 transition-colors font-black flex items-center gap-2"
              >
                About
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-4 border-b border-gray-50 transition-colors font-black flex items-center gap-2"
              >
                Shop
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-4 border-b border-gray-50 transition-colors font-black flex items-center gap-2"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#3BB77E] py-4 border-b border-gray-50 transition-colors font-black flex items-center gap-2"
              >
                Contact
              </Link>

              {/* Your Account Section - Refined Mobile UI */}
              <div className="border-b border-gray-50 py-3">
                {!isLoggedIn ? (
                  /* Standard Login Button (No Dropdown for Logged Out) */
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-[#3BB77E] px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 w-max min-w-[140px] text-white shadow-md shadow-green-100/30 active:scale-95 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FiUser className="text-[20px] text-white" />
                      <span className="font-extrabold text-[14px]">Login</span>
                    </div>
                    <IoIosArrowDown className="text-white/70 text-sm" />
                  </button>
                ) : (
                  /* Logged In Dropdown logic */
                  <>
                    <div
                      className={`flex items-center justify-between cursor-pointer w-max min-w-[160px] text-left bg-[#f8f9fa] border border-gray-200 text-[#253D4E] px-4 py-3 rounded-2xl shadow-sm transition-all hover:bg-gray-100 ${isMobileAccountOpen ? 'ring-2 ring-[#DEF9EC]' : ''}`}
                      onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-[32px] h-[32px] rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] font-extrabold text-[12px] uppercase overflow-hidden border border-[#3BB77E]/20">
                          {session.user.image ? (
                            <img
                              src={session.user.image}
                              alt="User"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            userInitials
                          )}
                        </div>
                        <span className="font-extrabold text-[14px] truncate max-w-[120px]">
                          {session.user.name || "My Account"}
                        </span>
                      </div>
                      <IoIosArrowDown className={`text-gray-400 transition-transform duration-300 ${isMobileAccountOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out bg-white rounded-2xl mt-2 border border-transparent ${isMobileAccountOpen ? 'max-h-[500px] py-2 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                    >
                      <div className="flex flex-col gap-1 p-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 py-3.5 px-4 font-bold text-gray-600 hover:text-[#3BB77E] hover:bg-[#F2FBF6] rounded-xl transition-all"
                        >
                          <FiUser className="text-lg opacity-50" /> Profile Settings
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 py-3.5 px-4 font-bold text-gray-600 hover:text-[#3BB77E] hover:bg-[#F2FBF6] rounded-xl transition-all"
                        >
                          <FiHeart className="text-lg opacity-50" /> Order History
                        </Link>
                        {session?.user?.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 py-3.5 px-4 font-black text-[#3BB77E] bg-[#DEF9EC] rounded-xl hover:bg-[#D1F2E0] transition-all"
                          >
                            <FiGrid className="text-lg" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            signOut();
                          }}
                          className="flex items-center gap-3 py-3.5 px-4 font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all mt-1 border-t border-gray-50 pt-4"
                        >
                          <FiX className="text-lg opacity-50" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-2">
                <p className="text-[11px] text-[#253D4E] font-black uppercase tracking-widest mb-2">Favorites</p>
                <Link
                  href="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[#3BB77E] py-3 rounded-xl transition-colors font-bold flex items-center gap-3 text-sm hover:bg-[#DEF9EC]"
                >
                  <FiHeart className="text-gray-400 group-hover:text-[#3BB77E]" /> Wishlist
                </Link>
              </div>
              <div className="mt-auto pt-10 lg:hidden">
                <a href="tel:+911800419" className="flex items-center gap-4 group cursor-pointer w-max">
                  <div className="w-12 h-12 rounded-full bg-[#DEF9EC] flex items-center justify-center text-[#3BB77E] group-hover:scale-110 transition-transform">
                    <FiHeadphones className="text-xl" />
                  </div>
                  <div>
                    <p className="font-black text-[#253D4E] group-hover:text-[#3BB77E] leading-none text-lg transition-colors">
                      +91 1800-419
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                      24/7 Delivery Support
                    </p>
                  </div>
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
