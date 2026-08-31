const ApiError = require('../utils/apiError');

/**
 * Role-Based Access Control (RBAC) middleware factory.
 * @param  {...string} allowedRoles - List of permitted role names
 * @returns {Function} Express middleware
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`Forbidden: Requires one of [${allowedRoles.join(', ')}] role permissions`)
      );
    }

    return next();
  };
}

module.exports = {
  authorizeRoles,
};
