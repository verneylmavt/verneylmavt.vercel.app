import { cn } from "@/lib/cn";

/** Accessible blinking block caret (visual only, aria-hidden). */
export function BlinkingCaret({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("caret ml-[0.2em]", className)} />;
}
