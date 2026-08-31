const db = require('../config/database');

class FinanceService {
  async getDashboardData(userId) {
    const user = await db.query(
      'SELECT id, email, first_name, last_name, role FROM public.users WHERE id = $1',
      [userId]
    );

    return {
      message: 'Finance dashboard loaded successfully',
      financeOfficer: user.rows[0] || null,
      recentTransactions: [],
      pendingInvoices: [],
      revenueSummary: { total: 0, pending: 0 },
    };
  }

  async createInvoice({ studentId, amount, description, dueDate, createdBy }) {
    return {
      message: 'Invoice created successfully',
      invoice: {
        id: 'inv_' + Date.now(),
        studentId,
        amount,
        description,
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy,
        status: 'unpaid',
      },
    };
  }
}

module.exports = new FinanceService();
