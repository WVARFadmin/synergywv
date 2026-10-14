/*
 * Synergy Connections Challenge — live leaderboard for the in-app
 * Challenge screen. Added alongside the compiled app (no source changes):
 * it watches for the Challenge screen, adds a leaderboard panel at the
 * bottom, and polls /api/leaderboard while that screen is open.
 *
 * If the leaderboard function isn't deployed (e.g. a drag-and-drop
 * deploy), the panel never appears and the app behaves as before.
 */
(() => {
  'use strict';
  const API = '/api/leaderboard';
  const STATE_KEY = 'wvarf-synergy:challenge-v1'; // the app's own card storage
  const POLL_MS = 15000;
  const TOP = 10;

  let data = null;          // last good response
  let error = false;        // last fetch failed (network)
  let disabled = false;     // function missing — stay out of the way
  let myKey = null;
  let myId = null;
  let timer = null;
  let lastLocal = null;
  let posting = false;

  const readState = () => {
    try { return JSON.parse(localStorage.getItem(STATE_KEY)) || {}; } catch { return {}; }
  };

  // Must match playerId() in netlify/lib/challenge.mjs.
  const normKey = (email, name) => {
    const e = String(email || '').trim().toLowerCase();
    return e || String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  };
  async function sha16(s) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }
  async function refreshMe() {
    const p = readState().player || {};
    const k = normKey(p.email, p.name);
    if (k === myKey) return;
    myKey = k;
    try { myId = k && window.crypto?.subtle ? await sha16(k) : null; } catch { myId = null; }
  }

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const timeFmt = iso => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  const host = () => {
    const c = document.querySelector('.ch-content');
    // Staff view (?challenge-staff) has its own tools; leave it alone.
    return c && !c.querySelector('.ch-staff') ? c : null;
  };
  const localTickets = () => {
    const n = parseInt(document.querySelector('.ch-tickets-n')?.textContent, 10);
    return Number.isFinite(n) ? n : null;
  };
  const turnInButton = () => {
    const btns = [...document.querySelectorAll('.ch-content button.ch-btn')];
    return btns.find(b => /turn in my card|update my card/i.test(b.textContent || '')) || null;
  };

  async function load() {
    if (disabled) return;
    try {
      const res = await fetch(API, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const type = res.headers.get('content-type') || '';
      if (res.status === 404 || !type.includes('json')) { disabled = true; stop(); document.getElementById('ch-live')?.remove(); document.getElementById('ch-live-mini')?.remove(); return; }
      if (!res.ok) throw new Error(String(res.status));
      data = await res.json();
      error = false;
    } catch {
      error = true;
    }
    await refreshMe();
    render();
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (!host()) { timer = null; return; }
      if (document.visibilityState === 'visible') await load();
      schedule();
    }, POLL_MS);
  }
  function stop() { clearTimeout(timer); timer = null; }

  function nudgeHtml(meRow) {
    const local = localTickets();
    const st = readState();
    const btn = turnInButton();
    if (posting) return `<p class="ch-live-nudge">Sending your card… the board can take up to a minute to catch up.</p>`;
    if (!local) return '';
    if (!st.turnedIn) {
      return `<div class="ch-live-nudge"><p>You have ${plural(local, 'ticket')}. Turn in your card to get on the board.</p>
        ${btn ? '<button type="button" class="ch-btn" data-live="goto">Go to Turn in my card</button>' : ''}</div>`;
    }
    const posted = meRow ? meRow.tickets : st.turnedIn.tickets;
    if (local > (posted || 0) && btn && !btn.disabled) {
      return `<div class="ch-live-nudge"><p>Your card has ${plural(local, 'ticket')}; the board shows ${posted || 0}.</p>
        <button type="button" class="ch-btn gold" data-live="update">Update my score</button></div>`;
    }
    return '';
  }

  // Compact strip near the top of the Challenge screen: top 3 and your rank,
  // with a link down to the full board (which sits below the card).
  function renderMini(rows, meRow) {
    const mini = document.getElementById('ch-live-mini');
    if (!mini) return;
    let body;
    if (!data) body = `<span class="ch-mini-empty">${error ? 'Leaderboard offline' : 'Loading leaderboard…'}</span>`;
    else if (!rows.length) body = '<span class="ch-mini-empty">No cards turned in yet. Be first!</span>';
    else body = `<ol class="ch-mini-top">${rows.slice(0, 3).map(r => `<li${r.id === myId ? ' class="is-me"' : ''}><span class="ch-mini-rank">${r.rank}</span> ${esc(r.name)} <b>${r.tickets}</b></li>`).join('')}</ol>`;
    mini.innerHTML = `
      <div class="ch-mini-head">
        <span class="ch-mini-title"><span class="ch-mini-dot" aria-hidden="true"></span>Live leaderboard${data?.testMode ? ' <span class="ch-mini-test">Test</span>' : ''}</span>
        <a href="#ch-live" class="ch-mini-link" data-live="jump">${meRow ? `You’re #${meRow.rank} · ` : ''}See all</a>
      </div>
      ${data?.winner ? `<p class="ch-mini-winner">Winner: <b>${esc(data.winner.name)}</b></p>` : ''}
      ${body}`;
  }

  function render() {
    const el = document.getElementById('ch-live');
    if (!el) return;
    lastLocal = localTickets();
    const rows = data?.rows || [];
    const meRow = myId ? rows.find(r => r.id === myId) : null;
    renderMini(rows, meRow);
    let body;
    if (!data && error) {
      body = `<p class="ch-live-empty">The leaderboard can’t load right now. Your card is still saved on your phone.</p>`;
    } else if (!data) {
      body = `<p class="ch-live-empty">Loading…</p>`;
    } else if (!rows.length) {
      body = `<p class="ch-live-empty">No cards turned in yet. Fill a square and tap <b>Turn in my card</b> to be first on the board.</p>`;
    } else {
      body = `<ol class="ch-live-list">${rows.slice(0, TOP).map(r => `
        <li class="${r.id === myId ? 'is-me' : ''}${r.rank <= 3 ? ` top top-${r.rank}` : ''}">
          <span class="ch-live-rank" aria-label="Rank ${r.rank}">${r.rank}</span>
          <span class="ch-live-who"><b>${esc(r.name)}${r.id === myId ? ' <span class="ch-live-you-tag">You</span>' : ''}</b>${r.org ? `<span>${esc(r.org)}</span>` : ''}</span>
          <span class="ch-live-tix"><b>${r.tickets}</b> ${r.tickets === 1 ? 'ticket' : 'tickets'}</span>
        </li>`).join('')}</ol>
        ${meRow && meRow.rank > TOP ? `<p class="ch-live-me">You’re #${meRow.rank} with ${plural(meRow.tickets, 'ticket')}.</p>` : ''}`;
    }
    const meta = data
      ? `${plural(data.players, 'player')} · ${plural(data.tickets, 'ticket')} in the drawing · updated ${timeFmt(data.updated)}${error ? ' (reconnecting…)' : ''}`
      : '';
    el.innerHTML = `
      <div class="ch-live-head">
        <h3 id="ch-live-h">Live leaderboard</h3>
        <span class="ch-live-badge${error ? ' is-off' : ''}"><span aria-hidden="true"></span>${error ? 'Offline' : 'Live'}</span>
      </div>
      <p class="ch-live-meta" aria-live="polite">${meta}</p>
      ${data?.winner ? `<p class="ch-live-winner"><span>${data.winner.test ? 'Test drawing winner' : 'Gift basket winner'}</span><b>${esc(data.winner.name)}</b>${data.winner.org ? esc(data.winner.org) : ''}</p>` : ''}
      ${data?.testMode ? '<p class="ch-live-test">Test mode: these are test cards. The board clears itself on the morning of Oct 22.</p>' : ''}
      ${nudgeHtml(meRow)}
      ${body}
      <p class="ch-live-note">Shows first name and last initial. Your score updates each time you tap Turn in or Update my card. More tickets means better odds in the drawing.</p>`;
  }

  function mount() {
    if (disabled) return;
    const c = host();
    if (!c) { stop(); return; }
    let mini = document.getElementById('ch-live-mini');
    if (!mini || !c.contains(mini)) {
      mini?.remove();
      mini = document.createElement('section');
      mini.id = 'ch-live-mini';
      mini.className = 'ch-live-mini';
      mini.setAttribute('aria-label', 'Leaderboard summary');
      const anchor = c.querySelector(':scope > .ch-how') || c.querySelector(':scope > .ch-hero');
      if (anchor) anchor.after(mini); else c.prepend(mini);
      if (document.getElementById('ch-live')) render();
    }
    let el = document.getElementById('ch-live');
    if (!el || !c.contains(el)) {
      el?.remove();
      el = document.createElement('section');
      el.id = 'ch-live';
      el.className = 'ch-live';
      el.setAttribute('aria-labelledby', 'ch-live-h');
      c.appendChild(el);
      render();
      load();
      schedule();
      return;
    }
    // Keep the "update my score" prompt in step with the card as squares fill.
    if (localTickets() !== lastLocal) render();
    if (!timer) schedule();
  }

  // Refresh soon after any turn-in, so people see themselves land on the board.
  const refreshSoon = () => { setTimeout(load, 3000); setTimeout(load, 12000); };

  document.addEventListener('click', e => {
    const appBtn = e.target.closest?.('.ch-content button.ch-btn');
    if (appBtn && appBtn === turnInButton() && !e.target.closest('#ch-live')) { refreshSoon(); return; }
    const jump = e.target.closest?.('#ch-live-mini [data-live="jump"]');
    if (jump) {
      e.preventDefault();
      const full = document.getElementById('ch-live');
      full?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      full?.setAttribute('tabindex', '-1');
      full?.focus({ preventScroll: true });
      return;
    }
    const b = e.target.closest?.('#ch-live [data-live]');
    if (!b) return;
    const btn = turnInButton();
    if (!btn) return;
    if (b.dataset.live === 'goto') {
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.focus({ preventScroll: true });
      return;
    }
    if (b.dataset.live === 'update' && !btn.disabled) {
      posting = true;
      render();
      btn.click(); // caught by this same listener, which schedules the refresh
      setTimeout(() => { posting = false; render(); }, 12500);
    }
  }, true); // capture phase: read the button before React relabels it "Sending…"
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && host()) load(); });

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; mount(); }, 50);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  mount();
})();
