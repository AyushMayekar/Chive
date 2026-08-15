"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { writeAuditLog } from "@/lib/admin/audit";
import { validateTitle, validateSummary } from "@/lib/validation";
import { getAdminConversation } from "@/lib/admin/conversations";

export async function approveConversation(id: string) {
  const { supabase, userId } = await requireAdmin();
  const before = await getAdminConversation(id);

  const { error } = await supabase
    .from("conversations")
    .update({ status: "Approved", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: "conversation.approve",
    entityType: "conversation",
    entityId: id,
    before,
    after: { status: "Approved" },
  });
  revalidatePath("/admin/conversations");
  revalidatePath(`/admin/conversations/${id}`);
  revalidatePath("/");
}

export async function rejectConversation(id: string, reason?: string) {
  const { supabase, userId } = await requireAdmin();
  const before = await getAdminConversation(id);

  const { error } = await supabase
    .from("conversations")
    .update({
      status: "Rejected",
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason?.trim() || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: "conversation.reject",
    entityType: "conversation",
    entityId: id,
    before,
    after: { status: "Rejected", rejection_reason: reason ?? null },
  });
  revalidatePath("/admin/conversations");
  revalidatePath(`/admin/conversations/${id}`);
  revalidatePath("/");
}

export async function revertConversationToPending(id: string) {
  const { supabase, userId } = await requireAdmin();
  const before = await getAdminConversation(id);

  const { error } = await supabase
    .from("conversations")
    .update({ status: "Pending", reviewed_by: null, reviewed_at: null, rejection_reason: null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: "conversation.revert",
    entityType: "conversation",
    entityId: id,
    before,
    after: { status: "Pending" },
  });
  revalidatePath("/admin/conversations");
  revalidatePath(`/admin/conversations/${id}`);
  revalidatePath("/");
}

export async function deleteConversation(id: string) {
  const { supabase, userId } = await requireAdmin();
  const before = await getAdminConversation(id);
  if (before && before.status !== "Rejected") {
    throw new Error("Only rejected conversations can be deleted.");
  }

  const { error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: "conversation.delete",
    entityType: "conversation",
    entityId: id,
    before,
    after: null,
  });
  revalidatePath("/admin/conversations");
}

export async function updateConversation(
  id: string,
  patch: { title: string; summary: string; category: string; llm: string }
) {
  const { supabase, userId } = await requireAdmin();

  const titleErr = validateTitle(patch.title);
  const summaryErr = validateSummary(patch.summary);
  if (titleErr || summaryErr) {
    throw new Error(titleErr || summaryErr || "Invalid input.");
  }

  const before = await getAdminConversation(id);
  const { error } = await supabase
    .from("conversations")
    .update({
      title: patch.title.trim(),
      summary: patch.summary.trim(),
      category: patch.category,
      llm: patch.llm,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: "conversation.edit",
    entityType: "conversation",
    entityId: id,
    before,
    after: patch,
  });
  revalidatePath(`/admin/conversations/${id}`);
  revalidatePath("/admin/conversations");
  revalidatePath("/");
}

export async function setConversationFeatured(id: string, featured: boolean) {
  const { supabase, userId } = await requireAdmin();
  const before = await getAdminConversation(id);

  const { error } = await supabase.from("conversations").update({ featured }).eq("id", id);
  if (error) throw new Error(error.message);

  await writeAuditLog({
    actorId: userId,
    action: featured ? "conversation.feature" : "conversation.unfeature",
    entityType: "conversation",
    entityId: id,
    before,
    after: { featured },
  });
  revalidatePath("/admin/conversations");
  revalidatePath(`/admin/conversations/${id}`);
  revalidatePath("/");
}
