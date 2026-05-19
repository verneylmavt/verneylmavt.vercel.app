"use client";

import { useLocalClock } from "@/hooks/useLocalClock";
import { cn } from "@/lib/cn";

export function LocalClock({
  timeZone,
  zoneLabel,
  withSeconds = true,
  className,
}: {
  timeZone?: string;
  zoneLabel?: string;
  withSeconds?: boolean;
  className?: string;
}) {
  const { time, zone } = useLocalClock({ timeZone, zoneLabel, withSeconds });
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.6875rem] tracking-[0.04em] text-muted tabular-nums",
        className,
      )}
      aria-label={`Local time in ${zone}`}
    >
      <span>{zone}</span>
      <span aria-hidden="true">·</span>
      <span>{time}</span>
    </span>
  );
}
