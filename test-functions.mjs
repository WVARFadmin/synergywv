// Local test: real Blobs API against Netlify's local Blobs server.
import { BlobsServer } from '@netlify/blobs/server';
import assert from 'node:assert/strict';

const dir = process.argv[2];
const server = new BlobsServer({ directory: dir, token: 't', port: 8971 });
await server.start();
const url = 'http://localhost:8971';
process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({ edgeURL: url, uncachedEdgeURL: url, siteID: 'site1', token: 't' })).toString('base64');

const sub = (await import('./netlify/functions/submission-created.mjs')).default;
const lb = (await import('./netlify/functions/leaderboard.mjs')).default;
const draw = (await import('./netlify/functions/draw.mjs')).default;
const { pickWinner } = await import('./netlify/lib/challenge.mjs');
const post = (form, data, created_at = '2026-10-22T16:00:00Z') =>
  sub(new Request('http://x/', { method: 'POST', body: JSON.stringify({ payload: { form_name: form, data, created_at } }) }));

const T = (h, m) => `2026-10-22T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`;
await post('challenge-entry', { name: 'Mary Ann Smith', email: 'MARY@x.org ', organization: 'SW Resources', tickets: '6', squares: '4', lines: '1', blackout: 'No', submitted_at: T(15, 40) });
await post('challenge-entry', { name: 'Bob Jones', email: 'bob@x.org', organization: 'Job Squad', tickets: '30', squares: '9', lines: '8', blackout: 'Yes', submitted_at: T(15, 45) });
await post('challenge-entry', { name: 'Cheater', email: 'c@x.org', tickets: '999', squares: '2', lines: '0', blackout: 'Yes', submitted_at: T(15, 46) });
await post('challenge-entry', { name: 'Tess', email: 'tess@x.org', tickets: '6', squares: '4', lines: '1', blackout: 'No', submitted_at: T(15, 47) });
await post('challenge-entry', { name: 'Old Test', email: 'old@x.org', tickets: '5', squares: '5', lines: '0', submitted_at: '2026-10-15T15:00:00Z' });
await post('session-feedback', { name: 'Ignored', email: 'z@x.org', tickets: '9' });
// Newer card for Mary raises her score; then a stale resend must not lower it.
await post('challenge-entry', { name: 'Mary Ann Smith', email: 'mary@x.org', organization: 'SW Resources', tickets: '12', squares: '6', lines: '3', blackout: 'No', submitted_at: T(16, 10) });
await post('challenge-entry', { name: 'Mary Ann Smith', email: 'mary@x.org', organization: 'SW Resources', tickets: '6', squares: '4', lines: '1', blackout: 'No', submitted_at: T(15, 50) });

process.env.LEADERBOARD_SINCE = '2026-10-22T00:00:00-04:00';
let res = await lb();
let j = await res.json();
console.log(res.status, res.headers.get('netlify-cdn-cache-control'));
console.log(JSON.stringify(j.rows, null, 1));
assert.equal(j.players, 4);
assert.deepEqual(j.rows.map(r => [r.rank, r.name, r.tickets]), [[1, 'Bob J.', 30], [2, 'Mary Ann S.', 12], [3, 'Tess', 6], [4, 'Cheater', 2]]);
assert.ok(!JSON.stringify(j).includes('@'), 'no emails in public output');
// Ties share a rank.
await post('challenge-entry', { name: 'Ann Lee', email: 'ann@x.org', tickets: '6', squares: '4', lines: '1', submitted_at: T(16, 20) });
j = await (await lb()).json();
assert.deepEqual(j.rows.map(r => [r.rank, r.name]), [[1, 'Bob J.'], [2, 'Mary Ann S.'], [3, 'Ann L.'], [3, 'Tess'], [5, 'Cheater']]);
// Staff can hide a player by email or full name.
process.env.LEADERBOARD_HIDE = 'c@x.org, Tess';
j = await (await lb()).json();
assert.deepEqual(j.rows.map(r => r.name), ['Bob J.', 'Mary Ann S.', 'Ann L.']);
// Test-period entries appear when LEADERBOARD_SINCE is moved earlier.
process.env.LEADERBOARD_SINCE = '2026-10-01T00:00:00-04:00';
j = await (await lb()).json();
assert.ok(j.rows.some(r => r.name === 'Old T.'));
// With no setting, before Oct 22 is test mode: every card shows.
delete process.env.LEADERBOARD_SINCE; delete process.env.LEADERBOARD_HIDE;
j = await (await lb()).json();
assert.equal(j.testMode, Date.now() < Date.parse('2026-10-22T00:00:00-04:00'));
if (j.testMode) assert.ok(j.rows.some(r => r.name === 'Old T.'));

// ---- Drawing --------------------------------------------------------------
// Weighting: a 30-ticket player should win ~30/31 of the time vs a 1-ticket player.
const counts = { a: 0, b: 0 };
for (let i = 0; i < 31000; i++) counts[pickWinner([{ id: 'a', tickets: 30 }, { id: 'b', tickets: 1 }]).winner.id]++;
assert.ok(Math.abs(counts.b - 1000) < 200, 'weighted odds ' + JSON.stringify(counts));
assert.equal(pickWinner([{ id: 'a', tickets: 3 }], ['a']), null);

const call = (method, body, key = 'k1') => draw(new Request('http://x/api/draw', { method, headers: { 'x-staff-key': key, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }));
process.env.STAFF_KEY = 'k1';
assert.equal((await call('POST', {}, 'nope')).status, 401);
let d = await (await call('POST', {})).json();
assert.ok(d.winner && d.winner.name, 'drew a winner');
const first = d.winner.name;
j = await (await lb()).json();
assert.equal(j.winner.name, first, 'leaderboard shows winner');
assert.ok(!('id' in j.winner) && !('drawn' in j.winner), 'no private fields');
// Draw again never repeats someone already drawn.
const seen = new Set([first]);
for (let i = 0; i < 4; i++) {
  const r = await call('POST', { again: true });
  if (r.status === 409) break;
  const n = (await r.json()).winner.name;
  assert.ok(!seen.has(n), 'redraw repeated ' + n); seen.add(n);
}
// Clearing removes it from the board.
await call('DELETE');
j = await (await lb()).json();
assert.equal(j.winner, null);
// Full names show only for the winner.
assert.ok(j.rows.every(r => /^\S+( \S+)* ?([A-Z]\.)?$/.test(r.name)));
console.log('draw: weighted odds', JSON.stringify(counts), '· winners', [...seen].join(', '));
console.log('ALL FUNCTION TESTS PASSED');
await server.stop();
