const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// Public Authentication Endpoints (Rate-limited & Validated)
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authController.logout);

// Protected Authentication Endpoints
router.get('/me', authenticate, authController.getMe);

module.exports = router;
