import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, default: "Quickzy User" },
  email: { type: String, unique: true },
  emailVerified: { type: Date, default: null },
  image: { type: String },
  phone: { type: String }, // Made optional to avoid initial dummy number clashes
  // --- QUICKZY LOCATION SCHEMA INSTRUCTIONS ---
  // text: Stores the human-readable address from LocationIQ (e.g. "Mumbai Central, Sector 2")
  // lat/lng: Float values for precise delivery partner mapping
  // zone: Optional field to group delivery areas (e.g. "Downtown", "Suburbs")
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
