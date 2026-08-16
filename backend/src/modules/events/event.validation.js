const { z } = require('zod');

const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().url().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().optional(),
  category: z.enum(['festival', 'satsang', 'seva', 'workshop', 'other']).optional(),
  rsvpEnabled: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

const updateEventSchema = createEventSchema.partial();

module.exports = { createEventSchema, updateEventSchema };
