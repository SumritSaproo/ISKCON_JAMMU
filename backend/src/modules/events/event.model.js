const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    coverImage: { type: String }, // Cloudinary URL
    coverImagePublicId: { type: String },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date },
    location: { type: String, default: 'ISKCON Jammu, Dream City, Muthi, Jammu' },
    category: {
      type: String,
      enum: ['festival', 'satsang', 'seva', 'workshop', 'other'],
      default: 'other',
    },
    rsvpEnabled: { type: Boolean, default: false },
    rsvpCount: { type: Number, default: 0 },
    rsvps: [
      {
        name: String,
        email: { type: String, lowercase: true },
        phone: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1, isFeatured: -1 });

module.exports = mongoose.model('Event', eventSchema);
