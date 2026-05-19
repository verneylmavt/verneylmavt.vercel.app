"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_/#$%@&".split("");

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "X";
}

type Props = {
  text: string;
  /** Total scramble duration in ms (default 600). */
  duration?: number;
  /** If true, scramble plays automatically on mount once. Default false. */
  playOnMount?: boolean;
  /** Inherits parent hover by default; pass true to bind to own hover. */
  bindOwnHover?: boolean;
  className?: string;
}

/**
 * Renders text that scrambles to random glyphs and resolves back, character
 * by character (left → right cascade). Triggered by `playOnMount`, or by
 * parent hover/focus when used inside a `.group-scramble` element.
 *
 * Each scrambled char tints accent until resolved.
 */
export function ScrambleText({
  text,
  duration = 600,
  playOnMount = false,
  bindOwnHover = false,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = React.useState(text);
  const [scrambling, setScrambling] = React.useState<boolean[]>(() =>
    Array.from({ length: text.length }, () => false),
  );
  const animatingRef = React.useRef(false);

  const run = React.useCallback(() => {
    if (reducedMotion || animatingRef.current) return;
    animatingRef.current = true;

    const start = performance.now();
    const len = text.length;
    // Each char resolves at a time within [duration*0.3, duration]
    const resolveAt = Array.from(
      { length: len },
      (_, i) => (i / Math.max(1, len)) * duration * 0.7 + duration * 0.3,
    );

    const initialFlags = Array.from({ length: len }, (_, i) =>
      text[i] === " " ? false : true,
    );
    setScrambling(initialFlags);

    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const next = text.split("");
      const flags: boolean[] = [];
      for (let i = 0; i < len; i++) {
        const ch = text[i] ?? "";
        if (ch === " ") {
          flags.push(false);
          next[i] = " ";
          continue;
        }
        if (elapsed >= resolveAt[i]) {
          flags.push(false);
          next[i] = ch;
        } else {
          flags.push(true);
          next[i] = randomGlyph();
        }
      }
      setDisplayed(next.join(""));
      setScrambling(flags);

      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
        setScrambling(Array.from({ length: len }, () => false));
        animatingRef.current = false;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, reducedMotion]);

  // Play on mount
  React.useEffect(() => {
    if (playOnMount) {
      const id = requestAnimationFrame(() => run());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [playOnMount, run]);

  // Render each character in its own span so we can color the scrambled ones.
  return (
    <span
      className={cn("inline-block", className)}
      onMouseEnter={bindOwnHover ? run : undefined}
      onFocus={bindOwnHover ? run : undefined}
      aria-label={text}
    >
      {displayed.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(scrambling[i] ? "text-[rgb(var(--accent))]" : "")}
        >
          {c}
        </span>
      ))}
      {/* Hidden run trigger for parent hover wiring (consumer can call ref.current.run() ideally; for simplicity expose via window event) */}
      <ScrambleRunBridge run={run} />
    </span>
  );
}

/**
 * Tiny child that listens for a window CustomEvent "scramble:run" and triggers
 * the scramble. Lets a parent button/h1 fire all scramble children at once.
 */
function ScrambleRunBridge({ run }: { run: () => void }) {
  React.useEffect(() => {
    const handler = () => run();
    window.addEventListener("scramble:run", handler);
    return () => window.removeEventListener("scramble:run", handler);
  }, [run]);
  return null;
}

/** Helper consumers can call to fire all ScrambleText instances. */
export function fireScramble() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("scramble:run"));
}
