const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'singleton' },
    darshanTimings: {
      morning: { type: String, default: '4:30 AM - 1:00 PM' },
      evening: { type: String, default: '4:00 PM - 8:30 PM' },
    },
    aartiSchedule: [
      {
        name: String, // e.g. "Mangala Aarti"
        time: String,
      },
    ],
    announcementBanner: { type: String, default: '' },
  },
  { timestamps: true }
);

// Enforce a single settings document via a fixed _id.
settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findById('singleton');
  if (!doc) doc = await this.create({ _id: 'singleton' });
  return doc;
};

module.exports = mongoose.model('Settings', settingsSchema);
