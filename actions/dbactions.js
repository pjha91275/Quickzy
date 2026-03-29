"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import BlogPost from "@/models/BlogPost";
import Banner from "@/models/Banner";

export const fetchProdAndCat = async () => {
  await connectDb();
  // Algorithm: Concurrency (Promise.all) for parallel data fetching
  const [products, categories] = await Promise.all([
    Product.find({}).lean(),
    Category.find({}).lean()
  ]);

  return JSON.parse(JSON.stringify({ products, categories }));
};

export const fetchBlogPosts = async () => {
  await connectDb();
  const blogPosts = await BlogPost.find({}).lean();
  return JSON.parse(JSON.stringify(blogPosts));
};

export const fetchBanners = async () => {
  await connectDb();
  const banners = await Banner.find({}).lean();
  return JSON.parse(JSON.stringify(banners));
};

export const fetchAllData = async () => {
  await connectDb();
  // Algorithm: Concurrency (Promise.all) for parallel data fetching
  const [products, categories, blogPosts, banners] = await Promise.all([
    Product.find({}).lean(),
    Category.find({}).lean(),
    BlogPost.find({}).lean(),
    Banner.find({}).lean()
  ]);
  return JSON.parse(JSON.stringify({
    Product: products,
    Category: categories,
    BlogPost: blogPosts,
    Banner: banners
  }));
};

export const fetchCategories = async () => {
  await connectDb();
  const categories = await Category.find({}).lean();
  return JSON.parse(JSON.stringify(categories));
};

export const fetchProductById = async (id) => {
  try {
    await connectDb();

  let product = null;

  // find by numeric id
  if (!isNaN(id) && !isNaN(parseFloat(id)) && !id.startsWith("0x")) {
    product = await Product.findOne({ id_custom: Number(id) }).lean();
  }

  // Algorithm: Linear Search (Lookup by ID or custom field)
  if (!product && /^[0-9a-fA-F]{24}$/.test(id)) {
    product = await Product.findById(id).lean();
  }

  return product ? JSON.parse(JSON.stringify(product)) : null;
} catch (error) {
  console.error("fetchProductById error:", error.message);
  return null;
}
};

export const fetchSimilarProducts = async (category, currentId) => {
  await connectDb();
  const similar = await Product.find({
    category: category,
    id_custom: { $ne: currentId },
  })
    .limit(5)
    .lean();

  return JSON.parse(JSON.stringify(similar));
};

export const fetchBlogPostById = async (id) => {
  await connectDb();
  let post = null;

  if (!isNaN(id) && !isNaN(parseFloat(id)) && !id.startsWith("0x")) {
    post = await BlogPost.findOne({ id_custom: Number(id) }).lean();
  }

  if (!post && /^[0-9a-fA-F]{24}$/.test(id)) {
    post = await BlogPost.findById(id).lean();
  }

  return post ? JSON.parse(JSON.stringify(post)) : null;
};
