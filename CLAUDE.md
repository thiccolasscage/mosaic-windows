# mosaic-windows (Mosaic Peek)

Paste URLs → favicon + Microlink peek mosaic → drag into groups → click opens the real site.

## Source of truth
- **GitHub is the source of truth.** The Drive folder `SFW/mosaic-windows` (id `1KQ_wT347uYBmPVQoKNQy5mJCcGmpI7Au`) holds handoff notes and a seed tarball for pickup only.
- Live: GitHub Pages on this repo, https://thiccolasscage.github.io/mosaic-windows/ (served from the repo root).

## Layout
- `index.html`: markup only; must stay at the repo root for Pages.
- `assets/css/styles.css`, `assets/js/app.js`: all styles and logic. Plain files, no build step, no dependencies; must keep working from `file://`.
- `samples/`: demo data. `docs/ROADMAP.md`: what's next.

## Run
Open `index.html`, or `python3 -m http.server 8080` from the repo root.

## Scope
- v1 done: import, groups, drag, peeks, localStorage (`mosaicPeek.v1`), JSON export/import.
- Next: see `docs/ROADMAP.md` (tree view first).
- Keep this repo to Mosaic Peek only; don't bring in assets from the other SFW or non-SFW projects.
