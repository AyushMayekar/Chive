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
      className="group panel panel-hover reveal flex flex-col rounded-3xl p-6 will-change-transform"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${LLM_BADGE_COLOR[conversation.llm]}`}
        >
          {conversation.llm}
        </span>
        <span className="led-text-dim text-xs font-semibold tracking-wide">{conversation.conversation_id}</span>
      </div>

      <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-paper">
        {conversation.title}
      </h3>
      <p className="mt-3 flex-1 text-[15px] leading-7 text-paper/80">{conversation.summary}</p>

      <div className="mt-6 flex items-center justify-between border-t border-surface-line pt-5 text-sm text-paper/70">
        <span>{conversation.category}</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-paper/85">
          {conversation.publisher_name ?? "Anonymous"}
          <ArrowUpRight size={15} className="text-mint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
