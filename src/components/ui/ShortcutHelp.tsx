"use client";

import * as React from "react";
import { Kbd } from "./Kbd";
import { cn } from "@/lib/cn";

type Row =
  | { kind?: "row"; keys: React.ReactNode[]; label: string }
  | { kind: "heading"; label: string }
  | { kind: "egg"; keys: React.ReactNode[]; label: string; egg: "diag" | "matrix" | "warp" | "crash" | "glitch" | "crt" };

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
    kind: "egg" as const,
    egg: "diag" as const,
    keys: "diag".split("").map((c, i) => <Kbd key={`dg${i}`}>{c}</Kbd>),
    label: "diagnostic mode",
  },
  {
    kind: "egg" as const,
    egg: "glitch" as const,
    keys: "glitch".split("").map((c, i) => <Kbd key={`gl${i}`}>{c}</Kbd>),
    label: "glitch storm mode",
  },
  {
    kind: "egg" as const,
    egg: "crt" as const,
    keys: "crt".split("").map((c, i) => <Kbd key={`ct${i}`}>{c}</Kbd>),
    label: "crt mode",
  },
  {
    kind: "egg" as const,
    egg: "matrix" as const,
    keys: "matrix".split("").map((c, i) => <Kbd key={`m${i}`}>{c}</Kbd>),
    label: "matrix mode",
  },
  {
    kind: "egg" as const,
    egg: "warp" as const,
    keys: "warp".split("").map((c, i) => <Kbd key={`w${i}`}>{c}</Kbd>),
    label: "hyperspeed mode",
  },
  {
    kind: "egg" as const,
    egg: "crash" as const,
    keys: "crash".split("").map((c, i) => <Kbd key={`cr${i}`}>{c}</Kbd>),
    label: "bsod mode",
  },
];

export function ShortcutHelp({
  open,
  onClose,
  onToggleDiag,
  onShowMatrix,
  onWarp,
  onCrash,
  onGlitch,
  onToggleCRT,
}: {
  open: boolean;
  onClose: () => void;
  /** Called when the user taps the diagnostic-mode egg row (mobile). */
  onToggleDiag?: () => void;
  /** Called when the user taps the matrix-mode egg row (mobile). */
  onShowMatrix?: () => void;
  onWarp?: () => void;
  onCrash?: () => void;
  onGlitch?: () => void;
  onToggleCRT?: () => void;
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
          "relative max-w-xl w-full max-h-[90svh] overflow-y-auto",
          "border border-[rgb(var(--rule)/0.20)] bg-background",
          "p-4 sm:p-6 shadow-[0_8px_32px_rgb(0_0_0/0.10)]",
        )}
      >
        <div className="flex items-baseline justify-between mb-3 sm:mb-4">
          <h2
            id="shortcut-help-title"
            className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-[0.08em] text-muted"
          >
            {"// shortcuts"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-wider text-muted hover:text-foreground"
          >
            [esc] close
          </button>
        </div>

        <ul className="space-y-1.5 sm:space-y-2 text-[0.75rem] sm:text-[0.875rem]">
          {ROWS.map((row, i) => {
            if (row.kind === "heading") {
              return (
                <li
                  key={i}
                  className="pt-2.5 mt-1.5 sm:pt-3 sm:mt-2 border-t border-[rgb(var(--rule)/0.12)] text-[0.6rem] sm:text-[0.6875rem] uppercase tracking-[0.08em] text-muted"
                >
                  {row.label}
                </li>
              );
            }
            if (row.kind === "egg") {
              const handler =
                row.egg === "diag"   ? onToggleDiag :
                row.egg === "matrix" ? onShowMatrix  :
                row.egg === "warp"   ? onWarp        :
                row.egg === "crash"  ? onCrash       :
                row.egg === "glitch" ? onGlitch      :
                row.egg === "crt"    ? onToggleCRT   :
                undefined;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => { handler?.(); onClose(); }}
                    className={cn(
                      "w-full flex items-center justify-between gap-1.5 sm:gap-3",
                      "rounded-[2px] px-1.5 sm:px-2 py-0.5 sm:py-1 -mx-1.5 sm:-mx-2",
                      "text-left transition-colors duration-[var(--dur-base)]",
                      "hover:bg-[rgb(var(--accent)/0.08)] hover:text-[rgb(var(--accent))]",
                      "active:bg-[rgb(var(--accent)/0.15)]",
                      handler ? "cursor-pointer" : "cursor-default opacity-50",
                    )}
                    disabled={!handler}
                    aria-label={`Activate ${row.label}`}
                  >
                    <span className="text-foreground shrink-0">{row.label}</span>
                    <span className={cn(
                      "flex flex-wrap items-center justify-end",
                      "gap-0.5 sm:gap-1",
                      // Shrink Kbd chips on mobile so long sequences (e.g. "glitch") stay single-line
                      "[&_kbd]:min-w-[1.1rem] [&_kbd]:px-[0.2rem] [&_kbd]:text-[0.5rem]",
                      "sm:[&_kbd]:min-w-[1.4rem] sm:[&_kbd]:px-1.5 sm:[&_kbd]:text-[0.6875rem]",
                    )}>
                      {row.keys}
                    </span>
                  </button>
                </li>
              );
            }
            return (
              <li key={i} className="flex items-center justify-between gap-2 sm:gap-3">
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
