-- ==========================================================
-- Migration 005: Fee Structures
-- Defines how much fee a student of a given class pays
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.fee_structures (
  id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id          UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  academic_year_id   UUID           NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  class_name         TEXT           NOT NULL,   -- e.g. "10", "LKG"
  fee_type           TEXT           NOT NULL,   -- 'tuition','transport','exam','activity','hostel','admission'
  amount             NUMERIC(12,2)  NOT NULL CHECK (amount >= 0),
  frequency          TEXT           NOT NULL DEFAULT 'monthly',  -- 'monthly','quarterly','annual','one_time'
  is_optional        BOOLEAN        NOT NULL DEFAULT false,
  description        TEXT,
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ    NOT NULL DEFAULT now(),

  CONSTRAINT uq_fee_structure UNIQUE (school_id, academic_year_id, class_name, fee_type)
);

-- Check constraints for allowed values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_fee_type') THEN
    ALTER TABLE public.fee_structures
      ADD CONSTRAINT check_fee_type
      CHECK (fee_type IN ('tuition','transport','exam','activity','hostel','admission','miscellaneous'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_fee_frequency') THEN
    ALTER TABLE public.fee_structures
      ADD CONSTRAINT check_fee_frequency
      CHECK (frequency IN ('monthly','quarterly','annual','one_time'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_fee_structures_school     ON public.fee_structures(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_year_class ON public.fee_structures(academic_year_id, class_name);

ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
