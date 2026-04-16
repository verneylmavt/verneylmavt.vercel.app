"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/cn";

export type NavSection = { id: string; label: string };

export function Header({
  siteName,
  sections,
  activeId,
}: {
  siteName: string;
  sections: NavSection[];
  activeId?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full",
        scrolled
          ? "bg-[rgb(var(--background)/0.6)] backdrop-blur-xl"
          : "bg-[rgb(var(--background)/0.15)] backdrop-blur-md",
      )}
    >
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6">
        <a
          href="#top"
          className="group inline-flex items-baseline gap-2 justify-self-start text-sm font-medium tracking-tight"
          aria-label="Scroll to top"
        >
          <span className="text-foreground">{siteName}</span>
        </a>

        <nav
          className="hidden items-center gap-1 justify-self-center md:flex"
          aria-label="Sections"
        >
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition",
                  "text-muted hover:text-foreground",
                  isActive &&
                    "bg-[rgb(var(--foreground)/0.06)] text-foreground",
                )}
              >
                {section.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border)/0.14)] bg-[rgb(var(--background)/0.4)] backdrop-blur-md transition md:hidden",
              "hover:border-[rgb(var(--border)/0.22)] hover:bg-[rgb(var(--background)/0.55)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden",
          isOpen ? "block" : "hidden",
          "border-t border-[rgb(var(--border)/0.10)]",
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-4">
          <nav className="grid gap-1" aria-label="Sections">
            {sections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-3 text-sm",
                    "text-muted hover:bg-[rgb(var(--foreground)/0.06)] hover:text-foreground",
                    isActive && "bg-[rgb(var(--foreground)/0.06)] text-foreground",
                  )}
                >
                  <span>{section.label}</span>
                  <span className="text-muted/70">-&gt;</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
