const teacherService = require('../services/teacher.service');
const HTTP_STATUS = require('../constants/httpStatus');

class TeacherController {
  async getDashboard(req, res, next) {
    try {
      const data = await teacherService.getDashboardData(req.user.id);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      return next(err);
    }
  }

  async submitGrade(req, res, next) {
    try {
      const result = await teacherService.submitGrade({
        ...req.body,
        gradedBy: req.user.id,
      });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        ...result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new TeacherController();
