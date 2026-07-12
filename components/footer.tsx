import Image from "next/image";

const LOGO_URL =
  process.env.NEXT_PUBLIC_CHIVE_LOGO_URL ??
  "https://res.cloudinary.com/dpuqctqfl/image/upload/v1781440274/ChiveLogo_oqucmu.png";

export function Footer() {
  return (
    <footer className="border-t border-surface-line px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-paper/45 md:flex-row">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7 shrink-0"> <Image src={LOGO_URL} alt="Chive" fill className="object-contain scale-450 -translate-x-5" priority /> </div>
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-paper">
            Chive
          </span>
        </div>
        <p>Don&apos;t lose great conversations. Chive them.</p>
        <p>&copy; {new Date().getFullYear()} Chive. All rights reserved.</p>
      </div>
    </footer>
  );
}
