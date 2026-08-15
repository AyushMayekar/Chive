import Link from "next/link";
import { getConversationCounts, getRecentConversations } from "@/lib/admin/conversations";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminDashboardPage() {
  const [counts, recent] = await Promise.all([getConversationCounts(), getRecentConversations(5)]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/conversations?status=Pending" className="admin-card p-4 hover:border-gold/50">
          <p className="text-xs text-paper/55">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-gold">{counts.Pending}</p>
        </Link>
        <div className="admin-card p-4">
          <p className="text-xs text-paper/55">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-mint">{counts.Approved}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs text-paper/55">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-paper/70">{counts.Rejected}</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="border-b border-surface-line px-4 py-3">
          <h2 className="text-sm font-semibold text-paper">Recent submissions</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-6 text-sm text-paper/50">No conversations submitted yet.</p>
        ) : (
          <div className="admin-table-scroll border-0">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>LLM</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/admin/conversations/${c.id}`} className="text-paper hover:text-mint">
                        {c.title}
                      </Link>
                    </td>
                    <td className="text-paper/70">{c.llm}</td>
                    <td className="text-paper/70">{c.submission_date}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
