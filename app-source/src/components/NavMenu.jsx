import { MessageSquareText, Sparkles } from 'lucide-react';
import { TABS } from './TabBar.jsx';

// Destinations that are in the menu but not the bottom bar.
const EXTRA = [
  { id: 'challenge', icon: Sparkles, label: 'Connections Challenge' },
  { id: 'feedback', icon: MessageSquareText, label: 'Feedback & surveys' },
];

// Same destinations as the bottom tab bar, as a list with room for labels.
export function NavMenu({ active, onNavigate }) {
  return (
    <nav aria-label="All sections">
      <ul className="nav-menu">
        {[...TABS, ...EXTRA].map(t => {
          const Ico = t.icon;
          const current = active === t.id;
          return (
            <li key={t.id}>
              <button
                type="button"
                className={`nav-item ${current ? 'active' : ''}`}
                aria-current={current ? 'page' : undefined}
                onClick={() => onNavigate(t.id)}
              >
                <Ico aria-hidden="true" />
                <span>{t.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
