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

  // This "flag" ensures we don't save an empty cart to DB before we finish loading
  const hasLoaded = useRef(false);

  // 1. Initial Load (runs when login state is ready)
  useEffect(() => {
    const loadAppData = async () => {
      // Step A: Load from browser memory first
      const local = localStorage.getItem("quickzy-cart");
      let startingItems = local ? JSON.parse(local) : [];

      // Step B: If logged in, fetch the "Cloud Cart"
      if (status === "authenticated" && session?.user?.email) {
        const dbCart = await fetchCart(session.user.email);
        // If DB has items, they are the most important
        if (dbCart && dbCart.length > 0) {
          startingItems = dbCart;
        }
      }

      // Step C: Update UI and flip the "Ready" flag
      setCartItems(startingItems);
      setTimeout(() => {
        hasLoaded.current = true;
      }, 100); // Small gap to avoid immediate sync
    };

    if (status !== "loading") {
      loadAppData();
    }
  }, [status, session?.user?.email]);

  // 2. Permanent Sync (runs whenever cart changes)
  useEffect(() => {
    if (!hasLoaded.current) return; // STOP: Don't save if we haven't finished loading yet

    // Save to browser
    localStorage.setItem("quickzy-cart", JSON.stringify(cartItems));

    // Save to Atlas DB
    if (status === "authenticated" && session?.user?.email) {
      syncCart(session.user.email, cartItems);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => (item._id || item.id) === (product._id || product.id),
      );
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success("Added to cart!");
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
    localStorage.removeItem("quickzy-cart");
    if (session?.user?.email) syncCart(session.user.email, []);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
