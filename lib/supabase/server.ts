import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Authenticated, cookie-aware Supabase client for Server Components,
 * Server Actions, and Route Handlers. Uses the anon key + the signed-in
 * user's session cookie, so every query still goes through RLS as that
 * user — this is the "authenticated client" referenced throughout the
 * Admin PRD, as distinct from the service-role client in lib/supabase/admin.ts.
 */
export async function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL/ANON_KEY).");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render (not an Action/Route
          // Handler) — cookies can't be set there. Session refresh in
          // middleware.ts covers this case; safe to ignore here.
        }
      },
    },
  });
}
