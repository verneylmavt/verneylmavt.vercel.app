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
  Binary,
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
import { cn } from "@/lib/cn";

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
  Binary,
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
  // Preserve insertion order from site.tools — no alphabetical sort.
  const tools = site.tools;
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
          {/* {`// ${tools.length} tools`} */}
        </p>

        <ul className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2 md:grid-cols-3">
          {tools.map((tool) => {
            const Icon = TOOL_ICON_MAP[tool.icon];
            const slug = tool.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
            return (
              <li
                key={tool.name}
                className={cn(
                  "group tools-row relative",
                  "grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-x-2.5",
                  "text-[0.875rem] py-1.5 border-b border-[rgb(var(--rule)/0.06)]",
                )}
              >
                <Icon
                  className="h-3.5 w-3.5 text-muted group-hover:text-[rgb(var(--accent))] transition-colors"
                  aria-hidden="true"
                />
                <span className="text-foreground truncate">
                  {tool.name.toLowerCase()}
                </span>
                {/* Dots — sit in their own grid column, anchored to the right
                    edge of every row → aligned across rows. Fade on hover. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "tracking-[0.2em] text-[rgb(var(--rule)/0.35)] select-none",
                    "transition-opacity duration-[var(--dur-base)]",
                    "lg:group-hover:opacity-0",
                  )}
                >
                  ······
                </span>
                {/* Import ghost — absolutely positioned so it never affects
                    the dot column width. Anchored to LI right edge; fades in
                    on hover and replaces the dots visually. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden lg:block pointer-events-none",
                    "absolute right-0 top-1/2 -translate-y-1/2",
                    "whitespace-nowrap text-[0.6875rem] text-muted-soft",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-[var(--dur-base)]",
                  )}
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
