import type { ThemePreference } from "./theme-policy";

export type ThemeEffect = "code-diff" | "compile-pass";

// Keep the earlier renderer available without exposing another visitor setting.
export const themeTransitionSettings: { activeEffect: ThemeEffect } = {
  activeEffect: "code-diff",
};

export function selectThemeEffect(
  previous: ThemePreference,
  next: ThemePreference,
  options: {
    activeEffect: ThemeEffect;
    supportsViewTransition: boolean;
    reducedMotion: boolean;
    bsodVisible: boolean;
  },
): ThemeEffect | "none" {
  if (previous === next || options.reducedMotion || options.bsodVisible) return "none";
  if (options.activeEffect === "compile-pass") return "compile-pass";
  return options.supportsViewTransition ? "code-diff" : "none";
}
