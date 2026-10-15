# Project handoff: WVARF "Statewide Synergy" conference app

> **For the next Claude:** This file records everything done so far on this project across one working session: what was asked, what was decided, what was built, where every fact came from, and what's still open. The code itself is in `wvarf-statewide-synergy.zip`, which the user has. A copy of this file is in that zip as `HANDOFF.md`. Read this file first, then unzip the project and work from `src/data/`.

---

## 1. Who and what

- **Requester:** Mike, Florida ARF (myon@floridaarf.org). Mike likes terse, direct requests and refines visuals one targeted change at a time. Infer broadly from short instructions.
- **Goal:** take an existing conference web app built for **ORA** (Oregon Resource Association, "NW Conference on Disability Services") and rebrand and repopulate it for **WVARF's 2026 State Use Conference**, ready to deploy on **Netlify**.
- **The event:** *Statewide Synergy: The Power of People & Procurement*, WVARF's 2nd Annual State Use Conference.
  - **Where:** Stonewall Resort, 940 Resort Drive, Roanoke, WV 26447.
  - **When:** Tuesday Oct 20, 2026 (evening reception), then sessions Wed Oct 21 and Thu Oct 22.
- **Sources Mike pointed to:**
  - Event page (main source): https://synergywv.rsvpify.com/
  - https://wvarf.org/
  - https://wvarf.org/resources/
- Michael Yon (Florida ARF) is on the speaker list.

---

## 2. Conversation history (four requests)

### Request 1: rebrand the ORA app for WVARF and make it Netlify-ready

Mike uploaded `NW-Conference-claude-implement-design-system-yv7Sw.zip` (the ORA app). He asked for WVARF branding and for the app to include all the speakers, hotel information, sessions, agenda, exhibitors, sponsors, handouts and presentations, plus anything else useful. He said wvarf.org and wvarf.org/resources could be scraped.

Mike's answers to the clarifying questions:

1. **Exhibitors and handouts** (neither is published): keep both sections and show "coming soon" placeholders. Fill in the known sponsors.
2. **Map and game:** turn ORA's scavenger hunt into the **Synergy Connections Challenge** (a session on the published agenda). Drop the Oregon floor-plan image. *Later reversed in Request 3, where Mike asked for a map.*
3. **Headshots:** load them directly from the event page's image server (`cdn.rsvpify.com`) instead of using initials only.

**Delivered:** the full rebrand (see sections 4 to 6).

A verification subagent then compared the data with the sources and found real problems, all fixed (see section 7). Earlier drafts had also invented session descriptions, room assignments and speaker-to-session links. All of those were removed.

### Request 2: "Logos are too small and not consistent. fix it"

- **Cause:** two of the four sponsor logo files were a small wordmark inside a huge blank square. Integrated Resources was 1024×1024 with 754×325 of actual artwork; WVABLE was 4500×4501. No single CSS rule could size all four alike.
- **Fix:** cropped each logo to its artwork, scaled all four to 120px tall, and saved them as WebP in `public/logos/` (served from the app instead of the external server). One CSS rule now sizes every logo.
- **Sizes now:**
  - header mark: 38px
  - Home sponsor tile: 48px
  - People directory row: 44px box
  - expanded card: 52px
  - About WVARF: 76px
- **Also fixed:**
  - Four sponsors take part as organizations with no named person in the directory. Tapping their Home tile used to land nowhere. They now get **org cards** in People (`OrgCard.jsx`).
  - WVABLE was hidden because a speaker is from WVABLE. The match now looks for a sponsor representative, not just anyone from the organization. All 7 sponsors are reachable.

### Request 3: "Where is the map of the property… need that integrated. Also make the speakers icons a little larger or more prominent"

- **Map:**
  - Found the resort's official floor plans: Social Tables, linked as "Floor plans" from stonewallresort.com's meetings page.
  - Pulled the vector data (walls, room outlines, names) and redrew it as a clean, numbered map in the **Venue** tab.
  - Has a Lobby Level / Terrace Level switch, a legend that names every room, and a tap-to-enlarge view of the whole floor.
  - Rooms the conference uses are highlighted in gold.
  - Sessions in a room on the plan get a **Show on map** button.
- **Speakers:**
  - **Home:** new strip of speaker photo cards. The keynote and honored guests come first and are tagged.
  - **People directory:** speaker photos are 60px (up from 44) with a gold ring. Opening a speaker's card shows a 112px headshot.
  - **Session pages:** each speaker's photo sits beside their bio.

### Request 4: this export

---

## 3. Where every fact comes from (rule: nothing invented)

The standing rule for this project: **if the published programme doesn't state it, the app says "TBA" or "confirmed on site". It never guesses.** Attendees act on what this app tells them.

### Published facts used (from synergywv.rsvpify.com)

- Theme text, the three "About" paragraphs, schedule at a glance, and all session titles and times.
- The three tracks:
  - A: Capacity Building & Organization Longevity
  - B: Sales & Marketing
  - C: Client Support & Vocational Rehabilitation
- **Rooms the programme names (only three):**
  - Reception: Terrace Lawn ("beside the firepit")
  - Awards Banquet: Ballroom II
  - Remote janitorial training: Gauley Room
- **Speakers the programme assigns to sessions (only two):**
  - Keynote: Aaron Golub, "Leaning Into Leadership"
  - Breakout 3 Track C: Audra Spenia (Job Squad) and Roxanne Clay (WVABLE)
- All 20 speaker bios, copied word for word from the live page.
- Hotel:
  - $189/night; room block deadline Sept 20, 2026 or until the block fills
  - the $209 resort-fee note
  - booking link: `https://be.synxis.com/?Hotel=35494&Chain=21123&arrive=2026-10-20&depart=2026-10-22&adult=1&child=0&group=895123`
- Sponsors and tiers (see section 9).
- Sponsorship proposal: https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:06743401-3b31-49ec-96d4-c7162714e79f

### From wvarf.org

- Full name, tagline, mission and vision.
- Phone (304) 205-7970.
- Addresses: 400 Patterson Lane, Charleston WV 25311 (mailing: PO Box 6764, Charleston WV 25362).
- Hours: Mon–Fri 8:00–4:30.
- Facebook link.
- Staff names and titles (from /about).
- State Use Program history (created 1984, strengthened 1989), services list and commodities list.
- 10 resource PDFs (2 annual reports, 8 newsletters) from /resources.
- Other event: "WV Regional Disability Resource Fair" (https://wvdisabilityresourcefair.rsvpify.com/).

### From the resort (stonewallresort.com and its Social Tables floor plan, site 1944)

- **Lobby Level** ("Second Floor, Entry Level"): Oak Boardroom, Birch Room, Stonewall Ballroom, Bluestone, Sutton, Tygart, Summersville.
- **Terrace Level** ("First Floor"): Maple, Pecan, Kanawha, Greenbrier, Potomac.
- **Roanoke Event Center:** a separate building, not mapped.
- **Stonewall Ballroom:** "can be customized … into 2 parts: Stonewall Ballroom 1 – Stonewall Ballroom 2." So "Ballroom II" is half of it. The plan does **not** say which half; the app highlights the whole ballroom and draws the divider.
- **Rooms with lake and Terrace Lawn views:** Bluestone, Sutton, Tygart and Summersville (Lobby Level); Kanawha, Greenbrier and Potomac (Terrace Level). Oak Boardroom has lake views and a fireplace.
- **Gauley Room:** listed on the resort's venue page but **missing from the floor plan**. Its location is unknown.

### ⚠️ App content that is NOT sourced and must be confirmed with WVARF before launch

1. **Accessibility list** (Info tab, `ACCESS_ROWS` in `src/screens/InfoScreen.jsx`). These statements were written as reasonable defaults, not taken from any source:
   - "conference centre is wheelchair accessible throughout"
   - service animals welcome
   - reserved front-row seating on request
   - scent-free request

   The reserved-seating line commits WVARF to a service. Confirm or remove.
2. **Staff "helps" tags** (`CONTACTS` in `src/data/conference.js`), e.g. "Conference questions", "Sponsorship", "Registration desk". These are guessed roles. Every staff member also shows the WVARF main line, (304) 205-7970, because no direct lines are published.
3. **Synergy Connections Challenge card:** "Open to every attendee" and "Details are announced on site" are reasonable but not published.
4. **Notification copy** in `src/data/notifications.js` (welcome message, reminders) was written for the app, using published times.

---

## 4. Tech stack and deployment

- **Stack:** React 18, Vite 5, `vite-plugin-pwa` (installable and works offline), `lucide-react` icons. No backend.
- **Netlify:**
  - `netlify.toml` sets: build command `npm run build`, publish folder `dist`, Node 22.
  - Every route serves `index.html` (single-page app).
  - Asset caching: built assets and fonts are cached for a year (immutable); `index.html` and `sw.js` are always re-checked (`must-revalidate`).
  - Security headers are set.
  - **Not deployed yet.** A Netlify connector is available in the session if Mike wants it deployed.
- **Local:** `npm install && npm run dev`, `npm run build`, `npm run preview`.
- **Saved data in the browser:** `wvarf-synergy:saved-v1` (starred sessions) and `wvarf-synergy:read-notifications-v1`.
- **Notifications:** each one appears automatically at its `sentAt` time. Use Eastern time with the `-04:00` offset (daylight time is in effect through Oct 22, 2026). Staff can preview scheduled ones by adding `?preview-notifications` to the URL.
- **Accessibility:** axe-core audit reports **0 violations** on all five screens (Home, Agenda, Venue, People, Info), meeting WCAG 2.2 AA. The lowest text contrast is 4.8:1, and touch targets are at least 44px.

---

## 5. File map (what to edit for what)

```
src/data/
  conference.js    agenda (SESSIONS), DAYS, TRACKS, PEOPLE (speakers + sponsor reps + photo URLs),
                   SPONSORS, EXHIBITORS (empty + instructions), VENUE/hotel, ROOMS (with `where`),
                   WVARF org info, STATE_USE_SERVICES/COMMODITIES, WVARF_RESOURCES, OTHER_EVENTS, CONTACTS
  program.js       SESSION_DESCRIPTIONS (only 4 published: d0, w2, w9, rj1) and SPEAKER_BIOS (p1–p20)
  notifications.js scheduled announcements + auto "Up next" reminders built from SESSIONS
  floorplan.js     generated vector floor-plan data (LEVELS: lobby, terrace) + FLOOR_PLAN_SOURCE
  rooms.js         planRoomFor(name): maps programme room names to plan rooms ("Ballroom II" → Stonewall Ballroom)
src/components/
  Avatar.jsx       shared headshot/initials avatar; sizes sm 44 / md 60 / xl 88 / lg 112; gold `ring`
  FloorPlan.jsx    level switch, numbered map, legend, "This conference" highlight, whole-floor view
  SpeakerStrip.jsx Home speaker photo strip (keynote + honored guests first)
  OrgCard.jsx      directory card for a sponsor with no named representative
  PersonRow.jsx    directory card for a person (speakers get the big avatar and an open-card headshot)
  WvarfLogo.jsx    WVARF lockup / mark (normal and reverse versions)
  TierMark.jsx     sponsor tiers → colour key + icon
  ChallengeCard.jsx, Header.jsx, TabBar.jsx (tabs: home, agenda, venue, people, info), Sheet.jsx, …
src/screens/       Home, Agenda, Venue (map + rooms + hotel), People, Info, SessionDetail
src/styles/        tokens.css (brand palette + type), app.css
public/assets/     wvarf-logo.png, wvarf-logo-reverse.png, wvarf-mark.png, wvarf-mark-reverse.png,
                   wvarf-logo-white-bg.png (app icon), wvarf-logo-dark-bg.png (maskable), favicon.png
public/logos/      integrated-resources.webp, wvable.webp, homestead-communications.webp, buwac.webp
public/fonts/      Archivo 600/700, Source Sans 3 400/400i/600/700 (woff2)
netlify.toml, vite.config.js (PWA manifest + runtime cache for CDN headshots), README.md
```

**Behaviors built in:**
- Setting a session's `room` to a room name on the floor plan (e.g. `'Birch Room'`) automatically highlights that room on the map, labels it "This conference" in the legend, and adds **Show on map** to the session page.
- Adding entries to `EXHIBITORS` automatically shows the exhibitor carousel and the People "Exhibitors" filter.
- A sponsor with no matching representative in `PEOPLE` automatically gets an org card.

---

## 6. Brand system

- **Colors** (sampled from the WVARF logo):
  - navy `#11308A`, deep navy `#0A1E57`, mid navy `#2A4CA8`, pale navy `#DEE5F5`
  - gold `#FBDB73`, mid gold `#E3B534`, gold for text `#8A6508`, pale gold `#FEF6DF`
  - accent (used for live and alert states): ember `#C0481C`
- **Type:** Archivo for headings (echoes the wordmark); Source Sans 3 for body text. Both are open-licensed and served from the app itself.
- **Header:** full navy with the white WVARF mark and a gold underline.
- **Sponsor tier colors:** gold, silver, bronze, gemstone (blue), Awards Night reception (rose).
- **Breakout track pills:** A navy, B green, C gold.

---

## 7. Accuracy fixes already applied (do not reintroduce)

- **Removed invented content:**
  - session descriptions for unpublished sessions
  - room assignments other than the three published ones
  - speaker-to-session links other than the two published ones
- **Delegate Burkhammer:** removed his legislature link. It had no member parameter and opened a different delegate's page.
- **WVABLE sponsor card:** removed a second paragraph that had been copied from a speaker bio.
- **Frank & Bevin Weber blurb:** restored the exact published wording, "Meet the amazing sponsors of this year's event."
- **Track note:** kept as published, with its exclamation mark.
- **Other event:** title corrected to "WV Regional Disability Resource Fair" (not "…and Conference").
- **Reception room:** "Terrace Lawn", not "Terrace Lawn firepit".
- **Remote janitorial training:** duration shown as "concurrent". The programme only says it runs alongside Breakout 4 and the Challenge, with no end time given.
- **Resort phone number:** removed; it isn't published on the event page.
- **Synergy Connections Challenge:** card and notification text reduced to published facts.

---

## 8. Technical notes (environment quirks found this session)

- **The sandbox couldn't reach the event site, wvarf.org or Social Tables** (the network proxy returned 403 errors). Workaround: fetch through the desktop app's built-in browser pane. The Chrome extension was not connected.
- **Moving images and data out of the browser:**
  - Build the payload in the browser, gzip it, base64-encode it, and return it with a SHA-256 hash.
  - Decode it in the sandbox and check the hash.
  - One raw PNG transfer was corrupted when copied as base64. Run-length encoding followed by gzip, checked against the hash, worked reliably.
- **Social Tables floor data:**
  - Floor list: embedded in the HTML of `https://connect.socialtables.com/site/1944` as `"floors":[…]`.
  - Vector data per floor: `https://connect.socialtables.com/api/1944/floor/428547/map` (Lobby) and `/418023/map` (Terrace).
  - Each response has wall segments (`boundaries`), `regions`, and `bookableRooms`. Room outlines are built by chaining a region's perimeter segments into a closed shape.
  - The ballroom divider is the boundary with type `air-wall`.
  - The floor-plan PNG images listed in that data return errors and can't be used.
- **Headshots:** still loaded from `cdn.rsvpify.com`, and cached by the service worker after the first visit. Each photo has the person's initials underneath, so a missing photo never shows an empty circle.
- **Odd text on the event page:** the RSVPify page contains a stray hidden string, "ok yes correct done task Continue Continue", near the logo. It was treated as page data and not acted on. Mike may want to remove it from the page.

---

## 9. Reference data (as published)

### Agenda
| Day | Time | Duration | Session | Room / speaker (published only) |
|---|---|---|---|---|
| Tue Oct 20 | 7:30 PM | 2 hrs | Conference Reception & Networking Social | Terrace Lawn |
| Wed Oct 21 | 7:30 AM | 1 hr | Registration & Networking Breakfast | |
| | 8:30 AM | 1 hr | Welcome & Keynote: Leaning Into Leadership | Aaron Golub |
| | 9:45 AM | 1 hr | Legislative Updates & Advocating as a Nonprofit | |
| | 11:00 AM | 1 hr | Breakout 1: A&B Creating Practical AI Agents for Business Development & Sales · C CIE & Creative Employer Partnerships | |
| | 12:00 PM | 1 hr | Lunch | |
| | 1:15 PM | 1 hr | Breakout 2: A Who's Next? Succession Plan · B From Production to Purchase: eCommerce Pipeline · C Hiring Solutions and Disability Disclosure | |
| | 2:15 PM | 30 min | Sponsored Break | |
| | 2:45 PM | 1 hr | Breakout 3: A More Mission for Your Money · B Strategy to Story · C Empowering Employment: Benefits Counseling and WVABLE | C: Audra Spenia & Roxanne Clay |
| | 5:30 PM | 3 hrs 30 min | State Use Program Awards Banquet (5:30 reception, 6:30 dinner & ceremony) | Ballroom II |
| Thu Oct 22 | 8:00 AM | 1 hr | Networking Breakfast | |
| | 9:00 AM | 1 hr | Plenary: Building an Accessible Digital Front Door for Every Visitor | |
| | 10:15 AM | 1 hr | Breakout 4: A&B Cash Is King · C Leveraging Job Negotiation for CIE Placement | |
| | 10:15 AM | concurrent | Remote Janitorial Contract Management Training (virtual) | Gauley Room |
| | 11:30 AM | 1 hr | Synergy Connections Challenge | |
| | 12:30 PM | 1 hr | Lunch | |
| | 1:30 PM | 1 hr | Breakout 5: A&B Beyond Cleaning: Total Facilities Management · C Expanding the Apprenticeship Toolbox | |
| | 2:30 PM | 20 min | Sponsored Break | |
| | 4:00 PM | 1 hr | Closing Plenary: The State of Disability Employment in WV | |

### Speakers (bios in program.js)
| Name | Role / organization |
|---|---|
| Aaron Golub | Keynote speaker |
| Delegate Anitra Hamilton | WV House of Delegates, District 81 (honored guest) |
| Delegate Adam Burkhammer | WV House of Delegates, Lewis & Upshur (honored guest) |
| Alyce Almond | WV DRS, Employment Service Manager |
| Aaron Topping | WV DRS, Senior Manager, Field Specialty Programs |
| Roxanne Clay | WVABLE, Director |
| Tina Cobb | Technology professional, WVARF board member |
| Dathum Cummings | WVARF, Commodities Contract Manager |
| Daniel Hall | Access Strategies, President |
| Morgan Hassig | WVARF, CFO / Associate Director |
| Andrea Higginbotham | WVARF, Contract Administrator |
| Travis Kline | Job Squad, CEO |
| Misty Mayville | WVARF, Contract Manager (Southern WV) |
| David Mitchell | SW Resources, Director of Business Services |
| Morgan Robinson | Focus Marketing Company, owner & CMO |
| Zach Sandy | Job Squad, Director of Operations & Business Development |
| Audra Spenia | Job Squad, Community Partner Work Incentive Counselor |
| Aimee White | AlignHR, Senior HR Advisor |
| Gary Wolfe | WVARF, Contract Manager (Northern WV) |
| Michael Yon | Florida ARF, Operations Director |

### Sponsors
| Tier | Sponsor | Link |
|---|---|---|
| Gold | Integrated Resources, Inc. | https://iriwv.com/wp/ |
| Silver | Frank & Bevin Weber | |
| Bronze | WVABLE | https://wvable.com/ |
| Bronze | Morgan Hassig & Holly Smith | |
| Gemstone | Homestead Communications | Diane Slaughter's LinkedIn profile |
| Gemstone | Nita Shippy | |
| Awards Night Reception | BUWAC | https://buwac.com/ |

### WVARF staff (wvarf.org/about)
- Nita Shippy, MA, MBA: CEO / Executive Director
- Morgan Hassig: CFO / Associate Director
- Andrea Higginbotham: Contract Administrator
- Sabrina Jones, AAS: Accounting Assistant, Accounts Receivable
- Kimberly Nichols, AS: Accounting Assistant, Accounts Payable
- Dathum Cummings, ABA: Commodities Contract Manager
- Gary Wolfe: Contract Manager, Janitorial/Services (Northern)
- Misty Mayville, BS: Contract Manager, Janitorial/Service (Southern)
- Jessica Osbin: Executive Coordinator

---

## 10. Open items / next steps

1. **Get from WVARF:**
   - room assignments for every session
   - which speaker presents each breakout and plenary
   - session descriptions
   - the exhibitor roster
   - handout and slide PDFs

   All of these slot into `src/data/` with no code changes.
2. **Confirm the unsourced content** listed in section 3: accessibility statements, staff "helps" tags, and the Challenge card wording.
3. **Ask the resort:**
   - where the **Gauley Room** is
   - which half of the Stonewall Ballroom is **Ballroom II**
4. **Optional:** copy the speaker headshots into the app's own files instead of loading them from `cdn.rsvpify.com`.
5. **Deploy to Netlify** (connector available) and test on a phone. Real headshots and the PWA install flow couldn't be checked in the sandbox; layout was checked with stand-in photos.
6. **ORA leftovers** were cleaned out: Calibri font files, ORA logos, ORA venue map, ORA sponsor logos and materials, and ORA app-feedback form. If anything ORA-specific turns up, remove it.

---

## 11. Session 2 updates (Oct 8, 2026, with Nita Shippy, WVARF CEO)

- **Home speakers:** the side-scrolling strip is gone. Now: keynote card (60px photo), two honored-guest cards (48px), then a 3-column grid (4 on wide screens) showing 6 speakers with a "Show all 17 speakers" button.
- **Rooms and speakers** taken from WVARF's "Conference Session Schedule 2026.xlsx". Conference is on the **Terrace Level**: Pecan (keynote, plenaries, combined A&B breakouts), Greenbrier (Wed Track A), Potomac (Wed Track B), Kanawha (Track C), Terrace Foyer (Wed break), Lobby (registration). Ballroom II and Gauley stay as before.
- **Changes from the spreadsheet:** Breakout 1C renamed "Innovative CIE Partnerships & Placements"; closing plenary moved to 3:00 PM; remote janitorial training runs 10:15 AM–12:30 PM (2 hrs 15 min); Thu break is "Sponsored Break: Snack for the Road".
- **Nita's decisions:** the Tuesday reception stays as the website says (7:30 PM, Terrace Lawn). No answer yet on meals or the Thu 11:30 slot ("FORCED EXHIBITOR SCAVENGER HUNT?"), so both have no room for now.
- **Left out on purpose:** the Tuesday Board Retreat (internal), all email addresses, and the "DRS CIE" note in the sheet.
- **Names still to confirm:** the second Job Squad presenter for Breakout 2C (email loneal@); two WV state co-presenters for 3A (Jessica Burns-McDonnell? and Mark Fox?); closing plenary panelists from Jobs & Hope, WorkForce and APSE (Jason Roberts? Myriah Snider?). New speakers Adam Mouse and Mike Ferrari (U.S. DOL) have no bios or photos.
- **Venue map** now opens on the Terrace Level, and room labels show a one-line summary from `ROOMS`.
- **Later the same day:** Thursday "Snack for the Road" break cut (session `t7` removed). The closing plenary at 3:00 PM is the last session. The apprenticeship session (`t6c`) is Adam Mouse (U.S. DOL) only; Mike Ferrari was removed. Adam's bio and headshot are still to come — when they arrive, add him to `PEOPLE` (with `speaker: true`) and his bio to `SPEAKER_BIOS`.

## 12. Session 3 updates (Oct 9, 2026)

- **Session descriptions** for 15 sessions come from WVARF's "Presenter Submission Checklist (Updated).xlsx" and live in `SESSION_DESCRIPTIONS` in `program.js`. The keynote keeps the event-page tagline as its first line. The sheet's "State of Disability Employment" rows held the second paragraph of the apprenticeship description, so it was moved there. The closing plenary has no description yet.
- **Speakers from the checklist:**
  - Legislative session: adds Daniel Hall
  - 1C: Alyce Almond
  - 3A: Mark Fox, Morgan Hassig & Michael Yon
  - 4C: Travis Kline & Audra Spenia
  - Apprenticeship: Misty Mayville & Adam Mouse (named in the description; Mike Ferrari is still off, per Nita)
  - Closing plenary: Aaron Topping, Jason Roberts & Myriah Snider
- **Home:** on screens 700px and wider, the keynote card is the width of one guest card, centered, with centered text, so it forms a pyramid with the two delegates. Phones are unchanged.
- **Map colors:** rooms not in use are grey, conference rooms are blue, and the room opened from "Show on map" is yellow with a "Your session" badge. A color key sits above the map.

## 13. Surveys (Oct 9, 2026)

**What attendees see**
- A **Feedback** screen, reached from the Home "Share your feedback" card, the "Give feedback" quick card, the menu, each session page ("Rate this session"), and two notifications.
- A **session survey** for every educational session (keynote, plenaries, breakouts, remote janitorial training). Meals, breaks, socials, registration, the banquet and the Challenge get no survey. Each session's survey opens when the session starts.
- A **conference survey**, which opens Thu Oct 22 at 8:00 AM.
- **Notifications:** Wed 3:50 PM "How were today's sessions?" and Thu 3:55 PM "Tell us how the conference went".
- **Names are optional**, with an optional contact section at the end. Role, organization type, name, organization and email are remembered on the phone, so people only enter them once.
- **Offline:** answers sent while offline wait on the phone and send automatically when it's back online.
- **Testing early:** staff can add `?preview-surveys` to the address to open every survey before its time.

**Question design rule (applies to all future surveys)**

Mix standard satisfaction questions with formative ones that ask how useful the content is to the person's role and to their organization's State Use Program work:
- will they use it
- what was most useful
- what would have made it more useful
- what to cover more of

The full rule is written at the top of `src/data/surveys.js`.

**Files**
- `src/data/surveys.js`: the questions, which sessions get a survey, and opening times.
- `src/data/surveyStore.js`: sending answers, the offline queue, and what's remembered on the phone.
- `src/components/SurveyForm.jsx`: draws any survey from `surveys.js`.
- `src/screens/FeedbackScreen.jsx`: the list of surveys and the form.
- `vite.config.js` `netlifyForms()`: writes `dist/__forms.html`, a hidden copy of both forms, so Netlify registers every field. The app posts answers to `/__forms.html`.

**Netlify setup (one time)**
1. In Netlify, open the site, go to **Forms**, and click **Enable form detection**. Then deploy the zip again.
2. Two forms appear: **session-feedback** (all sessions in one form; the `session_title` column says which session) and **conference-feedback**.
3. To get a spreadsheet, open a form and choose **Download as CSV**. To get an email for each answer, go to **Forms → Form notifications**.
4. Scale answers read like "4 - Agree", so they can be sorted or averaged by the number.
5. Nita is willing to upgrade the Netlify plan if needed. Check the plan's monthly form-submission limit before the conference; it couldn't be looked up from here.

**Changing questions later**

Add questions with new `id`s in `surveys.js`. Never rename an `id` once answers are in, because each `id` is a column in the export. Redeploy afterward; `__forms.html` updates itself.
- **Computer layout:** at 1024px and wider the ☰ menu is hidden, so a **Feedback** item was added to the left sidebar (TabBar `tb-wide-only`). Phones still reach it from the ☰ menu, the Home cards and the session pages.
- **Keynote card:** now centered at half width above the two delegates on phones too (pyramid on every screen size).
- **Headshot crop:** every photo (Home, People, session pages) now aims near the top of the picture and zooms in 1.35x, so faces fill the circle instead of body shots. Fine-tune one person with `photoPos: { x, y, zoom }` in PEOPLE (see Avatar.jsx). Tested with a stand-in photo only; the real headshots couldn't be loaded from the sandbox.
- **Survey layout parity:** on computers the survey is capped at 760px wide and centered, with rating scales capped at 560px, so it matches the phone layout. Grid rows got spacing and dividers that no longer cut through the row labels.

## 14. Feedback report (Oct 10, 2026)
- **Netlify Forms is confirmed working:** a test conference-feedback answer arrived from synergywv.netlify.app.
- **The report:** a WVARF-branded "Synergy Feedback Report" page, published as a Claude artifact at https://claude.ai/artifact/FCMeUdrarJvgngT6VUeiSK. Load the Netlify CSVs into it (button or drag-and-drop). It reads them in the browser only and works out:
  - **Summative:** overall rating, recommend score, attend-again %, event logistics, and a sessions-at-a-glance table.
  - **Formative:** highlighted comments ("What worked" / "What to change"; staff can star comments to feature them), relevance items, usefulness by role, tracks, "more of" requests, content level, State Use Program value and resources, respondent profile, and follow-up requests (contact details).
- **Example data:** the only built-in data is the one test response, with name, email and device details removed.
- **Source file:** /tmp/claude-0/report/template.html, which contains the __MARK__ and __SAMPLE__ placeholders. It only exists in this session's workspace; to change the report later, edit the published artifact.
- **PDF (Oct 10):** the report now has a **Download PDF** button (uses the downloads capability, plus html2canvas 1.4.1 and jsPDF 2.5.1 from cdnjs). It produces a full-color, letter-size PDF (about 1.5 MB, JPEG pages) of whatever data and filters are loaded. Print styles also force the light WVARF palette with colors kept, on letter pages, so browser Print → Save as PDF keeps color too.
- **Agenda (Oct 12):**
  - Every speaker line lists each person's organization in parentheses.
  - Organizations not in PEOPLE: Mark Fox = 'WV Surplus Property', Jason Roberts = 'Workforce WV', Myriah Snider = 'APSE' (all confirmed by Nita).
  - Aaron Golub has no organization, and none is needed (per Nita).
  - Rule in conference.js: a breakout time with exactly two sessions, Pecan + Kanawha, tags the Pecan session Track A + Track B. `displayTags()` shows that as one 'Tracks A & B' pill on cards and session pages.
- **Oct 12, later:**
  - Michael Yon's organization is now 'RESPECT of FL' (PEOPLE and the session line). His published bio still says Florida ARF.
  - Gauley Room = **Shared Office**: a place to take calls and use a laptop, and where conference operations is based. `SHARED_OFFICE` in conference.js feeds a Home card (taps through to Venue), an Info section that opens by default, a Venue note, and the room-list entry.
  - Notification `shared-office-2026` releases Tue Oct 20 at 12:00 PM and expires Thu at 5 PM.
  - The Thursday 10:15–12:30 remote janitorial training in the same room is noted.
- **Gauley Room on the map (Oct 12):** the Gauley Room is the unlabeled room right above Kanawha on the Terrace Level plan. All four meeting rooms are in a row. It was added to floorplan.js by hand as room 6 on the Terrace Level.
- **Shared Office hours:** closed to calls and drop-ins Thursday 10:15 AM–12:30 PM during the remote janitorial training; open the rest of the conference. The Home card, Info, Venue and the notification all give the location as "Terrace Level, next to Kanawha".
- **Slides & handouts:** a new screen (`materials` tab), reached from the ☰ menu, the computer sidebar ("Slides") and a Home quick card. Each educational session page also has a "Slides & handouts" section.
  - The data lives in `src/data/materials.js` (MATERIALS: session id, title, kind, file, size, optional original .pptx). Files go in `public/materials/`. PowerPoints are converted to PDF so they open on phones, and the .pptx is offered too.
  - netlify.toml caches /materials/* for 1 hour.
  - **Source:** Nita's SharePoint, Central Staff > Awards Banquet & Conference Planning > 2026 > Curriculum > Presenter PPTs. On Oct 12 that folder wasn't visible through the Microsoft 365 connector yet, and the remote folder-access request was refused because of the "&" in the path. Nita needs to add the folder with the desktop app's "Add folder" button.
- **Oct 13:**
  - **More Mission resource:** an Adobe Acrobat link for More Mission for Your Money (w8a) is in MATERIALS as a `url` entry. It shows on the Slides page and the session page (now right under Speakers), and the agenda card gets a "Slides & handouts" pill.
  - **Slides tab:** "Slides" is now a sixth tab in TABS, so it's in the bottom bar on phones, the sidebar on computers, and the ☰ menu.
  - **New speakers in PEOPLE:** p21 Mark Fox (WV Surplus Property), p22 Adam Mouse (U.S. Department of Labor), p23 Jason Roberts (Workforce WV) and p24 Myriah Snider (APSE). Nita may never get bios or photos for them, so there are no placeholders: they show initials, name and organization, and session pages show a non-expanding row. Session pages now list every named speaker, bio or not.
  - **Bio cross-check:** the SharePoint Curriculum/Headshots and Bios folder has 18 speaker folders, all already in the app. There are no folders for the 4 above, David Mitchell or Aaron Golub. The RSVPify page can't be read from the sandbox because its speaker list loads with JavaScript.
  - **Mobile pass:** every screen and sheet was checked at 320, 360, 375, 390, 414, 430 and 768px. There's no sideways scrolling, clipped text or script errors anywhere. Tap targets were raised to 44px (stars, "View all"/"See all" links, People chips, Back, the "All" day tab, "Mark all as read", the floor-plan link). The only exception is the 0–10 recommend buttons at 320px, which are 36×44.
- **Materials workflow (Oct 13, Nita's decision):** Nita converts each presentation or handout to a PDF and sends a shareable link (the Acrobat link for More Mission was the test). Each link becomes one `link(session, title, url, kind, note)` line in `src/data/materials.js`. No files are stored in the app, and the SharePoint/folder collection approach is dropped.
- **Renamed (Oct 13):** "Slides" / "Slides & handouts" is now **Materials** everywhere: the tab, page title ("Session PDFs"), Home card, session-page section and agenda pill. Not "Resources", because Info already has "WVARF resources". The default kind is Presentation.

## 15. Oct 13 updates (attendees, sponsors, Day 2 changes, material links)
- **Attendees:** 30 attendees from "Conference Attendees 101326.csv" are now in PEOPLE (ids a1–a30), with name and email only.
  - Not added again: the duplicate Jamie Hall row, and anyone already in the app as a speaker, sponsor or staff member.
  - Treated as the same person: Angela Reed = Angie Reed, Michael Lamb = Mike Lamb, Myriah Jenkins = Myriah Snider (same email).
  - Email left off: Nick Biggs (aburrell@), Jim Hash (nhobbs@wvarf.org) and Erika Kirkpatrick (ajohnson@), because the address belongs to whoever registered them; Jessica Osbin, because josbin@warf.org is a typo.
  - "Guest Griffis" is listed as "Guest of Diane Griffis".
- **Exhibitors:** the Exhibitor hall section is gone from Home. The People "Exhibitors" filter only shows if exhibitors are added.
- **Sponsor logos:** Morgan Hassig & Holly Smith and Nita Shippy use /logos/wvarf-mark.webp (the WVARF icon, 120px tall). Frank & Bevin Weber use /logos/sponsor-heart.svg (a generic Lucide heart-handshake in navy and gold).
- **Day 2 changes (Oct 13 schedule):**
  - Breakout 4 (10:15): Cash Is King is now Greenbrier, Track A only. Beyond Cleaning (t6a, Zach Sandy) moved here from 1:30, Potomac, Track B. Leveraging Job Negotiation stays in Kanawha, Track C.
  - Synergy Connections Challenge: Pecan Room.
  - Breakout 5 (1:30): NEW t6t "Free & Nearly Free Tech: Big Tools for Small Nonprofit Budgets", Michael Yon, Pecan, Tracks A & B (description from the checklist). Apprenticeship stays in Kanawha, Track C.
  - Innovative CIE (Wed 11:00): Angie Reed, Jamie Childers and Mike Lamb (WV DRS employment specialists) added as speakers p25–p27, with no bios.
- **Material links:** from the checklist's "Link to Materials" column, all Adobe Acrobat links: w4a David Mitchell, w4c Alyce Almond, w8a Mark Fox + Michael Yon, t6t Michael Yon. The earlier standalone More Mission link (…722572ee…) isn't in the checklist, so it was replaced by the two presenter links. Adobe links can't be opened from the sandbox to compare contents.
- **RSVPify cross-check:** the live page can't be read from here (it loads its content with JavaScript, and the app's browser can't read pages). The comparison used the RSVPify agenda as transcribed on Oct 8; see the conflicts reported to Nita in the chat.

## 16. Synergy Connections Challenge (Oct 13, 2026)

Interactive game for the Thursday 11:30–12:30 networking hour (session t4, Pecan Room). Config lives in `src/data/challenge.js`; screen is `src/screens/ChallengeScreen.jsx`.

- **Card:** 3×3 bingo-style card in the app (Home card button, menu, desktop sidebar, t4 session detail). Squares: Visit WVABLE (code word), Trade a takeaway, Badge twin (photo), Badge story, Synergy Snapshot (group photo), Cross the state, Trade another, First-timer welcome, Visit Down Syndrome Network (code word).
- **Exhibitor code words:** `EXHIBITOR_CODES` — WVABLE = **ABLE**, Down Syndrome Network = **TOGETHER**. Case/spaces ignored. They are visible in the app's code, so they're an honor-system check, not security.
- **Scoring / raffle:** 1 ticket per square, +2 per completed line (8 lines), +5 for a full card (max 9 + 16 + 5 = 30). Players tap "Turn in my card" → Netlify form `challenge-entry` (can update until 12:40 PM; latest counts).
- **Photos:** upload immediately as form `challenge-photo` (multipart, shrunk to 1600px JPEG) with `share_ok` Yes/No. Only a 480px preview is kept on the phone. Netlify Forms file uploads count against the plan's upload limits.
- **Drawing:** staff open the app with `?challenge-staff`, load the challenge-entry CSV exported from Netlify, and tap Draw winner (weighted random by tickets, one entry per email/name, `crypto.getRandomValues`). Shows a leaderboard too.
- **Notifications:** challenge-start-2026 (Thu 11:28) and challenge-turnin-2026 (12:20).
- Progress is stored in localStorage key `wvarf-synergy:challenge-v1`.

## 17. Oct 14 updates

- **Staff contacts** (Info → WVARF team): each person shows their direct line and work email, from *WVARF Employee Contact Information.xlsx* ("Contact Information" sheet). The WVARF main line (304) 205-7970 is still used for WVARF itself in About WVARF. Morgan Hassig's direct line in the sheet, 304-205-7831, is the same number listed for Reception.
- **Sponsorship packet removed:** `SPONSORSHIP_PROPOSAL_URL` and both "View the sponsorship proposal" buttons (Home, Info) are gone. Info's Sponsorship section is now "Thank you to our sponsors", a list of every sponsor with logo/icon, name and tier, linking into People → Sponsors.
- **Personal donors** (`donor: true` in SPONSORS: Frank & Bevin Weber, Morgan Hassig & Holly Smith, Nita Shippy): Home tiles show the icon plus the name. In People, a sponsor with no photo shows the sponsor icon instead of initials (PersonRow). People entry s2 is now "Morgan Hassig & Holly Smith".
- **Photos:** Aaron Topping now uses https://wvdrs.org/wp-content/uploads/2026/04/Aaron-Topping.jpg (cached offline via the service worker rule). `photoPos` crops added: David Mitchell and Michael Yon `{ y: 18, zoom: 1.1 }`, Tina Cobb `{ y: 30, zoom: 1 }`. Adjust in conference.js if needed (lower zoom = more zoomed out).
- **Venue:** "Stay on site" (room block rate, booking) removed. The address card has a "Directions in maps" button for people driving in. Home quick link is now "Map & directions".
- **Navigation:** the header ☰ menu is gone (NavMenu.jsx is no longer used). The bottom bar is the only navigation: Home, Agenda, Venue, People, Materials, Info, Feedback. On phones the Challenge opens from its Home card and from the Thursday 11:30 session. Computers still have Challenge in the sidebar.
- **Scrolling:** every tab change now scrolls to the top (`changeTab` in App.jsx).

## 18. Room swap and map numbering (Oct 14, 2026)

- Header now reads "Venue & Map".
- Terrace Level map numbers run top to bottom down the row of meeting rooms: 1 Maple, 2 Pecan, 3 Gauley, 4 Kanawha, 5 Greenbrier, 6 Potomac (order of `rooms` in floorplan.js sets the numbers).
- New room key: **Pecan** = keynote, plenaries, combined Tracks A & B; **Gauley** = Track A; **Kanawha** = Track B; **Greenbrier** = Track C; **Potomac** = Shared Office (and the Thursday remote janitorial training, so it's closed to drop-ins 10:15–12:30).
- Every session was moved by its track: old Greenbrier → Gauley, Potomac → Kanawha, Kanawha → Greenbrier, Gauley → Potomac. Shared Office text, notification, Home card, Info title, ROOMS list and the rj1 description were updated to match.
- The Pecan auto-rule now pairs Pecan with **Greenbrier** (the Track C room): when a breakout time has only those two, Pecan is tagged Tracks A & B.

## 19. Spacing and Info cleanup (Oct 14, 2026)

- Agenda: 12px gap between the notification banner and the navy day bar (`.notif-banner + .day-tabs`).
- Home sponsors row: `scroll-padding-inline: 16px` so the first (Gold) tile keeps its gap from the left edge.
- Info → The State Use Program ends with a yellow "Visit wvarf.org for more" link box (`.info-more`).
- Info → "Other WVARF events" section removed (`OTHER_EVENTS` in conference.js is now unused).

## 20. Merged with Mike's live leaderboard package (Oct 14, 2026)

Nita's friend Mike (with Claude) built a live leaderboard, a projector page with a gift-basket drawing, and a staff photo gallery on top of the Oct 14 build. That package and this source are now one project:

- **Repo layout** (what goes on GitHub, deployed by Netlify from GitHub, **not drag-and-drop**): `site/` (built app, Netlify's publish folder), `netlify/functions` + `netlify/lib` (Netlify Functions using Netlify Blobs), `netlify.toml`, `package.json` (`@netlify/blobs`), `NITA-HANDOFF.md` (setup steps and event-day runbook), `DEPLOY.md`, `app-source/` (this folder).
- **Rebuild:** `cd app-source && npm run build && rm -rf ../site && cp -r dist ../site`.
- **Ported from Mike's bundle patches:** a 15 s timeout on form posts (surveyStore.js `post`), a 45 s timeout on photo uploads, a "Complete at least one square" turn-in hint, Home speakers sorted by first name, and `INITIAL = 8` collapsed speakers.
- **Service worker fix:** removed `includeAssets`, set `includeManifestIcons: false`, and dropped `webmanifest` from globPatterns. Before this, files were precached twice, Workbox threw an error and offline mode never worked; it's now 22 entries and caching works. Leaderboard, photos, api, .netlify, materials and document URLs are added to `navigateFallbackDenylist`.
- **Add-ons in `public/`:** `live/leaderboard.js|css`, `live/overrides.css` (home grid), `live/jszip.min.js`, `leaderboard.html` (projector at `/leaderboard`, staff drawing at `/leaderboard?staff`) and `photos.html` (`/photos`). `index.html` links the three live files. `leaderboard.js` depends on `.ch-content`, `.ch-how`, the Turn in / Update button labels and the localStorage key `wvarf-synergy:challenge-v1`, so keep those stable.
- **Netlify setup:** Forms detection on; env `STAFF_KEY` (required); optional `LEADERBOARD_SINCE` and `LEADERBOARD_HIDE`. Test mode runs until Oct 22 00:00 ET.
- **Verified locally** (Mike's `dev-server.mjs` + Playwright): a card turned in on a phone shows in the in-app mini and full boards and on `/leaderboard`, the staff panel appears with `?staff`, and `test-functions.mjs` passes.

## 21. Score updates, photo delete, staff player editing (Oct 14, 2026)

- **Checklist:** `WVARF_2026_Presenter_Submission_Checklist_Updated_1.xlsx` has the same five material links as the Oct 13 file, so `materials.js` is unchanged.
- **Bug: score only updated on the first turn-in.** It worked locally, so it's Netlify-side: `submission-created` runs only for submissions the spam filter accepts, and repeats from one person get held back. Fix: the app also POSTs each card to the new `/api/card` function (`netlify/functions/card.mjs`). `sendCard()` in ChallengeScreen.jsx keeps a pending card in localStorage (`wvarf-synergy:card-pending-v1`) and retries it on `online` and at startup. Shared `saveCard()` lives in `netlify/lib/challenge.mjs`. Verified with `SKIP_FORM_HOOK=1 node dev-server.mjs …`, which imitates the spam hold-back.
- **Photo delete:** `DELETE /api/photo/:id` (staff), plus a Delete button with a confirm on `/photos`.
- **Staff player editing:** new `/players` page (`public/players.html`) and `players` function. Staff can list all cards with email, flag possible duplicate names, Edit name/org, Remove from board / Put back, and Delete for good. Edits are stored as `entry.edit` and removal as `entry.removed`; both survive later updates. `eligible()` skips removed cards and `loadEntries()` applies `withEdits()`. The projector's `?staff` panel links to /players and /photos. `/players` is in the SW denylist, globIgnores and netlify.toml (redirect + noindex).
- **dev-server.mjs:** routes `/api/card`, `/api/players[/:id]`, `/players`, and DELETE for photos; `SKIP_FORM_HOOK` env.

## 22. Challenge hour banner (Oct 14, 2026)

- New `src/components/ChallengeLiveBanner.jsx`: a bold gold banner at the top of every screen except the Challenge itself, from `CHALLENGE.opens` (Thu 11:30) until `CHALLENGE.closes` (12:40). "Open my card" goes to the Challenge. From 12:20 it switches to "Last call: Turn in your Challenge card by 12:40". × hides it for that visit; it's not shown on the `?challenge-staff` view.
- While it shows, the plain notification banner is hidden, so only one banner is on screen (other notices stay in the bell list). The challenge-start notification now releases at 11:30 (was 11:28).

## 23. Share photos page with photo release (Oct 14, 2026)

- **Camera button** at the top left of the header on phones (replacing the old menu spot) opens the new **Share photos** page (`tab 'photos'`, `src/screens/PhotosScreen.jsx`). On computers it's "Photos" in the sidebar (TabBar `tb-wide-only`); the header button is hidden there.
- **Share photos page:** name (required), email (optional), caption, and a **photo release** (`PHOTO_RELEASE` in PhotosScreen.jsx; WVARF may want it reviewed). The agree checkbox must be ticked before Take photo / Upload from my phone work. Up to 10 photos at a time; the phone keeps small previews of the last 12 with Sent / Try again.
- **Uploads:** new `src/data/photoUpload.js` (shared `shrink()` + `uploadPhoto()`), used by both the Challenge and Share photos. It POSTs to the new function `/api/upload` (`netlify/functions/upload.mjs`), which saves straight to Blobs and so isn't affected by Netlify's spam filter. If that returns 404 (drag-and-drop deploy), it falls back to Forms (`challenge-photo` / new `conference-photo` form; `submission-created` handles both).
- **Challenge photo squares** now say **Take photo** (camera only via `capture`; the badge-twin selfie opens the front camera).
- **Staff /photos:** a "Show" filter (All / Shared photos / Challenge photos), tags for type and release, and zip names that follow the filter.
- dev-server.mjs routes `/api/upload`; `NO_UPLOAD_FN=1` imitates a deploy without functions.

## 24. Materials from the "correct version" checklist (Oct 15, 2026)

- New links were added in `materials.js`: Travis Kline (w6c Hiring Solutions; t3c Leveraging Job Negotiation), Morgan Hassig (t3a Cash Is King), and Zach Sandy (t6a Beyond Cleaning; two links from one cell, "Material 1 of 2 / 2 of 2"). There are now 10 links.
- **Heads-up:** that checklist was sorted A–Z by columns A–H only, so the Link to Materials column didn't move. The five older links now sit beside the wrong names (David Mitchell's link is beside Adam Mouse, Alyce Almond's beside Aimee White, Mark Fox's beside Dathum Cummings, Michael Yon's two beside Jamie Childers and Jason Roberts). They were kept with their original presenters. The new links were taken as placed. Nita said to use the new upload; confirm if any looks wrong.
