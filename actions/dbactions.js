"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import BlogPost from "@/models/BlogPost";
import Banner from "@/models/Banner";

export const fetchProdAndCat = async () => {
  await connectDb();
  const products = await Product.find({}).lean();
  const categories = await Category.find({}).lean();

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
  await connectDb();

  let product = null;

  // Try custom numeric ID first (Only if id is a valid number string)
  if (!isNaN(id) && !isNaN(parseFloat(id)) && !id.startsWith("0x")) {
    product = await Product.findOne({ id_custom: Number(id) }).lean();
  }

  // If not found, try MongoDB ObjectID (if it's a valid 24-character hex)
  if (!product && /^[0-9a-fA-F]{24}$/.test(id)) {
    product = await Product.findById(id).lean();
  }

  return product ? JSON.parse(JSON.stringify(product)) : null;
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
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return null;
  const post = await BlogPost.findById(id).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
};
