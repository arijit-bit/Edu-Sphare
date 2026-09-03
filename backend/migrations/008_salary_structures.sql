-- ==========================================================
-- Migration 008: Salary Structures
-- Per-employee base salary configuration per academic year
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.salary_structures (
  id               UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  employee_id      UUID           NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  academic_year_id UUID           NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  basic_salary     NUMERIC(12,2)  NOT NULL CHECK (basic_salary >= 0),
  hra              NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (hra >= 0),        -- House Rent Allowance
  da               NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (da >= 0),         -- Dearness Allowance
  ta               NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (ta >= 0),         -- Travel Allowance
  pf_employee      NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (pf_employee >= 0),-- Employee PF deduction
  pf_employer      NUMERIC(12,2)  NOT NULL DEFAULT 0 CHECK (pf_employer >= 0),-- Employer PF contribution
  professional_tax NUMERIC(12,2)  NOT NULL DEFAULT 0,                         -- PT deduction
  tds              NUMERIC(12,2)  NOT NULL DEFAULT 0,                         -- TDS deduction
  salary_type      TEXT           NOT NULL DEFAULT 'monthly',                 -- 'monthly','contract','part_time'
  effective_from   DATE           NOT NULL,
  effective_to     DATE,                                                       -- NULL = currently active
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_salary_type') THEN
    ALTER TABLE public.salary_structures
      ADD CONSTRAINT check_salary_type
      CHECK (salary_type IN ('monthly','contract','part_time'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_salary_structures_employee ON public.salary_structures(employee_id);
CREATE INDEX IF NOT EXISTS idx_salary_structures_school   ON public.salary_structures(school_id);
CREATE INDEX IF NOT EXISTS idx_salary_structures_active   ON public.salary_structures(employee_id) WHERE effective_to IS NULL;

ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;
