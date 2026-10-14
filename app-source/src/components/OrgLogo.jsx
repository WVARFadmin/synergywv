import { useState } from 'react';

// Logos that have loaded once this visit. A remounted logo (e.g. People after
// Back from a session) starts visible, so the page does not grow a frame
// later and push the restored scroll position off.
const loaded = new Set();

// Renders an org logo, showing `fallback` until the file has actually loaded.
// A missing or misnamed file therefore never produces a broken-image icon —
// logos can be dropped into public/logos/ later with no code change.
export function OrgLogo({ org, className, fallback = null }) {
  const [status, setStatus] = useState(() => (loaded.has(org?.logo) ? 'ok' : 'loading'));
  if (!org?.logo) return fallback;
  return (
    <>
      {status !== 'ok' && fallback}
      <img
        key={org.logo}
        src={org.logo}
        alt={org.name}
        className={className}
        style={{ display: status === 'ok' ? 'block' : 'none' }}
        onLoad={() => { loaded.add(org.logo); setStatus('ok'); }}
        onError={() => setStatus('error')}
      />
    </>
  );
}
