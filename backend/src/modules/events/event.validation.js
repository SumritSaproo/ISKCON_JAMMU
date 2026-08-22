const { z } = require('zod');

const futureDate = z.coerce.date().refine((date) => date > new Date(), {
  message: 'Event date and time must be in the future',
});

const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().url().optional(),
  coverImagePublicId: z.string().optional(),
  startDate: futureDate,
  endDate: z.coerce.date().optional(),
  location: z.string().optional(),
  category: z.enum(['festival', 'satsang', 'seva', 'workshop', 'other']).optional(),
    rsvpEnabled: z.preprocess((value) => {
      if (typeof value === 'string') return value === 'true';
      return value;
    }, z.boolean().optional()),
  isFeatured: z.boolean().optional(),
});

const updateEventSchema = createEventSchema.partial();

module.exports = { createEventSchema, updateEventSchema };
