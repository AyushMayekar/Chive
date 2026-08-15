"use client";

import { useMemo, useState } from "react";
import type { Conversation } from "@/lib/types";
import { ConversationCard } from "./conversation-card";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BrowseConversations({
  conversations,
  categories,
  llms,
}: {
  conversations: Conversation[];
  categories: string[];
  llms: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [llm, setLlm] = useState<string>("All");

  const results = useMemo(() => {
    return conversations
      .filter((c) => {
        const matchesQuery =
          !query.trim() ||
          c.title.toLowerCase().includes(query.trim().toLowerCase()) ||
          c.conversation_id.toLowerCase().includes(query.trim().toLowerCase());
        const matchesCategory = category === "All" || c.category === category;
        const matchesLlm = llm === "All" || c.llm === llm;
        return matchesQuery && matchesCategory && matchesLlm;
      })
      .sort((a, b) => new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime());
  }, [conversations, query, category, llm]);

  return (
    <section id="browse" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-gold">The stacks</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-paper md:text-4xl">
            Browse conversations
          </h2>
        </div>

        <div className="reveal panel mt-8 flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center">
          <div className="well flex flex-1 items-center gap-3 rounded-2xl border border-mint/10 px-5 py-3.5">
            <Search
              size={18}
              className="text-mint/90"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or Conversation ID…"
              className="led-text w-full bg-transparent text-base outline-none placeholder:text-mint/55"
            />
          </div>

          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="key-button h-12 w-[210px] rounded-2xl">
              <SelectValue>
                {(value) => value === "All" ? "All categories" : value}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All categories</SelectItem>

              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={llm} onValueChange={(value) => setLlm(value)}>
            <SelectTrigger className="key-button h-12 w-[210px] rounded-2xl">
              <SelectValue>
                {(value) => (value === "All" ? "All models" : value)}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All models</SelectItem>

              {llms.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {results.length === 0 ? (
          <div className="reveal panel mt-6 rounded-3xl p-10 text-center text-sm text-paper/75">
            No conversations match those filters yet. Try clearing one of them.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {results.map((c) => (
              <ConversationCard key={c.id} conversation={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
