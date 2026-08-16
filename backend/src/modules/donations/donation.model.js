const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 }, // in INR
    category: {
      type: String,
      enum: ['annadaan', 'deity_seva', 'construction_fund', 'general'],
      default: 'general',
    },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
    receiptSent: { type: Boolean, default: false },
    panNumber: { type: String }, // optional, for 80G receipts
  },
  { timestamps: true }
);

donationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
