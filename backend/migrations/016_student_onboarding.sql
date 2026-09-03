-- ==========================================================
-- Migration 016: Student Onboarding (Middle Name & UID)
-- ==========================================================

-- 1. Add middle_name and uid columns
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS middle_name TEXT,
  ADD COLUMN IF NOT EXISTS uid TEXT UNIQUE;

-- 2. Create sequence for student UID
CREATE SEQUENCE IF NOT EXISTS student_uid_seq START 10000;

-- 3. Backfill UIDs for existing students
DO $$
DECLARE
  student_record RECORD;
  class_val INTEGER;
  pass_year INTEGER;
  school_slug TEXT;
  school_prefix TEXT;
  seq_val INTEGER;
  new_uid TEXT;
BEGIN
  FOR student_record IN 
    SELECT u.id, u.class_name, s.slug 
    FROM public.users u
    JOIN public.schools s ON u.school_id = s.id
    WHERE u.role = 'student' AND u.uid IS NULL
  LOOP
    -- Extract numeric class (default to 10 if missing or invalid)
    BEGIN
      class_val := CAST(REGEXP_REPLACE(student_record.class_name, '[^0-9]', '', 'g') AS INTEGER);
      IF class_val IS NULL OR class_val < 1 OR class_val > 12 THEN
        class_val := 10;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      class_val := 10;
    END;

    -- Calculate 10th grade pass year (e.g. Class 5 in 2026 => 2026 + (10 - 5) = 2031)
    pass_year := EXTRACT(YEAR FROM CURRENT_DATE) + (10 - class_val);
    
    -- Extract prefix from school slug (e.g. 'demo-school' => 'DEMO')
    school_slug := UPPER(COALESCE(student_record.slug, 'DEMO'));
    school_prefix := SPLIT_PART(school_slug, '-', 1);
    IF LENGTH(school_prefix) > 4 THEN
      school_prefix := SUBSTRING(school_prefix FROM 1 FOR 4);
    END IF;

    -- Get next sequence value
    seq_val := NEXTVAL('student_uid_seq');

    -- Construct UID: {ShortYear}{Prefix}{Seq} -> 31DEMO10000
    new_uid := (pass_year % 100)::TEXT || school_prefix || seq_val::TEXT;

    -- Update the student record
    UPDATE public.users 
    SET uid = new_uid 
    WHERE id = student_record.id;
  END LOOP;
END $$;
