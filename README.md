# Statewide Synergy — conference app

The attendee web app for **Statewide Synergy: The Power of People & Procurement**,
WVARF's 2nd Annual State Use Conference at Stonewall Resort, October 20–22, 2026.

It is a React + Vite single-page app that installs as a PWA, works offline, and
is built to deploy to Netlify as a static site.

---

## Deploy to Netlify

### From the Netlify UI

1. Push this folder to a Git repository (GitHub, GitLab or Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Netlify reads `netlify.toml`, so the build settings are already correct:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 22
4. Deploy. Every push to the default branch redeploys.

### From the command line

```bash
npm install
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### What `netlify.toml` sets up

- An SPA redirect, so deep links and refreshes land on the app rather than a 404.
- Immutable, year-long caching for hashed build assets and fonts.
- `must-revalidate` on `index.html` and `sw.js`, so a republished agenda reaches
  attendees on their next visit instead of being held by the service worker.
- Baseline security headers.

---

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

---

## Where the content lives

Everything an organiser needs to change is in `src/data/`. No component code
needs touching.

| File | Holds |
| --- | --- |
| `src/data/conference.js` | Days, sessions, tracks, people, sponsors, exhibitors, venue and hotel, WVARF details, resources, contacts |
| `src/data/program.js` | Session descriptions and speaker bios, keyed by id |
| `src/data/notifications.js` | Scheduled announcements and reminders |

### Editing the agenda

Each entry in `SESSIONS` carries an `id`, `day`, `time`, `dur`, `title`, and
optionally `room`, `speaker`, `panel` and `tags`. Ids are referenced by
notifications and descriptions, so **never reuse or renumber an id** once the
app is live.

Sessions are grouped on screen by day and then by start time, in the order they
appear in the array.

### Rooms and speakers that are still TBA

The published programme names a room for only three items (the reception, the
Awards Banquet and the remote janitorial training) and a presenter for only two
(the keynote, and the WVABLE/benefits-counselling breakout). Everything else is
deliberately left blank rather than guessed — a session with no `room` tells
attendees the room is confirmed on site.

Fill `room` and `speaker` in as they are confirmed and they appear on the agenda
and session pages automatically. Do the same in `ROOMS` so the Venue tab lists
them.

### Adding exhibitors

`EXHIBITORS` is an empty array; the Home screen shows a "coming soon" panel
until it has entries. Each entry takes the same shape as a sponsor, plus an
optional `materials` array for handouts — the example in the file's comment
shows the fields. Once exhibitors are added, the Exhibitors chip appears in the
People directory and the carousel replaces the placeholder.

### Handouts and presentations

Put PDFs in `public/materials/` and a JPG preview beside each one, then list
them under the sponsor's or exhibitor's `materials`. Until then every sponsor
card shows the line in `MATERIALS_PENDING`.

### Notifications

Notifications stay hidden until their `sentAt` time, then appear on their own —
badge, banner and all. Write the whole conference's announcements ahead of time
and publish once. Times are Eastern daylight (`-04:00`) for the conference week.

To preview scheduled notifications before they release, open the app with
`?preview-notifications` on the end of the address. Attendees never see this.

---

## Branding

The palette comes from the WVARF primary logo: navy `#11308A` and gold
`#FBDB73`. Everything else in `src/styles/tokens.css` is a tint or shade of
those two, plus a warm ember accent for live/alert states.

Type is **Archivo** (display and headings, echoing the WVARF wordmark) and
**Source Sans 3** (body). Both are open-licensed and self-hosted from
`public/fonts/`, so the app renders correctly offline and sends nothing to a
third-party font host.

Logo assets in `public/assets/` are generated from the WVARF primary logo:

| File | Use |
| --- | --- |
| `wvarf-logo.png` | Full lockup on light backgrounds |
| `wvarf-logo-reverse.png` | Full lockup on navy |
| `wvarf-mark.png` | Figure mark alone |
| `wvarf-mark-reverse.png` | Figure mark on navy — used in the app header |
| `wvarf-logo-white-bg.png` | Square app icon |
| `wvarf-logo-dark-bg.png` | Maskable PWA icon |
| `favicon.png` | Browser tab icon |

---

## Floor plan

The Venue tab has an interactive map of the Stonewall Resort meeting space,
one level at a time:

- **Lobby Level** (entry level, 2nd floor): Oak Boardroom, Birch Room,
  Stonewall Ballroom, Bluestone, Sutton, Tygart and Summersville rooms.
- **Terrace Level** (one floor down, 1st floor): Maple, Pecan, Kanawha,
  Greenbrier and Potomac rooms.

The geometry is the resort's own published floor plan (Social Tables, linked
as "Floor plans" from the resort's meetings page), simplified and redrawn as a
clean, numbered wayfinding map in `src/data/floorplan.js`. A legend under the
map names every room; tapping the map opens the whole floor to pan around.

**Rooms light up automatically.** Any session whose `room` matches a room on
the plan is highlighted in gold, listed as "This conference" in the legend,
and gets a **Show on map** button on its session page. So when WVARF confirms
that, say, Breakout 2 Track A is in the Birch Room, set `room: 'Birch Room'`
and the map updates itself.

Programme names that differ from the plan's are mapped in
`src/data/rooms.js` — "Ballroom II" points at the Stonewall Ballroom (the
plan shows its movable divider but doesn't say which half is I or II).

Two programme locations are **not** on the published plan and are described
in words instead: the **Gauley Room** (ask at registration) and the outdoor
**Terrace Lawn** (lakeside; the Lobby Level's Bluestone, Sutton, Tygart and
Summersville rooms look out over it).

## Speakers

Speakers are deliberately prominent: a headshot strip on Home (keynote and
honored guests first), 60px gold-ringed avatars in the People directory, a
large headshot when a speaker's card is opened, and photos beside each bio on
session pages. Avatars are shared through `src/components/Avatar.jsx`.

## Logos

Sponsor logos live in `public/logos/` and are **pre-trimmed**. This matters:
the source files came with wildly different amounts of blank canvas baked in —
two of them were a small wordmark floating in a 1024- or 4500-pixel square —
so any single CSS rule rendered some logos large and others tiny. Each file is
cropped to its artwork and normalised to **120px tall**.

Keep that convention when you add or replace one: crop to the mark, export at
120px tall, and the existing CSS sizes it correctly everywhere — the Home
tile, the directory card header, and the expanded card.

One rule governs every logo box, so they all read at the same optical weight:

| Where | Height |
| --- | --- |
| App header (WVARF mark, reverse) | 38px |
| Sponsor tile on Home | 48px |
| Directory card header | 44px box |
| Expanded card | 52px |
| About WVARF | 76px |

WVARF's own lockups are in `public/assets/` — see the Branding table above.

## Images served from elsewhere

Speaker headshots are loaded from the event page's CDN (`cdn.rsvpify.com`)
rather than bundled. They are cached by the service worker after first view,
and the person's initials sit underneath every photo, so a slow, lazy or
failed image never leaves an empty circle and the directory still works
offline.

To self-host them, drop the files into `public/assets/` and change the `photo`
values in `src/data/conference.js` to those local paths.

## Sponsors without a named representative

Four sponsors support the conference as organizations with no individual rep
in the directory. `PeopleScreen` gives those an `OrgCard` of their own — same
card shell, tier colour and logo box as a person's card — so every sponsor
tile on Home leads somewhere and every logo is reachable. The card appears
automatically: add a sponsor with no matching rep in `PEOPLE` and it shows up.

---

## Accessibility

The app is built to WCAG 2.2 AA and audits clean with axe on every screen:

- All colour pairs meet AA; the lowest is 4.8:1.
- 44px minimum touch targets throughout.
- The menu and notification drawers are proper modal dialogs with focus traps.
- The Info accordions and speaker bios use native disclosure semantics.
- `prefers-reduced-motion` is respected.
- Every icon is either labelled or marked decorative.

Re-run the audit after content changes:

```bash
npm run build && npm run preview
# then point an axe-core run at http://localhost:4173
```

---

## Data provenance

Agenda, speakers, sponsors, hotel and venue details are transcribed from the
official event page at <https://synergywv.rsvpify.com/>. WVARF organisational
details, the State Use Program description, staff contacts and the resource PDFs
come from <https://wvarf.org/>.

Where the published programme does not state something — a room, a presenter, a
session abstract, the exhibitor roster — the app says so rather than filling the
gap. Please keep that rule when editing: attendees act on what this app tells
them.
