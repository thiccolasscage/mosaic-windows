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
- Boards: several per device (`boards` index in `mosaicPeek.boards`, current id in `mosaicPeek.board`); board `main` keeps the original key `mosaicPeek.v1`, others use `mosaicPeek.b.<id>`.
- Installable app: `manifest.webmanifest`, `sw.js` (network-first offline copy, `?nosw` removes it), icons. Only wired up over http(s); file:// stays as before.
- Decided Oct 31, 2026: local-first storage with optional sign-in and sync; share-a-view links (snapshot first, server links with sync) after the Phase 0 safety fixes. See docs/LAUNCH_PLAN.md.
- Views: Mosaic (groups grid), Tree (outline), Wall (forever wall: the visible items packed once into a patch that repeats endlessly; only tiles near the viewport are in the DOM, see `layoutWall` / `drawWall`).
- Later: live/animated tiles on the wall, uploaded images/audio tiles, Microlink API key tier, browser extension that reads open tabs, sync.
