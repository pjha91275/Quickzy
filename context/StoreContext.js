"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const StoreContext = createContext();

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const getAbsoluteUrl = (path) => {
  if (!path) return "https://res.cloudinary.com/dnafzpa8x/image/upload/v1774149230/quickzy/brand/logo_without_name.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `https://res.cloudinary.com/dnafzpa8x/image/upload/${path.slice(1)}`;
  return `https://res.cloudinary.com/dnafzpa8x/image/upload/${path}`;
};

// Normalizes image URLs from various sources and provides a default fallback
const normalizeProductData = (pool) => {
  if (!pool || pool.length === 0) return [];
  return pool.map(p => {
    const rawImg = p.image || p.img;
    return {
      ...p,
      image: getAbsoluteUrl(rawImg),
      img: getAbsoluteUrl(rawImg),
      price: p.originalPrice || p.price,
      oldPrice: null,
      discount: null,
      tag: null,
      tagColor: null,
      originalPrice: p.originalPrice || p.price
    };
  });
};

// Applies strict percentage-based discounts to a subset of products
const applyDynamicPricing = (items, targetPercent) => {
  if (!items || items.length === 0) return [];
  
  const discountCount = Math.floor(items.length * (targetPercent / 100));
  const shuffledIds = shuffleArray(items.map(p => p._id || p.id));
  const discountIds = new Set(shuffledIds.slice(0, discountCount));
  
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

  const initializeStore = React.useCallback((products, categories) => {
    setStoreData(prev => {
      if (!products?.length || prev.recentlyAdded?.length > 0) return prev;

      // Initialize normalized data pool
      const cleanPool = normalizeProductData(products);

      // Apply dynamic discount engine across the entire catalog
      // Ensures pricing consistency across product detail and grid views
      const globalDiscountedPool = applyDynamicPricing(cleanPool, 35);
      const poolMap = new Map(globalDiscountedPool.map(p => [p._id || p.id, p]));

      // Extract recently added items (Top 3 by timestamp)
      const sortedByDate = [...globalDiscountedPool].sort((a,b) => {
        return (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime();
      });
      const top3RecentItems = shuffleArray(sortedByDate.slice(0, 3));
      const recentIds = new Set(top3RecentItems.map(r => r._id || r.id));

      // Assemble Home Page collection from remaining inventory
      let availableForHome = shuffleArray(globalDiscountedPool.filter(p => !recentIds.has(p._id || p.id)));

      // Select popular items (One from each category where available)
      const popularSet = [];
      const catsForHome = shuffleArray(categories || []);
      catsForHome.forEach(cat => {
        const itemIdx = availableForHome.findIndex(p => 
          (p.category || "").toLowerCase() === (cat.name || "").toLowerCase()
        );
        if (itemIdx > -1) {
          popularSet.push(availableForHome[itemIdx]);
          availableForHome.splice(itemIdx, 1);
        }
      });
      
      while (popularSet.length < 15 && availableForHome.length > 0) {
        popularSet.push(availableForHome.shift());
      }

      // Populate feature sections
      const dailyBest = availableForHome.splice(0, 4).map(p => ({
        ...p, sold: Math.floor(Math.random() * 100) + 50, total: 200
      }));
      const deals = availableForHome.splice(0, 4);
      const topSelling = availableForHome.splice(0, 3);
      const trending = availableForHome.splice(0, 3);
      const topPicks = availableForHome.splice(0, 3);

      return {
        ...prev,
        fullPool: globalDiscountedPool,
        shopShuffled: shuffleArray(globalDiscountedPool),
        recentlyAdded: top3RecentItems,
        popular_all: popularSet,
        dailyBest: dailyBest,
        deals: deals,
        topSelling: topSelling,
        trending: trending,
        topPicks: topPicks,
        categories
      };
    });
  }, []);

  return (
    <StoreContext.Provider value={{ storeData, initializeStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

