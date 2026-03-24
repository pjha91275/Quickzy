import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, required: true, enum: ["percentage", "flat"] },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Coupon || model("Coupon", CouponSchema);
