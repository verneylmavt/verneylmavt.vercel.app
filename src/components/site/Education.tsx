"use client";

import * as React from "react";
import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { EducationRow } from "./EducationRow";
import { Hairline } from "@/components/ui/Hairline";

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
          <ol className="flex flex-col gap-10">
            {site.education.map((edu, i) => (
              <React.Fragment key={`${edu.institution}-${edu.start}`}>
                <EducationRow
                  item={edu}
                  index={i}
                  open={openIndex === i}
                  onToggle={() =>
                    setOpenIndex((v) => (v === i ? null : i))
                  }
                />
                {i < site.education.length - 1 ? <Hairline /> : null}
              </React.Fragment>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
