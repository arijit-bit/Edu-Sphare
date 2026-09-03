-- ==========================================================
-- Migration 010: Operational Expenses
-- All non-payroll school expenditures
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.expenses (
  id                    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id             UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  academic_year_id      UUID           NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  category              TEXT           NOT NULL,
  sub_category          TEXT,
  description           TEXT           NOT NULL,
  amount                NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
  expense_date          DATE           NOT NULL DEFAULT CURRENT_DATE,
  payment_mode          TEXT           NOT NULL DEFAULT 'cash',
  transaction_reference TEXT,
  vendor_name           TEXT,
  vendor_contact        TEXT,
  receipt_url           TEXT,
  approved_by           UUID           REFERENCES public.users(id) ON DELETE SET NULL,
  recorded_by           UUID           NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ    NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_expense_category') THEN
    ALTER TABLE public.expenses
      ADD CONSTRAINT check_expense_category
      CHECK (category IN (
        'maintenance','transport','electricity','events','hostel',
        'stationery','internet','miscellaneous','equipment',
        'staff_welfare','rent','insurance'
      ));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_expense_payment_mode') THEN
    ALTER TABLE public.expenses
      ADD CONSTRAINT check_expense_payment_mode
      CHECK (payment_mode IN ('cash','online','cheque','bank_transfer','card','upi','dd'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_expenses_school_date   ON public.expenses(school_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category      ON public.expenses(school_id, category);
CREATE INDEX IF NOT EXISTS idx_expenses_academic_year ON public.expenses(academic_year_id);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
