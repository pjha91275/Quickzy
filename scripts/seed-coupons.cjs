const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

// Seed coupons for shop promotions
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

async function seedCoupons() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    const coupons = [
      {
        code: "WELCOME50",
        discountType: "percentage",
        discountValue: 50,
        minOrderAmount: 200,
        isActive: true,
        freeDelivery: false
      },
      {
        code: "FLAT100",
        discountType: "flat",
        discountValue: 100,
        minOrderAmount: 500,
        isActive: true,
        freeDelivery: false
      },
      {
        code: "NEWUSER",
        discountType: "percentage",
        discountValue: 100,
        minOrderAmount: 0,
        isActive: true,
        freeDelivery: true
      },
      {
        code: "FREEDELIVERY",
        discountType: "flat",
        discountValue: 0,
        minOrderAmount: 300,
        isActive: true,
        freeDelivery: true
      },
      {
        code: "FIRSTORDER",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 0,
        isActive: true,
        freeDelivery: true
      }
    ];

    console.log(`Syncing ${coupons.length} coupons...`);
    for (let c of coupons) {
      await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
    }

    // Remove legacy coupons
    const legacyCoupons = ["DIWALI20", "FRESHVEG"];
    await Coupon.deleteMany({ code: { $in: legacyCoupons } });
    console.log("Cleaned up legacy coupons.");

    console.log("Seeding Complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();
