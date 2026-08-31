const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Handle 404 Not Found for unmapped routes
 */
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Global centralized error handling middleware
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific database errors (like unique constraint violation)
  if (err.code === '23505') {
    statusCode = 409;
    message = 'An account with this email already exists';
  }

  // Do not expose internal error messages in production for 500 errors
  if (statusCode === 500 && env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  if (statusCode >= 500) {
    logger.error(`[${req.method} ${req.originalUrl}] ${err.message}`, err.stack);
  } else {
    logger.warn(`[${req.method} ${req.originalUrl}] ${statusCode} - ${message}`);
  }

  const response = {
    success: false,
    message,
  };

  if (env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
