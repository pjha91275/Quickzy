import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  count: Number,
  image: String,
  bg: String,
});

export default mongoose.models.Category || model("Category", CategorySchema);
