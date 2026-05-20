"use client";

import * as React from "react";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01<>{}[]/*+-".split(
  "",
);

/**
 * Canvas-based Matrix code rain. Mounts when `active` is true, runs for
 * `durationMs`, then calls onClose. Esc cancels early. Accent-tinted glyphs.
 * Skipped entirely under prefers-reduced-motion.
 */
export function MatrixRain({
  active,
  onClose,
  durationMs = 5500,
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
      // Replace the transform (don't compound it on repeated resizes).
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Read --accent at runtime so it respects the active theme
    const accentRgb =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "230 88 34";

    const fontSize = 16;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops: number[] = new Array(columns)
      .fill(0)
      .map(() => Math.random() * window.innerHeight);

    let raf = 0;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Trail-effect fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.10)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px ui-monospace, "SF Mono", Menlo, monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < columns; i++) {
        const ch =
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "0";
        const x = i * fontSize;
        const y = drops[i];

        // Head: bright accent
        ctx.fillStyle = `rgb(${accentRgb} / 0.95)`;
        ctx.fillText(ch, x, y);

        // Tail: dimmer ghost
        ctx.fillStyle = `rgb(${accentRgb} / 0.35)`;
        ctx.fillText(ch, x, y - fontSize);

        if (y > h && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += fontSize;
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
      className="pointer-events-none fixed inset-0 z-[60] bg-black/30"
    />
  );
}
