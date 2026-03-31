import mongoose from "mongoose";
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  status: { type: String, default: "Processing" }, // Processing, Delivered, Cancelled
  cancelledBy: { type: String, default: null }, // "admin" or "user"
  paymentMethod: { type: String, required: true }, // COD or Online
  paymentStatus: { type: String, default: "Pending" },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expectedDelivery: { type: Date },
});

export default mongoose.models.Order || model("Order", OrderSchema);
