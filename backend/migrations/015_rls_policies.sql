-- ==========================================================
-- Migration 015: Row Level Security Policies
-- Controls which rows each role can read/write
-- ==========================================================

-- ── Helper: current user's school_id ──
-- The app sets a session variable `app.current_school_id` on every connection.
-- This is set by the backend BEFORE executing any query.
-- Usage in policies: current_setting('app.current_school_id', true)::uuid

-- ── schools ──
DROP POLICY IF EXISTS "Finance: read own school" ON public.schools;
CREATE POLICY "Finance: read own school" ON public.schools
  FOR SELECT USING (id::text = current_setting('app.current_school_id', true));

-- ── users ──
DROP POLICY IF EXISTS "Finance: read school users" ON public.users;
CREATE POLICY "Finance: read school users" ON public.users
  FOR SELECT USING (school_id::text = current_setting('app.current_school_id', true));

-- ── academic_years ──
DROP POLICY IF EXISTS "Finance: read academic years" ON public.academic_years;
CREATE POLICY "Finance: read academic years" ON public.academic_years
  FOR SELECT USING (school_id::text = current_setting('app.current_school_id', true));

-- ── fee_structures ──
DROP POLICY IF EXISTS "Finance: read fee structures" ON public.fee_structures;
CREATE POLICY "Finance: read fee structures" ON public.fee_structures
  FOR SELECT USING (school_id::text = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS "Finance: write fee structures" ON public.fee_structures;
CREATE POLICY "Finance: write fee structures" ON public.fee_structures
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── fee_records ──
DROP POLICY IF EXISTS "Finance: access fee records" ON public.fee_records;
CREATE POLICY "Finance: access fee records" ON public.fee_records
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── fee_payments ──
DROP POLICY IF EXISTS "Finance: access fee payments" ON public.fee_payments;
CREATE POLICY "Finance: access fee payments" ON public.fee_payments
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── salary_structures ──
DROP POLICY IF EXISTS "Finance: access salary structures" ON public.salary_structures;
CREATE POLICY "Finance: access salary structures" ON public.salary_structures
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── salary_payments ──
DROP POLICY IF EXISTS "Finance: access salary payments" ON public.salary_payments;
CREATE POLICY "Finance: access salary payments" ON public.salary_payments
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── expenses ──
DROP POLICY IF EXISTS "Finance: access expenses" ON public.expenses;
CREATE POLICY "Finance: access expenses" ON public.expenses
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── other_income ──
DROP POLICY IF EXISTS "Finance: access other income" ON public.other_income;
CREATE POLICY "Finance: access other income" ON public.other_income
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── finance_reports ──
DROP POLICY IF EXISTS "Finance: access reports" ON public.finance_reports;
CREATE POLICY "Finance: access reports" ON public.finance_reports
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── finance_settings ──
DROP POLICY IF EXISTS "Finance: access settings" ON public.finance_settings;
CREATE POLICY "Finance: access settings" ON public.finance_settings
  FOR ALL USING (school_id::text = current_setting('app.current_school_id', true));

-- ── audit_log (read-only for all authenticated school users) ──
DROP POLICY IF EXISTS "Finance: read audit log" ON public.audit_log;
CREATE POLICY "Finance: read audit log" ON public.audit_log
  FOR SELECT USING (school_id::text = current_setting('app.current_school_id', true));

DROP POLICY IF EXISTS "Finance: insert audit log" ON public.audit_log;
CREATE POLICY "Finance: insert audit log" ON public.audit_log
  FOR INSERT WITH CHECK (school_id::text = current_setting('app.current_school_id', true));
