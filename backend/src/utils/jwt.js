const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Sign an Access Token (short-lived JWT).
 * Only contains sub (user ID) to avoid trusting stale claims in the token.
 * @param {Object} payload
 * @param {string} payload.userId
 * @returns {string} Signed JWT token
 */
function signAccessToken(userId) {
  return jwt.sign(
    {
      sub: userId,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
}

/**
 * Verify an Access Token JWT.
 * @param {string} token
 * @returns {Object} Decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
