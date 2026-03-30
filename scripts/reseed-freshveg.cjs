const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, required: true, enum: ["percentage", "flat"] },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  usageLimitPerUser: { type: Number, default: 1 },
  totalUsageLimit: { type: Number, default: 100 },
  totalUsedCount: { type: Number, default: 0 },
  usedBy: [{ email: String, count: Number }],
  freeDelivery: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

async function seedFreshVeg() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    const freshVegCoupon = {
      code: "FRESHVEG",
      discountType: "flat",
      discountValue: 50,
      minOrderAmount: 150,
      isActive: true,
      freeDelivery: false
    };

    console.log("Seeding FRESHVEG coupon...");
    await Coupon.findOneAndUpdate({ code: "FRESHVEG" }, freshVegCoupon, { upsert: true });

    console.log("Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding coupon:", error);
    process.exit(1);
  }
}

seedFreshVeg();
