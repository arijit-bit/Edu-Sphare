const { z } = require('zod');

const createInvoiceSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID format'),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().datetime().optional(),
  }),
});

module.exports = {
  createInvoiceSchema,
};
