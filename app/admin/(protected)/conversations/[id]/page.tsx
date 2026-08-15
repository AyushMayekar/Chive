import { notFound } from "next/navigation";
import { getAdminConversation } from "@/lib/admin/conversations";
import { listTaxonomy } from "@/lib/admin/taxonomy";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConversationActions } from "@/components/admin/conversation-actions";
import { ConversationEditForm } from "@/components/admin/conversation-edit-form";

export default async function AdminConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [conversation, categories, llms] = await Promise.all([
    getAdminConversation(id),
    listTaxonomy("categories"),
    listTaxonomy("llms"),
  ]);

  if (!conversation) notFound();

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <div className="admin-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-paper">{conversation.title}</h1>
            <StatusBadge status={conversation.status} />
          </div>
          <p className="mt-1 font-mono text-xs text-paper/50">{conversation.conversation_id}</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-paper/45">Publisher</dt>
              <dd className="text-paper/85">{conversation.publisher_name ?? "Anonymous"}</dd>
            </div>
            <div>
              <dt className="text-paper/45">Publisher email</dt>
              <dd className="text-paper/85">{conversation.publisher_email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-paper/45">Share URL</dt>
              <dd className="truncate">
                <a href={conversation.share_url} target="_blank" rel="noopener noreferrer" className="text-mint hover:underline">
                  {conversation.share_url}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-paper/45">Submitted</dt>
              <dd className="text-paper/85">{conversation.submission_date}</dd>
            </div>
            <div>
              <dt className="text-paper/45">Created</dt>
              <dd className="text-paper/85">{new Date(conversation.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-paper/45">Updated</dt>
              <dd className="text-paper/85">{new Date(conversation.updated_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-paper/45">Reviewed by</dt>
              <dd className="text-paper/85">{conversation.reviewed_by ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-paper/45">Reviewed at</dt>
              <dd className="text-paper/85">
                {conversation.reviewed_at ? new Date(conversation.reviewed_at).toLocaleString() : "—"}
              </dd>
            </div>
            {conversation.rejection_reason && (
              <div className="col-span-2">
                <dt className="text-paper/45">Rejection reason (internal)</dt>
                <dd className="text-paper/85">{conversation.rejection_reason}</dd>
              </div>
            )}
          </dl>
        </div>

        <ConversationEditForm
          id={conversation.id}
          initial={{
            title: conversation.title,
            summary: conversation.summary,
            category: conversation.category,
            llm: conversation.llm,
          }}
          categories={categories.map((c) => c.label)}
          llms={llms.map((l) => l.label)}
        />
      </div>

      <ConversationActions id={conversation.id} status={conversation.status} featured={conversation.featured} />
    </div>
  );
}
