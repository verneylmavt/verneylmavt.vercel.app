# verneylmavt.vercel.app

Personal website repository for **@verneylmavt**.

This repo keeps different iterations of the site on separate branches:

- **`v2`** (current) - Next.js + Tailwind CSS (recommended)
- **`v1`** (legacy) - static HTML/CSS/JS
- **`main`** - landing branch (no deployable site source)

Live: https://verneylmavt.vercel.app

## Branches

- `v2`: https://github.com/verneylmavt/verneylmavt.vercel.app/tree/v2
- `v1`: https://github.com/verneylmavt/verneylmavt.vercel.app/tree/v1

## Local development (git worktrees)

If you want to work on multiple versions side-by-side:

```bash
git clone https://github.com/verneylmavt/verneylmavt.vercel.app.git main
cd main

git worktree add ../v2 v2
git worktree add ../v1 v1
```

Then follow the `README.md` inside each worktree.
