import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: { type: String, required: true },
  tag: String,
  bgColor: String,
  shopLink: String,
  type: { type: String, enum: ['hero', 'footer'], default: 'hero' },
  order: Number
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
