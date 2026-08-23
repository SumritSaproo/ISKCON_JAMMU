const express = require('express');
const multer = require('multer');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const { cloudinary, uploadImage } = require('../../config/cloudinary');
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

router.get('/stats', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const count = await GalleryImage.countDocuments();
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
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
      const { url, publicId } = await uploadImage(dataUri, 'iskcon-jammu/gallery');

      const image = await GalleryImage.create({
        imageUrl: url,
        publicId,
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

router.delete(
  '/:id',
  requireAuth,
  requireRole('superadmin', 'editor'),
  async (req, res, next) => {
    try {
      const image = await GalleryImage.findById(req.params.id);
      if (!image) return res.status(404).json({ success: false, message: 'Gallery image not found' });

      if (image.publicId) {
        const result = await cloudinary.uploader.destroy(image.publicId, { resource_type: 'image' });
        if (!['ok', 'not found'].includes(result.result)) {
          return res.status(502).json({ success: false, message: 'Could not delete image from Cloudinary' });
        }
      }

      await image.deleteOne();
      res.json({ success: true, message: 'Gallery image deleted' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
