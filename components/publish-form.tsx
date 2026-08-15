"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import {
  validateShareUrl,
  validateTitle,
  validateSummary,
  validateEmail,
  validateRequired,
} from "@/lib/validation";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormState = {
  shareUrl: string;
  title: string;
  submissionDate: string;
  llm: string;
  category: string;
  summary: string;
  publisherName: string;
  publisherEmail: string;
};

const DEFAULT_SLA_TEXT = "Review generally takes around 10 days.";

function initialState(): FormState {
  return {
    shareUrl: "",
    title: "",
    submissionDate: new Date().toISOString().slice(0, 10),
    llm: "",
    category: "",
    summary: "",
    publisherName: "",
    publisherEmail: "",
  };
}

export function PublishForm({
  categories,
  llms,
  slaText = DEFAULT_SLA_TEXT,
}: {
  categories: string[];
  llms: string[];
  slaText?: string;
}) {
  const [form, setForm] = useState<FormState>(initialState());
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    const shareUrlErr = validateShareUrl(form.shareUrl);
    if (shareUrlErr) next.shareUrl = shareUrlErr;
    const titleErr = validateTitle(form.title);
    if (titleErr) next.title = titleErr;
    const summaryErr = validateSummary(form.summary);
    if (summaryErr) next.summary = summaryErr;
    const emailErr = validateEmail(form.publisherEmail);
    if (emailErr) next.publisherEmail = emailErr;
    const dateErr = validateRequired(form.submissionDate, "Submission date");
    if (dateErr) next.submissionDate = dateErr;
    const llmErr = validateRequired(form.llm, "LLM");
    if (llmErr) next.llm = llmErr;
    const categoryErr = validateRequired(form.category, "Category");
    if (categoryErr) next.category = categoryErr;

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      if (supabase) {
        // conversation_id and status are assigned by a database trigger
        // (§2.6 of the Admin PRD) — the client never supplies either.
        const { data, error } = await supabase
          .from("conversations")
          .insert({
            title: form.title.trim(),
            summary: form.summary.trim(),
            publisher_name: form.publisherName.trim() || null,
            publisher_email: form.publisherEmail.trim() || null,
            share_url: form.shareUrl.trim(),
            llm: form.llm,
            category: form.category,
            submission_date: form.submissionDate,
          })
          .select("conversation_id")
          .single();
        if (error) throw error;
        setConversationId(data.conversation_id as string);
      } else {
        // No Supabase configured yet (local/dev) — complete the flow with a
        // locally-shaped placeholder so the UI can still be reviewed.
        setConversationId("CHV-PREVIEW");
      }
      setForm(initialState());
    } catch {
      setErrors({ shareUrl: "Something went wrong submitting your conversation. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="publish" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Publish</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-paper md:text-4xl">
            Submit a conversation
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-paper/80">
            Share a valuable AI conversation with the Chive community. Only public share links are
            accepted.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="reveal panel mt-8 grid gap-6 rounded-3xl p-7 md:p-9"
        >
          <Field label="Share URL" required error={errors.shareUrl}>
            <input
              value={form.shareUrl}
              onChange={(e) => update("shareUrl", e.target.value)}
              placeholder="https://chatgpt.com/share/…"
              className="chive-input"
            />
          </Field>

          <Field label="Title" required error={errors.title}>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="What's this conversation about?"
              className="chive-input"
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Submission date" required error={errors.submissionDate}>
              <input
                type="date"
                value={form.submissionDate}
                onChange={(e) => update("submissionDate", e.target.value)}
                className="chive-input"
              />
            </Field>

            <Field label="LLM" required error={errors.llm}>
              <Select value={form.llm} onValueChange={(value) => update("llm", value)}>
                <SelectTrigger className="chive-input flex h-12 items-center justify-between rounded-2xl">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>

                <SelectContent>
                  {llms.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Category" required error={errors.category}>
            <Select value={form.category} onValueChange={(value) => update("category", value)}>
              <SelectTrigger className="chive-input flex h-12 items-center justify-between rounded-2xl">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Summary" required error={errors.summary} hint={`${form.summary.length}/600`}>
            <textarea
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              rows={4}
              placeholder="What makes this conversation worth reading?"
              className="chive-input resize-none"
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Publisher name" hint="Optional">
              <input
                value={form.publisherName}
                onChange={(e) => update("publisherName", e.target.value)}
                placeholder="Anonymous"
                className="chive-input"
              />
            </Field>

            <Field label="Publisher email" hint="Optional — never shown publicly" error={errors.publisherEmail}>
              <input
                type="email"
                value={form.publisherEmail}
                onChange={(e) => update("publisherEmail", e.target.value)}
                placeholder="you@example.com"
                className="chive-input"
              />
            </Field>
          </div>

          <p className="rounded-2xl border border-surface-line bg-surface/40 px-4 py-3 text-sm leading-6 text-paper/75">
            By submitting, you confirm the share link is public, the content is safe, and you own
            or have permission to share it. {slaText}
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="key-button key-button-accent flex items-center justify-center gap-2 py-3.5 text-sm font-semibold shadow-md transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Submitting…" : "Submit conversation"}
          </button>
        </form>
      </div>

      {conversationId && (
        <SuccessModal conversationId={conversationId} slaText={slaText} onClose={() => setConversationId(null)} />
      )}
    </section>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm font-medium text-paper/90">
        <span>
          {label} {required && <span className="text-gold">*</span>}
        </span>
        {hint && <span className="text-xs text-paper/55">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function SuccessModal({
  conversationId,
  slaText,
  onClose,
}: {
  conversationId: string;
  slaText: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5">
      <div className="panel relative w-full max-w-md rounded-3xl p-8 text-center shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="key-button absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-paper/70"
        >
          <X size={15} />
        </button>

        <CheckCircle2 className="mx-auto text-mint" size={40} />
        <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-paper">
          Conversation submitted successfully
        </h3>
        <p className="mt-3 text-[15px] leading-6 text-paper/80">
          Your conversation has been received and is now awaiting review.
        </p>

        <div className="well mt-6 rounded-2xl border border-mint/15 px-4 py-5">
          <div className="led-text text-2xl">{conversationId}</div>
        </div>

        <p className="mt-5 rounded-xl bg-surface/40 px-4 py-3 text-sm leading-6 text-paper/75">
          Save this Conversation ID — use it to search your submission, track whether it&apos;s
          been published, or reference it when contacting Chive Support. {slaText}
        </p>

        <a
          href="#top"
          onClick={onClose}
          className="key-button key-button-accent mt-6 block w-full py-3 text-sm font-semibold shadow-md transition-all hover:scale-[1.01]"
        >
          Back to homepage
        </a>
      </div>
    </div>
  );
}
