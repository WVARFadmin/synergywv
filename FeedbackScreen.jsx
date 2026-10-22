import { CheckCircle2, ChevronLeft, ChevronRight, Clock, MessageSquareText } from 'lucide-react';
import { DAYS } from '../data/conference.js';
import {
  CONFERENCE_SURVEY, CONFERENCE_SURVEY_OPENS, SESSION_SURVEY,
  hasSessionSurvey, sessionStart,
} from '../data/surveys.js';
import { SurveyForm } from '../components/SurveyForm.jsx';

// Staff can add ?preview-surveys to the address to open every survey early.
export const PREVIEW_SURVEYS = new URLSearchParams(window.location.search).has('preview-surveys');

export const sessionSurveyOpen = (s, now) => PREVIEW_SURVEYS || now >= sessionStart(s);
export const conferenceSurveyOpen = (now) => PREVIEW_SURVEYS || now >= CONFERENCE_SURVEY_OPENS;

function Row({ title, meta, done, open, opensAt, onClick }) {
  return (
    <li>
      <button type="button" className={`sv-row${done ? ' is-done' : ''}`} onClick={onClick} disabled={!open || done}>
        <span className="sv-row-text">
          <span className="sv-row-title">{title}</span>
          {meta && <span className="sv-row-meta">{meta}</span>}
        </span>
        {done ? (
          <span className="sv-row-status done"><CheckCircle2 aria-hidden="true" />Sent</span>
        ) : open ? (
          <span className="sv-row-status go">Start<ChevronRight aria-hidden="true" /></span>
        ) : (
          <span className="sv-row-status later"><Clock aria-hidden="true" />{opensAt}</span>
        )}
      </button>
    </li>
  );
}

export function FeedbackScreen({ sessions, now, surveyId, done, onOpenSurvey, onClose, onDone }) {
  const surveyed = sessions.filter(hasSessionSurvey);

  if (surveyId) {
    const isConf = surveyId === 'conference';
    const s = !isConf && surveyed.find(x => x.id === surveyId);
    if (isConf || s) {
      const day = s && DAYS.find(d => d.id === s.day);
      return (
        <div className="content sv-content">
          <button className="back-btn sv-back" onClick={onClose}>
            <ChevronLeft size={16} />Back
          </button>
          <SurveyForm
            key={surveyId}
            survey={isConf ? CONFERENCE_SURVEY : SESSION_SURVEY}
            heading={isConf ? 'Statewide Synergy 2026' : s.title}
            subheading={isConf ? 'Conference feedback' : [day?.date, s.time, s.room, s.speaker].filter(Boolean).join(' · ')}
            hidden={isConf ? {} : {
              session_id: s.id, session_title: s.title, session_day: day?.date || '',
              session_time: s.time, session_room: s.room, session_speakers: s.speaker,
              session_tags: (s.tags || []).join(', '),
            }}
            onDone={() => onDone(surveyId)}
            onCancel={onClose}
          />
        </div>
      );
    }
  }

  const confOpen = conferenceSurveyOpen(now);
  const starred = new Set(sessions.filter(s => s.starred).map(s => s.id));

  return (
    <div className="content sv-content">
      <div className="sv-hero">
        <MessageSquareText aria-hidden="true" />
        <div>
          <h2>Your feedback</h2>
          <p>Tell us what helped and what would help more. Each survey takes a few minutes, and every question is optional.</p>
        </div>
      </div>

      <h3 className="sv-list-head">Whole conference</h3>
      <ul className="sv-list">
        <Row
          title="Conference feedback"
          meta="Content, tracks, the State Use Program and the event itself"
          done={done.has('conference')}
          open={confOpen}
          opensAt="Opens Thu morning"
          onClick={() => onOpenSurvey('conference')}
        />
      </ul>

      {DAYS.map(d => {
        const list = surveyed.filter(s => s.day === d.id)
          // Saved sessions first, then by time as listed.
          .sort((a, b) => (starred.has(b.id) - starred.has(a.id)) || (sessionStart(a) - sessionStart(b)));
        if (!list.length) return null;
        return (
          <section key={d.id}>
            <h3 className="sv-list-head">Sessions · {d.full}</h3>
            <ul className="sv-list">
              {list.map(s => (
                <Row
                  key={s.id}
                  title={s.title}
                  meta={[s.time, s.room, starred.has(s.id) && 'Saved'].filter(Boolean).join(' · ')}
                  done={done.has(s.id)}
                  open={sessionSurveyOpen(s, now)}
                  opensAt={`Opens ${s.time}`}
                  onClick={() => onOpenSurvey(s.id)}
                />
              ))}
            </ul>
          </section>
        );
      })}
      <p className="sv-privacy">
        Answers go to the WVARF conference team. Your name and email are optional and only used if you ask us to follow up.
      </p>
    </div>
  );
}
