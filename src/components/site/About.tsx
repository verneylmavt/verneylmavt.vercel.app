"use client";

import * as React from "react";
import { FileCode2, Quote } from "lucide-react";
import type { SiteContent } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { ScrambleText } from "@/components/ui/ScrambleText";

export function About({ site }: { site: SiteContent }) {
  const paragraph = site.about.paragraph;
  const lineNumberClass = "text-center text-[0.7rem] leading-none text-muted-soft";
  const missionColors = React.useMemo(() => {
    const colors: Array<"accent" | "foreground"> = Array.from(
      { length: paragraph.length },
      () => "foreground",
    );

    for (const phrase of ["cloud-native", "data-driven"]) {
      const start = paragraph.toLowerCase().indexOf(phrase);
      if (start < 0) continue;
      for (let i = start; i < start + phrase.length; i++) {
        colors[i] = "accent";
      }
    }

    return colors;
  }, [paragraph]);

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-24 py-10 md:py-30"
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-12">
        <SectionHeading number={1} slug="about" title="About" />

        <div className="grid gap-12 pt-2.5 lg:grid-cols-[minmax(0,1.85fr)_minmax(20rem,1fr)] lg:items-start lg:gap-10 lg:pt-5 lg:[--about-row-height:clamp(1.875rem,3.75vw,3.5rem)] xl:gap-8">
          {/* Open editorial quote, with line numbers beside the text itself. */}
          <div className="min-w-0 border-l-2 border-[rgb(var(--accent))] pl-5 md:pl-7 lg:mt-px">
            <div className="relative sm:pl-5">
              <div className="border-l border-[rgb(var(--rule)/0.2)] pl-4 sm:pl-5">
                <div className="flex h-12 items-center md:h-14">
                  <Quote
                    data-about-quote
                    aria-hidden="true"
                    className="size-12 rotate-180 fill-[rgb(var(--accent))] text-[rgb(var(--accent))] md:size-14"
                    strokeWidth={0}
                  />
                </div>
                <blockquote className="relative pt-4 md:pt-6 lg:pt-[9px]">
                  <div
                    data-about-line-gutter
                    aria-hidden="true"
                    className="absolute top-4 right-full bottom-0 mr-[30px] hidden w-6 overflow-hidden text-[clamp(1.25rem,3vw,2.75rem)] sm:block md:top-6 md:mr-[34px] lg:top-[9px]"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="flex h-[1.35em] items-center justify-center lg:h-[var(--about-row-height)]">
                        <span className={lineNumberClass}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p
                    data-about-mission
                    className="max-w-[41rem] text-[clamp(1.25rem,3vw,2.75rem)] leading-[1.35] tracking-[-0.04em] text-foreground lg:leading-[var(--about-row-height)]"
                  >
                    <ScrambleText
                      text={paragraph}
                      charColors={missionColors}
                      duration={1400}
                      playOnMount
                      autoGlitch
                    />
                  </p>
                </blockquote>
              </div>
            </div>
          </div>

          {/* A single editor panel for the focus configuration. */}
          <div className="min-w-0">
            <div className="min-w-0 border border-[rgb(var(--rule)/0.18)] bg-[rgb(var(--surface)/0.28)]">
              <div className="border-b border-[rgb(var(--rule)/0.18)]">
                <div
                  data-about-editor-tab
                  className="inline-flex h-12 items-center gap-2.5 border-r border-b-2 border-r-[rgb(var(--rule)/0.18)] border-b-[rgb(var(--accent))] px-4 text-[0.8125rem] text-foreground md:h-14 md:px-6 md:text-base"
                >
                  <FileCode2 aria-hidden="true" className="size-4 text-muted" strokeWidth={1.5} />
                  <span>focus.toml</span>
                </div>
              </div>
              <div className="relative pr-4 pt-4 pb-2 sm:pr-6 md:pt-6 lg:pt-2 xl:pr-7">
                <div data-about-focus-rule aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-10 border-l border-[rgb(var(--rule)/0.16)] sm:left-12 xl:left-13" />
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-y-4 text-[0.75rem] sm:grid-cols-[3rem_minmax(0,1fr)] sm:text-[0.8125rem] md:gap-y-6 lg:auto-rows-[var(--about-row-height)] lg:gap-y-0 xl:grid-cols-[3.25rem_minmax(0,1fr)] xl:text-base">
                  {site.about.focus.map((f, i) => {
                    const key = f.label.toLowerCase().replace(/\s+/g, "_");
                    return (
                      <React.Fragment key={f.label}>
                        <span aria-hidden="true" className={`flex items-center justify-center self-center ${lineNumberClass}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="flex min-w-0 items-center justify-between gap-2 pl-3 text-foreground sm:pl-5">
                          <span>{key}</span>
                          <span className="shrink-0">
                            <span className="text-muted-soft">= </span>
                            <span className="text-[rgb(var(--accent))]">true</span>
                          </span>
                        </p>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
