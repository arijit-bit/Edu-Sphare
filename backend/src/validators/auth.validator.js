const { z } = require('zod');
const { ALL_ROLES } = require('../constants/roles');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password is too long'),
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
});

const adminCreateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password is too long')
      .optional(),
    firstName: z.string().min(1, 'First name is required').trim(),
    middleName: z.string().trim().optional(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    className: z.string().trim().optional(),
    monthlyFee: z.number().min(0).optional(),
    role: z.enum(ALL_ROLES, {
      errorMap: () => ({ message: `Role must be one of: ${ALL_ROLES.join(', ')}` }),
    }),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  adminCreateUserSchema,
};
