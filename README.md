# Mosaic Peek

Guides: [how to use it, personal and commercial](docs/GUIDE.md) · [6-month launch plan](docs/LAUNCH_PLAN.md)

Turn a list of URLs into a visual wall of peek tiles, drag them into named groups, click to reopen the real site.

## Open it
- Double-click `index.html` (works from `file://`), or
- From the repo root: `python3 -m http.server 8080` then open http://localhost:8080

No build step, no dependencies, no frameworks: one self-contained `index.html`.

## Use
A mosaic of mini windows for everything you've saved or started: links, unfinished projects, to-dos, files, songs. Find something, write what you want, copy the hand-off and keep building in Claude.

- **+ Add**: paste one item per line. Links become live-preview tiles. Anything else (a to-do, an idea, a project you never finished) becomes a note tile. Markdown lists work, including `- [ ]` / `- [x]` (checked = done) and `[title](url) note`. CSV uses columns named `url`/`link`, `title`/`name`, `note`/`description` and `group`/`folder`. "Samples" fills in a mix of links and notes.
- **Load file…** (in Add) or **drop files anywhere** on the page:
  - **Browser bookmarks**: the HTML file from any browser's "Export bookmarks". Each folder becomes a group.
  - **Chrome's `Bookmarks` file**, Firefox JSON backups, a JSON array of links/strings/objects, or `{ "Group name": [ ... ] }`.
  - **CSV / TXT / Markdown** lists, which load into the box first so you can check them.
  - Non-web links such as `file://…`, `spotify:…` and `mailto:` are kept on note tiles. Bookmarklets and `chrome://` links are skipped.
  - Dropping onto a group adds to that group. Links dragged in from other tabs work too, and you can paste URLs anywhere on the page (outside inputs).
- **Click a tile** to open the full-screen preview: a big screenshot or note card, with the rest of its group listed alongside. Use ←/→ to step through and Esc to close. Edit the title, link and **notes** there, and mark it ☆ favourite or ✓ done. **↗ Open** opens the real site.
- **Copy hand-off** (in the preview) copies a brief for Claude made of the item, its link, its group and your notes. Each group's **Hand-off** button does the same for the whole group ("help me pick what to finish next").
- **+ Group** creates a group. Double-click a group name (or use Rename) to rename it, ↑/↓ reorders, Delete moves its tiles back to Ungrouped, and "Open all" opens every link in the group.
- **Drag** tiles between groups. Drop on a tile to insert before it. Clicks within 300 ms of a drag are ignored.
- Hover a tile for ☆ favourite, ↗ open, ↻ re-capture the preview and ✕ remove.
- The search box covers titles, links and notes. **☆** shows favourites only, and the slider resizes tiles.
- **◐ Auto / ☀ Light / ☾ Dark** sets the theme (Auto follows your system).
- **✦ Wall** is the forever wall: one pannable canvas holding everything (or just what matches the search and ☆ filter), repeated endlessly in every direction so there is no edge. Favourites get big tiles, and other tiles get a stable mix of sizes. Tiles carry a chip with their group name.
  - Drag (mouse or touch) or scroll to roam, with a fling when you let go. Arrow keys glide, **⤳ Teleport** (or **T**) jumps somewhere new, and **⟲ Reset** returns to the start.
  - **Size** or ctrl+scroll (trackpad pinch) zooms. **◉ Drift** slowly moves the wall: it pauses while you hover a tile and is off by default if your system asks for reduced motion.
  - Click a tile to open the preview. Click a dashed **+** cell to add something.
  - Only the tiles near the screen are in the page, so big boards stay smooth.
- **▦ Mosaic / ☰ Tree / ✦ Wall** toggles the view (remembered). Tree is a compact outline: group → site → page. A site with 2+ pages in a group folds under one site row; click it to expand. ▸/▾ collapses a group (saved with the board), and **Expand all / Collapse all** do every group and site at once. The search opens anything that matches. Rows drag between groups like tiles; click a row to preview it.
- **⋯ menu**: Retry previews, Export board (JSON), Restore board (JSON), Clear board. A board export includes groups, tiles, notes, favourites and cached screenshot URLs.
- State persists in `localStorage` (key `mosaicPeek.v1`; older boards load as-is).

## Peeks
- Favicon: `https://www.google.com/s2/favicons?domain=…&sz=64`.
- Screenshot: Microlink first (`https://api.microlink.io/?url=…&screenshot=true&meta=false`, 2 at a time, result URL cached in the board). Its keyless tier allows 5 captures a day per network (from its `x-rate-limit-limit` header).
- When Microlink is rate-limited or can't capture a page, the tile uses thum.io (`https://image.thum.io/get/width/800/crop/600/<url>`): 1,000 free image loads a month with no key, cached by the browser for a day. A brand-new capture may first show thum.io's "loading" image; a reload shows the real one.
- If both fail → styled placeholder (domain + favicon). **↻ Retry previews** in the ⋯ menu retries; hover ↻ re-captures one tile.
- Every saved URL is sent to these services, so don't save private or tokenized links. The launch plan replaces both with its own cached screenshot server (Phase 1).

## Scope
In: paste/CSV/Markdown/bookmark/JSON import, link + note tiles, mosaic grid, tree view, forever wall, full-screen preview, notes, favourites, done, Claude hand-off, light/dark, groups (create/rename/delete/reorder), drag-and-drop (tiles and files), localStorage, JSON export/import.
Later: live/animated tiles on the wall, uploaded images/audio as tiles, browser extension reading open tabs, live iframes / in-tile browsing, multi-user sync, API-key Microlink tier.

## Folder tree
```text
mosaic-windows/
├── index.html   # the whole app: HTML + CSS + JS, served by GitHub Pages from the repo root
├── README.md
└── CLAUDE.md    # agent handoff
```
