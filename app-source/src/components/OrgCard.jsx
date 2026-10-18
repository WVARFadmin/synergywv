import { ChevronDown, Download, Eye, Globe } from 'lucide-react';
import { MATERIALS_PENDING } from '../data/conference.js';
import { OrgLogo } from './OrgLogo.jsx';
import { tierInfo, TierIcon } from './TierMark.jsx';

// A sponsor that supports the conference as an organization rather than
// through a named representative. Same card shell, tier colour and logo box
// as PersonRow, so the directory reads as one list.
export function OrgCard({ org, expanded = false, onToggle }) {
  const panelId = `org-panel-${org.id}`;
  const tier = tierInfo(org.tier);

  const summary = [org.name, org.tier].filter(Boolean).join(' · ');

  return (
    <div className={`person-card org-card${tier ? ` tiered tier-${tier.key}` : ''}`}>
      <button
        type="button"
        className="person-row"
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-label={`${summary} — sponsor details`}
        onClick={() => onToggle(org.id)}
      >
        <span className="org-avatar" aria-hidden="true">
          <OrgLogo
            org={org}
            className="org-avatar-logo"
            fallback={<span className="org-avatar-initial">{org.name.charAt(0)}</span>}
          />
        </span>
        <span className="who">
          <span className="name">{org.name}</span>
          <span className="org">{org.donor ? 'Sponsor' : 'Sponsor organization'}</span>
        </span>
        <span className="badges">
          <span className={`p-badge ${tier ? `tier-badge tier-${tier.key}` : 'sponsor'}`}>
            {tier && <TierIcon info={tier} />}
            {tier ? tier.short : 'Sponsor'}
          </span>
        </span>
        <ChevronDown className="caret" aria-hidden="true" />
      </button>

      {/* Rendered even when collapsed so aria-controls resolves; `hidden` also
          keeps the website link out of the tab order. */}
      <div className="person-panel" id={panelId} hidden={!expanded}>
        {org.logo && <OrgLogo org={org} className="org-logo" />}

        {org.tier && (
          <p className={`p-sponsor-tier${tier ? ` tier-${tier.key}` : ''}`}>
            {tier && <TierIcon info={tier} />}
            {org.tier}
          </p>
        )}

        {org.about?.length > 0 && (
          <div className="p-about">
            <span className="p-label">About {org.name}</span>
            {org.about.map(para => <p key={para.slice(0, 24)}>{para}</p>)}
          </div>
        )}

        {!org.materials?.length && <p className="p-materials-pending">{MATERIALS_PENDING}</p>}

        {org.materials?.length > 0 && (
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

        {org.website && (
          <a className="email" href={org.website} target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden="true" />
            <span className="link-text">
              {org.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/').map((part, i, all) => (
                <span key={i}>{part}{i < all.length - 1 && <>/<wbr /></>}</span>
              ))}
            </span>
            <span className="sr-only"> — {org.name} website, opens in a new tab</span>
          </a>
        )}
      </div>
    </div>
  );
}
