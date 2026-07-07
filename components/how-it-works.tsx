import { Share2, UploadCloud, ShieldCheck, Compass } from "lucide-react";

const STEPS = [
  {
    icon: Share2,
    title: "Share",
    body: "Generate a public share link from ChatGPT, Claude, Gemini, DeepSeek or Perplexity.",
  },
  {
    icon: UploadCloud,
    title: "Submit",
    body: "Publish your conversation to Chive along with a title, category and summary.",
  },
  {
    icon: ShieldCheck,
    title: "Review",
    body: "Every submission is manually reviewed before it goes live — usually within 10 days.",
  },
  {
    icon: Compass,
    title: "Discover",
    body: "Readers browse Chive and open the original shared conversation in one click.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="reveal max-w-xl">
          <span className="text-xs uppercase tracking-[0.18em] text-gold">How it works</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-paper md:text-4xl">
            Four steps. No account.
          </h2>
        </div>

        <div className="relative mt-12 grid gap-6 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-surface-line md:block" />
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="reveal relative">
                <div className="panel flex h-16 w-16 items-center justify-center">
                  <Icon size={22} className="text-mint" />
                  <span className="led-text absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold text-paper">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
