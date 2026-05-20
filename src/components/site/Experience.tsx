"use client";

import * as React from "react";
import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { ExperienceRow } from "./ExperienceRow";

export function Experience({ site }: { site: SiteContent }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading
          number={3}
          slug="work"
          title="Work Experience"
          filename="src/sections/work.tsx"
        />

        {site.workExperience.length === 0 ? (
          <div className="border border-[rgb(var(--rule)/0.14)] bg-[rgb(var(--surface)/0.4)] px-5 py-6 text-[0.875rem] text-muted-soft">
            {"// no entries"}
          </div>
        ) : (
          <ol className="border-t border-[rgb(var(--rule)/0.10)]">
            {site.workExperience.map((item, i) => (
              <ExperienceRow
                key={`${item.company}-${item.start}`}
                item={item}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex((v) => (v === i ? null : i))}
              />
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
