"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { WorkExperienceItem } from "@/content/site";
import { DotLeader } from "@/components/ui/DotLeader";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/cn";

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
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className={cn(
          "group w-full flex items-baseline gap-3 py-4 text-left",
          "transition-colors duration-[var(--dur-base)]",
          "hover:text-foreground",
        )}
      >
        <span className="text-muted-soft text-[0.75rem] tabular-nums w-8 shrink-0">
          [{padIndex(index + 1)}]
        </span>

        <span className={cn(
          "uppercase tracking-[0.03em] text-[0.9375rem] md:text-[1rem]",
          "transition-transform duration-[var(--dur-base)]",
          "group-hover:translate-x-[0.15em]",
        )}>
          <span aria-hidden="true" className="hidden group-hover:inline text-[rgb(var(--accent))]">+ </span>
          {item.company}
        </span>

        <DotLeader />

        <span className="hidden sm:inline text-[0.8125rem] text-muted">
          {item.title.toLowerCase()}
        </span>

        <DotLeader className="hidden sm:block" />

        <span className="text-[0.75rem] text-muted-soft tabular-nums whitespace-nowrap">
          {item.start} — {item.end}
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "ml-2 text-[0.75rem] text-muted transition-transform duration-[var(--dur-base)]",
            open ? "rotate-90" : "",
          )}
        >
          ▸
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? { height: "auto", opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.22, ease: [0.2, 0, 0.13, 1] }
            }
            className="overflow-hidden"
          >
            <div className="pl-11 pr-4 pb-6 grid gap-3 md:grid-cols-12">
              <div className="md:col-span-4">
                {item.location ? (
                  <p className="text-[0.75rem] uppercase tracking-[0.04em] text-muted-soft mb-1">
                    {item.location}
                  </p>
                ) : null}
                <p className="text-[0.875rem] text-foreground">
                  {item.title}
                </p>
                {item.companyUrl ? (
                  <a
                    href={item.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[0.75rem] text-muted hover:text-[rgb(var(--accent))]"
                  >
                    <span>{item.companyUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>

              <div className="md:col-span-8">
                <p className="text-[0.9375rem] leading-[1.6] text-muted">
                  {item.summary}
                </p>
                {item.highlights?.length ? (
                  <ul className="mt-4 grid gap-1.5 list-none">
                    {item.highlights.map((h, j) => (
                      <li key={j} className="text-[0.875rem] text-muted">
                        <span aria-hidden="true" className="text-[rgb(var(--accent))] mr-2">
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
