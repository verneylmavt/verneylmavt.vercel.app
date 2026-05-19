import * as React from "react";
import { DotLeader } from "./DotLeader";
import { cn } from "@/lib/cn";

/**
 * KEY ········· VALUE row.
 *
 * Variants:
 *  - "leader" (default): dotted leader between, key left / value right
 *  - "toml":   `key = value` inline, no leader (`.toml` look)
 *  - "comment": `// key = value` muted, for soft annotations
 */
export function KeyValue({
  k,
  v,
  variant = "leader",
  keyClassName,
  valueClassName,
  className,
}: {
  k: React.ReactNode;
  v: React.ReactNode;
  variant?: "leader" | "toml" | "comment";
  keyClassName?: string;
  valueClassName?: string;
  className?: string;
}) {
  if (variant === "toml") {
    return (
      <div className={cn("flex items-baseline gap-2 text-sm", className)}>
        <span className={cn("text-foreground", keyClassName)}>{k}</span>
        <span className="text-muted-soft">=</span>
        <span className={cn("text-foreground", valueClassName)}>{v}</span>
      </div>
    );
  }

  if (variant === "comment") {
    return (
      <div className={cn("text-sm text-muted-soft", className)}>
        <span aria-hidden="true">{"// "}</span>
        <span className={cn(keyClassName)}>{k}</span>
        <span className="mx-1">=</span>
        <span className={cn(valueClassName)}>{v}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-baseline gap-3 text-sm",
        className,
      )}
    >
      <span className={cn("text-muted uppercase tracking-[0.05em] text-[0.75rem]", keyClassName)}>
        {k}
      </span>
      <DotLeader />
      <span className={cn("text-foreground", valueClassName)}>{v}</span>
    </div>
  );
}
