"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const fetchProdAndCat = async () => {
  await connectDb();
  const products = await Product.find({}).lean();
  const categories = await Category.find({}).lean();

  return JSON.parse(JSON.stringify({ products, categories }));
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
