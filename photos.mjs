// Challenge photos, copied off Netlify Forms into Netlify Blobs so staff can
// view and download them from the site itself (/photos), instead of through
// Netlify's file links.
import { timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { env } from './challenge.mjs';

export const PHOTO_STORE = 'challenge-photos';
export const photoStore = () => getStore({ name: PHOTO_STORE, consistency: 'strong' });

// Netlify passes an uploaded file as an object with a (short-lived) url;
// older payloads used a bare URL string. Accept either.
export function fileUrl(v) {
  if (!v) return null;
  if (typeof v === 'string') return /^https?:\/\//.test(v) ? v : null;
  if (typeof v === 'object') return fileUrl(v.url || v.href || v.link);
  return null;
}

export function findFile(data) {
  const direct = fileUrl(data.photo);
  if (direct) return { url: direct, meta: typeof data.photo === 'object' ? data.photo : {} };
  for (const [k, v] of Object.entries(data)) {
    const u = fileUrl(v);
    if (u && k !== 'referrer') return { url: u, meta: typeof v === 'object' ? v : {} };
  }
  return null;
}

// Staff-only: every photo endpoint needs the STAFF_KEY set in Netlify.
export function checkStaff(req) {
  const want = String(env('STAFF_KEY') || '');
  if (!want) return { ok: false, status: 503, error: 'STAFF_KEY is not set in Netlify environment variables.' };
  const got = String(req.headers.get('x-staff-key') || '');
  const a = Buffer.from(got);
  const b = Buffer.from(want);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  return ok ? { ok: true } : { ok: false, status: 401, error: 'Wrong staff key.' };
}

export const json = (body, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
