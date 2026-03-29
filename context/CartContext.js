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
import { syncCart, fetchCart } from "@/actions/useractions";
import { useStore } from "./StoreContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { storeData } = useStore();
  
  const hasLoaded = useRef(false);
  const lastSyncRef = useRef(""); // To prevent infinite sync loops
  const lastToastRef = useRef(0);

  // Initial load from local storage or database
  useEffect(() => {
    const loadAppData = async () => {
      const local = localStorage.getItem("quickzy-cart");
      let startingItems = local ? JSON.parse(local) : [];

      if (status === "authenticated" && session?.user?.email) {
        try {
          const dbCart = await fetchCart(session.user.email);
          if (dbCart?.length > 0) startingItems = dbCart;
        } catch (error) {
          console.error("Cart sync failed:", error);
        }
      }

      const cleanItems = (startingItems || []).filter(item => 
        item?.name && !isNaN(parseFloat(item.price)) && (item.image || item.img)
      );

      const localCoupon = localStorage.getItem("quickzy-coupon");
      if (localCoupon) setAppliedCoupon(JSON.parse(localCoupon));

      setCartItems(cleanItems);
      hasLoaded.current = true;
    };

    if (status !== "loading") loadAppData();
  }, [status, session?.user?.email]);

  // Algorithm: Hash Map Lookup (O(1) average lookup for price synchronization)
  const performSync = useCallback((currentCart, pool) => {
    if (!pool?.length || !currentCart?.length) return;

    const productMap = new Map();
    pool.forEach(p => {
      const idStr = (p._id || p.id)?.toString();
      if (idStr) productMap.set(idStr, p);
    });

    let updatesFound = 0;
    const syncedItems = currentCart.map(item => {
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
      // Create a unique fingerprint of the current prices to avoid double-syncing
      const syncFingerprint = syncedItems.map(i => `${i._id}-${i.price}-${i.discount}`).join("|");
      if (syncFingerprint === lastSyncRef.current) return;
      
      lastSyncRef.current = syncFingerprint;
      setCartItems(syncedItems);
      
      const now = Date.now();
      if (now - lastToastRef.current > 3000) {
        // Price update toast disabled as per user request to avoid noise on reload
        lastToastRef.current = now;
      }
    }
  }, []);

  // Effect to watch pool changes and visibility transitions
  useEffect(() => {
    if (!hasLoaded.current || !storeData.fullPool?.length) return;
    
    // Immediate check whenever pool or cart items change
    performSync(cartItems, storeData.fullPool);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        performSync(cartItems, storeData.fullPool);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [storeData.fullPool, cartItems, performSync]);

  // Save changes to storage
  useEffect(() => {
    if (!hasLoaded.current) return;
    localStorage.setItem("quickzy-cart", JSON.stringify(cartItems));

    if (status === "authenticated" && session?.user?.email) {
      syncCart(session.user.email, cartItems);
    }
  }, [cartItems, status, session?.user?.email]);

  const addToCart = (product) => {
    const sanitizedProduct = {
      _id: (product._id || product.id)?.toString(),
      name: product.name,
      price: parseFloat(product.price),
      oldPrice: product.oldPrice,
      discount: product.discount,
      image: (product.image || product.img || "").startsWith("http") 
        ? (product.image || product.img) 
        : `https://res.cloudinary.com/dnafzpa8x/image/upload/${(product.image || product.img || "").startsWith("/") ? (product.image || product.img).slice(1) : (product.image || product.img) || "v1774149230/quickzy/brand/logo_without_name.png"}`,
      unit: product.unit || product.weight,
    };

    setCartItems(prev => {
      const existing = prev.find(i => (i._id || i.id) === sanitizedProduct._id);
      if (existing) {
        return prev.map(i => (i._id || i.id) === sanitizedProduct._id 
          ? { ...i, quantity: (i.quantity || 1) + 1 } 
          : i);
      }
      return [{ ...sanitizedProduct, quantity: 1 }, ...prev];
    });

    const hasLocation = localStorage.getItem("quickzy-guest-location") || session?.user?.address?.text;
    if (!hasLocation) {
      window.dispatchEvent(new CustomEvent("open-location", { detail: { compulsory: false } }));
    }
    toast.success("Added to cart!", { autoClose: 1000 });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(i => (i._id || i.id) !== productId));
    toast.info("Removed from cart");
  };

  const updateQuantity = (productId, amount) => {
    setCartItems(prev => {
      const item = prev.find(i => (i._id || i.id) === productId);
      if (!item) return prev;
      const q = (item.quantity || 1) + amount;
      if (q <= 0) {
        return prev.filter(i => (i._id || i.id) !== productId);
      }
      return prev.map(i => (i._id || i.id) === productId ? { ...i, quantity: q } : i);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem("quickzy-cart");
    localStorage.removeItem("quickzy-coupon");
    if (session?.user?.email) syncCart(session.user.email, []);
  };

  const saveCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    if (coupon) {
      localStorage.setItem("quickzy-coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("quickzy-coupon");
    }
  };

  const getProductPrices = (item) => {
    const qty = parseInt(item.quantity) || 1;
    const currentPriceBase = parseFloat(item.price) || 0;
    const mrp = parseFloat(item.oldPrice) || currentPriceBase;
    const originalDiscountPercent = item.discount 
      ? parseFloat(String(item.discount).replace("%", "")) 
      : (mrp > currentPriceBase ? ((mrp - currentPriceBase) / mrp * 100) : 0);
    
    const comboDiscountPercent = qty >= 2 ? 10 : 0;
    const totalDiscountPercent = originalDiscountPercent + comboDiscountPercent;
    const finalPricePerUnit = mrp * (1 - totalDiscountPercent / 100);
    
    return {
      itemTotalCurrent: finalPricePerUnit * qty,
      itemTotalOld: mrp * qty,
      hasDiscount: totalDiscountPercent > 0,
      originalDiscount: originalDiscountPercent,
      comboDiscount: comboDiscountPercent,
      totalDiscount: totalDiscountPercent,
      isCombo: qty >= 2,
      mrp: mrp,
      unitPriceCurrent: finalPricePerUnit
    };
  };

  const itemTotalCurrent = cartItems.reduce((acc, item) => acc + getProductPrices(item).itemTotalCurrent, 0);
  const itemTotalOld = cartItems.reduce((acc, item) => acc + getProductPrices(item).itemTotalOld, 0);
  const hasCartDiscount = itemTotalOld > itemTotalCurrent;

  const baseHandlingFee = Math.min(30, Math.max(2, itemTotalCurrent * 0.02));
  const baseDeliveryFee = Math.min(300, Math.max(20, itemTotalCurrent * 0.20));
  const handlingFeeOld = Math.min(30 * 1.5, baseHandlingFee * 1.5);
  const deliveryFeeOld = Math.min(300 * 1.5, baseDeliveryFee * 1.5);

  const isFreeFees = appliedCoupon && (
    appliedCoupon.code.toLowerCase().includes("first") || 
    appliedCoupon.code.toLowerCase().includes("free") || 
    appliedCoupon.freeDelivery === true
  );

  const handlingFeeCurrent = isFreeFees ? 0 : baseHandlingFee;
  const deliveryFeeCurrent = isFreeFees ? 0 : baseDeliveryFee;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = itemTotalCurrent * (appliedCoupon.discountValue / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    if (isFreeFees) discountAmount += (baseHandlingFee + baseDeliveryFee);
    const maxDiscount = itemTotalCurrent + (isFreeFees ? (baseHandlingFee + baseDeliveryFee) : 0);
    if (discountAmount > maxDiscount) discountAmount = maxDiscount;
  }

  useEffect(() => {
    if (!hasLoaded.current) return;
    if (appliedCoupon && itemTotalCurrent > 0 && appliedCoupon.minOrderAmount > 0) {
      if (itemTotalCurrent < appliedCoupon.minOrderAmount) {
         toast.warning(`Coupon removed. Min order is ₹${appliedCoupon.minOrderAmount}`);
         saveCoupon(null);
      }
    }
    if (hasLoaded.current && itemTotalCurrent === 0 && appliedCoupon) {
      saveCoupon(null);
    }
  }, [itemTotalCurrent, appliedCoupon]);

  const totalItemsCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
  const grandTotal = Math.max(0, (itemTotalCurrent || 0) + (baseHandlingFee || 0) + (baseDeliveryFee || 0) - (discountAmount || 0));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal: itemTotalCurrent,
        totalItemsCount,
        itemTotalCurrent,
        itemTotalOld,
        hasCartDiscount,
        handlingFeeCurrent,
        handlingFeeOld,
        deliveryFeeCurrent,
        deliveryFeeOld,
        isFreeFees,
        total: grandTotal,
        discountAmount,
        appliedCoupon,
        saveCoupon,
        getProductPrices
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
