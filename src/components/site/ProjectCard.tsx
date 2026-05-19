import Image from "next/image";
import type { ProjectItem } from "@/content/site";
import { Glyph } from "@/components/ui/glyphs";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/cn";

type MetricCell = { label: string; value: string };

function deriveMetrics(p: ProjectItem): MetricCell[] {
  if (p.metrics?.length) return p.metrics.slice(0, 4);

  const cells: MetricCell[] = [];

  // Year
  cells.push({
    label: "year",
    value: p.start === p.end || !p.end ? p.start : `${p.start}–${p.end}`,
  });

  // Primary + secondary tags (skip category tags like "School Project" if there are more specific ones)
  const tags = p.tags ?? [];
  const tech = tags.filter(
    (t) => !["School Project", "Personal Project", "Web App", "Mobile App"].includes(t),
  );
  if (tech[0]) cells.push({ label: "stack", value: tech[0].toLowerCase() });
  if (tech[1]) cells.push({ label: "tech", value: tech[1].toLowerCase() });

  // Status — open if demo exists, else just repo
  cells.push({
    label: p.demoUrl ? "demo" : p.repoUrl ? "repo" : "status",
    value: p.demoUrl || p.repoUrl ? "live" : "wip",
  });

  return cells.slice(0, 4);
}

function categoryTag(p: ProjectItem): string {
  const t = p.tags ?? [];
  return t.find((x) => x === "School Project" || x === "Personal Project") ?? t[0] ?? "Project";
}

export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: ProjectItem;
  index: number;
  featured?: boolean;
}) {
  const metrics = deriveMetrics(project);
  const primaryUrl = project.demoUrl || project.repoUrl;
  const cat = categoryTag(project);

  return (
    <article
      className={cn(
        "relative group plus-corners flex flex-col",
        "border border-[rgb(var(--rule)/0.14)] rounded-[2px]",
        "bg-[rgb(var(--surface)/0.45)]",
        "transition-all duration-[var(--dur-base)] ease-[var(--ease-precise)]",
        "hover:border-[rgb(var(--rule)/0.30)] hover:-translate-y-0.5",
        featured && "md:col-span-3 md:flex-row md:items-stretch",
      )}
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

      {/* Index — top-right inside */}
      <div className="absolute top-3 right-3 z-[1] text-[0.6875rem] text-muted-soft tabular-nums">
        {padIndex(index + 1)}
      </div>

      {/* Thumbnail */}
      <a
        href={primaryUrl ?? "#"}
        target={primaryUrl ? "_blank" : undefined}
        rel={primaryUrl ? "noopener noreferrer" : undefined}
        aria-label={`Open ${project.title}`}
        className={cn(
          "relative block overflow-hidden border-b border-[rgb(var(--rule)/0.10)]",
          "bg-[rgb(var(--background)/0.6)]",
          featured ? "md:w-1/2 md:border-b-0 md:border-r" : "",
        )}
      >
        <Image
          src={project.thumbnailPath}
          alt={`${project.title} thumbnail`}
          width={900}
          height={600}
          sizes={featured ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
          className={cn(
            "w-full h-auto",
            "transition duration-[var(--dur-slow)] ease-[var(--ease-precise)]",
            "group-hover:scale-[1.02]",
          )}
        />
      </a>

      {/* Body */}
      <div className={cn("flex flex-col p-5 gap-3", featured ? "md:w-1/2" : "")}>
        <h3 className="text-[1.0625rem] tracking-tight uppercase text-foreground">
          {project.title}
        </h3>
        <p className="text-[0.875rem] leading-[1.55] text-muted">
          {project.description}
        </p>

        {project.tags?.length ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[0.6875rem] tracking-[0.03em] uppercase text-muted-soft border border-[rgb(var(--rule)/0.12)] px-1.5 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* Metric strip */}
        <div className="mt-auto pt-3">
          <div className="grid grid-cols-4 border border-[rgb(var(--rule)/0.14)] divide-x divide-[rgb(var(--rule)/0.10)]">
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col px-2 py-2 min-w-0">
                <span className="text-[0.6875rem] text-foreground tracking-tight tabular-nums truncate">
                  {m.value}
                </span>
                <span className="text-[0.625rem] uppercase tracking-[0.05em] text-muted-soft truncate">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 text-[0.75rem] tracking-[0.04em] uppercase">
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

          <span
            aria-hidden="true"
            className="text-foreground/60 group-hover:text-[rgb(var(--accent))] transition-colors text-[0.875rem]"
          >
            →
          </span>
        </div>
      </div>
    </article>
  );
}
