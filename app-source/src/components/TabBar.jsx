import { Home, CalendarDays, MapPin, Users, Info, MessageSquareText, FileText, Sparkles, Camera } from 'lucide-react';

export const TABS = [
  { id: 'home',   icon: Home,         label: 'Home' },
  { id: 'agenda', icon: CalendarDays, label: 'Agenda' },
  { id: 'venue',  icon: MapPin,       label: 'Venue' },
  { id: 'people', icon: Users,        label: 'People' },
  { id: 'materials', icon: FileText,     label: 'Materials' },
  { id: 'info',   icon: Info,         label: 'Info' },
  { id: 'feedback', icon: MessageSquareText, label: 'Feedback' },
];

export function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" aria-label="Primary">
      {TABS.map(t => {
        const Ico = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            className={`tb ${isActive ? 'active' : ''}`}
            onClick={() => onChange(t.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Ico size={22} />
            <span>{t.label}</span>
          </button>
        );
      })}
      {/* The Challenge opens from its Home card on phones; computers also
          get it in the sidebar. */}
      <button
        className={`tb tb-wide-only ${active === 'challenge' ? 'active' : ''}`}
        onClick={() => onChange('challenge')}
        aria-current={active === 'challenge' ? 'page' : undefined}
      >
        <Sparkles size={22} />
        <span>Challenge</span>
      </button>
      <button
        className={`tb tb-wide-only ${active === 'photos' ? 'active' : ''}`}
        onClick={() => onChange('photos')}
        aria-current={active === 'photos' ? 'page' : undefined}
      >
        <Camera size={22} />
        <span>Photos</span>
      </button>
    </nav>
  );
}
