"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="key-button key-button-accent fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95"
    >
      <ArrowUp
    size={20}
    strokeWidth={2.5}
/>
    </button>
  );
}
