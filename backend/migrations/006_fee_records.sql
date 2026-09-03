-- ==========================================================
-- Migration 006: Fee Records
-- One record per student × month × fee_type
-- Generated at enrollment and at the start of each billing month
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.fee_records (
  id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id          UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id         UUID           NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  academic_year_id   UUID           NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  fee_structure_id   UUID           REFERENCES public.fee_structures(id) ON DELETE SET NULL,
  fee_type           TEXT           NOT NULL DEFAULT 'tuition',
  fee_month          DATE           NOT NULL,   -- first day of the month: '2026-05-01'
  fee_amount         NUMERIC(12,2)  NOT NULL CHECK (fee_amount >= 0),
  amount_paid        NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  status             TEXT           NOT NULL DEFAULT 'pending',
  due_date           DATE           NOT NULL,
  waiver_amount      NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (waiver_amount >= 0),
  waiver_reason      TEXT,
  notes              TEXT,
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- Check constraints
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_fee_record_status') THEN
    ALTER TABLE public.fee_records
      ADD CONSTRAINT check_fee_record_status
      CHECK (status IN ('paid', 'partial', 'pending', 'overdue', 'waived'));
  END IF;
END $$;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_fee_records_student      ON public.fee_records(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_records_school_month ON public.fee_records(school_id, fee_month);
CREATE INDEX IF NOT EXISTS idx_fee_records_status       ON public.fee_records(school_id, status);
CREATE INDEX IF NOT EXISTS idx_fee_records_due_date     ON public.fee_records(due_date) WHERE status != 'paid';
CREATE INDEX IF NOT EXISTS idx_fee_records_academic     ON public.fee_records(academic_year_id);

ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
