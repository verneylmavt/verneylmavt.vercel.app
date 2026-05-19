"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const STORAGE_KEY = "v3:booted";

type Line = {
  text: string;
  /** Optional accent-highlighted suffix appended at the very end of the line. */
  suffix?: string;
  /** Pause after this line completes typing (ms). */
  hold?: number;
};

function buildLines(themeLabel: string): Line[] {
  return [
    { text: "> mounting site/v3.0.0...", hold: 80 },
    { text: "> resolving sections [8/8]", suffix: " ok", hold: 80 },
    { text: `> theme = ${themeLabel}`, hold: 80 },
    { text: "> shortcuts ⌘k · / · ? loaded", hold: 80 },
    { text: "> ready", suffix: ".", hold: 220 },
  ];
}

/**
 * First-paint boot sequence. Renders a fixed overlay with a typewriter feed
 * of mock log lines, then fades out and unmounts. Once per session.
 *
 * Skipped entirely under prefers-reduced-motion.
 */
export function BootSequence() {
  const reduced = useReducedMotion();
  const { resolvedTheme, theme } = useTheme();
  // Initial state matches server (hidden). After mount, we check conditions
  // and conditionally enable. This avoids a server/client hydration mismatch.
  const [visible, setVisible] = React.useState<boolean>(false);
  const [lineIdx, setLineIdx] = React.useState(0);
  const [charIdx, setCharIdx] = React.useState(0);
  const [fading, setFading] = React.useState(false);

  // Post-mount: decide whether to actually play the boot sequence.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  const lines = React.useMemo(
    () => buildLines(theme === "system" ? `system (${resolvedTheme})` : resolvedTheme),
    [theme, resolvedTheme],
  );

  // Mark booted as soon as sequence is allowed to start (so refresh-mid-boot still gates).
  React.useEffect(() => {
    if (!visible) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }, [visible]);

  // Type the current line; advance to next; eventually trigger fade.
  React.useEffect(() => {
    if (!visible || reduced) return;
    if (lineIdx >= lines.length) {
      // All lines typed; start fade-out
      const id = window.setTimeout(() => setFading(true), 180);
      const id2 = window.setTimeout(() => setVisible(false), 180 + 240);
      return () => {
        window.clearTimeout(id);
        window.clearTimeout(id2);
      };
    }

    const current = lines[lineIdx];
    const full = current.text + (current.suffix ?? "");
    if (charIdx >= full.length) {
      const id = window.setTimeout(() => {
        setLineIdx((v) => v + 1);
        setCharIdx(0);
      }, current.hold ?? 80);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => setCharIdx((v) => v + 1), 22);
    return () => window.clearTimeout(id);
  }, [visible, reduced, lineIdx, charIdx, lines]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[60] bg-background flex items-end justify-start px-6 md:px-12 pb-20 md:pb-28 transition-opacity duration-[var(--dur-slow)] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="mx-auto w-full max-w-[88rem]">
        <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-muted-soft mb-3">
          {"// boot"}
        </p>
        <pre className="text-[0.875rem] md:text-[1rem] leading-[1.6] text-foreground font-mono whitespace-pre-wrap">
          {lines.slice(0, lineIdx).map((l, i) => (
            <BootLine key={i} line={l} full />
          ))}
          {lineIdx < lines.length ? (
            <BootLine line={lines[lineIdx]} chars={charIdx} />
          ) : null}
        </pre>
      </div>
    </div>
  );
}

function BootLine({
  line,
  full = false,
  chars,
}: {
  line: Line;
  full?: boolean;
  chars?: number;
}) {
  const text = line.text;
  const suffix = line.suffix ?? "";
  const total = text.length + suffix.length;
  const c = full ? total : Math.min(total, chars ?? 0);

  const textShown = text.slice(0, Math.min(c, text.length));
  const suffixShown = c > text.length ? suffix.slice(0, c - text.length) : "";

  // Color the leading `>` and the suffix in accent
  const promptIdx = textShown.indexOf(">");
  const beforePrompt = promptIdx >= 0 ? textShown.slice(0, promptIdx) : textShown;
  const promptChar = promptIdx >= 0 ? textShown[promptIdx] : "";
  const afterPrompt =
    promptIdx >= 0 ? textShown.slice(promptIdx + 1) : "";

  return (
    <span className="block">
      {beforePrompt}
      {promptChar ? (
        <span className="text-[rgb(var(--accent))]">{promptChar}</span>
      ) : null}
      {afterPrompt}
      {suffixShown ? (
        <span className="text-[rgb(var(--accent))]">{suffixShown}</span>
      ) : null}
      {"\n"}
    </span>
  );
}
