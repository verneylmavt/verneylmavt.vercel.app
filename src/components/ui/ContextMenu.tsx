"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ContextMenuItem = {
  label: string;
  hint?: string;
  onSelect: () => void;
  divider?: boolean;
  external?: boolean;
};

export function ContextMenu({
  open,
  anchor,
  items,
  onClose,
}: {
  open: boolean;
  anchor: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState(anchor);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  // Clamp menu to viewport, respecting iOS safe-area insets on notched devices.
  React.useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    // Read CSS env(safe-area-inset-*) tokens from globals.css (--safe-*)
    const rootStyle = getComputedStyle(document.documentElement);
    const safeTop = parseFloat(rootStyle.getPropertyValue("--safe-top")) || 0;
    const safeRight =
      parseFloat(rootStyle.getPropertyValue("--safe-right")) || 0;
    const safeBottom =
      parseFloat(rootStyle.getPropertyValue("--safe-bottom")) || 0;
    const safeLeft =
      parseFloat(rootStyle.getPropertyValue("--safe-left")) || 0;

    const PAD = 8;
    const minX = safeLeft + PAD;
    const minY = safeTop + PAD;
    const maxRight = window.innerWidth - safeRight - PAD;
    // Leave room for the fixed status bar (32px) above the bottom inset
    const maxBottom = window.innerHeight - safeBottom - 32 - PAD;

    let x = anchor.x;
    let y = anchor.y;
    if (x + rect.width > maxRight) {
      x = Math.max(minX, maxRight - rect.width);
    }
    if (y + rect.height > maxBottom) {
      y = Math.max(minY, maxBottom - rect.height);
    }
    if (x < minX) x = minX;
    if (y < minY) y = minY;
    setPosition({ x, y });
  }, [open, anchor]);

  // Esc + outside click
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      // Find selectable indices (skip dividers)
      const selectable = items
        .map((it, i) => (it.divider ? -1 : i))
        .filter((i) => i >= 0);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((curr) => {
          const idx = selectable.indexOf(curr);
          return selectable[(idx + 1) % selectable.length] ?? -1;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((curr) => {
          const idx = selectable.indexOf(curr);
          const prev = idx <= 0 ? selectable.length - 1 : idx - 1;
          return selectable[prev] ?? -1;
        });
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex]?.onSelect();
        onClose();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, items, activeIndex, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Site context menu"
      className={cn(
        "fixed z-[55] min-w-[14rem]",
        "border border-[rgb(var(--rule)/0.22)] rounded-[2px]",
        "bg-[rgb(var(--background)/0.95)] backdrop-blur",
        "shadow-[0_8px_24px_rgb(0_0_0/0.18)]",
        "py-1 text-[0.8125rem]",
      )}
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div
            key={`d-${i}`}
            aria-hidden="true"
            className="my-1 mx-2 h-px bg-[rgb(var(--rule)/0.12)]"
          />
        ) : (
          <button
            key={item.label}
            role="menuitem"
            type="button"
            onClick={() => {
              item.onSelect();
              onClose();
            }}
            onMouseEnter={() => setActiveIndex(i)}
            className={cn(
              "w-full flex items-baseline justify-between gap-4 px-3 py-1.5 text-left",
              "transition-colors duration-[var(--dur-fast)]",
              i === activeIndex
                ? "bg-[rgb(var(--accent)/0.10)] text-[rgb(var(--accent))]"
                : "text-foreground hover:text-[rgb(var(--accent))]",
            )}
          >
            <span>{item.label}</span>
            {item.hint ? (
              <span className="text-[0.6875rem] text-muted-soft tracking-[0.04em]">
                {item.hint}
              </span>
            ) : item.external ? (
              <span className="text-muted-soft" aria-hidden="true">
                ↗
              </span>
            ) : null}
          </button>
        ),
      )}
    </div>
  );
}
