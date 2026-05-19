"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/cn";

/** Vertical hairline scroll-progress indicator pinned to the right edge. */
export function ScrollIndicator({ className }: { className?: string }) {
  const p = useScrollProgress();
  return (
    <div
      aria-hidden="true"
      className={cn(
        "hidden md:block fixed top-0 right-0 z-30 w-px h-screen",
        "bg-[rgb(var(--rule)/0.10)] pointer-events-none",
        className,
      )}
    >
      <div
        className="absolute top-0 left-0 w-px bg-[rgb(var(--accent)/0.6)]"
        style={{ height: `${(p * 100).toFixed(2)}%` }}
      />
    </div>
  );
}
