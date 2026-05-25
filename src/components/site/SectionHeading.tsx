"use client";

import * as React from "react";
import { Hairline } from "@/components/ui/Hairline";
import { cn } from "@/lib/cn";

/**
 * Swiss/engineering section header:
 *
 *   // 02_work                              [ src/sections/work.tsx ]
 *   WORK EXPERIENCES
 *   ─────────────────────────────────────────────────────────────
 *
 * The title "compiles in" via clip-path reveal the first time the heading
 * enters the viewport. Reduced-motion users get the static title immediately.
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
      <CompileInTitle title={title} />
      <Hairline className="mt-4" />
    </header>
  );
}

function CompileInTitle({ title }: { title: string }) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <h2
      ref={ref}
      className={cn(
        "text-[clamp(2.625rem,5vw,3.5rem)] leading-[1.0] font-medium tracking-[-0.01em]",
        "text-foreground uppercase",
      )}
    >
      <span
        className="compile-in"
        style={{ ["--reveal" as string]: revealed ? 1 : 0 }}
      >
        {title}
      </span>
    </h2>
  );
}
