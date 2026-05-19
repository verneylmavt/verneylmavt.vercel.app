"use client";

import * as React from "react";
import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { TagFilter } from "@/components/ui/TagFilter";
import { cn } from "@/lib/cn";

export const PROJECT_SEARCH_ID = "project-search";

export function Projects({ site }: { site: SiteContent }) {
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState<string>("all");

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

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || p !== featured);

  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={6} slug="projects" title="Projects" />

        {/* Filter / search bar */}
        <div className="grid gap-3 md:grid-cols-12 mb-8">
          <div className="md:col-span-5">
            <SearchInput
              id={PROJECT_SEARCH_ID}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              prompt="> search"
              placeholder="title or description..."
            />
          </div>
          <div className="md:col-span-7">
            <TagFilter
              tags={tags}
              active={tag}
              onChange={setTag}
              includeAll
              allLabel="all"
              className="md:justify-end"
            />
          </div>
        </div>

        <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft mb-4">
          {`// ${filtered.length} of ${site.projects.length} project${site.projects.length === 1 ? "" : "s"}`}
        </p>

        {filtered.length === 0 ? (
          <div className="border border-[rgb(var(--rule)/0.14)] bg-[rgb(var(--surface)/0.4)] px-5 py-6 text-[0.875rem] text-muted-soft">
            {"// no projects match the filter"}
          </div>
        ) : (
          <div className={cn("grid gap-6 md:grid-cols-3")}>
            {featured ? (
              <ProjectCard project={featured} index={0} featured />
            ) : null}
            {rest.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i + (featured ? 1 : 0)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
