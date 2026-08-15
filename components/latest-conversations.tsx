import type { Conversation } from "@/lib/types";
import { ConversationCard } from "./conversation-card";

export function LatestConversations({ conversations }: { conversations: Conversation[] }) {
  const latest = [...conversations]
    .sort((a, b) => new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime())
    .slice(0, 3);

  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Fresh off the wire
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-paper md:text-4xl">
              Latest conversations
            </h2>
          </div>
          <a
  href="#browse"
  className="text-sm font-medium text-mint transition-colors hover:text-gold hover:underline"
>
            Browse all conversations →
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((c) => (
            <ConversationCard key={c.id} conversation={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
