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
        try {
          const dbCart = await fetchCart(session.user.email);
          // If DB has items, they are the most important
          if (dbCart && dbCart.length > 0) {
            startingItems = dbCart;
          }
        } catch (error) {
          console.error("Cart loading failed:", error);
        }
      }

      // Final sanitization to remove any "corrupted" items before state update
      const cleanItems = startingItems.filter(
        (item) =>
          item &&
          item.name &&
          !isNaN(parseFloat(item.price)) &&
          (item.image || item.img),
      );

      // Step C: Update UI and flip the "Ready" flag
      setCartItems(cleanItems);
      // Give a tiny moment for state to settle before allowing sync
      setTimeout(() => {
        hasLoaded.current = true;
      }, 150);
    };

    if (status !== "loading") {
      loadAppData();
    }
  }, [status, session?.user?.email]);

  // 2. Permanent Sync (runs whenever cart changes)
  useEffect(() => {
    // PROTECTIVE GUARD: NEVER sync an empty cart to DB if we haven't finished loading yet
    if (!hasLoaded.current) return;

    // Save to browser
    localStorage.setItem("quickzy-cart", JSON.stringify(cartItems));

    // Save to Atlas DB
    if (status === "authenticated" && session?.user?.email) {
      syncCart(session.user.email, cartItems);
    }
  }, [cartItems, status, session?.user?.email]);

  const addToCart = (product) => {
    // Sanitize product data locally before adding
    const sanitizedProduct = {
      _id: (product._id || product.id)?.toString(),
      name: product.name,
      price: parseFloat(product.price),
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
