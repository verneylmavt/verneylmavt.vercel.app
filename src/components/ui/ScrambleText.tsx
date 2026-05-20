"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_/#$%@&".split("");

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "X";
}

type RunOpts = {
  /** Override duration for this run. */
  duration?: number;
  /** If set, only scramble this many random chars instead of the full word. */
  partial?: number;
};

type Props = {
  text: string;
  /** Default scramble duration (ms). Used for full scrambles. */
  duration?: number;
  /** If true, play once on mount. */
  playOnMount?: boolean;
  /** If true, bind run() to this element's own hover/focus. */
  bindOwnHover?: boolean;
  /**
   * Periodic glitch: scramble a few random chars every ~`autoGlitchInterval` ms.
   * Pauses when the document is hidden or under reduced-motion.
   */
  autoGlitch?: boolean;
  /** Average interval between auto-glitches (ms). Default 7000. */
  autoGlitchInterval?: number;
  /** Random jitter applied to interval (ms). Default 2000. */
  autoGlitchJitter?: number;
  /** Chars to scramble in auto-glitch mode. Default 3. */
  autoGlitchPartial?: number;
  className?: string;
};

/**
 * Renders text that scrambles to random glyphs and resolves back. Supports:
 *  - Full scrambles (left-to-right cascade) via `run()` / `playOnMount` / window event
 *  - Partial scrambles (a few random chars only) for glitchy autoGlitch mode
 *
 * Scrambled chars tint accent until resolved.
 */
export function ScrambleText({
  text,
  duration: defaultDuration = 600,
  playOnMount = false,
  bindOwnHover = false,
  autoGlitch = false,
  autoGlitchInterval = 7000,
  autoGlitchJitter = 2000,
  autoGlitchPartial = 3,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = React.useState(text);
  const [scrambling, setScrambling] = React.useState<boolean[]>(() =>
    Array.from({ length: text.length }, () => false),
  );
  const animatingRef = React.useRef(false);
  // Track the in-flight rAF id so we can cancel it on unmount.
  const rafRef = React.useRef<number>(0);

  const run = React.useCallback(
    (opts: RunOpts = {}) => {
      if (reducedMotion || animatingRef.current) return;
      animatingRef.current = true;

      const duration = opts.duration ?? defaultDuration;
      const partial = opts.partial;

      const start = performance.now();
      const len = text.length;

      // Pick the set of indices that will be scrambled
      const indices = new Set<number>();
      if (partial == null) {
        for (let i = 0; i < len; i++) {
          if (text[i] !== " ") indices.add(i);
        }
      } else {
        const candidates: number[] = [];
        for (let i = 0; i < len; i++) {
          if (text[i] !== " ") candidates.push(i);
        }
        // Shuffle candidates and take `partial`
        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }
        const take = Math.min(partial, candidates.length);
        for (let i = 0; i < take; i++) indices.add(candidates[i]);
      }

      // Per-index resolve time
      const resolveAt: number[] = new Array(len).fill(0);
      if (partial == null) {
        for (let i = 0; i < len; i++) {
          resolveAt[i] =
            (i / Math.max(1, len)) * duration * 0.7 + duration * 0.3;
        }
      } else {
        // For partial mode, all picked chars resolve at the same point
        const r = duration;
        for (let i = 0; i < len; i++) resolveAt[i] = r;
      }

      const initialFlags = Array.from({ length: len }, (_, i) =>
        indices.has(i),
      );
      setScrambling(initialFlags);

      const tick = () => {
        const elapsed = performance.now() - start;
        const next = text.split("");
        const flags: boolean[] = [];
        for (let i = 0; i < len; i++) {
          const ch = text[i] ?? "";
          if (!indices.has(i)) {
            flags.push(false);
            next[i] = ch;
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
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayed(text);
          setScrambling(Array.from({ length: len }, () => false));
          animatingRef.current = false;
          rafRef.current = 0;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      };
    },
    [text, defaultDuration, reducedMotion],
  );

  // Play on mount
  React.useEffect(() => {
    if (!playOnMount) return;
    const id = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(id);
  }, [playOnMount, run]);

  // Unmount safety: cancel any in-flight scramble rAF so state updates don't
  // fire on a torn-down component (autoGlitch / fireScramble paths discard the
  // cleanup returned by run()).
  React.useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, []);

  // Auto-glitch: periodic partial scramble while page is visible
  React.useEffect(() => {
    if (!autoGlitch || reducedMotion) return;

    let timeout: number | null = null;

    const schedule = () => {
      const ms =
        autoGlitchInterval +
        (Math.random() * 2 - 1) * autoGlitchJitter;
      timeout = window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          run({ duration: 280, partial: autoGlitchPartial });
        }
        schedule();
      }, Math.max(500, ms));
    };

    schedule();
    return () => {
      if (timeout !== null) window.clearTimeout(timeout);
    };
  }, [
    autoGlitch,
    autoGlitchInterval,
    autoGlitchJitter,
    autoGlitchPartial,
    reducedMotion,
    run,
  ]);

  return (
    <span
      className={cn("inline-block", className)}
      onMouseEnter={bindOwnHover ? () => run() : undefined}
      onFocus={bindOwnHover ? () => run() : undefined}
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
      <ScrambleRunBridge run={run} />
    </span>
  );
}

function ScrambleRunBridge({ run }: { run: (opts?: RunOpts) => void }) {
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
