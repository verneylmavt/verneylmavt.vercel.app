"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import type { SiteContent } from "@/content/site";
import { Glyph } from "@/components/ui/glyphs";
import { BlinkingCaret } from "@/components/ui/BlinkingCaret";
import { KeyValue } from "@/components/ui/KeyValue";
import { Hairline } from "@/components/ui/Hairline";
import { ScrambleText, fireScramble } from "@/components/ui/ScrambleText";
import { MiniTerminal } from "./MiniTerminal";
import { cn } from "@/lib/cn";

const TYPEWRITER_COMMANDS = [
  "const interest = Product, Backend, AI/ML;",
  "const mbti = ENTP;",
] as const;

// ASCII portrait — shown briefly when the user clicks the hero name.
const ASCII_ART = `   ____      __
  / __/__   / /
 / _// _ \\ / _ \\
/___/_//_//_//_/`;

export function Hero({ site }: { site: SiteContent }) {
  const reducedMotion = useReducedMotion();

  // Typewriter state — lifted from v2 (SitePage.tsx:134-181) but simplified.
  // No `mounted` state needed: initial charIndex=0 → visible="" matches both
  // server and first client render, so hydration is safe.
  const [cmdIndex, setCmdIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  // ASCII art reveal on hero click
  const [asciiOpen, setAsciiOpen] = React.useState(false);

  // Mini-terminal open state (triggered by clicking the `$` prompt)
  const [terminalOpen, setTerminalOpen] = React.useState(false);

  // Auto-revert ASCII art after 3s
  React.useEffect(() => {
    if (!asciiOpen) return;
    const id = window.setTimeout(() => setAsciiOpen(false), 3000);
    return () => window.clearTimeout(id);
  }, [asciiOpen]);

  React.useEffect(() => {
    if (reducedMotion) return;
    // Pause typewriter when the mini terminal is open
    if (terminalOpen) return;

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
  }, [reducedMotion, terminalOpen, cmdIndex, charIndex, deleting]);

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
            onMouseEnter={fireScramble}
            onFocus={fireScramble}
            onClick={() => setAsciiOpen((v) => !v)}
            tabIndex={0}
            role="button"
            aria-pressed={asciiOpen}
            aria-label={site.name}
            className={cn(
              "font-medium tracking-[-0.025em] uppercase outline-none",
              "leading-[0.85]",
              "text-foreground select-none",
              asciiOpen ? "cursor-pointer" : "cursor-pointer",
            )}
          >
            {asciiOpen ? (
              <pre
                aria-hidden="true"
                className="block whitespace-pre text-[rgb(var(--accent))] leading-[1.0] text-[clamp(0.75rem,2.4vw,1.5rem)] font-bold"
              >
                {ASCII_ART}
              </pre>
            ) : (
              <span className="text-[clamp(3rem,12vw,8rem)] block leading-[0.85]">
                {nameTokens.map((t, i) => (
                  <span key={i} className="block">
                    <ScrambleText text={t} duration={620} autoGlitch />
                  </span>
                ))}
              </span>
            )}
          </h1>

          {/* Terminal status line — click the `$` prompt to open the mini terminal */}
          {terminalOpen ? (
            <div className="mt-8 w-full max-w-2xl">
              <MiniTerminal
                open={terminalOpen}
                onClose={() => setTerminalOpen(false)}
                site={site}
              />
            </div>
          ) : (
            <div
              tabIndex={0}
              className="draw-accent mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 max-w-full text-[0.875rem] md:text-[1rem] outline-none cursor-default"
            >
              <span className="text-muted-soft whitespace-nowrap">
                ~/verneylmavt
              </span>
              <button
                type="button"
                onClick={() => setTerminalOpen(true)}
                aria-label="Open mini terminal"
                className={cn(
                  "text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.10)]",
                  "px-1 rounded-[2px] cursor-pointer shrink-0",
                  "transition-colors duration-[var(--dur-base)]",
                )}
              >
                $
              </button>
              <span className="text-foreground break-all min-w-0">
                {visible}
              </span>
              <BlinkingCaret />
            </div>
          )}

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

          {/* Scroll affordance — pinned to right column under the photography card */}
          <a
            href="#about"
            className="mt-6 inline-flex items-center gap-3 text-[0.6875rem] tracking-[0.06em] uppercase text-muted hover:text-foreground"
          >
            <span
              aria-hidden="true"
              className="inline-block w-10 h-px bg-[rgb(var(--rule)/0.30)]"
            />
            <span>↓ scroll</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
