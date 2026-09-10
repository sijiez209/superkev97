# Kevin Jung — Portfolio

Static site (no build step) for Kevin Jung's UI/UX portfolio.

## Structure

- `index.html` — home page
- `portfolio.html` — full case-study list with filters
- `work/*.html` — individual case-study pages
- `style.css`, `main.js` — shared styles and interactions
- `Image/` — local image assets

## Local preview

Any static file server works, e.g.:

```
npx serve .
```

## Deploy

Static hosts (Netlify, Vercel, Cloudflare Pages, GitHub Pages) can serve this
repo directly — no build command, publish directory is the repo root.
