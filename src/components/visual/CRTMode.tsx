"use client";

import * as React from "react";

const STORAGE_KEY = "v3:crt";

/**
 * CRT Mode easter egg. Triggered by typing "crt" (toggleable — type again to
 * exit). Renders a canvas overlay with heavy scanlines, corner vignette, and
 * occasional screen flicker. Sets data-crt="on" on <html> for the phosphor
 * glow text-shadow in globals.css. Persists in sessionStorage.
 *
 * Canvas at z-[8] covers normal page content; interactive overlays
 * (StatusBar z-30, Header z-40, etc.) naturally sit above it.
 */
export function CRTMode({
  active,
  onClose,
}: {
  active: boolean;
  onClose: () => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Apply / remove the data-crt attr and sessionStorage
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (active) {
      document.documentElement.setAttribute("data-crt", "on");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    } else {
      document.documentElement.removeAttribute("data-crt");
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [active]);

  // Scanline + vignette + flicker rAF loop
  React.useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

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

    const fgRgb =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim() || "235 235 240";
    const [fr, fg, fb] = fgRgb.split(" ").map(Number);

    let raf = 0;
    let frame = 0;
    // Schedule next flicker randomly between 180–500 frames
    let nextFlickerFrame = Math.floor(Math.random() * 320 + 180);

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      frame++;

      ctx.clearRect(0, 0, w, h);

      // Scanlines: a dark band every 4px
      const lineGap = 4;
      ctx.fillStyle = `rgba(0, 0, 0, 0.20)`;
      for (let y = 0; y < h; y += lineGap) {
        ctx.fillRect(0, y, w, 1.5);
      }

      // Corner vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.28, w / 2, h / 2, h * 0.85);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      // Occasional flicker: one-frame brightness dip
      if (frame === nextFlickerFrame) {
        ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, 0.08)`;
        ctx.fillRect(0, 0, w, h);
        nextFlickerFrame = frame + Math.floor(Math.random() * 320 + 180);
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
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[8]"
    />
  );
}

/** Reads persisted CRT state for hydration-safe initialisation in SitePage. */
export function readCRTInitial(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
