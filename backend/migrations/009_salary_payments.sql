-- ==========================================================
-- Migration 009: Salary Payments
-- Monthly disbursement record per employee
-- FIX: salary_type denormalized here so filter works at query time
-- FIX: net_salary all source columns are NOT NULL DEFAULT 0 (safe generated column)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.salary_payments (
  id                    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id             UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  employee_id           UUID           NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  salary_structure_id   UUID           REFERENCES public.salary_structures(id) ON DELETE SET NULL,
  pay_month             DATE           NOT NULL,  -- first day of month: '2026-05-01'
  basic_salary          NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (basic_salary >= 0),
  allowances            NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (allowances >= 0),  -- HRA+DA+TA combined
  bonus                 NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (bonus >= 0),
  total_deductions      NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (total_deductions >= 0),
  -- GENERATED column: safe because all 4 sources are NOT NULL DEFAULT 0
  net_salary            NUMERIC(12,2)  GENERATED ALWAYS AS
                          (basic_salary + allowances + bonus - total_deductions) STORED,
  salary_type           TEXT           NOT NULL DEFAULT 'monthly',  -- denormalized from salary_structures
  status                TEXT           NOT NULL DEFAULT 'pending',
  payment_date          DATE,
  payment_mode          TEXT,
  transaction_reference TEXT,
  payslip_url           TEXT,
  approved_by           UUID           REFERENCES public.users(id) ON DELETE SET NULL,
  notes                 TEXT,
  created_at            TIMESTAMPTZ    NOT NULL DEFAULT now(),

  CONSTRAINT uq_salary_payment UNIQUE (school_id, employee_id, pay_month)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_salary_payment_status') THEN
    ALTER TABLE public.salary_payments
      ADD CONSTRAINT check_salary_payment_status
      CHECK (status IN ('paid', 'pending', 'processing', 'cancelled'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_salary_payment_type') THEN
    ALTER TABLE public.salary_payments
      ADD CONSTRAINT check_salary_payment_type
      CHECK (salary_type IN ('monthly','contract','part_time'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_salary_payments_employee ON public.salary_payments(employee_id);
CREATE INDEX IF NOT EXISTS idx_salary_payments_month   ON public.salary_payments(school_id, pay_month);
CREATE INDEX IF NOT EXISTS idx_salary_payments_status  ON public.salary_payments(school_id, status);

ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;
