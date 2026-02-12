import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ProductSchema = new mongoose.Schema({
  id_custom:   { type: Number, unique: true },
  name:        String,
  price:       Number,
  oldPrice:    Number,
  unit:        String,
  description: String,
  vendor:      String,
  category:    String,
  discount:    String,
  image:       String, // This will store your Cloudinary URL
});

export default mongoose.models.Product || model("Product", ProductSchema);