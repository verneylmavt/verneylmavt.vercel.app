"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { EducationItem } from "@/content/site";
import { KeyValue } from "@/components/ui/KeyValue";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/cn";

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
  const hasDescription = !!item.description?.trim();

  return (
    <li>
      <div className="grid gap-y-3 md:grid-cols-[2.5rem_1fr_1.25rem] md:gap-x-3 items-start">
        {/* Index with brackets — matches Work */}
        <span className="text-[0.75rem] tabular-nums whitespace-nowrap pt-0.5">
          <span className="text-[rgb(var(--accent))]">[</span>
          <span className="text-muted-soft">{padIndex(index + 1)}</span>
          <span className="text-[rgb(var(--accent))]">]</span>
        </span>

        {/* Spec block (always visible) */}
        <div className="flex flex-col gap-2 min-w-0">
          <KeyValue
            k="institution"
            v={item.institution}
            valueClassName="whitespace-nowrap overflow-hidden text-ellipsis"
          />
          <KeyValue k="degree" v={item.title} />
          <KeyValue k="period" v={`${item.start} — ${item.end}`} />

          {/* Description — hidden by default, revealed via chevron */}
          <AnimatePresence initial={false}>
            {open && hasDescription ? (
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
                <p className="mt-2 text-[0.9375rem] leading-[1.6] text-muted-soft max-w-3xl">
                  <span className="text-muted-soft/70" aria-hidden="true">
                    {"/* "}
                  </span>
                  {item.description}
                  <span className="text-muted-soft/70" aria-hidden="true">
                    {" */"}
                  </span>
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Chevron toggle — only when there's a description to expand */}
        {hasDescription ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            aria-label={open ? "Hide description" : "Show description"}
            className={cn(
              "justify-self-end text-[0.75rem] text-muted hover:text-foreground",
              "transition-transform duration-[var(--dur-base)] pt-1",
              open ? "rotate-90" : "",
            )}
          >
            ▸
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </li>
  );
}
