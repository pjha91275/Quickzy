"use server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

// Get user cart from database
export const fetchCart = async (email) => {
  if (!email) return [];
  await connectDb();
  const user = await User.findOne({ email: email.toLowerCase() }).lean();

  if (user?.cart) {
    return JSON.parse(JSON.stringify(user.cart));
  }
  return [];
};

// Get user wishlist items
export const fetchWishlist = async (email) => {
  if (!email) return [];
  await connectDb();
  const user = await User.findOne({ email: email.toLowerCase() }).lean();
  if (user?.wishlist) {
    return JSON.parse(JSON.stringify(user.wishlist));
  }
  return [];
};

// Update user cart in database
export const syncCart = async (email, cart) => {
  if (!email) return;
  await connectDb();
  await User.updateOne(
    { email: email.toLowerCase() },
    { $set: { cart: cart } },
  );
};

// Update user wishlist in database
export const syncWishlist = async (email, wishlist) => {
  if (!email) return;
  await connectDb();
  await User.updateOne(
    { email: email.toLowerCase() },
    { $set: { wishlist: wishlist } },
  );
};

// Update personal information like name, phone, address
export const updateProfile = async (email, updateData) => {
  try {
    if (!email) return { success: false };
    await connectDb();

    await User.updateOne({ email: email.toLowerCase() }, { $set: updateData });

    return { success: true };
  } catch (err) {
    console.error("updateProfile error:", err.message);
    return { success: false };
  }
};

// Save checkout specific details
export const saveCheckoutDetails = async (email, details) => {
  return await updateProfile(email, {
    name: details.name,
    phone: details.phone,
    "address.text": details.address,
  });
};

// Validate if a coupon code can be applied
export const validateCoupon = async (code, cartSubtotal, userEmail) => {
  if (!code) return { success: false, message: "Please enter a code" };
  
  await connectDb();
  // Algorithm: Data Model Import & MongoDB Query (B-Tree index lookup)
  const Coupon = (await import("@/models/Coupon")).default;
  
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
  
  if (!coupon) {
    return { success: false, message: "Invalid or expired coupon" };
  }
  
  if (coupon.minOrderAmount > 0 && cartSubtotal < coupon.minOrderAmount) {
    return { success: false, message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` };
  }
  
  // Check global usage limit
  if (coupon.totalUsedCount >= coupon.totalUsageLimit) {
    return { success: false, message: "Coupon global usage limit reached" };
  }

  // Check per user usage limit
  if (userEmail && coupon.usedBy) {
    const userUsage = coupon.usedBy.find(u => u.email === userEmail.toLowerCase());
    if (userUsage && userUsage.count >= coupon.usageLimitPerUser) {
      return { success: false, message: `You have already used this coupon ${userUsage.count} time(s). Limit reached!` };
    }
  }
  
  return { 
    success: true, 
    coupon: JSON.parse(JSON.stringify(coupon)) 
  };
};

// Get list of all currently active coupons
export const getActiveCoupons = async () => {
  try {
    await connectDb();
    const Coupon = (await import("@/models/Coupon")).default;
    const activeCoupons = await Coupon.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(activeCoupons));
  } catch (error) {
    console.error("getActiveCoupons error:", error.message);
    return [];
  }
};
