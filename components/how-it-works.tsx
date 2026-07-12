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
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-gold">How it works</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-paper md:text-4xl">
            Four steps. No account.
          </h2>
        </div>

        <div className="relative mt-14 grid gap-10 md:grid-cols-4">
          <div
  className="absolute left-8 right-8 top-8 hidden h-[2px] rounded-full bg-surface-line/80 md:block"
/>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
key={step.title}
className="reveal relative flex flex-col"
>
  <div className="relative mb-4">
                <div className="panel flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg">
                  <Icon
    size={24}
    strokeWidth={2.2}
    className="text-mint"
/>
                  <span
className="
led-text
absolute
-right-2
-top-2
flex
h-7
w-7
items-center
justify-center
rounded-full
border
border-mint/20
bg-ink
text-[11px]
font-semibold
shadow-md
">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-paper">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-paper/80">{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
