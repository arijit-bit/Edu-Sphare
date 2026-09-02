const authService = require('../services/auth.service');
const HTTP_STATUS = require('../constants/httpStatus');
const env = require('../config/env');
const { ROLES } = require('../constants/roles');

const REFRESH_COOKIE_NAME = 'refreshToken';

/**
 * Configure cookie options securely based on environment
 * Production (cross-site: vercel.app -> render.com):
 *   sameSite: 'none', secure: true, httpOnly: true, path: '/'
 * Development (localhost:3000 -> localhost:4000):
 *   sameSite: 'lax', secure: false, httpOnly: true, path: '/'
 */
function getRefreshCookieOptions(expiresAt) {
  const isProduction = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? (env.COOKIE_SAME_SITE || 'none') : (env.COOKIE_SAME_SITE || 'lax'),
    path: '/',
    expires: expiresAt,
  };
}

function getClearCookieOptions() {
  const isProduction = env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? (env.COOKIE_SAME_SITE || 'none') : (env.COOKIE_SAME_SITE || 'lax'),
    path: '/',
  };
}

class AuthController {
  /**
   * POST /api/auth/register
   * Public registration is strictly constrained to student accounts.
   */
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Force role to student for public registration to prevent privilege escalation
      const user = await authService.register({
        email,
        password,
        firstName,
        lastName,
        role: ROLES.STUDENT,
      });

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Registration successful. You can now log in.',
        user,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/auth/login
   * Returns accessToken in body, sends refreshToken in HttpOnly cookie.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection?.remoteAddress;

      const { user, accessToken, rawRefreshToken, expiresAt } = await authService.login({
        email,
        password,
        userAgent,
        ipAddress,
      });

      // Set HttpOnly cookie for refresh token
      res.cookie(REFRESH_COOKIE_NAME, rawRefreshToken, getRefreshCookieOptions(expiresAt));

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        user,
        accessToken,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/auth/refresh
   * Rotates refresh token and issues a new access token.
   */
  async refresh(req, res, next) {
    try {
      // Read refresh token from HttpOnly cookie
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection?.remoteAddress;

      const { user, accessToken, rawRefreshToken: newRawRefreshToken, expiresAt } =
        await authService.refresh({
          rawRefreshToken,
          userAgent,
          ipAddress,
        });

      // Set new rotated refresh token in HttpOnly cookie if rotated
      if (newRawRefreshToken) {
        res.cookie(REFRESH_COOKIE_NAME, newRawRefreshToken, getRefreshCookieOptions(expiresAt));
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Token refreshed successfully',
        user,
        accessToken,
      });
    } catch (err) {
      // Clear cookie on failure
      res.clearCookie(REFRESH_COOKIE_NAME, getClearCookieOptions());
      return next(err);
    }
  }

  /**
   * POST /api/auth/logout
   * Revokes refresh token and clears cookie.
   */
  async logout(req, res, next) {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
      if (rawRefreshToken) {
        await authService.logout(rawRefreshToken);
      }

      res.clearCookie(REFRESH_COOKIE_NAME, getClearCookieOptions());

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/auth/me
   * Returns current authenticated user's profile.
   */
  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        user,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
