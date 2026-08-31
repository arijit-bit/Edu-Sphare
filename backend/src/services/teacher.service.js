const db = require('../config/database');

class TeacherService {
  async getDashboardData(teacherId) {
    const user = await db.query(
      'SELECT id, email, first_name, last_name, role FROM public.users WHERE id = $1',
      [teacherId]
    );

    return {
      message: 'Teacher dashboard loaded successfully',
      teacher: user.rows[0] || null,
      assignedClasses: [],
      schedules: [],
    };
  }

  async submitGrade({ studentId, subjectId, score, remarks, gradedBy }) {
    return {
      message: 'Grade submitted successfully',
      grade: {
        studentId,
        subjectId,
        score,
        remarks,
        gradedBy,
        submittedAt: new Date().toISOString(),
      },
    };
  }
}

module.exports = new TeacherService();
