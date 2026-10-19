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
// Cards count from 11:28 AM Thursday, when the card unlocks for everyone, so
// staff test cards made that morning (with ?challenge-preview) don't count.
export const DEFAULT_SINCE = '2026-10-22T11:28:00-04:00';
// Before this, /api/leaderboard is locked to the public (staff key only).
export const BOARD_REVEAL = '2026-10-22T11:28:00-04:00';

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

// Save a turned-in card. Called both by submission-created (Netlify Forms)
// and by the app directly through /api/card, so a score still updates if
// Netlify's spam filter holds back a repeat form submission. Keeps any staff
// edits (name/org) and the staff "removed" flag across later updates.
export async function saveCard(data, createdAt) {
  const entry = toEntry(data, createdAt);
  if (!entry) return { saved: false, reason: 'no name' };
  const store = getStore({ name: STORE, consistency: 'strong' });
  const existing = await store.get(entry.id, { type: 'json' }).catch(() => null);
  // A slow, older resend must not overwrite a newer card.
  if (existing && Date.parse(existing.at) > Date.parse(entry.at)) return { saved: false, reason: 'older' };
  if (existing?.edit) entry.edit = existing.edit;
  if (existing?.removed) entry.removed = existing.removed;
  await store.setJSON(entry.id, entry);
  return { saved: true, id: entry.id };
}

// Apply a staff edit (corrected name or organization) to a stored card.
export function withEdits(e) {
  if (!e || !e.edit) return e;
  const out = { ...e };
  if (e.edit.name) { out.fullName = e.edit.name; out.name = displayName(e.edit.name); }
  if (e.edit.org != null) out.org = e.edit.org;
  return out;
}

// Cards that count: on or after `since`, not hidden or removed by staff, with
// at least 1 ticket.
export function eligible(entries, { since, hide = [] } = {}) {
  const sinceMs = Date.parse(since || DEFAULT_SINCE);
  const hidden = new Set(hide.map(h => h.trim().toLowerCase()).filter(Boolean));
  return entries
    .filter(e => e && e.tickets > 0 && !e.removed)
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
// at 11:28 AM Oct 22 test cards drop off automatically. LEADERBOARD_SINCE overrides.
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
  return (await Promise.all(blobs.map(b => store.get(b.key, { type: 'json' }).catch(() => null)))).map(withEdits);
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
