"use client";

import * as React from "react";

/**
 * Fake Windows Blue Screen of Death easter egg.
 * Triggered by typing "crash". Shows a mock BSOD with a countdown
 * from 5 then auto-dismisses. Esc cancels early.
 */
export function BSOD({
  active,
  onClose,
}: {
  active: boolean;
  onClose: () => void;
}) {
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    if (!active) return;
    let remaining = 5;
    const interval = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        window.clearInterval(interval);
        onClose();
      }
    }, 1000);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.clearInterval(interval);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose]);

  if (!active) return null;

  const pct = Math.max(0, (5 - countdown) * 20);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[70] bg-[rgb(var(--accent))] flex flex-col justify-center overflow-hidden select-none"
    >
      <div className="mx-auto w-full max-w-[72rem] px-10 md:px-20 py-16 font-mono text-white">
        {/* Sad face */}
        <p className="text-[5rem] md:text-[7rem] leading-none mb-6">:(</p>

        {/* Main message */}
        <p className="text-[1.1rem] md:text-[1.4rem] font-medium leading-snug mb-8 max-w-2xl">
          Your personal website ran into a problem and needs to restart.
          We&apos;re just collecting some error info, and then we&apos;ll
          restart for you.
        </p>

        {/* Percentage */}
        <p className="text-[1.4rem] md:text-[2rem] mb-10 tabular-nums">
          {pct}% complete
        </p>

        {/* Support link */}
        <p className="text-[0.8125rem] text-white/70 mb-8">
          For more information about this issue and possible fixes, visit:
          <br />
          <span className="text-white">https://verneylmavt.vercel.app</span>
        </p>

        {/* Stop code block */}
        <div className="space-y-0.5 text-[0.75rem] text-white/70">
          <p>
            <span className="text-white">Stop Code: </span>
            EXCEPTION_NOT_HANDLED
          </p>
          <p>
            <span className="text-white">What Failed: </span>
            verneylmavt.dll
          </p>
          <p>
            <span className="text-white">Memory Address: </span>
            0x00FF3A17
          </p>
        </div>

        {/* Countdown */}
        <p className="mt-8 text-[0.6875rem] tracking-[0.06em] uppercase text-white/50">
          Restarting in {countdown}… · [ esc to dismiss ]
        </p>
      </div>
    </div>
  );
}
