"use client";

import * as React from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  /** What the user picked (or fell back to "system" on first visit). */
  theme: ThemePreference;
  /** What is actually applied to <html> right now. */
  resolvedTheme: ResolvedTheme;
  /** Persist a new preference. Pass "system" to follow OS preference. */
  setTheme: (next: ThemePreference) => void;
  /** Convenience: light → dark → system → light. */
  cycleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "v3-theme";
const PREFERS_DARK = "(prefers-color-scheme: dark)";

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // ignore
  }
  return "system";
}

function applyTheme(t: ResolvedTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", t);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initial state must match server output ("system") so hydration succeeds.
  // After mount, we read the persisted preference and update if different.
  const [theme, setThemeState] = React.useState<ThemePreference>("system");

  React.useEffect(() => {
    const stored = readStoredTheme();
    if (stored !== "system") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(stored);
    }
  }, []);

  // Subscribe to OS preference changes when in "system" mode.
  const subscribeOS = React.useCallback((cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia(PREFERS_DARK);
    const handler = () => cb();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const getOSSnapshot = React.useCallback<() => ResolvedTheme>(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia(PREFERS_DARK).matches ? "dark" : "light";
  }, []);

  const osResolved = React.useSyncExternalStore(
    subscribeOS,
    getOSSnapshot,
    () => "light" as ResolvedTheme,
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? osResolved : theme;

  // Apply on every change.
  React.useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = React.useCallback((next: ThemePreference) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore (private mode, etc.)
    }
  }, []);

  const cycleTheme = React.useCallback(() => {
    setThemeState((curr) => {
      const next: ThemePreference =
        curr === "light" ? "dark" : curr === "dark" ? "system" : "light";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, cycleTheme }),
    [theme, resolvedTheme, setTheme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback — lets components render before provider mounts (rare).
    return {
      theme: "system",
      resolvedTheme: "light",
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return ctx;
}
