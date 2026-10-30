# mosaic-windows: agent handoff

Mosaic Peek: a mosaic of mini windows for links, unfinished projects, to-dos, files and songs. Import lists or bookmarks, preview tiles full screen, add notes, and copy a hand-off brief into Claude. Inspired by forevercomponents.com's browse → describe → copy hand-off flow. One static `index.html`, no build step. GitHub Pages serves it from this repo's root.

## Source of truth
GitHub is canonical. The Drive folder `SFW/mosaic-windows` (id `1KQ_wT347uYBmPVQoKNQy5mJCcGmpI7Au`) only holds pickup copies and the seed tarball.

## Ownership
SFW lane (Grok Bot / App Ideas). Keep Theme Spin, NSFW, and Aisle 69 assets out of this repo.

## Run
Open `index.html` directly, or `python3 -m http.server 8080` from the repo root.

## Next
- Check the Pages URL is still healthy.
- Tiles are `kind: 'link'` (http(s), Microlink peek) or `kind: 'note'` (text, optional non-web link). Keep old boards (no `kind`) loading.
- Later: pannable "forever wall" layout, uploaded images/audio tiles, Microlink API key tier, browser extension that reads open tabs, sync.
