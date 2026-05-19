"use client";

import * as React from "react";

function getProgress(): number {
  if (typeof window === "undefined") return 0;
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop || 0;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  return Math.min(1, Math.max(0, scrollTop / max));
}

/**
 * Returns the page scroll fraction in [0, 1].
 * Uses `useSyncExternalStore` so SSR returns 0 deterministically and the
 * client subscribes to scroll/resize without setState-in-effect.
 */
export function useScrollProgress(): number {
  const subscribe = React.useCallback((callback: () => void) => {
    let frame = 0;
    const handler = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(callback);
    };
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return React.useSyncExternalStore(subscribe, getProgress, () => 0);
}
