"use client";

import * as React from "react";
import { Kbd } from "./Kbd";
import { cn } from "@/lib/cn";

type Row =
  | { kind?: "row"; keys: React.ReactNode[]; label: string }
  | { kind: "heading"; label: string };

const ROWS: Row[] = [
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="h">h</Kbd>], label: "go home" },
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="a">a</Kbd>], label: "go to about" },
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="e">e</Kbd>], label: "go to education" },
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="w">w</Kbd>], label: "go to work" },
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="t">t</Kbd>], label: "go to tools" },
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="c">c</Kbd>], label: "go to certifications" },
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="p">p</Kbd>], label: "go to projects" },
  { keys: [<Kbd key="g">g</Kbd>, <Kbd key="x">x</Kbd>], label: "go to contact" },
  { keys: [<Kbd key="slash">/</Kbd>], label: "focus project search" },
  { keys: [<Kbd key="cmd">⌘</Kbd>, <Kbd key="k">K</Kbd>], label: "open command palette" },
  { keys: [<Kbd key="q">?</Kbd>], label: "toggle this help" },
  { keys: [<Kbd key="esc">esc</Kbd>], label: "close overlays" },
  { kind: "heading", label: "// easter eggs" },
  {
    keys: [
      <Kbd key="u1">↑</Kbd>,
      <Kbd key="u2">↑</Kbd>,
      <Kbd key="d1">↓</Kbd>,
      <Kbd key="d2">↓</Kbd>,
      <Kbd key="l1">←</Kbd>,
      <Kbd key="r1">→</Kbd>,
      <Kbd key="l2">←</Kbd>,
      <Kbd key="r2">→</Kbd>,
      <Kbd key="b">b</Kbd>,
      <Kbd key="a">a</Kbd>,
    ],
    label: "diagnostic mode",
  },
  {
    keys: "matrix".split("").map((c, i) => <Kbd key={`m${i}`}>{c}</Kbd>),
    label: "matrix mode",
  },
];

export function ShortcutHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  // Capture the element that had focus when opened, restore on close.
  React.useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      overlayRef.current?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus?.();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcut-help-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <button
        type="button"
        aria-label="Close shortcut help"
        onClick={onClose}
        className="absolute inset-0 bg-[rgb(var(--background)/0.85)] backdrop-blur-sm"
      />
      <div
        ref={overlayRef}
        tabIndex={-1}
        className={cn(
          "relative max-w-xl w-full",
          "border border-[rgb(var(--rule)/0.20)] bg-background",
          "p-6 shadow-[0_8px_32px_rgb(0_0_0/0.10)]",
        )}
      >
        <div className="flex items-baseline justify-between mb-4">
          <h2
            id="shortcut-help-title"
            className="text-[0.75rem] uppercase tracking-[0.08em] text-muted"
          >
            {"// shortcuts"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[0.75rem] uppercase tracking-wider text-muted hover:text-foreground"
          >
            [esc] close
          </button>
        </div>

        <ul className="space-y-2 text-[0.875rem]">
          {ROWS.map((row, i) => {
            if (row.kind === "heading") {
              return (
                <li
                  key={i}
                  className="pt-3 mt-2 border-t border-[rgb(var(--rule)/0.12)] text-[0.6875rem] uppercase tracking-[0.08em] text-muted"
                >
                  {row.label}
                </li>
              );
            }
            return (
              <li key={i} className="flex items-center justify-between gap-3">
                <span className="text-foreground">{row.label}</span>
                <span className="flex flex-wrap items-center gap-1 justify-end">
                  {row.keys}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
