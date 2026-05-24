"use client";

import * as React from "react";
import { subscribePointer, type PointerState } from "@/hooks/usePointer";

/**
 * Layer A — magnetic-field mesh.
 *
 * A canvas overlay that paints a sparse grid of glyphs at 64px pitch. Each
 * glyph behaves like an iron filing in a magnetic field whose pole is the
 * cursor: outside the influence radius it's invisible (the body bg already
 * provides ambient dotted texture); inside, it lerps from muted to accent and
 * orients as a short tick mark pointing at the cursor; very close, it pops as
 * a tiny `+`. A short trail of past cursor positions extends the influence
 * region along the motion vector, so fast cursor sweeps leave a brief wake of
 * oriented glyphs.
 *
 * Single-canvas draw, bounded per-frame work (only cells in the active region
 * are visited), reduced-motion + touch gates.
 */

const GRID_PITCH = 64;          // px between cells
const INFLUENCE_R = 260;        // px — outside this, cell is dormant
const CLOSE_R = 40;             // px — inside this, cell becomes a `+`
const TICK_LEN = 7;             // half-length of the oriented tick mark
const TRAIL_FRAMES = 6;         // cursor history length for the velocity wake

export function FieldMesh({ minimal = false }: { minimal?: boolean } = {}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  // Use a ref for `minimal` so the rAF loop reads the latest value without
  // needing to be re-created on every prop change.
  const minimalRef = React.useRef(minimal);
  React.useEffect(() => {
    minimalRef.current = minimal;
  }, [minimal]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Read theme tokens once. Recomputed on theme change via the
    // attribute-mutation observer below so accent shifts feel instant.
    const readTokens = () => {
      const cs = getComputedStyle(document.documentElement);
      const a = (cs.getPropertyValue("--accent").trim() || "199 53 43")
        .split(/\s+/)
        .map(Number);
      const m = (cs.getPropertyValue("--muted").trim() || "80 80 84")
        .split(/\s+/)
        .map(Number);
      return { a, m };
    };
    let { a: accentRgb, m: mutedRgb } = readTokens();

    const themeObserver = new MutationObserver(() => {
      const t = readTokens();
      accentRgb = t.a;
      mutedRgb = t.m;
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Reveal once we've confirmed support — initial CSS keeps opacity at 0
    canvas.style.opacity = "1";

    const trail: { x: number; y: number }[] = [];
    let lastState: PointerState | null = null;
    const unsub = subscribePointer((p) => {
      lastState = p;
    });

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      const s = lastState;
      if (s) {
        const cx = s.smoothX;
        const cy = s.smoothY;

        trail.unshift({ x: cx, y: cy });
        if (trail.length > TRAIL_FRAMES) trail.length = TRAIL_FRAMES;

        // Compute the active region — the bounding box of the trail expanded
        // by INFLUENCE_R. Clamps to grid indices so we only walk active cells.
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < trail.length; i++) {
          if (trail[i].x < minX) minX = trail[i].x;
          if (trail[i].x > maxX) maxX = trail[i].x;
          if (trail[i].y < minY) minY = trail[i].y;
          if (trail[i].y > maxY) maxY = trail[i].y;
        }
        minX -= INFLUENCE_R;
        minY -= INFLUENCE_R;
        maxX += INFLUENCE_R;
        maxY += INFLUENCE_R;

        const cols = Math.ceil(w / GRID_PITCH) + 1;
        const rows = Math.ceil(h / GRID_PITCH) + 1;
        const c0 = Math.max(0, Math.floor(minX / GRID_PITCH));
        const c1 = Math.min(cols, Math.ceil(maxX / GRID_PITCH));
        const r0 = Math.max(0, Math.floor(minY / GRID_PITCH));
        const r1 = Math.min(rows, Math.ceil(maxY / GRID_PITCH));

        const minimalScale = minimalRef.current ? 0.45 : 1;

        ctx.lineWidth = 1;
        ctx.lineCap = "round";

        for (let r = r0; r < r1; r++) {
          for (let c = c0; c < c1; c++) {
            const gx = c * GRID_PITCH + GRID_PITCH / 2;
            const gy = r * GRID_PITCH + GRID_PITCH / 2;

            // Walk the trail to find the strongest contribution. The trail
            // entry that contributes most also dictates orientation, so fast
            // motion oriented glyphs lag slightly behind the cursor in a
            // visually coherent wake.
            let strength = 0;
            let pullX = cx;
            let pullY = cy;
            for (let i = 0; i < trail.length; i++) {
              const tx = trail[i].x;
              const ty = trail[i].y;
              const dx = tx - gx;
              const dy = ty - gy;
              const d2 = dx * dx + dy * dy;
              if (d2 > INFLUENCE_R * INFLUENCE_R) continue;
              const d = Math.sqrt(d2);
              const decay = 1 - i / TRAIL_FRAMES;
              const sCell = (1 - d / INFLUENCE_R) * decay;
              if (sCell > strength) {
                strength = sCell;
                pullX = tx;
                pullY = ty;
              }
            }

            if (strength === 0) continue;

            // Distance to the live cursor — used only to gate the `+` pop.
            const ddx = cx - gx;
            const ddy = cy - gy;
            const dLive = Math.sqrt(ddx * ddx + ddy * ddy);

            if (dLive < CLOSE_R) {
              const k = 1 - dLive / CLOSE_R;
              const alpha = (0.45 + k * 0.55) * minimalScale;
              const len = 3 + k * 4;
              ctx.strokeStyle = `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(gx - len, gy);
              ctx.lineTo(gx + len, gy);
              ctx.moveTo(gx, gy - len);
              ctx.lineTo(gx, gy + len);
              ctx.stroke();
            } else {
              const angle = Math.atan2(pullY - gy, pullX - gx);
              const half = TICK_LEN * (0.45 + strength * 0.55);
              const alpha = (0.14 + strength * 0.55) * minimalScale;

              const tr = mutedRgb[0] + (accentRgb[0] - mutedRgb[0]) * strength;
              const tg = mutedRgb[1] + (accentRgb[1] - mutedRgb[1]) * strength;
              const tb = mutedRgb[2] + (accentRgb[2] - mutedRgb[2]) * strength;

              ctx.strokeStyle = `rgba(${tr.toFixed(0)}, ${tg.toFixed(0)}, ${tb.toFixed(0)}, ${alpha.toFixed(3)})`;
              const ca = Math.cos(angle) * half;
              const sa = Math.sin(angle) * half;
              ctx.beginPath();
              ctx.moveTo(gx - ca, gy - sa);
              ctx.lineTo(gx + ca, gy + sa);
              ctx.stroke();
            }
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      unsub();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="field-mesh pointer-events-none fixed inset-0 z-[1] hidden md:block transition-opacity duration-300"
      style={{ opacity: 0 }}
    />
  );
}
