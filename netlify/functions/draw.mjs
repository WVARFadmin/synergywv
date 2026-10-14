// Staff-only gift basket drawing (needs the x-staff-key header).
//   POST   /api/draw               draw a winner (weighted by tickets)
//   POST   /api/draw {"again":true} draw again, skipping everyone already drawn
//   DELETE /api/draw               clear the winner from the screens
// The result is saved, so every leaderboard screen shows the same winner.
import { getStore } from '@netlify/blobs';
import { DRAW_STORE, boardSettings, eligible, loadEntries, pickWinner, publicWinner } from '../lib/challenge.mjs';
import { checkStaff, json } from '../lib/photos.mjs';

export default async (req) => {
  const auth = checkStaff(req);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const store = getStore({ name: DRAW_STORE, consistency: 'strong' });

  if (req.method === 'DELETE') {
    await store.delete('current');
    return json({ cleared: true });
  }
  if (req.method !== 'POST') return json({ error: 'Use POST or DELETE' }, 405);

  let body = {};
  try { body = await req.json(); } catch {}
  const settings = boardSettings();
  const previous = body.again ? await store.get('current', { type: 'json' }).catch(() => null) : null;
  const exclude = previous && !(previous.test && !settings.testMode) ? previous.drawn || [previous.id] : [];

  const pool = eligible(await loadEntries(), settings);
  const result = pickWinner(pool, exclude);
  if (!result) {
    return json({ error: exclude.length ? 'Everyone with tickets has already been drawn.' : 'No cards with tickets have been turned in yet.' }, 409);
  }
  const w = result.winner;
  const record = {
    id: w.id,
    name: w.fullName || w.name,
    org: w.org,
    tickets: w.tickets,
    at: new Date().toISOString(),
    test: settings.testMode,
    round: exclude.length + 1,
    drawn: [...exclude, w.id],
    pool: { players: result.players, tickets: result.tickets },
  };
  await store.setJSON('current', record);
  return json({ winner: publicWinner(record, settings.testMode), pool: record.pool });
};

export const config = { path: '/api/draw' };
