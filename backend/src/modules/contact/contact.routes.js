const express = require('express');
const { z } = require('zod');
const validate = require('../../middlewares/validate');
const { sensitiveActionLimiter } = require('../../middlewares/rateLimiter');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { sendMail } = require('../../utils/email');
const ContactMessage = require('./contact.model');

const router = express.Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
});

router.post('/', sensitiveActionLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const entry = await ContactMessage.create(req.body);

    // Notify the temple office inbox; falls back to SMTP_FROM if unset.
    sendMail({
      to: process.env.TEMPLE_CONTACT_EMAIL || process.env.SMTP_FROM,
      subject: `New contact form message from ${entry.name}`,
      html: `<p><strong>${entry.name}</strong> (${entry.email}) wrote:</p><p>${entry.message}</p>`,
    }).catch((err) => console.error('Contact notification email failed:', err.message));

    res.status(201).json({ success: true, message: 'Message received' });
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
