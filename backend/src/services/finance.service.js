const db = require('../config/database');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class FinanceService {
  // ──────────────────────────────────────────────────────────────
  // Utility: set school context for RLS session variable
  // ──────────────────────────────────────────────────────────────
  async _withSchoolContext(client, schoolId, fn) {
    await client.query(`SELECT set_config('app.current_school_id', $1, true)`, [schoolId]);
    return fn(client);
  }

  // ──────────────────────────────────────────────────────────────
  // DASHBOARD
  // ──────────────────────────────────────────────────────────────
  async getDashboardData(schoolId) {
    // Run all KPI queries in parallel for speed
    const [students, monthlyRevenue, pendingDues, netBalance, recentTxns, financialMetrics, expenseCategories] =
      await Promise.all([
        this._getTotalStudents(schoolId),
        this._getMonthlyRevenue(schoolId),
        this._getPendingDues(schoolId),
        this._getNetBalance(schoolId),
        this._getRecentTransactions(schoolId),
        this._getFinancialMetrics(schoolId),
        this._getExpenseCategories(schoolId),
      ]);

    return {
      stats: {
        totalStudents: students,
        monthlyRevenue,
        pendingDues,
        netBalance,
      },
      recentTransactions: recentTxns,
      financialMetrics,
      expenseCategories,
    };
  }

  async _getTotalStudents(schoolId) {
    const res = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM public.users
       WHERE school_id = $1 AND role = 'student' AND is_active = true`,
      [schoolId]
    );
    return res.rows[0]?.count ?? 0;
  }

  async _getMonthlyRevenue(schoolId) {
    const res = await db.query(
      `SELECT COALESCE(SUM(fp.amount), 0)::numeric AS total
       FROM public.fee_payments fp
       WHERE fp.school_id = $1
         AND DATE_TRUNC('month', fp.payment_date) = DATE_TRUNC('month', CURRENT_DATE)`,
      [schoolId]
    );
    return parseFloat(res.rows[0]?.total ?? 0);
  }

  async _getPendingDues(schoolId) {
    const res = await db.query(
      `SELECT COALESCE(SUM(fr.fee_amount - fr.amount_paid), 0)::numeric AS total
       FROM public.fee_records fr
       WHERE fr.school_id = $1
         AND fr.status IN ('pending', 'partial', 'overdue')
         AND fr.fee_month <= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'`,
      [schoolId]
    );
    return parseFloat(res.rows[0]?.total ?? 0);
  }

  async _getNetBalance(schoolId) {
    const res = await db.query(
      `WITH fee_rev AS (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.fee_payments WHERE school_id = $1
       ),
       other_rev AS (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.other_income WHERE school_id = $1
       ),
       salary_exp AS (
         SELECT COALESCE(SUM(net_salary), 0) AS v FROM public.salary_payments
         WHERE school_id = $1 AND status = 'paid'
       ),
       ops_exp AS (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.expenses WHERE school_id = $1
       )
       SELECT
         (fee_rev.v + other_rev.v)::numeric              AS total_revenue,
         (salary_exp.v + ops_exp.v)::numeric              AS total_expenses,
         (fee_rev.v + other_rev.v - salary_exp.v - ops_exp.v)::numeric AS net_balance
       FROM fee_rev, other_rev, salary_exp, ops_exp`,
      [schoolId]
    );
    const row = res.rows[0];
    return {
      totalRevenue: parseFloat(row?.total_revenue ?? 0),
      totalExpenses: parseFloat(row?.total_expenses ?? 0),
      netBalance: parseFloat(row?.net_balance ?? 0),
    };
  }

  async _getRecentTransactions(schoolId, limit = 10) {
    const res = await db.query(
      `(
         SELECT
           fp.receipt_number           AS id,
           u.first_name || ' ' || u.last_name AS name,
           'Fee'                        AS type,
           fp.amount,
           fp.payment_date              AS date,
           fr.status
         FROM public.fee_payments fp
         JOIN public.fee_records fr  ON fr.id = fp.fee_record_id
         JOIN public.users u         ON u.id  = fp.student_id
         WHERE fp.school_id = $1
         ORDER BY fp.created_at DESC
         LIMIT $2
       )
       UNION ALL
       (
         SELECT
           'SAL-' || sp.id::text        AS id,
           u.first_name || ' ' || u.last_name AS name,
           'Salary'                      AS type,
           sp.net_salary                 AS amount,
           sp.payment_date               AS date,
           sp.status
         FROM public.salary_payments sp
         JOIN public.users u ON u.id = sp.employee_id
         WHERE sp.school_id = $1 AND sp.payment_date IS NOT NULL
         ORDER BY sp.created_at DESC
         LIMIT $2
       )
       ORDER BY date DESC NULLS LAST
       LIMIT $2`,
      [schoolId, limit]
    );
    return res.rows;
  }

  async _getFinancialMetrics(schoolId) {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    const monthStr = currentMonthStart.toISOString().slice(0, 10);

    const res = await db.query(
      `SELECT
         COALESCE(SUM(CASE WHEN fr.status = 'paid' THEN fr.fee_amount ELSE 0 END), 0)::numeric AS collected,
         COALESCE(SUM(CASE WHEN fr.status != 'paid' THEN (fr.fee_amount - fr.amount_paid) ELSE 0 END), 0)::numeric AS pending,
         COALESCE(SUM(fr.fee_amount), 0)::numeric AS total_expected
       FROM public.fee_records fr
       WHERE fr.school_id = $1
         AND fr.fee_month = $2`,
      [schoolId, monthStr]
    );
    const row = res.rows[0];
    const collected = parseFloat(row?.collected ?? 0);
    const pending = parseFloat(row?.pending ?? 0);
    const totalExpected = parseFloat(row?.total_expected ?? 0);
    const collectedPct = totalExpected > 0 ? Math.round((collected / totalExpected) * 100) : 0;

    // Salary paid this month
    const salaryRes = await db.query(
      `SELECT COALESCE(SUM(net_salary), 0)::numeric AS paid
       FROM public.salary_payments
       WHERE school_id = $1
         AND pay_month = $2
         AND status = 'paid'`,
      [schoolId, monthStr]
    );
    const salaryPaid = parseFloat(salaryRes.rows[0]?.paid ?? 0);

    return [
      { label: 'Monthly Fees Collected', amount: collected, pct: collectedPct },
      { label: 'Pending Student Fees', amount: pending, pct: 100 - collectedPct },
      { label: 'Teacher Salary Paid', amount: salaryPaid, pct: 100 },
    ];
  }

  async _getExpenseCategories(schoolId) {
    const res = await db.query(
      `SELECT
         category,
         SUM(amount)::numeric AS total,
         ROUND(SUM(amount) * 100.0 / NULLIF(SUM(SUM(amount)) OVER (), 0), 1) AS percentage
       FROM public.expenses
       WHERE school_id = $1
         AND DATE_TRUNC('year', expense_date) = DATE_TRUNC('year', CURRENT_DATE)
       GROUP BY category
       ORDER BY total DESC`,
      [schoolId]
    );
    return res.rows.map((r) => ({
      key: r.category,
      label: r.category.charAt(0).toUpperCase() + r.category.slice(1),
      value: parseFloat(r.percentage ?? 0),
      total: parseFloat(r.total ?? 0),
    }));
  }

  // ──────────────────────────────────────────────────────────────
  // STUDENT PAYMENTS
  // ──────────────────────────────────────────────────────────────
  async getStudentPayments(schoolId, { month, classFilter, section, status, search, page = 1, limit = 50 }) {
    const offset = (page - 1) * limit;
    const conditions = ['fr.school_id = $1'];
    const values = [schoolId];
    let idx = 2;

    if (month) {
      // month comes as "May 2026" — convert to first-of-month date
      const d = new Date(`1 ${month}`);
      if (!isNaN(d)) {
        conditions.push(`fr.fee_month = $${idx++}`);
        values.push(d.toISOString().slice(0, 10));
      }
    }

    if (classFilter && classFilter !== 'All Classes') {
      conditions.push(`u.class_name = $${idx++}`);
      values.push(classFilter);
    }

    if (section && section !== 'All Sections') {
      conditions.push(`u.section = $${idx++}`);
      values.push(section);
    }

    if (status && status !== 'All Status') {
      conditions.push(`fr.status = $${idx++}`);
      values.push(status.toLowerCase());
    }

    if (search) {
      conditions.push(`(u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx} OR u.admission_number ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const whereClause = conditions.join(' AND ');

    const [dataRes, countRes, statsRes] = await Promise.all([
      db.query(
        `SELECT
           fr.id                AS fee_record_id,
           u.admission_number   AS id,
           u.first_name || ' ' || u.last_name AS name,
           u.class_name,
           u.section,
           TO_CHAR(fr.fee_month, 'Mon YYYY') AS month,
           fr.fee_amount        AS fee,
           fr.amount_paid       AS paid,
           fr.status,
           COALESCE(
             TO_CHAR(MAX(fp.payment_date), 'DD Mon YYYY'),
             'Due ' || TO_CHAR(fr.due_date, 'DD Mon')
           ) AS date
         FROM public.fee_records fr
         JOIN public.users u ON u.id = fr.student_id
         LEFT JOIN public.fee_payments fp ON fp.fee_record_id = fr.id
         WHERE ${whereClause} AND fr.fee_type = 'tuition'
         GROUP BY fr.id, u.admission_number, u.first_name, u.last_name, u.class_name, u.section
         ORDER BY u.class_name, u.section, u.last_name
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...values, limit, offset]
      ),
      db.query(
        `SELECT COUNT(DISTINCT fr.id)::int AS total
         FROM public.fee_records fr
         JOIN public.users u ON u.id = fr.student_id
         WHERE ${whereClause} AND fr.fee_type = 'tuition'`,
        values
      ),
      db.query(
        `SELECT
           COUNT(DISTINCT u.id)::int                                              AS total_students,
           COUNT(DISTINCT CASE WHEN fr.status = 'paid'  THEN u.id END)::int      AS paid_count,
           COUNT(DISTINCT CASE WHEN fr.status != 'paid' THEN u.id END)::int      AS pending_count,
           COALESCE(SUM(fr.amount_paid), 0)::numeric                             AS total_collected,
           COALESCE(SUM(fr.fee_amount - fr.amount_paid), 0)::numeric             AS total_dues
         FROM public.fee_records fr
         JOIN public.users u ON u.id = fr.student_id
         WHERE ${whereClause} AND fr.fee_type = 'tuition'`,
        values
      ),
    ]);

    const stats = statsRes.rows[0];
    return {
      records: dataRes.rows.map((r) => ({
        ...r,
        fee: parseFloat(r.fee),
        paid: parseFloat(r.paid),
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      })),
      pagination: {
        total: countRes.rows[0]?.total ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countRes.rows[0]?.total ?? 0) / limit),
      },
      stats: {
        totalStudents: parseInt(stats?.total_students ?? 0),
        paidCount: parseInt(stats?.paid_count ?? 0),
        pendingCount: parseInt(stats?.pending_count ?? 0),
        totalCollected: parseFloat(stats?.total_collected ?? 0),
        totalDues: parseFloat(stats?.total_dues ?? 0),
      },
    };
  }

  async recordStudentPayment(schoolId, feeRecordId, { amount, paymentMode, transactionReference, receivedBy, notes }) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Validate fee record belongs to this school and is not fully paid
      const feeRes = await client.query(
        `SELECT id, student_id, fee_amount, amount_paid, status
         FROM public.fee_records WHERE id = $1 AND school_id = $2`,
        [feeRecordId, schoolId]
      );
      if (feeRes.rows.length === 0) throw ApiError.notFound('Fee record not found');
      const feeRecord = feeRes.rows[0];
      if (feeRecord.status === 'paid') throw ApiError.badRequest('This fee has already been fully paid');
      if (amount > (feeRecord.fee_amount - feeRecord.amount_paid)) {
        throw ApiError.badRequest('Payment amount exceeds outstanding balance');
      }

      // Generate receipt number
      const settingsRes = await client.query(
        `UPDATE public.finance_settings
         SET receipt_counter = receipt_counter + 1, updated_at = now()
         WHERE school_id = $1
         RETURNING receipt_prefix, receipt_counter`,
        [schoolId]
      );
      const { receipt_prefix, receipt_counter } = settingsRes.rows[0] ?? { receipt_prefix: 'RCP', receipt_counter: 1 };
      const receiptNumber = `${receipt_prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${receipt_counter}`;

      // Insert payment
      const payRes = await client.query(
        `INSERT INTO public.fee_payments
           (school_id, fee_record_id, student_id, amount, payment_mode, transaction_reference, receipt_number, received_by, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, receipt_number`,
        [schoolId, feeRecordId, feeRecord.student_id, amount, paymentMode || 'cash', transactionReference, receiptNumber, receivedBy, notes]
      );

      // Write audit log
      await client.query(
        `INSERT INTO public.audit_log (school_id, action_type, entity_type, entity_id, performed_by, description, amount)
         VALUES ($1, 'fee_payment', 'fee_payment', $2, $3, $4, $5)`,
        [schoolId, payRes.rows[0].id, receivedBy, `Fee payment of ₹${amount} recorded`, amount]
      );

      await client.query('COMMIT');
      return { paymentId: payRes.rows[0].id, receiptNumber };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // TEACHER PAYROLL
  // ──────────────────────────────────────────────────────────────
  async getTeacherPayments(schoolId, { month, department, status, salaryType, search, page = 1, limit = 50 }) {
    const offset = (page - 1) * limit;
    const conditions = ['sp.school_id = $1'];
    const values = [schoolId];
    let idx = 2;

    if (month) {
      const d = new Date(`1 ${month}`);
      if (!isNaN(d)) {
        conditions.push(`sp.pay_month = $${idx++}`);
        values.push(d.toISOString().slice(0, 10));
      }
    }

    if (department && department !== 'All Departments') {
      conditions.push(`u.department = $${idx++}`);
      values.push(department);
    }

    if (status && status !== 'All Status') {
      conditions.push(`sp.status = $${idx++}`);
      values.push(status.toLowerCase());
    }

    if (salaryType && salaryType !== 'All Types') {
      conditions.push(`sp.salary_type = $${idx++}`);
      values.push(salaryType.toLowerCase().replace('-', '_'));
    }

    if (search) {
      conditions.push(`(u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx} OR u.employee_id ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const whereClause = conditions.join(' AND ');

    const [dataRes, countRes, statsRes] = await Promise.all([
      db.query(
        `SELECT
           sp.id,
           u.employee_id         AS id,
           u.first_name || ' ' || u.last_name AS name,
           u.department,
           u.designation,
           sp.basic_salary       AS basic,
           sp.total_deductions   AS deductions,
           sp.bonus,
           sp.net_salary,
           sp.status,
           sp.salary_type,
           COALESCE(TO_CHAR(sp.payment_date, 'DD Mon YYYY'), 'Due ' || TO_CHAR(sp.pay_month + INTERVAL '25 days', 'DD Mon YYYY')) AS date,
           sp.id AS salary_payment_id
         FROM public.salary_payments sp
         JOIN public.users u ON u.id = sp.employee_id
         WHERE ${whereClause}
         ORDER BY u.department, u.last_name
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...values, limit, offset]
      ),
      db.query(
        `SELECT COUNT(*)::int AS total FROM public.salary_payments sp
         JOIN public.users u ON u.id = sp.employee_id
         WHERE ${whereClause}`,
        values
      ),
      db.query(
        `SELECT
           COUNT(DISTINCT u.id)::int                                         AS total_teachers,
           COALESCE(SUM(CASE WHEN sp.status = 'paid'  THEN sp.net_salary ELSE 0 END), 0)::numeric AS paid_amount,
           COALESCE(SUM(CASE WHEN sp.status != 'paid' THEN sp.net_salary ELSE 0 END), 0)::numeric AS pending_amount,
           COALESCE(SUM(sp.total_deductions), 0)::numeric                    AS total_deductions
         FROM public.salary_payments sp
         JOIN public.users u ON u.id = sp.employee_id
         WHERE ${whereClause}`,
        values
      ),
    ]);

    const stats = statsRes.rows[0];
    return {
      records: dataRes.rows.map((r) => ({
        ...r,
        basic: parseFloat(r.basic),
        deductions: parseFloat(r.deductions),
        bonus: parseFloat(r.bonus),
        net_salary: parseFloat(r.net_salary),
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      })),
      pagination: {
        total: countRes.rows[0]?.total ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countRes.rows[0]?.total ?? 0) / limit),
      },
      stats: {
        totalTeachers: parseInt(stats?.total_teachers ?? 0),
        paidAmount: parseFloat(stats?.paid_amount ?? 0),
        pendingAmount: parseFloat(stats?.pending_amount ?? 0),
        totalDeductions: parseFloat(stats?.total_deductions ?? 0),
      },
    };
  }

  async markSalaryPaid(schoolId, salaryPaymentId, approvedBy) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const res = await client.query(
        `UPDATE public.salary_payments
         SET status = 'paid', payment_date = CURRENT_DATE, approved_by = $3, updated_at = now()
         WHERE id = $1 AND school_id = $2 AND status != 'paid'
         RETURNING id, employee_id, net_salary`,
        [salaryPaymentId, schoolId, approvedBy]
      );
      if (res.rows.length === 0) throw ApiError.notFound('Salary record not found or already paid');

      await client.query(
        `INSERT INTO public.audit_log (school_id, action_type, entity_type, entity_id, performed_by, description, amount)
         VALUES ($1, 'salary_paid', 'salary_payment', $2, $3, $4, $5)`,
        [schoolId, salaryPaymentId, approvedBy, 'Salary marked as paid', res.rows[0].net_salary]
      );

      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async bulkMarkSalariesPaid(schoolId, payMonth, approvedBy) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const d = new Date(`1 ${payMonth}`);
      const monthStr = d.toISOString().slice(0, 10);

      const res = await client.query(
        `UPDATE public.salary_payments
         SET status = 'paid', payment_date = CURRENT_DATE, approved_by = $3
         WHERE school_id = $1 AND pay_month = $2 AND status != 'paid'
         RETURNING id`,
        [schoolId, monthStr, approvedBy]
      );

      for (const row of res.rows) {
        await client.query(
          `INSERT INTO public.audit_log (school_id, action_type, entity_type, entity_id, performed_by, description)
           VALUES ($1, 'salary_paid', 'salary_payment', $2, $3, 'Bulk salary approval')`,
          [schoolId, row.id, approvedBy]
        );
      }

      await client.query('COMMIT');
      return { updatedCount: res.rowCount };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // SUMMARY (Annual)
  // ──────────────────────────────────────────────────────────────
  async getSummary(schoolId) {
    const yearRes = await db.query(
      `SELECT id, label, start_date, end_date FROM public.academic_years
       WHERE school_id = $1 AND is_active = true LIMIT 1`,
      [schoolId]
    );
    const year = yearRes.rows[0];
    if (!year) return { error: 'No active academic year found' };

    const [metrics, monthlyTrend, expenseDist, earningSummary] = await Promise.all([
      this._getSummaryMetrics(schoolId, year),
      this._getMonthlyTrend(schoolId, year),
      this._getExpenseDistribution(schoolId, year),
      this._getEarningSummary(schoolId, year),
    ]);

    return { academicYear: year.label, metrics, monthlyTrend, expenseDist, earningSummary };
  }

  async _getSummaryMetrics(schoolId, year) {
    const res = await db.query(
      `WITH fee_total AS (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.fee_payments fp
         WHERE fp.school_id = $1
           AND fp.payment_date BETWEEN $2 AND $3
       ),
       other_total AS (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.other_income oi
         WHERE oi.school_id = $1 AND oi.income_date BETWEEN $2 AND $3
       ),
       salary_total AS (
         SELECT COALESCE(SUM(net_salary), 0) AS v FROM public.salary_payments sp
         WHERE sp.school_id = $1 AND sp.pay_month BETWEEN $2 AND $3 AND sp.status = 'paid'
       ),
       expense_total AS (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.expenses e
         WHERE e.school_id = $1 AND e.expense_date BETWEEN $2 AND $3
       ),
       expected_total AS (
         SELECT COALESCE(SUM(fee_amount), 0) AS v FROM public.fee_records fr
         WHERE fr.school_id = $1 AND fr.fee_month BETWEEN $2 AND $3
       )
       SELECT
         (fee_total.v + other_total.v)::numeric            AS total_earnings,
         (salary_total.v + expense_total.v)::numeric       AS total_expenses,
         (fee_total.v + other_total.v - salary_total.v - expense_total.v)::numeric AS net_surplus,
         CASE WHEN expected_total.v > 0
              THEN ROUND((fee_total.v * 100.0 / expected_total.v), 1)
              ELSE 0
         END::numeric                                       AS collection_efficiency
       FROM fee_total, other_total, salary_total, expense_total, expected_total`,
      [schoolId, year.start_date, year.end_date]
    );
    const r = res.rows[0];
    return {
      totalEarnings: parseFloat(r?.total_earnings ?? 0),
      totalExpenses: parseFloat(r?.total_expenses ?? 0),
      netSurplus: parseFloat(r?.net_surplus ?? 0),
      collectionEfficiency: parseFloat(r?.collection_efficiency ?? 0),
    };
  }

  async _getMonthlyTrend(schoolId, year) {
    const res = await db.query(
      `SELECT
         TO_CHAR(month_series, 'Mon') AS label,
         COALESCE(fee_inc.v, 0) + COALESCE(other_inc.v, 0) AS earnings,
         COALESCE(sal_exp.v, 0) + COALESCE(ops_exp.v, 0)   AS expenses
       FROM generate_series($2::date, $3::date, '1 month'::interval) AS month_series
       LEFT JOIN LATERAL (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.fee_payments
         WHERE school_id = $1 AND DATE_TRUNC('month', payment_date) = month_series
       ) fee_inc ON true
       LEFT JOIN LATERAL (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.other_income
         WHERE school_id = $1 AND DATE_TRUNC('month', income_date) = month_series
       ) other_inc ON true
       LEFT JOIN LATERAL (
         SELECT COALESCE(SUM(net_salary), 0) AS v FROM public.salary_payments
         WHERE school_id = $1 AND pay_month = month_series AND status = 'paid'
       ) sal_exp ON true
       LEFT JOIN LATERAL (
         SELECT COALESCE(SUM(amount), 0) AS v FROM public.expenses
         WHERE school_id = $1 AND DATE_TRUNC('month', expense_date) = month_series
       ) ops_exp ON true
       ORDER BY month_series`,
      [schoolId, year.start_date, year.end_date]
    );
    return res.rows.map((r) => ({
      label: r.label,
      earnings: parseFloat(r.earnings),
      expenses: parseFloat(r.expenses),
      surplus: parseFloat(r.earnings) - parseFloat(r.expenses),
    }));
  }

  async _getExpenseDistribution(schoolId, year) {
    const res = await db.query(
      `SELECT
         category                AS key,
         SUM(amount)::numeric    AS total,
         ROUND(SUM(amount) * 100.0 / NULLIF(SUM(SUM(amount)) OVER (), 0), 1)::numeric AS value
       FROM public.expenses
       WHERE school_id = $1 AND expense_date BETWEEN $2 AND $3
       GROUP BY category
       ORDER BY total DESC`,
      [schoolId, year.start_date, year.end_date]
    );
    return res.rows.map((r) => ({
      key: r.key,
      label: r.key.charAt(0).toUpperCase() + r.key.slice(1),
      value: parseFloat(r.value ?? 0),
      total: parseFloat(r.total ?? 0),
    }));
  }

  async _getEarningSummary(schoolId, year) {
    const res = await db.query(
      `SELECT
         COALESCE(SUM(fp.amount), 0)::numeric                              AS fee_collected,
         COALESCE(SUM(oi.amount), 0)::numeric                              AS other_income,
         (SELECT COALESCE(SUM(fr.fee_amount), 0) FROM public.fee_records fr
          WHERE fr.school_id = $1 AND fr.fee_type = 'admission'
            AND fr.fee_month BETWEEN $2 AND $3)::numeric                   AS admission_fees
       FROM public.fee_payments fp
       CROSS JOIN (
         SELECT COALESCE(SUM(amount), 0) AS amount FROM public.other_income
         WHERE school_id = $1 AND income_date BETWEEN $2 AND $3
       ) oi
       WHERE fp.school_id = $1 AND fp.payment_date BETWEEN $2 AND $3`,
      [schoolId, year.start_date, year.end_date]
    );
    const r = res.rows[0];
    return {
      feeCollected: parseFloat(r?.fee_collected ?? 0),
      otherIncome: parseFloat(r?.other_income ?? 0),
      admissionFees: parseFloat(r?.admission_fees ?? 0),
    };
  }

  // ──────────────────────────────────────────────────────────────
  // AUDIT
  // ──────────────────────────────────────────────────────────────
  async getAuditLog(schoolId, { actionType, dateFrom, dateTo, page = 1, limit = 30 }) {
    const offset = (page - 1) * limit;
    const conditions = ['al.school_id = $1'];
    const values = [schoolId];
    let idx = 2;

    if (actionType && actionType !== 'all') {
      conditions.push(`al.action_type = $${idx++}`);
      values.push(actionType);
    }
    if (dateFrom) { conditions.push(`al.created_at::date >= $${idx++}`); values.push(dateFrom); }
    if (dateTo) { conditions.push(`al.created_at::date <= $${idx++}`); values.push(dateTo); }

    const whereClause = conditions.join(' AND ');

    const [dataRes, countRes] = await Promise.all([
      db.query(
        `SELECT
           al.id, al.action_type, al.entity_type, al.entity_id,
           al.description, al.amount, al.created_at,
           u.first_name || ' ' || u.last_name AS performed_by_name,
           u.role AS performed_by_role
         FROM public.audit_log al
         JOIN public.users u ON u.id = al.performed_by
         WHERE ${whereClause}
         ORDER BY al.created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...values, limit, offset]
      ),
      db.query(`SELECT COUNT(*)::int AS total FROM public.audit_log al WHERE ${whereClause}`, values),
    ]);

    return {
      entries: dataRes.rows,
      pagination: {
        total: countRes.rows[0]?.total ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countRes.rows[0]?.total ?? 0) / limit),
      },
    };
  }

  async getAuditTeacherRows(schoolId, month) {
    const d = new Date(`1 ${month}`);
    const monthStr = d.toISOString().slice(0, 10);
    const res = await db.query(
      `SELECT
         sp.id,
         u.employee_id,
         u.first_name || ' ' || u.last_name AS name,
         u.department                         AS faculty,
         sp.net_salary                        AS salary,
         TO_CHAR(sp.pay_month, 'Mon YYYY')   AS month,
         sp.status
       FROM public.salary_payments sp
       JOIN public.users u ON u.id = sp.employee_id
       WHERE sp.school_id = $1 AND sp.pay_month = $2
       ORDER BY u.last_name`,
      [schoolId, monthStr]
    );
    return res.rows;
  }

  async getAuditStudentRows(schoolId, month) {
    const d = new Date(`1 ${month}`);
    const monthStr = d.toISOString().slice(0, 10);
    const res = await db.query(
      `SELECT
         fr.id,
         u.admission_number  AS student_id,
         u.first_name || ' ' || u.last_name AS name,
         u.class_name || '-' || u.section AS grade,
         fr.fee_amount                   AS fee,
         ARRAY_AGG(TO_CHAR(fr.fee_month, 'Mon YYYY')) AS months,
         fr.status
       FROM public.fee_records fr
       JOIN public.users u ON u.id = fr.student_id
       WHERE fr.school_id = $1 AND fr.fee_month = $2
       GROUP BY fr.id, u.admission_number, u.first_name, u.last_name, u.class_name, u.section
       ORDER BY u.last_name`,
      [schoolId, monthStr]
    );
    return res.rows;
  }

  async getOtherIncomeRows(schoolId, month) {
    const d = new Date(`1 ${month}`);
    const monthStr = d.toISOString().slice(0, 10);
    const res = await db.query(
      `SELECT
         oi.id,
         oi.category,
         'Income'           AS type,
         oi.amount,
         oi.payment_mode    AS "paymentMode",
         COALESCE(oi.transaction_reference, 'Paid via cash') AS "paymentRef",
         TO_CHAR(oi.income_date, 'YYYY-MM-DD') AS date,
         TO_CHAR(DATE_TRUNC('month', oi.income_date), 'Mon YYYY') AS month
       FROM public.other_income oi
       WHERE oi.school_id = $1
         AND DATE_TRUNC('month', oi.income_date) = $2
       ORDER BY oi.income_date DESC`,
      [schoolId, monthStr]
    );
    return res.rows;
  }

  async addOtherIncome(schoolId, { category, description, amount, incomeDate, paymentMode, transactionReference, receivedFrom, recordedBy, notes }) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Get active academic year
      const yearRes = await client.query(
        `SELECT id FROM public.academic_years WHERE school_id = $1 AND is_active = true LIMIT 1`,
        [schoolId]
      );
      if (yearRes.rows.length === 0) throw ApiError.badRequest('No active academic year found');

      const res = await client.query(
        `INSERT INTO public.other_income
           (school_id, academic_year_id, category, description, amount, income_date, payment_mode, transaction_reference, received_from, recorded_by, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [schoolId, yearRes.rows[0].id, category, description, amount, incomeDate || new Date().toISOString().slice(0, 10), paymentMode || 'cash', transactionReference, receivedFrom, recordedBy, notes]
      );

      await client.query(
        `INSERT INTO public.audit_log (school_id, action_type, entity_type, entity_id, performed_by, description, amount)
         VALUES ($1, 'income_added', 'other_income', $2, $3, $4, $5)`,
        [schoolId, res.rows[0].id, recordedBy, `Other income added: ${category} - ${description}`, amount]
      );

      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // REPORTS
  // ──────────────────────────────────────────────────────────────
  async getReports(schoolId, { status, search }) {
    const conditions = ['school_id = $1'];
    const values = [schoolId];
    let idx = 2;

    if (status && status !== 'All Status') {
      // Map UI display values to DB values
      const statusMap = { 'Paid': 'approved', 'Pending': 'pending', 'Processing': 'processing', 'Failed': 'failed' };
      const dbStatus = statusMap[status] ?? status.toLowerCase();
      conditions.push(`status = $${idx++}`);
      values.push(dbStatus);
    }

    if (search) {
      conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const res = await db.query(
      `SELECT id, report_number, title, type, period_label, status, description, file_size_kb, created_at
       FROM public.finance_reports
       WHERE ${conditions.join(' AND ')}
       ORDER BY created_at DESC`,
      values
    );

    // Map DB status back to UI display values
    const statusDisplay = { 'approved': 'Paid', 'pending': 'Pending', 'processing': 'Processing', 'failed': 'Failed' };

    return res.rows.map((r) => ({
      id: r.id,
      reportNumber: r.report_number,
      title: r.title,
      type: r.type,
      period: r.period_label,
      status: statusDisplay[r.status] ?? r.status,
      description: r.description,
      size: r.file_size_kb ? `${(r.file_size_kb / 1024).toFixed(1)} MB` : 'N/A',
      createdAt: r.created_at,
    }));
  }

  async createReport(schoolId, { title, type, periodLabel, periodStart, periodEnd, description, generatedBy }) {
    const reportNumber = `REP-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    const res = await db.query(
      `INSERT INTO public.finance_reports
         (school_id, report_number, title, type, period_label, period_start, period_end, status, description, generated_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'processing', $8, $9)
       RETURNING id, report_number`,
      [schoolId, reportNumber, title, type, periodLabel, periodStart, periodEnd, description, generatedBy]
    );

    await db.query(
      `INSERT INTO public.audit_log (school_id, action_type, entity_type, entity_id, performed_by, description)
       VALUES ($1, 'report_generated', 'finance_report', $2, $3, $4)`,
      [schoolId, res.rows[0].id, generatedBy, `Report generated: ${title}`]
    );

    return res.rows[0];
  }

  // ──────────────────────────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────────────────────────
  async getSettings(schoolId) {
    const [settingsRes, yearRes] = await Promise.all([
      db.query(`SELECT * FROM public.finance_settings WHERE school_id = $1`, [schoolId]),
      db.query(`SELECT id, label FROM public.academic_years WHERE school_id = $1 AND is_active = true LIMIT 1`, [schoolId]),
    ]);
    return {
      settings: settingsRes.rows[0] ?? null,
      activeAcademicYear: yearRes.rows[0] ?? null,
    };
  }

  async updateSettings(schoolId, updates, updatedBy) {
    const allowed = ['fee_due_day', 'reminder_days_before', 'overdue_grace_days', 'sms_alerts_enabled',
      'email_alerts_enabled', 'late_fee_percent', 'receipt_footer_text', 'school_bank_name',
      'school_bank_account', 'school_bank_ifsc', 'currency', 'receipt_prefix', 'payment_modes_enabled'];

    const setClauses = [];
    const values = [schoolId];
    let idx = 2;

    for (const [key, value] of Object.entries(updates)) {
      if (allowed.includes(key)) {
        setClauses.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (setClauses.length === 0) throw ApiError.badRequest('No valid settings fields provided');

    setClauses.push(`updated_at = now()`);

    const res = await db.query(
      `UPDATE public.finance_settings SET ${setClauses.join(', ')}
       WHERE school_id = $1
       RETURNING *`,
      values
    );

    await db.query(
      `INSERT INTO public.audit_log (school_id, action_type, entity_type, entity_id, performed_by, description, new_value)
       VALUES ($1, 'setting_changed', 'finance_settings', (SELECT id FROM public.finance_settings WHERE school_id = $1), $2, 'Finance settings updated', $3)`,
      [schoolId, updatedBy, JSON.stringify(updates)]
    );

    return res.rows[0];
  }

  // ──────────────────────────────────────────────────────────────
  // Academic Years (for filter dropdowns)
  // ──────────────────────────────────────────────────────────────
  async getAcademicYears(schoolId) {
    const res = await db.query(
      `SELECT id, label, start_date, end_date, is_active FROM public.academic_years
       WHERE school_id = $1 ORDER BY start_date DESC`,
      [schoolId]
    );
    return res.rows;
  }

  // ──────────────────────────────────────────────────────────────
  // Legacy: createInvoice (keep existing API working)
  // ──────────────────────────────────────────────────────────────
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
