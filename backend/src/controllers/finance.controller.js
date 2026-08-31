const financeService = require('../services/finance.service');
const HTTP_STATUS = require('../constants/httpStatus');

class FinanceController {
  async getDashboard(req, res, next) {
    try {
      const data = await financeService.getDashboardData(req.user.id);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      return next(err);
    }
  }

  async createInvoice(req, res, next) {
    try {
      const result = await financeService.createInvoice({
        ...req.body,
        createdBy: req.user.id,
      });
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        ...result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new FinanceController();
