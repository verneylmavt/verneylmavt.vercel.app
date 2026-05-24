"use client";

import * as React from "react";
import { subscribePointer } from "@/hooks/usePointer";
import { FieldMesh } from "./FieldMesh";

/**
 * Composes the v3 cursor system:
 *
 *  - <FieldMesh>           — Layer A, ambient magnetic-field mesh (canvas)
 *  - probe-tip SVG         — Layer B, replaces the old `+` crosshair
 *  - Manhattan trace SVG   — Layer B, routes from probe to nearest element corner
 *  - corner brackets SVG   — Layer C, marks the bounding box of the targeted element
 *  - telemetry caption     — Layer C, floating monospace readout near the probe tip
 *
 * All sub-pieces are driven imperatively by a single `subscribePointer`
 * subscription, mirroring the existing v3 imperative-DOM convention (no React
 * re-renders during pointer motion). Hidden on touch / under reduced-motion.
 *
 * `minimal` opt-out: hides the telemetry caption (brackets still draw) and
 * scales down the field mesh intensity. Driven by the `[mode: minimal]` chip
 * in StatusBar.
 */

/** Radius within which the trace / brackets / telemetry activate. */
const SNAP_R = 140;

/** Bracket leg length in px. */
const BRACKET_LEN = 10;

export function CursorProbe({ minimal = false }: { minimal?: boolean } = {}) {
  // Refs for imperative writes. No React re-renders happen for any of these
  // — every value is set via DOM mutation inside the rAF subscription.
  const tipRef = React.useRef<HTMLDivElement | null>(null);
  const tracePathRef = React.useRef<SVGPathElement | null>(null);
  const traceTermRef = React.useRef<SVGCircleElement | null>(null);
  const bracketsRef = React.useRef<SVGGElement | null>(null);
  const telemRef = React.useRef<HTMLDivElement | null>(null);
  const telemTagRef = React.useRef<HTMLSpanElement | null>(null);
  const telemDistRef = React.useRef<HTMLSpanElement | null>(null);
  const telemIdRef = React.useRef<HTMLSpanElement | null>(null);

  const minimalRef = React.useRef(minimal);
  React.useEffect(() => {
    minimalRef.current = minimal;
  }, [minimal]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const tip = tipRef.current;
    const tracePath = tracePathRef.current;
    const traceTerm = traceTermRef.current;
    const brackets = bracketsRef.current;
    const telem = telemRef.current;
    const telemTag = telemTagRef.current;
    const telemDist = telemDistRef.current;
    const telemId = telemIdRef.current;

    // Stable 4-char probe IDs derived from element identity. Cached so the
    // same element always reads the same ID across a session — feels like a
    // real instrument naming a port, not a random number.
    const probeIds = new WeakMap<Element, string>();
    const getProbeId = (el: Element): string => {
      const cached = probeIds.get(el);
      if (cached) return cached;
      // Cheap string hash over outerHTML head — gives spread of values that
      // looks pseudo-random across the page.
      const key = (el as HTMLElement).outerHTML.slice(0, 80);
      let h = 0;
      for (let i = 0; i < key.length; i++) {
        h = (h * 31 + key.charCodeAt(i)) & 0xffff;
      }
      const id = h.toString(16).padStart(4, "0");
      probeIds.set(el, id);
      return id;
    };

    const getTag = (el: Element): string => {
      const tag = el.tagName.toLowerCase();
      const role = (el as HTMLElement).getAttribute("role");
      if (role === "button") return "[btn]";
      if (role === "link") return "[a]";
      if (tag === "button") return "[btn]";
      if (tag === "a") return "[a]";
      if (tag === "input") return "[in]";
      if (tag === "textarea") return "[in]";
      if (tag === "label") return "[lbl]";
      return `[${tag}]`;
    };

    // Smoothing buffers — lerp toward 0 / 1 each frame. Avoids hard pops when
    // crossing the snap radius and gives the system a coherent breathing feel.
    let tipAlpha = 0;
    let traceProgress = 0;
    let bracketsAlpha = 0;
    let telemAlpha = 0;

    // Cached strings so we don't churn .textContent every frame when nothing
    // has changed (saves layout work).
    let lastTag = "";
    let lastDist = "";
    let lastId = "";

    // Update an SVG line element's endpoints in place.
    const setLine = (line: Element | null, x1: number, y1: number, x2: number, y2: number) => {
      if (!line) return;
      line.setAttribute("x1", `${x1}`);
      line.setAttribute("y1", `${y1}`);
      line.setAttribute("x2", `${x2}`);
      line.setAttribute("y2", `${y2}`);
    };

    // Reveal — initial styles keep everything at opacity 0 so SSR is clean.
    if (tip) tip.style.opacity = "0";
    if (tracePath) tracePath.style.opacity = "0";
    if (traceTerm) traceTerm.style.opacity = "0";
    if (brackets) brackets.style.opacity = "0";
    if (telem) telem.style.opacity = "0";

    const unsub = subscribePointer((p) => {
      // ── Probe tip ─────────────────────────────────────────────────
      // Tip follows the smoothed cursor. Fades over interactive targets so
      // the native cursor (link / button hand) reads clearly.
      if (tip) {
        tip.style.transform = `translate3d(${p.smoothX - 8}px, ${p.smoothY - 8}px, 0)`;
        const wantTip = !p.overInteractive && !p.overEditable;
        tipAlpha += ((wantTip ? 1 : 0) - tipAlpha) * 0.25;
        tip.style.opacity = `${tipAlpha.toFixed(3)}`;
      }

      // ── Trace, brackets, telemetry: gated by "in snap radius" + not editable ──
      const inSnap = p.nearestDist < SNAP_R;
      const wantInteractCues = !p.overEditable && (inSnap || p.overInteractive);

      // ── Manhattan trace ───────────────────────────────────────────
      // Visible only while we're "approaching" — not after we've made contact.
      // Routes longer-axis-first (EDA autorouter convention).
      const wantTrace = wantInteractCues && !p.overInteractive;
      const traceTarget = wantTrace ? 1 : 0;
      traceProgress += (traceTarget - traceProgress) * 0.22;

      if (tracePath && traceTerm) {
        if (traceProgress > 0.01 && p.nearestRect) {
          const r = p.nearestRect;
          // Nearest corner of the rect to the probe — gives the trace its
          // schematic-pad target.
          const corners: Array<[number, number]> = [
            [r.left, r.top],
            [r.right, r.top],
            [r.right, r.bottom],
            [r.left, r.bottom],
          ];
          let bestCX = corners[0][0];
          let bestCY = corners[0][1];
          let bestD2 = Infinity;
          for (let i = 0; i < 4; i++) {
            const dx = corners[i][0] - p.smoothX;
            const dy = corners[i][1] - p.smoothY;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
              bestD2 = d2;
              bestCX = corners[i][0];
              bestCY = corners[i][1];
            }
          }
          const dx = bestCX - p.smoothX;
          const dy = bestCY - p.smoothY;
          const sx = p.smoothX.toFixed(1);
          const sy = p.smoothY.toFixed(1);
          const tx = bestCX.toFixed(1);
          const ty = bestCY.toFixed(1);
          // Longer axis first
          const pathD =
            Math.abs(dx) >= Math.abs(dy)
              ? `M ${sx},${sy} H ${tx} V ${ty}`
              : `M ${sx},${sy} V ${ty} H ${tx}`;
          const len = Math.abs(dx) + Math.abs(dy);
          tracePath.setAttribute("d", pathD);
          tracePath.setAttribute("stroke-dasharray", `${len.toFixed(1)}`);
          tracePath.setAttribute(
            "stroke-dashoffset",
            `${(len * (1 - traceProgress)).toFixed(1)}`,
          );
          tracePath.style.opacity = `${(traceProgress * 0.6).toFixed(3)}`;

          traceTerm.setAttribute("cx", tx);
          traceTerm.setAttribute("cy", ty);
          traceTerm.style.opacity = `${(traceProgress * 0.85).toFixed(3)}`;
        } else {
          tracePath.style.opacity = "0";
          traceTerm.style.opacity = "0";
        }
      }

      // ── Corner brackets ───────────────────────────────────────────
      // Fade in as the probe approaches; snap to full on actual hover.
      let bracketsTarget = 0;
      if (wantInteractCues && p.nearestRect) {
        bracketsTarget = p.overInteractive
          ? 1
          : Math.max(0, 1 - p.nearestDist / SNAP_R);
      }
      bracketsAlpha += (bracketsTarget - bracketsAlpha) * 0.25;

      if (brackets) {
        if (bracketsAlpha > 0.01 && p.nearestRect) {
          const r = p.nearestRect;
          const L = BRACKET_LEN;
          const lines = brackets.children;
          // 8 lines: tlH, tlV, trH, trV, blH, blV, brH, brV (paired with the JSX below)
          setLine(lines[0], r.left, r.top, r.left + L, r.top);
          setLine(lines[1], r.left, r.top, r.left, r.top + L);
          setLine(lines[2], r.right - L, r.top, r.right, r.top);
          setLine(lines[3], r.right, r.top, r.right, r.top + L);
          setLine(lines[4], r.left, r.bottom, r.left + L, r.bottom);
          setLine(lines[5], r.left, r.bottom - L, r.left, r.bottom);
          setLine(lines[6], r.right - L, r.bottom, r.right, r.bottom);
          setLine(lines[7], r.right, r.bottom - L, r.right, r.bottom);
          brackets.style.opacity = `${(bracketsAlpha * 0.85).toFixed(3)}`;
        } else {
          brackets.style.opacity = "0";
        }
      }

      // ── Telemetry caption ─────────────────────────────────────────
      // Hidden in minimal mode and when no element is in range.
      const wantTelem = !minimalRef.current && wantInteractCues && !!p.nearestEl;
      const telemTarget = wantTelem ? 1 : 0;
      telemAlpha += (telemTarget - telemAlpha) * 0.25;

      if (telem) {
        if (telemAlpha > 0.01 && p.nearestEl) {
          const tagStr = getTag(p.nearestEl);
          const distStr = `${Math.round(p.nearestDist)}px`;
          const idStr = `#${getProbeId(p.nearestEl)}`;
          if (telemTag && tagStr !== lastTag) {
            telemTag.textContent = tagStr;
            lastTag = tagStr;
          }
          if (telemDist && distStr !== lastDist) {
            telemDist.textContent = distStr;
            lastDist = distStr;
          }
          if (telemId && idStr !== lastId) {
            telemId.textContent = idStr;
            lastId = idStr;
          }
          // Below-right of probe; flip to above-left when near the viewport
          // bottom-right so the caption never clips off-screen.
          const w = window.innerWidth;
          const h = window.innerHeight;
          const flipX = p.smoothX > w - 180;
          const flipY = p.smoothY > h - 60;
          const ox = flipX ? -160 : 14;
          const oy = flipY ? -28 : 14;
          telem.style.transform = `translate3d(${(p.smoothX + ox).toFixed(0)}px, ${(p.smoothY + oy).toFixed(0)}px, 0)`;
          telem.style.opacity = `${telemAlpha.toFixed(3)}`;
        } else {
          telem.style.opacity = "0";
        }
      }
    });

    // Mouse-down briefly suppresses the telemetry caption so click feedback
    // (focus ring, link transition) reads cleanly without text competing.
    const onDown = () => {
      if (telem) telem.style.opacity = "0";
      telemAlpha = 0;
    };
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      unsub();
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      <FieldMesh minimal={minimal} />

      {/* Trace + brackets share one full-viewport SVG so they live in the
          same coordinate space and stay perfectly aligned. */}
      <svg
        aria-hidden="true"
        className="probe-svg pointer-events-none fixed inset-0 z-[34] hidden md:block"
        width="100%"
        height="100%"
        style={{ color: "rgb(var(--accent))" }}
      >
        <path
          ref={tracePathRef}
          className="probe-trace"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={{ opacity: 0 }}
        />
        <circle
          ref={traceTermRef}
          className="probe-trace-term"
          r="2.5"
          fill="currentColor"
          style={{ opacity: 0 }}
        />
        <g
          ref={bracketsRef}
          className="probe-brackets"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
          style={{ opacity: 0 }}
        >
          <line />
          <line />
          <line />
          <line />
          <line />
          <line />
          <line />
          <line />
        </g>
      </svg>

      {/* Probe tip — separate so we can transform-translate it instead of
          rewriting SVG x/y attributes every frame. */}
      <div
        ref={tipRef}
        aria-hidden="true"
        className="probe-tip pointer-events-none fixed top-0 left-0 z-[35] hidden md:block"
        style={{
          width: 16,
          height: 16,
          color: "rgb(var(--accent))",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
          <circle cx="8" cy="8" r="2.5" />
          <line x1="8" y1="1" x2="8" y2="4" />
          <line x1="8" y1="12" x2="8" y2="15" />
          <line x1="1" y1="8" x2="4" y2="8" />
          <line x1="12" y1="8" x2="15" y2="8" />
        </svg>
      </div>

      {/* Telemetry caption */}
      <div
        ref={telemRef}
        aria-hidden="true"
        className="probe-telem pointer-events-none fixed top-0 left-0 z-[36] hidden md:flex items-center gap-1.5 px-1.5 py-0.5 text-[0.6875rem] tracking-[0.04em] tabular-nums whitespace-nowrap"
        style={{
          color: "rgb(var(--accent))",
          background: "rgb(var(--background) / 0.78)",
          border: "1px solid rgb(var(--accent) / 0.35)",
          borderRadius: 2,
          backdropFilter: "blur(4px)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <span ref={telemTagRef}>[a]</span>
        <span aria-hidden="true" style={{ opacity: 0.45 }}>·</span>
        <span ref={telemDistRef}>0px</span>
        <span aria-hidden="true" style={{ opacity: 0.45 }}>·</span>
        <span ref={telemIdRef}>#0000</span>
      </div>
    </>
  );
}
