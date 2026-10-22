import { CalendarDays, MapPin, Users, FileText, Store, MessageSquareText, Laptop } from 'lucide-react';
import { SessionCard } from '../components/SessionCard.jsx';
import {
  SPONSORS, EXHIBITORS, EXHIBITORS_PENDING, CONFERENCE_NAME, CONFERENCE_SUBTITLE,
  CONFERENCE_THEME, CONFERENCE_DATES, TRACKS, TRACK_NOTE, 
  SESSIONS, SHARED_OFFICE,
} from '../data/conference.js';
import { OrgLogo } from '../components/OrgLogo.jsx';
import { ChallengeCard } from '../components/ChallengeCard.jsx';
import { SpeakerStrip } from '../components/SpeakerStrip.jsx';
import { tierInfo, TierIcon } from '../components/TierMark.jsx';

function QuickCard({ icon: Ico, label, onClick }) {
  return (
    <button onClick={onClick} className="quick-card">
      <span className="ico"><Ico size={20} /></span>
      <span className="label">{label}</span>
    </button>
  );
}

function Carousel({ label, items, logos, onOpen }) {
  return (
    <div className="carousel" role="list" aria-label={label}>
      {items.map(item => {
        const tier = tierInfo(item.tier);
        return (
          <button
            key={item.id}
            role="listitem"
            className={['sponsor-tile', tier && `tiered tier-${tier.key}`, item.donor && 'has-donor'].filter(Boolean).join(' ')}
            onClick={() => onOpen(item)}
            aria-label={`${[item.name, item.tier].filter(Boolean).join(', ')} — see in People directory`}
          >
            <span className="tile-body">
              {logos
                ? <OrgLogo org={item} className="org-logo" fallback={<span className="tile-name">{item.name}</span>} />
                : <span className="tile-name">{item.name}</span>}
              {/* Personal donors have an icon, not a logo, so their names
                  are written under it. */}
              {logos && item.donor && <span className="tile-donor-name">{item.name}</span>}
            </span>
            {tier
              ? <span className="ribbon"><TierIcon info={tier} />{tier.short}</span>
              : item.tier && <span className="tier">{item.tier}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function HomeScreen({ sessions, onNavigate, onOpenSession, onToggleStar, feedbackOpen = false, now = Date.now() }) {
  const saved = sessions.filter(s => s.starred).slice(0, 3);
  const challenge = SESSIONS.find(s => s.id === 't4');

  return (
    <div className="content home-content">
      <div className="hero">
        <div className="hero-eyebrow">{CONFERENCE_SUBTITLE} · {CONFERENCE_DATES}</div>
        <h2>{CONFERENCE_NAME}</h2>
        <p className="hero-theme">{CONFERENCE_THEME}</p>
        <p>
          Stonewall Resort, Roanoke, West Virginia. Two days of connection, learning
          and celebration for nonprofit leaders, government partners and the
          disability community.
        </p>
        <button className="cta" onClick={() => onNavigate('agenda')}>Open the agenda →</button>
      </div>

      {feedbackOpen && (
        <button type="button" className="feedback-cta" onClick={() => onNavigate('feedback')}>
          <MessageSquareText aria-hidden="true" />
          <span>
            <span className="feedback-cta-title">Share your feedback</span>
            <span className="feedback-cta-sub">Rate the sessions you attended. It takes two minutes.</span>
          </span>
        </button>
      )}

      <div className="section-row">
        <h3>Your saved sessions</h3>
        <button className="link-btn" onClick={() => onNavigate('agenda')}>View all</button>
      </div>
      {saved.length === 0 ? (
        <div className="empty-state">
          <h4>Your schedule is empty — for now.</h4>
          <p>Tap ☆ on any session to save it here.</p>
        </div>
      ) : (
        <div className="saved-list">
          {saved.map(s => (
            <SessionCard key={s.id} session={s} onOpen={onOpenSession} onToggleStar={onToggleStar} />
          ))}
        </div>
      )}

      <div className="section-row">
        <h3>Speakers</h3>
        <button className="link-btn" onClick={() => onNavigate('people', 'speakers')}>See all speakers</button>
      </div>
      <SpeakerStrip onOpen={p => onNavigate('people', 'speakers', null, p.id)} />

      <div className="section-row">
        <h3>Breakout tracks</h3>
      </div>
      <div className="track-grid">
        {TRACKS.map(t => (
          <div key={t.id} className={`track-card track-${t.id.toLowerCase()}`}>
            <span className="track-label">{t.label}</span>
            <span className="track-name">{t.name}</span>
          </div>
        ))}
      </div>
      <p className="track-note">{TRACK_NOTE}</p>

      <div className="section-row">
        <h3>Conference info</h3>
      </div>
      <div className="quick-grid">
        <QuickCard icon={CalendarDays} label="Agenda" onClick={() => onNavigate('agenda')} />
        <QuickCard icon={MapPin} label="Map & directions" onClick={() => onNavigate('venue')} />
        <QuickCard icon={Users} label="Speakers & attendees" onClick={() => onNavigate('people')} />
        <QuickCard icon={FileText} label="About & contacts" onClick={() => onNavigate('info')} />
        <QuickCard icon={FileText} label="Materials" onClick={() => onNavigate('materials')} />
        <QuickCard icon={MessageSquareText} label="Give feedback" onClick={() => onNavigate('feedback')} />
      </div>

      <button type="button" className="office-card" onClick={() => onNavigate('venue')}>
        <Laptop aria-hidden="true" />
        <span>
          <span className="office-title">{SHARED_OFFICE.name} · {SHARED_OFFICE.room}</span>
          <span className="office-sub">Take calls, work on your laptop, or find the conference team. Terrace Level, next to Kanawha.</span>
        </span>
      </button>

      <div className="section-row">
        <h3>Sponsors</h3>
        <button className="link-btn" onClick={() => onNavigate('people', 'sponsors')}>See all sponsors</button>
      </div>
      <Carousel
        label="Sponsors"
        items={SPONSORS}
        logos
        onOpen={item => onNavigate('people', 'sponsors', item.name)}
      />

      <div className="section-row">
        <h3>Networking</h3>
      </div>
      <ChallengeCard now={now} onPlay={() => onNavigate('challenge')} />
    </div>
  );
}
