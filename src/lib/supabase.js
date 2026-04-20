import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project values
// Get them from: https://supabase.com → Your Project → Settings → API
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://fpkqvnmzshyuhaxdxwss.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwa3F2bm16c2h5dWhheGR4d3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MzEwMDEsImV4cCI6MjA5MjIwNzAwMX0.NqCJrXP7JWCXjdI9h0hhqcznQB7Z-0qwEVdZ4KkxzdA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Database helpers ────────────────────────────────────────────────

export async function saveFlightRecord(record) {
  const { data, error } = await supabase
    .from('flight_records')
    .upsert([record], { onConflict: 'flight_no,date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function loadFlightRecord(flightNo, date) {
  const { data, error } = await supabase
    .from('flight_records')
    .select('*')
    .eq('flight_no', flightNo)
    .eq('date', date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function loadRecentRecords(limit = 20) {
  const { data, error } = await supabase
    .from('flight_records')
    .select('id, flight_no, airline, date, created_at, submitted_by')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
