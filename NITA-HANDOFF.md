# Statewide Synergy app: handoff to Nita

This folder is the complete, current conference app. It contains everything Mike and Claude added on top of Nita's last build (`wvarf-synergy-site-ready_4.zip`):

- a live Challenge leaderboard
- a projector page with a gift-basket drawing
- a staff photo gallery
- reliable Turn-in, with a timeout and an offline queue
- update and offline fixes
- home-page layout and speaker-order fixes

It is ready to put on **Nita's own GitHub and Netlify**. Follow Parts 1–6 in order. Part 7 is the event-day runbook. Part 9 is written for Nita's Claude.

> **Nothing carries over from Mike's test site** (`synergywvtest.netlify.app`). That includes test cards, photos, leaderboard data and environment settings. Nita's site starts clean.

---

## What's in this folder

| Path | What it is |
|---|---|
| `site/` | The finished app that Netlify publishes. No build step. |
| `site/index.html` | App entry point. Loads the built app plus the `live/` add-ons. |
| `site/assets/index-*.js` / `.css` | The built app. Built from `app-source/`; don't edit these by hand. |
| `site/live/leaderboard.js` / `.css` | In-app leaderboard: a summary near the top of the Challenge screen and the full board at the bottom. |
| `site/live/overrides.css` | Home-page grid fixes. |
| `site/live/jszip.min.js` | Zip download on the photos page. |
| `site/leaderboard.html` | Projector page at `/leaderboard`. Staff drawing controls appear at `/leaderboard?staff`. |
| `site/photos.html` | Staff photo gallery at `/photos`: view, download or delete photos. |
| `site/players.html` | Staff player list at `/players`: fix names, take duplicates off the board. |
| `site/sw.js` | Offline and update service worker (fixed version). |
| `site/__forms.html` | Hidden form definitions Netlify needs for its forms. **Do not delete.** |
| `netlify/functions/` | Seven server functions: `submission-created`, `card`, `leaderboard`, `draw`, `players`, `photos`, `photo`. |
| `netlify/lib/` | Code shared by those functions. |
| `netlify.toml` | Netlify settings: publish folder, functions, redirects, cache headers. |
| `package.json` | Tells Netlify to install `@netlify/blobs` for the functions. |
| `app-source/` | The React source code for the app. Netlify doesn't use it directly; `site/` is built from it (see Part 9). |
| `update-sw.mjs` | Only for hand edits to `site/index.html` or `site/live/*`. A fresh build from `app-source/` doesn't need it. Needs Node.js. |
| `test-functions.mjs`, `dev-server.mjs` | Local tests and a local stand-in for Netlify. Optional. |
| `DEPLOY.md` | Shorter technical notes. |

---

## Part 1: Put the files on GitHub

**Before you start:** you need a GitHub account (github.com, free). Unzip this package on your computer.

1. **Create the repository.** On github.com, click **+** (top right) → **New repository**.
   - **Name:** `wvarf-synergy-app`, or any name you like.
   - **Visibility:** Private is fine.
   - Leave **README**, **.gitignore** and **license** unticked.
   - Click **Create repository**.
2. **Open the upload page.** On the next page, click the **"uploading an existing file"** link.
3. **Drag in the files.** Open the unzipped folder, select everything inside it (Ctrl+A on Windows, Cmd+A on Mac), and drag it onto the upload area. Use Chrome or Edge so the folders upload correctly.
   - Drag the **contents** of the folder, not the folder itself. `netlify.toml` must sit at the top level of the repository.
   - Don't upload a `node_modules` folder if one exists.
4. **Save.** Click **Commit changes**.
5. **Check it.** The repository's main page should show `netlify.toml`, `package.json`, `NITA-HANDOFF.md`, `site/` and `netlify/` at the top level.

*If you prefer the command line:* in the unzipped folder, run `git init`, `git add .`, `git commit -m "Statewide Synergy app"`, then `git remote add origin <repo URL>` and `git push -u origin main`.

---

## Part 2: Connect GitHub to Netlify

Log in at app.netlify.com. Then do **one** of the following.

**A. Replace an existing Netlify site** (keeps its current web address):

1. Open the site.
2. Go to **Project configuration → Build & deploy → Continuous deployment** and click **Link repository**.
3. Choose **GitHub** and approve Netlify's access when GitHub asks.
4. Pick `wvarf-synergy-app`.

   *If the repository isn't in the list:* click **Configure the Netlify app on GitHub** and give it access to that repository.

**B. Make a new Netlify site:**

1. Click **Add new project → Import an existing project → GitHub**.
2. Pick `wvarf-synergy-app`.

**Build settings (both options):** leave them as they are. `netlify.toml` fills them in:

| Setting | Value |
|---|---|
| Branch | `main` |
| Base directory | blank |
| Build command | already filled in |
| Publish directory | `site` |
| Functions directory | `netlify/functions` |

Click **Deploy**. Netlify installs one package and publishes the site. This takes about a minute.

> Drag-and-drop deploys **won't work** for this version, because the leaderboard, drawing and photo gallery run as Netlify Functions, which drag-and-drop doesn't support. Always deploy through GitHub.

---

## Part 3: Turn on Netlify Forms

1. In the site's left menu, go to **Forms** → **Enable form detection**.
2. Go to **Deploys → Trigger deploy → Deploy project**.

Netlify only finds forms on deploys made *after* detection is turned on. Without this step, cards, photos and feedback are not saved.

---

## Part 4: Environment variables

Go to **Project configuration → Environment variables → Add a variable**. You can leave scopes and deploy contexts at their defaults (all).

| Key | Required? | Value | What it does |
|---|---|---|---|
| `STAFF_KEY` | **Yes** | A password you choose, e.g. `Synergy-Staff-2026`. Share it only with staff. | Unlocks the photo gallery (`/photos`) and the drawing controls (`/leaderboard?staff`). |
| `LEADERBOARD_SINCE` | No; leave unset | A date/time such as `2026-10-22T00:00:00-04:00` | Overrides the automatic test mode (see Part 6). Normally leave it unset. |
| `LEADERBOARD_HIDE` | No | Emails or full names, separated by commas, e.g. `test@wvarf.org, Jane Doe` | Removes those players from the leaderboard and the drawing, e.g. staff test accounts or an inappropriate name. |

**After adding or changing any variable, redeploy:** Deploys → Trigger deploy → Deploy project. Functions only see new values after a deploy.

You **don't** need to set up storage. The leaderboard, drawing and photos use Netlify Blobs, which is built in and needs no configuration.

---

## Part 5: Check that it's live

Replace `YOURSITE` below with the site's address, e.g. `wvarf-synergy.netlify.app`.

| Check | Where | What you should see |
|---|---|---|
| Deploy | Deploys | The latest deploy says **Published**, and its log mentions **7 functions**. |
| Functions | Logs → Functions | `card`, `draw`, `leaderboard`, `photo`, `photos`, `players`, `submission-created` |
| Players | `https://YOURSITE/players` | A staff-key prompt |
| Forms | Forms | `challenge-entry`, `challenge-photo`, `session-feedback`, `conference-feedback` |
| Leaderboard data | `https://YOURSITE/api/leaderboard` | Text starting `{"updated":...,"testMode":true,"players":0` |
| Projector | `https://YOURSITE/leaderboard` | Navy board saying "No cards turned in yet" |
| Staff drawing | `https://YOURSITE/leaderboard?staff` | A staff panel bottom-right asking for the staff key |
| Photos | `https://YOURSITE/photos` | A staff-key prompt |
| App | `https://YOURSITE/` → Challenge | A "Live leaderboard" summary under "How to play", and the full board at the bottom |

**Also check your plan** under Team → Usage & billing:
- Credit-based plans include form submissions.
- The old free plan caps submissions and file uploads, and going over **pauses every site on the account**. Upgrade before the event if that's your plan.

---

## Part 6: Test it before the event

Until **October 22**, the leaderboard runs in **test mode**:
- It shows every card, with a "Test mode" label.
- Drawings are labelled **"Test drawing"**.

On **Oct 22 at midnight Eastern**, test cards and test drawings drop off the board and out of the drawing automatically. You don't need to change any settings. Test entries still sit in Forms, though, so delete them there (see the end of this part).

1. **Turn in a card on a phone:**
   1. Open the app and go to **Challenge**.
   2. Enter a name.
   3. Complete one square, e.g. **Visit WVABLE** with code word **ABLE**.
   4. Tap **Turn in my card**.

   Within about 15 seconds you appear on the leaderboard: the phone panel and `/leaderboard`. The button turns grey until your name is filled in **and** at least one square is complete; a hint explains this.

   *Code words:* WVABLE = **ABLE**, Down Syndrome Network = **TOGETHER**. Every other required answer needs at least 2 characters, and the session dropdowns must be picked.
2. **Update a score:** complete another square, then tap **Update my card**, or **Update my score** in the leaderboard panel. The board updates.
3. **Add a photo** to **Badge twin** or **Synergy Snapshot**. Then open `/photos`, enter the staff key, and the photo appears. Try **Download**, **Download all (.zip)** and **Delete**.
4. **Try the drawing:**
   1. Have 2–3 people turn in cards with different numbers of squares.
   2. Open `/leaderboard?staff`, enter the staff key and click **Draw winner**. Names roll, then the winner shows full screen with confetti.
   3. Try **Draw again**, which skips anyone already drawn.
   4. Click **Clear winner**.
   5. On a phone, check that the Challenge page shows the winner while one is drawn.
5. **Fix a duplicate:** turn in a second card with the same name but a different email. Open `/players` (or **Fix names or duplicates** on the `?staff` panel). Both cards are marked "Possible duplicate". Tap **Remove from board** on one, and **Edit** to correct a name or organization.
6. **Clean up:** on `/players`, **Remove from board** then **Delete for good** each test card; on `/photos`, **Delete** each test photo. Then in Netlify **Forms**, delete the test submissions under `challenge-entry` and `challenge-photo`. That keeps them out of the backup CSV drawing and the photo list.

---

## Part 7: Event day (Thursday, Oct 22)

**11:30 AM – 12:40 PM: Challenge open**
- **Projector:** open `https://YOURSITE/leaderboard` on the room screen and press **F11** for full screen. It refreshes every 10 seconds and counts down to the 12:40 close.
- **Staff computer:** to draw from the projector itself, open `https://YOURSITE/leaderboard?staff` instead. Click **Hide** to tuck the panel away until the drawing.
- **12:20 PM:** the app automatically sends phones a "Turn in your card" reminder.

**After 12:40 PM: drawing**
1. On the `?staff` screen, click **Draw winner**. It asks for confirmation if you click before 12:40.
2. Each ticket is one chance, and only each person's latest card counts. The winner appears on every leaderboard screen and in the app.
3. If the winner isn't in the room, click **Draw again**.
4. When you're done, click **Clear winner**.

**Backup drawing:** if anything fails, use the original method. In Netlify, go to **Forms → challenge-entry → Download as CSV**. Then open the app with `?challenge-staff` added to the address, load the CSV and tap **Draw**.

**After the event:**
- **Photos:** go to `/photos` → tick **Only photos marked OK to share** → **Download all (.zip)**.
- **Feedback:** download it from Forms → `session-feedback` and `conference-feedback`.

---

## Part 8: Troubleshooting

These are all problems we actually hit while testing.

| Symptom | Cause / fix |
|---|---|
| **Turn in my card** is grey | Needs a name **and** at least one completed square. A hint now says so. |
| Button stuck on "Sending…" | Fixed. The app now gives up after 15 seconds, keeps the card on the phone and resends it later. Netlify usually *did* receive it. |
| Score only updated the first time | Fixed Oct 14. Netlify only runs `submission-created` for submissions its spam filter accepts, and repeat cards from one person can be held back as spam (check Forms → challenge-entry → **Spam submissions**). The app now also sends each card straight to the board through `/api/card`. |
| Duplicate player on the board | Open `/players`, **Remove from board** on the extra card. Use **Edit** to fix a misspelled name or organization. |
| Leaderboard empty | Before Oct 22 it shows test cards. After Oct 22 only cards from that day count. If `LEADERBOARD_SINCE` is set, check its date. |
| Leaderboard missing on a phone | The summary sits under "How to play" and the full board at the bottom. Fully close and reopen the app after a deploy. A home-screen app can take two openings to update. |
| Photo links in Netlify's Forms page won't open | Seen on Mike's network in every browser. Use `/photos` instead: it serves the photos from your own site. |
| `/photos` or the drawing says "STAFF_KEY is not set" | Add `STAFF_KEY` (Part 4), then **redeploy**. |
| "Wrong staff key" | Retype it. The key is stored only in that browser tab. |
| Changes not showing on phones | Rebuild from `app-source/` (Part 9), or after a hand edit to `site/index.html` or `site/live/*` run `node update-sw.mjs` before committing. Close and reopen the app. |
| Forms not saving at all | Form detection is off. Redo Part 3, including the redeploy. |
| Leaderboard, photos or drawing missing after a deploy | The site was drag-and-dropped. Deploy through GitHub (Part 2). |

---

## Part 9: Notes for Nita's Claude

### Where things stand

- **One source of truth (Oct 14):** Nita's Claude merged this package with Nita's React source. `app-source/` now holds the full source, and `site/` is a fresh build of it. Everything below is already in the source; nothing needs porting.
- **To change the app:** edit `app-source/`, then build and copy the output into `site/`:

  ```
  cd app-source
  npm install
  npm run build
  rm -rf ../site && cp -r dist ../site
  ```

  Commit `site/` and `app-source/` together. `public/live/`, `public/leaderboard.html` and `public/photos.html` in the source are copied into `site/` by the build, and `index.html` already links the `live/` add-ons.

### Mike's fixes, now in the source

1. **Form submit timeout:** `post()` in `src/data/surveyStore.js` aborts after **15 s** (`AbortController`); on failure the existing queue stores the card and resends it later. The photo upload in `src/screens/ChallengeScreen.jsx` aborts after **45 s**.
2. **Turn-in hint:** when the name is filled and no square is done, the card says "Complete at least one square to turn in your card…" (`ChallengeScreen.jsx`).
3. **Home speakers order:** after the keynote and honored guests, speakers sort by **first name** (`src/components/SpeakerStrip.jsx`).
4. **Collapsed speaker count:** `INITIAL = 8` in `SpeakerStrip.jsx`, so with `overrides.css` collapsed rows are full: 3+3 on phones, 4+4 on wider screens.

### Service worker fix (in `app-source/vite.config.js`)

- **The bug:** logos, fonts and app icons were precached twice with different revisions, so Workbox threw `add-to-cache-list-conflicting-entries` and offline mode never worked.
- **The fix:** no `includeAssets` list, `includeManifestIcons: false`, and `webmanifest` dropped from `globPatterns`. Each file is now listed once (22 entries).
- **`navigateFallbackDenylist`:** `/__forms.html`, `/leaderboard`, `/photos`, `/api/`, `/.netlify/`, `/materials/`, and document/zip extensions.
- **Not precached:** `leaderboard.html`, `photos.html` and `live/jszip.min.js` (staff-only). The three `live/` add-on files are precached.

### `overrides.css`

Home grid fixes:
- `.quick-grid`: 2 columns on phones, 3 at 600px and wider, giving 2×3 or 3×2.
- `.speaker-grid`: 3 columns on phones, 4 at 700px and wider. Collapsed speakers 7–8 are hidden on phones using `:has(.speaker-more[aria-expanded="false"])`.

### `live/leaderboard.js`

Framework-free add-on:
- **Finding the screen:** a MutationObserver finds `.ch-content`, the Challenge screen, and skips the staff view.
- **What it adds:** `#ch-live-mini` after `.ch-how`, and `#ch-live` at the end. It polls `/api/leaderboard` every 15 s while the screen is open.
- **Identifying "You":** it reads the app's `localStorage['wvarf-synergy:challenge-v1']` and computes `sha256(email || name).slice(0,16)` to highlight the player's own row. This **must match `playerId()`** in `netlify/lib/challenge.mjs`.
- **Turn-in clicks:** a capture-phase click listener catches the app's Turn in / Update button **before React relabels it "Sending…"**, then refreshes the board.
- **Timers:** it uses `setTimeout`, not `requestAnimationFrame`, because rAF stalls in hidden panes and tabs.
- **If functions are missing:** when `/api/leaderboard` isn't JSON (e.g. a drag-and-drop deploy), it removes itself.

### Server functions

All use Netlify Blobs; none need an API token.

| Function | Route | Job |
|---|---|---|
| `submission-created` | Netlify event | Fires on every **verified** (non-spam) form submission. For `challenge-entry`, it saves the player's latest card to the Blobs store `challenge-leaderboard`, keyed by player id. Older resends are ignored, and tickets are capped at what the card allows (9 squares + 8 lines × 2 + 5 = **30**). For `challenge-photo`, it downloads the file from Netlify's short-lived URL and saves the bytes plus metadata to `challenge-photos`; on failure it logs the payload's field names. |
| `leaderboard` | `GET /api/leaderboard` | Public. First name + last initial and org only, ranked, with ties sharing a rank. Includes `testMode` and the current `winner` (full name + org) if one has been drawn. CDN-cached for 5 s. |
| `draw` | `POST/DELETE /api/draw` | Needs header `x-staff-key`. Weighted random pick via `crypto.randomInt`; `{"again":true}` skips anyone already drawn. Saves to the Blobs store `challenge-draw` under key `current`. A draw made in test mode is flagged and hidden once test mode ends. |
| `card` | `POST /api/card` | Public. The app sends every turned-in card here as well as to Forms, so a score updates even when Netlify holds a repeat submission back as spam. Same `saveCard()` and ticket cap as the Forms path; a `submitted_at` in the future is replaced with now. |
| `players` | `GET /api/players`, `PATCH/DELETE /api/players/:id` | Staff only. Lists every card (full name, email, org, removed/edited). PATCH `{name, org}` saves a staff edit; `{removed: true/false}` takes a card off the board or puts it back; DELETE removes it for good. Edits and removals are kept when the player updates later (`saveCard()` carries them over); `withEdits()` applies them in `loadEntries()`, so the board, drawing and winner screen all use the corrected name. |
| `photos` | `GET /api/photos` | Staff only. Lists photos with their metadata. |
| `photo` | `GET/DELETE /api/photo/:id` | Staff only. Returns one photo's image, or deletes it. |

**Test mode:** `boardSettings()` in `netlify/lib/challenge.mjs` decides it. Before `2026-10-22T00:00:00-04:00`, every card counts. From that time on, only cards from that day count. `LEADERBOARD_SINCE` overrides both.

### Testing locally

You need Node.js 22.

```
npm install
node test-functions.mjs <empty-folder>        # function tests, against a local Blobs server
STAFF_KEY=test node dev-server.mjs <empty-folder> 4290
# open http://localhost:4290 . Use port 4290, not 4190: fetch() blocks 4190.
```

### Content rules from the start of the project

- **No invented facts:** never invent event facts such as rooms, speakers or descriptions. Leave unknowns as TBA, or ask WVARF.
- **Still unconfirmed:** a few earlier items still need WVARF to confirm them. These are the accessibility statements on the Info tab and the staff "helps" tags.

### Odd findings

- **Photo links:** Netlify's own photo links failed on Mike's network in Firefox, Chrome and Edge. The cause is unknown. That's why `/photos` exists.
- **Speaker list:** the build lists 24 speakers, including some Nita added (e.g. Adam Mouse, U.S. Department of Labor; Angie Reed, WV DRS). Confirm they're correct.
