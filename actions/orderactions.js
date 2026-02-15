"use server";
import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import User from "@/models/User";
import Razorpay from "razorpay";

export const initiateRazorpayOrder = async (amount) => {
  // Simple Razorpay setup
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await instance.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
  });

  return order.id;
};

export const createOrder = async (orderData) => {
  try {
    await connectDb();

    // Set delivery for 15 mins later
    const expected = new Date();
    expected.setMinutes(expected.getMinutes() + 15);

    const newOrder = await Order.create({
      ...orderData,
      expectedDelivery: expected,
    });

    // Save to user history
    await User.findOneAndUpdate(
      { email: orderData.userEmail },
      { $push: { orders: newOrder._id } },
    );

    return { success: true, orderId: newOrder._id.toString() };
  } catch (err) {
    return { success: false };
  }
};

export const fetchUserOrders = async (email) => {
  await connectDb();
  const orders = await Order.find({ userEmail: email })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(orders));
};
