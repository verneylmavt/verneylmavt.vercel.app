import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <p className="text-[0.75rem] uppercase tracking-[0.08em] text-muted-soft mb-3">
          {"// 404 — route not found"}
        </p>
        <h1 className="text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-[-0.02em] uppercase text-foreground">
          404
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-[1.6] text-muted">
          The path you requested could not be resolved. The build is fine; the
          URL is the bug.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 border border-[rgb(var(--rule)/0.18)] rounded-[2px] bg-[rgb(var(--surface)/0.4)] text-[0.75rem] uppercase tracking-[0.04em] text-foreground hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))]"
        >
          <span aria-hidden="true">←</span>
          <span>return home</span>
        </Link>
      </div>
    </main>
  );
}
