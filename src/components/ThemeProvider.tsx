"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { nextTheme, normalizeTheme, type ThemePreference } from "@/lib/theme-policy";
import { selectThemeEffect, themeTransitionSettings } from "@/lib/theme-transition";

export type { ThemePreference } from "@/lib/theme-policy";
export type ResolvedTheme = ThemePreference;

type ThemeContextValue = {
  theme: ThemePreference;
  /** Kept for existing consumers; the selected and applied themes are identical. */
  resolvedTheme: ResolvedTheme;
  setTheme: (next: ThemePreference) => void;
  cycleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "v3-theme";
const SWEEP_DURATION_MS = 300;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Match server markup. The boot script applies a saved light preference before paint.
  const [theme, setThemeState] = React.useState<ThemePreference>("dark");
  const currentTheme = React.useRef<ThemePreference>("dark");
  const [sweep, setSweep] = React.useState<{ id: number; target: ThemePreference } | null>(null);
  const [diff, setDiff] = React.useState<{ old: ThemePreference; next: ThemePreference } | null>(null);
  const sweepId = React.useRef(0);
  const sweepTimer = React.useRef<number | null>(null);
  const activeTransition = React.useRef<ViewTransition | null>(null);
  const requestId = React.useRef(0);
  const instantFrame = React.useRef<number | null>(null);

  React.useEffect(() => {
    // A document View Transition is above ordinary z-index layers, including BSOD.
    const cancelForBsod = () => activeTransition.current?.skipTransition();
    window.addEventListener("v3:bsod-open", cancelForBsod);
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null && stored !== "light" && stored !== "dark") {
        window.localStorage.setItem(STORAGE_KEY, "dark");
      }
    } catch {
      // Storage may be unavailable; the boot script already falls back to dark.
    }
    const restored = normalizeTheme(stored);
    currentTheme.current = restored;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(restored);
    document.documentElement.setAttribute("data-theme", restored);
    return () => {
      window.removeEventListener("v3:bsod-open", cancelForBsod);
      if (sweepTimer.current !== null) window.clearTimeout(sweepTimer.current);
      if (instantFrame.current !== null) window.cancelAnimationFrame(instantFrame.current);
      activeTransition.current?.skipTransition();
      document.documentElement.removeAttribute("data-theme-transition");
    };
  }, []);

  const setTheme = React.useCallback((next: ThemePreference) => {
    if (next === currentTheme.current) return;
    const previous = currentTheme.current;
    currentTheme.current = next;
    const id = ++requestId.current;
    activeTransition.current?.skipTransition();
    activeTransition.current = null;
    if (instantFrame.current !== null) window.cancelAnimationFrame(instantFrame.current);
    if (sweepTimer.current !== null) window.clearTimeout(sweepTimer.current);
    flushSync(() => {
      setSweep(null);
      setDiff(null);
    });

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep the in-memory choice when storage is unavailable.
    }

    const effect = selectThemeEffect(previous, next, {
      activeEffect: themeTransitionSettings.activeEffect,
      supportsViewTransition: typeof document.startViewTransition === "function",
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      bsodVisible: document.querySelector("[data-bsod-active]") !== null,
    });

    const applyTheme = () => {
      document.documentElement.setAttribute("data-theme", next);
      setThemeState(next);
    };

    if (effect === "none" || document.documentElement.getAttribute("data-theme") === next) {
      // Two frames keep regular color transitions disabled through the first paint.
      document.documentElement.setAttribute("data-theme-transition", "instant");
      applyTheme();
      instantFrame.current = window.requestAnimationFrame(() => {
        instantFrame.current = window.requestAnimationFrame(() => {
          if (requestId.current === id) document.documentElement.removeAttribute("data-theme-transition");
          instantFrame.current = null;
        });
      });
      return;
    }

    if (effect === "compile-pass") {
      applyTheme();
      sweepId.current += 1;
      setSweep({ id: sweepId.current, target: next });
      sweepTimer.current = window.setTimeout(() => {
        if (requestId.current === id) setSweep(null);
        sweepTimer.current = null;
      }, SWEEP_DURATION_MS);
      return;
    }

    document.documentElement.setAttribute("data-theme-transition", "diff");
    try {
      const transition = document.startViewTransition(() => {
        if (requestId.current !== id) return;
        flushSync(() => {
          applyTheme();
          setDiff({ old: previous, next });
        });
      });
      activeTransition.current = transition;
      const finish = () => {
        if (requestId.current !== id) return;
        activeTransition.current = null;
        document.documentElement.removeAttribute("data-theme-transition");
        setDiff(null);
      };
      void transition.finished.then(finish, finish);
    } catch {
      document.documentElement.setAttribute("data-theme-transition", "instant");
      applyTheme();
      instantFrame.current = window.requestAnimationFrame(() => {
        instantFrame.current = window.requestAnimationFrame(() => {
          if (requestId.current === id) document.documentElement.removeAttribute("data-theme-transition");
          instantFrame.current = null;
        });
      });
    }
  }, []);

  const cycleTheme = React.useCallback(() => {
    setTheme(nextTheme(currentTheme.current));
  }, [setTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme: theme, setTheme, cycleTheme }),
    [theme, setTheme, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {sweep && (
        <div key={sweep.id} className="theme-compile-pass" aria-hidden="true">
          <span className="theme-compile-pass-label">&gt; theme --set {sweep.target}</span>
        </div>
      )}
      {diff && (
        <div className="theme-diff-line" aria-hidden="true">
          <span className="theme-diff-label">
            <span>- {diff.old}</span><span>+ {diff.next}</span>
          </span>
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  return ctx ?? {
    theme: "dark",
    resolvedTheme: "dark",
    setTheme: () => {},
    cycleTheme: () => {},
  };
}
