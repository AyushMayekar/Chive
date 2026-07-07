import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getConversationByConversationId } from "@/lib/mock-data";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = getConversationByConversationId(id);

  if (!conversation) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="key-button inline-flex items-center gap-2 px-4 py-2 text-sm text-paper/75"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          <div className="panel mt-6 p-7 md:p-9">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-[11px] font-medium text-mint">
                {conversation.llm}
              </span>
              <span className="led-text text-xs">{conversation.conversation_id}</span>
            </div>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug text-paper md:text-3xl">
              {conversation.title}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-paper/65">{conversation.summary}</p>

            <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-surface-line pt-6 text-sm">
              <div>
                <dt className="text-paper/40">Category</dt>
                <dd className="mt-1 text-paper/80">{conversation.category}</dd>
              </div>
              <div>
                <dt className="text-paper/40">Publisher</dt>
                <dd className="mt-1 text-paper/80">{conversation.publisher_name ?? "Anonymous"}</dd>
              </div>
              <div>
                <dt className="text-paper/40">Submission date</dt>
                <dd className="mt-1 text-paper/80">{conversation.submission_date}</dd>
              </div>
            </dl>

            <a
              href={conversation.share_url}
              target="_blank"
              rel="noopener noreferrer"
              className="key-button key-button-accent mt-8 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold"
            >
              Open original conversation
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
