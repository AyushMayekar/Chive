"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { writeAuditLog } from "@/lib/admin/audit";
import type { SiteSettingKey } from "@/lib/admin/types";

export async function updateSiteSetting(key: SiteSettingKey, value: Record<string, unknown>) {
  const { supabase, userId } = await requireAdmin();
  const { data: before } = await supabase.from("site_settings").select("value").eq("key", key).single();

  const { error } = await supabase
    .from("site_settings")
    .update({ value, updated_by: userId })
    .eq("key", key);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action:
      key === "publishing_guidelines" || key === "review_sla_text" || key === "announcement"
        ? "settings.update"
        : "content.update",
    entityType: "site_settings",
    entityId: key,
    before: before?.value,
    after: value,
  });
  revalidatePath("/admin/content");
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
