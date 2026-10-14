// GET /api/leaderboard — public standings for the Synergy Connections
// Challenge. Shows first name + last initial and organization only (plus the
// winner's full name once staff draw one). Netlify's CDN caches the answer
// for a few seconds, so a room full of phones polling it costs very little.
import { getStore } from '@netlify/blobs';
import { DRAW_STORE, boardSettings, loadEntries, publicWinner, rank } from '../lib/challenge.mjs';

export default async () => {
  try {
    const settings = boardSettings();
    const [entries, drawn] = await Promise.all([
      loadEntries(),
      getStore({ name: DRAW_STORE, consistency: 'strong' }).get('current', { type: 'json' }).catch(() => null),
    ]);
    const rows = rank(entries, settings);
    return Response.json(
      {
        updated: new Date().toISOString(),
        testMode: settings.testMode,
        players: rows.length,
        tickets: rows.reduce((n, r) => n + r.tickets, 0),
        rows: rows.slice(0, 100),
        winner: publicWinner(drawn, settings.testMode),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Netlify-CDN-Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10',
        },
      },
    );
  } catch (err) {
    console.error('leaderboard failed', err);
    return Response.json({ error: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};

export const config = { path: '/api/leaderboard' };
