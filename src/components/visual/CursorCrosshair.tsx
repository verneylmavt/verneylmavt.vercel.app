"use client";

import * as React from "react";

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [role="link"], [contenteditable="true"]';

/**
 * A small accent `+` glyph that lags behind the cursor on desktop.
 * Hidden on touch (CSS @media hover:none) and on prefers-reduced-motion.
 * Fades out over interactive elements so the native cursor reads clearly.
 */
export function CursorCrosshair() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const targetX = React.useRef(0);
  const targetY = React.useRef(0);
  const curX = React.useRef(0);
  const curY = React.useRef(0);
  const overInteractive = React.useRef(false);
  const enabled = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    enabled.current = true;
    const el = ref.current;
    if (!el) return;
    // Reveal — initial CSS keeps the crosshair hidden until JS confirms support
    el.style.opacity = "1";

    // Initialize at center off-screen so first tick eases in
    curX.current = window.innerWidth / 2;
    curY.current = window.innerHeight / 2;
    targetX.current = curX.current;
    targetY.current = curY.current;

    const onMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      overInteractive.current = !!t?.closest?.(INTERACTIVE_SELECTOR);
    };

    let raf = 0;
    const tick = () => {
      const lerp = 0.18;
      curX.current += (targetX.current - curX.current) * lerp;
      curY.current += (targetY.current - curY.current) * lerp;
      if (el) {
        el.style.transform = `translate3d(${curX.current - 7}px, ${curY.current - 7}px, 0)`;
        el.style.opacity = overInteractive.current ? "0" : "1";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[35] hidden md:block transition-opacity duration-150 ease-out"
      style={{
        width: 14,
        height: 14,
        color: "rgb(var(--accent))",
        opacity: 0,
        willChange: "transform, opacity",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <line x1="7" y1="1" x2="7" y2="13" />
        <line x1="1" y1="7" x2="13" y2="7" />
      </svg>
    </div>
  );
}
