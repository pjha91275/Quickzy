import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDb from "../db/connectDb.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

async function exportData() {
  try {
    console.log("🚀 Connecting to MongoDB for export...");
    await connectDb();

    console.log("📦 Fetching Categories...");
    const categories = await Category.find({}).lean();

    console.log("📦 Fetching Products...");
    const products = await Product.find({}).lean();

    const data = {
      categories,
      products,
    };

    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const filePath = path.join(dataDir, "seed-data.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(
      `✅ Success! Exported ${categories.length} categories and ${products.length} products to ${filePath}`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Export failed:", error);
    process.exit(1);
  }
}

exportData();
