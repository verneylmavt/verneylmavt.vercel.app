"use client";

import * as React from "react";

const STAR_COUNT = 200;

type Star = {
  angle: number;
  dist: number;
  speed: number;
};

/**
 * Canvas-based warp-drive effect. Stars burst from the viewport centre and
 * accelerate outward as elongated streaks. Accent-tinted, auto-dismisses after
 * `durationMs`. Esc cancels early. Skipped under prefers-reduced-motion.
 */
export function HyperspeedWarp({
  active,
  onClose,
  durationMs = 4500,
}: {
  active: boolean;
  onClose: () => void;
  durationMs?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const accentRgb =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "199 53 43";
    const [ar, ag, ab] = accentRgb.split(" ").map(Number);

    // Initialise stars at random angles with a small starting distance
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 24 + 4,
      speed: Math.random() * 2 + 0.8,
    }));

    let raf = 0;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy) + 60;

      // Fade previous frame — lower alpha = longer trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        const prevX = cx + Math.cos(star.angle) * star.dist;
        const prevY = cy + Math.sin(star.angle) * star.dist;

        // Exponential acceleration
        star.speed *= 1.06;
        star.dist += star.speed;

        if (star.dist > maxDist) {
          // Reset at centre with fresh random angle
          star.angle = Math.random() * Math.PI * 2;
          star.dist = Math.random() * 16 + 2;
          star.speed = Math.random() * 2 + 0.8;
          continue;
        }

        const newX = cx + Math.cos(star.angle) * star.dist;
        const newY = cy + Math.sin(star.angle) * star.dist;

        const progress = Math.min(1, star.dist / maxDist);
        const alpha = Math.min(0.95, progress * 2.2);
        const lineW = Math.max(0.5, progress * 2.5);

        ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha})`;
        ctx.lineWidth = lineW;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(newX, newY);
        ctx.stroke();
      }

      if (elapsed < durationMs) {
        raf = requestAnimationFrame(tick);
      } else {
        onClose();
      }
    };

    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, durationMs, onClose]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] bg-black/55"
    />
  );
}
