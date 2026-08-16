const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { cacheAside, redis } = require('../../config/redis');
const Settings = require('./settings.model');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // Timings/banner are read on nearly every page load but change rarely
    // — cache aggressively.
    const settings = await cacheAside('settings:singleton', 600, () =>
      Settings.getSingleton().then((doc) => doc.toObject())
    );
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

router.patch('/', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const settings = await Settings.findByIdAndUpdate('singleton', req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    await redis.del('settings:singleton').catch(() => {});
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
