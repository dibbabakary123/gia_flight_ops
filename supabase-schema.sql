-- Run this in Supabase → SQL Editor → New Query → Run
-- This REPLACES the old flight_records table with the new flights table

CREATE TABLE IF NOT EXISTS flights (
  id              BIGSERIAL PRIMARY KEY,
  flight_no       TEXT NOT NULL,
  airline         TEXT,
  date            TEXT,
  std             TEXT,
  shift           TEXT,
  duty_manager    TEXT,
  dcs_supervisor  TEXT,
  check_in_staff  TEXT,
  gate_agent      TEXT,
  ramp_supervisor TEXT,
  telex_operator  TEXT,
  lost_found      TEXT,
  office_manning  TEXT,
  check_in_data   JSONB DEFAULT '{}',
  gate_data       JSONB DEFAULT '{}',
  comments_ci     TEXT DEFAULT '',
  comments_gate   TEXT DEFAULT '',
  remarks         TEXT DEFAULT '',
  status          TEXT DEFAULT 'active',
  created_by      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all reads" ON flights FOR SELECT USING (true);
CREATE POLICY "Allow all inserts" ON flights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all updates" ON flights FOR UPDATE USING (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON flights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
