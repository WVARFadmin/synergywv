import { Bell } from 'lucide-react';
import { WvarfLogo } from './WvarfLogo.jsx';

export function Header({ title, subtitle, logo = false, unread = 0, notificationsOpen, onNotifications }) {
  const bellLabel = unread
    ? `Notifications, ${unread} unread`
    : 'Notifications';
  return (
    <div className="app-header">
      <div className="row">
        {/* Spacer the same size as the bell, so the title stays centered. */}
        <span className="hbtn hbtn-spacer" aria-hidden="true" />
        {logo ? (
          <div className="header-brand">
            <WvarfLogo height={38} mark reverse className="header-logo" alt="WVARF" />
            <div>
              <h1>{title}</h1>
              {subtitle && <div className="sub">{subtitle}</div>}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1>{title}</h1>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
        )}
        <button
          type="button"
          className="hbtn bell"
          aria-label={bellLabel}
          aria-haspopup="dialog"
          aria-expanded={notificationsOpen}
          onClick={onNotifications}
        >
          <Bell />
          {unread > 0 && <span className="bell-badge" aria-hidden="true">{unread > 9 ? '9+' : unread}</span>}
        </button>
      </div>
    </div>
  );
}
