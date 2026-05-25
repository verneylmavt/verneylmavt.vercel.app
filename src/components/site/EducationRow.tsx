"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { EducationItem } from "@/content/site";
import { DotLeader } from "@/components/ui/DotLeader";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Header grid layout mirrors ExperienceRow:
 *  - mobile (default): 3 cols
 *      [idx institution chev]
 *      [.   title       title]
 *      [.   year        year]
 *  - md+: single row, 5 cols
 *      [idx institution title year chev]
 */
const HEADER_GRID = cn(
  "grid items-baseline gap-y-1 gap-x-3 pt-4",
  "grid-cols-[2.5rem_1fr_1.25rem]",
  "[grid-template-areas:'idx_institution_chev'_'._title_title'_'._year_year']",
  "md:grid-cols-[2.5rem_auto_minmax(0,1fr)_7rem_1.25rem]",
  "md:[grid-template-areas:'idx_institution_title_year_chev']",
);
const BODY_COLS = "grid-cols-[2.5rem_1fr] gap-x-3";

export function EducationRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: EducationItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const id = `edu-${index}`;

  return (
    <li className="border-b border-[rgb(var(--rule)/0.10)]">
      {/* ── Header row — responsive grid via grid-template-areas ── */}
      <div className={HEADER_GRID}>
        {/* Index */}
        <span
          style={{ gridArea: "idx" }}
          className="text-[0.75rem] tabular-nums whitespace-nowrap"
        >
          <span className="text-[rgb(var(--accent))]">[</span>
          <span className="text-muted-soft">{padIndex(index + 1)}</span>
          <span className="text-[rgb(var(--accent))]">]</span>
        </span>

        {/* Institution link + ↗ + • bullet (bullet only on md+) */}
        <span
          style={{ gridArea: "institution" }}
          className="inline-flex items-baseline gap-1.5 uppercase tracking-[0.03em] text-[0.85rem] md:text-[0.9rem] min-w-0"
        >
          {item.institutionUrl ? (
            <a
              href={item.institutionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-baseline gap-1 text-foreground",
                "transition-colors duration-[var(--dur-base)]",
                "hover:text-[rgb(var(--accent))]",
              )}
            >
              <span className="truncate">{item.institution}</span>
              <span aria-hidden="true" className="text-[0.6875rem] shrink-0">
                ↗
              </span>
            </a>
          ) : (
            <span className="text-foreground truncate">{item.institution}</span>
          )}
          <span
            aria-hidden="true"
            className="hidden md:inline text-muted-soft mx-1"
          >
            •
          </span>
        </span>

        {/* Title + dotted fill */}
        <span
          style={{ gridArea: "title" }}
          className="flex items-baseline gap-3 min-w-0"
        >
          <span className="text-[0.8125rem] text-muted truncate md:text-[0.85rem]">
            {item.title}
          </span>
          <DotLeader className="hidden md:block" />
        </span>

        {/* Year range */}
        <span
          style={{ gridArea: "year" }}
          className="text-[0.75rem] text-muted-soft tabular-nums whitespace-nowrap md:text-right"
        >
          {item.start} — {item.end}
        </span>

        {/* Chevron */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          aria-label={open ? "Hide details" : "Show details"}
          style={{ gridArea: "chev" }}
          className={cn(
            "justify-self-end text-[0.75rem] text-muted hover:text-foreground",
            "transition-transform duration-[var(--dur-base)]",
            open ? "rotate-90" : "",
          )}
        >
          ▸
        </button>
      </div>

      {/* Location — always visible beneath header */}
      {item.location ? (
        <div className={cn("grid pt-2", BODY_COLS)}>
          <div aria-hidden="true" />
          <p className="text-[0.7rem] uppercase tracking-[0.04em] text-muted-soft md:text-[0.75rem]">
            {item.location}
          </p>
        </div>
      ) : null}

      {/* Expandable: description */}
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.22, ease: [0.2, 0, 0.13, 1] }
            }
            className="overflow-hidden"
          >
            <div className={cn("grid pt-3 pb-6", BODY_COLS)}>
              <div aria-hidden="true" />
              <div className="flex flex-col gap-3 max-w-3xl">
                {item.description ? (
                  <p className="text-[0.75rem] leading-[1.6] text-muted md:text-[0.8rem]">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Bottom padding when collapsed */}
      {!open ? <div className="pb-4" /> : null}
    </li>
  );
}
