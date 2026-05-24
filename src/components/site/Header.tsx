"use client";

import * as React from "react";
import { Menu, Search, X } from "lucide-react";

import { cn } from "@/lib/cn";

export type NavSection = { id: string; label: string; index: string };

export function Header({
  siteName,
  sections,
  activeId,
  scrollProgress,
  onOpenCommand,
}: {
  siteName: string;
  sections: NavSection[];
  activeId?: string;
  scrollProgress: number;
  onOpenCommand: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/92 backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-px bg-accent"
        style={{ transform: `scaleX(${scrollProgress})`, transformOrigin: "0 50%" }}
      />

      <div className="mx-auto grid min-h-16 w-full max-w-[1440px] grid-cols-[1fr_auto] items-stretch lg:grid-cols-[280px_1fr_280px]">
        <a
          href="#top"
          className="focus-ring flex items-center border-r border-border/20 px-4 text-xs font-semibold uppercase leading-none sm:px-6"
          aria-label="Scroll to top"
        >
          <span className="mr-3 inline-block h-2 w-2 bg-accent" />
          {siteName}
        </a>

        <nav
          className="hidden grid-cols-8 divide-x divide-border/15 text-[11px] uppercase leading-none lg:grid"
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
                  "focus-ring flex items-center justify-center px-2 py-5 transition",
                  "hover:bg-foreground hover:text-background",
                  isActive && "bg-foreground text-background",
                )}
              >
                <span className="mr-2 text-[10px] opacity-60">{section.index}</span>
                {section.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-stretch justify-end">
          <button
            type="button"
            onClick={onOpenCommand}
            className="focus-ring hidden items-center gap-3 border-l border-border/20 px-5 text-[11px] uppercase transition hover:bg-foreground hover:text-background sm:flex"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Command
            <span className="border border-current px-1.5 py-0.5 text-[10px]">Ctrl K</span>
          </button>
          <button
            type="button"
            className="focus-ring flex h-16 w-16 items-center justify-center border-l border-border/20 lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-border/20 lg:hidden",
          isOpen ? "block" : "hidden",
        )}
      >
        <nav className="grid divide-y divide-border/15" aria-label="Sections">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "focus-ring flex items-center justify-between px-5 py-4 text-xs uppercase",
                  isActive ? "bg-foreground text-background" : "bg-background",
                )}
              >
                <span>
                  <span className="mr-3 opacity-60">{section.index}</span>
                  {section.label}
                </span>
                <span aria-hidden="true">-&gt;</span>
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenCommand();
            }}
            className="focus-ring flex items-center justify-between px-5 py-4 text-left text-xs uppercase"
          >
            Command palette
            <span aria-hidden="true">Ctrl K</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
