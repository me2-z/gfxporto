import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  links: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
