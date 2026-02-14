import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { v2 as cloudinary } from "cloudinary";
import connectDb from "../db/connectDb.js";
import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function addNewBatch() {
  try {
    const filePath = path.join(__dirname, "../data/new-products.json");
    if (!fs.existsSync(filePath)) {
      console.log(
        "📝 No 'data/new-products.json' found. Create one with your new raw product array!",
      );
      process.exit(0);
    }

    const newProducts = JSON.parse(fs.readFileSync(filePath, "utf8"));
    await connectDb();

    console.log(`🚀 Adding ${newProducts.length} new products to Quickzy...`);

    for (const prod of newProducts) {
      try {
        console.log(`  📸 Uploading to Cloudinary: ${prod.name}`);
        const result = await cloudinary.uploader.upload(
          prod.img || prod.image,
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
        console.log(`  ✅ Successfully added: ${prod.name}`);
      } catch (err) {
        console.error(`  ❌ Failed to add ${prod.name}:`, err.message);
      }
    }

    console.log("🔃 Updating Master Seed Data...");
    // Run the export logic to make sure seed-data.json has the new items
    const { execSync } = await import("child_process");
    execSync("node scripts/export-data.js");

    console.log(
      "🎊 All done! Your new products are live and synced to seed-data.json.",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Process failed:", error);
    process.exit(1);
  }
}

addNewBatch();
