// Shared by the Challenge functions. Keep playerId() in step with the copy in
// site/live/leaderboard.js — the app uses it to find "you" on the board.
import { createHash, randomInt } from 'node:crypto';
import { getStore } from '@netlify/blobs';

export const STORE = 'challenge-leaderboard';
export const DRAW_STORE = 'challenge-draw';

// The card is 3×3: 9 squares, 8 lines worth +2 each, +5 for the whole card.
export const MAX_SQUARES = 9;
export const MAX_LINES = 8;
export const MAX_TICKETS = MAX_SQUARES + MAX_LINES * 2 + 5;

// Entries before this are treated as tests and left off the board.
// Override with the LEADERBOARD_SINCE environment variable.
export const DEFAULT_SINCE = '2026-10-22T00:00:00-04:00';

export function env(name) {
  return globalThis.Netlify?.env?.get(name) ?? process.env[name];
}

export function normKey(email, name) {
  const e = String(email || '').trim().toLowerCase();
  if (e) return e;
  return String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function playerId(email, name) {
  const k = normKey(email, name);
  return k ? createHash('sha256').update(k).digest('hex').slice(0, 16) : null;
}

// "Mary Ann Smith" -> "Mary Ann S."  Public board shows no full surnames.
export function displayName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'Player';
  if (parts.length === 1) return parts[0].slice(0, 30);
  const last = parts.pop();
  return `${parts.join(' ')} ${last[0].toUpperCase()}.`.slice(0, 34);
}

const int = (v, max) => Math.min(max, Math.max(0, parseInt(v, 10) || 0));
const clip = (v, n) => String(v || '').trim().replace(/\s+/g, ' ').slice(0, n);

// Turn a challenge-entry form submission into a leaderboard record. The
// phone works out its own tickets, so cap them at what the card allows.
export function toEntry(data, createdAt) {
  const id = playerId(data.email, data.name);
  if (!id || !String(data.name || '').trim()) return null;
  const squares = int(data.squares, MAX_SQUARES);
  const lines = int(data.lines, MAX_LINES);
  const blackout = String(data.blackout).toLowerCase() === 'yes' && squares === MAX_SQUARES;
  const allowed = squares + lines * 2 + (blackout ? 5 : 0);
  return {
    id,
    name: displayName(data.name),
    org: clip(data.organization, 60),
    tickets: Math.min(int(data.tickets, MAX_TICKETS), allowed),
    squares,
    lines,
    blackout,
    at: data.submitted_at || createdAt || new Date().toISOString(),
    // Private: full name is only shown when this player wins the drawing.
    fullName: clip(data.name, 80),
    // Private: used only to match LEADERBOARD_HIDE. Never sent to phones.
    match: [normKey(data.email, ''), normKey('', data.name)].filter(Boolean),
  };
}

// Cards that count: on or after `since`, not hidden, with at least 1 ticket.
export function eligible(entries, { since, hide = [] } = {}) {
  const sinceMs = Date.parse(since || DEFAULT_SINCE);
  const hidden = new Set(hide.map(h => h.trim().toLowerCase()).filter(Boolean));
  return entries
    .filter(e => e && e.tickets > 0)
    .filter(e => !(Date.parse(e.at) < sinceMs))
    .filter(e => !(e.match || []).some(m => hidden.has(m)));
}

// Highest tickets first; equal tickets share a rank (1, 2, 2, 4).
export function rank(entries, opts = {}) {
  const rows = eligible(entries, opts).sort((a, b) => b.tickets - a.tickets || a.name.localeCompare(b.name));
  let prev = null;
  let r = 0;
  return rows.map((e, i) => {
    if (e.tickets !== prev) { r = i + 1; prev = e.tickets; }
    return { rank: r, id: e.id, name: e.name, org: e.org, tickets: e.tickets, squares: e.squares, lines: e.lines, blackout: e.blackout };
  });
}

// Before the Challenge day the board runs in test mode and counts every card;
// on Oct 22 test cards drop off automatically. LEADERBOARD_SINCE overrides.
export function boardSettings(now = Date.now()) {
  const configured = env('LEADERBOARD_SINCE');
  const testMode = !configured && now < Date.parse(DEFAULT_SINCE);
  return {
    testMode,
    since: configured || (testMode ? '1970-01-01T00:00:00Z' : DEFAULT_SINCE),
    hide: String(env('LEADERBOARD_HIDE') || '').split(','),
  };
}

export async function loadEntries() {
  const store = getStore({ name: STORE, consistency: 'strong' });
  const { blobs } = await store.list();
  return Promise.all(blobs.map(b => store.get(b.key, { type: 'json' }).catch(() => null)));
}

// Weighted draw: every ticket is one chance. Uses the OS's secure random
// number generator. `exclude` skips earlier winners for a redraw.
export function pickWinner(pool, exclude = []) {
  const skip = new Set(exclude);
  const players = pool.filter(e => !skip.has(e.id));
  const total = players.reduce((n, e) => n + e.tickets, 0);
  if (!total) return null;
  let ticket = randomInt(total);
  for (const e of players) {
    if (ticket < e.tickets) return { winner: e, players: players.length, tickets: total };
    ticket -= e.tickets;
  }
  return null;
}

// What the public screens may show about a drawn winner.
export function publicWinner(w, testMode) {
  if (!w || (w.test && !testMode)) return null;
  return { name: w.name, org: w.org, tickets: w.tickets, at: w.at, test: !!w.test, round: w.round || 1 };
}
