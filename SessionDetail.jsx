import { CheckCircle2, ChevronDown, ChevronLeft, MapPin, MessageSquareText } from 'lucide-react';
import { planRoomFor } from '../data/rooms.js';
import { Avatar } from '../components/Avatar.jsx';
import { DAYS, PEOPLE, RESTRICTED_TAGS, displayTags } from '../data/conference.js';
import { materialsFor } from '../data/materials.js';
import { hasSessionSurvey } from '../data/surveys.js';
import { MaterialLinks } from './MaterialsScreen.jsx';

// Paragraphs, or { list: [...] } for a bulleted list. Older entries are a
// plain string.
function RichText({ value }) {
  const items = Array.isArray(value) ? value : [value];
  return items.map((item, i) => typeof item === 'string'
    ? <p key={i}>{item}</p>
    : <ul key={i}>{item.list.map(li => <li key={li}>{li}</li>)}</ul>);
}

// Speakers with a bio, in the order the speaker line names them, then any
// panelists the line only calls "Panel".
function speakersWithBios(session) {
  const line = session.speaker || '';
  const named = PEOPLE.filter(p => p.speaker && line.includes(p.name))
    .sort((a, b) => line.indexOf(a.name) - line.indexOf(b.name));
  const panel = (session.panel || []).map(id => PEOPLE.find(p => p.id === id)).filter(Boolean);
  return [...named, ...panel.filter(p => !named.includes(p))];
}

export function SessionDetail({ session, onBack, onToggleStar, onShowOnMap, survey, onOpenChallenge }) {
  const dayInfo = DAYS.find(d => d.id === session.day);
  const accessPills = (session.access || []).filter(a => a !== 'wheelchair');
  const bios = speakersWithBios(session);
  const onPlan = planRoomFor(session.room);

  return (
    <>
      <div className="detail-hero">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="time-lg">
          {[dayInfo?.date, session.time, session.dur].filter(Boolean).join(' · ')}
        </div>
        <h2>{session.title}</h2>
        <div className="pills">
          {session.live && <span className="pill live">Happening now</span>}
          {displayTags(session.tags).map(t => (
            <span key={t} className={`pill ${RESTRICTED_TAGS.has(t) ? 'exec' : 'gold'}`}>{t}</span>
          ))}
          {accessPills.map(a => <span key={a} className="pill cart">{a}</span>)}
        </div>
      </div>

      <div className="detail-section">
        <h4>Where</h4>
        <p>{session.room || <span className="tba">Room confirmed on site — check the printed programme or ask at the registration desk.</span>}</p>
        {onPlan && (
          <>
            <p className="where-level">{onPlan.levelLabel}{onPlan.room !== session.room ? ` · ${onPlan.room}` : ''}</p>
            {onShowOnMap && (
              <button type="button" className="show-on-map" onClick={() => onShowOnMap(onPlan.room)}>
                <MapPin aria-hidden="true" />
                Show on map
              </button>
            )}
          </>
        )}
      </div>

      {session.speaker && (
        <div className="detail-section">
          <h4>Speakers</h4>
          <p>{session.speaker}</p>
        </div>
      )}

      {session.id === 't4' && onOpenChallenge && (
        <div className="detail-section">
          <h4>Play</h4>
          <button type="button" className="sv-detail-btn" onClick={onOpenChallenge}>Open my Challenge card</button>
        </div>
      )}

      {hasSessionSurvey(session) && (
        <div className="detail-section">
          <h4>Materials</h4>
          {materialsFor(session.id).length
            ? <MaterialLinks items={materialsFor(session.id)} />
            : <p className="mat-none">This session’s materials will be posted here as PDFs when they’re shared.</p>}
        </div>
      )}

      {session.desc && (
        <div className="detail-section detail-desc">
          <h4>About this session</h4>
          <RichText value={session.desc} />
        </div>
      )}

      {bios.length > 0 && (
        <div className="detail-section">
          <h4>{bios.length === 1 ? 'About the speaker' : 'About the speakers'}</h4>
          {/* Native disclosure: keyboard and screen-reader support built in,
              and long panels stay short until someone opens a bio. */}
          {bios.map(person => person.bio ? (
            <details key={person.id} className="speaker-bio">
              <summary>
                <Avatar person={person} size="md" ring eager />
                <span className="sb-who">
                  <span className="sb-name">{person.name}</span>
                  {(person.role || person.org) && (
                    <span className="sb-org">{[person.role, person.org].filter(Boolean).join(', ')}</span>
                  )}
                </span>
                <ChevronDown className="caret" aria-hidden="true" />
              </summary>
              <div className="sb-body"><RichText value={person.bio} /></div>
            </details>
          ) : (
            // No bio on file: name and organization only, nothing to expand.
            <div key={person.id} className="speaker-bio no-bio">
              <div className="sb-summary">
                <Avatar person={person} size="md" ring eager />
                <span className="sb-who">
                  <span className="sb-name">{person.name}</span>
                  {(person.role || person.org) && (
                    <span className="sb-org">{[person.role, person.org].filter(Boolean).join(', ')}</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Only shown when a session carries real accessibility data — no
          blanket claim stands in for it. */}
      {session.access?.length > 0 && (
        <div className="detail-section">
          <h4>Accessibility</h4>
          <p>{session.access.join(' · ')}</p>
        </div>
      )}

      {survey && (
        <div className="detail-section sv-detail">
          <h4>Session feedback</h4>
          {survey.done ? (
            <p className="sv-detail-done"><CheckCircle2 aria-hidden="true" />Thanks — your feedback was sent.</p>
          ) : survey.open ? (
            <button type="button" className="sv-detail-btn" onClick={survey.onOpen}>
              <MessageSquareText aria-hidden="true" />Rate this session
            </button>
          ) : (
            <p className="sv-detail-later">The survey opens when the session starts at {session.time}.</p>
          )}
        </div>
      )}

      <div className="save-btn-wrap">
        <button
          className={`save-btn ${session.starred ? 'saved' : 'unsaved'}`}
          onClick={() => onToggleStar(session.id)}
        >
          {session.starred ? '★ Saved to my schedule' : '☆ Save to my schedule'}
        </button>
      </div>
    </>
  );
}
