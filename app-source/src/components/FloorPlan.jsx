import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Maximize2, X } from 'lucide-react';
import { LEVELS, FLOOR_PLAN_SOURCE } from '../data/floorplan.js';
import { planRoomFor } from '../data/rooms.js';
import { ROOMS, SESSIONS } from '../data/conference.js';

// Short, sourced notes shown in the legend. From the resort's own room
// descriptions on its floor plan site.
const ROOM_NOTES = {
  'Oak Boardroom': 'Lake views and a fireplace',
  'Birch Room': 'Interior room',
  'Stonewall Ballroom': 'Divides into Ballroom I and Ballroom II',
  'Bluestone Room': 'Overlooks the lake and Terrace Lawn',
  'Sutton Room': 'Overlooks the lake and Terrace Lawn',
  'Tygart Room': 'Overlooks the lake and Terrace Lawn',
  'Summersville Room': 'Overlooks the lake and Terrace Lawn',
  'Maple Room': 'Interior room',
  'Pecan Room': 'Interior room',
  'Gauley Room': 'Track A breakouts',
  'Kanawha Room': 'Overlooks the lake and Terrace Lawn',
  'Greenbrier Room': 'Overlooks the lake and Terrace Lawn',
  'Potomac Room': 'Shared Office',
};

// Which floor-plan rooms this year's programme uses, and for what. Built from
// the agenda, so assigning a session to "Birch Room" lights it up here.
function eventUseByPlanRoom() {
  const uses = new Map();
  for (const s of SESSIONS) {
    const plan = planRoomFor(s.room);
    if (!plan) continue;
    if (!uses.has(plan.room)) uses.set(plan.room, []);
    uses.get(plan.room).push(s);
  }
  return uses;
}

// One short line per room for the legend, from the Venue room list
// (e.g. "Track C breakouts"), falling back to the session titles.
function roomSummary(planName, sessions) {
  const lines = ROOMS.filter(r => planRoomFor(r.name)?.room === planName)
    .map(r => (r.name === planName ? r.floor : `${r.name}: ${r.floor}`));
  return lines.length ? lines.join(' · ') : sessions.map(s => s.title).join(' · ');
}

function PlanSvg({ level, viewBox, pinScale, focus, uses, title }) {
  const r = pinScale;
  return (
    <svg
      className="fp-svg"
      viewBox={viewBox.join(' ')}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
    >
      <path d={level.walls} className="fp-walls" />
      <path d={level.detail} className="fp-detail" />
      {level.rooms.map(room => {
        const used = uses.has(room.name);
        const focused = focus === room.name;
        return (
          <g key={room.name} className={`fp-room${used ? ' is-event' : ''}${focused ? ' is-focus' : ''}`}>
            {room.polys.map((p, i) => <polygon key={i} points={p} />)}
          </g>
        );
      })}
      {level.dividers && <path d={level.dividers} className="fp-divider" />}
      {level.rooms.map((room, i) => {
        const used = uses.has(room.name);
        return (
          <g key={`pin-${room.name}`} className={`fp-pin${used ? ' is-event' : ''}${focus === room.name ? ' is-focus' : ''}`} aria-hidden="true">
            <circle cx={room.cx} cy={room.cy} r={r} />
            <text x={room.cx} y={room.cy} dy="0.36em" fontSize={r * 1.05}>{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Lightbox({ level, focus, uses, onClose }) {
  const closeRef = useRef(null);
  const stageRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    // Open centred on the meeting wing, not on the top-left of the building.
    const stage = stageRef.current;
    if (stage) {
      const [x, y, w, h] = level.crop;
      const cx = (x + w / 2) / level.width;
      const cy = (y + h / 2) / level.height;
      requestAnimationFrame(() => {
        stage.scrollLeft = cx * stage.scrollWidth - stage.clientWidth / 2;
        stage.scrollTop = cy * stage.scrollHeight - stage.clientHeight / 2;
      });
    }
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose, level]);

  // The whole floor, so the meeting wing can be seen in context. Pins are
  // sized to the full floor so they stay legible when it is drawn large.
  const full = [0, 0, level.width, level.height];
  return (
    <div className="map-lightbox" role="dialog" aria-modal="true" aria-label={`${level.label} floor plan, enlarged`} onClick={onClose}>
      <button ref={closeRef} type="button" className="map-lightbox-close" onClick={onClose}>
        <X aria-hidden="true" />
        Close
      </button>
      <div ref={stageRef} className="map-lightbox-stage fp-lightbox-stage" onClick={e => e.stopPropagation()}>
        <div className="fp-lightbox-canvas">
          <PlanSvg
            level={level}
            viewBox={full}
            pinScale={level.width * 0.016}
            focus={focus}
            uses={uses}
            title={`${level.label}, whole floor. Meeting rooms are numbered; see the list below the map.`}
          />
        </div>
      </div>
      <p className="map-lightbox-hint">The whole {level.label}. Drag to move around. Tap outside to close.</p>
    </div>
  );
}

/**
 * Stonewall Resort meeting-space map, one level at a time.
 * `focusRoom` (a floor-plan room name) opens the right level and highlights
 * that room — used when a session's "Show on map" sends someone here.
 */
export function FloorPlan({ focusRoom = null }) {
  const uses = useMemo(eventUseByPlanRoom, []);
  const initial = focusRoom
    ? LEVELS.find(l => l.rooms.some(r => r.name === focusRoom))?.key
    : 'terrace'; // most of the conference is on the Terrace Level
  const [levelKey, setLevelKey] = useState(initial || LEVELS[0].key);
  const [zoomed, setZoomed] = useState(false);
  const level = LEVELS.find(l => l.key === levelKey) || LEVELS[0];
  const stageRef = useRef(null);

  useEffect(() => {
    if (focusRoom) stageRef.current?.scrollIntoView({ block: 'start' });
  }, [focusRoom]);

  return (
    <div className="fp" ref={stageRef}>
      <div className="fp-levels" role="group" aria-label="Choose a level">
        {LEVELS.map(l => (
          <button
            key={l.key}
            type="button"
            className={`fp-level-btn${l.key === levelKey ? ' active' : ''}`}
            aria-pressed={l.key === levelKey}
            onClick={() => setLevelKey(l.key)}
          >
            <span className="fp-level-name">{l.label}</span>
            <span className="fp-level-floor">{l.floor}</span>
          </button>
        ))}
      </div>

      <p className="fp-level-note">{level.note}</p>

      <ul className="fp-colorkey" aria-label="Map colors">
        <li><span className="fp-swatch event" aria-hidden="true" />Conference rooms</li>
        {focusRoom && <li><span className="fp-swatch focus" aria-hidden="true" />Your session</li>}
        <li><span className="fp-swatch other" aria-hidden="true" />Not in use</li>
      </ul>

      <button type="button" className="fp-stage" onClick={() => setZoomed(true)}>
        <PlanSvg
          level={level}
          viewBox={level.crop}
          pinScale={level.crop[2] * 0.046}
          focus={focusRoom}
          uses={uses}
          title={`${level.label} meeting rooms. Rooms are numbered; the list below names each one.`}
        />
        <span className="map-zoom-bar">
          <Maximize2 aria-hidden="true" />
          Tap to see the whole floor
        </span>
      </button>

      <ol className="fp-legend" aria-label={`${level.label} meeting rooms`}>
        {level.rooms.map((room, i) => {
          const sessions = uses.get(room.name) || [];
          const focused = focusRoom === room.name;
          return (
            <li key={room.name} className={`fp-legend-item${sessions.length ? ' is-event' : ''}${focused ? ' is-focus' : ''}`}>
              <span className="fp-legend-pin" aria-hidden="true">{i + 1}</span>
              <span className="fp-legend-text">
                <span className="fp-legend-name">{room.name}</span>
                {sessions.length > 0 ? (
                  <span className="fp-legend-use">
                    {roomSummary(room.name, sessions)}
                  </span>
                ) : (
                  ROOM_NOTES[room.name] && <span className="fp-legend-note">{ROOM_NOTES[room.name]}</span>
                )}
              </span>
              {focused
                ? <span className="fp-legend-badge">Your session</span>
                : sessions.length > 0 && <span className="fp-legend-badge">This conference</span>}
            </li>
          );
        })}
      </ol>

      {level.dividers && (
        <p className="fp-key">
          <span className="fp-key-dash" aria-hidden="true" />
          Dashed line: the Stonewall Ballroom's movable divider, which splits it into Ballroom I and Ballroom II.
        </p>
      )}

      <p className="fp-source">
        Floor plan redrawn from the resort's published plans.{' '}
        <a href={FLOOR_PLAN_SOURCE.url} target="_blank" rel="noopener noreferrer">
          Open the interactive version
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">, opens in a new tab</span>
        </a>
      </p>

      {zoomed && <Lightbox level={level} focus={focusRoom} uses={uses} onClose={() => setZoomed(false)} />}
    </div>
  );
}
