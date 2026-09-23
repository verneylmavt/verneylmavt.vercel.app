"use client";

import * as React from "react";
import { nextTheme, normalizeTheme, type ThemePreference } from "@/lib/theme-policy";

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
const SWEEP_DURATION_MS = 520;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Match server markup. The boot script applies a saved light preference before paint.
  const [theme, setThemeState] = React.useState<ThemePreference>("dark");
  const currentTheme = React.useRef<ThemePreference>("dark");
  const [sweep, setSweep] = React.useState<{ id: number; target: ThemePreference } | null>(null);
  const sweepId = React.useRef(0);
  const sweepTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
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
      if (sweepTimer.current !== null) window.clearTimeout(sweepTimer.current);
    };
  }, []);

  const setTheme = React.useCallback((next: ThemePreference) => {
    if (next === currentTheme.current) return;
    currentTheme.current = next;
    document.documentElement.setAttribute("data-theme", next);
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep the in-memory choice when storage is unavailable.
    }

    if (sweepTimer.current !== null) window.clearTimeout(sweepTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSweep(null);
      return;
    }
    sweepId.current += 1;
    setSweep({ id: sweepId.current, target: next });
    sweepTimer.current = window.setTimeout(() => {
      setSweep(null);
      sweepTimer.current = null;
    }, SWEEP_DURATION_MS);
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
