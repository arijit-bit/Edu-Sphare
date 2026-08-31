const express = require('express');
const teacherController = require('../controllers/teacher.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { submitGradeSchema } = require('../validators/teacher.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Require authenticated user with teacher or admin role
router.use(authenticate, authorizeRoles(ROLES.TEACHER, ROLES.ADMIN));

router.get('/dashboard', teacherController.getDashboard);
router.post('/grades', validate(submitGradeSchema), teacherController.submitGrade);

module.exports = router;
