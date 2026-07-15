import Link from "next/link";
import {
  Github,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";

import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-surface-line px-5 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 text-sm md:grid-cols-3 md:items-center">

        {/* Brand */}
        <Logo className="justify-center md:justify-self-start" boxSize={36} scale={1.7} />

        {/* Tagline + Socials */}
        <div className="flex flex-col items-center gap-4">
          <p className="max-w-sm text-center text-sm leading-6 text-paper/60">
            Don't lose great conversations. Chive them.
          </p>

          <div className="panel flex items-center gap-3 rounded-full px-4 py-2">

            <Link
              href="https://github.com/AyushMayekar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full p-2 text-paper/65 transition-all duration-200 hover:scale-110 hover:bg-surface-raised hover:text-mint"
            >
              <Github size={20} />
            </Link>

            <Link
              href="https://linkedin.com/in/ayush-mayekar-b9b883284"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full p-2 text-paper/65 transition-all duration-200 hover:scale-110 hover:bg-surface-raised hover:text-mint"
            >
              <Linkedin size={20} />
            </Link>

            <Link
              href="https://www.instagram.com/ayush_mayekar_21"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full p-2 text-paper/65 transition-all duration-200 hover:scale-110 hover:bg-surface-raised hover:text-mint"
            >
              <Instagram size={20} />
            </Link>

            <Link
              href="https://wa.me/8657153773"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full p-2 text-paper/65 transition-all duration-200 hover:scale-110 hover:bg-surface-raised hover:text-mint"
            >
              <MessageCircle size={20} />
            </Link>

          </div>
        </div>

        {/* Copyright */}
        <p className="self-center text-center text-paper/55 md:justify-self-end md:text-right">
          © {new Date().getFullYear()} Chive. All rights reserved.
        </p>

      </div>
    </footer>
  );
}