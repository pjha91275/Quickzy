"use server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

// 1. Fetch Cart
export const fetchCart = async (email) => {
  if (!email) return [];
  await connectDb();
  // We use lowercase to be safe
  const user = await User.findOne({ email: email.toLowerCase() }).lean();

  // CRITICAL FIX: Convert MongoDB complex objects (liike _id) to plain strings
  // This solves the "Only plain objects can be passed to Client Components" error.
  if (user?.cart) {
    return JSON.parse(JSON.stringify(user.cart));
  }
  return [];
};

// 2. Sync Cart
export const syncCart = async (email, cart) => {
  if (!email) return;
  await connectDb();
  // Simple, direct update
  await User.updateOne(
    { email: email.toLowerCase() },
    { $set: { cart: cart } },
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
