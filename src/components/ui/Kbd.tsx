import { cn } from "@/lib/cn";

/** Keyboard-key glyph for the shortcut overlay. */
export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[1.4rem] px-1.5 py-0.5",
        "border border-[rgb(var(--rule)/0.20)] rounded-[3px]",
        "bg-[rgb(var(--surface)/0.6)] text-[0.6875rem] tracking-wider",
        "font-medium text-foreground",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
