"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import type { SiteContent } from "@/content/site";
import { Glyph } from "@/components/ui/glyphs";
import { BlinkingCaret } from "@/components/ui/BlinkingCaret";
import { KeyValue } from "@/components/ui/KeyValue";
import { Hairline } from "@/components/ui/Hairline";
import { cn } from "@/lib/cn";

const TYPEWRITER_COMMANDS = [
  "const interest = Product, Backend, AI/ML;",
  "const mbti = ENTP;",
] as const;

const AVAILABILITY_LABEL: Record<SiteContent["availability"], string> = {
  open: "open for opportunities",
  selective: "selective",
  closed: "not available",
};

export function Hero({ site }: { site: SiteContent }) {
  const reducedMotion = useReducedMotion();

  // Typewriter state — lifted from v2 (SitePage.tsx:134-181) but simplified.
  // No `mounted` state needed: initial charIndex=0 → visible="" matches both
  // server and first client render, so hydration is safe.
  const [cmdIndex, setCmdIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (reducedMotion) return;

    const phrase = TYPEWRITER_COMMANDS[cmdIndex] ?? "";
    const typeMs = 60;
    const deleteMs = 30;
    const pauseMs = 1100;
    const swapMs = 220;

    const typedDone = !deleting && charIndex >= phrase.length;
    const deletedDone = deleting && charIndex <= 0;

    let id: ReturnType<typeof setTimeout> | undefined;
    if (typedDone) {
      id = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deletedDone) {
      id = setTimeout(() => {
        setDeleting(false);
        setCmdIndex((v) => (v + 1) % TYPEWRITER_COMMANDS.length);
      }, swapMs);
    } else {
      id = setTimeout(
        () => setCharIndex((v) => v + (deleting ? -1 : 1)),
        deleting ? deleteMs : typeMs,
      );
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [reducedMotion, cmdIndex, charIndex, deleting]);

  const phrase = TYPEWRITER_COMMANDS[cmdIndex] ?? "";
  // When reduced motion is active, show the first command in full (no animation).
  const visible = reducedMotion
    ? (TYPEWRITER_COMMANDS[0] ?? "")
    : phrase.slice(0, Math.max(0, charIndex));

  // Split name into stacked tokens for the logotype
  const nameTokens = site.name.toUpperCase().split(" ");

  return (
    <section
      id="top"
      aria-label="Intro"
      className="relative min-h-[100svh] py-16 md:py-24"
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-12 grid gap-y-10 md:grid-cols-12 md:gap-x-6">
        {/* Logotype — col-span-8 */}
        <div className="md:col-span-8 flex flex-col justify-center">
          <p className="text-[0.6875rem] tracking-[0.08em] uppercase text-muted-soft mb-4">
            {"// 00_intro"}
          </p>
          <h1
            className={cn(
              "font-medium tracking-[-0.025em] uppercase",
              "leading-[0.85] text-[clamp(3rem,12vw,8rem)]",
              "text-foreground",
            )}
          >
            {nameTokens.map((t, i) => (
              <span key={i} className="block">
                {t}
              </span>
            ))}
          </h1>

          {/* Terminal status line */}
          <div className="mt-8 inline-flex items-center gap-2 text-[0.875rem] md:text-[1rem]">
            <span className="text-muted-soft">~/elvern</span>
            <span className="text-[rgb(var(--accent))]">$</span>
            <span className="text-foreground">{visible}</span>
            <BlinkingCaret />
          </div>

          {/* Tagline */}
          {site.tagline ? (
            <p className="mt-6 max-w-xl text-[1rem] leading-[1.55] text-muted">
              {site.tagline}
            </p>
          ) : null}

          {/* Contact chips */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {site.contacts.map((c) => {
              const external = c.href.startsWith("http");
              return (
                <a
                  key={c.label}
                  href={c.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "group inline-flex items-center gap-2 px-3 py-1.5",
                    "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
                    "bg-[rgb(var(--surface)/0.4)] text-[0.75rem] uppercase tracking-[0.04em] text-foreground",
                    "transition-colors duration-[var(--dur-base)]",
                    "hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))]",
                  )}
                >
                  <Glyph name={c.icon} className="opacity-80 group-hover:opacity-100" />
                  <span>{c.label}</span>
                  {external ? (
                    <span aria-hidden="true" className="text-muted-soft group-hover:text-[rgb(var(--accent))]">
                      ↗
                    </span>
                  ) : null}
                </a>
              );
            })}
            {site.links?.resume ? (
              <a
                href={site.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group inline-flex items-center gap-2 px-3 py-1.5",
                  "border border-[rgb(var(--accent)/0.55)] rounded-[2px]",
                  "bg-[rgb(var(--accent)/0.08)] text-[0.75rem] uppercase tracking-[0.04em] text-[rgb(var(--accent))]",
                )}
              >
                <Glyph name="FileText" />
                <span>resume</span>
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* Metadata column — col-span-4 */}
        <aside className="md:col-span-4 md:pt-3">
          <p className="text-[0.6875rem] tracking-[0.08em] uppercase text-muted-soft mb-3">
            {"// metadata"}
          </p>
          <div className="flex flex-col gap-3 max-w-sm">
            <KeyValue k="role" v={site.roleTitle} />
            {site.location ? <KeyValue k="location" v={site.location} /> : null}
            <KeyValue
              k="status"
              v={
                <span
                  className={cn(
                    site.availability === "open"
                      ? "text-[rgb(var(--accent))]"
                      : "text-foreground",
                  )}
                >
                  ● {AVAILABILITY_LABEL[site.availability]}
                </span>
              }
            />
            <KeyValue k="since" v="2019" />
          </div>

          {/* Photography cross-promo */}
          <Hairline className="my-6" />
          <a
            href="https://verneytography.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group block max-w-sm",
              "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
              "p-4 bg-[rgb(var(--surface)/0.4)]",
              "transition-colors duration-[var(--dur-base)]",
              "hover:border-[rgb(var(--accent)/0.45)]",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Glyph name="Aperture" size={16} className="text-muted" />
                <div className="min-w-0">
                  <p className="text-[0.875rem] text-foreground truncate">
                    photography portfolio
                  </p>
                  <p className="text-[0.6875rem] text-muted-soft truncate">
                    the other side of me, through my lens
                  </p>
                </div>
              </div>
              <span
                aria-hidden="true"
                className="text-muted-soft group-hover:text-[rgb(var(--accent))]"
              >
                ↗
              </span>
            </div>
          </a>
        </aside>
      </div>

      {/* Scroll affordance */}
      <div className="mx-auto max-w-[88rem] px-6 md:px-12 mt-16">
        <a
          href="#about"
          className="inline-flex items-center gap-3 text-[0.6875rem] tracking-[0.06em] uppercase text-muted hover:text-foreground"
        >
          <span aria-hidden="true" className="inline-block w-10 h-px bg-[rgb(var(--rule)/0.30)]" />
          <span>↓ 01 about</span>
        </a>
      </div>
    </section>
  );
}
