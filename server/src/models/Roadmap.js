const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['article', 'video', 'course', 'docs', 'tutorial'], default: 'article' },
  isFree: { type: Boolean, default: true },
}, { _id: false });

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  description: { type: String, default: '' },
  estimatedMinutes: { type: Number, default: 30 },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  resources: [resourceSchema],
  tags: [String],
}, { _id: true });

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, required: true },
  topics: [topicSchema],
}, { _id: true });

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'fullstack', 'devops', 'data-science', 'ai-ml', 'mobile', 'cybersecurity', 'cloud'],
  },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  estimatedHours: { type: Number, default: 0 },
  tags: [String],
  sections: [sectionSchema],
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

roadmapSchema.index({ category: 1, isPublished: 1 });
roadmapSchema.index({ title: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Roadmap', roadmapSchema);
