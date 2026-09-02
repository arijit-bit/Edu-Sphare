-- ==========================================================
-- EduSphere Authentication & Authorization Schema Migration
-- ==========================================================

-- 1. Ensure UUID and Citext extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 2. Create users table if not exists or add missing columns
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  status TEXT NOT NULL DEFAULT 'active',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Add check constraint for supported roles if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_user_role'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT check_user_role 
      CHECK (role IN ('student', 'teacher', 'finance_manager', 'admin'));
  END IF;
END $$;

-- 3. Backfill first_name and last_name from existing 'name' column if present
UPDATE public.users 
SET 
  first_name = COALESCE(NULLIF(split_part(name, ' ', 1), ''), 'User'),
  last_name = COALESCE(NULLIF(SUBSTRING(name FROM POSITION(' ' IN name) + 1), ''), 'Account')
WHERE name IS NOT NULL AND (first_name IS NULL OR last_name IS NULL);

-- 4. Sync existing roles from memberships table (if existing)
UPDATE public.users u
SET role = CASE 
    WHEN m.role = 'finance' THEN 'finance_manager'
    WHEN m.role = 'teacher' THEN 'teacher'
    WHEN m.role = 'admin' THEN 'admin'
    ELSE 'student'
END
FROM public.memberships m
WHERE u.id = m.user_id AND u.role = 'student';

-- 5. Create refresh_tokens table
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  family_id UUID NOT NULL DEFAULT gen_random_uuid(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  replaced_by_token_id UUID REFERENCES public.refresh_tokens(id) ON DELETE SET NULL,
  user_agent TEXT,
  ip_address TEXT
);

-- Indexes for optimal lookup and cleanup
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON public.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON public.refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id ON public.refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON public.refresh_tokens(expires_at);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Block direct public/anon access on refresh_tokens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'refresh_tokens' AND policyname = 'Deny direct public access on refresh_tokens'
  ) THEN
    CREATE POLICY "Deny direct public access on refresh_tokens" ON public.refresh_tokens FOR ALL USING (false);
  END IF;
END $$;
