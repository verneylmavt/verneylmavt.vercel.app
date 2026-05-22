"use client";

import * as React from "react";
import { fireScramble } from "@/components/ui/ScrambleText";

/**
 * Glitch Storm easter egg. Triggered by typing "glitch".
 * - Fires fireScramble() on all mounted ScrambleText instances (twice, ~1.5s apart).
 * - Sets data-glitch="on" on <html> for CSS chromatic aberration via text-shadow.
 * - Canvas overlay draws random horizontal tear lines and full-screen flashes.
 * - Auto-dismisses after durationMs. Esc cancels early.
 * - Skipped under prefers-reduced-motion.
 */
export function GlitchStorm({
  active,
  onClose,
  durationMs = 4000,
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

    // Activate CSS chromatic aberration
    document.documentElement.setAttribute("data-glitch", "on");

    // Fire scramble on all ScrambleText instances immediately and at 1.5 s
    fireScramble();
    const scramble2 = window.setTimeout(() => fireScramble(), 1500);

    let raf = 0;
    const start = performance.now();
    let frame = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const w = window.innerWidth;
      const h = window.innerHeight;
      frame++;

      // Clear each frame — tears are ephemeral
      ctx.clearRect(0, 0, w, h);

      // Horizontal tear lines every 2 frames
      if (frame % 2 === 0) {
        const tearCount = Math.floor(Math.random() * 6) + 2;
        for (let i = 0; i < tearCount; i++) {
          const y = Math.random() * h;
          const x = Math.random() * w * 0.25;
          const tw = Math.random() * w * 0.65 + w * 0.1;
          const th = Math.random() * 3.5 + 0.5;
          const alpha = Math.random() * 0.55 + 0.2;
          ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha})`;
          ctx.fillRect(x, y, tw, th);
        }
      }

      // Occasional full-screen flash
      if (frame % 18 === 0 && Math.random() > 0.4) {
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, 0.06)`;
        ctx.fillRect(0, 0, w, h);
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
      window.clearTimeout(scramble2);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-glitch");
    };
  }, [active, durationMs, onClose]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
