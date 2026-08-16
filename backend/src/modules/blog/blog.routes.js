const express = require('express');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const BlogPost = require('./blog.model');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { language, tag, page = 1, limit = 10 } = req.query;
    const query = {};
    if (language) query.language = language;
    if (tag) query.tags = tag;
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-contentHtml'); // list view skips full body for speed
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requireAuth, requireRole('superadmin', 'editor'), async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, requireRole('superadmin'), async (req, res, next) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
