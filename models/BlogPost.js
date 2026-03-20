import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  id_custom: { type: Number, unique: true },
  title: { type: String, required: true },
  category: String,
  author: String,
  date: String,
  image: { type: String, required: true },
  excerpt: String
}, { timestamps: true });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
