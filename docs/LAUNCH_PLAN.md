# Mosaic Peek launch plan (November 2026 to June 2027)

Next action: on Monday, November 2, 2026, start Phase 0, step 0.1: export a backup of your board (⋯ menu, then Export board).

The plan reaches a public launch in about 6 months (early May 2027) at a relaxed pace, then watches it for a month. Weekly time ranges from 1 to 6 hours depending on the phase. Six phases each end with a checkpoint, and two decision gates hold the big choices until you have evidence: **what to ship** at Gate A (March 7, 2027) and **whether to go commercial** at Gate B (May 2, 2027).

The usage guide is [GUIDE.md](GUIDE.md).

## At a glance

| # | Phase | Dates | Your time | Ends with |
|---|---|---|---|---|
| 0 | Make it safe to rely on | Nov 2 to Nov 15, 2026 | 2 to 3 h/week (Claude builds, you check) | Checkpoint 0 |
| 1 | Personal use, with real screenshots | Nov 16, 2026 to Jan 24, 2027 | 1 to 2 h/week | Checkpoint 1 (mid-point Dec 13) |
| 2 | Foundations for every option | Jan 25 to Mar 7, 2027 | 3 to 5 h/week | Checkpoint 2 and Gate A: what to ship |
| 3 | Build the chosen shape, start a private beta | Mar 8 to Apr 11, 2027 | 4 to 6 h/week | Checkpoint 3 |
| 4 | Beta hardening | Apr 12 to May 2, 2027 | 3 to 5 h/week | Checkpoint 4 and Gate B: commercial or not |
| 5 | Public launch and watch | May 3 to Jun 6, 2027 | 2 to 4 h/week | Checkpoint 5 |

The holidays (Dec 21 to Jan 3) fall inside Phase 1 on purpose: that phase mostly asks you to use the app.

## Can we change our minds later?

Yes, for almost everything. This table shows how hard each choice is to undo.

| Choice | Change later? | Why |
|---|---|---|
| Local-only now, accounts later | Easy to start | Accounts can be added on top and export files become the import path. Building sync itself is still real work (Phase 3 budgets 3 weeks). |
| Accounts now, local-only later | Hard | You would have to move people off and delete their data properly. |
| Web app first, app stores later | Easy | The same web app gets wrapped later. |
| App stores first | Hard | Store review, fees and in-app purchase rules lock in early. |
| Free first, paid later | Easy, if you say "free during launch" from day one | Charging for what was promised free annoys people. |
| No license now, decide later | Easy | "All rights reserved" is the most flexible default. |
| Open-source license, then closed | Hard for what is released | You can change the license for future versions, but released versions stay open. |

That is why the plan starts local-only and free, and defers accounts, stores, license and pricing to the gates.

## How every phase works

- Tests are built in. Every phase lists the automated tests to add and the manual checks to run. From Phase 0 on, every change goes through a pull request and GitHub runs the tests before merge.
- A checkpoint ends every phase: 15 to 30 minutes answering its questions. If an exit criterion is not met, the phase extends by up to 2 weeks; after that, cut scope rather than slip again.
- Claude does the building. Each step is sized to hand to Claude Code as one request ("do Phase 0, step 0.3"). Your job is to test, decide and use the app.

---

## Phase 0: Make it safe to rely on (Nov 2 to Nov 15, 2026)

Goal: you can trust the app with your real lists, and it starts recording the numbers Checkpoint 1 needs.

| Step | What | Who |
|---|---|---|
| 0.1 | Export a backup of your current board | You, 2 min |
| 0.2 | Automated tests: Playwright runs the app from a file with the network blocked, plus unit tests for the import parsers; GitHub Actions runs them on every pull request | Claude |
| 0.3 | Close the stored-script hole (an imported board's tile id can run code through the screenshot error handler), validate ids on load, and add a Content-Security-Policy as a meta tag with a hash for the page's script | Claude |
| 0.4 | Re-check every link when a board is loaded or restored, so a `javascript:` link can never reach Open | Claude |
| 0.5 | Never lose data on a bad load: keep a copy of unreadable saved data instead of overwriting it, and show a lasting warning when saving fails | Claude |
| 0.6 | Ask the browser for persistent storage, and show a weekly "back up now" reminder with the date of the last export | Claude |
| 0.7 | Privacy: strip passwords from links, and add a "no preview" switch per tile and per group so private links are never sent to the screenshot service | Claude |
| 0.8 | Your stats: a small local log of days opened, hand-offs copied and the date each item was marked done, shown in the ⋯ menu; the `Mosaic feedback` group is left out of the counts | Claude |

#### Tests added in this phase

1. Import parsers: CSV with and without headers, a single line with a comma, a comma line followed by links, Markdown checkboxes, browser bookmark HTML, Chrome bookmarks JSON, `{ "Group": [...] }` JSON.
2. Security: a crafted board with a bad id, `<img>` in a title and a `javascript:` link triggers no script and no navigation.
3. Data: reload keeps the board; corrupt saved data is preserved; a failing save shows a lasting warning; export, clear and restore gives back an identical board.
4. Screenshots (mocked): a success stores the image, a rate-limit response stops further requests, and a "no preview" tile is never sent.
5. Stats: opening the app, copying a hand-off and marking done each update the counts.

#### Checkpoint 0 (Sunday, Nov 15)

- [ ] All tests pass on GitHub for the main branch.
- [ ] The crafted malicious board does nothing when restored.
- [ ] You have a backup file in a cloud folder.
- [ ] Question: is anything stopping you from using this every day? It becomes Phase 1's first fix.

---

## Phase 1: Personal use, with real screenshots (Nov 16, 2026 to Jan 24, 2027)

Goal: find out from real use whether this helps you, and what is missing. The screenshot fix moves here, to the first three weeks, so you judge the app with real previews rather than placeholders.

| Step | What | Who |
|---|---|---|
| 1.1 | Create a free Cloudflare account. Claude gives you the setup steps, and you run the deploy command yourself, so no password or key passes through Claude | You, 20 min |
| 1.2 | By Dec 6: a screenshot server on a Cloudflare Worker that caches each link once, limits requests per user, only answers this app, and refuses private network addresses; favicons from it with a letter-tile fallback | Claude |
| 1.3 | Make a group called `Mosaic feedback`. Each time something annoys you, add a one-line note there (10 seconds) | You |
| 1.4 | Use the daily pick and weekly reset from the guide (GUIDE.md, section 1.5) | You |
| 1.5 | Every Sunday: export a backup, read the feedback group, star the top 1 to 3 items | You, 15 min |
| 1.6 | Fix 1 to 3 starred items a week, each with a regression test written first | Claude |

#### Tests added

screenshot server tests with a mocked browser (cache hit, per-user limit, a private address refused, a request from another site refused), and one regression test per bug fixed.

#### Mid-point check (Sunday, Dec 13, 15 minutes)

- [ ] Your stats show the app opened on at least 3 days in most weeks. If not, write down why. That reason is the most important finding of the whole plan.

#### Checkpoint 1 (Sunday, Jan 24, 2027, 30 minutes)

- [ ] Your stats: days opened per week, items added, items marked done, hand-offs copied (Claude can summarise them from an export).
- [ ] The feedback group has been read and ranked.
- [ ] Questions:
  1. Did it help you finish anything you otherwise wouldn't have?
  2. Did you want your board on a second device? This decides Gate A.
  3. Would you show it to a friend as it is today?
- Stop rule: if question 1 is a no and you opened it on fewer than 2 days most weeks, pause the plan here. Keep using it casually and revisit in 3 months. That is a good outcome too: finding out cost very little.

---

## Phase 2: Foundations for every option (Jan 25 to Mar 7, 2027)

Goal: build what any public version needs, whether it stays a free local tool or becomes a paid service.

| Step | What | Why every option needs it |
|---|---|---|
| 2.1 | Own domain (for example `mosaicpeek.app`, about $10 to $20 a year) | Other github.io pages share the app's storage today. It also frees you to make the repo private later. |
| 2.2 | Storage moves to IndexedDB with numbered schema versions; every migration first saves a backup copy of the old data | Large boards, the base for sync, and a safe rollback. |
| 2.3 | Accessibility: tiles and rows reachable with Tab and Enter, the preview as a proper dialog that holds focus, labels on icon buttons, chip and small-text contrast fixed, reduced motion respected | Required for a public product, and it helps everyone. |
| 2.4 | Speed: search waits until you stop typing, Mosaic loads images lazily, the wall stops redrawing when nothing moves | Boards with thousands of items. |
| 2.5 | Error reporting with no personal data (Sentry free tier or similar), off until the user opts in | You can't fix what you can't see once others use it. |

#### Tests added

accessibility scan (axe) in both themes with no serious issues; keyboard-only walkthrough; storage migration keeps every tile and leaves a backup; at 1920 by 1080 and the default tile size, a 2,000-item wall keeps fewer than 200 tiles in the page and scrolls smoothly.

#### Manual test pass (30 minutes)

Chrome, Safari on Mac, Safari on iPhone, Chrome on Android, Firefox.

#### Checkpoint 2 (Sunday, Mar 7, 2027)

- [ ] All Phase 2 tests pass; the manual pass found no blocker.
- [ ] 100 freshly imported links all have screenshots within 10 minutes.
- [ ] Your own domain serves the app, and your board moved over intact.

### Decision Gate A: what to ship (Sunday, Mar 7, 2027)

Decide from Checkpoint 1, question 2.

| If Phase 1 showed... | Ship | Phase 3 builds |
|---|---|---|
| You never needed a second device | Local-only web app | Easier export and import between devices, polish |
| You wanted the same board on phone and laptop | Web app with optional sign-in and sync | Accounts (Supabase or Firebase), sync, export and account deletion |

Recommended if unsure: **local-only**, because adding accounts later is easy and removing them is hard. App stores are not on the table until after launch: the installable web app (Phase 3) already works on phones, and Apple rejects thin website wrappers.

---

## Phase 3: Build the chosen shape, start a private beta (Mar 8 to Apr 11, 2027)

| Step | What | When |
|---|---|---|
| 3.1 | Build what Gate A chose | Mar 8 to Mar 28 |
| 3.2 | Installable app (PWA): icon, offline loading, "Install" on Chrome and Android, Add to Home Screen on iPhone; it updates itself and has a switch to turn the offline copy off if a release goes wrong | Mar 8 to Mar 28 |
| 3.3 | Privacy policy and terms for a free beta: what is stored, which services see it (screenshot server, error reporting, sync if chosen), how to delete it, age 16+, contact email | By Mar 28 |
| 3.4 | A "Send feedback" link in the ⋯ menu, and cookieless analytics (Plausible, Umami or Cloudflare Web Analytics) or none | By Mar 28 |
| 3.5 | You use the new version on your own devices for a week | Mar 29 to Apr 4 |
| 3.6 | Invite 5 to 15 beta testers: friends, and if you like, an ADHD community you belong to. Send the guide and a 3-question survey for Apr 25: what annoyed you, would you be disappointed if it went away, would you pay $4 a month or $36 a year for it | Apr 5 |
| 3.7 | Write down the most you are willing to pay per month to run it yourself (a dollar number) | You, by Apr 11 |

#### Tests added

if sync was chosen, two-device tests (an edit on one shows on the other, offline edits merge, deleting an account removes all its data); a privacy test that the app contacts nothing except the screenshot server, analytics, error reporting (only when opted in) and the sync backend (if chosen).

#### Checkpoint 3 (Sunday, Apr 11, 2027)

- [ ] The chosen shape worked on your own devices for a week.
- [ ] Privacy policy and terms are live on the site.
- [ ] At least 5 testers have opened it.
- [ ] Your monthly budget number is written down.

---

## Phase 4: Beta hardening (Apr 12 to May 2, 2027)

| Step | What |
|---|---|
| 4.1 | Collect the surveys (due Apr 25) and sort feedback into bugs, confusion and requests |
| 4.2 | Fix every bug and the top 3 confusions; park requests in a "later" group on your own board |
| 4.3 | Load test the screenshot server (1,000 links in an hour); set budget alerts on every paid service, plus hard limits where the provider offers them, and note which ones only alert |
| 4.4 | A one-screen launch page: what it is, one picture of the wall, an "Open the app" button |
| 4.5 | Launch posts and a short demo video of the wall |

#### Tests

the full automated suite, the manual cross-browser pass again, and a fresh-user test: someone who has never seen it imports their bookmarks within 5 minutes with no help. Watch silently and note where they hesitate.

#### Checkpoint 4 (Sunday, May 2, 2027): launch go or no-go

- [ ] No open bug that loses data or breaks import.
- [ ] Fresh-user test passed.
- [ ] Budget alerts set; the cost for 1,000 users, from the load test, is written down.
- [ ] At least half the testers said they would be disappointed if it went away.

### Decision Gate B: commercial or not (Sunday, May 2, 2027)

Launch is free in every option, so this gate never forces payments to be ready in a hurry.

| Option | Choose it if | What happens |
|---|---|---|
| Free personal project | You mainly want it for yourself and friends, and costs fit your budget | Nothing changes. Stay on free tiers. |
| Free at launch, decide on paid extras later | Testers liked it but fewer than 3 said yes to paying | Launch says "free during launch". Revisit 3 months after launch with real usage numbers. |
| Paid plan soon after launch | 3 or more testers said yes to $4 a month or $36 a year, or the 1,000-user cost is above your budget | Launch says "free during launch". In June: a merchant of record, a free local-only tier, a refund policy, a lawyer's read of the terms, then the paid plan. Prefer yearly pricing, because at $3 to $4 a month the per-sale fee is about 20%. |

Also decide the license now (GUIDE.md, section 2.3). Recommended if unsure: **free at launch, decide later**, with the license left as "all rights reserved".

---

## Phase 5: Public launch and watch (May 3 to Jun 6, 2027)

| When | What |
|---|---|
| May 3 to May 9 | Launch week: post where your people are, share the demo, answer replies within 48 hours. |
| Daily, first week | 5 minutes: error reports, screenshot server costs, feedback. |
| Weekly, May 10 to Jun 6 | 20 minutes: the same checks, then fix the top issue of the week. |

Rollback plan. Every release is a merge on GitHub, so going back starts with one revert. Because of Phase 2 and 3, a revert also needs: the PWA update (or its off switch) so phones stop showing the broken version, and the pre-migration backup copy if the release changed storage. If costs spike, budget alerts tell you and the hard limits (where offered) stop the bill; the app falls back to placeholder tiles.

#### Tests

a rollback drill in launch week: revert one small release, confirm the site and an installed copy both come back.

#### Checkpoint 5 (Sunday, Jun 6, 2027)

- [ ] No data-loss incidents.
- [ ] Monthly running cost known and within your budget.
- [ ] Question: keep going, change direction, or keep it as a personal tool? Any answer is fine.

After launch, if it's working: app stores (Apple $99 a year, Google $25 once, as of the research; the app needs real offline or native value first), team sharing, and the "Later" ideas in the README.

---

## Risks and what the plan does about them

| Risk | Likelihood | Plan |
|---|---|---|
| You stop using it during Phase 1 | Medium | The Dec 13 check catches it early, and the stop rule makes pausing a planned outcome. |
| Screenshot service limits or prices change | High today | Phase 1 puts screenshots behind your own server, so the provider can be swapped. |
| Data loss in someone's browser | Medium | Phase 0 safety fixes, weekly backup reminders, IndexedDB with backups in Phase 2, sync if chosen. |
| A site owner objects to a screenshot | Low | Screenshots are shown only to the person who saved the link (the server's cache is shared but never published), and the terms give a takedown contact. |
| Someone abuses the screenshot server | Medium once public | Per-user limits, only this app may call it, budget alerts and hard limits where offered. |
| Costs grow faster than expected | Low to medium | Each link is captured once, the load test in Phase 4, and a cost check at every checkpoint after launch. |
| Scope creep | High | Ideas go into a "later" group on the board; each phase has a fixed list. |

## Research behind this plan

A code audit, market and cost research, and an independent review of these documents were done on October 30, 2026. Findings and sources are in GUIDE.md, Part 2. Prices and limits change, so re-check them at Gate A and Gate B.
