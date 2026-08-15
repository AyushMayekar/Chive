"use client";

import { useState, useTransition } from "react";
import { updateSiteSetting } from "@/lib/admin/site-settings.actions";
import type { SiteSettingKey } from "@/lib/admin/types";

export type FieldSpec = {
  key: string;
  label: string;
  type: "text" | "textarea" | "list" | "checkbox";
};

export function SiteSettingForm({
  settingKey,
  title,
  fields,
  value,
}: {
  settingKey: SiteSettingKey;
  title: string;
  fields: FieldSpec[];
  value: Record<string, unknown>;
}) {
  const initial: Record<string, string | boolean> = {};
  for (const f of fields) {
    const raw = value[f.key];
    if (f.type === "checkbox") {
      initial[f.key] = Boolean(raw);
    } else if (f.type === "list") {
      initial[f.key] = Array.isArray(raw) ? (raw as string[]).join("\n") : "";
    } else {
      initial[f.key] = typeof raw === "string" ? raw : "";
    }
  }

  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "list") {
        payload[f.key] = String(form[f.key] ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        payload[f.key] = form[f.key];
      }
    }
    setSaved(false);
    startTransition(async () => {
      await updateSiteSetting(settingKey, payload);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-3 p-4">
      <h2 className="text-sm font-semibold text-paper">{title}</h2>
      {fields.map((f) => (
        <div key={f.key}>
          {f.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm text-paper/85">
              <input
                type="checkbox"
                checked={Boolean(form[f.key])}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.checked }))}
              />
              {f.label}
            </label>
          ) : (
            <>
              <label className="admin-label">{f.label}</label>
              {f.type === "textarea" || f.type === "list" ? (
                <textarea
                  rows={f.type === "list" ? 4 : 3}
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="admin-textarea"
                  placeholder={f.type === "list" ? "One item per line" : undefined}
                />
              ) : (
                <input
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="admin-input"
                />
              )}
            </>
          )}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
          {pending ? "Saving…" : "Save"}
        </button>
        {saved && !pending && <span className="text-xs text-mint">Saved.</span>}
      </div>
    </form>
  );
}
