// Staff tools for the Challenge leaderboard (needs the x-staff-key header).
//   GET    /api/players               every card, including removed ones,
//                                     with full name and email so staff can
//                                     spot duplicates
//   PATCH  /api/players/:id {name, org, removed}
//                                     correct a name or organization, or take
//                                     a card off the board (removed: true) /
//                                     put it back (removed: false)
//   DELETE /api/players/:id           delete a card for good
// Edits and removals survive later updates from the player's phone.
import { getStore } from '@netlify/blobs';
import { STORE, displayName, withEdits } from '../lib/challenge.mjs';
import { checkStaff, json } from '../lib/photos.mjs';

const clip = (v, n) => String(v ?? '').trim().replace(/\s+/g, ' ').slice(0, n);

export default async (req, context) => {
  const auth = checkStaff(req);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const store = getStore({ name: STORE, consistency: 'strong' });
  const id = String(context.params?.id || '');

  if (req.method === 'GET' && !id) {
    const { blobs } = await store.list();
    const rows = (await Promise.all(blobs.map(b => store.get(b.key, { type: 'json' }).catch(() => null))))
      .filter(Boolean)
      .map(e => {
        const v = withEdits(e);
        return {
          id: e.id, fullName: v.fullName, name: v.name, org: v.org, tickets: e.tickets, squares: e.squares,
          lines: e.lines, at: e.at, removed: !!e.removed, edited: !!e.edit,
          originalName: e.fullName, originalOrg: e.org,
          email: (e.match || []).find(m => m.includes('@')) || '',
        };
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName) || String(b.at).localeCompare(String(a.at)));
    return json({ players: rows });
  }

  if (!/^[0-9a-f]{16}$/.test(id)) return json({ error: 'Bad id' }, 400);
  const entry = await store.get(id, { type: 'json' }).catch(() => null);
  if (!entry) return json({ error: 'Not found' }, 404);

  if (req.method === 'DELETE') {
    await store.delete(id);
    return json({ deleted: id });
  }
  if (req.method === 'PATCH') {
    let body = {};
    try { body = await req.json(); } catch {}
    const edit = { ...(entry.edit || {}) };
    if ('name' in body) {
      const n = clip(body.name, 80);
      if (n && n !== entry.fullName) edit.name = n; else delete edit.name;
    }
    if ('org' in body) {
      const o = clip(body.org, 60);
      if (o !== entry.org) edit.org = o; else delete edit.org;
    }
    if (Object.keys(edit).length) entry.edit = edit; else delete entry.edit;
    if ('removed' in body) { if (body.removed) entry.removed = new Date().toISOString(); else delete entry.removed; }
    await store.setJSON(id, entry);
    const v = withEdits(entry);
    return json({ id, fullName: v.fullName, name: displayName(v.fullName), org: v.org, removed: !!entry.removed });
  }
  return json({ error: 'Method not allowed' }, 405);
};

export const config = { path: ['/api/players', '/api/players/:id'] };
