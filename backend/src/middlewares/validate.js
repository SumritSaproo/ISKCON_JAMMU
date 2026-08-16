const { AppError } = require('./errorHandler');

/**
 * Wraps a Zod schema so any module can validate req.body declaratively:
 *   router.post('/', validate(eventSchema), createEvent)
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(', ');
      return next(new AppError(`Validation error: ${message}`, 400));
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;
