const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).trim().optional(),
    lastName: z.string().min(1).trim().optional(),
    phone: z.string().trim().optional(),
  }),
});

module.exports = {
  updateProfileSchema,
};
