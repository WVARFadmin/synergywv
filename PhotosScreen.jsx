import { useEffect, useId, useRef, useState } from 'react';
import { Camera, ImagePlus, Check, Upload, ShieldCheck } from 'lucide-react';
import { loadProfile, saveProfile } from '../data/surveyStore.js';
import { shrink, uploadPhoto } from '../data/photoUpload.js';

// "Share photos": attendees send conference photos to WVARF. Opened from the
// camera button at the top left on phones (and "Photos" in the sidebar on
// computers). Nothing uploads until the person agrees to the photo release.
// Photos land on the staff page at /photos, marked "Conference" and with the
// release recorded.

// WVARF: have this wording reviewed before the conference if you like; it is
// sent with every photo so staff can see what was agreed to.
export const PHOTO_RELEASE = [
  'I took this photo or have the right to share it, and the people in it agreed to be photographed and to have the photo shared.',
  'I give WVARF permission to use it, without payment, on its website, social media, newsletters and other materials about the conference and the State Use Program, with or without a photo credit.',
  'I won’t share photos of children without a parent’s or guardian’s permission.',
];

const KEY = 'wvarf-synergy:photos-sent-v1';
const KEEP = 12; // previews kept on the phone

function loadSent() {
  // A photo still "Uploading…" when the app was closed never finished.
  try { return (JSON.parse(localStorage.getItem(KEY)) || []).map(x => (x.status === 'sending' ? { ...x, status: 'failed' } : x)); } catch { return []; }
}

export function PhotosScreen() {
  const [profile] = useState(loadProfile);
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [caption, setCaption] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [items, setItems] = useState(loadSent);
  const full = useRef({}); // full-size photos, in memory only, for "Try again"
  const nameId = useId(), emailId = useId(), capId = useId(), agreeId = useId();

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, KEEP))); } catch { /* storage full */ }
  }, [items]);

  const ready = name.trim().length > 1 && agreed;
  const patch = (id, p) => setItems(list => list.map(x => (x.id === id ? { ...x, ...p } : x)));

  const send = async (item, dataUrl) => {
    patch(item.id, { status: 'sending' });
    try {
      await uploadPhoto(dataUrl, {
        kind: 'conference', square: 'Conference photo', name: item.name, email: item.email,
        caption: item.caption, share: true, release: true,
      }, 'conference-photo');
      patch(item.id, { status: 'sent' });
    } catch {
      patch(item.id, { status: 'failed' });
    }
  };

  const onFiles = async (files) => {
    if (!ready || !files?.length) return;
    saveProfile({ ...loadProfile(), name: name.trim(), email: email.trim() });
    for (const file of [...files].slice(0, 10)) {
      let big, thumb;
      try { big = await shrink(file); thumb = await shrink(file, 360, 0.7); } catch { continue; }
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        thumb, caption: caption.trim(), name: name.trim(), email: email.trim(),
        at: new Date().toISOString(), status: 'sending',
      };
      full.current[item.id] = big;
      setItems(list => [item, ...list]);
      send(item, big);
    }
    setCaption('');
  };

  return (
    <div className="content ph-content">
      <div className="sv-hero">
        <Camera aria-hidden="true" />
        <div>
          <h2>Share your conference photos</h2>
          <p>Snap a moment from Statewide Synergy and send it to WVARF. Your photos may show up on our social media and in next year’s materials.</p>
        </div>
      </div>

      <div className="ph-form">
        <div className="ch-field">
          <label htmlFor={nameId}>Your name (required)</label>
          <input id={nameId} type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="ch-field">
          <label htmlFor={emailId}>Email (optional)</label>
          <input id={emailId} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="ch-field ph-wide">
          <label htmlFor={capId}>Caption or who’s in it (optional)</label>
          <input id={capId} type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Track B team at the Kanawha Room" />
        </div>
      </div>

      <section className="ph-release" aria-labelledby="ph-release-h">
        <h3 id="ph-release-h"><ShieldCheck aria-hidden="true" />Photo release</h3>
        <ul>{PHOTO_RELEASE.map(t => <li key={t.slice(0, 20)}>{t}</li>)}</ul>
        <label className="ph-agree" htmlFor={agreeId}>
          <input id={agreeId} type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
          <span>I agree to the photo release for every photo I share.</span>
        </label>
      </section>

      <div className="ph-actions">
        <input type="file" accept="image/*" capture="environment" className="sr-only" id="ph-take" disabled={!ready}
          onChange={e => { const f = e.target.files; onFiles(f); e.target.value = ''; }} />
        <label htmlFor="ph-take" className={`ch-btn gold big${ready ? '' : ' disabled'}`} aria-disabled={!ready}>
          <Camera aria-hidden="true" />Take photo
        </label>
        <input type="file" accept="image/*" multiple className="sr-only" id="ph-pick" disabled={!ready}
          onChange={e => { const f = e.target.files; onFiles(f); e.target.value = ''; }} />
        <label htmlFor="ph-pick" className={`ch-btn big${ready ? '' : ' disabled'}`} aria-disabled={!ready}>
          <ImagePlus aria-hidden="true" />Upload from my phone
        </label>
      </div>
      {!ready && (
        <p className="ch-hint">
          {name.trim().length > 1 ? 'Check the box to agree to the photo release.' : 'Add your name and agree to the photo release to share photos.'}
        </p>
      )}

      {items.length > 0 && (
        <section aria-labelledby="ph-mine-h">
          <h3 className="sv-list-head" id="ph-mine-h">Photos you’ve shared</h3>
          <ul className="ph-mine">
            {items.map(it => (
              <li key={it.id}>
                <img src={it.thumb} alt={it.caption ? `Your photo: ${it.caption}` : 'Your photo'} />
                <span className={`ph-status ${it.status}`} aria-live="polite">
                  {it.status === 'sent' && <><Check aria-hidden="true" />Sent</>}
                  {it.status === 'sending' && 'Uploading…'}
                  {it.status === 'failed' && (full.current[it.id]
                    ? <button type="button" className="link-btn" onClick={() => send(it, full.current[it.id])}><Upload aria-hidden="true" />Try again</button>
                    : 'Didn’t send. Please share it again.')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
