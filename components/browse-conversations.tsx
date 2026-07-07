"use client";

import { useMemo, useState } from "react";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";
import { CATEGORY_OPTIONS, LLM_OPTIONS, Category, Llm } from "@/lib/types";
import { ConversationCard } from "./conversation-card";
import { Search } from "lucide-react";

export function BrowseConversations() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [llm, setLlm] = useState<Llm | "All">("All");

  const results = useMemo(() => {
    return MOCK_CONVERSATIONS.filter((c) => {
      const matchesQuery =
        !query.trim() ||
        c.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        c.conversation_id.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      const matchesLlm = llm === "All" || c.llm === llm;
      return matchesQuery && matchesCategory && matchesLlm;
    }).sort((a, b) => new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime());
  }, [query, category, llm]);

  return (
    <section id="browse" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <span className="text-xs uppercase tracking-[0.18em] text-gold">The stacks</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-paper md:text-4xl">
            Browse conversations
          </h2>
        </div>

        <div className="reveal panel mt-8 flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="well flex flex-1 items-center gap-2.5 px-4 py-3">
            <Search size={16} className="text-mint/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or Conversation ID…"
              className="led-text w-full bg-transparent text-sm outline-none placeholder:text-mint/25"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "All")}
            className="key-button bg-ink px-4 py-3 text-sm text-paper/80"
          >
            <option value="All">All categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={llm}
            onChange={(e) => setLlm(e.target.value as Llm | "All")}
            className="key-button bg-ink px-4 py-3 text-sm text-paper/80"
          >
            <option value="All">All models</option>
            {LLM_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {results.length === 0 ? (
          <div className="reveal panel mt-6 p-10 text-center text-sm text-paper/50">
            No conversations match those filters yet. Try clearing one of them.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {results.map((c) => (
              <ConversationCard key={c.id} conversation={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
