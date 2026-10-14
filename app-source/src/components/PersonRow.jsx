import { ChevronDown, Download, Eye, Globe, Mail } from 'lucide-react';
import { DAYS, SESSIONS, findOrg, MATERIALS_PENDING } from '../data/conference.js';
import { OrgLogo } from './OrgLogo.jsx';
import { Avatar } from './Avatar.jsx';
import { tierInfo, TierIcon } from './TierMark.jsx';

const BADGE_DEFS = [
  { key: 'speaker',   cls: 'speaker',   label: 'Speaker' },
  { key: 'sponsor',   cls: 'sponsor',   label: 'Sponsor' },
  { key: 'exhibitor', cls: 'exhibitor', label: 'Exhibitor' },
];

const ATTENDEE_BADGE = { key: 'attendee', cls: 'attendee', label: 'Attendee' };

/** Attendee is the fallback so every card carries at least one badge. */
export function personBadges(person) {
  const flagged = BADGE_DEFS.filter(b => person[b.key]);
  return flagged.length ? flagged : [ATTENDEE_BADGE];
}

export function isAttendeeOnly(person) {
  return !person.speaker && !person.sponsor && !person.exhibitor;
}

// A title that only restates a badge tells the reader nothing new.
const REDUNDANT_TITLES = new Set(['speaker', 'sponsor', 'exhibitor', 'attendee']);

function displayTitle(person) {
  const title = (person.role || '').trim();
  if (!title) return '';
  return REDUNDANT_TITLES.has(title.toLowerCase()) ? '' : title;
}

// SESSIONS.speaker is free text ("Erik Nelson, Kibu"), so join on the name;
// panelists the line only calls "Panel" are listed in the session's `panel`.
function sessionsFor(person) {
  if (!person.speaker) return [];
  return SESSIONS.filter(s => (s.speaker && s.speaker.includes(person.name)) || s.panel?.includes(person.id));
}

export function PersonRow({ person, expanded = false, onToggle, savedIds, onToggleStar, onOpenSession }) {
  const panelId = `person-panel-${person.id}`;
  const title = displayTitle(person);
  const email = (person.email || '').trim();
  const talks = sessionsFor(person);
  const org = findOrg(person.org);
  const sponsorTier = person.sponsor ? org?.tier : null;
  // Sponsor reps show their level on the closed card, in that level's color.
  const tier = tierInfo(sponsorTier);
  const badges = personBadges(person).map(b =>
    b.key === 'sponsor' && tier ? { ...b, cls: `tier-badge tier-${tier.key}`, label: tier.badge, short: tier.short, tier } : b);

  // An aria-label replaces the button's inner text for screen readers, so it
  // has to carry everything the sighted user sees.
  const summary = [person.name, person.org, badges.map(b => b.label).join(', ')]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={`person-card${tier ? ` tiered tier-${tier.key}` : ''}`}>
      <button
        type="button"
        className="person-row"
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-label={`${summary} — contact details`}
        onClick={() => onToggle(person.id)}
      >
        {/* Speakers get a larger, ringed avatar so they stand out in the list. */}
        {/* A personal donor with no photo shows their sponsor icon. */}
        {person.sponsor && !person.photo && org?.logo ? (
          <span className="org-avatar" aria-hidden="true">
            <OrgLogo org={org} className="org-avatar-logo" fallback={<span className="org-avatar-initial">{person.initials}</span>} />
          </span>
        ) : (
          <Avatar person={person} size={person.speaker ? 'md' : 'sm'} ring={person.speaker} />
        )}
        <span className="who">
          <span className="name">{person.name}</span>
          {person.org && person.org !== person.name && <span className="org">{person.org}</span>}
        </span>
        <span className="badges">
          {badges.map(b => (
            <span key={b.key} className={`p-badge ${b.cls}`}>
              {b.tier && <TierIcon info={b.tier} />}
              {/* Short name keeps the closed card compact; the row's
                  aria-label carries the full "… Sponsor" name. */}
              {b.short || b.label}
            </span>
          ))}
        </span>
        <ChevronDown className="caret" aria-hidden="true" />
      </button>

      {/* Rendered even when collapsed so aria-controls resolves; `hidden` also
          keeps the email link out of the tab order. */}
      <div className="person-panel" id={panelId} hidden={!expanded}>
        {/* No wrapper: a display:none img is out of flow, so an absent logo
            leaves no phantom flex gap above the title. */}
        {person.speaker && person.photo && (
          <div className="p-hero">
            <Avatar person={person} size="lg" ring />
          </div>
        )}
        {org?.logo && <OrgLogo org={org} className="org-logo" />}
        {title && <p className="p-title">{title}</p>}

        {sponsorTier && (
          <p className={`p-sponsor-tier${tier ? ` tier-${tier.key}` : ''}`}>
            {tier && <TierIcon info={tier} />}
            {sponsorTier}
          </p>
        )}

        {person.bio?.length > 0 && (
          <div className="p-about p-bio">
            <span className="p-label">Bio</span>
            {person.bio.map(para => <p key={para.slice(0, 24)}>{para}</p>)}
          </div>
        )}

        {org?.about?.length > 0 && (
          <div className="p-about">
            <span className="p-label">About {org.name}</span>
            {org.about.map(para => <p key={para.slice(0, 24)}>{para}</p>)}
          </div>
        )}

        {talks.length > 0 && (
          <div className="p-talks">
            <span className="p-label">Speaking at</span>
            {talks.map(s => {
              // Same saved schedule the agenda stars use, so either place
              // shows and changes the same state.
              const saved = savedIds?.has(s.id);
              return (
                <div key={s.id} className="p-talk">
                  {/* Opens the full session page, same as tapping it in the
                      agenda. */}
                  <button type="button" className="p-talk-text" onClick={() => onOpenSession?.(s)}>
                    <span className="p-talk-title">{s.title}</span>
                    <span className="when">
                      {DAYS.find(d => d.id === s.day)?.date} · {s.time}
                      {s.room ? ` · ${s.room}` : ''}
                    </span>
                  </button>
                  {onToggleStar && (
                    <button
                      type="button"
                      className={`p-save ${saved ? 'saved' : ''}`}
                      onClick={() => onToggleStar(s.id)}
                    >
                      {/* Name comes from the content, so it always contains the
                          visible word (WCAG 2.5.3) and names the session. */}
                      <span className="p-save-star" aria-hidden="true">{saved ? '★' : '☆'}</span>
                      {saved ? 'Saved' : 'Save'}
                      <span className="sr-only">
                        {saved ? `: ${s.title} is on your schedule. Tap to remove.` : ` ${s.title} to my schedule`}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {org && !org.materials?.length && (
          <p className="p-materials-pending">{MATERIALS_PENDING}</p>
        )}

        {org?.materials?.length > 0 && (
          <div className="p-materials">
            <span className="p-label">Materials</span>
            {org.materials.map(m => (
              <div key={m.file} className="p-material">
                {m.preview && <img className="p-material-thumb" src={m.preview} alt={m.alt || ''} loading="lazy" />}
                <div className="p-material-info">
                  <span className="p-material-title">{m.title}</span>
                  {m.size && <span className="p-material-size">{m.size}</span>}
                  <div className="p-material-actions">
                    <a className="p-material-btn" href={m.file} target="_blank" rel="noopener noreferrer">
                      <Eye aria-hidden="true" />View
                      <span className="sr-only"> {m.title}, opens in a new tab</span>
                    </a>
                    <a className="p-material-btn" href={m.file} download>
                      <Download aria-hidden="true" />Download
                      <span className="sr-only"> {m.title}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!org?.website && person.website && (
          <a className="email" href={person.website} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" />
            <span className="link-text">
              {person.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/').map((part, i, all) => (
                <span key={i}>{part}{i < all.length - 1 && <>/<wbr /></>}</span>
              ))}
            </span>
            <span className="sr-only"> — {person.name}'s website, opens in a new tab</span>
          </a>
        )}

        {org?.website && (
          <a className="email" href={org.website} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" />
            {/* <wbr> after each slash lets a long address wrap there instead
                of mid-word. */}
            <span className="link-text">
              {org.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/').map((part, i, all) => (
                <span key={i}>{part}{i < all.length - 1 && <>/<wbr /></>}</span>
              ))}
            </span>
            <span className="sr-only"> — {org.name} website, opens in a new tab</span>
          </a>
        )}

        {email ? (
          <a className="email" href={`mailto:${email}`} aria-label={`Email ${person.name}`}>
            <Mail aria-hidden="true" />
            {email}
          </a>
        ) : (
          <p className="no-email">
            <Mail aria-hidden="true" />
            Email not listed
          </p>
        )}
      </div>
    </div>
  );
}
