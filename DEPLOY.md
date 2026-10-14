# Statewide Synergy app: deploy with the live leaderboard

> **Start with `NITA-HANDOFF.md`.** It has the full step-by-step setup for GitHub and Netlify. This file is the shorter technical reference.

This folder is Nita's finished app (`site/`) plus three additions:

1. **Update settings** (`netlify.toml`, `site/sw.js`): phones pick up new versions quickly, and offline mode now works.
2. **Live leaderboard functions** (`netlify/`): these save each turned-in Challenge card and serve the standings.
3. **Leaderboard screens** (`site/live/`, `site/leaderboard.html`): a live panel at the bottom of the in-app Challenge screen, and a full-screen board for a projector at `/leaderboard`.
4. **Staff photo gallery** (`site/photos.html`): view and download Challenge photos at `/photos`, protected by a staff password.

## Deploying

The leaderboard uses Netlify Functions, which **can't be deployed by drag-and-drop**. Use one of these two methods.

**A. GitHub (no software needed on your PC)**

1. Create a GitHub repository and upload everything in this folder **except** `node_modules`. The GitHub website's "Add file → Upload files" works for this.
2. Link the repository in Netlify.
   - For an existing site: Site configuration → Build & deploy → **Link repository**.
   - For a new site: Add new site → **Import an existing project**.
3. Leave the build settings blank. `netlify.toml` already sets them.
4. Deploy. From then on, every change uploaded to GitHub deploys automatically.

**B. Netlify CLI (needs Node.js installed)**

```
npm install
npx netlify-cli login
npx netlify-cli link        # pick the existing site
npx netlify-cli deploy --prod
```

If you drag-and-drop `site/` instead, the app still works as before. The leaderboard panel simply won't appear.

## One-time Netlify settings

- **Turn on form detection:** Forms → **Enable form detection**, then deploy again. Without this, nothing is saved: no cards, no photos and no leaderboard.
- **Blobs (leaderboard storage):** nothing to set up. It's built in.
- **Check your plan** under Team → Usage & billing.
  - Credit-based plans include form submissions.
  - The legacy free plan caps submissions and uploads, and going over pauses every site on the account.

## Photos

Netlify Forms keeps each uploaded photo, but its file links can be blocked on some networks. So the app also copies every new photo into the site's own storage (Netlify Blobs) the moment it arrives. Staff view and download them at **`https://<your-site>/photos`**.

- **One-time setup:** in Netlify, go to Project configuration → Environment variables. Add **`STAFF_KEY`** with a password of your choosing, then redeploy. The photos page asks for this password.
- On the photos page:
  - Filter to **Only photos marked OK to share**.
  - Download one photo, or **Download all (.zip)**.
- Only photos sent after this update are copied. Earlier ones stay in Netlify Forms only.

## How the leaderboard works

1. A phone taps **Turn in my card** or **Update my card**.
2. Netlify Forms saves the card.
3. Netlify runs `submission-created` for every verified (non-spam) submission. That function saves the player's latest card to Netlify Blobs.
4. `/api/leaderboard` reads Blobs and ranks players by tickets. It shows first name, last initial and organization only, with no emails.
   - Tied players share a rank.
   - Tickets are capped at what the card allows (30), so a faked submission can't top the board.
5. The in-app panel refreshes every 15 seconds while the Challenge screen is open. The projector page refreshes every 10 seconds.
6. If a player's card has more tickets than the board shows, the panel offers **Update my score**, which resends the card.

The gift-basket drawing does **not** change. Staff still use the existing staff screen (`?challenge-staff`) with the challenge-entry CSV.

### Optional settings

Set these under Site configuration → Environment variables, then **redeploy**.

| Variable | Default | Use |
|---|---|---|
| `LEADERBOARD_SINCE` | (not set) | Not needed normally. Before Oct 22 the board runs in **test mode** and shows every card; on Oct 22 test cards drop off automatically. Set a date here only to override that. |
| `LEADERBOARD_HIDE` | (empty) | Comma-separated emails or full names to remove from the board, e.g. a staff test account or an inappropriate name. |

Test entries still sit in Forms → challenge-entry. **Delete them before the drawing.**


## Gift basket drawing (on the projector)

1. Open **`https://<your-site>/leaderboard?staff`** on the projector computer.
2. Enter the **STAFF_KEY** password in the panel at the bottom right.
3. When cards close, click **Draw winner**.
   - Names roll for a few seconds, then the winner appears full screen with confetti: full name, organization and ticket count.
   - Each ticket is one chance.
   - The draw happens on the server and is saved, so every leaderboard screen and the app's Challenge page show the same winner.
4. **Draw again** picks someone new (it skips anyone already drawn), for when the winner isn't in the room.
5. **Clear winner** takes the announcement off every screen. **Hide** tucks the staff panel away.

Test drawings made before Oct 22 are labelled "Test drawing" and disappear on their own on Oct 22. The old CSV method (`?challenge-staff` in the app) still works as a backup.

## On the day

- **Projector:** open `https://<your-site>/leaderboard` on the room screen and press F11. It shows the countdown to the 12:40 PM close.
- **Phones:** the leaderboard appears at the bottom of the Challenge screen.

## For Nita (changes to bring into the app's source)

- **`sw.js`:** the build listed six images twice with different revisions. That made the service worker crash on start: nothing was cached, and the app didn't work offline. This version removes the duplicates and keeps PDFs, `/leaderboard`, `/api/` and `/.netlify/` away from the app shell. In `vite.config.js`, stop listing `public/assets/*` in both `includeAssets` and the `globPatterns`, and add those paths to `navigateFallbackDenylist`.
- **`index.html`:** loads `/live/leaderboard.css` and `/live/leaderboard.js`. These can stay as-is, or become a React component on the Challenge screen.
- **Better live scores:** for the board to update without a tap, call the turn-in submit automatically, debounced, whenever the ticket count changes after the first turn-in.
- **To change the app,** edit `app-source/`, run `npm run build` there, and copy `dist/` over `site/` (see Part 9 of NITA-HANDOFF.md). After a hand edit to `site/index.html` or `site/live/*` only, run `node update-sw.mjs` so phones pick up the change.

## Local testing

- `node test-functions.mjs <empty-folder>` runs the function tests against a local Blobs server.
- `node dev-server.mjs <empty-folder> 4190` runs a local copy of the site at http://localhost:4190, with working form posts and leaderboard.
