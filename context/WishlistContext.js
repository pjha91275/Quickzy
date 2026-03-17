"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { syncWishlist, fetchWishlist } from "@/actions/useractions";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState([]);
  const hasLoaded = useRef(false);

  // 1. Initial Load
  useEffect(() => {
    const loadWishlist = async () => {
      const local = localStorage.getItem("quickzy-wishlist");
      let startingItems = local ? JSON.parse(local) : [];

      if (status === "authenticated" && session?.user?.email) {
        try {
          const dbWishlist = await fetchWishlist(session.user.email);
          if (dbWishlist && dbWishlist.length > 0) {
            startingItems = dbWishlist;
          }
        } catch (error) {
          console.error("Wishlist loading failed:", error);
        }
      }

      const cleanItems = startingItems.filter(
        (item) => item && (item._id || item.id)
      );

      setWishlistItems(cleanItems);
      setTimeout(() => {
        hasLoaded.current = true;
      }, 150);
    };

    if (status !== "loading") {
      loadWishlist();
    }
  }, [status, session?.user?.email]);

  // 2. Sync
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
        price: product.price,
        oldPrice: product.oldPrice,
        discount: product.discount,
        image: product.image || product.img,
        unit: product.unit || product.weight,
      };
      setWishlistItems(prev => [...prev, sanitized]);
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
