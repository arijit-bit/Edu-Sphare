const db = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken } = require('../utils/jwt');
const {
  generateRefreshTokenString,
  hashRefreshToken,
  parseDurationToMs,
} = require('../utils/refreshToken');
const ApiError = require('../utils/apiError');
const env = require('../config/env');
const logger = require('../utils/logger');
const { ROLES } = require('../constants/roles');

/**
 * Format user entity for safe client response (never leak password_hash).
 */
function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
  };
}

class AuthService {
  /**
   * Register a new user (public registration defaults strictly to student).
   */
  async register({ email, password, firstName, lastName, role = ROLES.STUDENT }) {
    // Check if email already exists
    const existingUser = await db.query(
      'SELECT id FROM public.users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const passwordHash = await hashPassword(password);
    const fullName = `${firstName} ${lastName}`.trim();

    const insertResult = await db.query(
      `INSERT INTO public.users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        name, 
        role, 
        status, 
        is_active, 
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active', true, now(), now())
      RETURNING id, email, first_name, last_name, role, is_active, created_at`,
      [email, passwordHash, firstName, lastName, fullName, role]
    );

    const newUser = insertResult.rows[0];
    logger.info(`User registered successfully: ${newUser.email} (Role: ${newUser.role})`);

    return sanitizeUser(newUser);
  }

  /**
   * Login user with credentials and issue access token + refresh token.
   */
  async login({ email, password, userAgent, ipAddress }) {
    const userResult = await db.query(
      `SELECT id, email, password_hash, first_name, last_name, role, is_active, status 
       FROM public.users 
       WHERE email = $1 LIMIT 1`,
      [email]
    );

    // Prevent user enumeration: use generic message
    if (userResult.rows.length === 0) {
      // Run dummy compare to mitigate timing attacks
      await comparePassword(password, '$2b$12$e8984920840928409284029482094820948209482094820948209');
      throw ApiError.unauthorized('Invalid email or password');
    }

    const user = userResult.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Verify user is active
    if (user.is_active === false || user.status === 'inactive' || user.status === 'suspended') {
      throw ApiError.forbidden('Your account is deactivated. Please contact administration.');
    }

    // Generate JWT Access Token
    const accessToken = signAccessToken(user.id);

    // Generate cryptographically secure Refresh Token
    const rawRefreshToken = generateRefreshTokenString();
    const tokenHash = hashRefreshToken(rawRefreshToken);
    const ttlMs = parseDurationToMs(env.REFRESH_TOKEN_EXPIRES_IN);
    const expiresAt = new Date(Date.now() + ttlMs);

    // Store hashed refresh token with a new family_id
    await db.query(
      `INSERT INTO public.refresh_tokens (
        user_id, 
        token_hash, 
        family_id, 
        expires_at, 
        user_agent, 
        ip_address
      ) VALUES ($1, $2, gen_random_uuid(), $3, $4, $5)`,
      [user.id, tokenHash, expiresAt, userAgent || null, ipAddress || null]
    );

    // Update last_login_at
    await db.query('UPDATE public.users SET last_login_at = now() WHERE id = $1', [user.id]);

    logger.info(`User logged in successfully: ${user.email}`);

    return {
      user: sanitizeUser(user),
      accessToken,
      rawRefreshToken,
      expiresAt,
    };
  }

  /**
   * Refresh access token using rotated refresh token and family reuse detection.
   */
  async refresh({ rawRefreshToken, userAgent, ipAddress }) {
    if (!rawRefreshToken) {
      throw ApiError.unauthorized('Refresh token is missing');
    }

    const tokenHash = hashRefreshToken(rawRefreshToken);

    const tokenResult = await db.query(
      `SELECT id, user_id, token_hash, family_id, expires_at, revoked_at 
       FROM public.refresh_tokens 
       WHERE token_hash = $1 LIMIT 1`,
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokenRecord = tokenResult.rows[0];

    // Reuse detection: If token was already revoked, someone may be trying token theft
    if (tokenRecord.revoked_at !== null) {
      logger.warn(
        `🚨 REFRESH TOKEN REUSE DETECTED for user ${tokenRecord.user_id} and family ${tokenRecord.family_id}. Revoking entire family.`
      );
      // Invalidate all tokens in this family immediately
      await db.query(
        'UPDATE public.refresh_tokens SET revoked_at = now() WHERE family_id = $1',
        [tokenRecord.family_id]
      );
      throw ApiError.unauthorized(
        'Invalid or compromised session. Please sign in again.'
      );
    }

    // Check expiration
    if (new Date(tokenRecord.expires_at) < new Date()) {
      throw ApiError.unauthorized('Refresh token has expired. Please sign in again.');
    }

    // Check that the user is still active
    const userResult = await db.query(
      `SELECT id, email, first_name, last_name, role, is_active, status 
       FROM public.users 
       WHERE id = $1 LIMIT 1`,
      [tokenRecord.user_id]
    );

    if (userResult.rows.length === 0) {
      throw ApiError.unauthorized('User not found');
    }

    const user = userResult.rows[0];
    if (user.is_active === false || user.status === 'inactive' || user.status === 'suspended') {
      throw ApiError.forbidden('Your account is deactivated.');
    }

    // Perform Token Rotation:
    const newRawRefreshToken = generateRefreshTokenString();
    const newTokenHash = hashRefreshToken(newRawRefreshToken);
    const ttlMs = parseDurationToMs(env.REFRESH_TOKEN_EXPIRES_IN);
    const newExpiresAt = new Date(Date.now() + ttlMs);

    // Insert new token into database within same family
    const insertNewTokenResult = await db.query(
      `INSERT INTO public.refresh_tokens (
        user_id, 
        token_hash, 
        family_id, 
        expires_at, 
        user_agent, 
        ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        user.id,
        newTokenHash,
        tokenRecord.family_id,
        newExpiresAt,
        userAgent || null,
        ipAddress || null,
      ]
    );

    const newTokenId = insertNewTokenResult.rows[0].id;

    // Revoke old token and point to replacement
    await db.query(
      'UPDATE public.refresh_tokens SET revoked_at = now(), replaced_by_token_id = $1 WHERE id = $2',
      [newTokenId, tokenRecord.id]
    );

    // Generate fresh Access Token
    const newAccessToken = signAccessToken(user.id);

    return {
      user: sanitizeUser(user),
      accessToken: newAccessToken,
      rawRefreshToken: newRawRefreshToken,
      expiresAt: newExpiresAt,
    };
  }

  /**
   * Logout user by revoking their current refresh token.
   */
  async logout(rawRefreshToken) {
    if (!rawRefreshToken) return;

    const tokenHash = hashRefreshToken(rawRefreshToken);
    await db.query(
      'UPDATE public.refresh_tokens SET revoked_at = now() WHERE token_hash = $1',
      [tokenHash]
    );
  }

  /**
   * Fetch current user profile.
   */
  async getMe(userId) {
    const userResult = await db.query(
      `SELECT id, email, first_name, last_name, role, is_active, created_at 
       FROM public.users 
       WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw ApiError.notFound('User not found');
    }

    return sanitizeUser(userResult.rows[0]);
  }
}

module.exports = new AuthService();
