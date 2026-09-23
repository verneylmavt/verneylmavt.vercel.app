export type ThemePreference = "light" | "dark";

export function normalizeTheme(stored: string | null): ThemePreference {
  return stored === "light" ? "light" : "dark";
}

export function nextTheme(current: ThemePreference): ThemePreference {
  return current === "dark" ? "light" : "dark";
}
