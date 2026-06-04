"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import type { ProjectItem } from "@/content/site";
import { Glyph } from "@/components/ui/glyphs";
import { KeyValue } from "@/components/ui/KeyValue";
import { padIndex, formatRange } from "@/lib/format";
import { cn } from "@/lib/cn";

const MAX_TILT_DEG = 5;

function categoryTag(p: ProjectItem): string {
  const t = p.tags ?? [];
  return (
    t.find((x) => x === "School Project" || x === "Personal Project") ??
    t[0] ??
    "Project"
  );
}

export function ProjectCard({
  project,
  index,
  featured = false,
  dimmed = false,
}: {
  project: ProjectItem;
  index: number;
  featured?: boolean;
  /** When true, dim the card (used for tag-hover preview). */
  dimmed?: boolean;
}) {
  const primaryUrl = project.demoUrl || project.repoUrl;
  const cat = categoryTag(project);
  const year = formatRange(project.start, project.end);

  const articleRef = React.useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // Initial state must match server (false). After mount, enable tilt on
  // pointer-capable, non-reduced-motion clients.
  const [tiltEnabled, setTiltEnabled] = React.useState(false);
  React.useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia) return;
    if (window.matchMedia("(hover: none)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTiltEnabled(true);
  }, [reduced]);

  // Tilt is driven imperatively (DOM transform written from a rAF loop)
  // so mousemove doesn't churn React state at ~60fps. We lerp `current`
  // toward `target`; the loop stops once both are at rest.
  const targetRef = React.useRef({ x: 0, y: 0 });
  const currentRef = React.useRef({ x: 0, y: 0 });
  const rafRef = React.useRef<number>(0);

  const ensureLoop = React.useCallback(() => {
    if (rafRef.current) return;
    const tick = () => {
      const el = articleRef.current;
      if (!el) {
        rafRef.current = 0;
        return;
      }
      const lerp = 0.18;
      const cx = currentRef.current.x;
      const cy = currentRef.current.y;
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const nx = cx + (tx - cx) * lerp;
      const ny = cy + (ty - cy) * lerp;
      currentRef.current = { x: nx, y: ny };

      el.style.transform = `perspective(900px) rotateX(${-ny}deg) rotateY(${nx}deg)`;

      const settled =
        Math.abs(tx - nx) < 0.01 && Math.abs(ty - ny) < 0.01;
      if (settled && tx === 0 && ty === 0) {
        // Snap to zero and stop
        currentRef.current = { x: 0, y: 0 };
        el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        rafRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const onMouseMove: React.MouseEventHandler<HTMLElement> = (e) => {
    if (!tiltEnabled) return;
    const el = articleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    targetRef.current = {
      x: Math.max(-1, Math.min(1, dx)) * MAX_TILT_DEG,
      y: Math.max(-1, Math.min(1, dy)) * MAX_TILT_DEG,
    };
    ensureLoop();
  };

  const onMouseLeave = () => {
    if (!tiltEnabled) return;
    targetRef.current = { x: 0, y: 0 };
    ensureLoop();
  };

  // Unmount safety: cancel any in-flight rAF
  React.useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, []);

  return (
    <article
      ref={articleRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative group plus-corners flex flex-col",
        "border border-[rgb(var(--rule)/0.14)] rounded-[2px]",
        "bg-[rgb(var(--surface)/0.45)]",
        "transition-[opacity,border-color,transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-precise)]",
        "hover:border-[rgb(var(--rule)/0.30)] hover:-translate-y-0.5",
        featured && "md:col-span-3",
        dimmed && "opacity-40",
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Category tag — top-left */}
      <div className="absolute -top-px left-3 z-[1]">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5",
            "text-[0.6875rem] uppercase tracking-[0.06em]",
            "bg-background text-muted border-x border-b border-[rgb(var(--rule)/0.18)]",
          )}
        >
          [ {cat.toLowerCase()} ]
        </span>
      </div>

      {/* Index — top-right */}
      <div className="absolute top-3 right-3 z-[1] text-[0.6875rem] text-[rgb(var(--accent))] tabular-nums">
        {padIndex(index + 1)}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-6 pt-8">
        <h3 data-probe className="text-[0.9rem] tracking-tight uppercase text-foreground md:text-[1rem]">
          {project.title}
        </h3>
        <p className="text-[0.8rem] leading-[1.55] text-muted md:text-[0.875rem]">
          {project.description}
        </p>

        {project.tags?.length ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[0.625rem] tracking-[0.03em] uppercase text-muted-soft border border-[rgb(var(--rule)/0.12)] px-1.5 py-0.5 md:text-[0.6875rem]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* Year — single meta line replacing the 4-cell metric strip */}
        <div className="mt-2 pt-3 border-t border-[rgb(var(--rule)/0.10)]">
          <KeyValue k="year" v={year || "—"} />
        </div>

        {/* Links + arrow */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-4 text-[0.75rem] tracking-[0.04em] uppercase">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted hover:text-[rgb(var(--accent))]"
              >
                <Glyph name="ExternalLink" size={12} />
                demo
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted hover:text-[rgb(var(--accent))]"
              >
                <Glyph name="Github" size={12} />
                repo
              </a>
            ) : null}
          </div>

          {primaryUrl ? (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}`}
              className="text-foreground/60 group-hover:text-[rgb(var(--accent))] transition-colors text-[0.875rem]"
            >
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
