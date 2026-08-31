const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { adminCreateUserSchema } = require('../validators/auth.validator');
const {
  updateUserRoleSchema,
  updateUserStatusSchema,
} = require('../validators/admin.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Strictly require authenticated user with admin role
router.use(authenticate, authorizeRoles(ROLES.ADMIN));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.post('/users', validate(adminCreateUserSchema), adminController.createUser);
router.patch('/users/:id/role', validate(updateUserRoleSchema), adminController.updateUserRole);
router.patch('/users/:id/status', validate(updateUserStatusSchema), adminController.updateUserStatus);

module.exports = router;
