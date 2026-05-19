"use client";

import * as React from "react";

const STORAGE_KEY = "v3:diag";

/**
 * Konami-code-activated diagnostic overlay.
 * - Sets `data-diag="on"` on <html> so a globals.css rule outlines all elements.
 * - Renders 12 vertical column-boundary lines.
 * - Shows a top-right HUD with FPS, viewport size, scroll, theme.
 * - Esc exits.
 *
 * Toggle via the `active` prop (driven by Konami in SitePage).
 * State persists in sessionStorage so refresh keeps it on for the session.
 */
export function DiagnosticOverlay({
  active,
  onClose,
  themeLabel,
}: {
  active: boolean;
  onClose: () => void;
  themeLabel: string;
}) {
  // Apply data-diag attribute on <html>
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (active) {
      document.documentElement.setAttribute("data-diag", "on");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    } else {
      document.documentElement.removeAttribute("data-diag");
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [active]);

  // Esc to close
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClose]);

  // Live HUD values via rAF
  const hudRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!active) return;
    let raf = 0;
    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;
    let lastFpsUpdate = lastTime;

    const tick = () => {
      const now = performance.now();
      frames += 1;
      if (now - lastFpsUpdate >= 500) {
        fps = Math.round((frames * 1000) / (now - lastFpsUpdate));
        frames = 0;
        lastFpsUpdate = now;
      }
      const el = hudRef.current;
      if (el) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const sy = Math.round(window.scrollY);
        el.textContent = `${fps} fps · ${vw}×${vh} · scroll ${sy}px · theme=${themeLabel}`;
      }
      raf = requestAnimationFrame(tick);
      lastTime = now;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, themeLabel]);

  if (!active) return null;

  return (
    <>
      {/* 12-column grid lines */}
      <div
        aria-hidden="true"
        className="diag-hud pointer-events-none fixed inset-0 z-[45] mx-auto"
      >
        <div className="mx-auto max-w-[88rem] h-full px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-x-6 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-l border-[rgb(var(--accent)/0.18)] h-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* HUD */}
      <div
        role="status"
        aria-live="polite"
        className="diag-hud fixed top-4 right-4 z-[55] border border-[rgb(var(--accent)/0.55)] bg-background/90 backdrop-blur px-3 py-2 text-[0.6875rem] uppercase tracking-[0.04em] text-[rgb(var(--accent))] tabular-nums shadow"
      >
        <div className="opacity-70 mb-1">{"// diagnostic"}</div>
        <div ref={hudRef}>0 fps · -- · scroll 0px · theme=--</div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 block text-[0.625rem] tracking-[0.06em] uppercase text-muted hover:text-foreground"
        >
          [ esc to dismiss ]
        </button>
      </div>
    </>
  );
}

/** Reads persisted state for initial mount in parent components. */
export function readDiagnosticInitial(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
