"use client";

import { LocalClock } from "@/components/ui/LocalClock";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/cn";
import type { Availability } from "@/content/site";

const AVAILABILITY_LABEL: Record<Availability, string> = {
  open: "available",
  selective: "selective",
  closed: "closed",
};

export function StatusBar({ availability }: { availability: Availability }) {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);

  return (
    <div
      role="status"
      aria-live="off"
      className={cn(
        "fixed bottom-0 inset-x-0 z-30",
        "border-t border-[rgb(var(--rule)/0.12)] bg-[rgb(var(--background)/0.92)] backdrop-blur",
      )}
    >
      <div className="mx-auto max-w-[88rem] px-4 lg:px-8 h-8 flex items-center justify-between text-[0.6875rem] tracking-[0.04em] text-muted">
        <div className="flex items-center gap-3 min-w-0">
          <LocalClock timeZone="Asia/Jakarta" zoneLabel="JKT" />
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="hidden sm:inline tabular-nums">scroll {String(pct).padStart(2, "0")}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">v3.0.0</span>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn(
                "inline-block w-1.5 h-1.5 rounded-full",
                availability === "open"
                  ? "bg-[rgb(var(--accent))]"
                  : "bg-muted-soft",
              )}
            />
            <span>{AVAILABILITY_LABEL[availability]}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
