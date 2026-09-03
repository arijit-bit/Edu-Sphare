-- ==========================================================
-- Migration 012: Finance Reports
-- Metadata for generated financial report documents
-- FIX: status values aligned with UI StatusBadge expectations
--   DB: 'approved' | 'pending' | 'processing' | 'failed'
--   UI: 'Paid'→'approved', 'Pending', 'Processing', 'Failed'
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.finance_reports (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  report_number   TEXT           UNIQUE NOT NULL,  -- e.g. "REP-2026-05"
  title           TEXT           NOT NULL,
  type            TEXT           NOT NULL,         -- 'fee','payroll','expenses','annual','tax','transport'
  period_label    TEXT           NOT NULL,         -- e.g. "May 2026", "Q2 2026", "2025-2026"
  period_start    DATE           NOT NULL,
  period_end      DATE           NOT NULL,
  status          TEXT           NOT NULL DEFAULT 'processing',
  description     TEXT,
  file_url        TEXT,
  file_size_kb    INTEGER,
  generated_by    UUID           REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_report_type') THEN
    ALTER TABLE public.finance_reports
      ADD CONSTRAINT check_report_type
      CHECK (type IN ('fee','payroll','expenses','annual','tax','transport'));
  END IF;
  -- Status aligned with UI: 'approved' maps to what the UI calls 'Paid' (green badge)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_report_status') THEN
    ALTER TABLE public.finance_reports
      ADD CONSTRAINT check_report_status
      CHECK (status IN ('approved','pending','processing','failed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_finance_reports_school  ON public.finance_reports(school_id);
CREATE INDEX IF NOT EXISTS idx_finance_reports_type    ON public.finance_reports(school_id, type);
CREATE INDEX IF NOT EXISTS idx_finance_reports_status  ON public.finance_reports(school_id, status);

ALTER TABLE public.finance_reports ENABLE ROW LEVEL SECURITY;
