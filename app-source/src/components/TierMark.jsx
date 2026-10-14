import { Award, Gem, Medal, Sparkles, Trophy } from 'lucide-react';

// Each WVARF sponsorship level has its own color and icon, used on the Home
// tiles and in People. `short` fits a tile ribbon; `badge` names the level in
// full on a person card.
const TIERS = {
  'Gold Sponsor':                   { key: 'gold',     Icon: Trophy,   short: 'Gold',     badge: 'Gold Sponsor' },
  'Silver Sponsor':                 { key: 'silver',   Icon: Medal,    short: 'Silver',   badge: 'Silver Sponsor' },
  'Bronze Sponsor':                 { key: 'bronze',   Icon: Award,    short: 'Bronze',   badge: 'Bronze Sponsor' },
  'Gemstone Sponsor':               { key: 'gemstone', Icon: Gem,      short: 'Gemstone', badge: 'Gemstone Sponsor' },
  'Awards Night Reception Sponsor': { key: 'banquet',  Icon: Sparkles, short: 'Awards Night', badge: 'Awards Night Reception Sponsor' },
};

export function tierInfo(tier) {
  return TIERS[tier] || null;
}

/** Decorative: the tier's name is always shown in text beside it. */
export function TierIcon({ info }) {
  const { Icon } = info;
  return <Icon className="tier-icon" aria-hidden="true" />;
}
