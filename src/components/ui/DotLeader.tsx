import { cn } from "@/lib/cn";

/**
 * Flexible horizontal dotted fill (CSS background-image based).
 * Drop between two siblings inside a flex row:
 *   <span>KEY</span><DotLeader /><span>VALUE</span>
 */
export function DotLeader({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("dot-leader self-end mb-[0.35em]", className)}
    />
  );
}
