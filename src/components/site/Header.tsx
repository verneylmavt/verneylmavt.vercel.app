"use client";

import * as React from "react";
import { LocalClock } from "@/components/ui/LocalClock";
import { cn } from "@/lib/cn";

export type NavSection = { id: string; label: string };

export function Header({
  handle,
  sections,
  activeId,
  onOpenPalette,
}: {
  handle: string;
  sections: NavSection[];
  activeId?: string;
  onOpenPalette?: () => void;
}) {
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
      <div className="mx-auto max-w-[88rem] px-6 lg:px-12 h-14 md:h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Left — handle + clock */}
        <a
          href="#top"
          className="group inline-flex items-baseline gap-2 justify-self-start text-[0.875rem] font-medium"
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
                    ? "text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {isActive ? (
                  <>
                    <span className="text-[rgb(var(--accent))]" aria-hidden="true">›</span>{" "}
                    {s.label}
                  </>
                ) : (
                  s.label
                )}
              </a>
            );
          })}
        </nav>

        {/* Right — palette + mobile toggle */}
        <div className="flex items-center gap-2 justify-self-end">
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
            className={cn(
              "md:hidden inline-flex items-center justify-center w-9 h-9",
              "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
              "bg-[rgb(var(--surface)/0.4)] text-foreground",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span aria-hidden="true" className="text-[0.875rem]">
              {mobileOpen ? "×" : "≡"}
            </span>
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
