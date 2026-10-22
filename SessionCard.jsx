import { RESTRICTED_TAGS, displayTags } from '../data/conference.js';
import { hasMaterials } from '../data/materials.js';
export function SessionCard({ session, onOpen, onToggleStar }) {
  const accessPills = (session.access || []).filter(a => a !== 'wheelchair');
  return (
    <div className="session" onClick={() => onOpen(session)}>
      <div className="time-col">
        <div className="time">{session.time}</div>
        <div className="dur">{session.dur}</div>
      </div>
      <div className="body">
        <h4>{session.title}</h4>
        {/* Join only the parts that exist, or an empty room leaves a
            stray separator dot floating at the start of the line. */}
        {[session.room, session.speaker].filter(Boolean).length > 0 && (
          <div className="meta">
            {[session.room, session.speaker].filter(Boolean).join(' · ')}
          </div>
        )}
        <div className="pills">
          {session.live && <span className="pill live">Now</span>}
          {displayTags(session.tags).map(t => (
            <span key={t} className={`pill ${RESTRICTED_TAGS.has(t) ? 'exec' : t === 'Tracks A & B' ? 'track track-ab' : /^Track /.test(t) ? `track track-${t.slice(-1).toLowerCase()}` : 'tag'}`}>{t}</span>
          ))}
          {accessPills.map(a => <span key={a} className="pill cart">{a}</span>)}
          {hasMaterials(session.id) && <span className="pill mat-pill">Materials</span>}
        </div>
      </div>
      <button
        className={`star-btn ${session.starred ? 'saved' : ''}`}
        aria-label={session.starred ? 'Remove from schedule' : 'Save to schedule'}
        onClick={(e) => { e.stopPropagation(); onToggleStar(session.id); }}
      >
        {session.starred ? '★' : '☆'}
      </button>
    </div>
  );
}
