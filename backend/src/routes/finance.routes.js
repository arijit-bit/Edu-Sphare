const express = require('express');
const financeController = require('../controllers/finance.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { createInvoiceSchema, recordPaymentSchema, createReportSchema, addOtherIncomeSchema, bulkPaySchema } = require('../validators/finance.validator');
const { ROLES } = require('../constants/roles');

const router = express.Router();

// All finance routes require authentication + finance_manager or admin role
router.use(authenticate, authorizeRoles(ROLES.FINANCE_MANAGER, ROLES.ADMIN));

// ── Dashboard ──────────────────────────────────────────────────
router.get('/dashboard', financeController.getDashboard);

// ── Academic Years (for filter dropdowns) ─────────────────────
router.get('/academic-years', financeController.getAcademicYears);

// ── Student Payments ──────────────────────────────────────────
// GET  /api/finance/student-payments?month=May+2026&classFilter=10&section=A&status=All+Status&search=&page=1&limit=50
router.get('/student-payments', financeController.getStudentPayments);
// POST /api/finance/student-payments/:feeRecordId/pay
router.post('/student-payments/:feeRecordId/pay', validate(recordPaymentSchema), financeController.recordStudentPayment);

// ── Teacher Payroll ───────────────────────────────────────────
// GET  /api/finance/teacher-payments?month=May+2026&department=Mathematics&status=All+Status&salaryType=monthly
router.get('/teacher-payments', financeController.getTeacherPayments);
// PUT  /api/finance/teacher-payments/:salaryId/mark-paid
router.put('/teacher-payments/:salaryId/mark-paid', financeController.markSalaryPaid);
// POST /api/finance/teacher-payments/bulk-pay  { payMonth: "May 2026" }
router.post('/teacher-payments/bulk-pay', validate(bulkPaySchema), financeController.bulkMarkSalariesPaid);

// ── Annual Summary ────────────────────────────────────────────
router.get('/summary', financeController.getSummary);

// ── Audit ─────────────────────────────────────────────────────
// GET  /api/finance/audit?actionType=fee_payment&dateFrom=2026-05-01&dateTo=2026-05-31&page=1
router.get('/audit', financeController.getAuditLog);
// GET  /api/finance/audit/teachers?month=May+2026
router.get('/audit/teachers', financeController.getAuditTeacherRows);
// GET  /api/finance/audit/students?month=May+2026
router.get('/audit/students', financeController.getAuditStudentRows);
// GET  /api/finance/audit/other-income?month=May+2026
router.get('/audit/other-income', financeController.getOtherIncomeRows);
// POST /api/finance/audit/other-income
router.post('/audit/other-income', validate(addOtherIncomeSchema), financeController.addOtherIncome);

// ── Reports ───────────────────────────────────────────────────
// GET  /api/finance/reports?status=All+Status&search=
router.get('/reports', financeController.getReports);
// POST /api/finance/reports
router.post('/reports', validate(createReportSchema), financeController.createReport);

// ── Settings ──────────────────────────────────────────────────
router.get('/settings', financeController.getSettings);
router.put('/settings', financeController.updateSettings);

// ── Legacy ────────────────────────────────────────────────────
router.post('/invoices', validate(createInvoiceSchema), financeController.createInvoice);

module.exports = router;
