-- ==========================================================
-- Migration 007: Fee Payments + Auto-Status Trigger
-- Each actual payment received against a fee_record
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.fee_payments (
  id                    UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id             UUID           NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  fee_record_id         UUID           NOT NULL REFERENCES public.fee_records(id) ON DELETE CASCADE,
  student_id            UUID           NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount                NUMERIC(12,2)  NOT NULL CHECK (amount > 0),
  payment_date          DATE           NOT NULL DEFAULT CURRENT_DATE,
  payment_mode          TEXT           NOT NULL DEFAULT 'cash',
  transaction_reference TEXT,
  receipt_number        TEXT           UNIQUE,
  received_by           UUID           REFERENCES public.users(id) ON DELETE SET NULL,
  notes                 TEXT,
  created_at            TIMESTAMPTZ    NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_payment_mode') THEN
    ALTER TABLE public.fee_payments
      ADD CONSTRAINT check_payment_mode
      CHECK (payment_mode IN ('cash','upi','card','bank_transfer','cheque','online','dd'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_fee_payments_student    ON public.fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_date       ON public.fee_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_fee_payments_record     ON public.fee_payments(fee_record_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_school     ON public.fee_payments(school_id);

-- ── Trigger: Auto-update fee_records.amount_paid and status ──
-- FIX applied: uses explicit alias fr2 to avoid ambiguous column reference

CREATE OR REPLACE FUNCTION public.fn_update_fee_record_on_payment()
RETURNS TRIGGER AS $$
DECLARE
  v_total_paid   NUMERIC(12,2);
  v_fee_amount   NUMERIC(12,2);
  v_due_date     DATE;
  v_new_status   TEXT;
BEGIN
  -- Aggregate all payments for this fee_record
  SELECT COALESCE(SUM(amount), 0)
  INTO   v_total_paid
  FROM   public.fee_payments
  WHERE  fee_record_id = NEW.fee_record_id;

  -- Fetch fee_amount and due_date from fee_records (explicit table reference)
  SELECT fee_amount, due_date
  INTO   v_fee_amount, v_due_date
  FROM   public.fee_records
  WHERE  id = NEW.fee_record_id;

  -- Determine new status
  v_new_status := CASE
    WHEN v_total_paid >= v_fee_amount THEN 'paid'
    WHEN v_total_paid > 0             THEN 'partial'
    WHEN v_due_date < CURRENT_DATE    THEN 'overdue'
    ELSE                                   'pending'
  END;

  -- Update the parent fee_record
  UPDATE public.fee_records
  SET
    amount_paid = v_total_paid,
    status      = v_new_status,
    updated_at  = now()
  WHERE id = NEW.fee_record_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate to ensure clean state
DROP TRIGGER IF EXISTS trg_fee_record_status ON public.fee_payments;

CREATE TRIGGER trg_fee_record_status
  AFTER INSERT ON public.fee_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_update_fee_record_on_payment();

ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
