"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const StoreContext = createContext();


const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const decoratePool = (pool) => {
  // 35% get discounts
  const discountCount = Math.floor(pool.length * 0.35);
  const shuffledForDiscounts = shuffleArray(pool);
  
  // Pick first X for discounts
  const discountIds = new Set(shuffledForDiscounts.slice(0, discountCount).map(p => p._id || p.id));
  
  // Discount range 5% to 35%
  const getRandDiscount = () => Math.floor(Math.random() * (35 - 5 + 1)) + 5;

  return pool.map(p => {
    if (discountIds.has(p._id || p.id)) {
      const discPercent = getRandDiscount();
      const discValue = `${discPercent}%`;
      const oldPrice = p.price;
      const newPrice = Math.floor(oldPrice * (1 - discPercent / 100));
      
      return {
        ...p,
        price: newPrice,
        oldPrice: oldPrice,
        discount: discValue,
        tag: "Hot Deal",
        tagColor: "bg-[#f74b81] italic uppercase"
      };
    }
    const cleanProd = { ...p };
    delete cleanProd.oldPrice;
    delete cleanProd.discount;
    delete cleanProd.tag;
    delete cleanProd.tagColor;
    return cleanProd;
  });
};

export const StoreProvider = ({ children }) => {
  const [storeData, setStoreData] = useState({
    shuffledSections: {},
    fullPool: [],
    shopShuffled: [],
    popular_all: [],
    categories: [],
    recentlyAdded: [],
    topSelling: [],
    trending: [],
    topPicks: [],
    dailyBest: [],
    deals: []
  });

  const initializeStore = React.useCallback((products, categories) => {
    setStoreData(prev => {
      if (!products?.length || prev.recentlyAdded?.length > 0) return prev;

      // 1. Decorate ALL products first so discounts are consistent across Home and Shop
      const decoratedAll = decoratePool(products);

      // 2. Identification of the True Recents (Top 5 -> Shuffle -> Top 3)
      const allSortedByDate = [...decoratedAll].sort((a,b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      const top5Recents = allSortedByDate.slice(0, 5);
      const recentlyAddedArr = shuffleArray(top5Recents).slice(0, 3);
      const recentIds = new Set(recentlyAddedArr.map(r => r._id || r.id));

      // 3. Prepare the diminishing pool (exclude the 3 recents)
      let availablePool = shuffleArray(decoratedAll.filter(p => !recentIds.has(p._id || p.id)));
      
      // 4. SEQUENTIAL UNIQUE FILLING
      
      // A. Popular All (Initial selection: 1 per category, random category order)
      const popularAll = [];
      const shuffledCategories = shuffleArray(categories);
      
      shuffledCategories.forEach(cat => {
        const itemIndex = availablePool.findIndex(p => 
          (p.category || "").toLowerCase() === (cat.name || "").toLowerCase()
        );
        if (itemIndex > -1) {
          popularAll.push({ ...availablePool[itemIndex], source: 'category-fill' });
          availablePool.splice(itemIndex, 1);
        }
      });
      
      // Fill remaining to reach 15 (as many sections expect ~10-15 popular items)
      while (popularAll.length < 15 && availablePool.length > 0) {
        popularAll.push(availablePool.shift());
      }
      
      // B. Daily Best (4)
      const dailyBest = availablePool.splice(0, 4).map(p => ({
        ...p,
        sold: Math.floor(Math.random() * 100) + 50,
        total: 200,
      }));
      
      // C. Deals (4)
      const deals = availablePool.splice(0, 4).map(p => ({ ...p, bg: "bg-gray-50" }));
      
      // D. Sections (3 each)
      const topSelling = availablePool.splice(0, 3);
      const trending = availablePool.splice(0, 3);
      const topPicks = availablePool.splice(0, 3);

      return {
        ...prev,
        fullPool: decoratedAll,
        shopShuffled: shuffleArray(decoratedAll), // Global shop page uses the same decorated pool
        recentlyAdded: recentlyAddedArr,
        popular_all: popularAll,
        dailyBest,
        deals,
        topSelling,
        trending,
        topPicks,
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
