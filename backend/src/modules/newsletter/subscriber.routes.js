const express = require('express');
const { z } = require('zod');
const validate = require('../../middlewares/validate');
const { sensitiveActionLimiter } = require('../../middlewares/rateLimiter');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { sendMail } = require('../../utils/email');
const { AppError } = require('../../middlewares/errorHandler');
const Subscriber = require('./subscriber.model');

const router = express.Router();

const subscribeSchema = z.object({ email: z.string().email() });

router.post('/', sensitiveActionLimiter, validate(subscribeSchema), async (req, res, next) => {
  try {
    const existing = await Subscriber.findOne({ email: req.body.email });
    if (existing) {
      if (!existing.subscribed) {
        existing.subscribed = true;
        await existing.save();
      }
      return res.json({ success: true, message: 'Already subscribed' });
    }

    await Subscriber.create({ email: req.body.email });
    sendMail({
      to: req.body.email,
      subject: 'Welcome to the ISKCON Jammu newsletter',
      html: `<p>Hare Krishna!</p><p>You're now subscribed to updates on festivals, events and seva
             opportunities from ISKCON Jammu, Dream City, Muthi.</p>`,
    }).catch((err) => console.error('Newsletter welcome email failed:', err.message));

    res.status(201).json({ success: true, message: 'Subscribed' });
  } catch (err) {
    next(err);
  }
});

router.post('/unsubscribe', validate(subscribeSchema), async (req, res, next) => {
  try {
    const sub = await Subscriber.findOneAndUpdate(
      { email: req.body.email },
      { subscribed: false }
    );
    if (!sub) throw new AppError('Subscriber not found', 404);
    res.json({ success: true, message: 'Unsubscribed' });
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find({ subscribed: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
