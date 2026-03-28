"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { syncWishlist, fetchWishlist } from "@/actions/useractions";
import { useStore } from "./StoreContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState([]);
  const { storeData } = useStore();
  
  const hasLoaded = useRef(false);
  const lastSyncRef = useRef("");
  const lastToastRef = useRef(0);

  // Load wishlist from local storage or cloud on mount
  useEffect(() => {
    const loadWishlist = async () => {
      const local = localStorage.getItem("quickzy-wishlist");
      let startingItems = local ? JSON.parse(local) : [];

      if (status === "authenticated" && session?.user?.email) {
        try {
          const dbWishlist = await fetchWishlist(session.user.email);
          if (dbWishlist?.length > 0) startingItems = dbWishlist;
        } catch (error) {
          console.error("Wishlist sync failed:", error);
        }
      }

      const cleanItems = (startingItems || []).filter(item => item && (item._id || item.id));

      setWishlistItems(cleanItems);
      hasLoaded.current = true;
    };

    if (status !== "loading") loadWishlist();
  }, [status, session?.user?.email]);

  // Synchronize wishlist prices with the latest store offers
  const performSync = useCallback((currentWishlist, pool) => {
    if (!pool?.length || !currentWishlist?.length) return;

    const productMap = new Map();
    pool.forEach(p => {
      const idStr = (p._id || p.id)?.toString();
      if (idStr) productMap.set(idStr, p);
    });

    let updatesFound = 0;
    const syncedItems = currentWishlist.map(item => {
      const liveProd = productMap.get((item._id || item.id)?.toString());
      if (!liveProd) return item;

      const livePrice = parseFloat(liveProd.price);
      const priceMismatch = Math.abs((item.price || 0) - livePrice) > 0.1;
      const discountMismatch = item.discount !== liveProd.discount;

      if (priceMismatch || discountMismatch) {
        updatesFound++;
        return { 
          ...item, 
          price: livePrice, 
          oldPrice: liveProd.oldPrice, 
          discount: liveProd.discount 
        };
      }
      return item;
    });

    if (updatesFound > 0) {
      const syncFingerprint = syncedItems.map(i => `${i._id}-${i.price}-${i.discount}`).join("|");
      if (syncFingerprint === lastSyncRef.current) return;
      
      lastSyncRef.current = syncFingerprint;
      setWishlistItems(syncedItems);
      
      const now = Date.now();
      if (now - lastToastRef.current > 3000) {
        toast.info("Prices for items in your wishlist have been updated!", {
          className: "bg-[#253D4E] text-[#3BB77E] font-black",
          autoClose: 4000
        });
        lastToastRef.current = now;
      }
    }
  }, []);

  // Sync on data changes and visibility transitions
  useEffect(() => {
    if (!hasLoaded.current || !storeData.fullPool?.length) return;
    
    performSync(wishlistItems, storeData.fullPool);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        performSync(wishlistItems, storeData.fullPool);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [storeData.fullPool, wishlistItems, performSync]);

  // Persistent storage for wishlist
  useEffect(() => {
    if (!hasLoaded.current) return;
    localStorage.setItem("quickzy-wishlist", JSON.stringify(wishlistItems));
    if (status === "authenticated" && session?.user?.email) {
      syncWishlist(session.user.email, wishlistItems);
    }
  }, [wishlistItems, status, session?.user?.email]);

  const toggleWishlist = (product) => {
    const productId = (product._id || product.id)?.toString();
    const isExist = wishlistItems.some(item => (item._id || item.id) === productId);

    if (isExist) {
      setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
      toast.info("Removed from wishlist");
    } else {
      const sanitized = {
        _id: productId,
        name: product.name,
        price: parseFloat(product.price),
        oldPrice: product.oldPrice,
        discount: product.discount,
        image: (product.image || product.img || "").startsWith("http") 
          ? (product.image || product.img) 
          : `https://res.cloudinary.com/dnafzpa8x/image/upload/${(product.image || product.img || "").startsWith("/") ? (product.image || product.img).slice(1) : (product.image || product.img) || "v1774149230/quickzy/brand/logo_without_name.png"}`,
        unit: product.unit || product.weight,
      };
      setWishlistItems(prev => [sanitized, ...prev]);
      toast.success("Added to wishlist!");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId?.toString());
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
