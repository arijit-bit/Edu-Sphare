-- ==========================================================
-- Migration 013: Finance Settings
-- Per-school configuration — one row per school
-- FIX: active_academic_year_id REMOVED — use academic_years.is_active instead
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.finance_settings (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id               UUID        UNIQUE NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  currency                TEXT        NOT NULL DEFAULT 'INR',
  receipt_prefix          TEXT        NOT NULL DEFAULT 'RCP',
  receipt_counter         INTEGER     NOT NULL DEFAULT 1,
  payment_modes_enabled   TEXT[]      NOT NULL DEFAULT ARRAY['cash','upi','card','bank_transfer'],
  fee_due_day             INTEGER     NOT NULL DEFAULT 10 CHECK (fee_due_day BETWEEN 1 AND 28),
  reminder_days_before    INTEGER     NOT NULL DEFAULT 5  CHECK (reminder_days_before >= 0),
  overdue_grace_days      INTEGER     NOT NULL DEFAULT 3  CHECK (overdue_grace_days >= 0),
  sms_alerts_enabled      BOOLEAN     NOT NULL DEFAULT true,
  email_alerts_enabled    BOOLEAN     NOT NULL DEFAULT true,
  late_fee_percent        NUMERIC(5,2)NOT NULL DEFAULT 0  CHECK (late_fee_percent >= 0),
  receipt_footer_text     TEXT,
  school_bank_name        TEXT,
  school_bank_account     TEXT,
  school_bank_ifsc        TEXT,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
  -- NOTE: active_academic_year_id intentionally omitted.
  -- Use: SELECT id FROM academic_years WHERE school_id = ? AND is_active = true
);

-- Seed default settings for the default school
INSERT INTO public.finance_settings (school_id, currency, receipt_prefix, fee_due_day)
VALUES ('00000000-0000-0000-0000-000000000001', 'INR', 'RCP', 10)
ON CONFLICT (school_id) DO NOTHING;

ALTER TABLE public.finance_settings ENABLE ROW LEVEL SECURITY;
