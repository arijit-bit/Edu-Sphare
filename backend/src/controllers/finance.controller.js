const financeService = require('../services/finance.service');
const HTTP_STATUS = require('../constants/httpStatus');

class FinanceController {
  // ── Dashboard ──
  async getDashboard(req, res, next) {
    try {
      const data = await financeService.getDashboardData(req.user.schoolId);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  // ── Student Payments ──
  async getStudentPayments(req, res, next) {
    try {
      const data = await financeService.getStudentPayments(req.user.schoolId, req.query);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async recordStudentPayment(req, res, next) {
    try {
      const result = await financeService.recordStudentPayment(
        req.user.schoolId,
        req.params.feeRecordId,
        { ...req.body, receivedBy: req.user.id }
      );
      return res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  // ── Teacher Payroll ──
  async getTeacherPayments(req, res, next) {
    try {
      const data = await financeService.getTeacherPayments(req.user.schoolId, req.query);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async markSalaryPaid(req, res, next) {
    try {
      const result = await financeService.markSalaryPaid(
        req.user.schoolId, req.params.salaryId, req.user.id
      );
      return res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  async bulkMarkSalariesPaid(req, res, next) {
    try {
      const { payMonth } = req.body;
      const result = await financeService.bulkMarkSalariesPaid(req.user.schoolId, payMonth, req.user.id);
      return res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  // ── Summary ──
  async getSummary(req, res, next) {
    try {
      const data = await financeService.getSummary(req.user.schoolId);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  // ── Audit ──
  async getAuditLog(req, res, next) {
    try {
      const data = await financeService.getAuditLog(req.user.schoolId, req.query);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async getAuditTeacherRows(req, res, next) {
    try {
      const data = await financeService.getAuditTeacherRows(req.user.schoolId, req.query.month);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async getAuditStudentRows(req, res, next) {
    try {
      const data = await financeService.getAuditStudentRows(req.user.schoolId, req.query.month);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async getOtherIncomeRows(req, res, next) {
    try {
      const data = await financeService.getOtherIncomeRows(req.user.schoolId, req.query.month);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async addOtherIncome(req, res, next) {
    try {
      const result = await financeService.addOtherIncome(req.user.schoolId, { ...req.body, recordedBy: req.user.id });
      return res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  // ── Reports ──
  async getReports(req, res, next) {
    try {
      const data = await financeService.getReports(req.user.schoolId, req.query);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async createReport(req, res, next) {
    try {
      const result = await financeService.createReport(req.user.schoolId, { ...req.body, generatedBy: req.user.id });
      return res.status(HTTP_STATUS.CREATED).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  // ── Settings ──
  async getSettings(req, res, next) {
    try {
      const data = await financeService.getSettings(req.user.schoolId);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  async updateSettings(req, res, next) {
    try {
      const result = await financeService.updateSettings(req.user.schoolId, req.body, req.user.id);
      return res.status(HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) { return next(err); }
  }

  // ── Academic Years (for dropdowns) ──
  async getAcademicYears(req, res, next) {
    try {
      const data = await financeService.getAcademicYears(req.user.schoolId);
      return res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) { return next(err); }
  }

  // ── Legacy: createInvoice ──
  async createInvoice(req, res, next) {
    try {
      const result = await financeService.createInvoice({ ...req.body, createdBy: req.user.id });
      return res.status(HTTP_STATUS.CREATED).json({ success: true, ...result });
    } catch (err) { return next(err); }
  }
}

module.exports = new FinanceController();
