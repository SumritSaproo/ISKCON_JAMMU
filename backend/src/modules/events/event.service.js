const Event = require('./event.model');
const { cacheAside, redis } = require('../../config/redis');
const { AppError } = require('../../middlewares/errorHandler');
const { cloudinary } = require('../../config/cloudinary');

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

async function listUpcomingEvents({ category, limit = 20 } = {}) {
  const cacheKey = `events:upcoming:${category || 'all'}:${limit}`;
  // Upcoming events are read constantly (homepage, events page) and change
  // rarely — a short TTL cache absorbs most of the read traffic.
  return cacheAside(cacheKey, 300, async () => {
    const query = { startDate: { $gte: new Date() } };
    if (category) query.category = category;
    return Event.find(query).select('-rsvpCount -rsvps').sort({ startDate: 1 }).limit(limit).lean();
  });
}

async function listAdminUpcomingEvents({ category, limit = 100 } = {}) {
  const query = { startDate: { $gte: new Date() } };
  if (category) query.category = category;
  return Event.find(query).sort({ startDate: 1 }).limit(limit).lean();
}

async function getEventBySlug(slug) {
  const event = await Event.findOne({ slug }).lean();
  if (!event) throw new AppError('Event not found', 404);
  delete event.rsvpCount;
  delete event.rsvps;
  return event;
}

async function createEvent(data, userId) {
  let slug = slugify(data.title);
  const existing = await Event.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const event = await Event.create({ ...data, slug, createdBy: userId });
  await invalidateUpcomingCache();
  return event;
}

async function updateEvent(id, data) {
  const event = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!event) throw new AppError('Event not found', 404);
  await invalidateUpcomingCache();
  return event;
}

async function rsvpToEvent(id, { name, email, phone }) {
  const event = await Event.findById(id);
  if (!event) throw new AppError('Event not found', 404);
  if (!event.rsvpEnabled) throw new AppError('RSVP is not open for this event', 400);

  const alreadyRsvpd = event.rsvps.some((r) => r.email === email.toLowerCase());
  if (alreadyRsvpd) throw new AppError('You have already RSVP\'d to this event', 409);

  event.rsvps.push({ name, email, phone });
  event.rsvpCount = event.rsvps.length;
  await event.save();
  await invalidateUpcomingCache();
  return { success: true };
}

async function deleteEvent(id) {
  const event = await Event.findByIdAndDelete(id);
  if (!event) throw new AppError('Event not found', 404);
  if (event.coverImagePublicId) {
    await cloudinary.uploader.destroy(event.coverImagePublicId, { resource_type: 'image' });
  }
  await invalidateUpcomingCache();
  return event;
}

async function invalidateUpcomingCache() {
  try {
    const keys = await redis.keys('events:upcoming:*');
    if (keys.length) await redis.del(...keys);
  } catch (_) { /* cache invalidation is best-effort */ }
}

module.exports = {
  listUpcomingEvents,
  listAdminUpcomingEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
};
