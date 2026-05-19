"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { WorkExperienceItem } from "@/content/site";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/cn";

const HEADER_COLS =
  "md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_8rem_1.25rem]";
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
  const hasExpandable = !!item.location || !!item.highlights?.length;

  return (
    <li className="border-b border-[rgb(var(--rule)/0.10)]">
      {/* ── Header row — strict 5-col grid so titles align across all rows ── */}
      <div
        className={cn(
          "grid items-baseline gap-y-2 gap-x-3 pt-4",
          HEADER_COLS,
        )}
      >
        {/* Index */}
        <span className="text-[0.75rem] tabular-nums whitespace-nowrap">
          <span className="text-[rgb(var(--accent))]">[</span>
          <span className="text-muted-soft">{padIndex(index + 1)}</span>
          <span className="text-[rgb(var(--accent))]">]</span>
        </span>

        {/* Company — clickable when companyUrl present */}
        <span className="uppercase tracking-[0.03em] text-[0.9375rem] md:text-[1rem] min-w-0">
          {item.companyUrl ? (
            <a
              href={item.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-baseline gap-1.5 text-foreground",
                "transition-colors duration-[var(--dur-base)]",
                "hover:text-[rgb(var(--accent))]",
              )}
            >
              <span>{item.company}</span>
              <span
                aria-hidden="true"
                className="text-[0.6875rem] text-muted-soft group-hover:text-[rgb(var(--accent))]"
              >
                ↗
              </span>
            </a>
          ) : (
            <span className="text-foreground">{item.company}</span>
          )}
        </span>

        {/* Title — aligned to the same column for every row */}
        <span className="text-[0.8125rem] text-muted min-w-0 truncate">
          {item.title.toLowerCase()}
        </span>

        {/* Year range */}
        <span className="text-[0.75rem] text-muted-soft tabular-nums whitespace-nowrap text-right md:text-right">
          {item.start} — {item.end}
        </span>

        {/* Chevron toggle — only when there's content to expand */}
        {hasExpandable ? (
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
        ) : (
          <span aria-hidden="true" />
        )}
      </div>

      {/* Summary — always visible, aligned under company column */}
      <div className={cn("grid pb-4 pt-2", BODY_COLS)}>
        <div className="hidden md:block" />
        <p className="text-[0.875rem] leading-[1.6] text-muted max-w-3xl">
          {item.summary}
        </p>
      </div>

      {/* Expandable: location + optional highlights */}
      <AnimatePresence initial={false}>
        {open && hasExpandable ? (
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
            <div className={cn("grid pb-6", BODY_COLS)}>
              <div className="hidden md:block" />
              <div className="flex flex-col gap-3">
                {item.location ? (
                  <p className="text-[0.75rem] uppercase tracking-[0.04em] text-muted-soft">
                    {item.location}
                  </p>
                ) : null}
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
    </li>
  );
}
