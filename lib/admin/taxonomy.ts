import { requireAdmin } from "@/lib/admin/guard";
import type { TaxonomyRow } from "@/lib/admin/types";

type Table = "categories" | "llms";

/**
 * Read-only. Mutations live in taxonomy.actions.ts (see conversations.ts /
 * conversations.actions.ts for why these are split).
 */
export async function listTaxonomy(table: Table): Promise<(TaxonomyRow & { usage_count: number })[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from(table).select("*").order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);

  const column = table === "categories" ? "category" : "llm";
  const rows = (data ?? []) as TaxonomyRow[];

  const withCounts = await Promise.all(
    rows.map(async (row) => {
      const { count } = await supabase
        .from("conversations")
        .select("id", { count: "exact", head: true })
        .eq(column, row.label);
      return { ...row, usage_count: count ?? 0 };
    })
  );

  return withCounts;
}
