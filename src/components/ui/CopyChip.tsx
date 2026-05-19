"use client";

import * as React from "react";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/cn";

export function CopyChip({
  value,
  label = "copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={`Copy ${value}`}
      className={cn(
        "inline-flex items-center justify-center",
        "px-2 py-0.5 text-[0.6875rem] tracking-wider uppercase",
        "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
        "bg-[rgb(var(--surface)/0.5)] text-muted",
        "transition-colors duration-[var(--dur-base)] ease-[var(--ease-precise)]",
        "hover:border-[rgb(var(--rule)/0.32)] hover:text-foreground",
        copied && "border-[rgb(var(--accent)/0.5)] text-[rgb(var(--accent))]",
        className,
      )}
    >
      {copied ? "copied" : label}
    </button>
  );
}
