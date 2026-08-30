-- Track the entire chain of a login session
ALTER TABLE sessions ADD COLUMN family_id uuid;
ALTER TABLE sessions ADD COLUMN replaced_by uuid REFERENCES sessions(id);

-- Ensure fast lookups for family revocation
CREATE INDEX idx_sessions_family ON sessions(family_id);

-- Populate family_id for existing sessions so they don't break
UPDATE sessions SET family_id = gen_random_uuid() WHERE family_id IS NULL;
ALTER TABLE sessions ALTER COLUMN family_id SET NOT NULL;
