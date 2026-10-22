import { useEffect } from 'react';
import { ArrowDownAZ, Search, SearchX } from 'lucide-react';
import { PEOPLE, SPONSORS, EXHIBITORS } from '../data/conference.js';
import { PersonRow, isAttendeeOnly } from '../components/PersonRow.jsx';
import { OrgCard } from '../components/OrgCard.jsx';

// Sponsors and exhibitors that support the conference as an organization,
// with no named representative in PEOPLE. They would otherwise have no card
// in the directory, so the logo on Home would lead nowhere.
//
// The test is for a rep in that capacity, not merely someone from the same
// organization: WVABLE sponsors the conference and also sends a speaker, and
// the speaker's card is not the sponsor's card.
const ORG_ONLY = [
  ...SPONSORS.filter(o => !PEOPLE.some(p => p.sponsor && p.org === o.name)),
  ...EXHIBITORS.filter(o => !PEOPLE.some(p => p.exhibitor && p.org === o.name)),
];

// The Exhibitors filter only appears once there are exhibitors to list.
const HAS_EXHIBITORS = EXHIBITORS.length > 0 || PEOPLE.some(p => p.exhibitor);

const FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'speakers', label: 'Speakers', match: p => p.speaker },
  { id: 'sponsors', label: 'Sponsors', match: p => p.sponsor },
  ...(HAS_EXHIBITORS ? [{ id: 'exhibitors', label: 'Exhibitors', match: p => p.exhibitor }] : []),
  { id: 'attendees', label: 'Attendees', match: isAttendeeOnly },
];

// "Brad Butler II" sorts under Butler, not II.
const SUFFIXES = new Set(['ii', 'iii', 'iv', 'jr', 'jr.', 'sr', 'sr.']);
function lastName(name) {
  const parts = name.trim().split(/\s+/).filter(w => !SUFFIXES.has(w.toLowerCase()));
  return parts[parts.length - 1] || name;
}

const SORTS = [
  { id: 'first', label: 'First name', key: p => p.name },
  { id: 'last', label: 'Last name', key: p => lastName(p.name) },
  // People with no organization sort to the end rather than leading the list.
  { id: 'org', label: 'Organization', key: p => p.org || '￿' },
];

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

// Search, sort and open cards are owned by App so they survive opening a
// speaker's session and coming back.
export function PeopleScreen({
  filter, onFilterChange, query: q, onQueryChange: setQ, sort, onSortChange: setSort,
  openIds, onOpenIdsChange: setOpenIds, focusOrg = null, focusPerson = null, savedIds, onToggleStar, onOpenSession,
}) {

  useEffect(() => {
    if (!focusOrg) return;
    // An org tile may point at a representative's card or, when the sponsor
    // has no named rep, at the organization's own card.
    const first = PEOPLE.find(p => p.org === focusOrg);
    const id = first ? `person-panel-${first.id}` : `org-panel-${ORG_ONLY.find(o => o.name === focusOrg)?.id}`;
    document.getElementById(id)?.closest('.person-card')?.scrollIntoView({ block: 'center' });
  }, [focusOrg]);

  useEffect(() => {
    if (!focusPerson) return;
    document.getElementById(`person-panel-${focusPerson}`)
      ?.closest('.person-card')?.scrollIntoView({ block: 'start' });
  }, [focusPerson]);

  const toggleOpen = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const active = FILTERS.find(f => f.id === filter) || FILTERS[0];
  const query = q.trim().toLowerCase();
  const showOrgs = filter === 'all' || filter === 'sponsors' || filter === 'exhibitors';
  const orgs = showOrgs
    ? ORG_ONLY.filter(o => {
        if (filter === 'sponsors' && !o.tier) return false;
        if (filter === 'exhibitors' && o.tier) return false;
        if (!query) return true;
        return `${o.name} ${o.tier || ''}`.toLowerCase().includes(query);
      })
    : [];
  const sorter = SORTS.find(s => s.id === sort) || SORTS[0];

  const list = PEOPLE.filter(p => {
    if (!active.match(p)) return false;
    if (!query) return true;
    const hay = `${p.name} ${p.role || ''} ${p.org || ''} ${p.email || ''}`.toLowerCase();
    return hay.includes(query);
  }).sort((a, b) =>
    // Name breaks ties so an org's own people stay in a predictable order.
    collator.compare(sorter.key(a), sorter.key(b)) || collator.compare(a.name, b.name)
  );

  // The job title is hidden when collapsed, so a search hit can look
  // unexplained. Auto-expand while searching to show what matched.
  const searching = query.length > 1;

  // A chip with nothing behind it reads as broken — Attendees stays hidden
  // until real attendee data lands.
  const orgCount = (id) => {
    if (id === 'all') return ORG_ONLY.length;
    if (id === 'sponsors') return ORG_ONLY.filter(o => o.tier).length;
    if (id === 'exhibitors') return ORG_ONLY.filter(o => !o.tier).length;
    return 0;
  };
  const chips = FILTERS.filter(f => f.id === 'all' || PEOPLE.some(f.match) || orgCount(f.id) > 0);

  return (
    <div className="content people-content">
      <div className="search-wrap">
        <Search size={18} />
        <input
          className="search"
          placeholder="Search by name, role or org"
          value={q}
          onChange={e => setQ(e.target.value)}
          aria-label="Search people"
        />
      </div>
      <div className="chip-row">
        {chips.map(f => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label} ({PEOPLE.filter(f.match).length + orgCount(f.id)})
          </button>
        ))}
      </div>

      <div className="sort-row">
        <ArrowDownAZ aria-hidden="true" />
        <label htmlFor="people-sort">Sort by</label>
        <select
          id="people-sort"
          className="sort-select"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {orgs.map(o => (
        <OrgCard
          key={o.id}
          org={o}
          expanded={openIds.has(o.id) || searching}
          onToggle={toggleOpen}
        />
      ))}

      {list.map(p => (
        <PersonRow
          key={p.id}
          person={p}
          expanded={openIds.has(p.id) || searching}
          onToggle={toggleOpen}
          savedIds={savedIds}
          onToggleStar={onToggleStar}
          onOpenSession={onOpenSession}
        />
      ))}
      {list.length === 0 && orgs.length === 0 && (
        <div className="empty-state">
          <SearchX size={44} />
          <h4>No matches</h4>
          <p>Try a different search.</p>
        </div>
      )}
    </div>
  );
}
