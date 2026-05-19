import { cn } from "@/lib/cn";

export function Hairline({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("hairline w-full", className)} />;
}
