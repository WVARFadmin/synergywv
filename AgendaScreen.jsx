import { useMemo } from 'react';
import { Star } from 'lucide-react';
import { DAYS, RESTRICTED_TAGS, EXEC_DAY_NOTE } from '../data/conference.js';
import { SessionCard } from '../components/SessionCard.jsx';

// day and filter are owned by App so they outlive this screen.
export function AgendaScreen({ sessions, onOpenSession, onToggleStar, day, onDayChange: setDay, filter, onFilterChange: setFilter }) {

  // day is a day id, or 'all' for the whole conference in one list.
  const list = useMemo(() => {
    let l = day === 'all' ? sessions : sessions.filter(s => s.day === day);
    if (filter === 'saved') l = l.filter(s => s.starred);
    return l;
  }, [day, filter, sessions]);

  // Grouped by day, then by start time within the day. Session order in the
  // data is already chronological, so insertion order is the display order.
  const byDay = DAYS
    .map(d => {
      const times = {};
      list.filter(s => s.day === d.id).forEach(s => { (times[s.time] = times[s.time] || []).push(s); });
      return { day: d, times: Object.entries(times) };
    })
    .filter(g => g.times.length > 0);

  return (
    <>
      <div className="day-tabs">
        <button
          className={`day-tab ${day === 'all' ? 'active' : ''}`}
          onClick={() => setDay('all')}
        >
          All
        </button>
        {DAYS.map(d => (
          <button
            key={d.id}
            className={`day-tab ${day === d.id ? 'active' : ''}`}
            onClick={() => setDay(d.id)}
          >
            {d.label}
          </button>
        ))}
        <button
          className={`day-tab ${filter === 'saved' ? 'active' : ''}`}
          style={{ marginLeft: 'auto' }}
          onClick={() => setFilter(filter === 'saved' ? 'all' : 'saved')}
        >
          {filter === 'saved' ? '★ Saved' : '☆ Saved'}
        </button>
      </div>
      <div className="content">
        {byDay.length === 0 ? (
          <div className="empty-state">
            <Star size={44} />
            <h4>No saved sessions yet</h4>
            <p>Tap ☆ on any session to save it.</p>
          </div>
        ) : byDay.map(({ day: d, times }) => (
          <section key={d.id} aria-label={d.full}>
            {day === 'all' && <h3 className="agenda-day-heading">{d.full}</h3>}
            {/* Explained on the day that has these sessions, not above them all. */}
            {times.some(([, items]) => items.some(s => (s.tags || []).includes('Executive Day'))) && (
              <p className="agenda-note">
                <span className="pill exec">Executive Day</span>
                <span>{EXEC_DAY_NOTE}</span>
              </p>
            )}
            {times.map(([time, items]) => (
              <div key={time} className="agenda-slot">
                <div className="time-heading">{time}</div>
                {items.map(s => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    onOpen={onOpenSession}
                    onToggleStar={onToggleStar}
                  />
                ))}
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
