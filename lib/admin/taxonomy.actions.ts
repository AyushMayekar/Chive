"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { writeAuditLog } from "@/lib/admin/audit";

type Table = "categories" | "llms";

function slugify(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function addTaxonomyItem(table: Table, label: string) {
  const { supabase, userId } = await requireAdmin();
  const slug = slugify(label);
  if (!label.trim() || !slug) throw new Error("A label is required.");

  const { data: maxRow } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSort = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from(table)
    .insert({ label: label.trim(), slug, sort_order: nextSort })
    .select()
    .single();
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: "taxonomy.create",
    entityType: table,
    entityId: data.id,
    after: data,
  });
  revalidatePath("/admin/taxonomy");
  revalidatePath("/");
}

export async function updateTaxonomyItem(
  table: Table,
  id: string,
  patch: { label?: string; active?: boolean; sort_order?: number }
) {
  const { supabase, userId } = await requireAdmin();
  const { data: before } = await supabase.from(table).select("*").eq("id", id).single();

  const updates: Record<string, unknown> = { ...patch };
  if (patch.label) updates.slug = slugify(patch.label);

  const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single();
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: patch.active === false ? "taxonomy.disable" : "taxonomy.update",
    entityType: table,
    entityId: id,
    before,
    after: data,
  });
  revalidatePath("/admin/taxonomy");
  revalidatePath("/");
}
