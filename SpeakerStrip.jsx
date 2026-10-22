import { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { PEOPLE } from '../data/conference.js';
import { Avatar } from './Avatar.jsx';

// Keynote first, then the honoured guests, then everyone else by first name.
const LEAD = ['p1', 'p2', 'p3'];

export const FEATURED_SPEAKERS = [
  ...LEAD.map(id => PEOPLE.find(p => p.id === id)).filter(Boolean),
  ...PEOPLE.filter(p => p.speaker && !LEAD.includes(p.id))
    .sort((a, b) => a.name.localeCompare(b.name)),
];

const LABEL = { p1: 'Keynote', p2: 'Honored guest', p3: 'Honored guest' };
const keynote = FEATURED_SPEAKERS.find(p => p.id === 'p1');
const guests = FEATURED_SPEAKERS.filter(p => p.id === 'p2' || p.id === 'p3');
const others = FEATURED_SPEAKERS.filter(p => !LEAD.includes(p.id));
// Collapsed, the grid shows two full rows: 3 + 3 on phones (rows 7–8 are
// hidden there by CSS) and 4 + 4 on wider screens.
const INITIAL = 8;

const aria = (p) =>
  `${p.name}${p.org ? `, ${p.org}` : ''}${LABEL[p.id] ? `, ${LABEL[p.id]}` : ''} — see profile`;

function Tile({ p, size = 'md', variant = '' , onOpen }) {
  return (
    <li className={`speaker-cell${variant ? ` ${variant}` : ''}`}>
      <button type="button" className={`speaker-tile${LABEL[p.id] ? ' is-lead' : ''}`}
        onClick={() => onOpen(p)} aria-label={aria(p)}>
        <Avatar person={p} size={size} ring />
        <span className="speaker-text">
          {LABEL[p.id] && <span className="speaker-tag">{LABEL[p.id]}</span>}
          <span className="speaker-name">{p.name}</span>
          {(p.org || (p.role !== 'Keynote speaker' && p.role)) && <span className="speaker-org">{p.org || p.role}</span>}
        </span>
      </button>
    </li>
  );
}

export function SpeakerStrip({ onOpen }) {
  const [expanded, setExpanded] = useState(false);
  const gridId = `speaker-grid-${useId()}`;
  const shown = expanded ? others : others.slice(0, INITIAL);
  const hidden = others.length - INITIAL;

  return (
    <div className="speaker-block">
      <ul className="speaker-leads" aria-label="Keynote and honored guests">
        {keynote && <Tile p={keynote} size="md" variant="is-keynote" onOpen={onOpen} />}
        {guests.map(p => <Tile key={p.id} p={p} variant="is-guest" onOpen={onOpen} />)}
      </ul>
      <ul className="speaker-grid" id={gridId} aria-label="Speakers">
        {shown.map(p => <Tile key={p.id} p={p} onOpen={onOpen} />)}
      </ul>
      {hidden > 0 && (
        <button type="button" className="speaker-more" aria-expanded={expanded}
          aria-controls={gridId} onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Show fewer' : `Show all ${others.length} speakers`}
          <ChevronDown size={18} aria-hidden="true" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
        </button>
      )}
    </div>
  );
}
