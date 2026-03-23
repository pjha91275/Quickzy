"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Order from "@/models/Order";
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

export async function getOrdersAdmin() {
  await connectDb();
  // using .lean() helps serialize the data cleanly to JSON for Client components
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(orders));
}

export async function updateOrderStatusAdmin(formData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || !status) return { success: false };

  await connectDb();
  await Order.findByIdAndUpdate(id, { status });

  // Update instantly everywhere
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath("/profile");
  
  return { success: true };
}

export async function getUsersAdmin() {
  await connectDb();
  const User = (await import("@/models/User")).default;
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function toggleUserRoleAdmin(formData) {
  const id = formData.get("id");
  const currentRole = formData.get("currentRole");
  
  if (!id) return { success: false };

  await connectDb();
  const User = (await import("@/models/User")).default;
  
  const newRole = currentRole === "admin" ? "user" : "admin";
  await User.findByIdAndUpdate(id, { role: newRole });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function getBannersAdmin() {
  await connectDb();
  const Banner = (await import("@/models/Banner")).default;
  const banners = await Banner.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(banners));
}

export async function deleteBannerAdmin(formData) {
  const id = formData.get("id");
  if (!id) return { success: false };

  await connectDb();
  const Banner = (await import("@/models/Banner")).default;
  await Banner.findByIdAndDelete(id);

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

export async function saveBannerAdmin(formData) {
  try {
    await connectDb();
    const Banner = (await import("@/models/Banner")).default;
    
    // We expect the banner DB to mirror the schema used in initial seeding, which has:
    // title (html string or react node on frontend, but saved as string in DB: titleHtml), subtitle, tag, bgColor, shopLink, image, type
    const titleHtml = formData.get("title"); // It can accept plain text or HTML strings
    const subtitle = formData.get("subtitle");
    const tag = formData.get("tag");
    const bgColor = formData.get("bgColor");
    const shopLink = formData.get("shopLink");
    const type = formData.get("type"); // "hero" or "footer"
    const imageFile = formData.get("image");

    let imageUrl = "";

    // Upload securely via server directly to cloudinary
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "quickzy/banners" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    }

    const newBanner = new Banner({
      title: titleHtml,
      subtitle,
      tag,
      bgColor: bgColor || "bg-green-50",
      shopLink,
      type: type || "hero",
      image: imageUrl, 
    });

    await newBanner.save();

    revalidatePath("/admin/banners");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error saving banner:", error);
    return { success: false, error: error.message };
  }
}
