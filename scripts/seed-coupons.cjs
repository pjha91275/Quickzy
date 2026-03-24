const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, required: true, enum: ["percentage", "flat"] },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

async function seedCoupons() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const coupons = [
      {
        code: "WELCOME50",
        discountType: "percentage",
        discountValue: 50,
        minOrderAmount: 200,
        isActive: true,
      },
      {
        code: "FLAT100",
        discountType: "flat",
        discountValue: 100,
        minOrderAmount: 500,
        isActive: true,
      },
      {
        code: "NEWUSER",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 0,
        isActive: true,
      },
      {
        code: "FRESHVEG",
        discountType: "flat",
        discountValue: 50,
        minOrderAmount: 150,
        isActive: true,
      },
      {
        code: "DIWALI20",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 1000,
        isActive: true,
      }
    ];

    for (let c of coupons) {
      await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
    }

    console.log("Successfully injected 5 coupons into the database!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();
