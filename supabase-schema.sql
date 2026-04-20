-- Run this SQL in your Supabase project:
-- Dashboard → SQL Editor → New Query → Paste → Run

CREATE TABLE IF NOT EXISTS flight_records (
  id              BIGSERIAL PRIMARY KEY,
  flight_no       TEXT NOT NULL,
  airline         TEXT,
  date            TEXT NOT NULL,
  shift           TEXT,
  check_in_data   JSONB DEFAULT '{}',
  gate_data       JSONB DEFAULT '{}',
  staff_data      JSONB DEFAULT '{}',
  evaluations     JSONB DEFAULT '{}',
  comments        JSONB DEFAULT '{}',
  submitted_by    TEXT,
  submitted_role  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (flight_no, date)
);

-- Allow all staff to read and write (adjust for production)
ALTER TABLE flight_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated reads"
  ON flight_records FOR SELECT USING (true);

CREATE POLICY "Allow all authenticated inserts"
  ON flight_records FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all authenticated updates"
  ON flight_records FOR UPDATE USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON flight_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
