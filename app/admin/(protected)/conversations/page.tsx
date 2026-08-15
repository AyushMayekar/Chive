import Link from "next/link";
import { listConversations } from "@/lib/admin/conversations";
import { StatusBadge } from "@/components/admin/status-badge";
import type { ConversationStatusFilter } from "@/lib/admin/types";

const TABS: ConversationStatusFilter[] = ["Pending", "All", "Approved", "Rejected"];

export default async function AdminConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status as ConversationStatusFilter) || "Pending";
  const query = params.q ?? "";

  const conversations = await listConversations({ status, query });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab}
            href={`/admin/conversations?status=${tab}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
            className={`admin-btn h-8 px-3 text-xs ${status === tab ? "border-mint text-mint" : ""}`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <form method="get" className="flex gap-2">
        <input type="hidden" name="status" value={status} />
        <input
          name="q"
          defaultValue={query}
          placeholder="Search title, Conversation ID, publisher name or email…"
          className="admin-input max-w-md"
        />
        <button type="submit" className="admin-btn h-9 px-4 text-xs">
          Search
        </button>
      </form>

      {conversations.length === 0 ? (
        <div className="admin-card p-8 text-center text-sm text-paper/55">
          {status === "Pending" ? "Nothing pending — you're caught up." : "No conversations match this view."}
        </div>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Conversation ID</th>
                <th>LLM</th>
                <th>Category</th>
                <th>Publisher</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Featured</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/conversations/${c.id}`} className="text-paper hover:text-mint">
                      {c.title}
                    </Link>
                  </td>
                  <td className="font-mono text-xs text-paper/60">{c.conversation_id}</td>
                  <td className="text-paper/70">{c.llm}</td>
                  <td className="text-paper/70">{c.category}</td>
                  <td className="text-paper/70">{c.publisher_name ?? "Anonymous"}</td>
                  <td className="text-paper/70">{c.submission_date}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="text-paper/60">{c.status === "Approved" ? (c.featured ? "Yes" : "No") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
