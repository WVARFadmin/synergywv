// POST /api/card — the app sends each turned-in Challenge card here as well
// as to Netlify Forms. Netlify only runs submission-created for submissions
// its spam filter accepts, and repeat cards from the same person can be held
// back as spam, which left a player's score stuck at their first turn-in.
// This saves the card straight to the leaderboard. Tickets are capped at
// what the card allows (see toEntry), the same as the Forms path.
import { saveCard } from '../lib/challenge.mjs';
import { json } from '../lib/photos.mjs';

const FIELDS = ['name', 'email', 'organization', 'tickets', 'squares', 'lines', 'blackout', 'submitted_at'];

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  const text = await req.text();
  if (text.length > 20000) return json({ error: 'Too large' }, 413);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: 'Bad JSON' }, 400); }
  const data = {};
  for (const k of FIELDS) if (body?.[k] != null) data[k] = String(body[k]).slice(0, 200);
  // Never trust a time from the future: a card can't jump ahead of a real update.
  const now = new Date().toISOString();
  if (!data.submitted_at || Date.parse(data.submitted_at) > Date.now() + 60000) data.submitted_at = now;
  const result = await saveCard(data, now);
  return json(result, result.saved || result.reason === 'older' ? 200 : 400);
};

export const config = { path: '/api/card' };
