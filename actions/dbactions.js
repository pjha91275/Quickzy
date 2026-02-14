"use server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const fetchProdAndCat = async () => {
  await connectDb();
  const products = await Product.find({}).lean();
  const categories = await Category.find({}).lean();

  // Convert to plain objects to fix "Only plain objects can be passed to Client Components" error
  return JSON.parse(
    JSON.stringify({
      products,
      categories,
    }),
  );
};
export const fetchProductById = async (id) => {
  await connectDb();
  // We check both id_custom and the _id string to be safe
  const product =
    (await Product.findOne({ id_custom: parseInt(id) }).lean()) ||
    (await Product.findById(id).lean());

  return JSON.parse(JSON.stringify(product));
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
