"use client";

import * as React from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/**
 * Listens at the window level for the Konami sequence and fires `onUnlock`
 * each time it completes. Mismatches reset progress.
 */
export function useKonami(onUnlock: () => void): void {
  const callbackRef = React.useRef(onUnlock);
  React.useEffect(() => {
    callbackRef.current = onUnlock;
  }, [onUnlock]);

  React.useEffect(() => {
    let index = 0;

    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[index];
      // Normalize letter keys to lowercase; arrow keys are matched as-is.
      const actual = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (actual === expected) {
        index += 1;
        if (index === KONAMI.length) {
          index = 0;
          callbackRef.current();
        }
      } else {
        // Allow restart if the key is the first in the sequence
        index = actual === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
