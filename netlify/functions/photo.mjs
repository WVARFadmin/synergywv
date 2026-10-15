// GET    /api/photo/:id — one Challenge photo's image
// DELETE /api/photo/:id — remove a photo (test shots, duplicates, mistakes)
// Both need the x-staff-key header.
import { checkStaff, json, photoStore } from '../lib/photos.mjs';

export default async (req, context) => {
  const auth = checkStaff(req);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const id = String(context.params?.id || '');
  if (!/^[\w.-]{1,80}$/.test(id)) return json({ error: 'Bad id' }, 400);
  if (req.method === 'DELETE') {
    await photoStore().delete(id);
    return json({ deleted: id });
  }
  const result = await photoStore().getWithMetadata(id, { type: 'arrayBuffer' });
  if (!result || !result.data || !result.data.byteLength) return json({ error: 'Not found' }, 404);
  return new Response(result.data, {
    headers: {
      'Content-Type': result.metadata?.type || 'image/jpeg',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};

export const config = { path: '/api/photo/:id' };
