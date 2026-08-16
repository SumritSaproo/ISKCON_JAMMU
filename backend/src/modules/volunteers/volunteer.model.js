const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    interestArea: {
      type: String,
      enum: ['kitchen_seva', 'event_management', 'teaching', 'deity_seva', 'outreach', 'other'],
      default: 'other',
    },
    availability: { type: String }, // free-text, e.g. "weekends", "evenings"
    message: { type: String },
    status: { type: String, enum: ['new', 'contacted', 'active', 'inactive'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
