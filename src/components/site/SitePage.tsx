"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import type { ContactLink, ProjectItem, SiteContent, ToolCategory } from "@/content/site";
import { Icon } from "@/components/icon";
import { Header, type NavSection } from "@/components/site/Header";
import { cn } from "@/lib/cn";

const TOOL_CATEGORIES: ToolCategory[] = [
  "AI/ML",
  "Data",
  "Backend",
  "Frontend",
  "Cloud/Infra",
  "Workflow",
  "Hardware",
];

type CommandItem = {
  id: string;
  label: string;
  meta: string;
  action: () => void;
};

function formatRange(start: string, end: string): string {
  const s = start?.trim();
  const e = end?.trim();
  if (!s && !e) return "";
  if (!e || e === s) return s || e;
  return `${s} - ${e}`;
}

function sectionIndex(index: number): string {
  return String(index).padStart(2, "0");
}

function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | undefined>(sectionIds[0]);

  React.useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const target = visible[0]?.target as HTMLElement | undefined;
        if (target?.id) setActiveId(target.id);
      },
      {
        root: null,
        rootMargin: "-32% 0px -58% 0px",
        threshold: [0.1, 0.25, 0.45, 0.65],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

function useScrollProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

function goToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "smooth" });
}

function Section({
  id,
  index,
  title,
  label,
  children,
}: {
  id: string;
  index: string;
  title: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-16 border-t border-border/25"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <div className="border-b border-border/20 px-5 py-5 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <p className="text-xs uppercase text-muted">{index}</p>
          <p className="mt-2 max-w-[18ch] text-xs uppercase leading-relaxed">{label}</p>
        </div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="px-5 py-12 sm:px-8 lg:px-10 lg:py-16"
        >
          <h2
            id={`${id}-title`}
            className="text-[clamp(2.3rem,7vw,7rem)] font-black uppercase leading-[0.9]"
          >
            {title}
          </h2>
          <div className="mt-10">{children}</div>
        </motion.div>
      </div>
    </section>
  );
}

function CommandPalette({
  isOpen,
  commands,
  onClose,
}: {
  isOpen: boolean;
  commands: CommandItem[];
  onClose: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClose = React.useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  const filteredCommands = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.meta}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  React.useEffect(() => {
    if (!isOpen) return;
    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
      if (event.key === "Enter" && filteredCommands[0]) {
        event.preventDefault();
        filteredCommands[0].action();
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredCommands, handleClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-foreground/22 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="mx-auto mt-20 max-w-3xl border border-border bg-background shadow-[8px_8px_0_rgb(var(--foreground))]">
        <div className="grid grid-cols-[1fr_auto] border-b border-border">
          <div className="px-4 py-3">
            <p id="command-title" className="text-xs uppercase text-muted">
              Command index
            </p>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Jump to a section, project, or contact..."
              className="mt-2 w-full bg-transparent text-base uppercase outline-none placeholder:text-muted/60 sm:text-xl"
            />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="focus-ring border-l border-border px-5 text-xs uppercase transition hover:bg-foreground hover:text-background"
          >
            Esc
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredCommands.length ? (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                type="button"
                onClick={() => {
                  command.action();
                  handleClose();
                }}
                className="focus-ring grid w-full grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-border/20 px-4 py-3 text-left text-xs uppercase transition last:border-b-0 hover:bg-foreground hover:text-background"
              >
                <span className="text-muted group-hover:text-current">
                  {sectionIndex(index + 1)}
                </span>
                <span>{command.label}</span>
                <span className="hidden text-muted sm:block">{command.meta}</span>
              </button>
            ))
          ) : (
            <p className="px-4 py-8 text-xs uppercase text-muted">No command found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DataCell({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-t border-border/20 py-4">
      <p className="text-[11px] uppercase text-muted">{label}</p>
      <div className="mt-2 text-sm leading-relaxed">{value}</div>
    </div>
  );
}

function ContactLinkButton({ contact }: { contact: ContactLink }) {
  return (
    <a
      href={contact.href}
      target={contact.href.startsWith("http") ? "_blank" : undefined}
      rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="focus-ring group inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase transition hover:bg-foreground hover:text-background"
    >
      <Icon name={contact.icon} className="h-3.5 w-3.5" />
      {contact.label}
    </a>
  );
}

export function SitePage({ content }: { content: SiteContent }) {
  const sections = React.useMemo<NavSection[]>(
    () => [
      { id: "top", label: "Home", index: "00" },
      { id: "about", label: "About", index: "01" },
      { id: "education", label: "Education", index: "02" },
      { id: "experience", label: "Works", index: "03" },
      { id: "tools", label: "Tools", index: "04" },
      { id: "certifications", label: "Certs", index: "05" },
      { id: "projects", label: "Projects", index: "06" },
      { id: "contact", label: "Contact", index: "07" },
    ],
    [],
  );

  const sectionIds = React.useMemo(() => sections.map((section) => section.id), [sections]);
  const activeId = useActiveSection(sectionIds);
  const scrollProgress = useScrollProgress();
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [projectQuery, setProjectQuery] = React.useState("");
  const [projectTag, setProjectTag] = React.useState("All");
  const [selectedProjectSlug, setSelectedProjectSlug] = React.useState(
    content.projects[0]?.slug ?? "",
  );

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsCommandOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const projectTags = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of content.projects) {
      for (const tag of new Set(project.tags ?? [])) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [content.projects]);

  const filteredProjects = React.useMemo(() => {
    const query = projectQuery.trim().toLowerCase();
    return content.projects.filter((project) => {
      if (projectTag !== "All" && !(project.tags ?? []).includes(projectTag)) return false;
      if (!query) return true;
      return `${project.title} ${project.description} ${(project.tags ?? []).join(" ")}`
        .toLowerCase()
        .includes(query);
    });
  }, [content.projects, projectQuery, projectTag]);

  const selectedProject =
    filteredProjects.find((project) => project.slug === selectedProjectSlug) ??
    filteredProjects[0] ??
    content.projects[0];

  const toolsByCategory = React.useMemo(() => {
    const grouped = new Map<ToolCategory, SiteContent["tools"]>();
    for (const category of TOOL_CATEGORIES) grouped.set(category, []);
    for (const tool of content.tools) {
      grouped.set(tool.category, [...(grouped.get(tool.category) ?? []), tool]);
    }
    return grouped;
  }, [content.tools]);

  const commands = React.useMemo<CommandItem[]>(() => {
    const sectionCommands = sections.map((section) => ({
      id: `section-${section.id}`,
      label: `${section.index} / ${section.label}`,
      meta: "section",
      action: () => goToId(section.id),
    }));

    const projectCommands = content.projects.map((project) => ({
      id: `project-${project.slug}`,
      label: project.title,
      meta: "project",
      action: () => {
        setSelectedProjectSlug(project.slug);
        setProjectTag("All");
        setProjectQuery("");
        goToId("projects");
      },
    }));

    const contactCommands = content.contacts.map((contact) => ({
      id: `contact-${contact.label}`,
      label: contact.label,
      meta: "contact",
      action: () => {
        if (contact.href.startsWith("http")) window.open(contact.href, "_blank", "noopener");
        else window.location.href = contact.href;
      },
    }));

    return [...sectionCommands, ...projectCommands, ...contactCommands];
  }, [content.contacts, content.projects, sections]);

  return (
    <>
      <Header
        siteName={content.handle}
        sections={sections}
        activeId={activeId}
        scrollProgress={scrollProgress}
        onOpenCommand={() => setIsCommandOpen(true)}
      />
      <CommandPalette
        isOpen={isCommandOpen}
        commands={commands}
        onClose={() => setIsCommandOpen(false)}
      />

      <main className="min-h-screen">
        <section
          id="top"
          aria-label="Home"
          className="scroll-mt-16 border-b border-border/25"
        >
          <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_1fr]">
            <aside className="grid border-b border-border/20 lg:border-b-0 lg:border-r">
              <div className="px-5 py-6 lg:px-6">
                <p className="text-xs uppercase text-muted">System</p>
                <p className="mt-3 text-sm uppercase leading-relaxed">
                  v4 / Swiss engineering interface
                </p>
              </div>
              <div className="grid content-end border-t border-border/20 px-5 py-6 text-xs uppercase leading-relaxed lg:px-6">
                <p>{content.location}</p>
                <p className="mt-3 text-muted">Branch: v4</p>
                <p className="text-muted">Mode: light grid</p>
              </div>
            </aside>

            <div className="grid grid-rows-[1fr_auto]">
              <div className="px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <div>
                    <p className="text-xs uppercase text-muted">{content.roleTitle}</p>
                    <h1 className="mt-7 max-w-5xl text-[clamp(3.6rem,12vw,12rem)] font-black uppercase leading-[0.82]">
                      {content.name}
                    </h1>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {content.contacts.map((contact) => (
                        <ContactLinkButton key={contact.label} contact={contact} />
                      ))}
                    </div>
                  </div>

                  <div className="grid content-between border border-border bg-surface">
                    <div className="border-b border-border p-4">
                      <p className="text-xs uppercase text-muted">Code status</p>
                      <div className="mt-5 grid gap-3 text-xs uppercase">
                        <p className="flex justify-between border-t border-border/20 pt-3">
                          <span>Build</span>
                          <span className="text-accent">Next.js</span>
                        </p>
                        <p className="flex justify-between border-t border-border/20 pt-3">
                          <span>Type</span>
                          <span>Portfolio</span>
                        </p>
                        <p className="flex justify-between border-t border-border/20 pt-3">
                          <span>Stack</span>
                          <span>AI / Cloud</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCommandOpen(true)}
                      className="focus-ring grid grid-cols-[1fr_auto] items-center border-t border-border px-4 py-4 text-left text-xs uppercase transition hover:bg-foreground hover:text-background"
                    >
                      Open command palette
                      <span>Ctrl K</span>
                    </button>
                  </div>
                </div>
              </div>

              <nav className="grid border-t border-border/25 text-xs uppercase sm:grid-cols-4 lg:grid-cols-8">
                {sections.slice(1).map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="focus-ring flex min-h-16 items-center justify-between border-t border-border/20 px-4 transition hover:bg-foreground hover:text-background sm:border-r sm:border-t-0"
                  >
                    <span>{section.label}</span>
                    <span className="text-muted">{section.index}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </section>

        <Section id="about" index="01" title="About" label="Profile matrix">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="border-y border-border/25">
              <DataCell label="Current thesis" value={content.about.paragraph} />
              <DataCell
                label="Location"
                value={content.location ?? "Open to remote collaboration"}
              />
              <DataCell
                label="Contact vector"
                value={
                  <div className="flex flex-wrap gap-2">
                    {content.contacts.map((contact) => (
                      <ContactLinkButton key={`about-${contact.label}`} contact={contact} />
                    ))}
                  </div>
                }
              />
            </div>
            <div className="grid gap-3">
              {content.about.focus.map((item, index) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[52px_1fr_auto] items-center border border-border bg-surface"
                >
                  <span className="border-r border-border px-4 py-5 text-xs text-muted">
                    {sectionIndex(index + 1)}
                  </span>
                  <span className="px-4 text-sm uppercase">{item.label}</span>
                  <Icon name={item.icon} className="mr-4 h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="education" index="02" title="Education" label="Academic ledger">
          <div className="border-t border-border">
            {content.education.map((item, index) => (
              <article
                key={`${item.institution}-${item.start}`}
                className="grid gap-4 border-b border-border/25 py-5 md:grid-cols-[72px_160px_1fr]"
              >
                <p className="text-xs text-muted">{sectionIndex(index + 1)}</p>
                <p className="text-xs uppercase">{formatRange(item.start, item.end)}</p>
                <div>
                  <h3 className="text-lg font-bold uppercase leading-tight">{item.title}</h3>
                  <p className="mt-2 text-sm uppercase text-muted">{item.institution}</p>
                  {item.description ? (
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="experience" index="03" title="Works" label="Experience ledger">
          <div className="border-t border-border">
            {content.workExperience.map((work, index) => (
              <article
                key={`${work.company}-${work.start}`}
                className="grid gap-4 border-b border-border/25 py-5 lg:grid-cols-[72px_150px_1fr_220px]"
              >
                <p className="text-xs text-muted">{sectionIndex(index + 1)}</p>
                <p className="text-xs uppercase">{formatRange(work.start, work.end)}</p>
                <div>
                  <h3 className="text-lg font-bold uppercase leading-tight">{work.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed">{work.summary}</p>
                </div>
                <div className="text-xs uppercase text-muted">
                  {work.companyUrl ? (
                    <a
                      href={work.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring underline"
                    >
                      {work.company}
                    </a>
                  ) : (
                    <p>{work.company}</p>
                  )}
                  {work.location ? <p className="mt-2">{work.location}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="tools" index="04" title="Tools" label="Engineering stack">
          <div className="grid gap-4 lg:grid-cols-2">
            {TOOL_CATEGORIES.map((category, index) => {
              const tools = toolsByCategory.get(category) ?? [];
              if (!tools.length) return null;

              return (
                <article key={category} className="border border-border bg-surface">
                  <div className="grid grid-cols-[64px_1fr] border-b border-border">
                    <p className="px-4 py-4 text-xs text-muted">{sectionIndex(index + 1)}</p>
                    <h3 className="px-4 py-4 text-xs font-bold uppercase">{category}</h3>
                  </div>
                  <div className="grid divide-y divide-border/20">
                    {tools.map((tool) => (
                      <div
                        key={tool.name}
                        className="grid grid-cols-[48px_1fr] items-center px-4 py-3"
                      >
                        <Icon name={tool.icon} className="h-4 w-4" />
                        <p className="text-sm uppercase">{tool.name}</p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section id="certifications" index="05" title="Certs" label="Proof links">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.certifications.map((cert, index) => (
              <article key={`${cert.title}-${cert.date}`} className="border border-border bg-surface">
                <div className="grid grid-cols-[1fr_auto] border-b border-border">
                  <div className="p-4">
                    <p className="text-xs text-muted">{sectionIndex(index + 1)}</p>
                    <h3 className="mt-4 text-sm font-bold uppercase">{cert.title}</h3>
                    <p className="mt-2 text-xs uppercase text-muted">{cert.date}</p>
                  </div>
                  <a
                    href={cert.proofUrl ?? cert.badgeImagePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring grid w-14 place-items-center border-l border-border transition hover:bg-foreground hover:text-background"
                    aria-label={`Open proof for ${cert.title}`}
                  >
                    <Icon name="ExternalLink" className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex items-center justify-center p-6">
                  <Image
                    src={cert.badgeImagePath}
                    alt={`${cert.title} badge`}
                    width={140}
                    height={140}
                    loading="eager"
                    sizes="140px"
                    className="h-auto w-[120px] grayscale transition hover:grayscale-0"
                  />
                </div>
                <p className="border-t border-border/20 px-4 py-3 text-[11px] uppercase text-muted">
                  {cert.issuer}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" index="06" title="Projects" label="Interactive lab">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="border border-border bg-surface">
              <div className="grid gap-3 border-b border-border p-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <label htmlFor="project-search" className="text-[11px] uppercase text-muted">
                    Search ledger
                  </label>
                  <input
                    id="project-search"
                    type="search"
                    value={projectQuery}
                    onChange={(event) => setProjectQuery(event.target.value)}
                    placeholder="Type project, tag, or method..."
                    className="focus-ring mt-2 w-full border border-border/40 bg-background px-3 py-2 text-sm uppercase placeholder:text-muted/60"
                  />
                </div>
                <div className="flex flex-wrap content-end gap-2">
                  {["All", ...projectTags].map((tag) => {
                    const isActive = projectTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setProjectTag(tag)}
                        aria-pressed={isActive}
                        className={cn(
                          "focus-ring border px-2.5 py-2 text-[11px] uppercase transition",
                          isActive
                            ? "border-foreground bg-foreground text-background"
                            : "border-border/40 bg-background hover:border-foreground",
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div role="listbox" aria-label="Project explorer" className="divide-y divide-border/20">
                {filteredProjects.length ? (
                  filteredProjects.map((project, index) => {
                    const isSelected = selectedProject?.slug === project.slug;
                    return (
                      <button
                        key={project.slug}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => setSelectedProjectSlug(project.slug)}
                        className={cn(
                          "focus-ring grid w-full gap-3 px-4 py-4 text-left transition md:grid-cols-[56px_1fr_120px_80px]",
                          isSelected
                            ? "bg-foreground text-background"
                            : "hover:bg-[rgb(var(--surface-alt))]",
                        )}
                      >
                        <span className="text-xs text-muted">{sectionIndex(index + 1)}</span>
                        <span>
                          <span className="block text-sm font-bold uppercase">
                            {project.title}
                          </span>
                          <span
                            className={cn(
                              "mt-2 line-clamp-2 block text-xs leading-relaxed",
                              isSelected ? "text-background/70" : "text-muted",
                            )}
                          >
                            {project.description}
                          </span>
                        </span>
                        <span className="text-xs uppercase">{formatRange(project.start, project.end)}</span>
                        <span className="text-xs uppercase">{project.tags?.[0] ?? "Project"}</span>
                      </button>
                    );
                  })
                ) : (
                  <p className="px-4 py-8 text-xs uppercase text-muted">
                    No matching project. Clear search or change tag.
                  </p>
                )}
              </div>
            </div>

            {selectedProject ? (
              <ProjectDetail project={selectedProject} />
            ) : null}
          </div>
        </Section>

        <Section id="contact" index="07" title="Contact" label="Terminal close">
          <div className="border border-border bg-foreground text-background">
            <div className="border-b border-background/25 px-4 py-3 text-xs uppercase text-background/70">
              terminal / collaborate
            </div>
            <div className="grid gap-8 p-5 lg:grid-cols-[1fr_auto] lg:p-8">
              <div>
                <p className="text-xl font-bold uppercase leading-relaxed lg:text-3xl">
                  Let&apos;s collaborate and build something meaningful. I&apos;m always open to exchanging ideas.
                </p>
                <p className="mt-6 text-xs uppercase text-background/70">
                  ./connect --profile {content.handle} --mode engineering
                </p>
              </div>
              <div className="flex flex-wrap content-start gap-2 lg:max-w-xs lg:justify-end">
                {content.contacts.map((contact) => (
                  <a
                    key={`contact-${contact.label}`}
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="focus-ring inline-flex items-center gap-2 border border-background/45 px-3 py-2 text-xs uppercase transition hover:bg-background hover:text-foreground"
                  >
                    <Icon name={contact.icon} className="h-3.5 w-3.5" />
                    {contact.label}
                  </a>
                ))}
              </div>
            </div>
            <footer className="border-t border-background/25 px-5 py-4 text-xs uppercase text-background/60 lg:px-8">
              Copyright {content.handle}. Inspired by brain, outer space, and Swiss systems.
            </footer>
          </div>
        </Section>
      </main>
    </>
  );
}

function ProjectDetail({ project }: { project: ProjectItem }) {
  return (
    <aside className="border border-border bg-background xl:sticky xl:top-24 xl:self-start">
      <div className="grid grid-cols-[1fr_auto] border-b border-border">
        <div className="p-4">
          <p className="text-xs uppercase text-muted">Selected project</p>
          <h3 className="mt-3 text-2xl font-black uppercase leading-tight">
            {project.title}
          </h3>
        </div>
        <div className="grid w-16 place-items-center border-l border-border bg-accent text-background">
          <Icon name="ArrowUpRight" className="h-5 w-5" />
        </div>
      </div>

      <div className="border-b border-border bg-surface p-4">
        <Image
          src={project.thumbnailPath}
          alt={`${project.title} thumbnail`}
          width={900}
          height={650}
          loading="eager"
          sizes="(min-width: 1280px) 420px, 100vw"
          className="aspect-[16/11] w-full border border-border object-cover grayscale transition hover:grayscale-0"
        />
      </div>

      <div className="grid grid-cols-2 border-b border-border text-xs uppercase">
        <div className="border-r border-border p-4">
          <p className="text-muted">Range</p>
          <p className="mt-2">{formatRange(project.start, project.end)}</p>
        </div>
        <div className="p-4">
          <p className="text-muted">Links</p>
          <p className="mt-2">
            {[project.demoUrl ? "Demo" : null, project.repoUrl ? "Repo" : null]
              .filter(Boolean)
              .join(" / ") || "Archive"}
          </p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm leading-relaxed">{project.description}</p>
        {project.tags?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="border border-border/35 px-2 py-1 text-[11px] uppercase">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 border border-border bg-foreground px-3 py-2 text-xs uppercase text-background"
            >
              <Icon name="ExternalLink" className="h-3.5 w-3.5" />
              Demo
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase transition hover:bg-foreground hover:text-background"
            >
              <Icon name="Github" className="h-3.5 w-3.5" />
              Repo
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
