const express = require('express');
const { z } = require('zod');
const controller = require('./event.controller');
const validate = require('../../middlewares/validate');
const { createEventSchema, updateEventSchema } = require('./event.validation');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { sensitiveActionLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

const rsvpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

// Public
router.get('/', controller.getUpcomingEvents);
router.get('/:slug', controller.getEvent);
router.post('/:id/rsvp', sensitiveActionLimiter, validate(rsvpSchema), controller.rsvpToEvent);

// Admin only (editor or superadmin)
router.post(
  '/',
  requireAuth,
  requireRole('superadmin', 'editor'),
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
