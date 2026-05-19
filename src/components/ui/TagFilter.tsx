"use client";

import { cn } from "@/lib/cn";

export function TagFilter({
  tags,
  active,
  onChange,
  className,
  includeAll = true,
  allLabel = "all",
}: {
  tags: string[];
  active: string;
  onChange: (tag: string) => void;
  className?: string;
  includeAll?: boolean;
  allLabel?: string;
}) {
  const options = includeAll ? [allLabel, ...tags] : tags;
  return (
    <div
      role="toolbar"
      aria-label="Filter projects"
      className={cn(
        "flex gap-1 flex-wrap",
        // mobile: horizontal scroll fallback
        "max-md:flex-nowrap max-md:overflow-x-auto max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {options.map((tag) => {
        const isActive = active === tag;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            aria-pressed={isActive}
            className={cn(
              "whitespace-nowrap px-2.5 py-1 text-[0.75rem] tracking-[0.03em]",
              "border rounded-[2px] transition-colors",
              "duration-[var(--dur-base)] ease-[var(--ease-precise)]",
              isActive
                ? "border-[rgb(var(--accent)/0.55)] bg-[rgb(var(--accent)/0.10)] text-[rgb(var(--accent))]"
                : "border-[rgb(var(--rule)/0.18)] bg-[rgb(var(--surface)/0.4)] text-muted hover:border-[rgb(var(--rule)/0.32)] hover:text-foreground",
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
