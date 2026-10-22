// Sending survey answers to Netlify Forms, and remembering on this device
// which surveys are done and the "About you" answers.
//
// If the phone is offline (hotel Wi-Fi drops), the answers wait in a queue
// on the device and are sent the next time the app is open and online.

const DONE_KEY = 'wvarf-synergy:surveys-done-v1';
const PROFILE_KEY = 'wvarf-synergy:survey-profile-v1';
const QUEUE_KEY = 'wvarf-synergy:survey-queue-v1';

// Netlify reads submissions posted to any static page; this one is written
// by the build (vite.config.js) and lists every field.
const ENDPOINT = '/__forms.html';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode / full */ }
}

export const loadDone = () => new Set(read(DONE_KEY, []));
export const saveDone = (set) => write(DONE_KEY, [...set]);
export const loadProfile = () => read(PROFILE_KEY, {});
export const saveProfile = (p) => write(PROFILE_KEY, p);

function encode(formName, data) {
  const body = new URLSearchParams();
  body.append('form-name', formName);
  for (const [k, v] of Object.entries(data)) {
    if (v == null || v === '') continue;
    body.append(k, Array.isArray(v) ? v.join(', ') : String(v));
  }
  return body.toString();
}

// Gives up after 15 seconds so a stalled request (seen in Firefox) never
// leaves a button stuck on "Sending…"; the caller then queues the answers
// and resends them later.
async function post(body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}

/** Sends now if possible; otherwise keeps it for later. Returns 'sent' or 'queued'. */
export async function submitSurvey(formName, data) {
  const body = encode(formName, { ...data, submitted_at: new Date().toISOString() });
  try {
    await post(body);
    return 'sent';
  } catch {
    write(QUEUE_KEY, [...read(QUEUE_KEY, []), body]);
    return 'queued';
  }
}

let flushing = false;
export async function flushQueue() {
  if (flushing) return;
  flushing = true;
  try {
    let queue = read(QUEUE_KEY, []);
    while (queue.length) {
      try { await post(queue[0]); } catch { break; }
      queue = queue.slice(1);
      write(QUEUE_KEY, queue);
    }
  } finally {
    flushing = false;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', flushQueue);
  setTimeout(flushQueue, 3000);
}
