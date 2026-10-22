import { CHALLENGE } from './challenge.js';

// The Challenge card (squares, questions, code-word boxes) stays hidden until
// 2 minutes before the Challenge starts, so nobody can work on it early.
// Thursday 11:28 AM Eastern.
export const REVEAL_LEAD_MS = 2 * 60 * 1000;
export const CHALLENGE_REVEAL = Date.parse(CHALLENGE.opens) - REVEAL_LEAD_MS;

// Hidden staff link: open the app with ?challenge-preview to see the card
// any time. The phone remembers it, so staff can keep testing after that.
// ?challenge-preview=off turns it back off. ?challenge-staff (the drawing
// page) counts too.
const KEY = 'wvarf-synergy:challenge-preview';
function readPreview() {
  const q = new URLSearchParams(window.location.search);
  try {
    if (q.get('challenge-preview') === 'off') { localStorage.removeItem(KEY); return false; }
    if (q.has('challenge-preview')) { localStorage.setItem(KEY, '1'); return true; }
    if (q.has('challenge-staff')) return true;
    return localStorage.getItem(KEY) === '1';
  } catch {
    return q.has('challenge-preview') || q.has('challenge-staff');
  }
}
export const CHALLENGE_PREVIEW = readPreview();

export function challengeRevealed(now = Date.now()) {
  return CHALLENGE_PREVIEW || now >= CHALLENGE_REVEAL;
}
