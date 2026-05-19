import * as React from "react";
import { cn } from "@/lib/cn";

type Position = "tl" | "tr" | "bl" | "br";

const PATHS: Record<Position, string> = {
  // 12x12 L-shape, stroke 1.25
  tl: "M 1 8 V 1 H 8",
  tr: "M 4 1 H 11 V 8",
  bl: "M 1 4 V 11 H 8",
  br: "M 4 11 H 11 V 4",
};

/**
 * A single L-shaped corner bracket. Compose four around a container to frame it.
 * Size in pixels (square). Color inherits via `currentColor`.
 */
export function Bracket({
  position,
  size = 12,
  className,
  strokeWidth = 1.25,
}: {
  position: Position;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const positionClass: Record<Position, string> = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      className={cn("absolute pointer-events-none", positionClass[position], className)}
    >
      <path d={PATHS[position]} />
    </svg>
  );
}

/** Renders all four corner brackets at once. Parent must be `position: relative`. */
export function BracketFrame({
  size = 12,
  className,
  strokeWidth = 1.25,
}: {
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <>
      <Bracket position="tl" size={size} strokeWidth={strokeWidth} className={className} />
      <Bracket position="tr" size={size} strokeWidth={strokeWidth} className={className} />
      <Bracket position="bl" size={size} strokeWidth={strokeWidth} className={className} />
      <Bracket position="br" size={size} strokeWidth={strokeWidth} className={className} />
    </>
  );
}
