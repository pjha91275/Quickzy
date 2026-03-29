"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  FiShoppingCart,
  FiSearch,
  FiGrid,
  FiList,
  FiFilter,
  FiChevronRight,
  FiX,
  FiStar,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useStore } from "@/context/StoreContext";
import { FiHeart } from "react-icons/fi";

export default function ShopContent({ products, categories }) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [animatingHeart, setAnimatingHeart] = React.useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const { storeData, initializeStore } = useStore();
  const [view, setView] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [sliderPrice, setSliderPrice] = useState(5000);
  const [filterPrice, setFilterPrice] = useState(5000);

  React.useEffect(() => {
    if (products?.length > 0) {
      initializeStore(products, categories);
    }
  }, [products, categories, initializeStore]);

  // Sync state with URL
  React.useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else if (searchQuery) {
      // If there is a search query, we ensure category is "All" so it doesn't conflict
      setSelectedCategory("All");
    } else {
      setSelectedCategory("All");
    }
  }, [categoryQuery, searchQuery]);

  const filteredProducts = React.useMemo(() => {
    // 1. First, apply Category Filter (if any)
    let pool = storeData.shopShuffled || [];
    if (selectedCategory !== "All") {
      pool = pool.filter((p) => {
        const target = (selectedCategory || "").toLowerCase();
        const pCat = (p.category || "").toLowerCase();
        return (
          pCat === target ||
          target.includes(pCat) ||
          pCat.includes(target)
        );
      });
    }

    // 2. Second, apply Text Search Filter
    if (searchQuery) {
      const term = (searchQuery || "").toLowerCase();
      pool = pool.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(term) ||
          (p.category || "").toLowerCase().includes(term),
      );
    }

    // 3. Third, apply Price Filter
    return pool.filter((p) => p.price <= filterPrice);
  }, [selectedCategory, filterPrice, searchQuery, storeData.shopShuffled]);

  const sortedProducts = filteredProducts;

  const handleCategoryClick = (name) => {
    router.push(`/shop?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <div className="bg-[#DEF9EC] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-[#253D4E] mb-2">
            {selectedCategory === "All"
              ? "Shop All Products"
              : selectedCategory}
          </h1>
          <nav className="flex items-center text-sm font-bold text-gray-500 gap-2">
            <Link href="/" className="text-[#3BB77E] hover:underline">
              Home
            </Link>
            <FiChevronRight />
            <span className="text-gray-400">Shop</span>
            {selectedCategory !== "All" && (
              <>
                <FiChevronRight />
                <span className="text-gray-400">{selectedCategory}</span>
              </>
            )}
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
              <li
                onClick={() => handleCategoryClick("All")}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedCategory === "All" ? "bg-[#3BB77E] text-white" : "bg-green-100 text-[#3BB77E]"}`}
                  >
                    <FiGrid size={14} />
                  </div>
                  <span
                    className={`font-bold text-sm transition-colors ${selectedCategory === "All" ? "text-[#3BB77E]" : "text-gray-600 group-hover:text-[#3BB77E]"}`}
                  >
                    All
                  </span>
                </div>
                <span className="bg-[#DEF9EC] text-[#3BB77E] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                  {products.length}
                </span>
              </li>
              {categories.map((cat, i) => (
                <li
                  key={cat._id || i}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image || cat.img}
                      alt={cat.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span
                      className={`font-bold text-sm transition-colors ${selectedCategory === cat.name ? "text-[#3BB77E]" : "text-gray-600 group-hover:text-[#3BB77E]"}`}
                    >
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
              {/* GUIDE: Step 3 - Connect the slider to the sliderPrice state.
                  'value' makes it a controlled component.
                  'onChange' updates the state every time you slide. */}
              <input
                type="range"
                className="w-full accent-[#3BB77E] cursor-pointer"
                min="0"
                max="5000"
                value={sliderPrice}
                onChange={(e) => setSliderPrice(parseInt(e.target.value))}
              />
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>
                  From: <strong className="text-[#3BB77E]">₹0</strong>
                </span>
                <span>
                  {/* GUIDE: Step 4 - Display the current sliderPrice dynamically in the UI. */}
                  To: <strong className="text-[#3BB77E]">₹{sliderPrice}</strong>
                </span>
              </div>
              <button
                onClick={() => setFilterPrice(sliderPrice)}
                className="w-full bg-[#3BB77E] text-white py-3 rounded-lg font-black text-sm hover:bg-[#29A56C] transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <FiFilter /> Filter
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#253D4E] mb-6 border-b pb-4 border-gray-100">
              New products
            </h3>
            <div className="space-y-6">
              {(storeData.recentlyAdded || []).map((item) => (
                <Link
                  key={item._id || item.id}
                  href={`/product/${item.id_custom || item.id}`}
                  className="flex gap-4 group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-[#3BB77E] transition-colors shrink-0">
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h5 className="font-bold text-[#253D4E] text-xs mb-1 group-hover:text-[#3BB77E] transition-colors line-clamp-2 leading-tight">
                      {item.name}
                    </h5>
                    <div className="flex items-center mb-1">
                      <span className="text-[10px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                        {item.unit}
                      </span>
                    </div>
                    <span className="text-[#3BB77E] font-black text-sm">
                      ₹{item.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="bg-white flex flex-col sm:flex-row justify-between items-center p-4 border rounded-2xl mb-8 shadow-sm gap-4">
            <p className="text-sm text-gray-400 font-bold">
              We found{" "}
              <span className="text-[#3BB77E]">{sortedProducts.length}</span>{" "}
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
            className={`grid gap-6 ${view === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
          >
            {sortedProducts.map((prod) => (
              <Link
                key={prod._id}
                href={`/product/${prod.id_custom || prod.id}`}
                className={`bg-white border hover:shadow-2xl hover:border-[#BCE3C9] transition-all rounded-2xl relative group overflow-hidden ${view === "grid" ? "flex flex-col p-4 h-full" : "flex flex-row items-start p-4 md:p-6 gap-4 md:gap-8 min-h-[160px] md:min-h-[220px]"}`}
              >
                {/* Tag Badge */}
                {prod.discount && (
                  <span className={`absolute top-0 left-0 text-white text-[10px] font-black px-4 py-1.5 rounded-tl-2xl rounded-br-2xl z-10 italic uppercase ${prod.tagColor || "bg-[#f74b81]"}`}>
                    {prod.tag || "Hot Deal"}
                  </span>
                )}

                {/* Vertical View Layout vs Grid View */}
                {view === "grid" ? (
                  <>
                    <div className="h-44 flex items-center justify-center p-4 mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                      <img
                        src={prod.image || prod.img}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mb-2 flex-grow">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-2 tracking-widest">
                        {prod.category}
                      </p>
                      <div className="flex justify-between items-start mb-2 h-10 overflow-hidden">
                        <h3 className="text-sm font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors line-clamp-2 pr-2 leading-tight">
                          {prod.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const id = prod._id || prod.id;
                            setAnimatingHeart(id);
                            toggleWishlist(prod);
                            setTimeout(() => setAnimatingHeart(null), 400);
                          }}
                          className={`text-lg pt-0.5 hover:scale-110 transition-transform shrink-0 relative z-20 ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop" : ""}`}
                        >
                          <FiHeart
                            className={
                              isInWishlist(prod._id || prod.id)
                                ? "text-red-500 fill-red-500"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="text-[11px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 py-0.5 rounded-md uppercase">
                          {prod.unit}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-4 font-bold">
                        By <span className="text-[#3BB77E]">{prod.vendor}</span>
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-auto">
                      <div>
                        <span className="text-lg font-black text-[#3BB77E]">
                          ₹{prod.price}
                        </span>
                        {prod.oldPrice && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#adadad] text-[11px] font-bold relative">
                              ₹{prod.oldPrice}
                              <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] bg-[#888]"></span>
                            </span>
                            <span className="bg-[#FF7F50] text-white text-[9px] px-1.5 py-0.5 rounded font-black italic uppercase">
                              {prod.discount} OFF
                            </span>
                          </div>
                        )}
                      </div>
                      {(() => {
                        const itemInCart = cartItems.find((i) => (i._id || i.id) === (prod._id || prod.id));
                        return itemInCart ? (
                          <div className="flex items-center justify-between bg-[#3BB77E] text-white rounded-lg px-3 py-1.5 shadow-sm relative z-20 min-w-[85px]">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateQuantity(prod._id || prod.id, -1);
                              }}
                              className="hover:scale-110 transition-transform flex items-center justify-center p-0.5"
                            >
                              <FiMinus size={14} strokeWidth={4} />
                            </button>
                            <span className="font-black text-sm px-1.5">{itemInCart.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateQuantity(prod._id || prod.id, 1);
                              }}
                              className="hover:scale-110 transition-transform flex items-center justify-center p-0.5"
                            >
                              <FiPlus size={14} strokeWidth={4} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(prod);
                            }}
                            className="bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white p-2.5 rounded-lg transition-all shadow-sm relative z-20"
                          >
                            <FiShoppingCart />
                          </button>
                        );
                      })()}
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View Layout */}

                    {/* Image: smaller on mobile, larger on desktop */}
                    <div className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 flex items-center justify-center p-2 md:p-4 border rounded-xl md:rounded-2xl bg-gray-50 overflow-hidden group-hover:bg-white transition-colors self-start md:self-center">
                      <img
                        src={prod.image || prod.img}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Content: min-w-0 to allow flex children to shrink properly */}
                    <div className="flex-grow min-w-0 flex flex-col gap-2 md:flex-row md:gap-8 md:justify-between">
                      <div className="flex-grow min-w-0 space-y-1.5 md:space-y-3">
                        <p className="text-[10px] text-[#3BB77E] font-black uppercase tracking-widest">
                          {prod.category}
                        </p>
                        <h3 className="text-base md:text-xl font-black text-[#253D4E] group-hover:text-[#3BB77E] transition-colors leading-tight line-clamp-2">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 font-medium hidden sm:block max-w-xl">
                          {prod.description ||
                            "Fresh, high-quality product delivered instantly to your doorstep with Quickzy's zap delivery service."}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[10px] md:text-[11px] font-black text-[#3BB77E] bg-[#DEF9EC] px-2 md:px-3 py-1 rounded-md uppercase tracking-wider">
                            {prod.unit}
                          </span>
                          <span className="text-xs text-gray-400 font-bold hidden sm:inline">
                            By{" "}
                            <span className="text-[#3BB77E]">
                              {prod.vendor}
                            </span>
                          </span>
                        </div>

                        {/* Price + Actions: shown inline on mobile below the details */}
                        <div className="flex items-center justify-between gap-2 md:hidden pt-1 border-t border-gray-50">
                          <div>
                            <span className="text-xl font-black text-[#3BB77E] block leading-tight">₹{prod.price}</span>
                            {prod.oldPrice && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[#adadad] text-[10px] font-bold relative">
                                  ₹{prod.oldPrice}
                                  <span className="absolute top-1/2 left-[-2px] w-[calc(100%+4px)] h-[1px] bg-[#888]"></span>
                                </span>
                                {prod.discount && (
                                  <span className="bg-[#FF7F50] text-white text-[8px] px-1.5 py-0.5 rounded font-black italic uppercase">
                                    {prod.discount} OFF
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const itemInCart = cartItems.find((i) => (i._id || i.id) === (prod._id || prod.id));
                              return itemInCart ? (
                                <div className="bg-[#3BB77E] text-white py-2.5 px-6 rounded-xl flex items-center justify-between shadow-sm relative z-20 min-w-[100px]">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      updateQuantity(prod._id || prod.id, -1);
                                    }}
                                    className="hover:scale-110 transition-transform p-0.5"
                                  >
                                    <FiMinus size={14} strokeWidth={4} />
                                  </button>
                                  <span className="font-black text-base">{itemInCart.quantity}</span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      updateQuantity(prod._id || prod.id, 1);
                                    }}
                                    className="hover:scale-110 transition-transform p-0.5"
                                  >
                                    <FiPlus size={14} strokeWidth={4} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addToCart(prod);
                                  }}
                                  className="bg-[#3BB77E] text-white py-2 px-4 rounded-xl font-black text-xs hover:bg-[#29A56C] transition-all flex items-center gap-1.5 relative z-20"
                                >
                                  <FiShoppingCart size={14} /> Add
                                </button>
                              );
                            })()}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const id = prod._id || prod.id;
                                setAnimatingHeart(id);
                                toggleWishlist(prod);
                                setTimeout(() => setAnimatingHeart(null), 400);
                              }}
                              className={`p-2 border rounded-xl transition-all relative z-20 ${isInWishlist(prod._id || prod.id) ? "border-red-100 bg-red-50 text-red-500" : "border-gray-100 text-gray-300"} ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop" : ""}`}
                            >
                              <FiHeart size={14} className={isInWishlist(prod._id || prod.id) ? "fill-red-500" : ""} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price + Actions: desktop only (hidden on mobile) */}
                      <div className="hidden md:flex w-52 flex-col justify-center gap-4 border-l pl-8 border-gray-100">
                        <div className="space-y-1">
                          <span className="text-3xl font-black text-[#3BB77E] block leading-none">
                            ₹{prod.price}
                          </span>
                          {prod.oldPrice && (
                            <div className="flex items-center gap-2">
                              <span className="text-[#adadad] text-sm font-bold relative">
                                ₹{prod.oldPrice}
                                <span className="absolute top-1/2 left-[-3px] w-[calc(100%+6px)] h-[1.5px] bg-[#888]"></span>
                              </span>
                              <span className="bg-[#FF7F50] text-white text-[10px] px-2 py-0.5 rounded-full font-black italic uppercase shadow-sm">
                                {prod.discount} OFF
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          {(() => {
                            const itemInCart = cartItems.find((i) => (i._id || i.id) === (prod._id || prod.id));
                            return itemInCart ? (
                              <div className="flex-grow bg-[#3BB77E] text-white py-4 px-8 rounded-xl flex items-center justify-between shadow-lg shadow-green-100 relative z-20 min-w-[150px]">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateQuantity(prod._id || prod.id, -1);
                                  }}
                                  className="hover:scale-110 transition-transform p-1"
                                >
                                  <FiMinus size={20} strokeWidth={4} />
                                </button>
                                <span className="font-black text-2xl">{itemInCart.quantity}</span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateQuantity(prod._id || prod.id, 1);
                                  }}
                                  className="hover:scale-110 transition-transform p-1"
                                >
                                  <FiPlus size={20} strokeWidth={4} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addToCart(prod);
                                }}
                                className="flex-grow bg-[#3BB77E] text-white py-3 px-4 rounded-xl font-black text-sm hover:bg-[#29A56C] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 group/btn relative z-20"
                              >
                                <FiShoppingCart className="group-hover/btn:scale-125 transition-transform" />{" "}
                                Add
                              </button>
                            );
                          })()}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const id = prod._id || prod.id;
                              setAnimatingHeart(id);
                              toggleWishlist(prod);
                              setTimeout(() => setAnimatingHeart(null), 400);
                            }}
                            className={`p-3 border rounded-xl hover:scale-110 transition-transform relative z-20 ${isInWishlist(prod._id || prod.id) ? "border-red-100 bg-red-50 text-red-500" : "border-gray-100 text-gray-300"} ${animatingHeart === (prod._id || prod.id) ? "animate-heart-pop" : ""}`}
                          >
                            <FiHeart
                              className={isInWishlist(prod._id || prod.id) ? "fill-red-500" : ""}
                              size={20}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>

                )}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
