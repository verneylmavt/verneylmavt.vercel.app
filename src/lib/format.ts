/** Pad a 1-based index to a fixed width (e.g. padIndex(3) → "03"). */
export function padIndex(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}

/** Format a date range like "2024 — 2025" or single year "2025". */
export function formatRange(start: string | undefined, end: string | undefined): string {
  const s = start?.trim();
  const e = end?.trim();
  if (!s && !e) return "";
  if (!e || e === s) return s || e || "";
  return `${s} — ${e}`;
}

/** Strip the protocol/path from a URL for display ("github.com/x/y"). */
export function compactUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

/** Returns YYYY-MM-DD HH:MM:SS for a given Date in a TZ-aware way. */
export function formatTimestamp(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

/** Sort tools alphabetically (case-insensitive). */
export function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  );
}
