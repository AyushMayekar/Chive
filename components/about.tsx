const DEFAULT_POINTS = [
  {
    title: "Why Chive exists",
    body:
      "Every day, brilliant back-and-forths with AI tools get buried in chat history and forgotten. Chive gives the good ones a permanent, findable home.",
  },
  {
    title: "Why AI conversations matter",
    body:
      "A well-run conversation is a compressed piece of reasoning — a debugging session, a research plan, a mock interview. That's worth as much as a blog post, sometimes more.",
  },
  {
    title: "Why knowledge shouldn't disappear",
    body:
      "Share links already make a conversation public. Chive just makes it discoverable, instead of relying on someone remembering to bookmark it.",
  },
  {
    title: "Who Chive is built for",
    body:
      "Developers, researchers, students, founders, and anyone who's had a conversation worth pointing a friend to.",
  },
];

export type AboutSettings = Partial<{
  card1_title: string;
  card1_body: string;
  card2_title: string;
  card2_body: string;
  card3_title: string;
  card3_body: string;
  card4_title: string;
  card4_body: string;
}>;

function resolvePoints(settings?: AboutSettings) {
  return DEFAULT_POINTS.map((fallback, i) => {
    const n = i + 1;
    const title = settings?.[`card${n}_title` as keyof AboutSettings];
    const body = settings?.[`card${n}_body` as keyof AboutSettings];
    return {
      title: title || fallback.title,
      body: body || fallback.body,
    };
  });
}

export function About({ settings }: { settings?: AboutSettings }) {
  const points = resolvePoints(settings);

  return (
    <section id="about" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="reveal max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">About Chive</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-paper md:text-4xl">
            A library, not another feed.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {points.map((point) => (
            <div key={point.title} className="reveal panel panel-hover rounded-3xl p-7">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-paper">
                {point.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-paper/80">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
