"use client";

import * as React from "react";

/**
 * Tracks which section anchor is currently most visible via IntersectionObserver.
 * Lifted from v2's SitePage.useActiveSection (see v2/src/components/site/SitePage.tsx:29).
 */
export function useActiveSection(sectionIds: string[]): string | undefined {
  const [activeId, setActiveId] = React.useState<string | undefined>(
    sectionIds[0],
  );

  React.useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          );

        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.id) setActiveId(top.id);
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.4, 0.6],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join("|")]);

  return activeId;
}
