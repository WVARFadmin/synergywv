// GET /api/photos — staff list of Challenge photos (needs the x-staff-key header).
import { checkStaff, json, photoStore } from '../lib/photos.mjs';

export default async (req) => {
  const auth = checkStaff(req);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const store = photoStore();
  const { blobs } = await store.list();
  const items = await Promise.all(blobs.map(async b => {
    const m = (await store.getMetadata(b.key))?.metadata || {};
    return { id: b.key, ...m };
  }));
  items.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  return json({ photos: items });
};

export const config = { path: '/api/photos' };
