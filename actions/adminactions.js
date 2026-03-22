"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Standard Next.js server action cloudinary initialization
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getProductsAdmin() {
  await connectDb();
  // using .lean() helps serialize the data cleanly to JSON for Client components
  const products = await Product.find({}).sort({ _id: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function deleteProductAdmin(formData) {
  const id = formData.get("id");
  if (!id) return { success: false, error: "Missing Product ID" };

  await connectDb();
  await Product.findByIdAndDelete(id);

  // Instantly invalidate caches so customers and admins see the change immediately
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

export async function saveProductAdmin(formData) {
  try {
    await connectDb();
    
    // Extract everything from the HTML form data
    const name = formData.get("name");
    const price = formData.get("price");
    const oldPrice = formData.get("oldPrice");
    const unit = formData.get("unit");
    const category = formData.get("category");
    const discount = formData.get("discount");
    const imageFile = formData.get("image");

    let imageUrl = "";

    // If an image was provided, upload securely via server directly to cloudinary
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "quickzy/products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    }

    // Auto-generate the custom ID the system requires
    const lastProduct = await Product.findOne().sort({ id_custom: -1 });
    const nextId = lastProduct && lastProduct.id_custom ? lastProduct.id_custom + 1 : 1000;

    const newProduct = new Product({
      id_custom: nextId,
      name,
      price: Number(price),
      oldPrice: Number(oldPrice) || 0,
      unit,
      category,
      discount,
      image: imageUrl, // Save cloudinary URL locally
    });

    await newProduct.save();

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error saving product:", error);
    return { success: false, error: error.message };
  }
}
