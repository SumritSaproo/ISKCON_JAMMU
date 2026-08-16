const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const validate = require('../../middlewares/validate');
const { sensitiveActionLimiter } = require('../../middlewares/rateLimiter');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');
const User = require('./user.model');
const { AppError } = require('../../middlewares/errorHandler');

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function issueTokens(user) {
  const payload = { id: user._id, role: user.role, name: user.name };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
  return { accessToken, refreshToken };
}

router.post('/login', sensitiveActionLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    if(!(await user.comparePassword(password))){
      throw new AppError('User not found.', 404);
    }
    const tokens = issueTokens(user);
    res.json({
      success: true,
      data: { user: { id: user._id, name: user.name, role: user.role }, ...tokens },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role, name: decoded.name },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(new AppError('Invalid or expired refresh token', 401));
  }
});

// Superadmin creates additional staff accounts (no public self-registration)
router.post('/', requireAuth, requireRole('superadmin'), async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs');
    const { name, email, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    res.status(201).json({ success: true, data: { id: user._id, name, email, role } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
