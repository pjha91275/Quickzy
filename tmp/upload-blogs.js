import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const blogImages = [
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2070",
  "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=2070",
  "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070"
];

async function upload() {
  for (const url of blogImages) {
    try {
      console.log(`Uploading: ${url}`);
      const result = await cloudinary.uploader.upload(url, {
        folder: "quickzy/blogs",
      });
      console.log(`RESULT_URL: ${result.secure_url}`);
    } catch (err) {
      console.error(`Error: ${url}`, err.message);
    }
  }
}

upload();
