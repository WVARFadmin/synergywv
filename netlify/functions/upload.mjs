// POST /api/upload — a photo from the app (multipart form data), saved
// straight into the site's photo storage for the staff gallery at /photos.
//   kind      'challenge' (a Challenge square) or 'conference' (Share photos)
//   photo     the image file (the app sends a ~1600px JPEG)
//   name, email, square, caption, share_ok ('Yes'/'No'),
//   release   'Yes' when the person agreed to the photo release (conference)
// Netlify Forms can hold back repeat submissions as spam, so photos come here
// first; the app only falls back to Forms when this function is missing.
import { photoStore, json } from '../lib/photos.mjs';

const MAX_BYTES = 5 * 1024 * 1024;
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  let form;
  try { form = await req.formData(); } catch { return json({ error: 'Expected form data' }, 400); }
  const file = form.get('photo');
  if (!file || typeof file === 'string') return json({ error: 'No photo' }, 400);
  if (!/^image\//.test(file.type || '')) return json({ error: 'Not an image' }, 415);
  if (file.size > MAX_BYTES) return json({ error: 'Photo too large' }, 413);
  const kind = form.get('kind') === 'conference' ? 'conference' : 'challenge';
  const release = String(form.get('release')).toLowerCase() === 'yes';
  // Conference photos must come with the release agreed to.
  if (kind === 'conference' && !release) return json({ error: 'Photo release not agreed' }, 400);

  const at = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const bytes = await file.arrayBuffer();
  await photoStore().set(id, bytes, {
    metadata: {
      at, kind, release,
      name: clip(form.get('name'), 80),
      email: clip(form.get('email'), 120),
      square: clip(form.get('square'), 80) || (kind === 'conference' ? 'Conference photo' : 'Photo'),
      caption: clip(form.get('caption'), 300),
      share: kind === 'conference' ? release : String(form.get('share_ok')).toLowerCase() === 'yes',
      type: file.type, size: bytes.byteLength, filename: clip(file.name, 120),
    },
  });
  return json({ saved: id });
};

export const config = { path: '/api/upload' };
