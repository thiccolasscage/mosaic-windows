# Mosaic Peek guide

Start here: open https://thiccolasscage.github.io/mosaic-windows/, click **+ Add**, click Samples, then Add. You now have a board to play with. Clear it later from the ⋯ menu.

Part 1 is for using Mosaic Peek yourself, every day. Part 2 covers commercial use: what is fine today, what is not, and what would have to change before anyone pays for it or uses it for business. The schedule lives in [LAUNCH_PLAN.md](LAUNCH_PLAN.md).

---

## Part 1: Personal use

### 1.1 What it is

Mosaic Peek is a wall of mini windows. Each tile is something you saved or started: a website, a to-do, an unfinished project, a song, a file. Links show a screenshot of the page; everything else shows as a colored note card. You sort tiles into groups, open any tile full screen to add notes, and press **Copy hand-off** to get a ready-made brief you can paste into Claude to start working on it.

### 1.2 Where your data lives (read this once)

| Fact | What it means for you |
|---|---|
| Everything is saved in this browser only (its local storage). | Your phone and laptop have separate boards. Clearing browser data deletes the board. |
| There is no account and no server of ours. | Nobody else can see your board. There is also **no automatic backup**. |
| Safari can delete a website's saved data after about 7 days without a visit. | In Safari on iPhone and Mac, export a backup weekly (see 1.7). |
| Each saved link is sent to a screenshot service (Microlink first, thum.io when Microlink's quota is spent), and each domain to Google for its icon. | Don't save links you wouldn't paste into another website: password-reset links, links with tokens, internal company pages. |

### 1.3 First 20 minutes (set up once)

1. Bookmark the page. (On a phone, "Add to Home Screen" also works, but on iPhone the home-screen copy may keep a separate board from Safari. Pick one and stick to it.)
2. Make 4 groups with **+ Group**: `Inbox`, `Now`, `Next`, `Someday`. New items land in Ungrouped; treat that as your inbox.
3. Import your browser bookmarks (5 minutes). Menu names vary a little by browser version:
   - Chrome or Edge: press Ctrl+Shift+O (Cmd+Shift+O on Mac), click the ⋮ menu, then "Export bookmarks".
   - Firefox: Bookmarks, then "Manage bookmarks", then "Import and Backup", then "Export Bookmarks to HTML".
   - Safari (Mac): File, then Export, then Bookmarks.
   - Drag the downloaded `.html` file onto the Mosaic Peek page. Each bookmark's innermost folder becomes its group; bookmarks sitting directly in the bookmarks bar go to Ungrouped.
4. Dump your open loops (10 minutes): click + Add and type one thing per line: projects you started, ideas, things you keep meaning to do. Lines that aren't links become note cards. `- [ ]` and `- [x]` work, and `[x]` marks it done.
5. Pick a theme: the ◐ button cycles Auto, Light and Dark.

Screenshots come from two free services. Microlink takes the first 5 each day (its limit without a key, confirmed from its response headers on October 30, 2026); after that, and for any page Microlink can't capture, thum.io fills in (1,000 free image loads a month, no sign-up). A brand-new thum.io screenshot may first show a "loading" picture; reload the page a minute later. The plan's own screenshot server (Phase 1) replaces both.

### 1.4 The three views

| View | Use it for | Controls |
|---|---|---|
| ▦ Mosaic | Sorting. Tiles grouped in boxes. | Drag tiles between groups (mouse; touch dragging may not work). Size slider. Hover a tile for ☆ ↗ ↻ ✕. |
| ☰ Tree | Seeing everything at once as a list. | ▾ folds a group, ▸ unfolds it. Sites with several pages fold together. Hover a row for ☆ ✕. |
| ✦ **Wall** | Browsing for inspiration, or picking "what next" without thinking hard. | Drag or scroll to roam. T teleports. Arrow keys glide. Ctrl+scroll zooms. ⟲ Reset returns to the start. ◉ Drift moves the wall slowly; it is on by default, so turn it off if it distracts you. |

Click any tile in any view to open the full-screen preview. There you can edit the title, link and notes, mark it ☆ favourite, toggle ○ Not done / ✓ Done, step through the group with ← and →, and close with Esc.

### 1.5 Routines that work with ADHD

These are suggestions to test during Phase 1. Keep the ones that stick.

#### Capture (any time, 10 seconds)

Paste a link anywhere on the page and it is added. For a thought, click + Add and type one line. Don't sort while capturing.

#### Daily pick (2 minutes)

1. Open the ✦ Wall and turn on ☆ (favourites only).
2. Click the tile that pulls at you.
3. Write one sentence in Notes: what "done" looks like today.
4. Press Copy hand-off, paste it into Claude, and start.

#### Weekly reset (15 minutes, same day each week)

1. Open ▦ Mosaic. Drag everything in Ungrouped into `Now`, `Next` or `Someday`.
2. Keep at most 3 favourites. A star is a promise to yourself, so fewer is better.
3. Mark finished things done in the preview instead of deleting them. Done tiles stay on the board, dimmed and crossed out, so you can see what you finished.
4. Export a backup (see 1.7).

#### When overwhelmed

Press a group's Hand-off button (top right of the group). It copies the whole group with a request to help you pick what to finish next. Paste it into Claude.

### 1.6 Copy hand-off: getting good results from Claude

The hand-off is only as good as your notes. Before copying, write in Notes:
1. What it is, in your words ("half-built synth app, oscillators work, no UI").
2. What you want next ("make it a toy my kid can use on an iPad").
3. Any limits ("no frameworks", "one evening of work").

Paste it into Claude, Claude Code or another assistant. The hand-off already asks the assistant to check with you before building, so you stay in control.

### 1.7 Backups (5 minutes a week)

1. ⋯ menu, then Export board (JSON). A file like `mosaic-peek-2026-11-08.json` downloads. (The date in the name is in UTC, so late in the evening it can show tomorrow.)
2. Put it in a cloud folder (Google Drive, iCloud, OneDrive).
3. To restore: ⋯ menu, then Restore board (JSON). This replaces the current board; it does not merge. Export first if the current one matters.

To move a board between devices, export on one and restore on the other. Until Phase 0 is done, **only restore files you exported yourself**: a board file from someone else could contain harmful code.

### 1.8 Import formats cheat sheet

| You have | Do this |
|---|---|
| Browser bookmarks | Export to HTML (see 1.3) and drop the file on the page. |
| Chrome's internal `Bookmarks` file | Drop it on the page. Folders become groups. |
| A to-do list or notes | Paste it into + Add, one item per line. Markdown lists work. |
| A spreadsheet | Save as CSV with a `url` column (or links in the first column), plus optional `title`, `note` and `group` columns. Rows without a link become notes. |
| Songs, files, app links | Paste links like `spotify:track:…`. They become note cards with ↗ Open. Browsers usually block web pages from opening `file:///` links, so file links may only work as a record of where the file lives. |
| JSON from another tool | An array of links, or `{ "Group name": [ ... ] }`, works. |

### 1.9 Keyboard and mouse

| Where | Keys |
|---|---|
| Anywhere | Paste a URL (outside a text box) to add it. Drop files or links to import. |
| Preview | ← → step through the group. Esc closes. |
| Wall | Drag or scroll to roam. Arrow keys glide. T teleports. Ctrl+scroll zooms. |

Known gap: tiles can't yet be opened with the keyboard alone (Tab and Enter). The plan fixes this in Phase 2.

### 1.10 Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| A tile shows a "loading" picture | thum.io was still taking the screenshot. | Reload the page after a minute. |
| Previews stop appearing late in the month | thum.io's 1,000 free loads a month may be used up. | Wait for the new month, or add thum.io's $1/month plan (Phase 1 builds a proper fix). |
| A tile says "no preview" | Both services failed for that page. | In Mosaic view, hover the tile and press ↻ once. Some sites never allow it. |
| Board is empty after a while on iPhone | Safari deleted the site's data. | Restore your latest export. Export weekly from now on. |
| Edits vanished with two tabs open | Other tabs refresh when you save, but editing in two tabs at once can overwrite. | Edit in one tab at a time. |

---

## Part 2: Commercial use

This part is general information, not legal advice. Talk to a lawyer before you charge money or sign a business contract around it.

You haven't decided whether Mosaic Peek will be commercial, and you don't need to yet. The plan puts that decision at **Decision Gate B (May 2, 2027)**, after months of your own use and a private beta, and it never requires charging at launch.

### 2.1 Three things "commercial" can mean

| Path | Example | Can you do it today? |
|---|---|---|
| A. Use it for your own paid work | Research boards for a client, a moodboard for a job | Yes, with care: see 2.2. |
| B. Let others use it for their work | A team adopts it | Not yet: no accounts, no sharing, no data agreements. |
| C. Sell it | Subscription or one-time purchase | Not yet: see 2.4. |

### 2.2 Using it for paid work today (path A)

Reasonable to do, with these limits:
1. Client confidentiality. Every saved link goes to a screenshot service (Microlink or thum.io) and every domain to Google (icons). Don't save client links that are private, tokenized or under an NDA.
2. Microlink's terms (no date shown, checked October 30, 2026) allow personal, commercial and non-commercial use but ban undefined "unfair use". Heavy client work needs their paid plan ($49/month for about 46,000 captures as listed then) or the plan's own screenshot server.
3. Backups are on you. There is no server copy. Export before every client delivery.
4. Screenshots of other sites are lower risk when kept for your own private reference. Don't put them in client deliverables without the site owner's permission. The court cases that support thumbnails were about search engines, so don't assume they cover other uses.

### 2.3 Who owns the code right now

The repository is public but has no license file. By default that means all rights are reserved: people can view the code but have no permission to copy, change or reuse it, apart from forking it on GitHub, which GitHub's own terms allow for public repositories. That default keeps every option open. Decide at Gate B:

| Choice | Effect |
|---|---|
| Keep "all rights reserved" (no license) | Simplest. To hide the code, you could make the repo private, but on a free GitHub plan the site on GitHub Pages needs a public repo, so check your plan or move hosting first (Phase 2 adds your own domain). |
| A source-available license (free for personal use, paid for commercial) | People can see and self-host for personal use while you sell the hosted version. |
| An open-source license (MIT, AGPL) | Others can reuse it, including commercially. MIT allows closed copies; AGPL requires hosted copies to share their changes. As the sole author you can change the license for future versions, but versions already released stay under the open license. |

### 2.4 What has to exist before selling it (path C)

| Area | Needed | Why |
|---|---|---|
| Security | Phase 0 fixes (imported boards can't run code, links re-checked, a Content-Security-Policy) | Today a crafted board file could run code in the browser. |
| Own domain | `mosaicpeek.app` or similar instead of `github.io` | Today other pages on the same github.io address share the app's storage. |
| Screenshot server | A small server (a Cloudflare Worker) that holds the key, caches screenshots, rate-limits each user and refuses private network addresses | The keyless tier is tiny, and a key must not sit in the page. |
| Accounts and sync, if chosen | Sign-in, server storage, export and account deletion | People expect boards on every device; privacy law and app stores expect deletion. |
| Privacy policy and terms | What is stored, which services see it (screenshot service, error reporting, sync), how to delete it, a minimum age | Likely required under UK and EU GDPR once you hold user data; saved links can reveal health or other sensitive interests. Age rules vary by country (13 to 16); 16+ is a simple, cautious choice. |
| Analytics | Cookieless (Plausible, Umami, Cloudflare Web Analytics) or none | Avoids cookie banners in most cases. |
| Payments | A merchant of record (Paddle or Lemon Squeezy, about 5% + 50¢ per sale) | They become the legal seller and handle VAT and sales tax worldwide. On a $3 monthly plan that fee is about 22%, so yearly plans (one fee a year) work better at low prices. |
| Support | An email address and a takedown contact | Site owners may ask for screenshots of their pages to be removed. |

### 2.5 Market context (as of October 30, 2026)

| Product | Price then | Note |
|---|---|---|
| Raindrop.io | about $3/month (Pro, third-party figure) | Bookmark manager with a free tier |
| mymind | $4.99 to $12.99/month | Visual "private mind", no free tier listed |
| Milanote | about $10 to $12.50/month | Visual boards, free tier of 100 items |
| Are.na | free tier of 200 connections | Visual research boards |
| Tiimo | about $6 to $8/month (sources conflict) | ADHD visual planner |
| Pocket | shut down July 2025 | Its former users had to move their saves elsewhere |
| forevercomponents.com | £5/month or £50/year | The inspiration; free tier is 3 copies per day |

In that research, no product combined one wall for links, to-dos and unfinished projects built around ADHD "open loops", low-friction import, no account needed, and an AI hand-off. If you sell it, the comparable prices suggest **$3 to $8 per month**, with a generous free local-only tier.

### 2.6 Rough running costs if it goes public

Estimates from the research. Assumptions: about 50 new links per user per month, and about half of them already captured for someone else, so only half need a new screenshot.

| Users | New screenshots per month | Rough monthly cost |
|---|---|---|
| 100 | about 2,500 | $0 to $10 |
| 1,000 | about 25,000 | $10 to $40 |
| 10,000 | about 250,000 | $60 to $150 |

None of these dollar figures are verified; the plan's load test (Phase 4) checks them. Payment fees come on top.

### 2.7 Sources (opened October 30, 2026)

- Microlink rate limits: https://microlink.io/docs/api/basics/rate-limit, pricing: https://microlink.io/pricing, terms: https://microlink.io/tos
- Screenshot alternatives: https://apiflash.com/, https://screenshotone.com/pricing/, https://developers.cloudflare.com/browser-rendering/pricing/
- Thumbnail fair use (US): https://www.copyright.gov/fair-use/summaries/perfect10-amazon-9thcir2007.pdf
- Competitor pricing: https://mymind.com/pricing, https://milanote.com/plans, https://raindrop.io/pro/buy
- Payments: https://stripe.com/pricing, https://www.paddle.com/pricing, https://www.lemonsqueezy.com/pricing
- App Store rules: https://developer.apple.com/app-store/review/guidelines/
