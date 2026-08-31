const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_LOGIN_WINDOW_MS || 15 * 60 * 1000, // 15 mins by default
  max: env.NODE_ENV === 'test' ? 1000 : env.RATE_LIMIT_LOGIN_MAX || 15, // configurable limit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
  skip: (req) => {
    // Optionally skip rate limiting in automated test environments
    return env.NODE_ENV === 'test';
  },
});

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.NODE_ENV === 'test' ? 5000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  skip: (req) => env.NODE_ENV === 'test',
});

module.exports = {
  authLimiter,
  globalLimiter,
};
