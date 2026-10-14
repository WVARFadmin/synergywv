import { ArrowRight, BellOff, X } from 'lucide-react';
import { SESSIONS } from '../data/conference.js';
import { TABS } from './TabBar.jsx';
import { DAY_NAMES } from '../data/notifications.js';

const FILTER_LABELS = { speakers: 'Speakers', sponsors: 'Sponsors', exhibitors: 'Exhibitors' };

const when = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  timeZone: 'America/Los_Angeles',
});

export function formatSent(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : when.format(d);
}

// Where a notification leads, in words, so people know before they tap.
export function describeTarget(target) {
  if (target?.sessionId) {
    const s = SESSIONS.find(x => x.id === target.sessionId);
    if (s) return s.title;
  }
  const tab = TABS.find(t => t.id === target?.tab);
  if (!tab) return 'Home';
  if (target.tab === 'agenda' && target.day === 'all') return 'Agenda · All days';
  if (target.tab === 'agenda' && DAY_NAMES[target.day]) return `Agenda · ${DAY_NAMES[target.day]}`;
  const filter = FILTER_LABELS[target?.filter];
  return filter ? `${tab.label} · ${filter}` : tab.label;
}

export function NotificationsPanel({ items, readIds, now, onOpen, onMarkAllRead }) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <BellOff size={44} />
        <h4>No notifications yet</h4>
        <p>Updates from the conference team will show up here.</p>
      </div>
    );
  }
  const isScheduled = (n) => Date.parse(n.sentAt) > now;
  const anyUnread = items.some(n => !isScheduled(n) && !readIds.has(n.id));
  return (
    <>
      {anyUnread && (
        <button type="button" className="link-btn notif-mark-all" onClick={onMarkAllRead}>
          Mark all as read
        </button>
      )}
      <ul className="notif-list">
        {items.map(n => {
          const scheduled = isScheduled(n);
          const unread = !scheduled && !readIds.has(n.id);
          return (
            <li key={n.id}>
              <button
                type="button"
                className={`notif-item ${unread ? 'unread' : ''} ${scheduled ? 'scheduled' : ''}`}
                onClick={() => onOpen(n)}
              >
                {unread && <span className="notif-dot" aria-hidden="true" />}
                <span className="notif-main">
                  {unread && <span className="sr-only">Unread. </span>}
                  <span className="notif-title">{n.title}</span>
                  {n.body && <span className="notif-body">{n.body}</span>}
                  {/* Spans, not <ul>: a list is not valid inside a <button>. */}
                  {n.lines?.length > 0 && (
                    <span className="notif-lines">
                      {n.lines.map(l => <span key={l} className="notif-line">{l}</span>)}
                    </span>
                  )}
                  <span className="notif-meta">
                    <span>{scheduled ? `Scheduled · ${formatSent(n.sentAt)}` : formatSent(n.sentAt)}</span>
                    <span className="notif-goes">
                      {describeTarget(n.target)}
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// Surfaces the newest unread notification under the header, on any screen.
export function NotificationBanner({ item, onOpen, onDismiss }) {
  return (
    <div className="notif-banner" role="region" aria-label="New notification">
      <button type="button" className="notif-banner-main" onClick={() => onOpen(item)}>
        <span className="notif-banner-kicker">New</span>
        <span className="notif-banner-title">{item.title}</span>
        <span className="notif-banner-go">
          View <ArrowRight aria-hidden="true" />
        </span>
      </button>
      <button type="button" className="notif-banner-x" onClick={() => onDismiss(item)} aria-label="Dismiss notification">
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
