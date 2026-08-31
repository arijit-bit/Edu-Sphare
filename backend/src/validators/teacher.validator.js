const { z } = require('zod');

const submitGradeSchema = z.object({
  body: z.object({
    studentId: z.string().uuid('Invalid student ID format'),
    subjectId: z.string().uuid('Invalid subject ID format').optional(),
    score: z.number().min(0).max(100),
    remarks: z.string().max(255).optional(),
  }),
});

module.exports = {
  submitGradeSchema,
};
