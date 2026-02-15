"use server";
import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import User from "@/models/User";

export const createOrder = async (orderData) => {
  try {
    await connectDb();

    // Calculate expected delivery: 15-20 minutes from now
    const now = new Date();
    const expected = new Date(now.getTime() + 20 * 60000);

    const newOrder = await Order.create({
      ...orderData,
      expectedDelivery: expected,
    });

    // Update user's order history
    await User.findOneAndUpdate(
      { email: orderData.userEmail },
      { $push: { orders: newOrder._id } },
    );

    return { success: true, orderId: newOrder._id.toString() };
  } catch (err) {
    return { success: false, error: "Order placement failed" };
  }
};

export const fetchUserOrders = async (email) => {
  try {
    await connectDb();
    const orders = await Order.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(orders));
  } catch (err) {
    return [];
  }
};
