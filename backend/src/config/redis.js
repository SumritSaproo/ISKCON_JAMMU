const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL && process.env.REDIS_URL.trim();

// Single shared client. In production point this at a managed Redis
// (Upstash / Redis Cloud) — used for: response caching (timings, homepage
// banner, upcoming events) and as a store for rate limiting.
const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: false,
    })
  : null;

if (redis) {
  redis.on('error', (err) => {
    console.warn('Redis error:', err.message);
  });
}

async function connectRedis() {
  if (!redis) {
    console.warn('Redis not configured; continuing without cache and rate limiting store.');
    return;
  }

  try {
    await redis.connect();
    console.log('Redis connected');
  } catch (err) {
    // Non-fatal: app can run without cache, just slower.
    console.warn('Redis unavailable, continuing without cache:', err.message);
  }
}

/**
 * Cache-aside helper: fetch from Redis, or run `fetcher` and cache the result.
 * @param {string} key
 * @param {number} ttlSeconds
 * @param {() => Promise<any>} fetcher
 */
async function cacheAside(key, ttlSeconds, fetcher) {
  if (!redis) return fetcher();

  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);
  } catch (_) { /* fall through to fetcher on cache miss/error */ }

  const fresh = await fetcher();
  try {
    await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds);
  } catch (_) { /* caching is best-effort */ }
  return fresh;
}

module.exports = { redis, connectRedis, cacheAside };
