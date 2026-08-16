const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    caption: { type: String },
    tags: [{ type: String, index: true }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', gallerySchema);
