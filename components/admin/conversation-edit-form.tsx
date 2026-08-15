"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateConversation } from "@/lib/admin/conversations.actions";
import { validateTitle, validateSummary } from "@/lib/validation";

export function ConversationEditForm({
  id,
  initial,
  categories,
  llms,
}: {
  id: string;
  initial: { title: string; summary: string; category: string; llm: string };
  categories: string[];
  llms: string[];
}) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<{ title?: string; summary?: string }>({});
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const titleErr = validateTitle(form.title);
    const summaryErr = validateSummary(form.summary);
    if (titleErr || summaryErr) {
      setErrors({ title: titleErr ?? undefined, summary: summaryErr ?? undefined });
      return;
    }
    setErrors({});
    startTransition(async () => {
      await updateConversation(id, form);
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-4 p-4">
      <div>
        <label className="admin-label" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="admin-input"
        />
        {errors.title && <p className="mt-1 text-xs text-[#e5695c]">{errors.title}</p>}
      </div>

      <div>
        <label className="admin-label" htmlFor="summary">
          Summary
        </label>
        <textarea
          id="summary"
          rows={4}
          value={form.summary}
          onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          className="admin-textarea"
        />
        {errors.summary && <p className="mt-1 text-xs text-[#e5695c]">{errors.summary}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="admin-select"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label" htmlFor="llm">
            LLM
          </label>
          <select
            id="llm"
            value={form.llm}
            onChange={(e) => setForm((f) => ({ ...f, llm: e.target.value }))}
            className="admin-select"
          >
            {llms.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && !pending && <span className="text-xs text-mint">Saved.</span>}
      </div>
    </form>
  );
}
