const eventService = require('./event.service');

async function getUpcomingEvents(req, res, next) {
  try {
    const { category, limit } = req.query;
    const events = await eventService.listUpcomingEvents({
      category,
      limit: limit ? Number(limit) : undefined,
    });
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
}

async function getEvent(req, res, next) {
  try {
    const event = await eventService.getEventBySlug(req.params.slug);
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

async function rsvpToEvent(req, res, next) {
  try {
    const result = await eventService.rsvpToEvent(req.params.id, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    await eventService.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUpcomingEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
};
