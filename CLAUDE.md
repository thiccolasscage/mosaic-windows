# mosaic-windows: agent handoff

Mosaic Peek: paste URLs, get a favicon + Microlink screenshot mosaic, drag tiles into groups, click to open the site. One static `index.html`, no build step. GitHub Pages serves it from this repo's root.

## Source of truth
GitHub is canonical. The Drive folder `SFW/mosaic-windows` (id `1KQ_wT347uYBmPVQoKNQy5mJCcGmpI7Au`) only holds pickup copies and the seed tarball.

## Ownership
SFW lane (Grok Bot / App Ideas). Keep Theme Spin, NSFW, and Aisle 69 assets out of this repo.

## Run
Open `index.html` directly, or `python3 -m http.server 8080` from the repo root.

## Next
- Check the Pages URL is still healthy.
- v1.1: Tree view.
- Later: Microlink API key tier, browser extension that reads open tabs, sync.
