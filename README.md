# verneylmavt.vercel.app (v2)

2nd iteration of verneylmavt.vercel.app.

Built with: Next.js + Tailwind CSS + Framer Motion + React Three Fiber + Three.js + WebGL.

## Galleries

![Hero](public/demo-hero.png)

![Projects](public/demo-project.png)

## Run

### Requirements

- Node.js >= 20.9.0
- npm

### Install

```bash
npm ci
```

### Local Run

```bash
npm run dev
```

Open: `http://localhost:3000`.

## Customize

- Content: `src/content/site.ts`
- Metadata + Fonts: `src/app/layout.tsx`
- Design + Palette: `src/app/globals.css`
- Sections + Animations + Filters: `src/components/site/SitePage.tsx`
- Icons: `src/components/icon.tsx`
- WebGL: `src/components/visual/FluidBackground.tsx`

## Project structure

```text
src/
  app/         # Next.js routes, layout, global styles
  components/  # UI + visual components
  content/     # Site content model + data
  lib/         # Small utilities
public/
  projects/    # Project thumbnails
  badges/      # Certification badge images
```
