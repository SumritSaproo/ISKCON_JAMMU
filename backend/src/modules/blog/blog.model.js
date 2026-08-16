const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    contentHtml: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, default: 'ISKCON Jammu' },
    tags: [{ type: String, index: true }],
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
