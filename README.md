# verneylmavt.vercel.app (v2)

2nd iteration of verneylmavt.vercel.app.

This project is the second iteration of my personal website, evolving from a static portfolio into a fully component-driven, interactive application built with Next.js and React. The site adopts a content-centric architecture, where all portfolio data—such as projects, experience, and certifications—is defined in a structured model and rendered dynamically through reusable components. This approach improves maintainability, scalability, and clarity, allowing the interface to act as a clean, extensible layer over a well-defined data schema.

From an engineering and design perspective, this version emphasizes motion, responsiveness, and visual identity. It integrates smooth UI transitions with Framer Motion, advanced styling through Tailwind CSS, and a custom WebGL-powered fluid background using React Three Fiber and Three.js, with graceful fallbacks for performance and accessibility. Additional features such as section-aware navigation, project search and filtering, and incremental rendering reflect a state-driven UI design. Overall, this iteration focuses on bridging frontend engineering with interactive design, creating a more immersive and polished representation of both technical work and personal brand.

## Tech Stack

- Next.js
- Tailwind CSS
- Framer Motion
- React Three Fiber
- Three.js
- WebGL

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
npm install
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
