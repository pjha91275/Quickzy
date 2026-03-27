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

// 1. Cleaner: Removes all previous discount/tag data and normalizes URLs
const preparePool = (pool) => {
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

// 2. Strict Discounter: Applied to a specific set of items (Home subset or Shop total)
const applyStrictDiscounts = (items, targetPercent) => {
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

      // STEP 1: Get a clean, normalized pool
      const cleanPool = preparePool(products);

      // STEP 2: Find "The True Top 3" recently added
      const sortedByDate = [...cleanPool].sort((a,b) => {
        return (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime();
      });
      const top3RecentItems = shuffleArray(sortedByDate.slice(0, 3));
      const recentIds = new Set(top3RecentItems.map(r => r._id || r.id));

      // STEP 3: Create the Home Page Assembly Pool (remaining items)
      let availableForHome = shuffleArray(cleanPool.filter(p => !recentIds.has(p._id || p.id)));

      // Assemble Home Sections (Target: ~35 distinct items)
      // A. Popular (1 from each category)
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
      
      // Pad popular to 15 if needed
      while (popularSet.length < 15 && availableForHome.length > 0) {
        popularSet.push(availableForHome.shift());
      }

      // B. Sequential Section Fills
      const dailyBest = availableForHome.splice(0, 4).map(p => ({
        ...p, sold: Math.floor(Math.random() * 100) + 50, total: 200
      }));
      const deals = availableForHome.splice(0, 4);
      const topSelling = availableForHome.splice(0, 3);
      const trending = availableForHome.splice(0, 3);
      const topPicks = availableForHome.splice(0, 3);

      // STEP 4: Apply 35% Discount Rule specifically to the Home Page subset
      // We take ALL distinct products chosen for Home Page
      const allHomeItemsRaw = [
        ...top3RecentItems,
        ...popularSet,
        ...dailyBest,
        ...deals,
        ...topSelling,
        ...trending,
        ...topPicks
      ];

      // Deeply unique the set just in case (though logic above should ensure uniqueness)
      const homeIdMap = new Map(allHomeItemsRaw.map(p => [p._id || p.id, p]));
      const homeSubsetRaw = Array.from(homeIdMap.values());
      const homeSubsetDecorated = applyStrictDiscounts(homeSubsetRaw, 35);
      
      // Remap the decorated items back to their sections
      const getHomeDec = (rawArr) => {
        const decMap = new Map(homeSubsetDecorated.map(p => [p._id || p.id, p]));
        return rawArr.map(p => decMap.get(p._id || p.id) || p);
      };

      // STEP 5: Apply 35% Discount Rule specifically to the SHOP Page pool (Whole catalog)
      const shopPoolDecorated = applyStrictDiscounts([...cleanPool], 35);

      return {
        ...prev,
        fullPool: cleanPool,
        shopShuffled: shuffleArray(shopPoolDecorated),
        recentlyAdded: getHomeDec(top3RecentItems),
        popular_all: getHomeDec(popularSet),
        dailyBest: getHomeDec(dailyBest),
        deals: getHomeDec(deals),
        topSelling: getHomeDec(topSelling),
        trending: getHomeDec(trending),
        topPicks: getHomeDec(topPicks),
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

