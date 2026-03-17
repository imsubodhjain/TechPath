const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['coding', 'design', 'writing', 'productivity', 'research', 'image-generation', 'data-analysis', 'chatbot', 'audio-video', 'devops-tools'],
  },
  subcategory: { type: String, default: '' },
  pricing: {
    type: String,
    enum: ['free', 'freemium', 'paid', 'open-source'],
    default: 'free',
  },
  websiteUrl: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  features: [String],
  alternatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }],
  tags: [String],
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

toolSchema.index({ category: 1, pricing: 1, isPublished: 1 });
toolSchema.index({ name: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Tool', toolSchema);
