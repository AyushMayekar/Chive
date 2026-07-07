import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="led-text text-sm">404</span>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-paper">
        That conversation isn&apos;t on the shelf.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-paper/55">
        Double-check the Conversation ID, or head back and browse what&apos;s published.
      </p>
      <Link href="/" className="key-button key-button-accent mt-6 px-6 py-3 text-sm font-semibold">
        Back to homepage
      </Link>
    </main>
  );
}
