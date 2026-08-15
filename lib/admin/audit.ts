import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export type AuditAction =
  | "conversation.approve"
  | "conversation.reject"
  | "conversation.revert"
  | "conversation.edit"
  | "conversation.delete"
  | "conversation.feature"
  | "conversation.unfeature"
  | "taxonomy.create"
  | "taxonomy.update"
  | "taxonomy.disable"
  | "content.update"
  | "settings.update";

/**
 * Writes an immutable audit row via the service-role client, so the acting
 * admin's own (RLS-restricted) session is never in the write path (§6.6).
 * Called from within Server Actions only, after a mutation succeeds.
 */
export async function writeAuditLog(params: {
  actorId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}) {
  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("audit_logs").insert({
    actor_id: params.actorId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    before: params.before ?? null,
    after: params.after ?? null,
  });
  if (error) {
    // Audit failures should be visible in server logs without blocking the
    // primary mutation the admin was performing.
    console.error("audit log write failed:", error.message);
  }
}
