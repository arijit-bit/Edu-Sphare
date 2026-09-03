-- ==========================================================
-- Migration 002: Schools Master Table
-- Multi-tenant anchor — every piece of data is scoped to a school
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.schools (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  slug         TEXT        UNIQUE NOT NULL,           -- matches {schoolSlug} in frontend URL
  address      TEXT,
  city         TEXT,
  state        TEXT,
  pincode      TEXT,
  phone        TEXT,
  email        CITEXT,
  logo_url     TEXT,
  website_url  TEXT,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add missing columns if table already existed with older schema
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.schools ADD COLUMN address TEXT;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.schools ADD COLUMN city TEXT;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.schools ADD COLUMN state TEXT;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.schools ADD COLUMN pincode TEXT;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.schools ADD COLUMN phone TEXT;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.schools ADD COLUMN email CITEXT;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.schools ADD COLUMN logo_url TEXT;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.schools ADD COLUMN website_url TEXT;
  EXCEPTION WHEN duplicate_column THEN END;

  BEGIN
    ALTER TABLE public.schools ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  EXCEPTION WHEN duplicate_column THEN END;
END $$;


-- Index for slug lookups (used in every page load)
CREATE INDEX IF NOT EXISTS idx_schools_slug ON public.schools(slug);
CREATE INDEX IF NOT EXISTS idx_schools_is_active ON public.schools(is_active);

-- RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
