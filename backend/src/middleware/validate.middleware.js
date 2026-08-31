const { ZodError } = require('zod');
const ApiError = require('../utils/apiError');

/**
 * Express middleware generator for validating requests with Zod schemas.
 * @param {import('zod').ZodSchema} schema 
 */
function validate(schema) {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed/sanitized data back to request
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      return next();
    } catch (err) {
      if (err instanceof ZodError || err.name === 'ZodError') {
        const issues = err.issues || err.errors || [];
        const errorMessages = issues.map((e) => {
          const path = Array.isArray(e.path) ? e.path.slice(1).join('.') : '';
          return path ? `${path}: ${e.message}` : e.message;
        });
        const primaryMessage = issues[0]?.message || 'Validation failed';

        return res.status(400).json({
          success: false,
          message: primaryMessage,
          errors: errorMessages,
        });
      }
      return next(ApiError.badRequest('Invalid request payload'));
    }
  };
}

module.exports = validate;
