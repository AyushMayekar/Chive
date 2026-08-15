import type { Conversation } from "@/lib/types";

export interface AdminConversation extends Conversation {
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  featured: boolean;
}

export interface TaxonomyRow {
  id: string;
  label: string;
  slug: string;
  active: boolean;
  sort_order: number;
}

export type SiteSettingKey =
  | "hero"
  | "about"
  | "how_it_works"
  | "footer"
  | "contact"
  | "logo"
  | "publishing_guidelines"
  | "review_sla_text"
  | "announcement";

export type SiteSettingsMap = Record<SiteSettingKey, Record<string, unknown>>;

export type ConversationStatusFilter = "All" | "Pending" | "Approved" | "Rejected";
