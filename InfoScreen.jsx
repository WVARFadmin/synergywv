import { OrgLogo } from '../components/OrgLogo.jsx';
import { tierInfo, TierIcon } from '../components/TierMark.jsx';
import { useId, useState } from 'react';
import {
  Accessibility, ChevronDown, Mail, Dog, Armchair, Wind, Phone, Globe,
  FileText, ExternalLink, Ticket, Facebook, Briefcase, Package, Laptop, MapPin, Clock,
} from 'lucide-react';
import { WvarfLogo } from '../components/WvarfLogo.jsx';
import {
  SPONSORS, CONTACTS, CONFERENCE_ABOUT, CONFERENCE_NAME, CONFERENCE_SUBTITLE,
  CONFERENCE_THEME, CONFERENCE_DATES, REGISTRATION_URL,
  WVARF, WVARF_RESOURCES, STATE_USE_SERVICES, STATE_USE_COMMODITIES,
  SHARED_OFFICE,
} from '../data/conference.js';

// Accessibility provisions that WVARF has published for this conference are
// limited; rather than claim provisions that may not exist, this list states
// what Stonewall Resort offers and points people at the registration desk.
// Edit freely as the accessibility plan is confirmed.
const ACCESS_ROWS = [
  { icon: Accessibility, label: 'Mobility', value: 'Stonewall Resort’s conference centre is wheelchair accessible throughout. Tell the registration desk if you need a seat reserved or a clearer route between rooms.' },
  { icon: Dog, label: 'Service animals', value: 'Welcome throughout the resort.' },
  { icon: Armchair, label: 'Reserved seating', value: 'Front-row seats can be held for attendees who are hard of hearing or have low vision — ask at the registration desk and a sign will be placed on your chair.' },
  { icon: Wind, label: 'Scent-free', value: 'Please go easy on scented products — some attendees are sensitive.' },
];

// A heading wrapping a button is the accordion pattern: the heading keeps the
// section reachable by heading navigation, the button makes it operable.
function InfoGroup({ title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `info-panel-${useId()}`;
  return (
    <div className={`info-group ${open ? 'open' : ''}`}>
      <h4>
        <button
          type="button"
          className="info-group-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(o => !o)}
        >
          <span className="ig-title">{title}</span>
          {count != null && <span className="ig-count">{count}</span>}
          <ChevronDown className="caret" aria-hidden="true" />
        </button>
      </h4>
      {/* Always rendered so aria-controls resolves; `hidden` also keeps the
          collapsed tel: and mailto: links out of the tab order. */}
      <div className="info-group-panel" id={panelId} hidden={!open}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ icon: Ico, label, value, href, sponsorTier, onNavigate }) {
  // Thank the sponsor of this feature, linking to their reps in People.
  const sponsor = sponsorTier && SPONSORS.find(sp => sp.tier === sponsorTier);
  const val = href
    ? <a href={href} style={{ color: 'var(--wv-navy)' }}>{value}</a>
    : value;
  return (
    <div className="info-row">
      <Ico />
      <div>
        <div className="label">{label}</div>
        <div className="val">{val}</div>
        {sponsor && onNavigate && (
          <button type="button" className="link-btn info-credit" onClick={() => onNavigate('people', 'sponsors', sponsor.name)}>
            Sponsored by {sponsor.name}. Thank you!
          </button>
        )}
      </div>
    </div>
  );
}

function ContactRow({ person }) {
  const tel = person.phone.replace(/\D/g, '');
  return (
    <div className="contact-row">
      <div className="who">
        <div className="name">{person.name}</div>
        <div className="title">{person.title}</div>
        {person.helps?.length > 0 && (
          <div className="helps">
            {person.helps.map(h => <span key={h} className="help-pill">{h}</span>)}
          </div>
        )}
      </div>
      <div className="contact-ways">
        <a className="tel" href={`tel:+1${tel}`} aria-label={`Call ${person.name}, ${person.phone}`}>
          <Phone />
          {person.phone}
        </a>
        {person.email && (
          <a className="tel mail" href={`mailto:${person.email}`} aria-label={`Email ${person.name}, ${person.email}`}>
            <Mail />
            <span className="mail-addr">{person.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function DocLink({ title, kind, url }) {
  return (
    <a className="doc-link" href={url} target="_blank" rel="noopener noreferrer">
      <FileText aria-hidden="true" />
      <span className="doc-text">
        <span className="doc-title">{title}</span>
        {kind && <span className="doc-kind">{kind} · PDF</span>}
      </span>
      <ExternalLink className="doc-ext" aria-hidden="true" />
      <span className="sr-only">, opens in a new tab</span>
    </a>
  );
}

export function InfoScreen({ onNavigate }) {
  return (
    <div className="content info-content">
      <p className="info-intro">Tap a section to open it.</p>

      <InfoGroup title="About the conference" defaultOpen>
        <div className="info-body">
          <p className="conf-theme">{CONFERENCE_NAME}: {CONFERENCE_THEME}</p>
          <p className="conf-sub">{CONFERENCE_SUBTITLE} · {CONFERENCE_DATES} · Stonewall Resort</p>
          {CONFERENCE_ABOUT.map(para => <p key={para.slice(0, 24)}>{para}</p>)}
          <a className="info-link-btn" href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
            <Ticket aria-hidden="true" />
            Registration &amp; event page
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </InfoGroup>

      <InfoGroup title={`${SHARED_OFFICE.name} · ${SHARED_OFFICE.room}`} defaultOpen>
        <InfoRow icon={Laptop} label="What it’s for" value={SHARED_OFFICE.summary} />
        <InfoRow icon={Clock} label="When it’s closed" value={SHARED_OFFICE.note} />
        <InfoRow icon={MapPin} label="Where" value={SHARED_OFFICE.where} />
      </InfoGroup>

      <InfoGroup title="Accessibility at the venue" count={ACCESS_ROWS.length}>
        {ACCESS_ROWS.map(r => <InfoRow key={r.label} {...r} onNavigate={onNavigate} />)}
      </InfoGroup>

      <InfoGroup title="WVARF team" count={CONTACTS.length}>
        {CONTACTS.map(p => <ContactRow key={p.id} person={p} />)}
      </InfoGroup>

      <InfoGroup title="Thank you to our sponsors" count={SPONSORS.length}>
        <ul className="info-sponsors">
          {SPONSORS.map(sp => {
            const tier = tierInfo(sp.tier);
            return (
              <li key={sp.id}>
                <button type="button" className="info-sponsor" onClick={() => onNavigate('people', 'sponsors', sp.name)}>
                  <span className="info-sponsor-logo" aria-hidden="true">
                    <OrgLogo org={sp} className="org-avatar-logo" fallback={<span className="org-avatar-initial">{sp.name.charAt(0)}</span>} />
                  </span>
                  <span className="info-sponsor-text">
                    <span className="info-sponsor-name">{sp.name}</span>
                    <span className="info-sponsor-tier">{sp.tier}</span>
                  </span>
                  {tier && <span className={`p-badge tier-badge tier-${tier.key}`}><TierIcon info={tier} />{tier.short}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </InfoGroup>

      <InfoGroup title="WVARF resources" count={WVARF_RESOURCES.length}>
        <div className="info-body">
          <p>Annual reports and newsletters published by WVARF.</p>
          <div className="doc-list">
            {WVARF_RESOURCES.map(r => <DocLink key={r.id} {...r} />)}
          </div>
          <a className="info-link-btn secondary" href={WVARF.resources} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" />
            All resources on wvarf.org
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </InfoGroup>

      <InfoGroup title="The State Use Program">
        <div className="info-body">
          {WVARF.about.map(para => <p key={para.slice(0, 24)}>{para}</p>)}
          <div className="about-block">
            <h5 className="about-label"><Briefcase aria-hidden="true" /> Services our CRPs provide</h5>
            <ul className="plain-list">
              {STATE_USE_SERVICES.map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="about-block">
            <h5 className="about-label"><Package aria-hidden="true" /> Commodities</h5>
            <div className="value-pills">
              {STATE_USE_COMMODITIES.map(c => <span key={c} className="pill gold">{c}</span>)}
            </div>
          </div>
          <a className="info-more" href={WVARF.website} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" />
            Visit wvarf.org for more
            <ExternalLink aria-hidden="true" className="info-more-ext" />
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </InfoGroup>

      <InfoGroup title="About WVARF">
        <div className="info-body">
          <WvarfLogo height={76} className="about-wvarf-logo" />
          <p className="wvarf-tagline">{WVARF.tagline}</p>
          <div className="about-block">
            <h5 className="about-label">Mission</h5>
            <p>{WVARF.mission}</p>
          </div>
          <div className="about-block">
            <h5 className="about-label">Vision</h5>
            <p>{WVARF.vision}</p>
          </div>
          <div className="about-block">
            <h5 className="about-label">Contact</h5>
            <p>{WVARF.address}</p>
            <p>Mailing: {WVARF.mailing}</p>
            <p>{WVARF.hours}</p>
          </div>
          <a className="info-link-btn" href={`tel:+1${WVARF.phone.replace(/\D/g, '')}`}>
            <Phone aria-hidden="true" />
            {WVARF.phone}
          </a>
          <a className="info-link-btn secondary" href={WVARF.website} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" />
            wvarf.org
            <span className="sr-only">, opens in a new tab</span>
          </a>
          <a className="info-link-btn secondary" href={WVARF.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook aria-hidden="true" />
            WVARF on Facebook
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </InfoGroup>

    </div>
  );
}
