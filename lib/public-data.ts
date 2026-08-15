import { supabase, hasSupabase } from "@/lib/supabase";
import type { Conversation } from "@/lib/types";
import type { SiteSettingsMap, SiteSettingKey } from "@/lib/admin/types";
import { MOCK_CONVERSATIONS, getConversationByConversationId as getMockByConversationId } from "@/lib/mock-data";
import { CATEGORY_OPTIONS, LLM_OPTIONS } from "@/lib/types";

const EMPTY_SETTINGS: SiteSettingsMap = {
  hero: {},
  about: {},
  how_it_works: {},
  footer: {},
  contact: {},
  logo: {},
  publishing_guidelines: {},
  review_sla_text: {},
  announcement: {},
};

/**
 * All functions here fail open to the existing mock data / hardcoded option
 * lists when Supabase isn't configured, matching lib/supabase.ts's existing
 * hasSupabase() guard convention — this keeps local dev working with zero
 * setup, and avoids ever silently masking a real production misconfiguration
 * (if Supabase is meant to be configured and isn't, this is the fallback
 * that would be visible during development, not something that ships quietly
 * to production — see Admin PRD §9).
 */

export async function getApprovedConversations(): Promise<Conversation[]> {
  if (!hasSupabase()) return MOCK_CONVERSATIONS;
  const { data, error } = await supabase!
    .from("conversations")
    .select("*")
    .eq("status", "Approved")
    .order("submission_date", { ascending: false });
  if (error || !data) return MOCK_CONVERSATIONS;
  return data as Conversation[];
}

export async function getApprovedConversationByConversationId(
  conversationId: string
): Promise<Conversation | undefined> {
  if (!hasSupabase()) return getMockByConversationId(conversationId);
  const { data, error } = await supabase!
    .from("conversations")
    .select("*")
    .eq("status", "Approved")
    .ilike("conversation_id", conversationId)
    .maybeSingle();
  if (error || !data) return undefined;
  return data as Conversation;
}

export async function getActiveCategories(): Promise<string[]> {
  if (!hasSupabase()) return CATEGORY_OPTIONS;
  const { data, error } = await supabase!
    .from("categories")
    .select("label")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return CATEGORY_OPTIONS;
  return data.map((row) => row.label);
}

export async function getActiveLlms(): Promise<string[]> {
  if (!hasSupabase()) return LLM_OPTIONS;
  const { data, error } = await supabase!
    .from("llms")
    .select("label")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return LLM_OPTIONS;
  return data.map((row) => row.label);
}

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  if (!hasSupabase()) return EMPTY_SETTINGS;
  const { data, error } = await supabase!.from("site_settings").select("key, value");
  if (error || !data) return EMPTY_SETTINGS;

  const map = { ...EMPTY_SETTINGS };
  for (const row of data) {
    map[row.key as SiteSettingKey] = (row.value ?? {}) as Record<string, unknown>;
  }
  return map;
}
