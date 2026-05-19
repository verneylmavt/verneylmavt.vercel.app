"use client";

import { LocalClock } from "@/components/ui/LocalClock";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/cn";

export function StatusBar() {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);
  const { theme, resolvedTheme, cycleTheme } = useTheme();

  const themeLabel =
    theme === "system" ? `system (${resolvedTheme})` : theme;

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
          <span className="hidden sm:inline tabular-nums">
            scroll {String(pct).padStart(2, "0")}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Theme: ${themeLabel}. Click to cycle.`}
            className={cn(
              "hidden sm:inline-flex items-center px-1.5 py-0.5",
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
