# verneylmavt.vercel.app (v2)

2nd iteration of verneylmavt.vercel.app.

Built with: Next.js + Tailwind CSS + Framer Motion + React Three Fiber + Three.js + WebGL.

## Galleries

![Hero](public/demo_hero.png)

![Projects](public/demo_project.png)

## Run

### Requirements

- Git
- Browser
- Node.js >= 20.9.0
- npm

### Clone

```bash
git clone https://github.com/verneylmavt/verneylmavt.vercel.app.git
git cd verneylmavt.vercel.app
git checkout v2
```

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

## Project Structure

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
