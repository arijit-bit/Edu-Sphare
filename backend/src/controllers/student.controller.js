const studentService = require('../services/student.service');
const HTTP_STATUS = require('../constants/httpStatus');

class StudentController {
  async getDashboard(req, res, next) {
    try {
      const data = await studentService.getDashboardData(req.user.id);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updated = await studentService.updateProfile(req.user.id, req.body);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Profile updated successfully',
        user: updated,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new StudentController();
