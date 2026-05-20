"use client";

import * as React from "react";

/**
 * Listens for a literal sequence of keystrokes (e.g. "matrix") at the window
 * level and fires `onMatch` when complete. Mismatches reset progress; if the
 * mismatched key matches the first character of the sequence, progress resets
 * to 1.
 *
 * Ignores keystrokes that originate inside editable elements
 * (<input>, <textarea>, [contenteditable]).
 */
export function useTypedSequence(sequence: string, onMatch: () => void): void {
  const cbRef = React.useRef(onMatch);
  React.useEffect(() => {
    cbRef.current = onMatch;
  }, [onMatch]);

  React.useEffect(() => {
    if (!sequence) return;
    const target = sequence.toLowerCase();
    let index = 0;
    let lastTs = 0;
    const MAX_GAP_MS = 1200; // reset if gap between keys is too long

    const isEditable = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if (el.isContentEditable) return true;
      return false;
    };

    const onKey = (e: KeyboardEvent) => {
      // Ignore non-printable / modifier keys for letter sequence
      if (e.key.length !== 1) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditable(e.target)) return;

      const now = performance.now();
      if (now - lastTs > MAX_GAP_MS) index = 0;
      lastTs = now;

      const expected = target[index];
      const actual = e.key.toLowerCase();
      if (actual === expected) {
        index += 1;
        if (index >= target.length) {
          index = 0;
          cbRef.current();
        }
      } else {
        // Restart if the key matches the first char of the sequence
        index = actual === target[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sequence]);
}
