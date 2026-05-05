# verneylmavt.vercel.app (v1)

1st iteration of verneylmavt.vercel.app. It is a static portfolio site with a sidebar profile and a single-page, app-like navigation across sections (About / Resume / Projects / Contact). It includes a theme toggle (persisted in `localStorage`), filterable projects, and a project-details modal with optional repo/demo links.

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
