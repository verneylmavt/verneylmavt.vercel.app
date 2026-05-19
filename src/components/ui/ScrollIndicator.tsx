"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/cn";

/** Vertical scroll-progress indicator pinned to the right edge. */
export function ScrollIndicator({ className }: { className?: string }) {
  const p = useScrollProgress();
  const pct = (p * 100).toFixed(2);
  return (
    <div
      aria-hidden="true"
      className={cn(
        "hidden md:block fixed top-0 right-0 z-30 w-[2px] h-screen",
        "bg-[rgb(var(--rule)/0.10)] pointer-events-none",
        className,
      )}
    >
      <div
        className="absolute top-0 left-0 w-[2px] bg-[rgb(var(--accent))]"
        style={{ height: `${pct}%` }}
      />
      {/* Pulsing accent dot at the leading edge of the bar */}
      <div
        className="pulse-accent absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))]"
        style={{ top: `calc(${pct}% - 3px)` }}
      />
    </div>
  );
}
