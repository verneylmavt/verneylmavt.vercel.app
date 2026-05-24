"use client";

/**
 * Shared pointer store driven by a single rAF loop, consumed by all cursor /
 * field-mesh / probe-HUD layers so we only smooth, only walk the
 * interactive-element list, and only update CSS vars once per frame.
 *
 * Usage from a component:
 *
 *   React.useEffect(() => {
 *     return subscribePointer((p) => {
 *       // imperative DOM writes here — runs every frame, do not setState
 *     });
 *   }, []);
 */

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, label, [role="button"], [role="link"], [contenteditable="true"]';

const EDITABLE_SELECTOR = 'input, textarea, [contenteditable="true"]';

export type PointerState = {
  /** Raw cursor position from the last pointer event. */
  x: number;
  y: number;
  /** Lerp-smoothed position (lerp factor 0.18, matches v3 convention). */
  smoothX: number;
  smoothY: number;
  /** Low-pass-filtered velocity in px / frame. */
  vx: number;
  vy: number;
  /** Smoothed velocity magnitude (px / frame). */
  speed: number;
  /** True while the pointer is over any element matching INTERACTIVE_SELECTOR. */
  overInteractive: boolean;
  /** True while the pointer is over an editable target (input/contenteditable). */
  overEditable: boolean;
  /** Nearest interactive element to the smoothed cursor, or null if none. */
  nearestEl: Element | null;
  /** Cached bounding rect of nearestEl (viewport coords). */
  nearestRect: DOMRect | null;
  /** Distance from smoothed cursor to the nearest point on nearestEl. */
  nearestDist: number;
  /** Closest point on nearestEl's edge/interior to the cursor. */
  nearestX: number;
  nearestY: number;
};

type Subscriber = (state: PointerState) => void;

const subscribers = new Set<Subscriber>();
let initialized = false;

let rectsCache: { el: Element; rect: DOMRect }[] = [];
let rectsDirty = true;
let frameCounter = 0;

const state: PointerState = {
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0,
  vx: 0,
  vy: 0,
  speed: 0,
  overInteractive: false,
  overEditable: false,
  nearestEl: null,
  nearestRect: null,
  nearestDist: Infinity,
  nearestX: 0,
  nearestY: 0,
};

function refreshRects() {
  const nodes = document.querySelectorAll(INTERACTIVE_SELECTOR);
  const next: { el: Element; rect: DOMRect }[] = [];
  nodes.forEach((el) => {
    const rect = (el as HTMLElement).getBoundingClientRect();
    // Skip zero-area / off-screen elements — they can't be probe targets and
    // measuring against them just wastes cycles.
    if (rect.width < 4 || rect.height < 4) return;
    if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
    if (rect.right < -200 || rect.left > window.innerWidth + 200) return;
    next.push({ el, rect });
  });
  rectsCache = next;
  rectsDirty = false;
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  state.x = window.innerWidth / 2;
  state.y = window.innerHeight / 2;
  state.smoothX = state.x;
  state.smoothY = state.y;

  const onMove = (e: PointerEvent) => {
    state.x = e.clientX;
    state.y = e.clientY;
  };

  const onOver = (e: PointerEvent) => {
    const t = e.target as HTMLElement | null;
    state.overInteractive = !!t?.closest?.(INTERACTIVE_SELECTOR);
    state.overEditable = !!t?.closest?.(EDITABLE_SELECTOR);
  };

  // Bbox cache invalidation: scroll (anywhere — capture phase catches scrolling
  // containers too) and resize. Also refresh every ~500ms as a safety net for
  // DOM mutations we don't observe directly.
  const markDirty = () => {
    rectsDirty = true;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerover", onOver, { passive: true });
  window.addEventListener("scroll", markDirty, { passive: true, capture: true });
  window.addEventListener("resize", markDirty, { passive: true });

  refreshRects();

  const tick = () => {
    frameCounter += 1;

    const lerp = 0.18;
    const prevX = state.smoothX;
    const prevY = state.smoothY;
    state.smoothX += (state.x - state.smoothX) * lerp;
    state.smoothY += (state.y - state.smoothY) * lerp;

    // Velocity — heavy low-pass so the field-mesh trail reads as a coherent
    // gesture rather than per-frame jitter.
    const dx = state.smoothX - prevX;
    const dy = state.smoothY - prevY;
    state.vx = state.vx * 0.75 + dx * 0.25;
    state.vy = state.vy * 0.75 + dy * 0.25;
    state.speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);

    // Safety-net refresh every 30 frames (~500ms at 60fps) for DOM mutations
    // we don't get a direct scroll/resize signal for (filters, search, etc.)
    if (rectsDirty || frameCounter % 30 === 0) {
      refreshRects();
    }

    // Nearest interactive element — single pass over the cached rect list.
    // Distance is to the nearest point on the rect, not the centre, so a
    // 400-px-wide button is "close" everywhere along its edge.
    let bestEl: Element | null = null;
    let bestRect: DOMRect | null = null;
    let bestDist = Infinity;
    let bestX = 0;
    let bestY = 0;
    const cx = state.smoothX;
    const cy = state.smoothY;
    for (let i = 0; i < rectsCache.length; i++) {
      const r = rectsCache[i].rect;
      const px = Math.max(r.left, Math.min(cx, r.right));
      const py = Math.max(r.top, Math.min(cy, r.bottom));
      const ddx = px - cx;
      const ddy = py - cy;
      const d = Math.sqrt(ddx * ddx + ddy * ddy);
      if (d < bestDist) {
        bestDist = d;
        bestEl = rectsCache[i].el;
        bestRect = r;
        bestX = px;
        bestY = py;
      }
    }
    state.nearestEl = bestEl;
    state.nearestRect = bestRect;
    state.nearestDist = bestDist;
    state.nearestX = bestX;
    state.nearestY = bestY;

    // Keep --mx / --my available for any CSS consumers that want to follow
    // the cursor (used by the field-mesh blend tuning and any future hover
    // styles that need a pointer position).
    const root = document.documentElement;
    root.style.setProperty("--mx", `${cx}px`);
    root.style.setProperty("--my", `${cy}px`);

    subscribers.forEach((cb) => {
      try {
        cb(state);
      } catch {
        // Swallow subscriber errors so one bad layer can't kill the rAF loop.
      }
    });

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * Subscribe to per-frame pointer state. Returns an unsubscribe function.
 *
 * The pointer system lazily initializes on first subscribe; it never tears
 * down (the rAF loop is module-singleton, designed to outlive any single
 * component mount). Browsers throttle rAF on hidden tabs, so the idle cost
 * is negligible.
 */
export function subscribePointer(cb: Subscriber): () => void {
  if (typeof window === "undefined") return () => {};
  init();
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

/** Read the current pointer state without subscribing (debug / one-shot reads). */
export function getPointerState(): Readonly<PointerState> {
  return state;
}

/** Force a bbox refresh — call after large layout shifts that scroll/resize miss. */
export function invalidatePointerRects(): void {
  rectsDirty = true;
}
