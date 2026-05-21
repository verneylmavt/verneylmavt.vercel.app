"use client";

import type { IconName, SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { CopyChip } from "@/components/ui/CopyChip";
import { Glyph } from "@/components/ui/glyphs";

function contactKey(label: string): string {
  return label.toLowerCase();
}

function displayHref(href: string): string {
  if (href.startsWith("mailto:")) return href.replace("mailto:", "");
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function ContactRow({
  icon,
  label,
  href,
  copyValue,
}: {
  icon: IconName;
  label: string;
  href: string;
  copyValue?: string;
}) {
  const external = href.startsWith("http");
  const display = displayHref(href);

  return (
    <li className="contact-row group grid grid-cols-[1rem_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1 text-[0.875rem] sm:grid-cols-[1rem_6rem_auto_minmax(0,1fr)_auto_auto] sm:items-baseline">
      <Glyph
        name={icon}
        size={14}
        className="col-[1] row-[1] relative top-[0.15em] text-muted transition-colors group-hover:text-[rgb(var(--accent))]"
      />
      <span className="col-[2] row-[1] text-foreground">{label}</span>
      <span className="hidden text-muted-soft transition-colors group-hover:text-[rgb(var(--accent))] sm:col-[3] sm:row-[1] sm:block">
        =
      </span>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="col-[2/3] row-[2] min-w-0 break-all text-foreground hover:text-[rgb(var(--accent))] sm:col-[4] sm:row-[1] sm:truncate sm:break-normal"
      >
        {display}
      </a>
      <CopyChip
        value={copyValue ?? display}
        className="col-[3] row-[1] justify-self-end sm:col-[5] sm:row-[1]"
      />
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${label}`}
          className="col-[3] row-[2] justify-self-end text-muted hover:text-[rgb(var(--accent))] sm:col-[6] sm:row-[1]"
        >
          <span aria-hidden="true">-&gt;</span>
        </a>
      ) : null}
    </li>
  );
}

export function Contact({ site }: { site: SiteContent }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={7} slug="contact" title="Contact" />

        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <div className="min-w-0 md:col-span-5">
            <h3 className="text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.01em] uppercase text-foreground">
              Let&apos;s
              <br />
              talk<span className="text-[rgb(var(--accent))]">.</span>
            </h3>
            <p className="mt-6 max-w-md break-words text-[0.9375rem] leading-[1.6] text-muted">
              Let&apos;s collaborate and build something meaningful. I&apos;m always
              open to exchanging ideas!
            </p>
          </div>

          <div className="min-w-0 md:col-span-7">
            <p className="mb-3 text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft">
              {"// contacts.spec"}
            </p>
            <ul className="flex min-w-0 flex-col gap-3 rounded-[2px] border border-[rgb(var(--rule)/0.14)] bg-[rgb(var(--surface)/0.4)] p-5">
              {site.contacts.map((c) => (
                <ContactRow
                  key={c.label}
                  icon={c.icon}
                  label={contactKey(c.label)}
                  href={c.href}
                />
              ))}
              {site.links?.resume ? (
                <li className="pt-2 border-t border-[rgb(var(--rule)/0.10)]">
                  <ContactRow
                    icon="FileText"
                    label="resume"
                    href={site.links.resume}
                    copyValue={site.links.resume}
                  />
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
