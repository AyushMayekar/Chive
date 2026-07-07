import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Conversation } from "@/lib/types";

const LLM_BADGE_COLOR: Record<Conversation["llm"], string> = {
  ChatGPT: "text-mint border-mint/30 bg-mint/10",
  Claude: "text-gold border-gold/30 bg-gold/10",
  Gemini: "text-paper border-paper/25 bg-paper/10",
  Perplexity: "text-mint border-mint/30 bg-mint/10",
  DeepSeek: "text-gold border-gold/30 bg-gold/10",
};

export function ConversationCard({ conversation }: { conversation: Conversation }) {
  return (
    <Link
      href={`/chat/${conversation.conversation_id}`}
      className="panel panel-hover reveal flex flex-col p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${LLM_BADGE_COLOR[conversation.llm]}`}
        >
          {conversation.llm}
        </span>
        <span className="led-text-dim text-[11px]">{conversation.conversation_id}</span>
      </div>

      <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-semibold leading-snug text-paper">
        {conversation.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-paper/55">{conversation.summary}</p>

      <div className="mt-5 flex items-center justify-between border-t border-surface-line pt-4 text-xs text-paper/45">
        <span>{conversation.category}</span>
        <span className="inline-flex items-center gap-1 text-paper/60">
          {conversation.publisher_name ?? "Anonymous"}
          <ArrowUpRight size={13} className="text-mint" />
        </span>
      </div>
    </Link>
  );
}
