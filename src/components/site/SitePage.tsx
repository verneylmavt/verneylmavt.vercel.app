"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import type { SiteContent } from "@/content/site";
import { Icon } from "@/components/icon";
import { Header, type NavSection } from "@/components/site/Header";
import { FluidBackground } from "@/components/visual/FluidBackground";
import { cn } from "@/lib/cn";

const TYPEWRITER_ITEMS = [
  "const mbti = ENTP;",
  "const interest = Data, Cloud, AI/ML;",
  "const hobby = Design, Finance, Game Theory;",
] as const;

const PROJECT_PAGE_SIZE = 2;

function formatRange(start: string, end: string): string {
  const s = start?.trim();
  const e = end?.trim();
  if (!s && !e) return "";
  if (!e || e === s) return s || e;
  return `${s} — ${e}`;
}

function useActiveSection(sectionIds: string[]) {
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
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

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

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            id={`${id}-title`}
            className={cn(
              "text-3xl font-medium tracking-tight sm:text-4xl",
              "font-[family:var(--font-serif)]",
            )}
          >
            {title}
          </h2>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </section>
  );
}

export function SitePage({ content }: { content: SiteContent }) {
  const reducedMotion = useReducedMotion();
  const sections = React.useMemo<NavSection[]>(
    () => [
      { id: "about", label: "About" },
      { id: "education", label: "Education" },
      { id: "experience", label: "Work" },
      { id: "tools", label: "Tools" },
      { id: "certifications", label: "Certifications" },
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" },
    ],
    [],
  );

  const sectionIds = React.useMemo(() => sections.map((s) => s.id), [sections]);
  const activeId = useActiveSection(sectionIds);
  const [mounted, setMounted] = React.useState(false);
  const [itemIndex, setItemIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [projectQuery, setProjectQuery] = React.useState("");
  const [projectTag, setProjectTag] = React.useState<string>("All");
  const [visibleProjects, setVisibleProjects] =
    React.useState(PROJECT_PAGE_SIZE);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setVisibleProjects(PROJECT_PAGE_SIZE);
  }, [projectQuery, projectTag]);

  React.useEffect(() => {
    if (!mounted) return;

    if (reducedMotion) {
      setItemIndex(0);
      setCharIndex(TYPEWRITER_ITEMS[0].length);
      setIsDeleting(false);
      return;
    }

    const phrase = TYPEWRITER_ITEMS[itemIndex] ?? "";

    const typeMs = 46;
    const deleteMs = 24;
    const pauseMs = 900;
    const swapMs = 180;

    const isTypingDone = !isDeleting && charIndex >= phrase.length;
    const isDeleteDone = isDeleting && charIndex <= 0;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isTypingDone) {
      timeoutId = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleteDone) {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setItemIndex((v) => (v + 1) % TYPEWRITER_ITEMS.length);
      }, swapMs);
    } else {
      timeoutId = setTimeout(() => {
        setCharIndex((v) => v + (isDeleting ? -1 : 1));
      }, isDeleting ? deleteMs : typeMs);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mounted, reducedMotion, itemIndex, charIndex, isDeleting]);

  const activePhrase = TYPEWRITER_ITEMS[itemIndex] ?? "";
  const typewriterText = mounted
    ? activePhrase.slice(0, Math.max(0, Math.min(charIndex, activePhrase.length)))
    : "";

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }

    html.style.scrollBehavior = previousScrollBehavior;
  }, []);

  const availableProjectTags = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of content.projects) {
      const uniqueTags = new Set(project.tags ?? []);
      for (const tag of uniqueTags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [content.projects]);

  const filteredProjects = React.useMemo(() => {
    const query = projectQuery.trim().toLowerCase();
    const tag = projectTag;

    return content.projects.filter((project) => {
      if (tag !== "All" && !(project.tags ?? []).includes(tag)) return false;
      if (!query) return true;
      const haystack = `${project.title} ${project.description}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [content.projects, projectQuery, projectTag]);

  const visibleProjectItems = filteredProjects.slice(0, visibleProjects);
  const hasMoreProjects = visibleProjects < filteredProjects.length;

  return (
    <>
      <FluidBackground />
      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <Header siteName={content.handle} sections={sections} activeId={activeId} />

        <main className="flex-1">
          {/* HERO */}
          <section
            id="top"
            className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center py-16"
            aria-label="Intro"
          >
            <div className="mx-auto w-full max-w-4xl px-6 text-center">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08 } },
                }}
              >
                {content.location ? (
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-sm text-muted"
                  >
                    {content.location}
                  </motion.p>
                ) : null}

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl",
                    "font-[family:var(--font-serif)]",
                  )}
                >
                  {content.name}
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted sm:text-xl"
                >
                  {content.roleTitle}
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 flex justify-center"
                >
                  <div className="w-full max-w-[36rem] overflow-hidden rounded-2xl border border-[rgb(var(--border)/0.14)] bg-[rgb(var(--background)/0.35)] px-4 py-3 font-mono text-xs text-muted backdrop-blur-md sm:text-sm">
                    <div className="flex items-center gap-2 whitespace-nowrap text-left">
                      <span className="text-foreground/80">$</span>
                      <span className="typewriter">{typewriterText}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-10 flex flex-wrap items-center justify-center gap-3"
                >
                  {content.contacts.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        c.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border)/0.14)] px-4 py-2 text-sm",
                        "bg-[rgb(var(--background)/0.4)] backdrop-blur-md transition",
                        "hover:border-[rgb(var(--border)/0.22)] hover:bg-[rgb(var(--background)/0.55)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      <Icon
                        name={c.icon}
                        className="h-4 w-4 text-foreground/85"
                      />
                      <span className="text-foreground/90">{c.label}</span>
                    </a>
                  ))}
                </motion.div>

                <motion.a
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1 },
                  }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
                  href="#about"
                  className="group mt-16 inline-flex items-center justify-center gap-3 text-sm text-muted transition hover:text-foreground"
                  aria-label="Scroll to About Me"
                >
                  <span className="underline underline-offset-4 decoration-[rgb(var(--foreground)/0.25)] group-hover:decoration-[rgb(var(--foreground)/0.45)]">
                    Scroll
                  </span>
                  <span className="inline-flex h-px w-10 bg-[rgb(var(--foreground)/0.25)]" />
                  <span className="text-foreground/75">↓</span>
                </motion.a>
              </motion.div>
            </div>
          </section>

          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="h-px w-full bg-[rgb(var(--border)/0.10)]" />
          </div>

          {/* ABOUT */}
          <Section id="about" title="About Me">
            <div className="max-w-3xl">
              <p className="text-pretty text-lg leading-relaxed text-foreground/90">
                {content.about.paragraph}
              </p>

              <div className="mt-8">
                <p className="text-xs uppercase tracking-wider text-muted">Focus</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {content.about.focus.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--border)/0.10)] bg-[rgb(var(--background)/0.35)] px-4 py-3 backdrop-blur-md"
                    >
                      <Icon
                        name={item.icon}
                        className="h-5 w-5 text-foreground/80"
                      />
                      <span className="text-sm text-foreground/90">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="h-px w-full bg-[rgb(var(--border)/0.10)]" />
          </div>

          {/* EDUCATION */}
          <Section id="education" title="Education">
            <ol className="relative ml-2 border-l border-[rgb(var(--border)/0.14)]">
              {content.education.map((edu) => (
                <li key={`${edu.institution}-${edu.start}`} className="pb-10 pl-7">
                  <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-[rgb(var(--foreground)/0.40)]" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-lg font-medium tracking-tight">
                      {edu.title}
                    </h3>
                    <p className="text-sm text-muted">
                      {edu.start} — {edu.end}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-foreground/85">
                    {edu.institution}
                  </p>
                  {edu.description ? (
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                      {edu.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Section>

          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="h-px w-full bg-[rgb(var(--border)/0.10)]" />
          </div>

          {/* EXPERIENCE */}
          <Section id="experience" title="Work Experience">
            <ol className="relative ml-2 border-l border-[rgb(var(--border)/0.14)]">
              {content.workExperience.map((work) => (
                <li key={`${work.company}-${work.start}`} className="pb-10 pl-7">
                  <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-[rgb(var(--foreground)/0.40)]" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-lg font-medium tracking-tight">
                      {work.title} ·{" "}
                      {work.companyUrl ? (
                        <a
                          href={work.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/85 underline underline-offset-4 decoration-[rgb(var(--foreground)/0.25)] hover:decoration-[rgb(var(--foreground)/0.45)]"
                        >
                          {work.company}
                        </a>
                      ) : (
                        <span className="text-foreground/85">{work.company}</span>
                      )}
                    </h3>
                    <p className="text-sm text-muted">
                      {work.start} — {work.end}
                    </p>
                  </div>
                  {work.location ? (
                    <p className="mt-1 text-sm text-foreground/85">
                      {work.location}
                    </p>
                  ) : null}
                  <p
                    className={cn(
                      "max-w-3xl text-sm leading-relaxed text-muted",
                      work.location ? "mt-2" : "mt-3",
                    )}
                  >
                    {work.summary}
                  </p>
                  {work.highlights?.length ? (
                    <ul className="mt-5 grid gap-2 text-sm text-foreground/85 sm:grid-cols-2">
                      {work.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-3">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[rgb(var(--foreground)/0.55)]" />
                          <span className="text-muted">{h}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </Section>

          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="h-px w-full bg-[rgb(var(--border)/0.10)]" />
          </div>

          {/* TOOLS */}
          <Section id="tools" title="Tools">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {content.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--border)/0.10)] bg-[rgb(var(--background)/0.35)] px-4 py-3 backdrop-blur-md"
                >
                  <Icon name={tool.icon} className="h-4 w-4 text-foreground/80" />
                  <p className="text-sm font-medium tracking-tight">{tool.name}</p>
                </div>
              ))}
            </div>
          </Section>

          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="h-px w-full bg-[rgb(var(--border)/0.10)]" />
          </div>

          {/* CERTIFICATIONS */}
          <Section id="certifications" title="Certifications">
            <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {content.certifications.map((c) => (
                <div
                  key={`${c.title}-${c.date}`}
                  className="min-w-[260px] rounded-2xl border border-[rgb(var(--border)/0.10)] bg-[rgb(var(--background)/0.35)] p-5 backdrop-blur-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium tracking-tight">
                        {c.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {c.issuer} · {c.date}
                      </p>
                    </div>
                    <a
                      href={c.proofUrl ?? c.badgeImagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border)/0.12)]",
                        "bg-[rgb(var(--background)/0.35)] text-foreground/75 backdrop-blur-md transition",
                        "hover:border-[rgb(var(--border)/0.18)] hover:bg-[rgb(var(--background)/0.55)] hover:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                      aria-label={`Open proof for ${c.title}`}
                    >
                      <Icon name="ExternalLink" className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-5 flex items-center justify-center rounded-xl border border-[rgb(var(--border)/0.10)] bg-[rgb(var(--surface)/0.40)] p-4">
                    <a
                      href={c.proofUrl ?? c.badgeImagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Image
                        src={c.badgeImagePath}
                        alt={`${c.title} badge`}
                        width={140}
                        height={140}
                        sizes="120px"
                        className="h-auto w-[120px] transition group-hover:scale-[1.02]"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className="hidden mt-6 text-sm text-muted">
              Tip: swap badge images in <span className="text-foreground/80">/public/badges</span>.
            </p>
          </Section>

          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="h-px w-full bg-[rgb(var(--border)/0.10)]" />
          </div>

          {/* PROJECTS */}
          <Section id="projects" title="Projects">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <label htmlFor="project-search" className="sr-only">
                      Search projects
                    </label>
                    <input
                      id="project-search"
                      type="search"
                      value={projectQuery}
                      onChange={(e) => setProjectQuery(e.target.value)}
                      placeholder="Search by title or description..."
                      className={cn(
                        "w-full rounded-full border border-[rgb(var(--border)/0.14)]",
                        "bg-[rgb(var(--background)/0.35)] px-4 py-2.5 text-base text-foreground placeholder:text-muted backdrop-blur-md sm:text-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    />
                  </div>
                </div>

                {availableProjectTags.length ? (
                  <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
                    <button
                      type="button"
                      onClick={() => setProjectTag("All")}
                      aria-pressed={projectTag === "All"}
                      className={cn(
                        "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition",
                        projectTag === "All"
                          ? "border-[rgb(var(--border)/0.20)] bg-[rgb(var(--foreground)/0.08)] text-foreground"
                          : "border-[rgb(var(--border)/0.12)] bg-[rgb(var(--surface)/0.40)] text-foreground/85 hover:border-[rgb(var(--border)/0.18)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      All
                    </button>
                    {availableProjectTags.map((tag) => {
                      const isActive = projectTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setProjectTag(tag)}
                          aria-pressed={isActive}
                          className={cn(
                            "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition",
                            isActive
                              ? "border-[rgb(var(--border)/0.20)] bg-[rgb(var(--foreground)/0.08)] text-foreground"
                              : "border-[rgb(var(--border)/0.12)] bg-[rgb(var(--surface)/0.40)] text-foreground/85 hover:border-[rgb(var(--border)/0.18)]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          )}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {visibleProjectItems.length ? (
                <div className="grid gap-6">
                  {visibleProjectItems.map((project) => {
                    const range = formatRange(project.start, project.end);
                    return (
                      <motion.article
                        key={project.slug}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10% 0px" }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "group rounded-3xl border border-[rgb(var(--border)/0.10)] bg-[rgb(var(--background)/0.35)] backdrop-blur-md",
                          "transition hover:border-[rgb(var(--border)/0.18)] hover:bg-[rgb(var(--background)/0.45)]",
                        )}
                      >
                        <div className="grid gap-6 p-6 md:grid-cols-12 md:items-center">
                          <div className="md:col-span-5">
                            <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border)/0.10)]">
                              <Image
                                src={project.thumbnailPath}
                                alt={`${project.title} thumbnail`}
                                width={900}
                                height={650}
                                sizes="(min-width: 768px) 40vw, 100vw"
                                className="h-auto w-full scale-[1.01] transition duration-500 group-hover:scale-[1.03]"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-7">
                            {range ? (
                              <p className="text-xs text-muted">{range}</p>
                            ) : null}
                            <h3
                              className={cn(
                                "text-xl font-medium tracking-tight sm:text-2xl",
                                range ? "mt-2" : "",
                              )}
                            >
                              {project.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                              {project.description}
                            </p>

                            {project.tags?.length ? (
                              <div className="mt-5 flex flex-wrap gap-2">
                                {project.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="rounded-full border border-[rgb(var(--border)/0.12)] bg-[rgb(var(--surface)/0.40)] px-3 py-1 text-xs text-foreground/85"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            ) : null}

                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                              {project.demoUrl ? (
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-foreground/90 hover:text-foreground"
                                >
                                  <Icon name="ExternalLink" />
                                  <span className="underline underline-offset-4">
                                    Demo
                                  </span>
                                </a>
                              ) : null}
                              {project.repoUrl ? (
                                <a
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-foreground/90 hover:text-foreground"
                                >
                                  <Icon name="Github" />
                                  <span className="underline underline-offset-4">
                                    Repo
                                  </span>
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-[rgb(var(--border)/0.10)] bg-[rgb(var(--background)/0.35)] px-5 py-6 text-sm text-muted backdrop-blur-md">
                  No projects found. Try clearing the search or choosing a
                  different tag.
                </div>
              )}

              {hasMoreProjects ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleProjects((v) =>
                        Math.min(v + PROJECT_PAGE_SIZE, filteredProjects.length),
                      )
                    }
                    className={cn(
                      "inline-flex items-center justify-center rounded-full border border-[rgb(var(--border)/0.14)] px-5 py-2.5 text-sm",
                      "bg-[rgb(var(--background)/0.40)] text-foreground/90 backdrop-blur-md transition",
                      "hover:border-[rgb(var(--border)/0.22)] hover:bg-[rgb(var(--background)/0.55)] hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    )}
                  >
                    Load more
                  </button>
                </div>
              ) : null}
            </div>
          </Section>

          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="h-px w-full bg-[rgb(var(--border)/0.10)]" />
          </div>

          {/* CONTACT */}
          <Section id="contact" title="Contacts">
            <div className="grid gap-10 md:grid-cols-12 md:items-start">
              <div className="md:col-span-7">
                <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
                  Let’s collaborate and build something meaningful. I’m always open to exchanging ideas!
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {content.contacts.map((c) => (
                    <a
                      key={`contact-${c.label}`}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        c.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border)/0.14)] px-5 py-2.5 text-sm",
                        "bg-[rgb(var(--background)/0.4)] backdrop-blur-md transition",
                        "hover:border-[rgb(var(--border)/0.22)] hover:bg-[rgb(var(--background)/0.55)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent)/0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      <Icon
                        name={c.icon}
                        className="h-4 w-4 text-foreground/85"
                      />
                      <span className="text-foreground/90">{c.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="hidden rounded-3xl border border-[rgb(var(--border)/0.10)] bg-[rgb(var(--background)/0.35)] p-6 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Theme
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Dark-only, tuned for contrast and glow. The background
                    upgrades to WebGL after load and falls back to CSS if WebGL
                    is not available.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-sm text-foreground/85">
                      Mode:
                    </span>
                    <span className="rounded-full border border-[rgb(var(--border)/0.12)] bg-[rgb(var(--surface)/0.40)] px-3 py-1 text-xs text-muted">
                      Dark
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-16 pb-10 text-sm text-muted">
              <p>
                ©verneylmavt. Inspired by brain and outer space.
              </p>
            </footer>
          </Section>
        </main>
      </div>
    </>
  );
}
