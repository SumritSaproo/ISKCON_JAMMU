const express = require('express');
const { z } = require('zod');
const validate = require('../../middlewares/validate');
const { sensitiveActionLimiter } = require('../../middlewares/rateLimiter');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { sendMail } = require('../../utils/email');
const Volunteer = require('./volunteer.model');

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  interestArea: z
    .enum(['kitchen_seva', 'event_management', 'teaching', 'deity_seva', 'outreach', 'other'])
    .optional(),
  availability: z.string().optional(),
  message: z.string().optional(),
});

// Public: submit a volunteer registration
router.post('/', sensitiveActionLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const volunteer = await Volunteer.create(req.body);

    sendMail({
      to: volunteer.email,
      subject: 'Thank you for volunteering — ISKCON Jammu',
      html: `<p>Hare Krishna ${volunteer.name},</p>
             <p>Thank you for registering to volunteer with ISKCON Jammu. Our team will reach out
             to you soon regarding <strong>${volunteer.interestArea.replace('_', ' ')}</strong>.</p>`,
    }).catch((err) => console.error('Volunteer confirmation email failed:', err.message));

    res.status(201).json({ success: true, data: { id: volunteer._id } });
  } catch (err) {
    next(err);
  }
});

// Admin: list and manage volunteers
router.get('/stats', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const activeVolunteers = await Volunteer.find({ status: 'active' })
      .select('name')
      .sort({ name: 1 });
    res.json({
      success: true,
      data: {
        count: activeVolunteers.length,
        names: activeVolunteers.map((volunteer) => volunteer.name),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};
    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: volunteers });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: volunteer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
