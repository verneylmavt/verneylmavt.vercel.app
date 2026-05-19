import { Bracket } from "@/components/ui/Bracket";

/**
 * Four corner brackets fixed at the viewport corners. Renders md+ only —
 * the brackets feel cramped on small screens. Purely decorative (aria-hidden).
 */
export function ViewportBrackets() {
  const offset = "1.25rem";
  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none fixed inset-0 z-20 text-foreground/50"
    >
      <div className="absolute" style={{ top: offset, left: offset }}>
        <Bracket position="tl" size={14} className="!static" />
      </div>
      <div className="absolute" style={{ top: offset, right: offset }}>
        <Bracket position="tr" size={14} className="!static" />
      </div>
      <div className="absolute" style={{ bottom: offset, left: offset }}>
        <Bracket position="bl" size={14} className="!static" />
      </div>
      <div className="absolute" style={{ bottom: offset, right: offset }}>
        <Bracket position="br" size={14} className="!static" />
      </div>
    </div>
  );
}
