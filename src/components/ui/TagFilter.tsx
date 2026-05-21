"use client";

import { cn } from "@/lib/cn";

export function TagFilter({
  tags,
  active,
  onChange,
  onHover,
  className,
  includeAll = true,
  allLabel = "all",
}: {
  tags: string[];
  active: string;
  onChange: (tag: string) => void;
  /** Optional hover broadcast — null on leave, tag on enter. */
  onHover?: (tag: string | null) => void;
  className?: string;
  includeAll?: boolean;
  allLabel?: string;
}) {
  const options = includeAll ? [allLabel, ...tags] : tags;
  return (
    <div
      role="toolbar"
      aria-label="Filter projects"
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        "flex flex-wrap items-start gap-1",
        className,
      )}
    >
      {options.map((tag) => {
        const isActive = active === tag;
        // The "all" pseudo-tag doesn't trigger dim-preview
        const broadcastTag = tag === allLabel ? null : tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            onMouseEnter={() => onHover?.(broadcastTag)}
            onFocus={() => onHover?.(broadcastTag)}
            onBlur={() => onHover?.(null)}
            aria-pressed={isActive}
            className={cn(
              "whitespace-nowrap px-2.5 py-1 text-[0.75rem] tracking-[0.03em]",
              "border rounded-[2px] transition-colors",
              "duration-[var(--dur-base)] ease-[var(--ease-precise)]",
              isActive
                ? "border-[rgb(var(--accent)/0.55)] bg-[rgb(var(--accent)/0.10)] text-[rgb(var(--accent))]"
                : "border-[rgb(var(--rule)/0.18)] bg-[rgb(var(--surface)/0.4)] text-muted hover:border-[rgb(var(--rule)/0.32)] hover:text-foreground focus-visible:border-[rgb(var(--accent)/0.55)] focus-visible:text-[rgb(var(--accent))]",
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
