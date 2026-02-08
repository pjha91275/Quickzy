import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, default: "Quickzy User" },
  email: { type: String }, // Optional for quick-commerce
  phone: { type: String, unique: true, required: true },
  // --- QUICKZY LOCATION SCHEMA TODO ---
  // The address object should be a nested Schema to ensure all coordinates are captured.
  // - text: For the UI display (e.g. "Apartment 4, Street X")
  // - lat/lng: Numbers for the delivery map
  // - tag: String enum ["Home", "Work", "Other"]
  address: {
    text: { type: String, default: "" },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    zone: { type: String, default: "" },
  },
  cart: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || model("User", UserSchema);
