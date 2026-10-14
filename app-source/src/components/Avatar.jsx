import { useState } from 'react';

// A person's headshot, or their initials. Headshots come from the event
// page's CDN; the initials sit underneath, so a lazy, slow or failed image
// never leaves an empty circle — it just uncovers the initials.
//
// size: 'sm' 44px (attendees, list rows), 'md' 60px (speakers in the
// directory), 'lg' 112px (an open speaker card), 'xl' 88px (Home strip).
// ring: the gold speaker ring.
//
// Photos are cropped to the face: the frame is aimed near the top of the
// picture (where heads sit in most headshots) and zoomed in, so a tall
// "body shot" still shows a face in the circle. A person can override this
// with `photoPos: { x, y, zoom }` in conference.js:
//   x     0–100, left to right: where the face is across the photo
//   y     0–100, top to bottom: how far down to aim (raise it if the top
//         of the head is showing too much empty space)
//   zoom  how far to zoom in, 1 = none (raise it for a full-body photo)
const DEFAULT_POS = { x: 50, y: 10, zoom: 1.35 };
export function Avatar({ person, size = 'sm', ring = false, eager = false }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = person.photo && !failed;
  return (
    <span
      className={`ava ava-${size} ${person.color}${showPhoto ? ' has-photo' : ''}${ring ? ' ava-ring' : ''}`}
      aria-hidden="true"
    >
      {person.initials}
      {showPhoto && (
        <img
          src={person.photo} alt="" loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)}
          style={(() => {
            const p = { ...DEFAULT_POS, ...person.photoPos };
            return { objectPosition: `${p.x}% ${p.y}%`, transformOrigin: `${p.x}% ${Math.max(0, p.y - 10)}%`, transform: `scale(${p.zoom})` };
          })()}
        />
      )}
    </span>
  );
}
