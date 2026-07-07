import { Conversation } from "./types";

/**
 * Stand-in for `select * from conversations where status = 'approved'`.
 * Replace with a real Supabase query in lib/supabase.ts once the project
 * has credentials — see NEXT_PUBLIC_SUPABASE_URL / ANON_KEY in .env.example.
 */
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    conversation_id: "CHV-8F72K9A",
    title: "Designing a rate limiter from scratch",
    summary:
      "A walkthrough of token bucket vs. sliding window rate limiting, with tradeoffs for distributed systems and Redis implementation notes.",
    publisher_name: "Rakesh N.",
    publisher_email: null,
    share_url: "https://chatgpt.com/share/example-1",
    llm: "ChatGPT",
    category: "Programming",
    submission_date: "2026-07-01",
    status: "Approved",
    created_at: "2026-07-01T10:00:00Z",
    updated_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "2",
    conversation_id: "CHV-3K21P0Q",
    title: "Structuring a solo founder's first cap table",
    summary:
      "Covers SAFE notes, ESOP pool sizing, and common mistakes first-time founders make before a seed round.",
    publisher_name: "Anonymous",
    publisher_email: null,
    share_url: "https://claude.ai/share/example-2",
    llm: "Claude",
    category: "Business",
    submission_date: "2026-06-29",
    status: "Approved",
    created_at: "2026-06-29T10:00:00Z",
    updated_at: "2026-06-29T10:00:00Z",
  },
  {
    id: "3",
    conversation_id: "CHV-9Q4M2XZ",
    title: "Explaining transformer attention with matrices, slowly",
    summary:
      "Builds intuition for query/key/value matrices one step at a time, aimed at someone who knows linear algebra but not ML.",
    publisher_name: "Divya S.",
    publisher_email: null,
    share_url: "https://gemini.google.com/share/example-3",
    llm: "Gemini",
    category: "AI & ML",
    submission_date: "2026-06-27",
    status: "Approved",
    created_at: "2026-06-27T10:00:00Z",
    updated_at: "2026-06-27T10:00:00Z",
  },
  {
    id: "4",
    conversation_id: "CHV-1J8H5RT",
    title: "Mock interview: system design for a URL shortener",
    summary:
      "A full mock interview transcript covering capacity estimation, schema design, and follow-up questions on hot-key handling.",
    publisher_name: "Anonymous",
    publisher_email: null,
    share_url: "https://chatgpt.com/share/example-4",
    llm: "ChatGPT",
    category: "Career",
    submission_date: "2026-06-24",
    status: "Approved",
    created_at: "2026-06-24T10:00:00Z",
    updated_at: "2026-06-24T10:00:00Z",
  },
  {
    id: "5",
    conversation_id: "CHV-6D0N7VL",
    title: "Turning a messy research question into a lit-review plan",
    summary:
      "Shows how to go from a vague thesis idea to a structured search strategy across databases and citation chaining.",
    publisher_name: "Fatima A.",
    publisher_email: null,
    share_url: "https://perplexity.ai/search/example-5",
    llm: "Perplexity",
    category: "Research",
    submission_date: "2026-06-20",
    status: "Approved",
    created_at: "2026-06-20T10:00:00Z",
    updated_at: "2026-06-20T10:00:00Z",
  },
  {
    id: "6",
    conversation_id: "CHV-4B9W3KC",
    title: "A weekly review template that actually gets used",
    summary:
      "Iterates on a Sunday-night review template, cutting it down from 12 questions to 4 that consistently get answered.",
    publisher_name: "Anonymous",
    publisher_email: null,
    share_url: "https://chat.deepseek.com/share/example-6",
    llm: "DeepSeek",
    category: "Productivity",
    submission_date: "2026-06-18",
    status: "Approved",
    created_at: "2026-06-18T10:00:00Z",
    updated_at: "2026-06-18T10:00:00Z",
  },
];

export function getConversationByConversationId(conversationId: string) {
  return MOCK_CONVERSATIONS.find(
    (c) => c.conversation_id.toLowerCase() === conversationId.toLowerCase()
  );
}
