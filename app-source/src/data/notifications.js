import { SESSIONS } from './conference.js';

// Notifications shown in the bell panel.
//
// Each one stays HIDDEN until its `sentAt` time, then appears on its own —
// unread badge, banner and all — with no one needing to publish anything at
// that moment. Write the whole conference's announcements here ahead of
// time, publish once, and they release on schedule. Order in this list does
// not matter; the panel shows the most recent first.
//
// `sentAt` is the release time. Always include the Eastern offset, which is
// -04:00 for the conference week (daylight time), e.g.
//   '2026-10-21T09:30:00-04:00'   = Wednesday, October 21 at 9:30 AM
// A time that cannot be read is treated as never released, so a typo can
// never push an announcement out early.
//
// `body` is one line of detail; `lines` may be used instead for a short list.
//
// `target` is where tapping the notification goes. Use exactly one of:
//   { sessionId: 'w2' }                  a specific session (ids in conference.js)
//   { tab: 'agenda' }                    a tab: home, agenda, venue, people, info
//   { tab: 'people', filter: 'sponsors' } the People tab pre-filtered
//   { tab: 'agenda', day: 2 }            the Agenda opened on a given day
//   { survey: 'conference' }             a survey: 'conference', a session id, or 'list'
//
// Optional `expiresAt` hides a notification again after that time, so
// time-sensitive reminders do not pile up once they no longer apply.
//
// Never change or reuse an `id` once published: read/unread is remembered by
// id on each attendee's phone.
//
// To check upcoming ones before they release, open the app with
// ?preview-notifications on the end of the address. The bell then lists
// scheduled notifications too, marked "Scheduled". Attendees never see this.

// Conference days, for building release times. All times are Eastern
// daylight time (-04:00) during the conference week.
const DATES = { 1: '2026-10-20', 2: '2026-10-21', 3: '2026-10-22' };
const DAY_NAMES = { 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday' };

// '11:15 AM' -> minutes after midnight
function minutesOf(time) {
  const [, h, m, ap] = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  return ((+h % 12) + (ap.toUpperCase() === 'PM' ? 12 : 0)) * 60 + +m;
}
function at(day, minutes) {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return `${DATES[day]}T${hh}:${mm}:00-04:00`;
}

// The registration desk is open all morning, so it never gets an
// "up next" reminder.
const NO_REMINDER = [/^Registration/];

function restriction(s) {
  const tags = s.tags || [];
  if (tags.includes('Remote training')) return ' (virtual)';
  return '';
}

// One "Up next" reminder per time slot, released 15 minutes before it and
// hidden again 10 minutes after it starts. Built from the agenda, so a
// session moved to a new time moves its reminder with it.
function upNextReminders() {
  const slots = new Map();
  for (const s of SESSIONS) {
    if (NO_REMINDER.some(rx => rx.test(s.title))) continue;
    const key = `${s.day} ${s.time}`;
    if (!slots.has(key)) slots.set(key, []);
    slots.get(key).push(s);
  }
  return [...slots.values()].map(items => {
    const { day, time } = items[0];
    const start = minutesOf(time);
    const base = {
      id: `upnext-d${day}-${time.replace(/\W/g, '').toLowerCase()}`,
      sentAt: at(day, start - 15),
      expiresAt: at(day, start + 10),
    };
    if (items.length === 1) {
      const s = items[0];
      return {
        ...base,
        title: `Up next: ${s.title}`,
        body: `Starts at ${time}${s.room ? ` in ${s.room}` : ''}${restriction(s)}.`,
        target: { sessionId: s.id },
      };
    }
    return {
      ...base,
      title: `Up next at ${time}`,
      // A list rather than one run-on line: several sessions start together.
      // Room names use non-breaking spaces so "Potomac Room" never splits.
      lines: items.map(s => `${s.title}${s.room ? ` — ${s.room.replace(/ /g, ' ')}` : ''}${restriction(s)}`),
      target: { tab: 'agenda', day },
    };
  });
}

const EVENT_REMINDERS = [
  {
    id: 'remind-reception-2026',
    sentAt: '2026-10-20T15:00:00-04:00',
    expiresAt: '2026-10-20T21:30:00-04:00',
    title: 'Reception tonight on the Terrace Lawn',
    body: "S'mores and drinks beside the firepit from 7:30 PM. Come meet people before sessions start.",
    target: { sessionId: 'd0' },
  },
  {
    id: 'remind-banquet-2026',
    sentAt: '2026-10-21T12:45:00-04:00',
    expiresAt: '2026-10-21T18:30:00-04:00',
    title: 'Awards Banquet tonight',
    body: 'Reception and cocktail hour at 5:30 PM in Ballroom II, dinner and ceremony at 6:30 PM.',
    target: { sessionId: 'w9' },
  },
  {
    id: 'remind-challenge-2026',
    sentAt: '2026-10-22T08:30:00-04:00',
    expiresAt: '2026-10-22T12:40:00-04:00',
    title: 'Synergy Connections Challenge at 11:30',
    body: 'Runs 11:30 AM \u2013 12:30 PM in the Pecan Room. Open your Challenge card in the app to see the squares.',
    target: { tab: 'challenge' },
  },
  {
    id: 'shared-office-2026',
    sentAt: '2026-10-20T12:00:00-04:00',
    expiresAt: '2026-10-22T17:00:00-04:00',
    title: 'Need a place to take a call?',
    body: 'The Potomac Room (Terrace Level, next to Greenbrier) is our Shared Office: take calls, work on your laptop, or find the conference team. Closed Thursday 10:15 AM–12:30 PM for the remote janitorial training.',
    target: { tab: 'info' },
  },
  {
    id: 'challenge-start-2026',
    sentAt: '2026-10-22T11:28:00-04:00',
    expiresAt: '2026-10-22T12:40:00-04:00',
    title: 'The Connections Challenge is on!',
    body: 'Fill your card: visit WVABLE and Down Syndrome Network, trade takeaways, find your badge twin. Every square is a ticket for the gift basket.',
    target: { tab: 'challenge' },
  },
  {
    id: 'challenge-turnin-2026',
    sentAt: '2026-10-22T12:20:00-04:00',
    expiresAt: '2026-10-22T12:40:00-04:00',
    title: 'Turn in your Challenge card',
    body: 'Tap “Turn in my card” before 12:40 PM to be in the gift basket drawing.',
    target: { tab: 'challenge' },
  },
  {
    id: 'survey-sessions-day1-2026',
    sentAt: '2026-10-21T15:50:00-04:00',
    expiresAt: '2026-10-22T08:00:00-04:00',
    title: 'How were today’s sessions?',
    body: 'Take two minutes to rate the sessions you attended. Tell us what was useful and what would help more.',
    target: { survey: 'list' },
  },
  {
    id: 'survey-conference-2026',
    sentAt: '2026-10-22T15:55:00-04:00',
    expiresAt: '2026-11-06T00:00:00-04:00',
    title: 'Tell us how the conference went',
    body: 'Your feedback shapes next year’s sessions and tracks. About five minutes; every question is optional.',
    target: { survey: 'conference' },
  },
  {
    id: 'remind-tracks-2026',
    sentAt: '2026-10-21T07:45:00-04:00',
    expiresAt: '2026-10-21T11:00:00-04:00',
    title: 'Three tracks to choose from',
    lines: [
      'Track A — Capacity Building & Organization Longevity',
      'Track B — Sales & Marketing',
      'Track C — Client Support & Vocational Rehabilitation',
    ],
    target: { tab: 'agenda', day: 2 },
  },
];

const ANNOUNCEMENTS = [
  {
    id: 'welcome-synergy-2026',
    sentAt: '2026-09-15T09:00:00-04:00',   // already released: visible from launch
    title: 'Welcome to Statewide Synergy 2026',
    body: 'Thank you for joining WVARF for the 2nd Annual State Use Conference at Stonewall Resort, October 20–22. Everything you need is here: the full agenda, speakers and sponsors, the venue map, and WVARF resources. Tap to browse the agenda.',
    target: { tab: 'agenda', day: 'all' },
  },
  {
    id: 'hotel-deadline-2026',
    sentAt: '2026-09-10T09:00:00-04:00',
    expiresAt: '2026-09-21T00:00:00-04:00',
    title: 'Room block closes September 20',
    body: 'The $189 conference rate at Stonewall Resort is held until September 20, or until the block fills. Book from the Venue tab.',
    target: { tab: 'venue' },
  },
];

export const NOTIFICATIONS = [...ANNOUNCEMENTS, ...EVENT_REMINDERS, ...upNextReminders()];

export { DAY_NAMES };

const releaseTime = (n) => {
  const t = Date.parse(n.sentAt);
  if (Number.isNaN(t)) console.warn(`Notification ${n.id} has an unreadable sentAt; it will not be shown.`);
  return t;
};

export function isReleased(n, now) {
  const t = releaseTime(n);
  if (Number.isNaN(t) || t > now) return false;
  return !n.expiresAt || now < Date.parse(n.expiresAt);
}

// Newest first. With includeScheduled, upcoming ones are listed as well
// (staff preview); unreadable times are always excluded.
export function notificationsAt(now, { includeScheduled = false } = {}) {
  return NOTIFICATIONS
    .filter(n => includeScheduled
      ? !Number.isNaN(releaseTime(n)) && (!n.expiresAt || now < Date.parse(n.expiresAt))
      : isReleased(n, now))
    .sort((a, b) => Date.parse(b.sentAt) - Date.parse(a.sentAt));
}
