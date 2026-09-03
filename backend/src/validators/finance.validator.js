const { z } = require('zod');

const PAYMENT_MODES = ['cash', 'upi', 'card', 'bank_transfer', 'cheque', 'online', 'dd'];
const FEE_TYPES = ['fee', 'payroll', 'expenses', 'annual', 'tax', 'transport'];
const INCOME_CATEGORIES = ['hostel', 'transport', 'admission', 'events', 'donation', 'custom', 'grant', 'facility_rental', 'canteen', 'library_fine'];

// Legacy — kept for backward compatibility
const createInvoiceSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID format'),
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().datetime().optional(),
  }),
});

// Record a student fee payment
const recordPaymentSchema = z.object({
  body: z.object({
    amount: z.number().positive('Payment amount must be greater than zero'),
    paymentMode: z.enum(PAYMENT_MODES).optional().default('cash'),
    transactionReference: z.string().optional(),
    notes: z.string().optional(),
  }),
});

// Bulk mark teacher salaries as paid
const bulkPaySchema = z.object({
  body: z.object({
    payMonth: z.string().min(3, 'Pay month is required (e.g. "May 2026")'),
  }),
});

// Generate a new finance report
const createReportSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Report title must be at least 3 characters'),
    type: z.enum(FEE_TYPES, { errorMap: () => ({ message: 'Invalid report type' }) }),
    periodLabel: z.string().min(1, 'Period label is required'),
    periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'periodStart must be YYYY-MM-DD'),
    periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'periodEnd must be YYYY-MM-DD'),
    description: z.string().optional(),
  }),
});

// Add other income entry
const addOtherIncomeSchema = z.object({
  body: z.object({
    category: z.enum(INCOME_CATEGORIES, { errorMap: () => ({ message: 'Invalid income category' }) }),
    description: z.string().min(1, 'Description is required'),
    amount: z.number().positive('Amount must be greater than zero'),
    incomeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    paymentMode: z.enum(PAYMENT_MODES).optional().default('cash'),
    transactionReference: z.string().optional(),
    receivedFrom: z.string().optional(),
    notes: z.string().optional(),
  }),
});

module.exports = {
  createInvoiceSchema,
  recordPaymentSchema,
  bulkPaySchema,
  createReportSchema,
  addOtherIncomeSchema,
};
