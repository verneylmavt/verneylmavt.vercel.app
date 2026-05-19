import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { KeyValue } from "@/components/ui/KeyValue";

export function About({ site }: { site: SiteContent }) {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={1} slug="about" title="About" />

        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-7">
            <p className="text-[1.0625rem] leading-[1.55] text-foreground max-w-2xl">
              {site.about.paragraph}
            </p>
            {site.now ? (
              <div className="mt-8 max-w-2xl">
                <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft mb-2">
                  {`// currently — updated ${site.now.updatedAt}`}
                </p>
                <p className="text-[0.9375rem] leading-[1.55] text-muted">{site.now.paragraph}</p>
              </div>
            ) : null}
          </div>

          <aside className="md:col-span-5">
            <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft mb-3">
              {"// focus.toml"}
            </p>
            <div className="border border-[rgb(var(--rule)/0.14)] rounded-[2px] bg-[rgb(var(--surface)/0.4)] p-4">
              <p className="text-[0.875rem] text-muted-soft mb-2">[focus]</p>
              <div className="flex flex-col gap-2 pl-2">
                {site.about.focus.map((f) => {
                  const key = f.label.toLowerCase().replace(/\s+/g, "_");
                  return (
                    <KeyValue
                      key={f.label}
                      variant="toml"
                      k={key}
                      v={<span className="text-[rgb(var(--accent))]">true</span>}
                    />
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
