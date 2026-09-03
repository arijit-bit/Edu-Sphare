-- ==========================================================
-- Migration 011: Other Income
-- Non-fee income: hostel, admission, transport, events, donations
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.other_income (
  id                    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id             UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  academic_year_id      UUID           NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  category              TEXT           NOT NULL,
  description           TEXT           NOT NULL,
  amount                NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
  income_date           DATE           NOT NULL DEFAULT CURRENT_DATE,
  payment_mode          TEXT           NOT NULL DEFAULT 'cash',
  transaction_reference TEXT,
  received_from         TEXT,
  recorded_by           UUID           NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ    NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_other_income_category') THEN
    ALTER TABLE public.other_income
      ADD CONSTRAINT check_other_income_category
      CHECK (category IN (
        'hostel','transport','admission','events','donation','custom',
        'grant','facility_rental','canteen','library_fine'
      ));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_other_income_mode') THEN
    ALTER TABLE public.other_income
      ADD CONSTRAINT check_other_income_mode
      CHECK (payment_mode IN ('cash','online','cheque','bank_transfer','card','upi','dd'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_other_income_school      ON public.other_income(school_id, income_date);
CREATE INDEX IF NOT EXISTS idx_other_income_category    ON public.other_income(school_id, category);
CREATE INDEX IF NOT EXISTS idx_other_income_academic_yr ON public.other_income(academic_year_id);

ALTER TABLE public.other_income ENABLE ROW LEVEL SECURITY;
