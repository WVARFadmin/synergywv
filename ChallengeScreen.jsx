import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  PiggyBank, Phone, ArrowLeftRight, BadgeCheck, MessageCircle, Camera, Map as MapIcon,
  Hand, Heart, Check, Ticket, Trophy, Send, Clock, MapPin, RotateCcw, Upload,
} from 'lucide-react';
import {
  CHALLENGE, SQUARES, LINES, LINE_BONUS, BLACKOUT_BONUS, EXHIBITOR_CODES, normCode, score,
} from '../data/challenge.js';
import { SESSIONS } from '../data/conference.js';
import { hasSessionSurvey } from '../data/surveys.js';
import { loadProfile, saveProfile, submitSurvey } from '../data/surveyStore.js';
import { shrink, uploadPhoto } from '../data/photoUpload.js';
import { challengeRevealed, CHALLENGE_REVEAL } from '../data/challengeGate.js';

const ICONS = { piggy: PiggyBank, phone: Phone, swap: ArrowLeftRight, badge: BadgeCheck, chat: MessageCircle, camera: Camera, map: MapIcon, wave: Hand, heart: Heart };
const KEY = 'wvarf-synergy:challenge-v1';
const TALKS = SESSIONS.filter(hasSessionSurvey);

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* full or private mode */ }
}

// Each turned-in card also goes straight to the live leaderboard (/api/card).
// Netlify only updates the board from form submissions its spam filter lets
// through, and repeat cards from one person can be held back, which left a
// player's score stuck at their first turn-in. If this send fails (offline,
// or a drag-and-drop deploy with no functions), the latest card waits on the
// phone and is retried when the connection comes back.
const CARD_PENDING = 'wvarf-synergy:card-pending-v1';
async function sendCard(card) {
  try { localStorage.setItem(CARD_PENDING, JSON.stringify(card)); } catch { /* private mode */ }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch('/api/card', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card), signal: ctrl.signal,
    });
    // 404 means this deploy has no functions; nothing to retry.
    if (res.ok || res.status === 404) { try { localStorage.removeItem(CARD_PENDING); } catch { /* ignore */ } }
  } catch { /* keep it pending */ } finally { clearTimeout(timer); }
}
function retryCard() {
  let card = null;
  try { card = JSON.parse(localStorage.getItem(CARD_PENDING)); } catch { /* ignore */ }
  if (card) sendCard(card);
}
if (typeof window !== 'undefined') {
  window.addEventListener('online', retryCard);
  setTimeout(retryCard, 4000);
}

function Field({ f, value, onChange }) {
  const id = useId();
  return (
    <div className="ch-field">
      <label htmlFor={id}>{f.label}</label>
      {f.kind === 'session' ? (
        <select id={id} value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">Choose a session…</option>
          {TALKS.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
        </select>
      ) : f.long ? (
        <textarea id={id} rows={2} value={value || ''} onChange={e => onChange(e.target.value)} />
      ) : (
        <input id={id} type="text" value={value || ''} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

function SquarePanel({ sq, done, answers, setAnswer, photo, onPhoto, onRetry, player }) {
  const fileRef = useRef(null);
  const codeId = useId();
  const [share, setShare] = useState(photo?.share ?? false);
  const codeVal = answers[`${sq.id}_code`] || '';
  const codeWrong = sq.type === 'code' && normCode(codeVal).length >= normCode(EXHIBITOR_CODES[sq.code]).length && !done && normCode(codeVal) !== normCode(EXHIBITOR_CODES[sq.code]);
  return (
    <section className="ch-panel" aria-labelledby={`ch-${sq.id}`}>
      <h3 id={`ch-${sq.id}`}>{sq.title} {done && <span className="ch-done-pill"><Check aria-hidden="true" />Done</span>}</h3>
      <p className="ch-task">{sq.task}</p>

      {sq.type === 'code' && (
        <div className="ch-field">
          <label htmlFor={codeId}>Code word from the table</label>
          <input id={codeId} type="text" autoCapitalize="characters" autoComplete="off" value={codeVal}
            onChange={e => setAnswer(`${sq.id}_code`, e.target.value)} aria-invalid={codeWrong || undefined} />
          {codeWrong && <p className="ch-hint bad">That’s not the code. Ask at the table.</p>}
        </div>
      )}

      {sq.fields.map(f => <Field key={f.id} f={f} value={answers[f.id]} onChange={v => setAnswer(f.id, v)} />)}

      {sq.type === 'photo' && (
        <div className="ch-photo">
          {photo?.dataUrl && <img src={photo.dataUrl} alt={`Your ${sq.title} photo`} />}
          <label className="ch-check">
            <input type="checkbox" checked={share} onChange={e => setShare(e.target.checked)} />
            <span>WVARF may share this photo on social media</span>
          </label>
          <input ref={fileRef} type="file" accept="image/*" capture={sq.id === 'twin' ? 'user' : 'environment'} className="sr-only" id={`${sq.id}-file`}
            onChange={async e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onPhoto(sq, f, share); }} />
          <label htmlFor={`${sq.id}-file`} className="ch-btn">
            <Camera aria-hidden="true" />{photo ? 'Retake photo' : 'Take photo'}
          </label>
          {photo?.status === 'sending' && <p className="ch-hint">Uploading…</p>}
          {photo?.status === 'sent' && <p className="ch-hint good">Photo sent to WVARF. Thanks!</p>}
          {photo?.status === 'failed' && (
            <p className="ch-hint bad">The photo couldn’t upload (weak signal?). It still counts.{' '}
              <button type="button" className="link-btn" onClick={() => onRetry(sq, share)}><Upload aria-hidden="true" />Try again</button>
            </p>
          )}
          {!player.name && <p className="ch-hint">Add your name at the top so we know whose photo it is.</p>}
        </div>
      )}
    </section>
  );
}

function StaffDraw() {
  const [rows, setRows] = useState([]);
  const [winner, setWinner] = useState(null);
  const [msg, setMsg] = useState('');
  const parse = (text) => {
    const out = []; let row = [], f = '', q = false;
    text = text.replace(/^﻿/, '');
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); out.push(row); row = []; f = ''; }
      else f += c;
    }
    if (f || row.length) { row.push(f); out.push(row); }
    const head = out.shift() || [];
    return out.filter(r => r.some(Boolean)).map(r => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] || '').trim()])));
  };
  const onFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const all = parse(await file.text());
    if (!all.length || !('tickets' in all[0])) { setMsg('That file isn’t a challenge-entry export.'); return; }
    // One entry per person: the latest card they turned in.
    const by = new Map();
    for (const r of all) {
      const k = (r.email || r.name || '').toLowerCase().trim(); if (!k) continue;
      const prev = by.get(k);
      if (!prev || (r.submitted_at || r.created_at) > (prev.submitted_at || prev.created_at)) by.set(k, r);
    }
    const list = [...by.values()].map(r => ({ ...r, t: Math.max(0, parseInt(r.tickets, 10) || 0) })).sort((a, b) => b.t - a.t);
    setRows(list); setWinner(null); setMsg(`${list.length} players · ${list.reduce((a, r) => a + r.t, 0)} tickets`);
  };
  const draw = () => {
    const total = rows.reduce((a, r) => a + r.t, 0); if (!total) return;
    const rnd = new Uint32Array(1); crypto.getRandomValues(rnd);
    let n = rnd[0] % total;
    for (const r of rows) { if (n < r.t) { setWinner(r); return; } n -= r.t; }
  };
  return (
    <div className="ch-staff">
      <h3>Staff: draw the gift basket winner</h3>
      <ol>
        <li>In Netlify, open Forms → <b>challenge-entry</b> → Download as CSV.</li>
        <li>Load it here. Each person’s latest card counts once.</li>
        <li>Tap Draw. Each ticket is one chance, so more tickets means better odds.</li>
      </ol>
      <label className="ch-btn" htmlFor="ch-staff-file"><Upload aria-hidden="true" />Load challenge-entry CSV</label>
      <input id="ch-staff-file" type="file" accept=".csv,text/csv" className="sr-only" onChange={onFile} />
      {msg && <p className="ch-hint">{msg}</p>}
      {rows.length > 0 && (
        <>
          <button type="button" className="ch-btn gold" onClick={draw}><Trophy aria-hidden="true" />Draw winner</button>
          {winner && (
            <div className="ch-winner" role="status">
              <Trophy aria-hidden="true" />
              <span className="ch-winner-name">{winner.name || winner.email}</span>
              <span>{[winner.organization, `${winner.t} tickets`].filter(Boolean).join(' · ')}</span>
            </div>
          )}
          <div className="ch-table-wrap">
            <table className="ch-table">
              <thead><tr><th>Player</th><th>Squares</th><th>Lines</th><th>Tickets</th></tr></thead>
              <tbody>{rows.map((r, i) => (
                <tr key={i}><td>{r.name}<span className="meta">{r.organization}</span></td><td>{r.squares}</td><td>{r.lines}</td><td><b>{r.t}</b></td></tr>
              ))}</tbody>
            </table>
          </div>
          <p className="ch-hint">Photos are in Netlify → Forms → <b>challenge-photo</b>. Only share the ones marked share_ok = Yes.</p>
        </>
      )}
    </div>
  );
}

export const CHALLENGE_STAFF = new URLSearchParams(window.location.search).has('challenge-staff');

export function ChallengeScreen({ now }) {
  const [state, setState] = useState(() => {
    const s = load();
    const p = loadProfile();
    return {
      answers: s.answers || {}, photos: s.photos || {}, turnedIn: s.turnedIn || null,
      player: s.player || { name: p.name || '', organization: p.organization || '', email: p.email || '', my_badge: '' },
    };
  });
  const [open, setOpen] = useState(() => SQUARES.find((sq, i) => !score(state.answers, state.photos).done[i])?.id || SQUARES[0].id);
  const [sending, setSending] = useState(false);
  const panelRef = useRef(null);
  // Full-size photos stay in memory for upload and retry; only a small
  // preview is saved on the phone so the card never fills up storage.
  const fullPhotos = useRef({});
  useEffect(() => save(state), [state]);

  const sc = useMemo(() => score(state.answers, state.photos), [state.answers, state.photos]);
  const closed = now > Date.parse(CHALLENGE.closes);
  const live = now >= Date.parse(CHALLENGE.opens) && !closed;
  const setAnswer = (k, v) => setState(s => ({ ...s, answers: { ...s.answers, [k]: v } }));
  const setPlayer = (k, v) => setState(s => ({ ...s, player: { ...s.player, [k]: v } }));
  const setPhoto = (id, patch) => setState(s => ({ ...s, photos: { ...s.photos, [id]: { ...s.photos[id], ...patch } } }));

  const send = async (sq, dataUrl, share) => {
    setPhoto(sq.id, { status: 'sending', share });
    try {
      await uploadPhoto(dataUrl, { kind: 'challenge', square: sq.title, caption: state.answers[sq.fields[0]?.id] || '', share, ...state.player }, 'challenge-photo');
      setPhoto(sq.id, { status: 'sent' });
    } catch { setPhoto(sq.id, { status: 'failed' }); }
  };
  const onPhoto = async (sq, file, share) => {
    let full, thumb;
    try { full = await shrink(file); thumb = await shrink(file, 480, 0.7); } catch { return; }
    fullPhotos.current[sq.id] = full;
    setPhoto(sq.id, { dataUrl: thumb, share, status: 'sending' });
    send(sq, full, share);
  };

  const turnIn = async () => {
    if (!state.player.name.trim() || sending) return;
    setSending(true);
    saveProfile({ ...loadProfile(), name: state.player.name, organization: state.player.organization, email: state.player.email });
    const data = {
      ...state.player, ...state.answers,
      tickets: sc.tickets, squares: sc.squares, lines: sc.lines, blackout: sc.blackout ? 'Yes' : 'No',
      squares_done: SQUARES.filter((_, i) => sc.done[i]).map(q => q.title).join(', '),
      photos_sent: Object.values(state.photos).filter(p => p.status === 'sent').length,
    };
    const at = new Date().toISOString();
    const [result] = await Promise.all([
      submitSurvey('challenge-entry', data),
      sendCard({ name: data.name, email: data.email, organization: data.organization, tickets: data.tickets,
        squares: data.squares, lines: data.lines, blackout: data.blackout, submitted_at: at }),
    ]);
    setState(s => ({ ...s, turnedIn: { at: new Date().toISOString(), tickets: sc.tickets, result } }));
    setSending(false);
  };

  const sq = SQUARES.find(s => s.id === open);
  const pick = (id) => { setOpen(id); requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })); };
  const lineCells = new Set(LINES.filter(l => l.every(i => sc.done[i])).flat());
  const nameId = useId(), orgId = useId(), emailId = useId(), badgeId = useId();

  if (CHALLENGE_STAFF) return <div className="content ch-content"><StaffDraw /></div>;

  // Nothing about the card (squares, questions, leaderboard) shows until
  // 2 minutes before the start, except on a phone that opened the hidden
  // staff link (?challenge-preview).
  if (!challengeRevealed(now)) {
    return (
      <div className="content ch-content">
        <div className="ch-hero">
          <div className="ch-hero-text">
            <span className="ch-eyebrow">Thursday networking hour</span>
            <h2>{CHALLENGE.title}</h2>
            <ul className="ch-facts">
              <li><Clock aria-hidden="true" />{CHALLENGE.when}</li>
              <li><MapPin aria-hidden="true" />{CHALLENGE.where}</li>
            </ul>
          </div>
        </div>
        <div className="ch-how ch-locked">
          <p><b>Your card unlocks Thursday at 11:28 AM.</b> The squares are a surprise until then. Come back to this page when the Challenge starts, fill in squares to earn tickets for the {CHALLENGE.prize.toLowerCase()}, and turn in your card before 12:40 PM.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content ch-content">
      <div className="ch-hero">
        <div className="ch-hero-text">
          <span className="ch-eyebrow">{live ? 'Happening now' : now < CHALLENGE_REVEAL ? 'Staff preview · hidden from attendees until 11:28 AM' : 'Thursday networking hour'}</span>
          <h2>{CHALLENGE.title}</h2>
          <ul className="ch-facts">
            <li><Clock aria-hidden="true" />{CHALLENGE.when}</li>
            <li><MapPin aria-hidden="true" />{CHALLENGE.where}</li>
          </ul>
        </div>
        <div className="ch-tickets" aria-live="polite">
          <Ticket aria-hidden="true" />
          <span className="ch-tickets-n">{sc.tickets}</span>
          <span className="ch-tickets-l">raffle {sc.tickets === 1 ? 'ticket' : 'tickets'}</span>
        </div>
      </div>

      <div className="ch-how">
        <p><b>How to play:</b> tap a square, do the task in person, and fill it in. Every square is <b>1 ticket</b> for the {CHALLENGE.prize.toLowerCase()}. Finish a row, column or diagonal for <b>+{LINE_BONUS}</b>, or the whole card for <b>+{BLACKOUT_BONUS}</b>. Then tap <b>Turn in my card</b>. {CHALLENGE.drawing}</p>
      </div>

      <div className="ch-player">
        <div className="ch-field"><label htmlFor={nameId}>Your name (required to win)</label><input id={nameId} type="text" autoComplete="name" value={state.player.name} onChange={e => setPlayer('name', e.target.value)} /></div>
        <div className="ch-field"><label htmlFor={orgId}>Organization</label><input id={orgId} type="text" autoComplete="organization" value={state.player.organization} onChange={e => setPlayer('organization', e.target.value)} /></div>
        <div className="ch-field"><label htmlFor={emailId}>Email (so we can reach the winner)</label><input id={emailId} type="email" autoComplete="email" value={state.player.email} onChange={e => setPlayer('email', e.target.value)} /></div>
        <div className="ch-field"><label htmlFor={badgeId}>What does your funny badge say?</label><input id={badgeId} type="text" placeholder="e.g. I run with scissors" value={state.player.my_badge} onChange={e => setPlayer('my_badge', e.target.value)} /></div>
      </div>

      <ul className="ch-grid" aria-label="Challenge card">
        {SQUARES.map((s, i) => {
          const Ico = ICONS[s.icon] || BadgeCheck;
          const done = sc.done[i];
          return (
            <li key={s.id}><button type="button"
              className={`ch-sq${done ? ' done' : ''}${open === s.id ? ' open' : ''}${lineCells.has(i) ? ' line' : ''}${s.type === 'code' ? ' booth' : ''}`}
              aria-label={`${s.title}${done ? ', done' : ''}`} aria-pressed={open === s.id} onClick={() => pick(s.id)}>
              {done ? <Check className="ch-sq-ico" aria-hidden="true" /> : <Ico className="ch-sq-ico" aria-hidden="true" />}
              <span className="ch-sq-title">{s.title}</span>
            </button></li>
          );
        })}
      </ul>
      <p className="ch-progress">{sc.squares} of {SQUARES.length} squares · {sc.lines} {sc.lines === 1 ? 'line' : 'lines'}{sc.blackout ? ' · Full card!' : ''}</p>

      <div ref={panelRef}>
        {sq && (
          <SquarePanel key={sq.id} sq={sq} done={sc.done[SQUARES.indexOf(sq)]} answers={state.answers} setAnswer={setAnswer}
            photo={state.photos[sq.id]} onPhoto={onPhoto} onRetry={(s, share) => send(s, fullPhotos.current[s.id] || state.photos[s.id].dataUrl, share)} player={state.player} />
        )}
      </div>

      <div className="ch-turnin">
        {closed ? (
          <p className="ch-hint">The Challenge has closed. {state.turnedIn ? `You turned in ${state.turnedIn.tickets} tickets. Good luck!` : ''}</p>
        ) : (
          <>
            <button type="button" className="ch-btn gold big" onClick={turnIn} disabled={!state.player.name.trim() || sc.squares === 0 || sending}>
              <Send aria-hidden="true" />{sending ? 'Sending…' : state.turnedIn ? 'Update my card' : 'Turn in my card'}
            </button>
            {!state.player.name.trim() && <p className="ch-hint">Add your name above to turn in your card.</p>}
            {state.player.name.trim() && sc.squares === 0 && (
              <p className="ch-hint">Complete at least one square to turn in your card. Your ticket count goes up when a square is done.</p>
            )}
            {state.turnedIn && (
              <p className="ch-hint good">
                {state.turnedIn.result === 'queued'
                  ? 'Saved on your phone. It will send when you’re back online.'
                  : `Turned in with ${state.turnedIn.tickets} tickets. Do more squares and tap Update anytime before it closes.`}
              </p>
            )}
          </>
        )}
      </div>

      <details className="ch-rules">
        <summary>Rules</summary>
        <ul>
          <li>One card per person. Your latest turned-in card is the one that counts.</li>
          <li>Exhibitor squares need the code word from that table.</li>
          <li>Trades must be with people you didn’t come with, and from sessions you didn’t attend.</li>
          <li>Photos marked OK may be shared on WVARF’s social media.</li>
          <li>The gift basket winner is drawn at random from all tickets. Must be present or reachable by email.</li>
        </ul>
        <button type="button" className="link-btn" onClick={() => { if (window.confirm('Clear your card and start over?')) setState(s => ({ ...s, answers: {}, photos: {}, turnedIn: null })); }}>
          <RotateCcw aria-hidden="true" />Start over
        </button>
      </details>
    </div>
  );
}
