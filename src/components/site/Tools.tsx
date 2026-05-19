import * as React from "react";
import {
  LineSquiggle,
  Zap,
  Sigma,
  Table,
  Brain,
  TrendingUp,
  Flame,
  Smile,
  Link,
  ChartNetwork,
  Bot,
  Star,
  CodeXml,
  Atom,
  Package,
  Database,
  DatabaseZap,
  Container,
  Network,
  Gpu,
  Cloud,
  type LucideIcon,
} from "lucide-react";

import type { SiteContent, ToolIconName } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { sortByName } from "@/lib/format";

const TOOL_ICON_MAP: Record<ToolIconName, LucideIcon> = {
  LineSquiggle,
  Zap,
  Sigma,
  Table,
  Brain,
  TrendingUp,
  Flame,
  Smile,
  Link,
  ChartNetwork,
  Bot,
  Star,
  CodeXml,
  Atom,
  Package,
  Database,
  DatabaseZap,
  Container,
  Network,
  Gpu,
  Cloud,
};

export function Tools({ site }: { site: SiteContent }) {
  const sorted = sortByName(site.tools);
  return (
    <section
      id="tools"
      aria-labelledby="tools-title"
      className="scroll-mt-24 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading
          number={4}
          slug="tools"
          title="Tools"
          filename="src/sections/tools.lock"
        />
        <p className="text-[0.75rem] uppercase tracking-[0.06em] text-muted-soft mb-6">
          {/* {`// ${sorted.length} tools`} */}
        </p>

        <ul className="grid gap-x-8 gap-y-1.5 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((tool) => {
            const Icon = TOOL_ICON_MAP[tool.icon];
            const slug = tool.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
            return (
              <li
                key={tool.name}
                className="group tools-row flex items-center gap-2.5 text-[0.875rem] py-1.5 border-b border-[rgb(var(--rule)/0.06)]"
              >
                <Icon
                  className="h-3.5 w-3.5 shrink-0 text-muted group-hover:text-[rgb(var(--accent))] transition-colors"
                  aria-hidden="true"
                />
                <span className="text-foreground truncate">
                  {tool.name.toLowerCase()}
                </span>
                {/* Fixed-width dot decoration — same per row regardless of name length */}
                <span
                  aria-hidden="true"
                  className="ml-auto tracking-[0.2em] text-[rgb(var(--rule)/0.35)] group-hover:text-[rgb(var(--accent)/0.6)] transition-colors select-none"
                >
                  ······
                </span>
                {/* Hover ghost — visible only on lg+ */}
                <span
                  aria-hidden="true"
                  className="hidden lg:inline-block w-[7.5rem] text-right text-[0.6875rem] text-muted-soft opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {`import { ${slug} }`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
