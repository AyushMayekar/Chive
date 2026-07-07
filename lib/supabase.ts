import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Single Supabase client for the browser + server components.
 * V1 has no auth, so the anon key with row-level-security policies
 * (public read on status = 'approved', public insert with status
 * forced to 'pending') is the intended setup.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function hasSupabase() {
  return supabase !== null;
}
