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
import { StatusBar, type SiteMode } from "./StatusBar";
import { ViewportBrackets } from "@/components/visual/ViewportBrackets";
import { BootSequence } from "@/components/visual/BootSequence";
import { CursorCrosshair } from "@/components/visual/CursorCrosshair";
import {
  DiagnosticOverlay,
  readDiagnosticInitial,
} from "@/components/visual/DiagnosticOverlay";
import { MouseSpotlight } from "@/components/visual/MouseSpotlight";
import { Scanline } from "@/components/visual/Scanline";
import { MatrixRain } from "@/components/visual/MatrixRain";
import { HyperspeedWarp } from "@/components/visual/HyperspeedWarp";
import { BSOD } from "@/components/visual/BSOD";
import { GlitchStorm, readGlitchInitial } from "@/components/visual/GlitchStorm";
import { CRTMode, readCRTInitial } from "@/components/visual/CRTMode";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { CmdPalette, type PaletteItem } from "@/components/ui/CmdPalette";
import { ShortcutHelp } from "@/components/ui/ShortcutHelp";
import { ContextMenu, type ContextMenuItem } from "@/components/ui/ContextMenu";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useKonami } from "@/hooks/useKonami";
import { useTypedSequence } from "@/hooks/useTypedSequence";
import { useTheme } from "@/components/ThemeProvider";

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
  // Initial state must match server (false) for clean hydration. After mount,
  // restore from sessionStorage if user previously activated diagnostic mode.
  const [diagnosticOn, setDiagnosticOn] = React.useState<boolean>(false);
  const [matrixOn, setMatrixOn] = React.useState<boolean>(false);
  const [warpOn, setWarpOn] = React.useState<boolean>(false);
  const [bsodOn, setBsodOn] = React.useState<boolean>(false);
  const [glitchOn, setGlitchOn] = React.useState<boolean>(false);
  const [crtOn, setCrtOn] = React.useState<boolean>(false);
  const [ctxMenu, setCtxMenu] = React.useState<{
    open: boolean;
    x: number;
    y: number;
  }>({ open: false, x: 0, y: 0 });

  const { theme, resolvedTheme, cycleTheme } = useTheme();

  React.useEffect(() => {
    if (readDiagnosticInitial()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiagnosticOn(true);
    }
    if (readGlitchInitial()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGlitchOn(true);
    }
    if (readCRTInitial()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCrtOn(true);
    }
  }, []);

  // Konami code → diagnostic mode (kept as hidden alt trigger)
  useKonami(React.useCallback(() => setDiagnosticOn((v) => !v), []));
  // Typed "diag" → diagnostic mode (primary typed trigger)
  useTypedSequence(
    "diag",
    React.useCallback(() => setDiagnosticOn((v) => !v), []),
  );

  // Typed "matrix" → MatrixRain
  useTypedSequence(
    "matrix",
    React.useCallback(() => setMatrixOn(true), []),
  );
  // Typed "warp" → HyperspeedWarp
  useTypedSequence(
    "warp",
    React.useCallback(() => setWarpOn(true), []),
  );
  // Typed "crash" → BSOD
  useTypedSequence(
    "crash",
    React.useCallback(() => setBsodOn(true), []),
  );
  // Typed "glitch" → GlitchStorm (toggle)
  useTypedSequence(
    "glitch",
    React.useCallback(() => setGlitchOn((v) => !v), []),
  );
  // Typed "crt" → CRT Mode (toggle)
  useTypedSequence(
    "crt",
    React.useCallback(() => setCrtOn((v) => !v), []),
  );

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
      const input = document.getElementById(
        PROJECT_SEARCH_ID,
      ) as HTMLInputElement | null;
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
      setCtxMenu((c) => ({ ...c, open: false }));
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
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
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

  const themeLabel =
    theme === "system" ? `system (${resolvedTheme})` : theme;

  // Cycle order for the StatusBar [mode: …] chip.
  // Only one persistent mode is active at a time; cycling turns the others off.
  const currentMode: SiteMode = diagnosticOn
    ? "diagnostic"
    : glitchOn
      ? "glitch storm"
      : crtOn
        ? "crt"
        : "default";

  const cycleMode = React.useCallback(() => {
    // Reset all persistent modes
    setDiagnosticOn(false);
    setGlitchOn(false);
    setCrtOn(false);

    // Activate the next mode in the cycle
    if (currentMode === "default") setDiagnosticOn(true);
    else if (currentMode === "diagnostic") setGlitchOn(true);
    else if (currentMode === "glitch storm") setCrtOn(true);
    // crt → default → leave everything off
  }, [currentMode]);

  const onContextMenu: React.MouseEventHandler<HTMLElement> = (e) => {
    if (e.shiftKey) return; // let native menu through
    e.preventDefault();
    setCtxMenu({ open: true, x: e.clientX, y: e.clientY });
  };

  const ctxItems: ContextMenuItem[] = React.useMemo(() => {
    return [
      {
        label: "open palette",
        hint: "⌘K",
        onSelect: () => setPaletteOpen(true),
      },
      { divider: true, label: "", onSelect: () => {} },
      {
        label: "jump to home",
        hint: "g h",
        onSelect: () => scrollToSection("top"),
      },
      {
        label: "jump to projects",
        hint: "g p",
        onSelect: () => scrollToSection("projects"),
      },
      {
        label: "jump to contact",
        hint: "g x",
        onSelect: () => scrollToSection("contact"),
      },
      { divider: true, label: "", onSelect: () => {} },
      {
        label: `theme: ${themeLabel}`,
        onSelect: () => cycleTheme(),
      },
      {
        label: "copy url",
        onSelect: () => {
          try {
            void navigator.clipboard?.writeText(window.location.href);
          } catch {
            // ignore
          }
        },
      },
      {
        label: "view source",
        external: true,
        onSelect: () =>
          window.open(
            "https://github.com/verneylmavt",
            "_blank",
            "noopener,noreferrer",
          ),
      },
    ];
  }, [scrollToSection, themeLabel, cycleTheme]);

  return (
    <>
      {/* First-paint boot sequence (once per session) */}
      <BootSequence />

      {/* Ambient layers */}
      <MouseSpotlight />
      <Scanline />

      {/* Cursor crosshair — desktop, non-reduced-motion only */}
      <CursorCrosshair />

      {/* Diagnostic mode — Konami toggle */}
      <DiagnosticOverlay
        active={diagnosticOn}
        onClose={() => setDiagnosticOn(false)}
        themeLabel={themeLabel}
      />

      {/* Matrix rain — typed "matrix" easter egg */}
      <MatrixRain
        active={matrixOn}
        onClose={() => setMatrixOn(false)}
      />

      {/* Hyperspeed warp — typed "warp" easter egg */}
      <HyperspeedWarp
        active={warpOn}
        onClose={() => setWarpOn(false)}
      />

      {/* BSOD — typed "crash" easter egg */}
      <BSOD
        active={bsodOn}
        onClose={() => setBsodOn(false)}
      />

      {/* Glitch Storm — typed "glitch" easter egg */}
      <GlitchStorm
        active={glitchOn}
        onClose={() => setGlitchOn(false)}
      />

      {/* CRT Mode — typed "crt" toggle easter egg */}
      <CRTMode
        active={crtOn}
        onClose={() => setCrtOn(false)}
      />

      <ViewportBrackets />
      <ScrollIndicator />

      <div onContextMenu={onContextMenu}>
        <Header
          handle={content.handle}
          sections={SECTIONS}
          activeId={activeId}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <main id="main" className="flex-1 pb-12">
          <Hero
            site={content}
            onToggleDiag={() => setDiagnosticOn((v) => !v)}
            onShowMatrix={() => setMatrixOn(true)}
            onWarp={() => setWarpOn(true)}
            onCrash={() => setBsodOn(true)}
            onGlitch={() => setGlitchOn(true)}
            onToggleCRT={() => setCrtOn((v) => !v)}
          />
          <About site={content} />
          <Education site={content} />
          <Experience site={content} />
          <Tools site={content} />
          <Certifications site={content} />
          <Projects site={content} />
          <Contact site={content} />
        </main>

        <Footer />
      </div>

      <StatusBar
        onOpenHelp={() => setHelpOpen((v) => !v)}
        mode={currentMode}
        onCycleMode={cycleMode}
      />

      <CmdPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={paletteItems} />
      <ShortcutHelp
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        onToggleDiag={() => setDiagnosticOn((v) => !v)}
        onShowMatrix={() => setMatrixOn(true)}
        onWarp={() => setWarpOn(true)}
        onCrash={() => setBsodOn(true)}
        onGlitch={() => setGlitchOn(true)}
        onToggleCRT={() => setCrtOn((v) => !v)}
      />
      <ContextMenu
        open={ctxMenu.open}
        anchor={{ x: ctxMenu.x, y: ctxMenu.y }}
        items={ctxItems}
        onClose={() => setCtxMenu((c) => ({ ...c, open: false }))}
      />
    </>
  );
}
