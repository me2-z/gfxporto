import mongoose from 'mongoose';

const TransformationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  beforeImage: { type: String, required: true },
  afterImage: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Transformation || mongoose.model('Transformation', TransformationSchema);
