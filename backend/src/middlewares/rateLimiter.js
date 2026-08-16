const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { redis } = require('../config/redis');

// Redis-backed store keeps rate limits accurate across multiple server
// instances (needed once you scale horizontally per the design doc).
// Falls back to express-rate-limit's built-in in-memory store when Redis
// isn't configured, so local dev without Redis still works.
function makeStore(prefix) {
  if (!process.env.REDIS_URL) return undefined;
  try {
    return new RedisStore({
      sendCommand: (...args) => redis.call(...args),
      prefix,
    });
  } catch (_) {
    return undefined;
  }
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:api:'),
});

// Stricter limiter for donation/contact-form/RSVP POSTs, which are the
// highest-value targets for abuse (fake donations, spam submissions).
const sensitiveActionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:sensitive:'),
  message: { success: false, message: 'Too many requests, please try again later.' },
});

module.exports = { apiLimiter, sensitiveActionLimiter };
