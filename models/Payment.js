import mongoose from "mongoose";
import { Schema, model } from "mongoose";

// --- QUICKZY PAYMENT MODEL TODO ---
// 1. Rename to_user to 'email' or 'phone' (customer identifier).
// 2. Remove 'message'.
// 3. Add 'address' (delivery endpoint).
// 4. Ensure 'done' is a Boolean.

const PaymentSchema = new Schema({
  name: { type: String, required: true },
  to_user: { type: String, required: true },
  oid: { type: String, required: true },
  message: { type: String },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  done: { type: Boolean, default: false },
});

export default mongoose.models.Payment || model("Payment", PaymentSchema);
