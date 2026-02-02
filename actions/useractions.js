"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

// --- QUICKZY USER ACTIONS TODO ---
// 1. initiate: Create Razorpay order using site-wide keys. Store pending Payment with user phone & address.
// 2. fetchUser: Get full user profile by phone number (for session synchronization).
// 3. updateProfile: Update name, phone, or address fields.
// 4. cartActions: (Future) Server actions to push/pull items to user.cart array.

export const initiate = async (amount, to_username, paymentform) => {
  await connectDb();
  let user = await User.findOne({ username: to_username });
  const secret = user.razorpaysecret;

  var instance = new Razorpay({
    key_id: user.razorpayid,
    key_secret: secret,
  });

  let options = {
    amount: Number.parseInt(amount),
    currency: "INR",
  };

  let x = await instance.orders.create(options);
  //Create a payment object which shows a pending payment in the database
  await Payment.create({
    oid: x.id,
    amount: amount / 100,
    to_user: to_username,
    name: paymentform.name,
    message: paymentform.message,
  });

  return x;
};

export const fetchUser = async (username) => {
  await connectDb();
  let u = await User.findOne({ username: username });
  if (!u) {
    return null;
  }
  let user = u.toObject({ flattenObjectIds: true });
  return user;
};

export const fetchPayments = async (username) => {
  await connectDb();
  //find all payments sorted by decreasing order of amount and flatten object ids
  let p = await Payment.find({ to_user: username, done: true })
    .sort({ amount: -1 })
    .lean();
  // Convert ObjectId and Date objects to plain strings to ensure serialization
  return p.map((d) => ({
    ...d,
    _id: d._id?.toString(),
    createdAt: d.createdAt?.toISOString(),
    updatedAt: d.updatedAt?.toISOString(),
  }));
};

export const updateProfile = async (data, oldusername) => {
  await connectDb();
  let ndata = Object.fromEntries(data);

  //if the username is being updated check if the username is valid
  if (oldusername !== ndata.username) {
    let u = await User.findOne({ username: ndata.username });
    if (u) {
      return { error: "Username already exists" };
    }
    await User.updateOne({ email: ndata.email }, ndata);
    //Now update all the username in the Payments table
    await Payment.updateMany(
      { to_user: oldusername },
      { to_user: ndata.username },
    );
  } else {
    await User.updateOne({ email: ndata.email }, ndata);
  }
};
