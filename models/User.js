import mongoose from "mongoose";
const { Schema, model } = mongoose;

// --- QUICKZY USER MODEL TODO ---
// 1. Remove profilepic, coverpic, razorpayid/secret.
// 2. Add phone: String (unique).
// 3. Add address: { text: String, lat: Number, lng: Number, zone: String }.
// 4. Add cart: [{ productId: ObjectId, quantity: Number }].
// 5. Add orders: [ObjectId].

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String },
  username: { type: String, required: true },
  profilepic: { type: String },
  coverpic: { type: String },
  razorpayid: { type: String },
  razorpaysecret: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || model("User", UserSchema);
