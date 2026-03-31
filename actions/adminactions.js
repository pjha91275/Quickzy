"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

/* Cloudinary integration settings */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getProductsAdmin() {
  await connectDb();
  const Category = (await import("@/models/Category")).default;
  
  /* DB Hygiene: Automatically purge existing categories with zero products */
  await Category.deleteMany({ count: 0 });

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

  /* Category sorting and prioritization */
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

    /* Default sorting for remaining items */
    return b._id.toString().localeCompare(a._id.toString());
  });

  return JSON.parse(JSON.stringify(products));
}

export async function deleteProductAdmin(formData) {
  const id = formData.get("id");
  if (!id) return { success: false, error: "Missing Product ID" };

  await connectDb();
  const deleted = await Product.findByIdAndDelete(id);
  const Category = (await import("@/models/Category")).default;

  if (deleted && deleted.category) {
    await Category.findOneAndUpdate(
      { name: deleted.category },
      { $inc: { count: -1 } }
    );
    
    /* Garbage Collection: Remove category if no products remain */
    const remaining = await Product.countDocuments({ category: deleted.category });
    if (remaining === 0) {
      await Category.findOneAndDelete({ name: deleted.category });
    }
  }

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

  /* Force Next.js data refresh */
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

/* Sequential Product Creation and Media Upload */
export async function saveProductAdmin(formData) {
  try {
    await connectDb();
    const Category = (await import("@/models/Category")).default;
    
    /* Extract form data fields */
    const name = formData.get("name");
    const price = formData.get("price");
    const oldPrice = formData.get("oldPrice");
    const unit = formData.get("unit");
    let category = formData.get("category");
    const discount = formData.get("discount");
    const imageFile = formData.get("image");

    /* New category creation logic */
    const isNewCategory = category === "NEW_CATEGORY_TRIGGER";
    if (isNewCategory) {
      const newCatName = formData.get("newCategoryName");
      if (!newCatName) {
         return { success: false, error: "New Category name is required." };
      }
      category = newCatName; 
    }

    /* Dynamic product numbering (product-1, product-2...) */
    const productCount = await Product.countDocuments();
    const nextProductNum = productCount + 1;
    
    let imageUrl = "";

    /* Cloudinary media stream upload */
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: "quickzy/products",
            public_id: `product-${nextProductNum}`,
            overwrite: true,
            resource_type: "image"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });
    }

    /* Initialize new category with first product image */
    if (isNewCategory) {
       const newCatDoc = new Category({
         name: category,
         image: imageUrl,
         count: 0, 
         bg: "bg-green-50" 
       });
       await newCatDoc.save();
    }

    /* Minimum price validation (15 Rupees) */
    const nPrice = Number(price);
    const nOldPrice = Number(oldPrice) || 0;
    if (nPrice < 15) {
       return { success: false, error: "Price must be at least 15 Rupees." };
    }
    if (nOldPrice > 0 && nOldPrice < 15) {
       return { success: false, error: "MRP must be at least 15 Rupees." };
    }

    /* Sequential ID generation */
    const lastProduct = await Product.findOne().sort({ id_custom: -1 });
    const nextId = lastProduct && lastProduct.id_custom ? lastProduct.id_custom + 1 : 1000;

    const newProduct = new Product({
      id_custom: nextId,
      name,
      price: nPrice,
      oldPrice: nOldPrice,
      unit,
      category,
      discount,
      image: imageUrl,
    });

    await newProduct.save();

    /* Synchronize category product count */
    await Category.findOneAndUpdate(
      { name: category },
      { $inc: { count: 1 } }
    );

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
  
  /* Map user images to orders */
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
  const updates = { status };
  if (status === "Cancelled") {
    updates.cancelledBy = "admin";
  } else {
    updates.cancelledBy = null;
  }
  await Order.findByIdAndUpdate(id, updates);

  /* Clear server-side cache */
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath("/profile");
  
  return { success: true };
}

export async function getUsersAdmin() {
  await connectDb();
  const User = (await import("@/models/User")).default;
  /* Algorithm: Randomized Shuffle for data distribution */
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
    /* Protect primary admin account */
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

export async function updateBannerAdmin(formData) {
  const id = formData.get("id");
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const type = formData.get("type");
  const shopLink = formData.get("shopLink");
  const bgColor = formData.get("bgColor");
  const imageFile = formData.get("image");

  if (!id) return { success: false, error: "ID missing" };

  await connectDb();
  const Banner = (await import("@/models/Banner")).default;
  const existing = await Banner.findById(id);

  if (!existing) return { success: false, error: "Banner not found" };

  const updates = { title, subtitle, type, shopLink, bgColor };

  if (imageFile && imageFile.size > 0) {
    /* Determine asset public ID */
    let publicId = "footer-banner";
    if (type !== "footer") {
       if (existing.image) {
          /* Extract existing ID from URL */
          publicId = existing.image.split("/").pop().split(".")[0];
       } else {
          const count = await Banner.countDocuments({ type: "hero" });
          publicId = `hero-banner-${count + 1}`;
       }
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const imageUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "quickzy/banners",
          public_id: publicId,
          overwrite: true,
          resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    updates.image = imageUrl;
  }

  await Banner.findByIdAndUpdate(id, updates);
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { success: true };
}

export async function updateProductAdmin(formData) {
  const id = formData.get("id");
  const name = formData.get("name");
  const unit = formData.get("unit");
  const category = formData.get("category");
  const imageFile = formData.get("image");

  if (!id) return { success: false, error: "ID missing" };

  await connectDb();
  const Product = (await import("@/models/Product")).default;
  const Category = (await import("@/models/Category")).default;
  const existing = await Product.findById(id);

  if (!existing) return { success: false, error: "Product not found" };

  const nPrice = Number(formData.get("price"));
  const nOldPrice = Number(formData.get("oldPrice")) || 0;

  if (nPrice < 15) {
     return { success: false, error: "Price must be at least 15 Rupees." };
  }
  if (nOldPrice > 0 && nOldPrice < 15) {
     return { success: false, error: "MRP must be at least 15 Rupees." };
  }

  const updates = { name, price: nPrice, oldPrice: nOldPrice, unit, category };

  /* Category product count update and automatic cleanup */
  if (category !== existing.category) {
    await Category.findOneAndUpdate({ name: existing.category }, { $inc: { count: -1 } });
    
    /* Self-Cleaning: Delete old category if it is now empty */
    const oldCatCheck = await Product.countDocuments({ category: existing.category });
    if (oldCatCheck <= 1) { // Current product is moving away, so 1 means it becomes empty
      await Category.findOneAndDelete({ name: existing.category });
    }
    
    await Category.findOneAndUpdate({ name: category }, { $inc: { count: 1 } });
  }

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    /* Deterministic Naming: Reuse existing publicId to preserve naming identity */
    let publicId = `product-${existing.id_custom}`;
    if (existing.image) {
      publicId = existing.image.split("/").pop().split(".")[0];
    }

    const imageUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "quickzy/products",
          public_id: publicId,
          overwrite: true,
          resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });

    updates.image = imageUrl;
  }

  await Product.findByIdAndUpdate(id, updates);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
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

    const bType = type || "hero";
    const bannerCount = await Banner.countDocuments({ type: bType });
    const nextNum = bannerCount + 1;
    const publicId = bType === "footer" ? "footer-banner" : `hero-banner-${nextNum}`;

    let imageUrl = "";

    /* Media stream upload logic */
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 2 * 1024 * 1024) {
        return { success: false, error: "Image exceeds 2MB limit." };
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(imageFile.type)) {
        return { success: false, error: "Only PNG, JPG, and WEBP formats are allowed." };
      }

      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: "quickzy/banners",
            public_id: publicId,
            overwrite: true,
            resource_type: "image"
          },
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

export async function getCategoriesAdmin() {
  await connectDb();
  const Category = (await import("@/models/Category")).default;
  const cats = await Category.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(cats));
}
