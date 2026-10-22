import { Download, ExternalLink, FileText } from 'lucide-react';
import { DAYS } from '../data/conference.js';
import { MATERIALS, materialsFor } from '../data/materials.js';
import { hasSessionSurvey } from '../data/surveys.js';

// One download row. PDFs open in the browser; the PowerPoint, when there is
// one, downloads.
export function MaterialLinks({ items }) {
  return (
    <ul className="mat-list">
      {items.map(m => (
        <li key={m.file || m.url} className="mat-item">
          <span className="mat-ico" aria-hidden="true"><FileText /></span>
          <span className="mat-text">
            <span className="mat-title">{m.title}</span>
            <span className="mat-meta">{[m.kind, m.size].filter(Boolean).join(' · ')}</span>
          </span>
          <span className="mat-actions">
            {m.url ? (
              <a className="mat-btn" href={m.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink aria-hidden="true" />Open<span className="sr-only"> {m.title}, opens in a new tab</span>
              </a>
            ) : (
              <a className="mat-btn" href={m.file} target="_blank" rel="noopener noreferrer" download>
                <Download aria-hidden="true" />Download<span className="sr-only"> {m.title}</span>
              </a>
            )}
            {m.original && (
              <a className="mat-btn alt" href={m.original} download>
                PowerPoint<span className="sr-only"> version of {m.title}</span>
              </a>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function MaterialsScreen({ sessions, onOpenSession }) {
  const withTalks = sessions.filter(hasSessionSurvey);
  const posted = MATERIALS.length;
  return (
    <div className="content mat-content">
      <div className="sv-hero">
        <FileText aria-hidden="true" />
        <div>
          <h2>Materials</h2>
          <p>Presentations, handouts and resources from each session, as PDFs. Tap Open to view or save one. More are added as presenters share them, so check back after each session.</p>
        </div>
      </div>
      {posted === 0 && (
        <p className="mat-empty">No materials are posted yet. They’ll appear under each session below as presenters send them in.</p>
      )}
      {DAYS.map(d => {
        const list = withTalks.filter(s => s.day === d.id);
        if (!list.length) return null;
        return (
          <section key={d.id}>
            <h3 className="sv-list-head">{d.full}</h3>
            <ul className="mat-sessions">
              {list.map(s => {
                const items = materialsFor(s.id);
                return (
                  <li key={s.id} className="mat-session">
                    <button type="button" className="mat-session-head" onClick={() => onOpenSession(s)}>
                      <span className="mat-session-title">{s.title}</span>
                      <span className="mat-session-meta">{[s.time, s.room, s.speaker].filter(Boolean).join(' · ')}</span>
                    </button>
                    {items.length
                      ? <MaterialLinks items={items} />
                      : <p className="mat-none">Not posted yet</p>}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
