import Image from "next/image";
import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { KeyValue } from "@/components/ui/KeyValue";
import { Glyph } from "@/components/ui/glyphs";
import { cn } from "@/lib/cn";

export function Certifications({ site }: { site: SiteContent }) {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={5} slug="certification" title="Certifications" />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {site.certifications.map((c) => (
            <article
              key={`${c.title}-${c.date}`}
              className={cn(
                "relative group plus-corners",
                "border border-[rgb(var(--rule)/0.14)] rounded-[2px]",
                "bg-[rgb(var(--surface)/0.4)] p-4 md:p-5",
                "transition-colors duration-[var(--dur-base)]",
                "hover:border-[rgb(var(--rule)/0.28)]",
              )}
            >
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <a
                  href={c.proofUrl ?? c.badgeImagePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open proof for ${c.title}`}
                  className="block"
                >
                  <Image
                    src={c.badgeImagePath}
                    alt={`${c.title} badge`}
                    width={96}
                    height={96}
                    className={cn(
                      "w-[88px] h-auto",
                      "grayscale opacity-80",
                      "transition duration-[var(--dur-slow)]",
                      "group-hover:grayscale-0 group-hover:opacity-100",
                    )}
                  />
                </a>
                <div className="flex flex-col gap-1">
                  <p className="text-[0.85rem] text-foreground tracking-tight md:text-[0.9rem]">
                    {c.title}
                  </p>
                  <KeyValue variant="comment" k="issuer" v={c.issuer} />
                  <KeyValue variant="comment" k="valid" v={c.date} />
                  {c.proofUrl ? (
                    <a
                      href={c.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 self-start text-[0.75rem] uppercase tracking-[0.04em] text-muted hover:text-[rgb(var(--accent))]"
                    >
                      <span aria-hidden="true" className="text-[rgb(var(--accent))]">●</span>
                      <Glyph name="ExternalLink" size={12} />
                      <span>verify</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
