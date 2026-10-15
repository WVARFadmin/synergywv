// Local stand-in for Netlify: serves /site, runs the two functions against a
// local Blobs server, and turns POSTs to /__forms.html into the same
// submission-created event Netlify fires. For testing only.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { BlobsServer } from '@netlify/blobs/server';

const [, , blobsDir, port = '4190'] = process.argv;
const blobs = new BlobsServer({ directory: blobsDir, token: 't', port: 8972 });
await blobs.start();
process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({ edgeURL: 'http://localhost:8972', uncachedEdgeURL: 'http://localhost:8972', siteID: 's', token: 't' })).toString('base64');
const sub = (await import('./netlify/functions/submission-created.mjs')).default;
const lb = (await import('./netlify/functions/leaderboard.mjs')).default;
const photos = (await import('./netlify/functions/photos.mjs')).default;
const photo = (await import('./netlify/functions/photo.mjs')).default;
const draw = (await import('./netlify/functions/draw.mjs')).default;
const card = (await import('./netlify/functions/card.mjs')).default;
const players = (await import('./netlify/functions/players.mjs')).default;
const upload = (await import('./netlify/functions/upload.mjs')).default;
const uploads = new Map(); // stand-in for Netlify's file host
const ROOT = new URL('./site/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
export const log = [];

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname === '/__forms.html') {
    if (process.env.HANG_FORMS) { console.log('FORM (hanging on purpose)'); return; }
    const chunks = []; for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks);
    const ct = req.headers['content-type'] || '';
    let data = {};
    if (ct.includes('urlencoded')) data = Object.fromEntries(new URLSearchParams(raw.toString()));
    else {
      const fd = await new Response(raw, { headers: { 'content-type': ct } }).formData();
      for (const [k, v] of fd) {
        if (typeof v === 'string') { data[k] = v; continue; }
        const id = Math.random().toString(36).slice(2);
        uploads.set(id, { type: v.type, bytes: Buffer.from(await v.arrayBuffer()) });
        // Same shape Netlify sends for an uploaded file.
        data[k] = { filename: v.name, size: v.size, type: v.type, url: `http://localhost:${port}/__uploads/${id}` };
      }
    }
    console.log('FORM', data['form-name'], JSON.stringify(data).slice(0, 160));
    // SKIP_FORM_HOOK=1 imitates Netlify holding a submission back as spam.
    if (!process.env.SKIP_FORM_HOOK) await sub(new Request('http://x/', { method: 'POST', body: JSON.stringify({ payload: { form_name: data['form-name'], data, created_at: new Date().toISOString() } }) }));
    res.writeHead(200, { 'content-type': 'text/html' }); return res.end('ok');
  }
  if (url.pathname.startsWith('/__uploads/')) {
    const u = uploads.get(url.pathname.split('/').pop());
    if (!u) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': u.type }); return res.end(u.bytes);
  }
  if (url.pathname === '/api/photos' || url.pathname.startsWith('/api/photo/')) {
    const r = url.pathname === '/api/photos'
      ? await photos(new Request('http://x' + req.url, { headers: req.headers }))
      : await photo(new Request('http://x' + req.url, { method: req.method, headers: req.headers }), { params: { id: decodeURIComponent(url.pathname.split('/').pop()) } });
    res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(Buffer.from(await r.arrayBuffer()));
  }
  if (url.pathname === '/api/draw') {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await draw(new Request('http://x/api/draw', { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) }));
    res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(await r.text());
  }
  if (url.pathname === '/api/upload') {
    if (process.env.NO_UPLOAD_FN) { res.writeHead(404); return res.end('not found'); }
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await upload(new Request('http://x/api/upload', { method: req.method, headers: req.headers, body: Buffer.concat(chunks) }));
    res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(await r.text());
  }
  if (url.pathname === '/api/card' || url.pathname === '/api/players' || url.pathname.startsWith('/api/players/')) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = ['GET', 'HEAD', 'DELETE'].includes(req.method) ? undefined : Buffer.concat(chunks);
    const rq = new Request('http://x' + req.url, { method: req.method, headers: req.headers, body });
    const r = url.pathname === '/api/card' ? await card(rq)
      : await players(rq, { params: { id: url.pathname.startsWith('/api/players/') ? decodeURIComponent(url.pathname.split('/').pop()) : undefined } });
    res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(await r.text());
  }
  if (url.pathname === '/api/leaderboard') {
    const r = await lb();
    res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(await r.text());
  }
  let p = url.pathname === '/' ? '/index.html' : url.pathname === '/leaderboard' ? '/leaderboard.html' : url.pathname === '/photos' ? '/photos.html' : url.pathname === '/players' ? '/players.html' : url.pathname;
  const file = normalize(join(ROOT, p));
  try {
    if (!file.startsWith(ROOT) || !(await stat(file)).isFile()) throw 0;
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('not found'); }
}).listen(+port, () => console.log('dev server on', port));
