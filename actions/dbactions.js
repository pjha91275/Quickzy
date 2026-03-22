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

  // Try custom numeric ID first
  let product = await Product.findOne({ id_custom: id }).lean();

  // If not found, try MongoDB ObjectID (simple 24-char check to avoid crash)
  if (!product && id?.length === 24) {
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
