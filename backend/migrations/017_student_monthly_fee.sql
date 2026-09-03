-- ==========================================================
-- Migration 017: Student Monthly Fee
-- ==========================================================

-- Add monthly_fee column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10,2) DEFAULT 0.00;
