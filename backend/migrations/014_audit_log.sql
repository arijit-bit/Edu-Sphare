-- ==========================================================
-- Migration 014: Audit Log
-- Immutable append-only ledger of every financial action
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  action_type   TEXT           NOT NULL,
  entity_type   TEXT           NOT NULL,
  entity_id     UUID           NOT NULL,
  performed_by  UUID           NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  description   TEXT           NOT NULL,
  amount        NUMERIC(12,2),
  old_value     JSONB,
  new_value     JSONB,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_audit_action_type') THEN
    ALTER TABLE public.audit_log
      ADD CONSTRAINT check_audit_action_type
      CHECK (action_type IN (
        'fee_payment','salary_paid','expense_added','income_added',
        'report_generated','setting_changed','waiver_applied',
        'fee_reminder','student_enrolled','salary_approved'
      ));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_audit_entity_type') THEN
    ALTER TABLE public.audit_log
      ADD CONSTRAINT check_audit_entity_type
      CHECK (entity_type IN (
        'fee_record','fee_payment','salary_payment','expense',
        'other_income','finance_report','finance_settings','user'
      ));
  END IF;
END $$;

-- Indexes optimised for the Audit page filters
CREATE INDEX IF NOT EXISTS idx_audit_log_school       ON public.audit_log(school_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action       ON public.audit_log(school_id, action_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity       ON public.audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_performed_by ON public.audit_log(performed_by);

-- RLS — all authenticated users of the school can read; no direct insert/update/delete
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Prevent any UPDATE or DELETE via a rule (append-only enforcement)
CREATE OR REPLACE RULE audit_log_no_update AS ON UPDATE TO public.audit_log DO INSTEAD NOTHING;
CREATE OR REPLACE RULE audit_log_no_delete AS ON DELETE TO public.audit_log DO INSTEAD NOTHING;
