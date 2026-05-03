<!-- # Personal Website

A clean, animated, single-page portfolio website built with **Next.js**, **Tailwind CSS**, and **Framer Motion**, with an optional **WebGL fluid background** (CSS fallback + low-end GPU detection + respects `prefers-reduced-motion`).

## Features

- Single-page layout with section navigation (desktop + mobile) and active-section highlight
- Fully typed content model (edit one file to update the whole site)
- Project gallery with search, tag filtering, and "load more"
- Dark-only design tokens + easy palette tweaks via CSS variables
- Optional GPU-friendly WebGL background (Three.js / React Three Fiber)

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Framer Motion
- Three.js + `@react-three/fiber` + `@react-three/drei`
- `lucide-react` icons

## Use This Template

```bash
git clone <your-repo-url>
cd <your-repo>
npm ci
npm run dev
```

## Getting Started

### Requirements

- Node.js 20+ (recommended)
- npm (this repo includes `package-lock.json`)

### Install

```bash
npm ci
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build / start

```bash
npm run build
npm run start
```

## Customize

### 1) Update your content

Edit:

- `src/content/site.ts` - name, handle, contacts, about, education, work, tools, certifications, projects

This site is data-driven: most text you see comes from the `site` object.

### 2) Replace images

Put your assets here (and update paths in `src/content/site.ts`):

- `public/projects/*` - project thumbnails (used by `thumbnailPath`)
- `public/badges/*` - certification badges (used by `badgeImagePath`)

Tip: any path that starts with `/` maps to `public/` (example: `/projects/my-project.png`).

### 3) Theme + colors

- `src/app/globals.css` - edit CSS variables like `--background`, `--foreground`, and the shader palette `--shader-a/b/c`

### 4) SEO / metadata

- `src/app/layout.tsx` - page metadata (title/description) and fonts

### 5) Turn the WebGL background on/off

- Mounted in `src/components/site/SitePage.tsx` as `<FluidBackground />`
- Implementation lives in `src/components/visual/FluidBackground.tsx`

Remove `<FluidBackground />` if you want a purely CSS background.

### 6) Icons

If you add a new icon name in your content, update both:

- `src/content/site.ts` (`IconName` union type)
- `src/components/icon.tsx` (the `ICONS` mapping)

### 7) Page sections + hero typewriter

- `src/components/site/SitePage.tsx` - section list, `TYPEWRITER_ITEMS`, and `PROJECT_PAGE_SIZE`

## Project Structure

```text
src/
  app/                # Next.js routes, layout, global styles
  components/         # UI + visual components
  content/            # Your content lives here
  lib/                # Small utilities (e.g. className helper)
public/
  projects/           # Project thumbnails
  badges/             # Certification badge images
```

## Deploy

The easiest deployment is on Vercel:

1. Push your repo to GitHub/GitLab/Bitbucket
2. Import it into Vercel
3. Deploy (no env vars required by default)

## Contributing

PRs and issues are welcome - especially improvements that keep the template easy to customize.

## License

This project does not currently include a `LICENSE` file. If you plan to publish this as a public template, add a license (MIT is a common choice). -->

![verneylmavt.vercel.app (Default Mode)](https://raw.githubusercontent.com/verneylmavt/verneylmavt.vercel.app/refs/heads/main/public/demo.png)
