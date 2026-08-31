const express = require('express');
const studentController = require('../controllers/student.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema } = require('../validators/student.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Require authenticated user with student or admin role
router.use(authenticate, authorizeRoles(ROLES.STUDENT, ROLES.ADMIN));

router.get('/dashboard', studentController.getDashboard);
router.patch('/profile', validate(updateProfileSchema), studentController.updateProfile);

module.exports = router;
