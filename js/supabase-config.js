// ─── supabase-config.js ───────────────────────────────────────────────────
// Supabase initialization.
// IMPORTANT: Replace the URL and KEY below with your actual Supabase project details.

const SUPABASE_URL = 'https://srdvoexjteyqbkdavbij.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZHZvZXhqdGV5cWJrZGF2YmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDYxODUsImV4cCI6MjA5MzI4MjE4NX0.baBPl7ANhEQnXTQ9ZxZdvq_VAZUupBq97uOjNh-WkVU';

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase CDN script not loaded.");
}

window.supabaseClient = supabaseClient;
