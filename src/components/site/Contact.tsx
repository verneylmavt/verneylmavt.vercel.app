"use client";

import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { CopyChip } from "@/components/ui/CopyChip";
import { Glyph } from "@/components/ui/glyphs";
import { DotLeader } from "@/components/ui/DotLeader";

function contactKey(label: string): string {
  return label.toLowerCase();
}

function displayHref(href: string): string {
  if (href.startsWith("mailto:")) return href.replace("mailto:", "");
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function Contact({ site }: { site: SiteContent }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={7} slug="contact" title="Contact" />

        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-5">
            <h3 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.01em] uppercase text-foreground">
              Let&apos;s
              <br />
              talk<span className="text-[rgb(var(--accent))]">.</span>
            </h3>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.6] text-muted">
              Let’s collaborate and build something meaningful. I’m always open to exchanging ideas!
            </p>
          </div>

          <div className="md:col-span-7">
            <p className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft mb-3">
              {"// contacts.spec"}
            </p>
            <ul className="flex flex-col gap-3 border border-[rgb(var(--rule)/0.14)] bg-[rgb(var(--surface)/0.4)] p-5 rounded-[2px]">
              {site.contacts.map((c) => {
                const display = displayHref(c.href);
                return (
                  <li
                    key={c.label}
                    className="contact-row group flex items-baseline gap-3 text-[0.875rem]"
                  >
                    <Glyph name={c.icon} size={14} className="text-muted relative top-[0.15em] group-hover:text-[rgb(var(--accent))] transition-colors" />
                    <span className="text-foreground w-24 shrink-0">
                      {contactKey(c.label)}
                    </span>
                    <span className="text-muted-soft group-hover:text-[rgb(var(--accent))] transition-colors">=</span>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-foreground hover:text-[rgb(var(--accent))] truncate"
                    >
                      {display}
                    </a>
                    <DotLeader />
                    <CopyChip value={display} />
                    {c.href.startsWith("http") ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${c.label}`}
                        className="text-muted hover:text-[rgb(var(--accent))]"
                      >
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </li>
                );
              })}
              {site.links?.resume ? (
                <li className="contact-row group flex items-baseline gap-3 text-[0.875rem] pt-2 border-t border-[rgb(var(--rule)/0.10)]">
                  <Glyph name="FileText" size={14} className="text-muted relative top-[0.15em] group-hover:text-[rgb(var(--accent))] transition-colors" />
                  <span className="text-foreground w-24 shrink-0">resume</span>
                  <span className="text-muted-soft group-hover:text-[rgb(var(--accent))] transition-colors">=</span>
                  <a
                    href={site.links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-[rgb(var(--accent))] truncate"
                  >
                    {displayHref(site.links.resume)}
                  </a>
                  <DotLeader />
                  <CopyChip value={site.links.resume} />
                  <a
                    href={site.links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open resume"
                    className="text-muted hover:text-[rgb(var(--accent))]"
                  >
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
