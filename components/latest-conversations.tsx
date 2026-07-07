import { MOCK_CONVERSATIONS } from "@/lib/mock-data";
import { ConversationCard } from "./conversation-card";

export function LatestConversations() {
  const latest = [...MOCK_CONVERSATIONS]
    .sort((a, b) => new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime())
    .slice(0, 3);

  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.18em] text-gold">Fresh off the wire</span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Latest conversations
            </h2>
          </div>
          <a href="#browse" className="text-sm text-mint hover:underline">
            Browse all conversations →
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {latest.map((c) => (
            <ConversationCard key={c.id} conversation={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
