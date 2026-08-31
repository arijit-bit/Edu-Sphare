const crypto = require('crypto');

/**
 * Generate a cryptographically random refresh token string.
 * @returns {string}
 */
function generateRefreshTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

/**
 * Compute SHA-256 hash of a refresh token string for safe DB storage/lookup.
 * @param {string} tokenString
 * @returns {string}
 */
function hashRefreshToken(tokenString) {
  return crypto.createHash('sha256').update(tokenString).digest('hex');
}

/**
 * Parse a duration string like '7d', '15m', '24h' into milliseconds.
 * @param {string} durationStr
 * @returns {number} milliseconds
 */
function parseDurationToMs(durationStr) {
  const match = durationStr.match(/^(\d+)([smhd])$/);
  if (!match) {
    // Default fallback to 7 days
    return 7 * 24 * 60 * 60 * 1000;
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
}

module.exports = {
  generateRefreshTokenString,
  hashRefreshToken,
  parseDurationToMs,
};
