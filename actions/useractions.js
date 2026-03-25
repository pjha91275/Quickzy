"use server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

// 1. Fetch Cart
export const fetchCart = async (email) => {
  if (!email) return [];
  await connectDb();
  const user = await User.findOne({ email: email.toLowerCase() }).lean();

  // Convert BSON to plain object
  if (user?.cart) {
    return JSON.parse(JSON.stringify(user.cart));
  }
  return [];
};

// 1b. Fetch Wishlist
export const fetchWishlist = async (email) => {
  if (!email) return [];
  await connectDb();
  const user = await User.findOne({ email: email.toLowerCase() }).lean();
  if (user?.wishlist) {
    return JSON.parse(JSON.stringify(user.wishlist));
  }
  return [];
};

// 2. Sync Cart
export const syncCart = async (email, cart) => {
  if (!email) return;
  await connectDb();
  await User.updateOne(
    { email: email.toLowerCase() },
    { $set: { cart: cart } },
  );
};

// 2b. Sync Wishlist
export const syncWishlist = async (email, wishlist) => {
  if (!email) return;
  await connectDb();
  await User.updateOne(
    { email: email.toLowerCase() },
    { $set: { wishlist: wishlist } },
  );
};

// 3. Update Profile (Name, Phone, Address)
export const updateProfile = async (email, updateData) => {
  try {
    if (!email) return { success: false };
    await connectDb();

    await User.updateOne({ email: email.toLowerCase() }, { $set: updateData });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

// 4. Save Details (Used in Checkout)
export const saveCheckoutDetails = async (email, details) => {
  return await updateProfile(email, {
    name: details.name,
    phone: details.phone,
    "address.text": details.address,
  });
};

// 5. Validate Coupon Code
export const validateCoupon = async (code, cartSubtotal, userEmail) => {
  if (!code) return { success: false, message: "Please enter a code" };
  
  await connectDb();
  const Coupon = (await import("@/models/Coupon")).default;
  
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
  
  if (!coupon) {
    return { success: false, message: "Invalid or expired coupon" };
  }
  
  if (coupon.minOrderAmount > 0 && cartSubtotal < coupon.minOrderAmount) {
    return { success: false, message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` };
  }
  
  // Total usage limit check
  if (coupon.totalUsedCount >= coupon.totalUsageLimit) {
    return { success: false, message: "Coupon global usage limit reached" };
  }

  // Per user usage limit check
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

// 6. Fetch Active Coupons
export const getActiveCoupons = async () => {
  try {
    await connectDb();
    const Coupon = (await import("@/models/Coupon")).default;
    const activeCoupons = await Coupon.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(activeCoupons));
  } catch (error) {
    return [];
  }
};
