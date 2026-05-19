"use client";

import * as React from "react";
import type { SiteContent } from "@/content/site";
import { Header, type NavSection } from "./Header";
import { Hero } from "./Hero";
import { About } from "./About";
import { Education } from "./Education";
import { Experience } from "./Experience";
import { Tools } from "./Tools";
import { Certifications } from "./Certifications";
import { Projects, PROJECT_SEARCH_ID } from "./Projects";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { StatusBar } from "./StatusBar";
import { ViewportBrackets } from "@/components/visual/ViewportBrackets";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { CmdPalette, type PaletteItem } from "@/components/ui/CmdPalette";
import { ShortcutHelp } from "@/components/ui/ShortcutHelp";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

const SECTIONS: NavSection[] = [
  { id: "top", label: "home" },
  { id: "about", label: "about" },
  { id: "education", label: "edu" },
  { id: "experience", label: "work" },
  { id: "tools", label: "tools" },
  { id: "certifications", label: "certs" },
  { id: "projects", label: "projects" },
  { id: "contact", label: "contact" },
];

export function SitePage({ content }: { content: SiteContent }) {
  const sectionIds = React.useMemo(() => SECTIONS.map((s) => s.id), []);
  const activeId = useActiveSection(sectionIds);

  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);

  const scrollToSection = React.useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  }, []);

  const focusSearch = React.useCallback(() => {
    scrollToSection("projects");
    setTimeout(() => {
      const input = document.getElementById(PROJECT_SEARCH_ID) as HTMLInputElement | null;
      input?.focus();
    }, 200);
  }, [scrollToSection]);

  useGlobalShortcuts({
    onJumpSection: scrollToSection,
    onFocusSearch: focusSearch,
    onOpenHelp: () => setHelpOpen((v) => !v),
    onCloseOverlays: () => {
      setPaletteOpen(false);
      setHelpOpen(false);
    },
    onOpenCommandPalette: () => setPaletteOpen((v) => !v),
  });

  // Reset scroll position on mount (mirrors v2 behaviour)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      // Let the browser jump to the hash naturally, but strip from URL afterward.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Build palette items
  const paletteItems = React.useMemo<PaletteItem[]>(() => {
    const items: PaletteItem[] = [];
    for (const s of SECTIONS) {
      items.push({
        id: `sec-${s.id}`,
        label: s.label,
        group: "sections",
        sectionId: s.id,
      });
    }
    for (const p of content.projects) {
      items.push({
        id: `proj-${p.slug}`,
        label: p.title,
        group: "projects",
        href: p.demoUrl || p.repoUrl,
        hint: p.demoUrl ? "demo ↗" : p.repoUrl ? "repo ↗" : undefined,
      });
    }
    for (const c of content.contacts) {
      items.push({
        id: `lnk-${c.label}`,
        label: c.label,
        group: "links",
        href: c.href,
      });
    }
    if (content.links?.resume) {
      items.push({
        id: "lnk-resume",
        label: "Resume",
        group: "links",
        href: content.links.resume,
      });
    }
    return items;
  }, [content]);

  return (
    <>
      <ViewportBrackets />
      <ScrollIndicator />

      <Header
        handle={content.handle}
        sections={SECTIONS}
        activeId={activeId}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main id="main" className="flex-1 pb-12">
        <Hero site={content} />
        <About site={content} />
        <Education site={content} />
        <Experience site={content} />
        <Tools site={content} />
        <Certifications site={content} />
        <Projects site={content} />
        <Contact site={content} />
      </main>

      <Footer />

      <StatusBar availability={content.availability} />

      <CmdPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={paletteItems} />
      <ShortcutHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
