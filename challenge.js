// ============================================================
// Synergy Connections Challenge: the Thursday 11:30 networking hour.
//
// A 3 x 3 passport card in the app. Each square is a small task done in
// person: visit the two exhibitor tables, trade what you learned in
// sessions, find your funny-badge twin, take a group photo. Progress is
// kept on the player's phone. When they're done they tap "Turn in my card",
// which sends it to Netlify Forms (form: challenge-entry). Photos upload
// as they're taken (form: challenge-photo) so WVARF has them for social media.
//
// PRIZE: every completed square is one raffle ticket, every bingo line adds
// LINE_BONUS tickets, and a full card adds BLACKOUT_BONUS. Staff draw the
// gift basket winner on the hidden staff page (add ?challenge-staff to the
// app address), weighted by tickets, so there is always one clear winner.
//
// Everything below can be edited. Keep square ids stable once people play.
// ============================================================

// Code words to give the exhibitors to share at their tables. Change them
// here before the conference if you like; matching ignores capitals and spaces.
export const EXHIBITOR_CODES = {
  // Oct 22: WV Relay replaced WVABLE as an exhibitor.
  wvrelay: 'RELAY',
  dsn: 'TOGETHER',
};

export const CHALLENGE = {
  title: 'Synergy Connections Challenge',
  when: 'Thursday, October 22 · 11:30 AM – 12:30 PM',
  where: 'Terrace Foyer',
  prize: 'Gift basket drawing',
  // Card opens at the start of the conference so people can read it; turning
  // in closes 10 minutes after the hour ends. Eastern daylight time.
  opens: '2026-10-22T11:30:00-04:00',
  closes: '2026-10-22T12:40:00-04:00',
  drawing: 'The winner is drawn right after the Challenge closes.',
};

export const LINE_BONUS = 2;
export const BLACKOUT_BONUS = 5;

// Square types:
//   code    must enter the exhibitor's code word (checked in the app)
//   fields  fill in every required field
//   photo   take or choose a photo (uploads for WVARF's social media)
// Order is the card layout, left to right, top to bottom.
export const SQUARES = [
  {
    id: 'wvrelay', icon: 'phone', title: 'Visit WV Relay',
    task: 'Stop by the WV Relay table and ask what they offer. They’ll give you the code word.',
    type: 'code', code: 'wvrelay',
    fields: [{ id: 'wvrelay_learned', label: 'One thing you learned (optional)', optional: true }],
  },
  {
    id: 'trade1', icon: 'swap', title: 'Trade a takeaway',
    task: 'Find someone who went to a session you missed. Ask for the one thing they’ll use back at work.',
    type: 'fields',
    fields: [
      { id: 'trade1_person', label: 'Their name' },
      { id: 'trade1_session', label: 'The session', kind: 'session' },
      { id: 'trade1_learned', label: 'What they learned', long: true },
    ],
  },
  {
    id: 'twin', icon: 'badge', title: 'Badge twin',
    task: 'Find someone wearing the same funny badge as you. Snap a selfie together.',
    type: 'photo',
    fields: [{ id: 'twin_person', label: 'Your badge twin’s name' }],
  },
  {
    id: 'story', icon: 'chat', title: 'Badge story',
    task: 'Read someone’s funny badge (“I run with scissors”?) and ask why they picked it.',
    type: 'fields',
    fields: [
      { id: 'story_person', label: 'Their name' },
      { id: 'story_badge', label: 'What their badge says' },
      { id: 'story_text', label: 'The story, in a sentence', long: true },
    ],
  },
  {
    id: 'snapshot', icon: 'camera', title: 'Synergy Snapshot',
    task: 'Group photo with at least 3 people from 3 different organizations. Big smiles: this one may end up on WVARF’s social media.',
    type: 'photo',
    fields: [{ id: 'snapshot_caption', label: 'Who’s in it? (optional)', optional: true }],
  },
  {
    id: 'cross', icon: 'map', title: 'Cross the state',
    task: 'Meet someone from a different kind of organization than yours (a state agency, a CRP, a business or a partner).',
    type: 'fields',
    fields: [
      { id: 'cross_person', label: 'Their name' },
      { id: 'cross_org', label: 'Their organization' },
    ],
  },
  {
    id: 'trade2', icon: 'swap', title: 'Trade another',
    task: 'Trade takeaways with a second person, from a different session than your first trade.',
    type: 'fields',
    fields: [
      { id: 'trade2_person', label: 'Their name' },
      { id: 'trade2_session', label: 'The session', kind: 'session' },
      { id: 'trade2_learned', label: 'What they learned', long: true },
    ],
  },
  {
    id: 'firsttimer', icon: 'wave', title: 'First-timer welcome',
    task: 'Find someone at their first WVARF State Use Conference and ask what they’ve enjoyed most.',
    type: 'fields',
    fields: [
      { id: 'first_person', label: 'Their name' },
      { id: 'first_enjoyed', label: 'What they’ve enjoyed' },
    ],
  },
  {
    id: 'dsn', icon: 'heart', title: 'Visit Down Syndrome Network',
    task: 'Stop by the Down Syndrome Network table and learn one way they support families. They’ll give you the code word.',
    type: 'code', code: 'dsn',
    fields: [{ id: 'dsn_learned', label: 'One thing you learned (optional)', optional: true }],
  },
];

// Rows, columns and diagonals of the 3 x 3 card.
export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export const normCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

export function squareDone(sq, answers, photos) {
  if (sq.type === 'code' && normCode(answers[`${sq.id}_code`]) !== normCode(EXHIBITOR_CODES[sq.code])) return false;
  if (sq.type === 'photo' && !photos[sq.id]) return false;
  return sq.fields.every(f => f.optional || String(answers[f.id] || '').trim().length > 1);
}

export function score(answers, photos) {
  const done = SQUARES.map(sq => squareDone(sq, answers, photos));
  const squares = done.filter(Boolean).length;
  const lines = LINES.filter(l => l.every(i => done[i])).length;
  const blackout = squares === SQUARES.length;
  return { done, squares, lines, blackout, tickets: squares + lines * LINE_BONUS + (blackout ? BLACKOUT_BONUS : 0) };
}

// Every field the card can send, for the build's /__forms.html.
export const ENTRY_FIELDS = [
  'name', 'email', 'organization', 'my_badge', 'tickets', 'squares', 'lines', 'blackout', 'squares_done', 'photos_sent',
  ...SQUARES.filter(s => s.type === 'code').map(s => `${s.id}_code`),
  ...SQUARES.flatMap(s => s.fields.map(f => f.id)),
];
export const PHOTO_FIELDS = ['name', 'email', 'square', 'caption', 'share_ok', 'photo'];
