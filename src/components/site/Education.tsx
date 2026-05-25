"use client";

import * as React from "react";
import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { EducationRow } from "./EducationRow";

export function Education({ site }: { site: SiteContent }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="scroll-mt-24 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={2} slug="education" title="Education" />

        {site.education.length === 0 ? (
          <div className="border border-[rgb(var(--rule)/0.14)] bg-[rgb(var(--surface)/0.4)] px-5 py-6 text-[0.875rem] text-muted-soft">
            {"// no entries"}
          </div>
        ) : (
          <ol className="border-t border-[rgb(var(--rule)/0.10)]">
            {site.education.map((edu, i) => (
              <EducationRow
                key={`${edu.institution}-${edu.start}`}
                item={edu}
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
