"use client";

import * as React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { LocalClock } from "@/components/ui/LocalClock";
import { cn } from "@/lib/cn";
import type { SiteMode } from "./StatusBar";

export type NavSection = { id: string; label: string };

export function Header({
  handle,
  sections,
  activeId,
  onOpenPalette,
  mode,
  onCycleMode,
}: {
  handle: string;
  sections: NavSection[];
  activeId?: string;
  onOpenPalette?: () => void;
  mode: SiteMode;
  onCycleMode: () => void;
}) {
  const { theme, cycleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        "border-b transition-colors duration-[var(--dur-base)]",
        scrolled
          ? "border-[rgb(var(--rule)/0.12)] bg-[rgb(var(--background)/0.92)] backdrop-blur"
          : "border-transparent bg-[rgb(var(--background)/0.65)] backdrop-blur-sm",
      )}
    >
      <div className="relative mx-auto max-w-[88rem] px-4 md:px-6 lg:px-12 h-14 md:h-16 grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3">
        {/* Left — handle + clock */}
        <a
          href="#top"
          className="group inline-flex items-baseline gap-1 md:gap-2 justify-self-start whitespace-nowrap text-[0.6875rem] md:text-[0.875rem] font-medium"
          aria-label="Scroll to top"
        >
          <span aria-hidden="true" className="text-muted-soft">[</span>
          <span className="text-foreground">{handle}</span>
          <span aria-hidden="true" className="text-muted-soft">]</span>
          <span className="hidden lg:inline ml-3 pl-3 border-l border-[rgb(var(--rule)/0.18)]">
            <LocalClock />
          </span>
        </a>

        {/* Center — section nav */}
        <nav
          aria-label="Sections"
          className="hidden md:flex items-center gap-1 justify-self-center"
        >
          {sections.map((s) => {
            const isActive = activeId === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "px-2.5 py-1.5 text-[0.75rem] uppercase tracking-[0.05em]",
                  "transition-colors duration-[var(--dur-fast)]",
                  isActive
                    ? "text-[rgb(var(--accent))]"
                    : "text-muted hover:text-foreground",
                )}
              >
                {isActive ? (
                  <>
                    <span aria-hidden="true">›</span> {s.label}
                  </>
                ) : (
                  s.label
                )}
              </a>
            );
          })}
        </nav>

        {/* Right — palette on desktop, compact controls on mobile */}
        <div className="flex items-center gap-1.5 md:gap-2 justify-self-end">
          {onOpenPalette ? (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              className={cn(
                "hidden md:inline-flex items-center gap-2 px-2 py-1",
                "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
                "bg-[rgb(var(--surface)/0.4)] text-[0.6875rem] tracking-wider uppercase text-muted",
                "hover:border-[rgb(var(--rule)/0.32)] hover:text-foreground",
              )}
            >
              <span>⌘K</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={onCycleMode}
            aria-label={`Mode: ${mode}. Click to cycle.`}
            className="md:hidden inline-flex max-w-20 max-[349px]:max-w-[70px] items-center justify-center rounded-[2px] border border-[rgb(var(--rule)/0.18)] bg-[rgb(var(--surface)/0.4)] px-1.5 py-1 text-center text-[0.625rem] max-[349px]:text-[0.5625rem] leading-tight tracking-[0.02em] text-muted hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))]"
          >
            {mode}
          </button>
          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Theme: ${theme}. Click to cycle.`}
            className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-[2px] border border-[rgb(var(--rule)/0.18)] bg-[rgb(var(--surface)/0.4)] px-1.5 py-1 text-[0.625rem] max-[349px]:text-[0.5625rem] tracking-[0.02em] text-muted hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))]"
          >
            {theme}
          </button>

          <button
            type="button"
            className={cn(
              "md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8",
              "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
              "bg-[rgb(var(--surface)/0.4)] text-foreground",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <span aria-hidden="true" className="text-[0.875rem]">×</span>
            ) : (
              <span aria-hidden="true" className="flex h-3 w-3.5 flex-col justify-between">
                <span data-code-line className="h-0.5 w-full bg-current" />
                <span className="ml-1 flex h-0.5 items-center gap-0.5">
                  <span data-code-line className="h-0.5 w-1.5 bg-current" />
                  <span data-code-cursor className="h-0.5 w-0.5 bg-[rgb(var(--accent))]" />
                </span>
                <span data-code-line className="h-0.5 w-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden border-t border-[rgb(var(--rule)/0.10)]",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto max-w-[88rem] px-6 py-3" aria-label="Sections">
          <ul className="grid gap-1">
            {sections.map((s, i) => {
              const isActive = activeId === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between px-2 py-2 text-[0.875rem]",
                      "border-b border-[rgb(var(--rule)/0.06)]",
                      isActive ? "text-foreground" : "text-muted",
                    )}
                  >
                    <span>
                      <span className="text-muted-soft mr-2 text-[0.6875rem]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.label}
                    </span>
                    <span aria-hidden="true" className="text-muted-soft">→</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
