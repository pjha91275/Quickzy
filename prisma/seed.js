const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;

// NOTE: You will need to export your data from app/shop/page.js
// or simply paste the arrays here for the one-time seed.
// For this script, we assume the arrays allProducts and categoriesWithCount are available.

const prisma = new PrismaClient();

// GUIDE: Configure Cloudinary with your credentials from their dashboard
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  console.log("Starting seeding and image migration...");

  // 1. CLEAR EXISTING DATA (Optional, use with caution)
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();

  // 2. SEED CATEGORIES
  // Note: We map through categories, upload their images to Cloudinary, then save to DB.
  /* 
  for (const cat of categoriesWithCount) {
    const uploadRes = await cloudinary.uploader.upload(cat.img, {
      folder: "quickzy/categories",
    });
    
    await prisma.category.create({
      data: {
        name: cat.name,
        count: cat.count,
        image: uploadRes.secure_url, // This is the new Cloudinary link
        bg: cat.bg
      }
    });
  }
  */

  // 3. SEED PRODUCTS
  // We do the same for all 46+ products.
  /*
  for (const prod of allProducts) {
    console.log(`Migrating: ${prod.name}`);
    
    // Upload external image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(prod.img, {
      folder: "quickzy/products",
    });

    await prisma.product.create({
      data: {
        id_custom: prod.id, // Keeping your original IDs if needed
        name: prod.name,
        price: prod.price,
        oldPrice: prod.oldPrice,
        unit: prod.unit,
        description: prod.description,
        vendor: prod.vendor,
        category: prod.category,
        discount: prod.discount,
        rating: prod.rating,
        image: uploadRes.secure_url, // Saving the permanent Cloudinary link
      }
    });
  }
  */

  console.log("Seeding complete! All images migrated to Cloudinary.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
