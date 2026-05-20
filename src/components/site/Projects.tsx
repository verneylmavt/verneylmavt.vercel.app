"use client";

import * as React from "react";
import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { TagFilter } from "@/components/ui/TagFilter";
import { cn } from "@/lib/cn";

export const PROJECT_SEARCH_ID = "project-search";

const INITIAL_VISIBLE = 4;
const PAGE_STEP = 3;

export function Projects({ site }: { site: SiteContent }) {
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState<string>("all");
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_VISIBLE);
  const [hoveredTag, setHoveredTag] = React.useState<string | null>(null);

  // Reset pagination whenever the user changes the filter; done in the
  // handlers so we avoid `setState`-in-effect.
  const handleQueryChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setVisibleCount(INITIAL_VISIBLE);
    },
    [],
  );

  const handleTagChange = React.useCallback((next: string) => {
    setTag(next);
    setVisibleCount(INITIAL_VISIBLE);
  }, []);

  const tags = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of site.projects) {
      const seen = new Set(p.tags ?? []);
      for (const t of seen) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
  }, [site.projects]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return site.projects.filter((p) => {
      if (tag !== "all" && !(p.tags ?? []).includes(tag)) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [site.projects, query, tag]);

  // Unify featured + rest into one ordered list so pagination works uniformly.
  const ordered = React.useMemo(() => {
    const featured = filtered.find((p) => p.featured);
    if (!featured) return filtered;
    return [featured, ...filtered.filter((p) => p !== featured)];
  }, [filtered]);

  const visibleProjects = ordered.slice(0, visibleCount);
  const hasMore = visibleCount < ordered.length;

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={6} slug="projects" title="Projects" />

        {/* Filter / search bar */}
        <div className="grid gap-3 md:grid-cols-12 mb-8">
          <div className="md:col-span-5">
            <SearchInput
              id={PROJECT_SEARCH_ID}
              value={query}
              onChange={handleQueryChange}
              prompt=">"
              placeholder="title or description..."
            />
          </div>
          <div className="md:col-span-7">
            <TagFilter
              tags={tags}
              active={tag}
              onChange={handleTagChange}
              onHover={setHoveredTag}
              includeAll
              allLabel="all"
              className="md:justify-end"
            />
          </div>
        </div>

        <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft mb-4">
          {`// showing ${visibleProjects.length} of ${ordered.length} project${
            ordered.length === 1 ? "" : "s"
          }`}
        </p>

        {filtered.length === 0 ? (
          <div className="border border-[rgb(var(--rule)/0.14)] bg-[rgb(var(--surface)/0.4)] px-5 py-6 text-[0.875rem] text-muted-soft">
            {"// no projects match the filter"}
          </div>
        ) : (
          <>
            <div className={cn("grid gap-6 md:grid-cols-3")}>
              {visibleProjects.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  index={i}
                  featured={!!p.featured}
                  dimmed={
                    hoveredTag !== null &&
                    !(p.tags ?? []).includes(hoveredTag)
                  }
                />
              ))}
            </div>

            {hasMore ? (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((v) =>
                      Math.min(v + PAGE_STEP, ordered.length),
                    )
                  }
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2",
                    "text-[0.75rem] uppercase tracking-[0.06em]",
                    "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
                    "bg-[rgb(var(--surface)/0.4)] text-foreground",
                    "transition-colors duration-[var(--dur-base)]",
                    "hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))]",
                  )}
                >
                  <span>
                    [ load more ]
                  </span>
                  <span aria-hidden="true">↓</span>
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
