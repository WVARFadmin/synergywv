// Photo uploads for the Challenge squares and the "Share photos" page.
//
// Photos go straight to the site's own photo storage through /api/upload
// (a Netlify Function), which shows them on the staff page at /photos.
// Netlify Forms can hold back repeat submissions as spam, so the function is
// the main route. If the function isn't there (a drag-and-drop deploy), the
// photo is posted to Netlify Forms instead, as before.

// Phone photos are several MB; shrink to 1600px JPEG before uploading.
export async function shrink(file, max = 1600, q = 0.82) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', q);
  } finally { URL.revokeObjectURL(url); }
}

async function post(url, body, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { method: 'POST', body, signal: ctrl.signal }); }
  finally { clearTimeout(timer); }
}

/**
 * fields: { kind: 'challenge' | 'conference', name, email, square, caption,
 *           share (bool), release (bool) }
 * formName: the Netlify Forms fallback ('challenge-photo' or 'conference-photo').
 */
export async function uploadPhoto(dataUrl, fields, formName) {
  const blob = await (await fetch(dataUrl)).blob();
  const fd = new FormData();
  fd.append('kind', fields.kind);
  fd.append('name', fields.name || '');
  fd.append('email', fields.email || '');
  fd.append('square', fields.square || '');
  fd.append('caption', fields.caption || '');
  fd.append('share_ok', fields.share ? 'Yes' : 'No');
  if (fields.kind === 'conference') fd.append('release', fields.release ? 'Yes' : 'No');
  const file = `${(fields.square || 'photo').replace(/[^\w-]+/g, '-')}-${Date.now()}.jpg`;
  fd.append('photo', blob, file);

  // 45 seconds: photos are bigger than a form, and hotel Wi-Fi is slow.
  const res = await post('/api/upload', fd, 45000);
  if (res.ok) return 'sent';
  if (res.status !== 404) throw new Error(String(res.status));

  // No functions on this deploy: fall back to Netlify Forms.
  const ff = new FormData();
  ff.append('form-name', formName);
  for (const [k, v] of fd) if (k !== 'kind') ff.append(k, v);
  const res2 = await post('/__forms.html', ff, 45000);
  if (!res2.ok) throw new Error(String(res2.status));
  return 'sent';
}
