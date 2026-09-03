-- ==========================================================
-- Migration 003: Extend users table for multi-tenancy & profiles
-- SAFE ORDER: add nullable → seed school → backfill → add NOT NULL
-- ==========================================================

-- Step 1: Add new columns (all nullable at first)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS school_id        UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS admission_number TEXT,          -- for students, e.g. "ADM-2401"
  ADD COLUMN IF NOT EXISTS employee_id      TEXT,          -- for teachers/staff, e.g. "EMP-1024"
  ADD COLUMN IF NOT EXISTS class_name       TEXT,          -- for students, e.g. "10"
  ADD COLUMN IF NOT EXISTS section          TEXT,          -- for students, e.g. "A"
  ADD COLUMN IF NOT EXISTS department       TEXT,          -- for staff, e.g. "Mathematics"
  ADD COLUMN IF NOT EXISTS designation      TEXT,          -- for staff, e.g. "HOD"
  ADD COLUMN IF NOT EXISTS phone            TEXT,
  ADD COLUMN IF NOT EXISTS date_of_joining  DATE,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Step 2: Seed a default school for existing users (idempotent)
INSERT INTO public.schools (id, name, slug, is_active, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default School',
  'default',
  true,
  now(),
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- Step 3: Backfill all existing users to the default school
UPDATE public.users
SET school_id = '00000000-0000-0000-0000-000000000001'
WHERE school_id IS NULL;

-- Step 4: Now safe to add NOT NULL constraint
ALTER TABLE public.users
  ALTER COLUMN school_id SET NOT NULL;

-- Step 5: Add FK constraint explicitly (for clarity in schema docs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_school_id'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT fk_users_school_id FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- Step 6: Indexes for frequent lookups
CREATE INDEX IF NOT EXISTS idx_users_school_id       ON public.users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role_school     ON public.users(school_id, role);
CREATE INDEX IF NOT EXISTS idx_users_admission_num   ON public.users(admission_number) WHERE admission_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_employee_id     ON public.users(employee_id)      WHERE employee_id IS NOT NULL;
