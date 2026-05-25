import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { KeyValue } from "@/components/ui/KeyValue";

export function About({ site }: { site: SiteContent }) {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={1} slug="about" title="About" />

        <div className="flex flex-col gap-10 max-w-3xl">
          {/* Paragraph */}
          <p className="text-[0.85rem] leading-[1.65] text-foreground md:leading-[1.55] md:text-[1rem]">
            {site.about.paragraph}
          </p>

          {/* Focus — beneath paragraph */}
          <div>
            <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft mb-3">
              {"// focus.toml"}
            </p>
            <div className="border border-[rgb(var(--rule)/0.14)] rounded-[2px] bg-[rgb(var(--surface)/0.4)] p-4">
              <p className="text-[0.875rem] mb-2">
                <span className="text-[rgb(var(--accent))]">[</span>
                <span className="text-muted">focus</span>
                <span className="text-[rgb(var(--accent))]">]</span>
              </p>
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
          </div>
        </div>
      </div>
    </section>
  );
}
