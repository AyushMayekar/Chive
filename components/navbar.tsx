"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#browse", label: "Browse" },
  { href: "#publish", label: "Publish" },
  { href: "#contact", label: "Contact" },
];

const LOGO_URL =
  process.env.NEXT_PUBLIC_CHIVE_LOGO_URL ??
  "https://res.cloudinary.com/dpuqctqfl/image/upload/v1781440274/ChiveLogo_oqucmu.png";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-surface-line/60 bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
        <Link
          href="#top"
          className="group flex items-center gap-3 transition-all duration-300 hover:opacity-95"
        >
          <div className="relative h-7 w-7 shrink-0"> <Image src={LOGO_URL} alt="Chive" fill className="object-contain scale-450 -translate-x-5" priority /> </div>

          <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-paper transition-colors group-hover:text-mint">
            Chive
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-paper/85 transition-all duration-200 hover:bg-surface hover:text-paper"
              >
                <span className="indicator-dot" />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            aria-label="Toggle dark or light mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            disabled={!mounted} className="key-button flex h-10 w-10 items-center justify-center text-paper shadow-sm transition-all hover:scale-105 hover:shadow-md"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )
            ) : (
              <div className="h-[17px] w-[17px]" />
            )}          </button>
          <a
            href="#publish"
            className="key-button key-button-accent px-5 py-2.5 text-sm font-semibold shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
          >
            Publish
          </a>
        </div>

        <button
          aria-label="Open menu"
          className="key-button flex h-10 w-10 items-center justify-center text-paper md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="mx-4 mb-4 rounded-3xl border border-surface-line bg-surface/95 p-5 shadow-xl backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-paper/90 transition-colors hover:bg-ink/10"
                >
                  <span className="indicator-dot" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center gap-3 px-1">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              disabled={!mounted}
              className="key-button flex h-10 w-10 items-center justify-center font-medium text-paper/90 transition-colors hover:bg-ink/10"
              aria-label="Toggle dark or light mode"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun size={17} />
                ) : (
                  <Moon size={17} />
                )
              ) : (
                <div className="h-[17px] w-[17px]" />
              )}            </button>
            <a
              href="#publish"
              onClick={() => setOpen(false)}
              className="key-button key-button-accent flex-1 px-5 py-2.5 text-center text-sm font-semibold shadow-md transition-all hover:scale-[1.02]"
            >
              Publish a conversation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
