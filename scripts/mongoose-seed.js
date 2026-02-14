import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { v2 as cloudinary } from "cloudinary";
import connectDb from "../db/connectDb.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function seedDatabase() {
  try {
    await connectDb();

    // 1. Load data from JSON
    const dataPath = path.join(__dirname, "../data/seed-data.json");
    if (!fs.existsSync(dataPath)) {
      throw new Error(
        "❌ Seed data file not found! Run 'node scripts/export-data.js' first.",
      );
    }
    const { categories: categoriesToSeed, products: productsToSeed } =
      JSON.parse(fs.readFileSync(dataPath, "utf8"));

    console.log("🧹 Cleaning existing data...");
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log("📁 Migrating Categories...");
    const categoryMap = {}; // To store new category names or IDs if needed

    for (const cat of categoriesToSeed) {
      try {
        console.log(`  Uploading Category: ${cat.name}`);
        const result = await cloudinary.uploader.upload(cat.image || cat.img, {
          folder: "quickzy/categories",
        });

        const newCategory = await Category.create({
          name: cat.name,
          count: cat.count,
          image: result.secure_url,
          bg: cat.bg || "bg-gray-50",
        });
        categoryMap[cat.name] = newCategory.name;
      } catch (err) {
        console.error(
          `  ❌ Failed to migrate Category: ${cat.name}`,
          err.message,
        );
      }
    }

    console.log("🛒 Migrating Products...");
    for (const prod of productsToSeed) {
      try {
        console.log(`  Uploading Product: ${prod.name}`);
        const result = await cloudinary.uploader.upload(
          prod.image || prod.img,
          {
            folder: "quickzy/products",
          },
        );

        await Product.create({
          id_custom: prod.id_custom || prod.id,
          name: prod.name,
          price: prod.price,
          oldPrice: prod.oldPrice,
          unit: prod.unit,
          description: prod.description,
          vendor: prod.vendor,
          category: prod.category,
          discount: prod.discount,
          image: result.secure_url,
        });
      } catch (err) {
        console.error(
          `  ❌ Failed to migrate Product: ${prod.name}`,
          err.message,
        );
      }
    }

    console.log("✅ Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
