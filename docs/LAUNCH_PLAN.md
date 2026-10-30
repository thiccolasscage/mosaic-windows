# Mosaic Peek launch plan (November 2026 to May 2027)

**Next action:** on Monday, November 2, 2026, start Phase 0, step 0.1: export a backup of your board (⋯ menu, then Export board).

The plan runs about 6 months at a relaxed pace of 3 to 5 hours a week. It has six phases, one checkpoint at the end of each, and two decision gates. Nothing big gets decided before you have used the app yourself for months: **what to ship** is decided at Gate A (March 7, 2027) and **whether to go commercial** at Gate B (April 25, 2027).

The usage guide is [GUIDE.md](GUIDE.md).

## At a glance

| # | Phase | Dates | Hours/week | Ends with |
|---|---|---|---|---|
| 0 | Make it safe to rely on | Nov 2 to Nov 15, 2026 | 3 to 5 | Checkpoint 0 |
| 1 | Personal use | Nov 16, 2026 to Jan 24, 2027 | 1 to 2 (just use it) | Checkpoint 1 (mid-point Dec 13) |
| 2 | Foundations that keep every option open | Jan 25 to Mar 7, 2027 | 4 to 6 | Checkpoint 2 and **Gate A: what to ship** |
| 3 | Build the chosen shape, then private beta | Mar 8 to Apr 4, 2027 | 4 to 6 | Checkpoint 3 |
| 4 | Beta hardening | Apr 5 to Apr 25, 2027 | 3 to 5 | Checkpoint 4 and **Gate B: commercial or not** |
| 5 | Public launch and 30-day watch | Apr 26 to May 30, 2027 | 2 to 4 | Checkpoint 5 |

The holidays (Dec 21 to Jan 3) fall inside Phase 1 on purpose: that phase only asks you to use the app.

## Can we change our minds later?

Yes, for almost everything, because Phase 2 builds the parts every option needs. This table shows how hard each choice is to undo.

| Choice | Easy to change later? | Why |
|---|---|---|
| Local-only now, accounts later | **Easy** | Accounts can be added on top. Export files become the import path. |
| Accounts now, local-only later | Hard | You would have to migrate users off and delete their data properly. |
| Web app first, app stores later | Easy | The same web app gets wrapped later. |
| App stores first | Hard | Store review, fees and in-app purchase rules lock in early. |
| Free first, paid later | Easy, if you say "free during beta" from day one | Charging for what was promised free annoys people. |
| Paid first, free later | Easy | Nobody complains about a price drop. |
| No license, decide later | Easy | All rights reserved is the most flexible default. |
| Open-source license, then closed | Hard | Released code stays open forever. |

That is why the plan starts local-only and free, and defers accounts, stores, license and pricing to the gates.

## How every phase works

- **Tests are built in.** Every phase lists the automated tests to add and the manual checks to run. From Phase 0 on, every change goes through a pull request, and GitHub runs the tests before merge.
- **A checkpoint ends every phase.** At a checkpoint you answer the questions listed for it (15 to 30 minutes). If an exit criterion is not met, the phase extends by up to 2 weeks; after that, cut scope rather than slip again.
- **Claude does the building.** Each step is sized so you can hand it to Claude Code as one request ("do Phase 0, step 0.3"). Your job is to test, decide and use the app.

---

## Phase 0: Make it safe to rely on (Nov 2 to Nov 15, 2026)

Goal: you can trust the app with your real lists before you start depending on it.

| Step | What | Who | Time |
|---|---|---|---|
| 0.1 | Export a backup of your current board | You | 2 min |
| 0.2 | Add automated tests: Playwright runs the app from a file with the network blocked, plus unit tests for the import parsers; GitHub Actions runs them on every pull request | Claude | 1 session |
| 0.3 | Fix the stored-script hole: a tile id from an imported board can run code through the screenshot error handler. Replace the inline handler, validate ids on load | Claude | 1 session |
| 0.4 | Re-check every link when a board is loaded or restored, so a `javascript:` link from a file can never reach "Open" | Claude | with 0.3 |
| 0.5 | Never lose data on a bad load: keep a copy of unreadable saved data instead of overwriting it, and show a lasting warning when saving fails | Claude | 1 session |
| 0.6 | Ask the browser for persistent storage, and show a weekly "back up now" reminder with the date of the last export | Claude | with 0.5 |
| 0.7 | Strip passwords from links and stop sending a link's private parts (`user:pass@`) to the screenshot service | Claude | with 0.3 |

**Tests added in this phase**
1. Import parsers: CSV with and without headers, a single line with a comma, Markdown checkboxes, browser bookmark HTML, Chrome bookmarks JSON, `{ "Group": [...] }` JSON.
2. Security: a crafted board file with a bad id, `<img>` in a title and a `javascript:` link triggers no script and no navigation.
3. Data: reload keeps the board; corrupt saved data is preserved, not overwritten; a failing save shows a lasting warning; export, clear and restore gives back an identical board.
4. Screenshots: with the screenshot service mocked, a success stores the image, and a rate-limit response stops further requests.

**Checkpoint 0 (Sunday, Nov 15)**
- [ ] All tests pass on GitHub for the main branch.
- [ ] The crafted malicious board file does nothing when restored.
- [ ] You have a backup file in a cloud folder.
- [ ] Question for you: is there anything that would stop you from using this every day? List it; it becomes Phase 1's first fix.

---

## Phase 1: Personal use (Nov 16, 2026 to Jan 24, 2027)

Goal: find out whether this actually helps you, and what is missing, from real use rather than guesses.

**Your weekly routine (about 20 minutes a week)**
1. Use the daily pick and weekly reset from the guide (GUIDE.md, section 1.5).
2. Keep a friction log: a group called `Mosaic feedback` on the board itself. Every time something annoys you, add a one-line note there. It costs 10 seconds.
3. Every Sunday: export a backup, then look at the friction log and star the top 1 to 3 items.

**What Claude does in this phase:** small fixes only, one to three per week, taken from the starred friction items. No big features.

**Measures to note at each checkpoint** (counted from your exported board, Claude can do this)
- Items added per week, and how many were marked done.
- Hand-offs copied (you note these in the friction log).
- How many days in the week you opened it.

**Tests added:** one regression test for every bug fixed, written before the fix.

**Mid-point check (Sunday, Dec 13, 15 minutes)**
- [ ] Have you opened it at least 3 days a week? If not, write down why. That reason is the most important finding of the whole plan.

**Checkpoint 1 (Sunday, Jan 24, 2027, 30 minutes)**
- [ ] You used it at least 3 days a week for most weeks.
- [ ] The friction log has been read and ranked.
- [ ] Questions for you:
  1. Did it help you finish anything you otherwise wouldn't have?
  2. Did you want your board on a second device? (This decides whether accounts and sync matter at Gate A.)
  3. Would you show it to a friend as it is today?
- **Stop rule:** if the answer to question 1 is no and you rarely opened it, pause the plan here. Keep using it casually, and revisit in 3 months. That is a good outcome too: it cost you very little to find out.

---

## Phase 2: Foundations that keep every option open (Jan 25 to Mar 7, 2027)

Goal: build the parts that every future shape needs, whether it stays a free local tool or becomes a paid service.

| Step | What | Why every option needs it |
|---|---|---|
| 2.1 | Own domain (for example `mosaicpeek.app`, about $10 to $20 a year) pointed at the site | Today other github.io pages share the app's storage. A domain also makes it look real. |
| 2.2 | A small screenshot server: a Cloudflare Worker that takes screenshots (Cloudflare Browser Rendering, or ApiFlash/ScreenshotOne free tiers to start), caches each URL once, and refuses private network addresses | Fixes the 5-per-day limit, keeps any paid key out of the page, and cuts cost because each URL is captured once. |
| 2.3 | Favicons from the same server with a letter-tile fallback | Google's icon address is undocumented and could vanish. |
| 2.4 | Move storage from the 5 MB local storage to IndexedDB, with numbered schema versions and migrations | Large boards, and the base for sync later. |
| 2.5 | Accessibility pass: tiles and rows reachable with Tab and Enter, the preview as a proper dialog that holds focus, labels on icon buttons, chip and small-text contrast fixed, reduced motion respected | Required for a public product, and it helps everyone. |
| 2.6 | Installable app (PWA): an icon, offline loading, "Install" on Chrome and Android, Add to Home Screen on iPhone | The cheapest way to feel like an app. |
| 2.7 | Speed: search waits until you stop typing, Mosaic view loads images lazily, the wall stops redrawing when nothing moves | Boards with thousands of items. |
| 2.8 | Error reporting that sends no personal data (Sentry free tier or similar), off by default until you opt in | You can't fix what you can't see once others use it. |

**Tests added:** accessibility scan (axe) in both themes with no serious issues; keyboard-only walkthrough test; a board of 2,000 items keeps the wall under 100 page elements and stays smooth; screenshot server tested with a mocked browser, including blocked private addresses; storage migration from the old format keeps every tile.

**Manual test pass:** Chrome, Safari on Mac, Safari on iPhone, Chrome on Android, Firefox. One checklist, about 30 minutes.

**Checkpoint 2 (Sunday, Mar 7, 2027)**
- [ ] All Phase 2 tests pass; the manual pass found no blocker.
- [ ] Screenshots work for a fresh import of 100 links within a few minutes.
- [ ] The app installs on your phone and opens offline.

### Decision Gate A: what to ship (Sunday, Mar 7, 2027)

Decide using what Phase 1 showed you.

| If Phase 1 showed... | Then ship | Phase 3 builds |
|---|---|---|
| You never wanted a second device | **Local-only web app** (no accounts) | Better export and import, a "send board to another device" file flow, polish |
| You wanted your board on phone and laptop | **Web app with optional sign-in and sync** | Accounts (Supabase or Firebase), sync, export and delete account |
| Friends asked to use it on phones specifically | Web app with sync now, and app stores after launch | Same as above; stores move to "after launch" in Phase 5 |

Recommended default if unsure: **local-only first**, because adding accounts later is easy and removing them is hard (see the table at the top).

---

## Phase 3: Build the chosen shape, then private beta (Mar 8 to Apr 4, 2027)

| Step | What |
|---|---|
| 3.1 | Build what Gate A chose (two to three weeks). |
| 3.2 | Write a short privacy policy and terms: what is stored, where (including the screenshot service), how to delete it, minimum age 16, contact email. Use a plain-English template and have it read by someone who knows the law if you go commercial at Gate B. |
| 3.3 | Add a "Send feedback" link in the ⋯ menu that opens an email or a simple form. |
| 3.4 | Cookieless analytics (Plausible, Umami or Cloudflare Web Analytics), or none at all. |
| 3.5 | Invite **5 to 15 beta testers** around Mar 29: friends, and if you like, an ADHD community you belong to. Give them the guide and one ask: "use it for two weeks, tell me what annoyed you." |

**Tests added:** if sync was chosen, two-device tests (an edit on one shows on the other, offline edits merge, deleting an account removes all its data); privacy test that no request leaves the app except to the screenshot server and analytics.

**Checkpoint 3 (Sunday, Apr 4, 2027)**
- [ ] The chosen shape works on your own two devices for a week.
- [ ] Privacy policy and terms are live on the site.
- [ ] At least 5 testers have it and have opened it.

---

## Phase 4: Beta hardening (Apr 5 to Apr 25, 2027)

| Step | What |
|---|---|
| 4.1 | Read every piece of tester feedback. Sort it into: bugs, confusion, feature requests. |
| 4.2 | Fix every bug and the top 3 confusions. Park feature requests in a "later" group on your own board. |
| 4.3 | Load test the screenshot server: 1,000 links in an hour without errors or surprise costs. Set a spending cap on every paid service. |
| 4.4 | Write the launch page: one screen that says what it is, one screenshot of the wall, one "Open the app" button. |
| 4.5 | Prepare the launch posts (where you'll share it) and a short demo video or GIF of the wall. |

**Tests:** the full automated suite, the manual cross-browser pass again, and a fresh-user test: someone who has never seen it opens it with no help and imports bookmarks within 5 minutes. Watch silently and note where they hesitate.

**Checkpoint 4 (Sunday, Apr 25, 2027): launch go or no-go**
- [ ] No open bug that loses data or breaks import.
- [ ] Fresh-user test passed.
- [ ] Spending caps set; a cost estimate for 1,000 users is written down.
- [ ] At least half the testers would be disappointed if it went away (ask them exactly that question).

### Decision Gate B: commercial or not (Sunday, Apr 25, 2027)

| Option | Choose it if | What it adds before launch |
|---|---|---|
| **Free, personal project** | You mainly want it for yourself and friends | Nothing. Keep costs on free tiers. |
| **Free now, paid extras later** | Testers love it but you're unsure they'd pay | Say "free during launch" everywhere. Decide paid extras (sync, unlimited screenshots, more boards) after 3 months of public use. |
| **Paid from launch** | Several testers said they'd pay, and costs exceed what you want to cover yourself | A merchant of record (Paddle or Lemon Squeezy), a price ($3 to $8/month or about $30 to $50/year fits the market), a free local-only tier, a refund policy, and a lawyer's read of the terms. |

Also decide the license at Gate B (see GUIDE.md, section 2.3). Recommended default: **free now, paid extras later**, with the license left as "all rights reserved" until you know.

---

## Phase 5: Public launch and 30-day watch (Apr 26 to May 30, 2027)

| When | What |
|---|---|
| Apr 26 to May 2 | Launch: post where your people are, share the demo, answer every reply in the first 48 hours. |
| Daily, first week | 5 minutes: check error reports, screenshot server costs, and feedback. |
| Weekly, weeks 2 to 5 | 20 minutes: same checks, fix the top issue of the week. |

**Rollback plan.** Every release is a merge on GitHub, so going back is one revert. If a release breaks something: revert the pull request, confirm the site is back, then fix it calmly. If costs spike: the spending caps stop the bill, and the app falls back to placeholder tiles.

**Checkpoint 5 (Sunday, May 30, 2027)**
- [ ] No data-loss incidents.
- [ ] Monthly running cost known and within what you're comfortable paying.
- [ ] Question for you: keep going, change direction, or keep it as a personal tool? Any answer is fine.

**After launch, if it's working:** app stores (Apple $99/year, Google $25 once; Apple rejects thin website wrappers, so the app needs real offline or native value first), team sharing, and the "Later" ideas in the README.

---

## Risks and what the plan does about them

| Risk | Likelihood | Plan |
|---|---|---|
| You stop using it during Phase 1 | Medium | The Dec 13 check catches it early, and the stop rule makes pausing a planned outcome. |
| Screenshot service limits or price changes | High today | Phase 2 moves it behind your own server so the provider can be swapped. |
| Data loss in someone's browser | Medium | Phase 0 safety fixes, weekly backup reminders, IndexedDB in Phase 2, sync if chosen. |
| A site owner objects to a screenshot | Low | Screenshots stay private to each user; a takedown contact is in the terms. |
| Costs grow faster than expected | Low to medium | Caching each URL once, spending caps, and a cost check at every checkpoint after launch. |
| Scope creep | High | Feature ideas go into a "later" group on the board; each phase has a fixed list. |

## Research behind this plan

The code audit and the market and cost research were done on October 30, 2026. The main findings are in GUIDE.md (Part 2) with sources. Prices and limits change, so re-check them at Gate A and Gate B.
