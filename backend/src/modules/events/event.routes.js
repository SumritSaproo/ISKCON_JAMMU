const express = require('express');
const multer = require('multer');
const { z } = require('zod');
const controller = require('./event.controller');
const validate = require('../../middlewares/validate');
const { createEventSchema, updateEventSchema } = require('./event.validation');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { sensitiveActionLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Cover photo must be a JPEG, PNG, or WEBP image'));
    }
    cb(null, true);
  },
});

const rsvpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

// Public
router.get('/', controller.getUpcomingEvents);
// Keep this before /:slug so "admin" is not treated as an event slug.
router.get('/admin', requireAuth, requireRole('superadmin', 'editor'), controller.getAdminUpcomingEvents);
router.get('/:slug', controller.getEvent);
router.post('/:id/rsvp', sensitiveActionLimiter, validate(rsvpSchema), controller.rsvpToEvent);

// Admin only (editor or superadmin)
router.post(
  '/',
  requireAuth,
  requireRole('superadmin', 'editor'),
  upload.single('coverImage'),
  validate(createEventSchema),
  controller.createEvent
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('superadmin', 'editor'),
  validate(updateEventSchema),
  controller.updateEvent
);
router.delete('/:id', requireAuth, requireRole('superadmin'), controller.deleteEvent);

module.exports = router;
