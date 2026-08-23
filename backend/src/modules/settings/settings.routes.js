const express = require('express');
const multer = require('multer');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { cacheAside, redis } = require('../../config/redis');
const { uploadImage, uploadAudio } = require('../../config/cloudinary');
const Settings = require('./settings.model');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, or WebP images are allowed'));
    }
    cb(null, true);
  },
});
const audioUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mp4'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only MP3, WAV, OGG, AAC, or M4A audio files are allowed'));
    }
    cb(null, true);
  },
});

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

router.post(
  '/background-image',
  requireAuth,
  requireRole('superadmin', 'editor'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const { url, publicId } = await uploadImage(dataUri, 'iskcon-jammu/site');
      const settings = await Settings.findByIdAndUpdate(
        'singleton',
        { backgroundImage: url, backgroundImagePublicId: publicId },
        { new: true, upsert: true, runValidators: true }
      );
      if (redis?.status === 'ready') await redis.del('settings:singleton').catch(() => {});
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/audio',
  requireAuth,
  requireRole('superadmin', 'editor'),
  audioUpload.single('audio'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No audio file provided' });

      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const { url, publicId } = await uploadAudio(dataUri);
      const settings = await Settings.findByIdAndUpdate(
        'singleton',
        { audioUrl: url, audioPublicId: publicId },
        { new: true, upsert: true, runValidators: true }
      );
      if (redis?.status === 'ready') await redis.del('settings:singleton').catch(() => {});
      res.json({ success: true, data: settings });
    } catch (err) {
      next(err);
    }
  }
);

router.patch('/', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (!updates.audioUrl) delete updates.audioUrl;

    const settings = await Settings.findByIdAndUpdate('singleton', updates, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    if (redis?.status === 'ready') await redis.del('settings:singleton').catch(() => {});
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
