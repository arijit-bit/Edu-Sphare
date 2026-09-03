const adminService = require('../services/admin.service');
const HTTP_STATUS = require('../constants/httpStatus');

class AdminController {
  async getStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const role = req.query.role;
      const search = req.query.search;

      const result = await adminService.getAllUsers({ page, limit, role, search });
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        ...result,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/admin/users
   * Privileged endpoint to create any role (student, teacher, finance_manager, admin)
   */
  async createUser(req, res, next) {
    try {
      const { email, password, firstName, middleName, lastName, className, role } = req.body;
      const user = await adminService.createUser({
        email,
        password,
        firstName,
        middleName,
        lastName,
        className,
        role,
      });

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: `User created with role ${role}`,
        user,
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const user = await adminService.updateUserRole(id, role);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'User role updated successfully',
        user,
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await adminService.updateUserStatus(id, isActive);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        user,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AdminController();
