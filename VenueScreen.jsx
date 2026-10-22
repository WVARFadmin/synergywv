import { CalendarClock, Info, Navigation, Laptop, Map as MapIcon, MapPin } from 'lucide-react';
import { ROOMS, ROOMS_NOTE, SHARED_OFFICE, VENUE } from '../data/conference.js';
import { FloorPlan } from '../components/FloorPlan.jsx';

export function VenueScreen({ focusRoom = null }) {
  return (
    <div className="content venue-content">
      <div className="eyebrow">Venue</div>
      <h2 className="section-title">{VENUE.name}</h2>

      <div className="venue-card">
        <div className="venue-head">
          <MapPin aria-hidden="true" />
          <div>
            <div className="venue-address">{VENUE.address}</div>
            <p className="venue-drive">Driving in? Get turn-by-turn directions to the resort.</p>
            <a className="venue-directions" href={VENUE.mapUrl} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden="true" />
              Directions in maps
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </div>
      </div>

      <div className="notif info office-note">
        <Laptop size={18} />
        <div>
          <strong>{SHARED_OFFICE.name} · {SHARED_OFFICE.room}</strong>
          {SHARED_OFFICE.summary} {SHARED_OFFICE.where} {SHARED_OFFICE.note}
        </div>
      </div>

      <h3 className="venue-h3">
        <MapIcon aria-hidden="true" />
        Find your way
      </h3>
      <div className="venue-card fp-card">
        <FloorPlan focusRoom={focusRoom} />
      </div>

      <h3 className="venue-h3">
        <CalendarClock aria-hidden="true" />
        Where things happen
      </h3>
      <div className="venue-card">
        <div className="map-list">
          {ROOMS.map(r => (
            <div key={r.id} className="room-item">
              <span>{r.name}</span>
              <span className="floor">{r.floor}</span>
              {r.where && <span className="room-where">{r.where}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="notif info" style={{ marginTop: 14 }}>
        <Info size={18} />
        <div>
          <strong>Room assignments</strong>
          {ROOMS_NOTE}
        </div>
      </div>

    </div>
  );
}
