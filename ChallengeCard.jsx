import { Clock, Lock, MapPin, Ticket } from 'lucide-react';
import { CHALLENGE, SQUARES } from '../data/challenge.js';
import { challengeRevealed } from '../data/challengeGate.js';

// Home's invitation to the Synergy Connections Challenge (the in-app game).
// Until 2 minutes before it starts, the card doesn't say what the squares are.
export function ChallengeCard({ onPlay, now = Date.now() }) {
  const revealed = challengeRevealed(now);
  return (
    <div className="challenge-card">
      <h4 className="challenge-title">{CHALLENGE.title}</h4>
      {revealed ? (
        <p className="challenge-blurb">
          A {SQUARES.length}-square passport for the Thursday networking hour: visit WV Relay and the
          Down Syndrome Network, trade takeaways from sessions you missed, find your funny-badge
          twin and snap a group photo. Every square earns a ticket for the gift basket.
        </p>
      ) : (
        <p className="challenge-blurb">
          A networking game for the Thursday hour, played right here in the app. Every square you
          finish earns a ticket for the gift basket. The card stays a surprise: it unlocks at 11:28 AM
          Thursday, just before the Challenge starts.
        </p>
      )}
      <ul className="challenge-facts">
        <li><Clock aria-hidden="true" />{CHALLENGE.when}</li>
        <li><MapPin aria-hidden="true" />{CHALLENGE.where}</li>
        <li><Ticket aria-hidden="true" />{CHALLENGE.prize}</li>
      </ul>
      {revealed
        ? <button type="button" className="challenge-cta" onClick={onPlay}>Open my Challenge card</button>
        : <p className="challenge-locked"><Lock aria-hidden="true" />Card unlocks Thursday at 11:28 AM</p>}
    </div>
  );
}
