"use client";

import { useState, type FormEvent } from "react";
import { Search, Hash, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export type HeroSettings = Partial<{
  eyebrow: string;
  subheadline: string;
  features: string[];
}>;

const DEFAULTS: Required<HeroSettings> = {
  eyebrow: "A public library of AI conversations",
  subheadline:
    "Discover valuable AI conversations from developers, researchers, students, founders and curious minds — sourced from ChatGPT, Claude, Gemini, Perplexity and DeepSeek.",
  features: ["Search conversations", "Browse latest submissions", "Find by Conversation ID", "No account required"],
};

export function Hero({ settings }: { settings?: HeroSettings }) {
  const [mode, setMode] = useState<"title" | "id">("title");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const eyebrow = settings?.eyebrow || DEFAULTS.eyebrow;
  const subheadline = settings?.subheadline || DEFAULTS.subheadline;
  const features = settings?.features?.length ? settings.features : DEFAULTS.features;

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;
    if (mode === "id") {
      router.push(`/chat/${encodeURIComponent(value)}`);
    } else {
      router.push(`/#browse?q=${encodeURIComponent(value)}`);
    }
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-20 pt-32 sm:pt-36 lg:px-8 lg:pt-44"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] opacity-70"
        style={{
          background:
            "radial-gradient(600px 320px at 50% -10%, rgba(127,239,189,0.14), transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 rounded-full border border-surface-line bg-surface px-3 py-1 text-xs uppercase tracking-[0.18em] text-gold">
            <Sparkles size={13} />
            {eyebrow}
          </span>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-5xl lg:text-6xl">
            Don&apos;t lose great conversations.
            <br />
            <span className="text-mint">Chive</span> them.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">{subheadline}</p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/75">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="reveal panel mx-auto w-full max-w-xl p-6 lg:max-w-none lg:p-7">
          <div
            className="mb-5 flex items-center gap-1 rounded-full border border-surface-line bg-ink/95 p-1 text-xs shadow-inner"
          >
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMode("title")}
              className={`flex-1 rounded-full px-3 py-2 transition-colors ${mode === "title"
                ? "bg-mint text-ink font-semibold shadow-sm"
                : "text-paper/85 hover:text-paper"
                }`}
            >
              By title
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMode("id")}
              className={`flex-1 rounded-full px-3 py-2 transition-colors ${mode === "id" ? "bg-mint text-ink font-semibold shadow-sm"
                : "text-paper/85 hover:text-paper"
                }`}
            >
              By Conversation ID
            </button>
          </div>

          <form onSubmit={handleSearch}>
            <div className="well flex items-center gap-3 rounded-2xl px-5 py-4">
              {mode === "id" ? <Hash size={18} className="text-mint/90" /> : <Search size={18} className="text-mint/90" />}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "id" ? "CHV-8F72K9A" : "Search titles…"}
                className="led-text w-full bg-transparent text-lg outline-none placeholder:text-mint/55"
              />
            </div>
            <button type="submit" className="key-button key-button-accent mt-5 w-full py-3.5 text-sm font-semibold shadow-md transition-all hover:scale-[1.01]">
              {mode === "id" ? "Look up conversation" : "Search Chive"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-paper/65">
            Prefer to browse? <a href="#browse" className="font-medium text-gold hover:text-mint transition-colors hover:underline">Jump to Browse Conversations</a>
          </p>
        </div>
      </div>
    </section>
  );
}
