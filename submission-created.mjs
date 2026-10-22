// Runs automatically on every verified Netlify Forms submission (spam is
// filtered out before this fires).
//  - challenge-entry: saves the player's latest card for the leaderboard.
//  - challenge-photo / conference-photo: copies the photo into Netlify Blobs
//    for the staff gallery at /photos. (The app normally uploads photos
//    straight to /api/upload; Forms is the fallback.)
import { saveCard } from '../lib/challenge.mjs';
import { findFile, photoStore } from '../lib/photos.mjs';

const clip = (v, n) => String(v ?? '').trim().slice(0, n);

async function saveEntry(p, data) {
  await saveCard(data, p.created_at);
}

async function savePhoto(p, data, kind = 'challenge') {
  const at = p.created_at || new Date().toISOString();
  const id = `${Date.parse(at) || Date.now()}-${String(p.id || Math.random().toString(36).slice(2)).slice(-12)}`;
  const metadata = {
    at,
    name: clip(data.name, 80),
    email: clip(data.email, 120),
    square: clip(data.square, 80),
    caption: clip(data.caption, 300),
    share: String(data.share_ok).toLowerCase() === 'yes',
    kind,
    release: String(data.release).toLowerCase() === 'yes',
  };
  if (kind === 'conference') { metadata.square = metadata.square || 'Conference photo'; metadata.share = metadata.release; }
  const store = photoStore();
  const file = findFile(data);
  if (!file) {
    console.log('challenge-photo: no file in payload; fields =', Object.keys(data).join(','));
    await store.set(id, '', { metadata: { ...metadata, error: 'No file in the submission' } });
    return;
  }
  try {
    const res = await fetch(file.url);
    if (!res.ok) throw new Error(`download ${res.status}`);
    const bytes = await res.arrayBuffer();
    const type = res.headers.get('content-type') || file.meta.type || 'image/jpeg';
    await store.set(id, bytes, { metadata: { ...metadata, type, size: bytes.byteLength, filename: clip(file.meta.filename, 120) } });
  } catch (err) {
    console.error('challenge-photo: copy failed', String(err));
    await store.set(id, '', { metadata: { ...metadata, error: 'Copy failed: ' + String(err).slice(0, 120) } });
  }
}

export default async (req) => {
  let body;
  try { body = await req.json(); } catch { return new Response('Bad payload', { status: 400 }); }
  const p = body?.payload || {};
  const data = p.data || {};
  const form = p.form_name || data['form-name'];
  if (form === 'challenge-entry') await saveEntry(p, data);
  else if (form === 'challenge-photo') await savePhoto(p, data);
  else if (form === 'conference-photo') await savePhoto(p, data, 'conference');
  return new Response(null, { status: 204 });
};
