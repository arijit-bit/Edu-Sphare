-- ==========================================================
-- Migration 004: Academic Years
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.academic_years (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  UUID        NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  label      TEXT        NOT NULL,        -- e.g. "2025-2026"
  start_date DATE        NOT NULL,        -- e.g. 2025-04-01
  end_date   DATE        NOT NULL,        -- e.g. 2026-03-31
  is_active  BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safely add missing columns if table already existed from another module
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.academic_years ADD COLUMN label TEXT;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.academic_years ADD COLUMN start_date DATE;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.academic_years ADD COLUMN end_date DATE;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.academic_years ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT false;
  EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- Only ONE active academic year per school
-- Partial unique index enforces single source of truth (fixes plan issue)
CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_years_one_active
  ON public.academic_years(school_id)
  WHERE is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_academic_years_label
  ON public.academic_years(school_id, label);

CREATE INDEX IF NOT EXISTS idx_academic_years_school ON public.academic_years(school_id);

-- Seed a default academic year for the default school
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='academic_years' AND column_name='name') THEN
    EXECUTE 'UPDATE public.academic_years SET is_active = true, label = name, start_date = starts_on, end_date = ends_on WHERE school_id = ''00000000-0000-0000-0000-000000000001'' AND name = ''2025-2026'' AND label IS NULL';
  END IF;
END $$;

INSERT INTO public.academic_years (school_id, name, label, start_date, starts_on, end_date, ends_on, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', '2025-2026', '2025-2026', '2025-04-01', '2025-04-01', '2026-03-31', '2026-03-31', true)
ON CONFLICT (school_id, label) DO NOTHING;

ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;

