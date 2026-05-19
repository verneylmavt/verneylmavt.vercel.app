"use client";

import * as React from "react";

type ClockParts = {
  /** "HH:MM:SS" (or "HH:MM" if seconds disabled). "--:--:--" during SSR. */
  time: string;
  /** Short tz abbreviation (e.g. "JKT", "WIB"). */
  zone: string;
};

/**
 * tz-aware ticking clock. Default Asia/Jakarta. Updates every 1s by default,
 * or every 60s under reduced-motion or when `slow=true`.
 *
 * Built on `useSyncExternalStore` so SSR renders `--:--:--` and the client
 * starts ticking after hydration without any setState-in-effect.
 */
export function useLocalClock(opts?: {
  timeZone?: string;
  zoneLabel?: string;
  withSeconds?: boolean;
  slow?: boolean;
}): ClockParts {
  const {
    timeZone = "Asia/Jakarta",
    zoneLabel = "JKT",
    withSeconds = true,
    slow = false,
  } = opts ?? {};

  const fmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        ...(withSeconds ? { second: "2-digit" } : {}),
        hour12: false,
        timeZone,
      }),
    [timeZone, withSeconds],
  );

  const subscribe = React.useCallback(
    (callback: () => void) => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const intervalMs = prefersReduced || slow ? 60_000 : 1_000;
      const id = window.setInterval(callback, intervalMs);
      return () => window.clearInterval(id);
    },
    [slow],
  );

  const getSnapshot = React.useCallback(
    () => fmt.format(new Date()),
    [fmt],
  );

  const getServerSnapshot = React.useCallback(
    () => (withSeconds ? "--:--:--" : "--:--"),
    [withSeconds],
  );

  const time = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { time, zone: zoneLabel };
}
