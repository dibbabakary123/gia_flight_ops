import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fpkqvnmzshyuhaxdxwss.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwa3F2bm16c2h5dWhheGR4d3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MzEwMDEsImV4cCI6MjA5MjIwNzAwMX0.NqCJrXP7JWCXjdI9h0hhqcznQB7Z-0qwEVdZ4KkxzdA';

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default db;

export async function createFlight(flight) {
  const { data, error } = await db.from('flights').insert([flight]).select().single();
  if (error) throw error;
  return data;
}

export async function getFlightsByShift(shift) {
  const { data, error } = await db.from('flights').select('*').eq('shift', shift).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAllFlights() {
  const { data, error } = await db.from('flights').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateFlight(id, updates) {
  const { data, error } = await db.from('flights').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
