import type { ProjectItem } from "@/content/site";
import { Glyph } from "@/components/ui/glyphs";
import { KeyValue } from "@/components/ui/KeyValue";
import { padIndex, formatRange } from "@/lib/format";
import { cn } from "@/lib/cn";

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
}: {
  project: ProjectItem;
  index: number;
  featured?: boolean;
}) {
  const primaryUrl = project.demoUrl || project.repoUrl;
  const cat = categoryTag(project);
  const year = formatRange(project.start, project.end);

  return (
    <article
      className={cn(
        "relative group plus-corners flex flex-col",
        "border border-[rgb(var(--rule)/0.14)] rounded-[2px]",
        "bg-[rgb(var(--surface)/0.45)]",
        "transition-all duration-[var(--dur-base)] ease-[var(--ease-precise)]",
        "hover:border-[rgb(var(--rule)/0.30)] hover:-translate-y-0.5",
        featured && "md:col-span-3",
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

      {/* Index — top-right */}
      <div className="absolute top-3 right-3 z-[1] text-[0.6875rem] text-[rgb(var(--accent))] tabular-nums">
        {padIndex(index + 1)}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-6 pt-8">
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
