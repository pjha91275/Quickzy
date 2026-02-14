import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import connectDb from "./db/connectDb.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";

const checkData = async () => {
  try {
    await connectDb();
    const pCount = await Product.countDocuments();
    const cCount = await Category.countDocuments();
    console.log(`📊 Stats: ${pCount} Products, ${cCount} Categories`);

    if (pCount > 0) {
      const sample = await Product.findOne({});
      console.log(`🔗 Sample Link: ${sample.image}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

checkData();
