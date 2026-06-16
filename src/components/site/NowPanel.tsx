"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import type { NowSection } from "@/content/site";
import { Hairline } from "@/components/ui/Hairline";
import { cn } from "@/lib/cn";

/**
 * "Currently" activity panel — displayed in the Hero below the terminal.
 *
 * Shows a vertical stack of status rows (BUILDING · LEARNING · READING …).
 * The active row is highlighted in accent and auto-cycles every 4s.
 *
 * Interaction:
 *  - Clicking a non-active row selects it and pauses auto-cycle.
 *  - Clicking the active row while paused resumes auto-cycle.
 *  - ↗ icon (only on rows with a `url`) opens the link in a new tab without
 *    triggering the row-selection handler.
 *  - Under prefers-reduced-motion: no cycle, no progress strip; first row
 *    highlighted statically, links still work.
 */

const CYCLE_MS = 4000;

/** Width of the status column — widest tag is "experimenting" (13 chars). */
const STATUS_COL_W = "w-[7.5rem]";

export function NowPanel({ now }: { now: NowSection }) {
  const { items } = now;
  const reduced = useReducedMotion();

  const [activeIdx, setActiveIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Auto-cycle via setInterval — gated on paused + reduced-motion.
  React.useEffect(() => {
    if (paused || reduced || items.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % items.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced, items.length]);

  const handleRowClick = (idx: number) => {
    if (idx === activeIdx && paused) {
      // Already selected + paused → resume cycle
      setPaused(false);
    } else {
      setActiveIdx(idx);
      setPaused(true);
    }
  };

  return (
    <div className="mt-6 max-w-2xl" aria-label="Currently">
      {/* Header row */}
      <div className="mb-1.5">
        <span className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-soft">
          {"// currently"}
        </span>
      </div>

      <Hairline />

      {/* Item rows */}
      <div className="divide-y divide-[rgb(var(--rule)/0.10)]">
        {items.map((item, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`${item.status}: ${item.label}${item.url ? " (link)" : ""}`}
              onClick={() => handleRowClick(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(idx);
                }
              }}
              className={cn(
                "group flex items-baseline gap-2.5 py-1 cursor-pointer outline-none select-none",
                "transition-colors duration-[var(--dur-base)]",
                "focus-visible:ring-1 focus-visible:ring-[rgb(var(--accent)/0.5)] focus-visible:rounded-[2px]",
              )}
            >
              {/* Active indicator */}
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0 text-[0.75rem] leading-none transition-colors duration-[var(--dur-base)]",
                  isActive
                    ? "text-[rgb(var(--accent))]"
                    : "text-muted-soft",
                )}
              >
                {isActive ? "▸" : "·"}
              </span>

              {/* Status tag */}
              <span
                className={cn(
                  STATUS_COL_W,
                  "shrink-0 text-[0.6875rem] uppercase tracking-[0.04em] transition-colors duration-[var(--dur-base)]",
                  isActive
                    ? "text-[rgb(var(--accent))]"
                    : "text-muted",
                )}
              >
                {item.status}
              </span>

              {/* Label */}
              <span
                className={cn(
                  "min-w-0 flex-1 text-[0.875rem] leading-snug transition-colors duration-[var(--dur-base)]",
                  isActive ? "text-foreground" : "text-muted",
                )}
              >
                {item.label}
              </span>

              {/* Optional link icon — click opens URL without toggling row */}
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${item.label}`}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className={cn(
                    "shrink-0 text-[0.75rem] leading-none",
                    "transition-colors duration-[var(--dur-base)]",
                    isActive
                      ? "text-[rgb(var(--accent))] hover:opacity-70"
                      : "text-muted-soft opacity-0 group-hover:opacity-100",
                  )}
                  tabIndex={isActive ? 0 : -1}
                >
                  ↗
                </a>
              ) : (
                // Placeholder so rows without a link don't shift layout
                <span className="shrink-0 w-[0.75rem]" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>

      <Hairline />

      {/* Progress strip — resets each cycle by keying on activeIdx */}
      {!reduced && items.length > 1 && (
        <div
          className="h-px mt-0 overflow-hidden bg-[rgb(var(--rule)/0.12)]"
          aria-hidden="true"
        >
          <div
            key={`${activeIdx}-${paused}`}
            className={cn(
              "h-full bg-[rgb(var(--accent)/0.45)]",
              paused ? "w-full" : "now-panel-progress",
            )}
            style={
              paused
                ? undefined
                : ({ "--cycle-ms": `${CYCLE_MS}ms` } as React.CSSProperties)
            }
          />
        </div>
      )}

    </div>
  );
}
