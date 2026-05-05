# verneylmavt.vercel.app (v1)

1st iteration of verneylmavt.vercel.app. 

This project is the first iteration of my personal website, designed as a lightweight, frontend-only portfolio to showcase my background, projects, and technical skill set. Built entirely with vanilla HTML, CSS, and JavaScript, the site follows a single-page application structure, using data-driven components and DOM manipulation to handle navigation, filtering, and modal interactions without relying on external frameworks. It serves as a foundation for presenting both academic and personal work in a clean, structured, and interactive format.

From an engineering perspective, this version emphasizes simplicity, maintainability, and performance. It implements a custom theming system with persistent light/dark mode support, a modular layout composed of reusable UI sections, and a flexible project gallery with category-based filtering and dynamic content rendering. While intentionally minimal in dependencies, the architecture reflects core frontend principles such as separation of concerns, scalable styling via CSS variables, and state-driven UI behavior—laying the groundwork for future iterations with more advanced features and backend integration.

## Tech Stack

- HTML
- CSS
- JavaScript

## Galleries

![About](public/demo_about.png)

![Projects](public/demo_project.png)

## Run

### Requirements

- Git
- Browser
- Optional: Node.js / Python

### Clone

```bash
git clone https://github.com/verneylmavt/verneylmavt.vercel.app.git
git cd verneylmavt.vercel.app
git checkout v1
```

### Local Run

```bash
# Node.js
npx serve .

# Python
python -m http.server 8000
```

Open: `http://localhost:8000`.

## Customize

- Content + Structure: `index.html`
- Styles: `static/css/style.css`
- Interactions: `static/js/script.js`
- Images + Icons: `assets/**`

## Project Structure

```text
assets/        # Images/icons used by the site
public/        # Screenshots
static/
  css/         # Stylesheets
  js/          # Browser scripts
index.html     # Main entry point
```
