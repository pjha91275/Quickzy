"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchProdAndCat } from "@/actions/dbactions";

const StoreContext = createContext();

// Algorithm: Naive Shuffle (Randomized array sort)
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const getAbsoluteUrl = (path) => {
  if (!path) return "https://res.cloudinary.com/dnafzpa8x/image/upload/v1774149230/quickzy/brand/logo_without_name.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `https://res.cloudinary.com/dnafzpa8x/image/upload/${path.slice(1)}`;
  return `https://res.cloudinary.com/dnafzpa8x/image/upload/${path}`;
};

const normalizeProductData = (pool) => {
  if (!pool || pool.length === 0) return [];
  return pool.map(p => {
    const rawImg = p.image || p.img;
    const basePrice = parseFloat(p.originalPrice || p.price || 0);
    return {
      ...p,
      image: getAbsoluteUrl(rawImg),
      img: getAbsoluteUrl(rawImg),
      price: basePrice,
      oldPrice: null,
      discount: null,
      tag: null,
      tagColor: null,
      originalPrice: basePrice
    };
  });
};

const applyGlobalPromotions = (items, homeCount, targetPercent = 35) => {
  if (!items || items.length === 0) return [];

  const totalCount = items.length;
  const homeTarget = Math.round(homeCount * (targetPercent / 100));
  const globalTarget = Math.round(totalCount * (targetPercent / 100));
  const restTarget = globalTarget - homeTarget;

  const discountIds = new Set();
  const homeIndices = [];
  for (let i = 0; i < homeCount; i++) homeIndices.push(i);
  const pickedHome = homeIndices.sort(() => Math.random() - 0.5).slice(0, homeTarget);
  pickedHome.forEach(idx => discountIds.add(items[idx]._id || items[idx].id));

  const restIndices = [];
  for (let i = homeCount; i < totalCount; i++) restIndices.push(i);
  const pickedRest = restIndices.sort(() => Math.random() - 0.5).slice(0, restTarget);
  pickedRest.forEach(idx => discountIds.add(items[idx]._id || items[idx].id));

  const getRandDiscount = () => Math.floor(Math.random() * (35 - 5 + 1)) + 5;

  return items.map(p => {
    if (discountIds.has(p._id || p.id)) {
      const discPercent = getRandDiscount();
      const oldPrice = p.price;
      const newPrice = Math.floor(oldPrice * (1 - discPercent / 100));
      return {
        ...p,
        price: newPrice,
        oldPrice: oldPrice,
        discount: `${discPercent}%`,
        tag: "Hot Deal",
        tagColor: "bg-[#f74b81] italic uppercase"
      };
    }
    return p;
  });
};

export const StoreProvider = ({ children }) => {
  const [storeData, setStoreData] = useState({
    fullPool: [],
    shopShuffled: [],
    recentlyAdded: [],
    popular_all: [],
    dailyBest: [],
    deals: [],
    topSelling: [],
    trending: [],
    topPicks: [],
    categories: []
  });

  // Algorithm: Data Partitioning & Shuffling (Preparing initial store state)
  const initializeStore = useCallback((products, categories) => {
    setStoreData(prev => {
      // Avoid re-running if already done
      if (!products?.length || prev.fullPool?.length > 0) return prev;

      const cleanPool = normalizeProductData(products);
      const numRecent = 3;
      const sortedByRecency = [...cleanPool].sort((a, b) => {
        if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
        if (a.id_custom && b.id_custom) return b.id_custom - a.id_custom;
        return String(b._id || b.id).localeCompare(String(a._id || a.id));
      });

      const topRecentRaw = sortedByRecency.slice(0, numRecent);
      const recentIds = new Set(topRecentRaw.map(r => r._id || r.id));
      const remainingShuffled = shuffleArray(cleanPool.filter(p => !recentIds.has(p._id || p.id)));
      const tempAvailable = [...remainingShuffled];

      const popularSetRaw = [];
      const catsShuffled = shuffleArray(categories || []);
      catsShuffled.forEach(cat => {
        const idx = tempAvailable.findIndex(p => (p.category || "").toLowerCase() === (cat.name || "").toLowerCase());
        if (idx > -1) {
          popularSetRaw.push(tempAvailable[idx]);
          tempAvailable.splice(idx, 1);
        }
      });

      const DAILY_SIZE = 4;
      const DEALS_SIZE = 4;
      const SELLING_SIZE = 3;
      const TRENDING_SIZE = 3;
      const PICKS_SIZE = 3;
      const HOME_TOTAL_TARGET = 35;

      const popularNeeded = HOME_TOTAL_TARGET - numRecent - DAILY_SIZE - DEALS_SIZE - SELLING_SIZE - TRENDING_SIZE - PICKS_SIZE;
      while (popularSetRaw.length < popularNeeded && tempAvailable.length > 0) {
        popularSetRaw.push(tempAvailable.shift());
      }

      const dailyBestRaw = tempAvailable.splice(0, DAILY_SIZE);
      const dealsRaw = tempAvailable.splice(0, DEALS_SIZE);
      const topSellingRaw = tempAvailable.splice(0, SELLING_SIZE);
      const trendingRaw = tempAvailable.splice(0, TRENDING_SIZE);
      const topPicksRaw = tempAvailable.splice(0, PICKS_SIZE);

      const homeSubsetRaw = [
        ...topRecentRaw, ...popularSetRaw, ...dailyBestRaw, ...dealsRaw, ...topSellingRaw, ...trendingRaw, ...topPicksRaw
      ];

      const fullSequenceRaw = [...homeSubsetRaw, ...tempAvailable];
      const finalPool = applyGlobalPromotions(fullSequenceRaw, homeSubsetRaw.length, 35);

      const pricedHomePageItems = finalPool.slice(0, homeSubsetRaw.length);
      const recentlyAdded = pricedHomePageItems.slice(0, numRecent);
      const popular = pricedHomePageItems.slice(numRecent, numRecent + popularSetRaw.length);
      const dailyBest = pricedHomePageItems.slice(numRecent + popularSetRaw.length, numRecent + popularSetRaw.length + DAILY_SIZE).map(p => ({
        ...p, sold: Math.floor(Math.random() * 80) + 40, total: 150
      }));
      const deals = pricedHomePageItems.slice(numRecent + popularSetRaw.length + DAILY_SIZE, numRecent + popularSetRaw.length + DAILY_SIZE + DEALS_SIZE);
      const topSelling = pricedHomePageItems.slice(numRecent + popularSetRaw.length + DAILY_SIZE + DEALS_SIZE, numRecent + popularSetRaw.length + DAILY_SIZE + DEALS_SIZE + SELLING_SIZE);
      const trending = pricedHomePageItems.slice(numRecent + popularSetRaw.length + DAILY_SIZE + DEALS_SIZE + SELLING_SIZE, numRecent + popularSetRaw.length + DAILY_SIZE + DEALS_SIZE + SELLING_SIZE + TRENDING_SIZE);
      const topPicks = pricedHomePageItems.slice(numRecent + popularSetRaw.length + DAILY_SIZE + DEALS_SIZE + SELLING_SIZE + TRENDING_SIZE);

      return {
        ...prev,
        fullPool: finalPool,
        shopShuffled: shuffleArray(finalPool),
        recentlyAdded,
        popular_all: popular,
        dailyBest,
        deals,
        topSelling,
        trending,
        topPicks,
        categories
      };
    });
  }, []);

  // Ensure store is initialized even if we land directly on Cart/Checkout
  useEffect(() => {
    const autoInit = async () => {
      try {
        if (storeData.fullPool.length === 0) {
          const { products, categories } = await fetchProdAndCat();
          initializeStore(products, categories);
        }
      } catch (error) {
        console.error("Store autoInit error:", error.message);
      }
    };
    autoInit();
  }, [initializeStore, storeData.fullPool.length]);

  return (
    <StoreContext.Provider value={{ storeData, initializeStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
