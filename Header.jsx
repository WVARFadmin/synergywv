import { Bell, Camera } from 'lucide-react';
import { WvarfLogo } from './WvarfLogo.jsx';

export function Header({ title, subtitle, logo = false, unread = 0, notificationsOpen, onNotifications, onPhotos, photosActive = false }) {
  const bellLabel = unread
    ? `Notifications, ${unread} unread`
    : 'Notifications';
  return (
    <div className="app-header">
      <div className="row">
        {/* Phones: share conference photos. Computers use "Photos" in the
            sidebar, so this button is hidden there (see app.css). */}
        <button type="button" className={`hbtn hbtn-photos${photosActive ? ' active' : ''}`} aria-label="Share conference photos" onClick={onPhotos}>
          <Camera />
        </button>
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
