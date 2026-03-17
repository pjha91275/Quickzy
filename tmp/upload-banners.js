import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { v2 as cloudinary } from "cloudinary";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const assets = [
  "public/hero-banner-1.png",
  "public/hero-banner-2.png",
  "public/hero-banner-3.png",
  "public/hero-banner-4.png",
  "public/hero-banner-5.png",
  "public/footer_banner.png"
];

async function upload() {
  for (const assetPath of assets) {
    try {
      const fullPath = path.resolve(assetPath);
      console.log(`Uploading: ${assetPath}`);
      const result = await cloudinary.uploader.upload(fullPath, {
        folder: "quickzy/banners",
        use_filename: true,
        unique_filename: false,
      });
      console.log(`RESULT_URL [${assetPath}]: ${result.secure_url}`);
    } catch (err) {
      console.error(`Error: ${assetPath}`, err.message);
    }
  }
}

upload();
