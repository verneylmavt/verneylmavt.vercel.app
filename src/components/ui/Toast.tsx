"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * A small fade-in/out toast pinned above the status bar.
 * Auto-closes after `durationMs` (default 3000) and calls `onClose`.
 */
export function Toast({
  open,
  durationMs = 3000,
  onClose,
  children,
  className,
}: {
  open: boolean;
  durationMs?: number;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(id);
  }, [open, durationMs, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-12 z-40",
        "px-4 py-2 text-[0.75rem] tracking-[0.04em] uppercase",
        "border border-[rgb(var(--accent)/0.45)] rounded-[2px]",
        "bg-[rgb(var(--background)/0.95)] backdrop-blur",
        "text-foreground shadow-[0_8px_24px_rgb(0_0_0/0.18)]",
        "transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-precise)]",
        open
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
