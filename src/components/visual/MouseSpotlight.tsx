"use client";

import * as React from "react";

/**
 * Renders a fixed full-viewport overlay with a soft accent-tinted radial
 * gradient that follows the cursor. The gradient center is driven by CSS
 * custom properties `--mx` / `--my` updated via rAF.
 *
 * Hidden on touch devices (`(hover: none)`) and under reduced-motion.
 */
export function MouseSpotlight() {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const el = ref.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;

    el.style.setProperty("--mx", `${curX}px`);
    el.style.setProperty("--my", `${curY}px`);
    el.style.opacity = "1";

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    let raf = 0;
    const tick = () => {
      const lerp = 0.18;
      curX += (targetX - curX) * lerp;
      curY += (targetY - curY) * lerp;
      el.style.setProperty("--mx", `${curX}px`);
      el.style.setProperty("--my", `${curY}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block transition-opacity duration-300"
      style={{
        opacity: 0,
        background:
          "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent) / 0.07), transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
