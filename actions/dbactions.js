import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const fetchProdAndCat = async () => {
  await connectDb();
  const products = await Product.find({});
  const categories = await Category.find({});
  return { products, categories };
};
