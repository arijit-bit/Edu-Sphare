const { verifyAccessToken } = require('../utils/jwt');
const ApiError = require('../utils/apiError');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Authentication middleware to verify JWT access tokens and attach the live user to req.user.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Access token is missing or malformed'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('Access token is missing'));
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Access token has expired'));
      }
      return next(ApiError.unauthorized('Invalid access token'));
    }

    if (!decoded || !decoded.sub) {
      return next(ApiError.unauthorized('Invalid access token payload'));
    }

    // Always fetch the live user state from PostgreSQL to verify status and role
    const userResult = await db.query(
      `SELECT id, email, first_name, last_name, role, is_active, status 
       FROM public.users 
       WHERE id = $1 LIMIT 1`,
      [decoded.sub]
    );

    if (userResult.rows.length === 0) {
      return next(ApiError.unauthorized('User associated with this token no longer exists'));
    }

    const user = userResult.rows[0];

    // Verify account active status
    if (user.is_active === false || user.status === 'inactive' || user.status === 'suspended') {
      return next(ApiError.forbidden('Your account is deactivated. Please contact administration.'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      isActive: user.is_active,
    };

    return next();
  } catch (err) {
    logger.error('Authentication middleware error:', err);
    return next(ApiError.internal('Failed to authenticate token'));
  }
}

module.exports = {
  authenticate,
};
