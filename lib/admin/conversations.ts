import { requireAdmin } from "@/lib/admin/guard";
import type { AdminConversation, ConversationStatusFilter } from "@/lib/admin/types";

/**
 * Read-only data-access for Server Components (Dashboard, Conversations
 * list/detail pages). Deliberately contains no "use server" — mutations
 * live in conversations.actions.ts so this file is never pulled into a
 * Client Component's bundle.
 */

export async function listConversations(opts: {
  status?: ConversationStatusFilter;
  query?: string;
}): Promise<AdminConversation[]> {
  const { supabase } = await requireAdmin();
  let q = supabase.from("conversations").select("*").order("created_at", { ascending: false });

  if (opts.status && opts.status !== "All") {
    q = q.eq("status", opts.status);
  }
  if (opts.query) {
    const term = opts.query.trim();
    q = q.or(
      `title.ilike.%${term}%,conversation_id.ilike.%${term}%,publisher_name.ilike.%${term}%,publisher_email.ilike.%${term}%`
    );
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminConversation[];
}

export async function getConversationCounts() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("conversations").select("status");
  if (error) throw new Error(error.message);
  const counts = { Pending: 0, Approved: 0, Rejected: 0 };
  for (const row of data ?? []) {
    if (row.status in counts) counts[row.status as keyof typeof counts] += 1;
  }
  return counts;
}

export async function getRecentConversations(limit = 5): Promise<AdminConversation[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as AdminConversation[];
}

export async function getAdminConversation(id: string): Promise<AdminConversation | null> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("conversations").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as AdminConversation | null;
}
