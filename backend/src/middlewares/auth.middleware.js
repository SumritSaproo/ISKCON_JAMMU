const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

/** Verifies the access token and attaches the decoded payload to req.user. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new AppError('Authentication required', 401));

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
}

/** Restricts a route to specific admin roles, e.g. requireRole('superadmin', 'editor'). */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
