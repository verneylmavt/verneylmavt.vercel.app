import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { KeyValue } from "@/components/ui/KeyValue";
import { Hairline } from "@/components/ui/Hairline";
import { padIndex } from "@/lib/format";

export function Education({ site }: { site: SiteContent }) {
  return (
    <section id="education" aria-labelledby="education-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={2} slug="education" title="Education" />

        <ol className="flex flex-col gap-10">
          {site.education.map((edu, i) => (
            <li key={`${edu.institution}-${edu.start}`}>
              <div className="grid gap-y-3 md:grid-cols-12 md:gap-x-6">
                {/* Index */}
                <div className="md:col-span-1 text-muted-soft text-[0.75rem] tabular-nums">
                  {padIndex(i + 1)}
                </div>
                {/* Spec block — full remaining width so institution fits on one line */}
                <div className="md:col-span-11">
                  <div className="flex flex-col gap-2">
                    <KeyValue
                      k="institution"
                      v={edu.institution}
                      valueClassName="whitespace-nowrap overflow-hidden text-ellipsis"
                    />
                    <KeyValue k="degree" v={edu.title} />
                    <KeyValue k="period" v={`${edu.start} — ${edu.end}`} />
                    {edu.description ? (
                      <p className="mt-2 text-[0.9375rem] leading-[1.6] text-muted-soft max-w-3xl">
                        <span className="text-muted-soft/70" aria-hidden="true">
                          {"/* "}
                        </span>
                        {edu.description}
                        <span className="text-muted-soft/70" aria-hidden="true">
                          {" */"}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              {i < site.education.length - 1 ? <Hairline className="mt-10" /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
