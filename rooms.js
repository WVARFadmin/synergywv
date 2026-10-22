import { LEVELS } from './floorplan.js';

// Programme room names that refer to a room on the resort floor plan under a
// different name. The ballroom splits into two halves; the published plan
// doesn't say which half is which, so both point at the whole ballroom.
const ALIASES = {
  'ballroom i': 'Stonewall Ballroom',
  'ballroom ii': 'Stonewall Ballroom',
  'ballroom 1': 'Stonewall Ballroom',
  'ballroom 2': 'Stonewall Ballroom',
  'stonewall ballroom i': 'Stonewall Ballroom',
  'stonewall ballroom ii': 'Stonewall Ballroom',
  'stonewall ballroom 1': 'Stonewall Ballroom',
  'stonewall ballroom 2': 'Stonewall Ballroom',
};

/**
 * The floor-plan room (and level) a programme room name refers to, or null
 * when it isn't on the published plan (e.g. the Terrace Lawn). The Gauley
 * Room was added to the plan by hand: it is the unlabeled room at the top of the row, next to Kanawha. Matching is case-insensitive.
 */
export function planRoomFor(name) {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  const target = (ALIASES[key] || name).trim().toLowerCase();
  for (const level of LEVELS) {
    const room = level.rooms.find(r => r.name.toLowerCase() === target);
    if (room) return { room: room.name, level: level.key, levelLabel: level.label };
  }
  return null;
}
