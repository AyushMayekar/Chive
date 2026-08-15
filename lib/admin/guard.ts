import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Confirms the current request has an authenticated Supabase Auth session
 * AND a profiles.role = 'admin' row. Redirects to /admin/login otherwise.
 *
 * This is a convenience/defense-in-depth check — RLS (§6.1, is_admin())
 * is the actual security boundary. This exists so pages/actions fail fast
 * with a clean redirect instead of relying solely on RLS rejecting a query.
 */
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?error=unauthorized");
  }

  return { supabase, userId: user.id };
}
