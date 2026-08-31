const { z } = require('zod');
const { ALL_ROLES } = require('../constants/roles');

const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    role: z.enum(ALL_ROLES, {
      errorMap: () => ({ message: `Role must be one of: ${ALL_ROLES.join(', ')}` }),
    }),
  }),
});

const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

module.exports = {
  updateUserRoleSchema,
  updateUserStatusSchema,
};
