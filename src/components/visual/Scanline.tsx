/**
 * A faint horizontal scanline that drifts down the page every ~10s.
 * Pure CSS animation — paused under prefers-reduced-motion via globals.css.
 */
export function Scanline() {
  return (
    <div
      aria-hidden="true"
      className="scanline pointer-events-none fixed inset-x-0 top-0 z-[2] h-[3px]"
    />
  );
}
