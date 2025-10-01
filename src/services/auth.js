import { getSupabase } from '../lib/supabaseClient.js';

export async function signUpWithEmail({ email, password, displayName, role = 'student' }) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { data: null, error };
  const user = data.user;
  // Create/Upsert profile row
  await supabase.from('users').upsert({ id: user.id, email, display_name: displayName, role });
  return { data: user, error: null };
}

export async function signInWithEmail({ email, password }) {
  const supabase = getSupabase();
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error };
  return { data: data.user, error: null };
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

export function onAuthStateChange(callback) {
  const supabase = getSupabase();
  if (!supabase) return { subscription: null };
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return { subscription };
}

export async function getCurrentUser() {
  const supabase = getSupabase();
  if (!supabase) return { data: null };
  const { data: { user } } = await supabase.auth.getUser();
  return { data: user };
}


