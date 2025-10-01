// Lightweight Supabase client factory. Returns null if env is not configured.
import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export function getSupabase() {
  if (cachedClient !== null) return cachedClient;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true
    }
  });
  return cachedClient;
}


