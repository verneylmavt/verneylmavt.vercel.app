import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { DotLeader } from "@/components/ui/DotLeader";
import { sortByName } from "@/lib/format";

export function Tools({ site }: { site: SiteContent }) {
  const sorted = sortByName(site.tools);
  return (
    <section id="tools" aria-labelledby="tools-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={4} slug="tools" title="Tools" filename="src/sections/tools.lock" />
        <p className="text-[0.75rem] uppercase tracking-[0.06em] text-muted-soft mb-6">
          {`// ${sorted.length} packages`}
        </p>

        <ul className="grid gap-x-8 gap-y-1.5 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((tool) => {
            const slug = tool.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return (
              <li
                key={tool.name}
                className="group flex items-baseline text-[0.875rem] py-1.5 border-b border-[rgb(var(--rule)/0.06)]"
              >
                <span className="text-foreground">{tool.name.toLowerCase()}</span>
                <DotLeader />
                <span className="text-muted tabular-nums">
                  {tool.version ?? tool.category ?? "latest"}
                </span>
                {/* Hover ghost — visible only on md+ */}
                <span
                  aria-hidden="true"
                  className="hidden lg:inline-block ml-3 pl-3 text-[0.6875rem] text-muted-soft opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  import {`{ ${slug} }`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
