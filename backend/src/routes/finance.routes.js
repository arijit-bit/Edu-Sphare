const express = require('express');
const financeController = require('../controllers/finance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { createInvoiceSchema } = require('../validators/finance.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// Require authenticated user with finance_manager or admin role
router.use(authenticate, authorizeRoles(ROLES.FINANCE_MANAGER, ROLES.ADMIN));

router.get('/dashboard', financeController.getDashboard);
router.post('/invoices', validate(createInvoiceSchema), financeController.createInvoice);

module.exports = router;
