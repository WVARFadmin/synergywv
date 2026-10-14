import { Clock, MapPin, Ticket } from 'lucide-react';
import { CHALLENGE, SQUARES } from '../data/challenge.js';

// Home's invitation to the Synergy Connections Challenge (the in-app game).
export function ChallengeCard({ onPlay }) {
  return (
    <div className="challenge-card">
      <h4 className="challenge-title">{CHALLENGE.title}</h4>
      <p className="challenge-blurb">
        A {SQUARES.length}-square passport for the Thursday networking hour: visit WVABLE and the
        Down Syndrome Network, trade takeaways from sessions you missed, find your funny-badge
        twin and snap a group photo. Every square earns a ticket for the gift basket.
      </p>
      <ul className="challenge-facts">
        <li><Clock aria-hidden="true" />{CHALLENGE.when}</li>
        <li><MapPin aria-hidden="true" />{CHALLENGE.where}</li>
        <li><Ticket aria-hidden="true" />{CHALLENGE.prize}</li>
      </ul>
      <button type="button" className="challenge-cta" onClick={onPlay}>Open my Challenge card</button>
    </div>
  );
}
