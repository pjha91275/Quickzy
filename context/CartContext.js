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
import { syncCart, fetchCart } from "@/actions/useractions";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);

  // Prevent empty db sync on load
  const hasLoaded = useRef(false);

  // Load initial cart
  useEffect(() => {
    const loadAppData = async () => {
      // Get local cart
      const local = localStorage.getItem("quickzy-cart");
      let startingItems = local ? JSON.parse(local) : [];

      // Get db cart if logged in
      if (status === "authenticated" && session?.user?.email) {
        try {
          const dbCart = await fetchCart(session.user.email);
          if (dbCart && dbCart.length > 0) {
            startingItems = dbCart;
          }
        } catch (error) {
          console.error("Cart loading failed:", error);
        }
      }

      // Sanitize cart items
      const cleanItems = startingItems.filter(
        (item) =>
          item &&
          item.name &&
          !isNaN(parseFloat(item.price)) &&
          (item.image || item.img),
      );

      // Update state
      setCartItems(cleanItems);
      setTimeout(() => {
        hasLoaded.current = true;
      }, 150);
    };

    if (status !== "loading") {
      loadAppData();
    }
  }, [status, session?.user?.email]);

  // Sync cart changes
  useEffect(() => {
    // Wait for load before sync
    if (!hasLoaded.current) return;

    // Save to browser
    localStorage.setItem("quickzy-cart", JSON.stringify(cartItems));

    // Save to Atlas DB
    if (status === "authenticated" && session?.user?.email) {
      syncCart(session.user.email, cartItems);
    }
  }, [cartItems, status, session?.user?.email]);

  const addToCart = (product) => {
    // Format product for cart
    const sanitizedProduct = {
      _id: (product._id || product.id)?.toString(),
      name: product.name,
      price: parseFloat(product.price),
      oldPrice: product.oldPrice,
      discount: product.discount,
      image: product.image || product.img,
      unit: product.unit || product.weight,
    };

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => (item._id || item.id) === sanitizedProduct._id,
      );
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === sanitizedProduct._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }
      return [...prev, { ...sanitizedProduct, quantity: 1 }];
    });

    // Check location
    const hasLocation = localStorage.getItem("quickzy-guest-location") || session?.user?.address?.text;
    if (!hasLocation) {
      window.dispatchEvent(new CustomEvent("open-location", { detail: { compulsory: false } }));
    }

    toast.success("Added to cart!", { autoClose: 1000 });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => (item._id || item.id) !== productId),
    );
    toast.info("Removed from cart");
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if ((item._id || item.id) === productId) {
          const q = (item.quantity || 1) + amount;
          return q > 0 ? { ...item, quantity: q } : item;
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem("quickzy-cart");
    localStorage.removeItem("quickzy-coupon");
    if (session?.user?.email) syncCart(session.user.email, []);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load cached coupon
  useEffect(() => {
    const savedCoupon = localStorage.getItem("quickzy-coupon");
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }
  }, []);

  const saveCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    if (coupon) {
      localStorage.setItem("quickzy-coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("quickzy-coupon");
    }
  };

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = subtotal * (appliedCoupon.discountValue / 100);
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    // Cap discount
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }
  }

  // Validate coupon against subtotal
  useEffect(() => {
    if (appliedCoupon && subtotal > 0 && appliedCoupon.minOrderAmount > 0) {
      if (subtotal < appliedCoupon.minOrderAmount) {
         toast.warning(`Coupon removed. Min order is ₹${appliedCoupon.minOrderAmount}`);
         saveCoupon(null);
      }
    }
    if (subtotal === 0 && appliedCoupon) {
      saveCoupon(null);
    }
  }, [subtotal, appliedCoupon]);

  const total = subtotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        total,
        discountAmount,
        appliedCoupon,
        saveCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
