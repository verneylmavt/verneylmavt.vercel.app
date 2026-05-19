import { Hairline } from "@/components/ui/Hairline";
import { cn } from "@/lib/cn";

/**
 * Swiss/engineering section header:
 *
 *   // 02_work                              [ src/sections/work.tsx ]
 *   WORK EXPERIENCES
 *   ─────────────────────────────────────────────────────────────
 */
export function SectionHeading({
  number,
  slug,
  title,
  filename,
  className,
}: {
  number: number;
  slug: string;
  title: string;
  filename?: string;
  className?: string;
}) {
  const padded = String(number).padStart(2, "0");
  const file = filename ?? `src/sections/${slug}.tsx`;

  return (
    <header className={cn("mb-8", className)}>
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <span className="text-[0.75rem] uppercase tracking-[0.06em] text-muted">
          <span aria-hidden="true">{"// "}</span>
          <span className="text-[rgb(var(--accent))]">{padded}</span>
          <span aria-hidden="true">_</span>
          <span>{slug}</span>
        </span>
        <span className="hidden md:inline text-[0.6875rem] tracking-[0.04em] text-muted-soft">
          [ {file} ]
        </span>
      </div>
      <h2
        className={cn(
          "text-[clamp(2rem,5vw,3.5rem)] leading-[1.0] font-medium tracking-[-0.01em]",
          "text-foreground uppercase",
        )}
      >
        {title}
      </h2>
      <Hairline className="mt-4" />
    </header>
  );
}
