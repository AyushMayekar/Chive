"use client";

import { useEffect } from "react";

/**
 * Mount once near the root. Finds every element with the `.reveal`
 * class (see globals.css) and adds `.is-visible` the first time it
 * scrolls into view. Re-scans on DOM mutations so sections that
 * render client-side (Browse results, etc.) still animate in.
 */
export function RevealInit() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    const observeAll = () => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));
    };

    observeAll();

    const mutationObserver = new MutationObserver(() => observeAll());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
