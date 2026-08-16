const express = require('express');
const { z } = require('zod');
const validate = require('../../middlewares/validate');
const { sensitiveActionLimiter } = require('../../middlewares/rateLimiter');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const donationService = require('./donation.service');
const Donation = require('./donation.model');

const router = express.Router();

const initiateSchema = z.object({
  donorName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  amount: z.number().positive(),
  category: z.enum(['annadaan', 'deity_seva', 'construction_fund', 'general']).optional(),
  panNumber: z.string().optional(),
});

const verifySchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

router.post('/initiate', sensitiveActionLimiter, validate(initiateSchema), async (req, res, next) => {
  try {
    const result = await donationService.initiateDonation(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

router.post('/verify', sensitiveActionLimiter, validate(verifySchema), async (req, res, next) => {
  try {
    const donation = await donationService.verifyAndCompleteDonation(req.body);
    res.json({ success: true, data: donation });
  } catch (err) {
    next(err);
  }
});

// Admin: view/export donation records
router.get('/', requireAuth, requireRole('superadmin', 'accounts'), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: donations });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
