import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Service-role client. Bypasses RLS entirely — this is intentional and
 * narrow: it exists solely so audit_logs writes cannot be tampered with or
 * blocked by the acting admin's own session (§2.6/§6.6).
 *
 * Hard rule: this file must never be imported by a "use client" component.
 * It is only ever called from lib/admin/audit.ts, itself only called from
 * Server Actions.
 */
export function createAdminSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminSupabaseClient() must never run in the browser.");
  }
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service role is not configured (missing SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
