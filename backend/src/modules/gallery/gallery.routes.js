const express = require('express');
const multer = require('multer');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { uploadImage } = require('../../config/cloudinary');
const GalleryImage = require('./gallery.model');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
    }
    cb(null, true);
  },
});

router.get('/', async (req, res, next) => {
  try {
    const { eventId, tag, page = 1, limit = 24 } = req.query;
    const query = {};
    if (eventId) query.eventId = eventId;
    if (tag) query.tags = tag;
    const images = await GalleryImage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, data: images });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  requireAuth,
  requireRole('superadmin', 'editor'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });

      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const { url } = await uploadImage(dataUri, 'iskcon-jammu/gallery');

      const image = await GalleryImage.create({
        imageUrl: url,
        eventId: req.body.eventId || undefined,
        caption: req.body.caption,
        tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : [],
        uploadedBy: req.user.id,
      });

      res.status(201).json({ success: true, data: image });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
