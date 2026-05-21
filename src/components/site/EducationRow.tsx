"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { EducationItem } from "@/content/site";
import { DotLeader } from "@/components/ui/DotLeader";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/cn";

function EducationKeyValue({
  k,
  v,
  valueClassName,
}: {
  k: string;
  v: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[7rem_minmax(2rem,1fr)_minmax(0,1fr)] items-baseline gap-3 text-sm lg:grid-cols-[7.5rem_minmax(3rem,1fr)_minmax(26rem,34rem)] xl:grid-cols-[7.5rem_minmax(4rem,1fr)_36rem]">
      <span className="shrink-0 text-[0.75rem] uppercase tracking-[0.05em] text-muted">
        {k}
      </span>
      <DotLeader />
      <span
        className={cn("min-w-0 break-words text-left text-foreground", valueClassName)}
      >
        {v}
      </span>
    </div>
  );
}

function DescriptionPanel({
  id,
  item,
  reduced,
}: {
  id: string;
  item: EducationItem;
  reduced: boolean | null;
}) {
  return (
    <motion.div
      id={id}
      key={id}
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
      <p className="mt-3 max-w-3xl text-[0.8125rem] leading-[1.6] text-muted-soft md:text-[0.9375rem]">
        <span className="text-muted-soft/70" aria-hidden="true">
          {"/* "}
        </span>
        {item.description}
        <span className="text-muted-soft/70" aria-hidden="true">
          {" */"}
        </span>
      </p>
    </motion.div>
  );
}

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
  const mobilePanelId = `${id}-mobile-panel`;
  const desktopPanelId = `${id}-panel`;
  const hasDescription = !!item.description?.trim();
  const period = `${item.start} - ${item.end}`;

  return (
    <li>
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.75rem] tabular-nums whitespace-nowrap">
            <span className="text-[rgb(var(--accent))]">[</span>
            <span className="text-muted-soft">{padIndex(index + 1)}</span>
            <span className="text-[rgb(var(--accent))]">]</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[0.75rem] tabular-nums text-muted-soft">
              {period}
            </span>
            {hasDescription ? (
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={mobilePanelId}
                aria-label={open ? "Hide description" : "Show description"}
                className={cn(
                  "text-[0.75rem] text-muted transition-transform duration-[var(--dur-base)] hover:text-foreground",
                  open ? "rotate-90" : "",
                )}
              >
                ▶
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <div>
            <p className="mb-1 text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft">
              institution
            </p>
            <h3 className="text-[0.9375rem] leading-[1.45] text-foreground">
              {item.institution}
            </h3>
          </div>
          <div>
            <p className="mb-1 text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft">
              degree
            </p>
            <p className="text-[0.875rem] leading-[1.5] text-foreground">
              {item.title}
            </p>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && hasDescription ? (
            <DescriptionPanel id={mobilePanelId} item={item} reduced={reduced} />
          ) : null}
        </AnimatePresence>
      </div>

      <div className="hidden items-start gap-y-3 md:grid md:grid-cols-[2.5rem_1fr_1.25rem] md:gap-x-3">
        <span className="text-[0.75rem] tabular-nums whitespace-nowrap pt-0.5">
          <span className="text-[rgb(var(--accent))]">[</span>
          <span className="text-muted-soft">{padIndex(index + 1)}</span>
          <span className="text-[rgb(var(--accent))]">]</span>
        </span>

        <div className="flex min-w-0 flex-col gap-2">
          <EducationKeyValue
            k="institution"
            v={item.institution}
            valueClassName="md:whitespace-nowrap md:overflow-hidden md:text-ellipsis"
          />
          <EducationKeyValue k="degree" v={item.title} />
          <EducationKeyValue k="period" v={period} />

          <AnimatePresence initial={false}>
            {open && hasDescription ? (
              <DescriptionPanel id={desktopPanelId} item={item} reduced={reduced} />
            ) : null}
          </AnimatePresence>
        </div>

        {hasDescription ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={desktopPanelId}
            aria-label={open ? "Hide description" : "Show description"}
            className={cn(
              "justify-self-end text-[0.75rem] text-muted hover:text-foreground",
              "transition-transform duration-[var(--dur-base)] pt-1",
              open ? "rotate-90" : "",
            )}
          >
            ▶
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </li>
  );
}
