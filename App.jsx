import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Header } from './components/Header.jsx';
import { TabBar, TABS } from './components/TabBar.jsx';
import { Sheet } from './components/Sheet.jsx';
import { NotificationsPanel, NotificationBanner } from './components/Notifications.jsx';
import { ChallengeLiveBanner, challengeLive } from './components/ChallengeLiveBanner.jsx';
import { notificationsAt } from './data/notifications.js';
import { HomeScreen } from './screens/HomeScreen.jsx';
import { AgendaScreen } from './screens/AgendaScreen.jsx';
import { VenueScreen } from './screens/VenueScreen.jsx';
import { PeopleScreen } from './screens/PeopleScreen.jsx';
import { InfoScreen } from './screens/InfoScreen.jsx';
import { SessionDetail } from './screens/SessionDetail.jsx';
import { MaterialsScreen } from './screens/MaterialsScreen.jsx';
import { ChallengeScreen, CHALLENGE_STAFF } from './screens/ChallengeScreen.jsx';
import { PhotosScreen } from './screens/PhotosScreen.jsx';
import { FeedbackScreen, conferenceSurveyOpen, sessionSurveyOpen } from './screens/FeedbackScreen.jsx';
import { hasSessionSurvey } from './data/surveys.js';
import { loadDone, saveDone } from './data/surveyStore.js';
import { PEOPLE, SESSIONS } from './data/conference.js';

const HEADERS = {
  home:   { title: 'Statewide Synergy', sub: 'October 20–22, 2026' },
  agenda: { title: 'Agenda',            sub: 'Tue, Oct 20 — Thu, Oct 22' },
  venue:  { title: 'Venue & Map',       sub: 'Stonewall Resort' },
  people: { title: 'People',            sub: '' },
  info:   { title: 'Info & access',     sub: '' },
  feedback: { title: 'Feedback',        sub: 'Help shape next year' },
  materials: { title: 'Materials', sub: 'Session PDFs' },
  challenge: { title: 'Connections Challenge', sub: 'Thursday 11:30 AM' },
  photos: { title: 'Share photos', sub: 'Statewide Synergy 2026' },
};

const SAVED_KEY = 'wvarf-synergy:saved-v1';

function loadSavedIds() {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // localStorage unavailable or corrupt — fall back to defaults
  }
  return new Set(SESSIONS.filter(s => s.starred).map(s => s.id));
}

// Which notifications this person has read, by id, on this device.
const READ_KEY = 'wvarf-synergy:read-notifications-v1';

function loadReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // unavailable or corrupt — treat everything as unread
  }
  return new Set();
}

// Staff-only: add ?preview-notifications to the address to see scheduled
// notifications before they release.
const PREVIEW_NOTIFICATIONS = new URLSearchParams(window.location.search).has('preview-notifications');

// Re-checks the time every 30 seconds, and whenever the app comes back to
// the foreground, so scheduled notifications appear without a reload.
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = setInterval(tick, 30_000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, []);
  return now;
}

export default function App() {
  // ?challenge-staff opens straight to the staff drawing page.
  const [tab, setTab] = useState(CHALLENGE_STAFF ? 'challenge' : 'home');
  const [savedIds, setSavedIds] = useState(loadSavedIds);
  const [detailId, setDetailId] = useState(null);
  const [peopleFilter, setPeopleFilter] = useState('all');
  const [focusOrg, setFocusOrg] = useState(null);
  // A floor-plan room to highlight when a session's "Show on map" opens Venue.
  const [focusRoom, setFocusRoom] = useState(null);
  // A person whose card opens and scrolls into view (from the Home speakers).
  const [focusPerson, setFocusPerson] = useState(null);
  // Agenda day and Saved filter live here, not in AgendaScreen, so they
  // survive opening a session (which unmounts the agenda) and coming back.
  const [agendaDay, setAgendaDay] = useState('all');
  const [agendaFilter, setAgendaFilter] = useState('all');
  // People search, sort and open cards, kept here for the same reason: a
  // speaker's session opens over the directory and Back should return to it.
  const [peopleQuery, setPeopleQuery] = useState('');
  const [peopleSort, setPeopleSort] = useState('first');
  const [peopleOpen, setPeopleOpen] = useState(() => new Set());
  // Where the list was scrolled when a session opened, restored on Back.
  const returnScroll = useRef(null);
  const [readIds, setReadIds] = useState(loadReadIds);
  const [overlay, setOverlay] = useState(null); // 'menu' | 'notifications' | null
  // Feedback: which survey is open ('conference', a session id, or null for
  // the list), and which ones this device has already sent.
  const [surveyId, setSurveyId] = useState(null);
  const [surveysDone, setSurveysDone] = useState(loadDone);
  const now = useNow();

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...savedIds]));
    } catch {
      // ignore quota / private-mode failures
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...readIds]));
    } catch {
      // ignore quota / private-mode failures
    }
  }, [readIds]);

  const sessions = SESSIONS.map(s => ({ ...s, starred: savedIds.has(s.id) }));

  const toggleStar = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openSession = (s) => {
    returnScroll.current = window.scrollY;
    // An org focus only scrolls to that org on arrival; clearing it stops it
    // pulling the page away from where Back restores.
    setFocusOrg(null);
    setDetailId(s.id);
  };
  const closeDetail = () => setDetailId(null);

  // Before paint: a session opens at its top, and Back lands where the list
  // was rather than wherever the session page had been scrolled to.
  useLayoutEffect(() => {
    if (detailId) {
      window.scrollTo(0, 0);
    } else if (returnScroll.current != null) {
      window.scrollTo(0, returnScroll.current);
      returnScroll.current = null;
    }
  }, [detailId]);
  // Optional second arg pre-selects a People filter (e.g. sponsors carousel
  // on Home links to the sponsors section of the directory).
  const changeTab = (t, filter, org = null, personId = null) => {
    setDetailId(null);
    setFocusRoom(null);
    setSurveyId(null);
    if (t === 'people' && filter) setPeopleFilter(filter);
    setFocusOrg(t === 'people' ? org : null);
    // Each visit to People starts fresh, with the org's cards open if a
    // sponsor or exhibitor tile sent us here.
    setPeopleQuery('');
    setPeopleSort('first');
    setPeopleOpen(new Set(
      personId ? [personId] : org ? PEOPLE.filter(p => p.org === org).map(p => p.id) : []
    ));
    setFocusPerson(t === 'people' ? personId : null);
    // Switching tabs starts the agenda fresh, as before; only Back from a
    // session returns to the same day and scroll position.
    setAgendaDay('all');
    setAgendaFilter('all');
    returnScroll.current = null;
    // Every tab opens at its top, not wherever the last tab was scrolled to.
    window.scrollTo(0, 0);
    setTab(t);
  };

  const openSurvey = (id) => {
    changeTab('feedback');
    setSurveyId(id);
    window.scrollTo(0, 0);
  };
  const markSurveyDone = (id) => setSurveysDone(prev => {
    const next = new Set(prev).add(id);
    saveDone(next);
    return next;
  });

  // Stable so the open drawer's effect does not re-run on every render —
  // that would re-grab focus and forget which button opened it.
  const closeOverlay = useCallback(() => setOverlay(null), []);

  const markRead = (ids) => setReadIds(prev => new Set([...prev, ...ids]));

  // A target naming a session or tab that no longer exists falls back to
  // Home rather than leaving the tap doing nothing.
  const followTarget = (target) => {
    window.scrollTo(0, 0);
    if (target?.survey) {
      openSurvey(target.survey === 'list' ? null : target.survey);
      return;
    }
    if (target?.sessionId && SESSIONS.some(x => x.id === target.sessionId)) {
      setDetailId(target.sessionId);
      return;
    }
    const known = TABS.some(t => t.id === target?.tab) || ['challenge', 'feedback', 'photos'].includes(target?.tab);
    changeTab(known ? target.tab : 'home', target?.filter);
    if (target?.tab === 'agenda' && target.day) setAgendaDay(target.day);
  };

  const openNotification = (n) => {
    markRead([n.id]);
    setOverlay(null);
    followTarget(n.target);
  };

  const released = notificationsAt(now);
  const listed = PREVIEW_NOTIFICATIONS ? notificationsAt(now, { includeScheduled: true }) : released;
  const unread = released.filter(n => !readIds.has(n.id));
  // During the Challenge hour its own gold banner takes the top spot, so the
  // plain Challenge notices don't show a second banner underneath.
  const [liveHidden, setLiveHidden] = useState(false);
  const liveNow = challengeLive(now) && !CHALLENGE_STAFF;
  const showLive = liveNow && !liveHidden && !overlay && tab !== 'challenge';
  const newest = (overlay || showLive) ? null : unread.find(n => !(liveNow && /^(challenge-|remind-challenge|upnext-d3-1130am)/.test(n.id))) || null;

  const detail = detailId ? sessions.find(s => s.id === detailId) : null;
  const headerInfo = detail
    ? { title: 'Session', sub: '' }
    : HEADERS[tab];

  let screen;
  if (detail) {
    screen = (
      <SessionDetail
        session={detail}
        onBack={closeDetail}
        onToggleStar={toggleStar}
        onShowOnMap={(room) => { changeTab('venue'); setFocusRoom(room); }}
        onOpenChallenge={() => { changeTab('challenge'); window.scrollTo(0, 0); }}
        survey={hasSessionSurvey(detail) ? {
          open: sessionSurveyOpen(detail, now),
          done: surveysDone.has(detail.id),
          onOpen: () => openSurvey(detail.id),
        } : null}
      />
    );
  } else if (tab === 'home') {
    screen = (
      <HomeScreen
        sessions={sessions}
        onNavigate={t => { changeTab(t); window.scrollTo(0, 0); }}
        onOpenSession={openSession}
        onToggleStar={toggleStar}
        now={now}
        feedbackOpen={conferenceSurveyOpen(now) || SESSIONS.some(s => hasSessionSurvey(s) && sessionSurveyOpen(s, now))}
      />
    );
  } else if (tab === 'agenda') {
    screen = (
      <AgendaScreen
        day={agendaDay}
        onDayChange={setAgendaDay}
        filter={agendaFilter}
        onFilterChange={setAgendaFilter}
        sessions={sessions}
        onOpenSession={openSession}
        onToggleStar={toggleStar}
      />
    );
  } else if (tab === 'venue') {
    screen = <VenueScreen focusRoom={focusRoom} />;
  } else if (tab === 'people') {
    screen = (
      <PeopleScreen
        filter={peopleFilter}
        onFilterChange={setPeopleFilter}
        query={peopleQuery}
        onQueryChange={setPeopleQuery}
        sort={peopleSort}
        onSortChange={setPeopleSort}
        openIds={peopleOpen}
        onOpenIdsChange={setPeopleOpen}
        focusOrg={focusOrg}
        focusPerson={focusPerson}
        savedIds={savedIds}
        onToggleStar={toggleStar}
        onOpenSession={openSession}
      />
    );
  } else if (tab === 'info') {
    screen = <InfoScreen onNavigate={changeTab} />;
  } else if (tab === 'challenge') {
    screen = <ChallengeScreen now={now} />;
  } else if (tab === 'photos') {
    screen = <PhotosScreen />;
  } else if (tab === 'materials') {
    screen = <MaterialsScreen sessions={sessions} onOpenSession={openSession} />;
  } else if (tab === 'feedback') {
    screen = (
      <FeedbackScreen
        sessions={sessions}
        now={now}
        surveyId={surveyId}
        done={surveysDone}
        onOpenSurvey={openSurvey}
        onClose={() => { setSurveyId(null); window.scrollTo(0, 0); }}
        onDone={markSurveyDone}
      />
    );
  }

  return (
    <div className="app" data-screen-label={detail ? 'Session detail' : tab}>
      <Header
        title={headerInfo.title}
        subtitle={headerInfo.sub}
        logo={!detail && tab === 'home'}
        unread={unread.length}
        notificationsOpen={overlay === 'notifications'}
        onNotifications={() => setOverlay('notifications')}
        onPhotos={() => { changeTab('photos'); window.scrollTo(0, 0); }}
        photosActive={!detail && tab === 'photos'}
      />
      <main className="app-main">
      {showLive && (
        <ChallengeLiveBanner
          now={now}
          onOpen={() => { changeTab('challenge'); window.scrollTo(0, 0); }}
          onDismiss={() => setLiveHidden(true)}
        />
      )}
      {newest && (
        <NotificationBanner
          item={newest}
          onOpen={openNotification}
          onDismiss={n => markRead([n.id])}
        />
      )}
      {screen}
      </main>
      <TabBar active={tab} onChange={changeTab} />

      {overlay === 'notifications' && (
        <Sheet side="right" title="Notifications" onClose={closeOverlay}>
          <NotificationsPanel
            items={listed}
            now={now}
            readIds={readIds}
            onOpen={openNotification}
            onMarkAllRead={() => markRead(released.map(n => n.id))}
          />
        </Sheet>
      )}
    </div>
  );
}
