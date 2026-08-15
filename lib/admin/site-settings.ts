import { requireAdmin } from "@/lib/admin/guard";
import type { SiteSettingsMap } from "@/lib/admin/types";

/**
 * Read-only. Mutation lives in site-settings.actions.ts.
 */
export async function getAllSiteSettingsAdmin(): Promise<SiteSettingsMap> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) throw new Error(error.message);

  const map = {} as SiteSettingsMap;
  for (const row of data ?? []) {
    map[row.key as keyof SiteSettingsMap] = (row.value ?? {}) as Record<string, unknown>;
  }
  return map;
}
