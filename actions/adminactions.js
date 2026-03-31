"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getProductsAdmin() {
  await connectDb();

  const categoryPriority = [
    "Milk & Dairy",
    "Dairy",
    "Fruits",
    "Vegetables",
    "Tea & Coffee",
    "Snacks",
    "Personal Care",
    "Household Essentials",
    "Beverages",
    "Electronics",
    "Stationery",
    "Grocery"
  ];

  const products = await Product.find({}).lean();

  // Manual sorting to handle specific category priorities
  products.sort((a, b) => {
    const indexA = categoryPriority.indexOf(a.category);
    const indexB = categoryPriority.indexOf(b.category);

    if (indexA !== -1 && indexB !== -1) {
      if (indexA !== indexB) return indexA - indexB;
    } else if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    }

    // Default to existing sorting (Newest first) within the same category or for unknown categories
    return b._id.toString().localeCompare(a._id.toString());
  });

  return JSON.parse(JSON.stringify(products));
}

export async function deleteProductAdmin(formData) {
  const id = formData.get("id");
  if (!id) return { success: false, error: "Missing Product ID" };

  await connectDb();
  const deleted = await Product.findByIdAndDelete(id);

  if (deleted && deleted.image) {
    try {
      const fullPublicId = deleted.image.split("/upload/").pop().replace(/v\d+\//, "").split(".")[0];
      const fallbackPublicId = deleted.image.split("/").pop().split(".")[0];
      
      await cloudinary.uploader.destroy(fullPublicId);
      if (fullPublicId !== fallbackPublicId) {
        await cloudinary.uploader.destroy(fallbackPublicId);
      }
    } catch (e) { }
  }

  // update data
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

// Algorithm: Sequential processing for Cloudinary cleanup
export async function saveProductAdmin(formData) {
  try {
    await connectDb();
    const Category = (await import("@/models/Category")).default;
    
    // get form data
    const name = formData.get("name");
    const price = formData.get("price");
    const oldPrice = formData.get("oldPrice");
    const unit = formData.get("unit");
    let category = formData.get("category");
    const discount = formData.get("discount");
    const imageFile = formData.get("image");

    // handle new category creation
    const isNewCategory = category === "NEW_CATEGORY_TRIGGER";
    if (isNewCategory) {
      const newCatName = formData.get("newCategoryName");
      const newCatImageFile = formData.get("newCategoryImage");
      
      if (!newCatName || !newCatImageFile) {
         return { success: false, error: "New Category name and image are required." };
      }

      // upload image
      const catBuf = Buffer.from(await newCatImageFile.arrayBuffer());
      const catImageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "quickzy/categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(catBuf);
      });

      // save to db
      const newCatDoc = new Category({
        name: newCatName,
        image: catImageUrl,
        count: 1, 
        bg: "bg-green-50" 
      });
      await newCatDoc.save();
      category = newCatName; 
    }

    let imageUrl = "";

    // upload product image
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

    // get next product id
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
      image: imageUrl,
    });

    await newProduct.save();

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Action error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getOrdersAdmin() {
  await connectDb();
  const User = (await import("@/models/User")).default;
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  
  // get user images for orders
  const ordersWithUserImg = await Promise.all(orders.map(async (order) => {
    const user = await User.findOne({ email: order.userEmail }).select("image").lean();
    return { ...order, userImage: user?.image || "" };
  }));

  return JSON.parse(JSON.stringify(ordersWithUserImg));
}

export async function updateOrderStatusAdmin(formData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || !status) return { success: false };

  await connectDb();
  await Order.findByIdAndUpdate(id, { status });

  // Invalidate cache
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath("/profile");
  
  return { success: true };
}

export async function getUsersAdmin() {
  await connectDb();
  const User = (await import("@/models/User")).default;
  // Algorithm: Naive Shuffle (Randomized array sort) - used for product randomization
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export async function toggleUserRoleAdmin(formData) {
  const id = formData.get("id");
  const currentRole = formData.get("currentRole");
  
  if (!id) return { success: false };

  await connectDb();
  const User = (await import("@/models/User")).default;
  
  const targetUser = await User.findById(id);
  if (targetUser && targetUser.email === process.env.ADMIN_EMAIL) {
    // protect main admin
    return { success: false, error: "Genesis Admin cannot be modified." };
  }

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
  const deleted = await Banner.findByIdAndDelete(id);

  if (deleted && deleted.image) {
    try {
      const fullPublicId = deleted.image.split("/upload/").pop().replace(/v\d+\//, "").split(".")[0];
      const fallbackPublicId = deleted.image.split("/").pop().split(".")[0];
      
      await cloudinary.uploader.destroy(fullPublicId);
      if (fullPublicId !== fallbackPublicId) {
        await cloudinary.uploader.destroy(fallbackPublicId);
      }
    } catch (e) { }
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

export async function updateBannerTextAdmin(formData) {
  const id = formData.get("id");
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");

  if (!id) return { success: false };

  await connectDb();
  const Banner = (await import("@/models/Banner")).default;
  await Banner.findByIdAndUpdate(id, { title, subtitle });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

export async function saveBannerAdmin(formData) {
  try {
    await connectDb();
    const Banner = (await import("@/models/Banner")).default;
    
    const titleHtml = formData.get("title");
    const subtitle = formData.get("subtitle");
    const tag = formData.get("tag");
    const bgColor = formData.get("bgColor");
    const shopLink = formData.get("shopLink");
    const type = formData.get("type");
    const imageFile = formData.get("image");

    let imageUrl = "";

    // upload banner image
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 5 * 1024 * 1024) {
        return { success: false, error: "Image exceeds 5MB limit." };
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(imageFile.type)) {
        return { success: false, error: "Only PNG, JPG, and WEBP formats are allowed." };
      }

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
    console.error("Action error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getCouponsAdmin() {
  await connectDb();
  const Coupon = (await import("@/models/Coupon")).default;
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(coupons));
}

export async function deleteCouponAdmin(formData) {
  const id = formData.get("id");
  if (!id) return { success: false };

  await connectDb();
  const Coupon = (await import("@/models/Coupon")).default;
  await Coupon.findByIdAndDelete(id);

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function toggleCouponStatusAdmin(formData) {
  const id = formData.get("id");
  const isActive = formData.get("isActive") === "true";

  if (!id) return { success: false };

  await connectDb();
  const Coupon = (await import("@/models/Coupon")).default;
  await Coupon.findByIdAndUpdate(id, { isActive: !isActive });

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function saveCouponAdmin(formData) {
  try {
    await connectDb();
    const Coupon = (await import("@/models/Coupon")).default;
    
    let code = formData.get("code")?.trim().toUpperCase();
    const discountType = formData.get("discountType");
    let discountValue = Number(formData.get("discountValue"));
    let minOrderAmount = Number(formData.get("minOrderAmount"));
    let usageLimitPerUser = Number(formData.get("usageLimitPerUser")) || 1;
    let totalUsageLimit = Number(formData.get("totalUsageLimit")) || 100;
    
    if (!code || !discountType || isNaN(discountValue)) {
      return { success: false, error: "Missing required fields" };
    }

    if (discountType === "percentage" && discountValue > 100) {
      discountValue = 100;
    }

    const existing = await Coupon.findOne({ code });
    if (existing) {
       return { success: false, error: "Coupon code already exists!" };
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderAmount: isNaN(minOrderAmount) ? 0 : minOrderAmount,
      usageLimitPerUser,
      totalUsageLimit,
      isActive: true,
    });

    await newCoupon.save();
    revalidatePath("/admin/coupons");
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
