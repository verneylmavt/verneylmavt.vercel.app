"use client";

import * as React from "react";
import { fireScramble } from "@/components/ui/ScrambleText";

const STORAGE_KEY = "v3:glitch";

/**
 * Glitch Storm easter egg. Triggered by typing "glitch" (toggleable — type
 * again to exit). Persistent like DiagnosticOverlay and CRTMode.
 * - Sets data-glitch="on" on <html> for CSS chromatic aberration.
 * - Canvas overlay draws random horizontal tear lines indefinitely.
 * - Fires fireScramble() on activation for an initial text scramble burst.
 * - Persists in sessionStorage across page refreshes.
 * - Skipped under prefers-reduced-motion.
 */
export function GlitchStorm({
  active,
  onClose,
}: {
  active: boolean;
  onClose: () => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Apply / remove the data-glitch attr and sessionStorage
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (active) {
      document.documentElement.setAttribute("data-glitch", "on");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    } else {
      document.documentElement.removeAttribute("data-glitch");
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [active]);

  // Canvas tear lines + scramble burst rAF loop
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

    // Initial scramble burst on activation
    fireScramble();
    const scramble2 = window.setTimeout(() => fireScramble(), 1500);

    let raf = 0;
    let frame = 0;

    const tick = () => {
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

      raf = requestAnimationFrame(tick);
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
    };
  }, [active, onClose]);

  if (!active) return null;

  return (
    <>
      {/* Tear lines canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60]"
      />

      {/* Persistent mode badge */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-10 left-4 z-[45]"
      >
        <div className="pointer-events-auto border border-[rgb(var(--accent)/0.55)] bg-background/90 backdrop-blur px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.04em] text-[rgb(var(--accent))]">
          <span className="opacity-70">{"// glitch storm"}</span>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 text-muted hover:text-foreground transition-colors duration-[var(--dur-base)]"
          >
            [ esc ]
          </button>
        </div>
      </div>
    </>
  );
}

/** Reads persisted glitch state for hydration-safe initialisation in SitePage. */
export function readGlitchInitial(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
