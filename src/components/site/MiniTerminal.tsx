"use client";

import * as React from "react";
import type { SiteContent } from "@/content/site";
import { useTheme, type ThemePreference } from "@/components/ThemeProvider";
import { cn } from "@/lib/cn";

type LogEntry = { input: string; output: React.ReactNode };

const SECTION_ALIASES: Record<string, string> = {
  home: "top",
  about: "about",
  edu: "education",
  education: "education",
  work: "experience",
  experience: "experience",
  tools: "tools",
  certs: "certifications",
  certifications: "certifications",
  projects: "projects",
  project: "projects",
  contact: "contact",
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }
}

export function MiniTerminal({
  open,
  onClose,
  site,
  onToggleDiag,
  onShowMatrix,
  onWarp,
  onCrash,
  onGlitch,
  onToggleCRT,
}: {
  open: boolean;
  onClose: () => void;
  site: SiteContent;
  /** Toggles Diagnostic Mode (the Konami-code easter egg). */
  onToggleDiag?: () => void;
  /** Activates Matrix Rain (the typed-`matrix` easter egg). */
  onShowMatrix?: () => void;
  /** Activates Hyperspeed Warp. */
  onWarp?: () => void;
  /** Activates BSOD. */
  onCrash?: () => void;
  /** Activates Glitch Storm. */
  onGlitch?: () => void;
  /** Toggles CRT Mode. */
  onToggleCRT?: () => void;
}) {
  const { setTheme } = useTheme();
  const [log, setLog] = React.useState<LogEntry[]>(() => [
    {
      input: "",
      output: (
        <>
          {"interactive shell — type "}
          <span className="text-[rgb(var(--accent))]">help</span>{" "}
          {"for commands, "}
          <span className="text-[rgb(var(--accent))]">exit</span>
          {" to close."}
        </>
      ),
    },
  ]);
  const [current, setCurrent] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Focus the input when opened
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Auto-scroll log to the latest entry
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [log, open]);

  const append = React.useCallback(
    (input: string, output: React.ReactNode) => {
      setLog((prev) => [...prev, { input, output }]);
    },
    [],
  );

  const run = React.useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) {
        setCurrent("");
        return;
      }

      const [name, ...args] = cmd.split(/\s+/);
      const lower = name.toLowerCase();

      switch (lower) {
        case "help": {
          append(
            cmd,
            <ul className="ml-2 grid gap-0.5">
              <li className="mt-1 pt-1 border-t border-[rgb(var(--rule)/0.12)] text-muted-soft">
                {"// main"}
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">help</span> — list
                commands
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">whoami</span> — who
                runs this site
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">ls</span> — list
                sections
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">cat about.md</span>{" "}
                — show the about paragraph
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">
                  go &lt;section&gt;
                </span>{" "}
                — jump to a section
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">
                  theme &lt;light|dark|system&gt;
                </span>{" "}
                — switch theme
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">clear</span> — empty
                history
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">exit</span> — close
                terminal
              </li>
              <li className="mt-1 pt-1 border-t border-[rgb(var(--rule)/0.12)] text-muted-soft">
                {"// easter egg"}
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">diag</span> — toggle
                the diagnostic mode
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">glitch</span> — unleash
                the glitch storm mode
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">crt</span> — toggle
                the crt monitor mode
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">matrix</span> — enter
                the matrix mode
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">warp</span> — engage into
                the hyperspeed mode
              </li>
              <li>
                <span className="text-[rgb(var(--accent))]">crash</span> — trigger
                the bsod mode
              </li>
            </ul>,
          );
          break;
        }
        case "whoami": {
          append(cmd, `${site.name.toLowerCase()} (${site.roleTitle.toLowerCase()})`);
          break;
        }
        case "ls": {
          append(
            cmd,
            "about/  education/  experience/  tools/  certifications/  projects/  contact/",
          );
          break;
        }
        case "cat": {
          const file = (args[0] ?? "").toLowerCase();
          if (file === "about.md") {
            append(cmd, site.about.paragraph);
          } else if (file === "") {
            append(cmd, <span className="text-muted-soft">cat: missing operand</span>);
          } else {
            append(
              cmd,
              <span className="text-muted-soft">cat: {file}: no such file</span>,
            );
          }
          break;
        }
        case "go": {
          const target = (args[0] ?? "").toLowerCase();
          const sectionId = SECTION_ALIASES[target];
          if (!sectionId) {
            append(
              cmd,
              <span className="text-muted-soft">
                go: unknown section &apos;{target}&apos;. try: about, work, projects, …
              </span>,
            );
          } else {
            append(cmd, `jumping → ${sectionId}`);
            setTimeout(() => {
              scrollToSection(sectionId);
              onClose();
            }, 250);
          }
          break;
        }
        case "theme": {
          const next = (args[0] ?? "").toLowerCase();
          if (next === "light" || next === "dark" || next === "system") {
            setTheme(next as ThemePreference);
            append(cmd, `theme set to ${next}`);
          } else {
            append(
              cmd,
              <span className="text-muted-soft">
                theme: expected one of light, dark, system
              </span>,
            );
          }
          break;
        }
        case "diag":
        case "diagnostic": {
          if (onToggleDiag) {
            onToggleDiag();
            append(cmd, "diagnostic mode toggled · esc to dismiss");
          } else {
            append(
              cmd,
              <span className="text-muted-soft">diag: not available here</span>,
            );
          }
          break;
        }
        case "matrix": {
          if (onShowMatrix) {
            onShowMatrix();
            append(cmd, "entering the matrix · esc to dismiss");
            setTimeout(() => onClose(), 250);
          } else {
            append(
              cmd,
              <span className="text-muted-soft">matrix: not available here</span>,
            );
          }
          break;
        }
        case "warp": {
          if (onWarp) {
            onWarp();
            append(cmd, "engaging warp drive · esc to dismiss");
            setTimeout(() => onClose(), 250);
          } else {
            append(
              cmd,
              <span className="text-muted-soft">warp: not available here</span>,
            );
          }
          break;
        }
        case "crash": {
          if (onCrash) {
            onCrash();
            append(cmd, "triggering bsod · esc to dismiss");
            setTimeout(() => onClose(), 250);
          } else {
            append(
              cmd,
              <span className="text-muted-soft">crash: not available here</span>,
            );
          }
          break;
        }
        case "glitch": {
          if (onGlitch) {
            onGlitch();
            append(cmd, "glitch storm toggled · type glitch again to exit");
          } else {
            append(
              cmd,
              <span className="text-muted-soft">glitch: not available here</span>,
            );
          }
          break;
        }
        case "crt": {
          if (onToggleCRT) {
            onToggleCRT();
            append(cmd, "crt mode toggled · type crt again to exit");
          } else {
            append(
              cmd,
              <span className="text-muted-soft">crt: not available here</span>,
            );
          }
          break;
        }
        case "clear": {
          setLog([]);
          break;
        }
        case "exit":
        case "quit": {
          onClose();
          break;
        }
        default: {
          append(
            cmd,
            <span className="text-muted-soft">command not found: {lower}</span>,
          );
        }
      }
      setCurrent("");
    },
    [append, onClose, setTheme, site, onToggleDiag, onShowMatrix, onWarp, onCrash, onGlitch, onToggleCRT],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      run(current);
      return;
    }
    // Ctrl/Cmd + D → exit (terminal convention)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label="Mini terminal"
      className={cn(
        "max-w-2xl w-full max-h-[40vh] overflow-y-auto",
        "border border-[rgb(var(--accent)/0.4)] rounded-[2px]",
        "bg-[rgb(var(--surface)/0.85)] backdrop-blur",
        "px-3 py-2 text-[0.875rem] leading-[1.5] font-mono",
      )}
    >
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[0.6875rem] uppercase tracking-[0.06em] text-muted-soft">
          {"// terminal"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-[0.6875rem] uppercase tracking-[0.04em] text-muted hover:text-foreground"
          aria-label="Close terminal"
        >
          [ esc ]
        </button>
      </div>

      <ul className="space-y-1">
        {log.map((entry, i) => (
          <li key={i} className="text-[0.8125rem]">
            {entry.input ? (
              <div className="flex items-baseline gap-2">
                <span className="text-[rgb(var(--accent))]">$</span>
                <span className="text-foreground">{entry.input}</span>
              </div>
            ) : null}
            <div className="text-muted whitespace-pre-wrap">{entry.output}</div>
          </li>
        ))}
      </ul>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[rgb(var(--accent))]">$</span>
        <input
          ref={inputRef}
          type="text"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="flex-1 bg-transparent border-0 outline-none text-foreground text-[0.8125rem] caret-[rgb(var(--accent))]"
          aria-label="Terminal input"
        />
      </div>
    </div>
  );
}
