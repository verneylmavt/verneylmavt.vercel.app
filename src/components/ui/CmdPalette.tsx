"use client";

import * as React from "react";
import { Command } from "cmdk";
import { cn } from "@/lib/cn";

export type PaletteItem = {
  id: string;
  label: string;
  group: "sections" | "projects" | "links";
  /** When set, clicking this item navigates to the URL. */
  href?: string;
  /** When set, clicking this item smooth-scrolls to the section id. */
  sectionId?: string;
  /** Display hint shown on the right side of the row (e.g. "↗" or "→"). */
  hint?: string;
};

export function CmdPalette({
  open,
  onOpenChange,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PaletteItem[];
}) {
  const handleSelect = React.useCallback(
    (item: PaletteItem) => {
      onOpenChange(false);
      // Wait one frame so the overlay unmounts before navigation
      requestAnimationFrame(() => {
        if (item.sectionId) {
          const el = document.getElementById(item.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            history.replaceState(null, "", `#${item.sectionId}`);
          }
        } else if (item.href) {
          const isExternal = /^https?:/i.test(item.href);
          if (isExternal) {
            window.open(item.href, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = item.href;
          }
        }
      });
    },
    [onOpenChange],
  );

  // Esc handled internally by cmdk; we also let global shortcuts close it.
  const grouped = React.useMemo(() => {
    const out: Record<PaletteItem["group"], PaletteItem[]> = {
      sections: [],
      projects: [],
      links: [],
    };
    for (const it of items) out[it.group].push(it);
    return out;
  }, [items]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-[20vh]"
    >
      <button
        type="button"
        aria-label="Close command palette"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 bg-[rgb(var(--background)/0.80)] backdrop-blur-sm"
      />
      <Command
        label="Command palette"
        loop
        className={cn(
          "relative w-full max-w-xl",
          "border border-[rgb(var(--rule)/0.20)] bg-background",
          "shadow-[0_16px_48px_rgb(0_0_0/0.14)]",
        )}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgb(var(--rule)/0.12)]">
          <span aria-hidden="true" className="text-[0.75rem] uppercase tracking-wider text-muted">
            &gt;
          </span>
          <Command.Input
            autoFocus
            placeholder="type a section, project, or link..."
            className="w-full bg-transparent text-[0.875rem] text-foreground placeholder:text-muted-soft outline-none"
          />
          <span className="text-[0.6875rem] tracking-wider uppercase text-muted">[esc]</span>
        </div>

        <Command.List className="max-h-[50vh] overflow-y-auto px-2 py-2">
          <Command.Empty className="px-3 py-4 text-[0.875rem] text-muted">
            {"// no matches"}
          </Command.Empty>

          {(["sections", "projects", "links"] as const).map((group) =>
            grouped[group].length ? (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[0.6875rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:text-muted"
              >
                {grouped[group].map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.group} ${item.label}`}
                    onSelect={() => handleSelect(item)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 cursor-pointer",
                      "text-[0.875rem] text-foreground",
                      "rounded-[2px]",
                      "data-[selected=true]:bg-[rgb(var(--surface)/0.7)] data-[selected=true]:text-foreground",
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="text-muted text-[0.75rem]" aria-hidden="true">
                      {item.hint ?? (item.sectionId ? "→" : "↗")}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null,
          )}
        </Command.List>
      </Command>
    </div>
  );
}
