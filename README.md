# Usama Mujahid — Portfolio

Personal portfolio of **Usama Mujahid** — BS Civil Engineering student at COMSATS
University Islamabad (Abbottabad Campus) and Construction Estimation Intern at
BYH. The design language is built around the tools of the trade:
blueprint grids, CAD dimension lines, bill-of-quantities tables and takeoff sheets.

**Live stack:** pure HTML, CSS and vanilla JavaScript. No frameworks, no build
step, no dependencies to install. Clone → open → deploy.

---

## Project structure

```
/
├── index.html                     # Single-page site: all sections and inline SVG icons
├── article-estimation-journey.html
├── style.css                      # Full design system (tokens, glassmorphism, animations)
├── script.js                      # All interactions (loader, cursor, counters, filters…)
├── README.md                      # This file
├── .nojekyll                      # Tells GitHub Pages to serve files as-is (no Jekyll)
├── robots.txt / sitemap.xml       # SEO
│
├── favicon.svg                    # Browser tab icon
├── og-banner.svg                  # Social sharing preview banner
├── profile-hero.jpg               # Portrait — hero section (720×900)
├── profile-about.jpg              # Portrait — about section (640×640)
├── project-01.jpg                 # Featured project screenshot (PlanSwift takeoff)
├── project-02.jpg                 # Featured project screenshot (PlanSwift takeoff)
├── gallery-01.svg … gallery-06.svg  # Gallery placeholders — replace with your photos
│
├── assets/
│   └── Usama-Mujahid-CV.pdf       # Resume download — replace with your own CV
│
└── *.svg                          # Standalone source copies of UI icons
```

### Replacing the gallery placeholders

Each `gallery-0N.svg` is a styled placeholder. To use your own photos, add a
JPG (ideally 4:3, ~800×600, under 200 KB) and update the matching
`<img src="gallery-0N.svg" …>` in `index.html` to point at your file.

### Why icons are inline in `index.html`

The icons in `icons/` are the **source files** for editing and reuse. In the
page itself, the same icons are embedded inline as `<svg>` elements. This is
deliberate and is the recommended practice for a small icon set:

- **Zero extra HTTP requests** — faster first paint.
- **`currentColor` inheritance** — icons recolor automatically on hover
  (e.g. project card icons turning white), which external `<img>` icons cannot do.
- **No CORS issues** when previewing the site locally from the file system.

To change an icon: edit the copy in `icons/`, then paste the updated paths into
the matching `<svg>` in `index.html`.

### Fonts

Typography (Archivo + IBM Plex Mono) loads from Google Fonts via a single
request in the `<head>`, so a `fonts/` folder isn't required. If you ever need
the site to work fully offline, download both families, place the `.woff2`
files in a `fonts/` folder, and swap the Google Fonts `<link>` for `@font-face`
rules at the top of `style.css`.

---

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`).
   For the cleanest URL, name it `YOUR-USERNAME.github.io`.
2. Upload **everything in this folder**, keeping the folder structure intact
   (or push with git):
   ```bash
   git init
   git add .
   git commit -m "Portfolio v1"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. Your site goes live in ~1 minute at:
   - `https://YOUR-USERNAME.github.io/` (if the repo is named `username.github.io`), or
   - `https://YOUR-USERNAME.github.io/YOUR-REPO/`

All paths in this project are **relative** (`images/favicon.svg`, `style.css`),
so the site works at either URL and when opened locally — no configuration needed.

**After deploying:** open `index.html` and replace the `og:image` value with
your full live URL (e.g. `https://YOUR-USERNAME.github.io/YOUR-REPO/images/og-banner.svg`)
so link previews on LinkedIn/WhatsApp show the banner. Social platforms require
an absolute URL for preview images.

---

## Customizing

| What | Where |
|---|---|
| Skill levels | `index.html` → each `.boq__row` has a `data-level="0–100"` |
| Hero counters | `index.html` → `.count` elements, `data-count` attribute |
| Rotating hero roles | `index.html` → `.roles__item` entries |
| Project cards & filters | `index.html` → `.sheet` cards (`data-cat`) and `.filters__btn` counts |
| Colors & gradients | `style.css` → `:root` design tokens at the top |
| Animation speeds | `style.css` (durations) and `script.js` (loader, roles interval, counters) |
| Add your CV | Drop `cv.pdf` into `assets/` and link it, e.g. `<a href="assets/cv.pdf" download>` |
| Add photos/screenshots | Put files in `images/` and reference as `images/your-file.jpg` |

## Features

Preloader with live plotting progress · scroll progress bar · custom takeoff-reticle
cursor (desktop only) · parallax blueprint grid with drifting gradient orbs ·
choreographed hero intro · rotating roles inside a CAD dimension line · magnetic
buttons with shine sweep · animated counters · glassmorphic cards · bill-of-quantities
skills table with animated bars · self-drawing timeline · filterable project grid
with cursor-tracked spotlight · fully responsive · respects `prefers-reduced-motion` ·
keyboard accessible.

---

© Usama Mujahid. Drawn, checked & approved by U.M.
