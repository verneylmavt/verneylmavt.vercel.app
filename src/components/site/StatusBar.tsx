"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { LocalClock } from "@/components/ui/LocalClock";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/cn";

type Flash = "idle" | "compiling" | "ok";

/**
 * Scroll-percent display, isolated into its own subscriber so the rest of
 * StatusBar (clock, theme button, compile flash, version) doesn't re-render
 * on every scroll frame.
 */
function ScrollPercent() {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);
  return (
    <span className="hidden sm:inline tabular-nums">
      scroll {String(pct).padStart(2, "0")}%
    </span>
  );
}

export function StatusBar({
  onOpenHelp,
}: {
  /** Opens the ShortcutHelp overlay. Hooked up from SitePage so the chip
   *  is a second entry point alongside the `?` keyboard shortcut. */
  onOpenHelp?: () => void;
} = {}) {
  const { theme, resolvedTheme, cycleTheme } = useTheme();
  const reduced = useReducedMotion();

  const themeLabel =
    theme === "system" ? `system (${resolvedTheme})` : theme;

  // Periodic "compiling…" → "ok" flash that briefly replaces the version label.
  // Pauses under reduced-motion and when the page is hidden.
  const [flash, setFlash] = React.useState<Flash>("idle");

  React.useEffect(() => {
    if (reduced) return;
    let chain: number[] = [];

    const schedule = () => {
      const delay = 50_000 + Math.random() * 20_000;
      chain.push(
        window.setTimeout(() => {
          if (document.visibilityState !== "visible") {
            schedule();
            return;
          }
          setFlash("compiling");
          chain.push(
            window.setTimeout(() => {
              setFlash("ok");
              chain.push(
                window.setTimeout(() => {
                  setFlash("idle");
                  schedule();
                }, 600),
              );
            }, 1400),
          );
        }, delay),
      );
    };

    schedule();
    return () => {
      chain.forEach((t) => window.clearTimeout(t));
      chain = [];
    };
  }, [reduced]);

  return (
    <div
      role="status"
      aria-live="off"
      className={cn(
        "fixed bottom-0 inset-x-0 z-30",
        "border-t border-[rgb(var(--rule)/0.12)] bg-[rgb(var(--background)/0.92)] backdrop-blur",
      )}
    >
      <div className="mx-auto max-w-[88rem] px-4 lg:px-8 h-8 flex items-center justify-between gap-3 text-[0.6875rem] tracking-[0.04em] text-muted">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline tabular-nums sm:hidden">JKT</span>
          <LocalClock
            timeZone="Asia/Jakarta"
            zoneLabel="JKT"
            className="hidden sm:inline-flex"
          />
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <ScrollPercent />
        </div>
        <div className="flex items-center gap-3">
          {/* Compile flash — only visible while flashing */}
          {flash === "compiling" ? (
            <span
              aria-hidden="true"
              className="hidden sm:inline text-muted-soft tabular-nums"
            >
              compiling…
            </span>
          ) : flash === "ok" ? (
            <span
              aria-hidden="true"
              className="hidden sm:inline text-[rgb(var(--accent))] tabular-nums"
            >
              ok
            </span>
          ) : null}

          {onOpenHelp ? (
            <button
              type="button"
              onClick={onOpenHelp}
              aria-label="Open keyboard shortcuts and easter eggs"
              className={cn(
                "inline-flex items-center px-1.5 py-0.5",
                "text-[0.6875rem] tracking-[0.04em]",
                "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
                "bg-[rgb(var(--surface)/0.4)] text-muted",
                "transition-colors duration-[var(--dur-base)]",
                "hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))]",
              )}
            >
              [ ? help ]
            </button>
          ) : null}

          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Theme: ${themeLabel}. Click to cycle.`}
            className={cn(
              "inline-flex max-w-[52vw] items-center px-1.5 py-0.5",
              "text-[0.6875rem] tracking-[0.04em]",
              "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
              "bg-[rgb(var(--surface)/0.4)] text-muted",
              "transition-colors duration-[var(--dur-base)]",
              "hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))]",
            )}
          >
            [ theme: {themeLabel} ]
          </button>
          <span className="hidden sm:inline text-[rgb(var(--accent))] tabular-nums">
            v3
          </span>
        </div>
      </div>
    </div>
  );
}
