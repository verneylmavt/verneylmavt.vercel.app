"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { WorkExperienceItem } from "@/content/site";
import { DotLeader } from "@/components/ui/DotLeader";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/cn";

const HEADER_COLS =
  "md:grid-cols-[2.5rem_auto_minmax(0,1fr)_7rem_1.25rem]";
const BODY_COLS = "md:grid-cols-[2.5rem_1fr] md:gap-x-3";

export function ExperienceRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: WorkExperienceItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const id = `exp-${index}`;

  return (
    <li className="border-b border-[rgb(var(--rule)/0.10)]">
      {/* ── Header row — 5-col grid; company hugs widest, titles align ── */}
      <div className={cn("grid items-baseline gap-y-2 gap-x-3 pt-4", HEADER_COLS)}>
        {/* Index */}
        <span className="text-[0.75rem] tabular-nums whitespace-nowrap">
          <span className="text-[rgb(var(--accent))]">[</span>
          <span className="text-muted-soft">{padIndex(index + 1)}</span>
          <span className="text-[rgb(var(--accent))]">]</span>
        </span>

        {/* Company link + ↗ + • bullet — hugs content; widest sets the column */}
        <span className="inline-flex items-baseline gap-1.5 uppercase tracking-[0.03em] text-[0.9375rem] md:text-[1rem]">
          {item.companyUrl ? (
            <a
              href={item.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-baseline gap-1 text-foreground",
                "transition-colors duration-[var(--dur-base)]",
                "hover:text-[rgb(var(--accent))]",
              )}
            >
              <span>{item.company}</span>
              <span aria-hidden="true" className="text-[0.6875rem]">↗</span>
            </a>
          ) : (
            <span className="text-foreground">{item.company}</span>
          )}
          <span aria-hidden="true" className="text-muted-soft mx-1">•</span>
        </span>

        {/* Title + dotted fill — titles all start at the same column position */}
        <span className="flex items-baseline gap-3 min-w-0">
          <span className="text-[0.8125rem] text-muted truncate">
            {item.title.toLowerCase()}
          </span>
          <DotLeader />
        </span>

        {/* Year range */}
        <span className="text-[0.75rem] text-muted-soft tabular-nums whitespace-nowrap text-right">
          {item.start} — {item.end}
        </span>

        {/* Chevron */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          aria-label={open ? "Hide details" : "Show details"}
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
          <div className="hidden md:block" />
          <p className="text-[0.75rem] uppercase tracking-[0.04em] text-muted-soft">
            {item.location}
          </p>
        </div>
      ) : null}

      {/* Expandable: summary + optional highlights */}
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
              <div className="hidden md:block" />
              <div className="flex flex-col gap-3 max-w-3xl">
                <p className="text-[0.875rem] leading-[1.6] text-muted">
                  {item.summary}
                </p>
                {item.highlights?.length ? (
                  <ul className="grid gap-1.5 list-none">
                    {item.highlights.map((h, j) => (
                      <li key={j} className="text-[0.875rem] text-muted">
                        <span
                          aria-hidden="true"
                          className="text-[rgb(var(--accent))] mr-2"
                        >
                          +
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Bottom padding when collapsed (no expand) */}
      {!open ? <div className="pb-4" /> : null}
    </li>
  );
}
