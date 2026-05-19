"use client";

import * as React from "react";

/**
 * Global keyboard shortcuts. Listens at the window level and ignores events
 * that originate from text inputs / textareas / contentEditable.
 *
 * Supported in v3:
 *   g h / g a / g e / g w / g t / g c / g p / g x  -> jump to section
 *   /                                                -> focus #project-search
 *   ?                                                -> open shortcut help
 *   Esc                                              -> close overlays
 *   meta+k / ctrl+k                                  -> open command palette
 *
 * Returns nothing; callers wire side effects via the provided callbacks.
 */
export type ShortcutHandlers = {
  onJumpSection?: (sectionId: string) => void;
  onFocusSearch?: () => void;
  onOpenHelp?: () => void;
  onCloseOverlays?: () => void;
  onOpenCommandPalette?: () => void;
};

const SECTION_KEY_MAP: Record<string, string> = {
  h: "top",
  a: "about",
  e: "education",
  w: "experience",
  t: "tools",
  c: "certifications",
  p: "projects",
  x: "contact",
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useGlobalShortcuts(handlers: ShortcutHandlers): void {
  const handlersRef = React.useRef(handlers);
  React.useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  React.useEffect(() => {
    let waitingForSecond = false;
    let waitTimer: number | null = null;

    const clearWait = () => {
      waitingForSecond = false;
      if (waitTimer) {
        window.clearTimeout(waitTimer);
        waitTimer = null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const h = handlersRef.current;

      // cmd-k / ctrl-k — works even in inputs
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        h.onOpenCommandPalette?.();
        return;
      }

      // Esc — close overlays (always available)
      if (e.key === "Escape") {
        h.onCloseOverlays?.();
        return;
      }

      // Skip everything else when in an editable field
      if (isEditableTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;

      // `/` — focus search (Shift+/ is `?` so check explicitly)
      if (key === "/" && !e.shiftKey) {
        e.preventDefault();
        h.onFocusSearch?.();
        return;
      }

      // `?` — open help overlay
      if (key === "?" || (key === "/" && e.shiftKey)) {
        e.preventDefault();
        h.onOpenHelp?.();
        return;
      }

      // Two-key `g <x>` sequence
      if (waitingForSecond) {
        const target = SECTION_KEY_MAP[key.toLowerCase()];
        clearWait();
        if (target) {
          e.preventDefault();
          h.onJumpSection?.(target);
        }
        return;
      }

      if (key.toLowerCase() === "g") {
        waitingForSecond = true;
        waitTimer = window.setTimeout(clearWait, 900);
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearWait();
    };
  }, []);
}
