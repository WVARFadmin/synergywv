import { Sparkles, X, ArrowRight } from 'lucide-react';
import { CHALLENGE } from '../data/challenge.js';

// The Challenge hour gets its own bold gold banner at the top of every screen
// (except the Challenge itself) from the moment it opens until turn-in closes,
// so nobody needs a new button to find it. From 12:20 it switches to a
// last-call message.
const LAST_CALL = Date.parse('2026-10-22T12:20:00-04:00');

export function challengeLive(now) {
  return now >= Date.parse(CHALLENGE.opens) && now < Date.parse(CHALLENGE.closes);
}

export function ChallengeLiveBanner({ now, onOpen, onDismiss }) {
  const last = now >= LAST_CALL;
  return (
    <div className={`ch-live-banner${last ? ' last' : ''}`} role="region" aria-label="Synergy Connections Challenge">
      <button type="button" className="ch-live-main" onClick={onOpen}>
        <Sparkles className="ch-live-ico" aria-hidden="true" />
        <span className="ch-live-text">
          <span className="ch-live-kicker">{last ? 'Last call' : 'Happening now'}</span>
          <span className="ch-live-title">{last ? 'Turn in your Challenge card by 12:40' : 'The Synergy Connections Challenge is on!'}</span>
          <span className="ch-live-sub">{last ? 'Every square is a ticket for the gift basket.' : 'Terrace Foyer · until 12:30 PM'}</span>
        </span>
        <span className="ch-live-go">Open my card <ArrowRight aria-hidden="true" /></span>
      </button>
      <button type="button" className="ch-live-x" onClick={onDismiss} aria-label="Hide Challenge banner">
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
