# Mosaic Peek guide

Start here: open https://thiccolasscage.github.io/mosaic-windows/, click **+ Add**, click **Samples**, then **Add**. You now have a board to play with. Clear it later from the ⋯ menu.

This guide has two parts. Part 1 is for using Mosaic Peek yourself, every day. Part 2 covers commercial use: what is fine today, what is not, and what would have to change before anyone pays for it or uses it for business. The launch plan lives in [LAUNCH_PLAN.md](LAUNCH_PLAN.md).

---

## Part 1: Personal use

### 1.1 What it is, in one paragraph

Mosaic Peek is a wall of mini windows. Each tile is something you saved or started: a website, a to-do, an unfinished project, a song, a file. Links show a screenshot of the page; everything else shows as a colored note card. You sort tiles into groups, open any tile full screen to add notes, and press **Copy hand-off** to get a ready-made brief you can paste into Claude to start working on it.

### 1.2 Where your data lives (read this once)

| Fact | What it means for you |
|---|---|
| Everything is saved in **this browser only** (its local storage). | Your phone and laptop have separate boards. Clearing browser data deletes the board. |
| There is no account and no server of ours. | Nobody else can see your board. There is also no automatic backup. |
| Safari can wipe site data after about 7 days without a visit. | On iPhone and Mac Safari, export a backup weekly (see 1.7). |
| Each saved link is sent to Microlink to take a screenshot, and each domain to Google to fetch its icon. | Don't save private links you wouldn't paste into another website, such as password-reset links, links with tokens or internal company pages. |

### 1.3 First 20 minutes (set up once)

1. **Bookmark the page**, or on a phone use Share then "Add to Home Screen". (2 min)
2. **Make 4 groups** with **+ Group**: `Inbox`, `Now`, `Next`, `Someday`. (2 min) Everything new lands in Ungrouped; treat that as your inbox, or drop it into `Inbox`.
3. **Import your browser bookmarks** (5 min):
   - Chrome or Edge: press Ctrl+Shift+O (Cmd+Shift+O on Mac), click the ⋮ menu, then "Export bookmarks".
   - Firefox: Bookmarks, then "Manage bookmarks", then "Import and Backup", then "Export Bookmarks to HTML".
   - Safari (Mac): File, then Export, then "Bookmarks".
   - Then drag the downloaded `.html` file onto the Mosaic Peek page. Each bookmark folder becomes a group.
4. **Dump your open loops** (10 min): click **+ Add** and type one thing per line: projects you started, ideas, things you keep meaning to do. Lines that aren't links become note cards. `- [ ]` and `- [x]` work, and `[x]` marks it done.
5. **Pick the theme**: the ◐ button cycles Auto, Light and Dark.

Screenshots fill in slowly. The free screenshot service allows only a few captures per day without a key (its docs say about 5 per day per network). Tiles without one show a colored card with the site's name, and **↻ Retry previews** in the ⋯ menu tries again later. This limit is the biggest known weakness and is the first thing the launch plan fixes.

### 1.4 The three views

| View | Use it for | Controls |
|---|---|---|
| ▦ **Mosaic** | Sorting. Tiles grouped in boxes. | Drag tiles between groups. Size slider. Hover a tile for ☆ ↗ ↻ ✕. |
| ☰ **Tree** | Seeing everything at once as a list. | Click ▸ to fold a group. Sites with several pages fold together. |
| ✦ **Wall** | Browsing for inspiration, or picking "what next" without thinking hard. | Drag or scroll to roam. **T** teleports. Arrow keys glide. Ctrl+scroll zooms. ◉ Drift moves the wall slowly. |

Click any tile in any view to open the **full-screen preview**. There you can edit the title, link and notes, mark it ☆ favourite or ✓ done, step through the group with ← and →, and close with Esc.

### 1.5 Routines that work with ADHD

These are suggestions to test during your personal-use phase. Keep the ones that stick.

**Capture (any time, 10 seconds).** Paste a link anywhere on the page and it is added. For a thought, click **+ Add** and type one line. Don't sort while capturing.

**Daily pick (2 minutes).**
1. Open the ✦ Wall and turn on ☆ (favourites only).
2. Click the tile that pulls at you.
3. Write one sentence in Notes: what "done" looks like today.
4. Press **Copy hand-off**, paste it into Claude, and start.

**Weekly reset (15 minutes, same day each week).**
1. Open ▦ Mosaic. Drag everything in Ungrouped into `Now`, `Next` or `Someday`.
2. Keep at most 3 favourites. A star is a promise to yourself, so fewer is better.
3. Mark finished things ✓ done instead of deleting them. Seeing the done pile is the reward.
4. Export a backup (see 1.7).

**When overwhelmed.** On a group, press **Hand-off** (top right of the group). It copies the whole group with a request to help you pick what to finish next. Paste it into Claude.

### 1.6 Copy hand-off: getting good results from Claude

The hand-off is only as good as your notes. Before copying, write in Notes:
1. What it is in your words ("half-built synth app, oscillators work, no UI").
2. What you want next ("make it a toy my kid can use on an iPad").
3. Any limits ("no frameworks", "one evening of work").

Then paste into Claude, Claude Code or another assistant. The hand-off already asks the assistant to check with you before building, so you stay in control.

### 1.7 Backups (5 minutes a week)

1. ⋯ menu, then **Export board (JSON)**. A file like `mosaic-peek-2026-11-08.json` downloads.
2. Put it in a cloud folder (Google Drive, iCloud, OneDrive).
3. To restore: ⋯ menu, then **Restore board (JSON)**. This replaces the current board, so export first if the current one matters.

Restore replaces the board; it does not merge two boards. To move a board between devices, export on one and restore on the other.

### 1.8 Import formats cheat sheet

| You have | Do this |
|---|---|
| Browser bookmarks | Export to HTML (see 1.3) and drop the file on the page. Folders become groups. |
| Chrome's internal `Bookmarks` file | Drop it on the page. Folders become groups. |
| A to-do list or notes | Paste it into **+ Add**, one item per line. Markdown lists work. |
| A spreadsheet | Save it as CSV with columns `url`, `title`, `note`, `group` (any can be missing) and load it. |
| Songs, files, app links | Paste links like `spotify:track:…` or `file:///…`. They become note cards that open the link. |
| JSON from another tool | An array of links, or `{ "Group name": [ ... ] }`, works. |

### 1.9 Keyboard and mouse

| Where | Keys |
|---|---|
| Anywhere | Paste a URL (outside a text box) to add it. Drop files or links to import. |
| Preview | ← → step through the group. Esc closes. |
| Wall | Drag or scroll to roam. Arrow keys glide. **T** teleports. Ctrl+scroll zooms. |

Known gap: tiles can't yet be opened with the keyboard alone (Tab and Enter). The launch plan fixes this in Phase 2.

### 1.10 Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Tiles say "preview rate-limited" | The free screenshot quota is used up. | Wait a day, then ⋯ then **↻ Retry previews**. |
| A tile says "no preview" | The site blocked the screenshot or timed out. | Hover the tile and press ↻ to retry once. Some sites never allow it. |
| Board is empty after a while on iPhone | Safari cleared the site's data. | Restore your latest export. Export weekly from now on. |
| Pasting one line with a comma added nothing | A bug in v2, fixed in the same change that added this guide. | Reload the page to get the fix. |
| Two open tabs disagree | Each tab saves the whole board; the last save wins. | Use one tab at a time. |

---

## Part 2: Commercial use

This part is general information, not legal advice. Talk to a lawyer before you charge money or sign a business contract around it.

You haven't decided whether Mosaic Peek will be commercial, and you don't need to yet. The plan puts that decision at **Decision Gate B (April 25, 2027)**, after months of your own use and a private beta. This part explains what each path would involve so the decision is informed.

### 2.1 Three different things "commercial" can mean

| Path | Example | Can you do it today? |
|---|---|---|
| A. Use it for your own paid work | Research boards for a client, a moodboard for a job | Yes, with care: see 2.2. |
| B. Let others use it for their work | A team or an organization adopts it | Not yet: no accounts, no sharing, no data agreements. |
| C. Sell it | Subscription or one-time purchase | Not yet: see 2.4 for the list of what is missing. |

### 2.2 Using it for paid work today (path A)

Fine to do, with these limits:
1. **Client confidentiality.** Every saved link goes to Microlink (screenshots) and every domain to Google (icons). Don't save client links that are private, tokenized or under an NDA.
2. **Microlink's terms** allow personal, commercial and non-commercial use but ban undefined "unfair use", and the free tier is tiny. Heavy client work needs a paid key ($49/month for about 46,000 captures).
3. **Backups are on you.** There is no server copy. Export before every client delivery.
4. **Screenshots of other sites** are fine for your own private reference. Don't put them in client deliverables without the site owner's permission.

### 2.3 Who owns the code right now

The repository is public but has **no license file**. By default that means all rights are reserved: people can view the code but have no permission to copy, change or reuse it. That default keeps every option open. Before Decision Gate B, pick one of these:

| Choice | Effect |
|---|---|
| Keep "all rights reserved" (no license) | Simplest. You keep full control. Make the repo private if you don't want people reading the code. |
| A source-available license (for example, free for personal use, paid for commercial) | Lets people see and self-host for personal use while you sell the hosted version. |
| An open-source license (MIT, AGPL) | Others can reuse it, including commercially. MIT allows closed forks; AGPL requires forks of a hosted service to share their changes. |

### 2.4 What has to exist before selling it (path C)

| Area | Needed | Why |
|---|---|---|
| Security | Fix the stored-script issue in board imports, add a Content-Security-Policy, re-check links on restore | A shared board file could run code in a user's browser today (Phase 0 fixes this). |
| Own domain | `mosaicpeek.app` or similar instead of `github.io` | Today any other page on the same github.io account shares storage with the app. |
| Screenshot service | A small server (for example a Cloudflare Worker) that holds a paid key and caches screenshots | The keyless tier allows only a handful of captures per day, and the key must not sit in the page. |
| Accounts and sync, if chosen | Sign-in, server storage, export and account deletion | People expect boards on every device; app stores and privacy law require deletion. |
| Privacy policy and terms | Name the screenshot processor, say what is stored, how to delete it, minimum age (16+ is simplest) | Required by UK and EU GDPR once you hold user data; saved links can reveal health or other sensitive interests. |
| Analytics | Cookieless (Plausible, Umami, Cloudflare Web Analytics) or none | Avoids cookie consent banners. |
| Payments | A merchant of record (Paddle or Lemon Squeezy, about 5% + 50¢) | They become the legal seller and handle VAT and sales tax worldwide, which a solo seller otherwise must file in each region. |
| Support | An email address and a takedown contact | Site owners may ask for screenshots of their pages to be removed. |

### 2.5 Market context (from research on October 30, 2026)

| Product | Price | Note |
|---|---|---|
| Raindrop.io | about $3/month (Pro) | Bookmark manager with a free tier |
| mymind | $4.99 to $12.99/month | Visual "private mind", no free tier listed |
| Milanote | about $10 to $12.50/month | Visual boards, free tier of 100 items |
| Are.na | free tier of 200 connections | Visual research boards |
| Tiimo | about $6 to $8/month | ADHD visual planner |
| Pocket | shut down July 2025 | Its former users are looking for a new home |
| forevercomponents.com | £5/month or £50/year | The inspiration; free tier is 3 copies per day |

No competitor found combines one wall for links, to-dos and unfinished projects, built for ADHD "open loops", with low-friction import, no account needed, and an AI hand-off. The research suggests a realistic price range of **$3 to $8 per month** if you sell it, with a generous free local-only tier.

### 2.6 Rough running costs if it goes public

These are estimates from the research, assuming about 50 new links per user per month and screenshots cached so each URL is captured once.

| Users | Screenshots per month | Rough monthly cost |
|---|---|---|
| 100 | about 2,500 | $0 to $10 |
| 1,000 | about 25,000 | $10 to $40 |
| 10,000 | about 250,000 | $60 to $150 |

Payment fees of about 5% + 50¢ per sale are on top. The 10,000-user figure is not verified and needs a load test before you rely on it.

### 2.7 Sources

- Microlink rate limits: https://microlink.io/docs/api/basics/rate-limit, pricing: https://microlink.io/pricing, terms: https://microlink.io/tos
- Screenshot alternatives: https://apiflash.com/, https://screenshotone.com/pricing/, https://developers.cloudflare.com/browser-rendering/pricing/
- Thumbnail fair use (US): https://www.copyright.gov/fair-use/summaries/perfect10-amazon-9thcir2007.pdf
- Competitor pricing: https://mymind.com/pricing, https://milanote.com/plans, https://raindrop.io/pro/buy
- Payments: https://stripe.com/pricing, https://www.paddle.com/pricing, https://www.lemonsqueezy.com/pricing
- App Store rules: https://developer.apple.com/app-store/review/guidelines/
