export type Llm = "ChatGPT" | "Claude" | "Gemini" | "Perplexity" | "DeepSeek";

export type Category =
  | "Programming"
  | "Research"
  | "Education"
  | "Business"
  | "AI & ML"
  | "Career"
  | "Productivity"
  | "Writing"
  | "Other";

export type ConversationStatus = "Pending" | "Approved" | "Rejected";

export interface Conversation {
  id: string;
  conversation_id: string;
  title: string;
  summary: string;
  publisher_name: string | null;
  publisher_email: string | null;
  share_url: string;
  llm: Llm;
  category: Category;
  submission_date: string; // ISO date
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
}

export const LLM_OPTIONS: Llm[] = ["ChatGPT", "Claude", "Gemini", "Perplexity", "DeepSeek"];

export const CATEGORY_OPTIONS: Category[] = [
  "Programming",
  "Research",
  "Education",
  "Business",
  "AI & ML",
  "Career",
  "Productivity",
  "Writing",
  "Other",
];
