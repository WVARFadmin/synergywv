import { SESSION_DESCRIPTIONS, SPEAKER_BIOS } from './program.js';

// ============================================================
// Statewide Synergy: The Power of People & Procurement
// 2nd Annual State Use Conference — WVARF
// Stonewall Resort, Roanoke, WV — October 20–22, 2026
//
// Agenda, speakers, sponsors and venue details are transcribed from the
// official event page at https://synergywv.rsvpify.com/. Anything not
// published there is marked TBA rather than invented.
// ============================================================

// Tags that gate who may attend, rather than describing a topic — styled
// distinctly so a restriction is never mistaken for a subject label.
export const RESTRICTED_TAGS = new Set(['Remote training', 'Ticketed']);

// Reads after the restricted pill in the agenda legend.
export const EXEC_DAY_NOTE = 'sessions run virtually, alongside the in-person programme.';

export const DAYS = [
  { id: 1, label: 'Tue', date: 'Tue, Oct 20', full: 'Tuesday, October 20' },
  { id: 2, label: 'Wed', date: 'Wed, Oct 21', full: 'Wednesday, October 21' },
  { id: 3, label: 'Thu', date: 'Thu, Oct 22', full: 'Thursday, October 22' },
];

// Breakout tracks, as described on the event page.
export const TRACKS = [
  { id: 'A', label: 'Track A', name: 'Capacity Building & Organization Longevity' },
  { id: 'B', label: 'Track B', name: 'Sales & Marketing' },
  { id: 'C', label: 'Track C', name: 'Client Support & Vocational Rehabilitation' },
];

export const TRACK_NOTE =
  'Breakout sessions are divided into themed tracks to better suit your organization and career development needs!';

// 2026 Statewide Synergy agenda, transcribed from the published
// "Schedule at a Glance" and "Session Details" sections.
//
// ROOMS AND SPEAKERS: from WVARF's "Conference Session Schedule 2026"
// spreadsheet (October 2026). Meal rooms from Nita, October 18.
export const SESSIONS = [
  // ---------- Tuesday, October 20 — pre-conference ----------
  {
    id: 'd0', day: 1, time: '7:30 PM', dur: '2 hrs',
    title: 'Conference Reception & Networking Social',
    room: 'Terrace Lawn', speaker: '',
    tags: ['Pre-conference', 'Social'], access: [], live: false, starred: true,
  },

  // ---------- Wednesday, October 21 — Day 1 ----------
  {
    id: 'w1', day: 2, time: '7:30 AM', dur: '1 hr',
    title: 'Registration & Networking Breakfast',
    room: 'Terrace Foyer', speaker: '',
    tags: ['Meal'], access: [], live: false, starred: false,
  },
  {
    id: 'w2', day: 2, time: '8:30 AM', dur: '1 hr',
    title: 'Welcome & Keynote: Leaning Into Leadership',
    room: 'Pecan Room', speaker: 'Aaron Golub',
    tags: ['Keynote'], access: [], live: false, starred: true,
  },
  {
    id: 'w3', day: 2, time: '9:45 AM', dur: '1 hr',
    title: 'Legislative Updates & Advocating as a Nonprofit',
    room: 'Pecan Room', speaker: 'Delegate Anitra Hamilton (WV House of Delegates), Delegate Adam Burkhammer (WV House of Delegates) & Daniel Hall (Access Strategies)',
    tags: ['Plenary', 'Advocacy'], access: [], live: false, starred: false,
  },
  {
    id: 'w4a', day: 2, time: '11:00 AM', dur: '1 hr',
    title: 'Creating Practical AI Agents for Business Development & Sales',
    room: 'Pecan Room', speaker: 'David Mitchell (SW Resources)',
    tags: ['Breakout 1', 'Track A', 'Track B'], access: [], live: false, starred: false,
  },
  {
    id: 'w4c', day: 2, time: '11:00 AM', dur: '1 hr',
    title: 'Innovative CIE Partnerships & Placements',
    room: 'Greenbrier Room', speaker: 'Alyce Almond (WV DRS), Angie Reed (WV DRS), Jamie Childers (WV DRS) & Mike Lamb (WV DRS)',
    tags: ['Breakout 1', 'Track C'], access: [], live: false, starred: false,
  },
  {
    id: 'w5', day: 2, time: '12:00 PM', dur: '1 hr',
    title: 'Buffet Lunch', room: 'Stillwaters Restaurant', speaker: '',
    tags: ['Meal'], access: [], live: false, starred: false,
  },
  {
    id: 'w6a', day: 2, time: '1:15 PM', dur: '1 hr',
    title: "Who's Next? Building a Succession Plan Before You Need One",
    room: 'Gauley Room', speaker: 'Aimee White (AlignHR)',
    tags: ['Breakout 2', 'Track A'], access: [], live: false, starred: false,
  },
  {
    id: 'w6b', day: 2, time: '1:15 PM', dur: '1 hr',
    title: 'From Production to Purchase: Growing Our eCommerce Pipeline',
    room: 'Kanawha Room', speaker: 'Dathum Cummings (WVARF) & Andrea Higginbotham (WVARF)',
    tags: ['Breakout 2', 'Track B'], access: [], live: false, starred: false,
  },
  {
    id: 'w6c', day: 2, time: '1:15 PM', dur: '1 hr',
    title: 'Hiring Solutions and Disability Disclosure',
    room: 'Greenbrier Room', speaker: 'Travis Kline (Job Squad)',
    tags: ['Breakout 2', 'Track C'], access: [], live: false, starred: false,
  },
  {
    id: 'w7', day: 2, time: '2:15 PM', dur: '30 min',
    title: 'Snack Break', room: 'Terrace Foyer', speaker: '',
    tags: ['Break'], access: [], live: false, starred: false,
  },
  {
    id: 'w8a', day: 2, time: '2:45 PM', dur: '1 hr',
    title: 'More Mission for Your Money: Smart Purchasing Strategies',
    room: 'Gauley Room', speaker: 'Mark Fox (WV Surplus Property), Morgan Hassig (WVARF) & Michael Yon (RESPECT of FL)',
    tags: ['Breakout 3', 'Track A'], access: [], live: false, starred: false,
  },
  {
    id: 'w8b', day: 2, time: '2:45 PM', dur: '1 hr',
    title: 'Strategy to Story: Aligning Your Plan, Brand & Message',
    room: 'Kanawha Room', speaker: 'Morgan Robinson (Focus Marketing Company)',
    tags: ['Breakout 3', 'Track B'], access: [], live: false, starred: false,
  },
  {
    id: 'w8c', day: 2, time: '2:45 PM', dur: '1 hr',
    title: 'Empowering Employment: The Partnership Between Benefits Counseling and WVABLE',
    room: 'Greenbrier Room',
    speaker: 'Audra Spenia (Job Squad) & Roxanne Clay (WVABLE)',
    panel: ['p17', 'p6'],
    tags: ['Breakout 3', 'Track C'], access: [], live: false, starred: false,
  },
  {
    id: 'w9r', day: 2, time: '5:30 PM', dur: '1 hr',
    title: 'Awards Night Reception & Cocktail Hour',
    room: 'Ballroom Foyer', speaker: '',
    tags: ['Awards', 'Social'], access: [], live: false, starred: true,
  },
  {
    id: 'w9', day: 2, time: '6:30 PM', dur: '2 hrs 30 min',
    title: 'State Use Program Awards Banquet',
    room: 'Ballroom II', speaker: '',
    tags: ['Awards', 'Social'], access: [], live: false, starred: true,
  },

  // ---------- Thursday, October 22 — Day 2 ----------
  {
    id: 't1', day: 3, time: '8:00 AM', dur: '1 hr',
    title: 'Networking Breakfast', room: 'Terrace Foyer', speaker: '',
    tags: ['Meal'], access: [], live: false, starred: false,
  },
  {
    id: 't2', day: 3, time: '9:00 AM', dur: '1 hr',
    title: 'Plenary: Building an Accessible Digital Front Door for Every Visitor',
    room: 'Pecan Room', speaker: 'Tina Cobb (WVARF)',
    tags: ['Plenary', 'Accessibility'], access: [], live: false, starred: false,
  },
  {
    id: 't3a', day: 3, time: '10:15 AM', dur: '1 hr',
    title: 'Cash Is King: Managing Cash Flow When the Money Isn\u2019t There Yet',
    // Oct 21: Thursday's Gauley and Potomac events swapped (Nita).
    room: 'Potomac Room', speaker: 'Morgan Hassig (WVARF)',
    tags: ['Breakout 4', 'Track A'], access: [], live: false, starred: false,
  },
  {
    // Moved from Breakout 5 (1:30 PM) in the October 13 schedule.
    id: 't6a', day: 3, time: '10:15 AM', dur: '1 hr',
    title: 'Beyond Cleaning: Building Capacity for Total Facilities Management',
    room: 'Kanawha Room', speaker: 'Zach Sandy (Job Squad)',
    tags: ['Breakout 4', 'Track B'], access: [], live: false, starred: false,
  },
  {
    id: 't3c', day: 3, time: '10:15 AM', dur: '1 hr',
    title: 'Leveraging Job Negotiation with Local Employers for CIE Placement',
    room: 'Greenbrier Room', speaker: 'Travis Kline (Job Squad) & Audra Spenia (Job Squad)',
    tags: ['Breakout 4', 'Track C'], access: [], live: false, starred: false,
  },
  {
    id: 'rj1', day: 3, time: '10:15 AM', dur: '2 hrs 15 min',
    title: 'Remote Janitorial Contract Management Training',
    room: 'Gauley Room', speaker: 'Andrea Higginbotham (WVARF), Misty Mayville (WVARF) & Gary Wolfe (WVARF)',
    tags: ['Remote training'], access: [], live: false, starred: false,
  },
  {
    id: 't4', day: 3, time: '11:30 AM', dur: '1 hr',
    title: 'Synergy Connections Challenge',
    room: 'Terrace Foyer', speaker: '',
    tags: ['Networking'], access: [], live: false, starred: true,
  },
  {
    id: 't5', day: 3, time: '12:30 PM', dur: '1 hr',
    title: 'Buffet Lunch', room: 'Stillwaters Restaurant', speaker: '',
    tags: ['Meal'], access: [], live: false, starred: false,
  },
  {
    // New in the October 13 schedule.
    id: 't6t', day: 3, time: '1:30 PM', dur: '1 hr',
    title: 'Free & Nearly Free Tech: Big Tools for Small Nonprofit Budgets',
    room: 'Pecan Room', speaker: 'Michael Yon (RESPECT of FL)',
    tags: ['Breakout 5', 'Track A', 'Track B'], access: [], live: false, starred: false,
  },
  {
    id: 't6c', day: 3, time: '1:30 PM', dur: '1 hr',
    title: 'Expanding the Apprenticeship Toolbox: New Pathways & DOL Resources',
    room: 'Greenbrier Room', speaker: 'Misty Mayville (WVARF) & Adam Mouse (U.S. Department of Labor)',
    tags: ['Breakout 5', 'Track C'], access: [], live: false, starred: false,
  },
  {
    id: 't8', day: 3, time: '3:00 PM', dur: '1 hr',
    title: 'Closing Plenary: The State of Disability Employment in WV',
    room: 'Pecan Room', speaker: 'Aaron Topping (WV DRS), Jason Roberts (Workforce WV) & Myriah Jenkins (The Arc of Harrison County)',
    tags: ['Plenary'], access: [], live: false, starred: false,
  },
];

// When a breakout time has only two sessions, one in the Pecan Room and one
// in the Greenbrier Room (Track C), the Pecan session serves both Track A and
// Track B.
(() => {
  const blocks = new Map();
  for (const s of SESSIONS) {
    const b = (s.tags || []).find(t => /^Breakout /.test(t));
    if (!b) continue;
    const key = `${s.day}|${s.time}|${b}`;
    if (!blocks.has(key)) blocks.set(key, []);
    blocks.get(key).push(s);
  }
  for (const list of blocks.values()) {
    const rooms = list.map(s => s.room);
    if (list.length === 2 && rooms.includes('Pecan Room') && rooms.includes('Greenbrier Room')) {
      const pecan = list.find(s => s.room === 'Pecan Room');
      pecan.tags = [...pecan.tags.filter(t => !/^Track /.test(t)), 'Track A', 'Track B'];
    }
  }
})();

// Tags as shown on cards: a session in both Track A and Track B shows one
// "Tracks A & B" pill.
export function displayTags(tags = []) {
  if (tags.includes('Track A') && tags.includes('Track B')) {
    const out = [];
    for (const t of tags) {
      if (t === 'Track A') out.push('Tracks A & B');
      else if (t !== 'Track B') out.push(t);
    }
    return out;
  }
  return tags;
}

// Headshots are served from the event page's CDN. `photo` is optional —
// a person without one falls back to their initials.
const CDN = 'https://cdn.rsvpify.com/users/959774';

export const PEOPLE = [
  // ---- Keynote and honoured guests ----
  { id: 'p1', initials: 'AG', name: 'Aaron Golub', role: 'Keynote speaker', org: '', color: 'c1', speaker: true, sponsor: false, exhibitor: false, website: 'https://www.aarongolub.com/', photo: `${CDN}/6464120/1676521003989.jpg` },
  { id: 'p2', initials: 'AH', name: 'Anitra Hamilton', role: 'Delegate, WV House of Delegates (District 81)', org: 'West Virginia House of Delegates', color: 'c2', speaker: true, sponsor: false, exhibitor: false, website: 'https://www.wvlegislature.gov/house/lawmaker.cfm?member=Delegate%20Hamilton', photo: `${CDN}/6700140/Anitra-Hamilton-Headshot.jpg` },
  { id: 'p3', initials: 'AB', name: 'Adam Burkhammer', role: 'Delegate, WV House of Delegates (Lewis & Upshur)', org: 'West Virginia House of Delegates', color: 'c3', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6700161/Burkhammer_Adam-2025.JPG` },

  // ---- Speakers ----
  { id: 'p4', initials: 'AA', name: 'Alyce Almond', role: 'Employment Service Manager', org: 'WV Division of Rehabilitation Services', color: 'c4', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6559845/Alyce-Almond-Headshot.jpg` },
  { id: 'p5', initials: 'AT', name: 'Aaron Topping', role: 'Senior Manager, Field Specialty Programs', org: 'WV Division of Rehabilitation Services', color: 'c5', speaker: true, sponsor: false, exhibitor: false, photo: 'https://wvdrs.org/wp-content/uploads/2026/04/Aaron-Topping.jpg' },
  { id: 'p6', initials: 'RC', name: 'Roxanne Clay', role: 'Director, WVABLE Savings Program', org: 'WVABLE', color: 'c1', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6570143/CLAYRO-1.JPG` },
  { id: 'p7', initials: 'TC', name: 'Tina Cobb', role: 'Technology professional & WVARF board member', org: 'WVARF', color: 'c2', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6552341/Tina-Cobb-Headshot.png`, photoPos: { x: 50, y: 30, zoom: 1 } },
  { id: 'p8', initials: 'DC', name: 'Dathum Cummings', role: 'Commodities Contract Manager', org: 'WVARF', color: 'c3', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6552290/DSC04962.png` },
  { id: 'p9', initials: 'DH', name: 'Daniel Hall', role: 'President, Access Strategies', org: 'Access Strategies', color: 'c4', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6700693/Daniel-Hall.jpg` },
  { id: 'p10', initials: 'MH', name: 'Morgan Hassig', role: 'CFO / Associate Director', org: 'WVARF', color: 'c5', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6552308/DSC04969-2.png` },
  { id: 'p11', initials: 'AH', name: 'Andrea Higginbotham', role: 'Contract Administrator', org: 'WVARF', color: 'c1', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6552283/Andrea-Higginbotham-768x768.jpg` },
  { id: 'p12', initials: 'TK', name: 'Travis Kline', role: 'CEO', org: 'Job Squad, Inc.', color: 'c2', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6648030/TRAVIS-1.PNG` },
  { id: 'p13', initials: 'MM', name: 'Misty Mayville', role: 'Contract Manager, Janitorial & Service (Southern WV)', org: 'WVARF', color: 'c3', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6700407/Misty-Mayville.jpg` },
  { id: 'p14', initials: 'DM', name: 'David Mitchell', role: 'Director of Business Services', org: 'SW Resources', color: 'c4', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6717513/Picture2.jpg`, photoPos: { x: 50, y: 18, zoom: 1.1 } },
  { id: 'p15', initials: 'MR', name: 'Morgan Robinson', role: 'Owner & Chief Marketing Officer', org: 'Focus Marketing Company', color: 'c5', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6552333/IMG_4731---Edited.jpg` },
  { id: 'p16', initials: 'ZS', name: 'Zach Sandy', role: 'Director of Operations & Business Development', org: 'Job Squad, Inc.', color: 'c1', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6648041/ZSANDY-1.PNG` },
  { id: 'p17', initials: 'AS', name: 'Audra Spenia', role: 'Community Partner Work Incentive Counselor', org: 'Job Squad, Inc.', color: 'c2', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6552284/Audra-Spenia-Bio-Picture.jpg` },
  { id: 'p18', initials: 'AW', name: 'Aimee White', role: 'Senior HR Advisor & Client Relationship Manager', org: 'AlignHR', color: 'c3', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6570123/HEADSH-1.JPE` },
  { id: 'p19', initials: 'GW', name: 'Gary Wolfe', role: 'Contract Manager, Janitorial & Service (Northern WV)', org: 'WVARF', color: 'c4', speaker: true, sponsor: false, exhibitor: false, photo: `${CDN}/6700411/Gary-Wolfe-768x1024.jpeg` },
  { id: 'p20', initials: 'MY', name: 'Michael Yon', role: 'Operations Director', org: 'RESPECT of FL', color: 'c5', speaker: true, sponsor: false, exhibitor: false, website: 'https://www.respectofflorida.org/', photo: `${CDN}/6648258/Mike-Yon.jpg`, photoPos: { x: 50, y: 18, zoom: 1.1 } },

  // Added from WVARF's 2026 schedule and presenter checklist. No headshot or
  // bio yet: the card says "Bio coming soon" until SPEAKER_BIOS has one.
  { id: 'p21', initials: 'MF', name: 'Mark Fox', role: '', org: 'WV Surplus Property', color: 'c1', speaker: true, sponsor: false, exhibitor: false },
  { id: 'p22', initials: 'AM', name: 'Adam Mouse', role: '', org: 'U.S. Department of Labor', color: 'c2', speaker: true, sponsor: false, exhibitor: false },
  { id: 'p23', initials: 'JR', name: 'Jason Roberts', role: '', org: 'Workforce WV', color: 'c3', speaker: true, sponsor: false, exhibitor: false },
  { id: 'p24', initials: 'MJ', name: 'Myriah Jenkins', role: 'Vocational Programs Director', org: 'The Arc of Harrison County', color: 'c4', speaker: true, sponsor: false, exhibitor: false, photo: '/headshots/myriah-jenkins.jpg', photoPos: { x: 50, y: 30, zoom: 1 } },
  { id: 'p25', initials: 'AR', name: 'Angie Reed', role: 'Employment Specialist, Parkersburg area', org: 'WV Division of Rehabilitation Services', color: 'c5', speaker: true, sponsor: false, exhibitor: false, photo: '/headshots/angie-reed.jpg', photoPos: { x: 50, y: 45, zoom: 1 } },
  { id: 'p26', initials: 'JC', name: 'Jamie Childers', role: 'Employment Specialist, Morgantown area', org: 'WV Division of Rehabilitation Services', color: 'c1', speaker: true, sponsor: false, exhibitor: false, photo: '/headshots/jamie-childers.jpg', photoPos: { x: 50, y: 50, zoom: 1 } },
  { id: 'p27', initials: 'ML', name: 'Mike Lamb', role: 'Employment Specialist, Charleston area', org: 'WV Division of Rehabilitation Services', color: 'c2', speaker: true, sponsor: false, exhibitor: false },

  // ---- Attendees (Conference Attendees 101326.csv, Oct 13) ----
  // Name and email only, as supplied at registration. Speakers and sponsors
  // who also registered keep their existing card.
  { id: 'a1', initials: 'MS', name: 'Mary Santo', role: '', org: '', color: 'c2', speaker: false, sponsor: false, exhibitor: false, email: 'msanto@goodwillhunting.org' },
  { id: 'a2', initials: 'RL', name: 'Robin Loraditch', role: '', org: '', color: 'c3', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a3', initials: 'JH', name: 'Jamie Hall', role: '', org: '', color: 'c4', speaker: false, sponsor: false, exhibitor: false, email: 'j.hall@mcoicrp.org' },
  { id: 'a4', initials: 'NB', name: 'Nick Biggs', role: '', org: '', color: 'c5', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a5', initials: 'AB', name: 'Alex Burrell', role: '', org: '', color: 'c1', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a6', initials: 'FB', name: 'Fallon Burrell', role: '', org: '', color: 'c2', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a7', initials: 'JN', name: 'Juanita Nicholas', role: '', org: '', color: 'c3', speaker: false, sponsor: false, exhibitor: false, email: 'juanitanicholas38@gmail.com' },
  { id: 'a8', initials: 'CN', name: 'Cody Nicholas', role: '', org: '', color: 'c4', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a9', initials: 'TF', name: 'Tony Francis', role: '', org: '', color: 'c5', speaker: false, sponsor: false, exhibitor: false, email: 'tonyfrancis1969@frontier.com' },
  { id: 'a10', initials: 'NB', name: 'Nancy Baer', role: '', org: '', color: 'c1', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a11', initials: 'TM', name: 'Tammi Morgan', role: '', org: '', color: 'c2', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a12', initials: 'PS', name: 'Paul M See', role: '', org: '', color: 'c3', speaker: false, sponsor: false, exhibitor: false, email: 'paul.m.see@wv.gov' },
  { id: 'a13', initials: 'DM', name: 'Dylan Martin', role: '', org: '', color: 'c4', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a14', initials: 'TJ', name: 'Tamika Jones', role: '', org: '', color: 'c5', speaker: false, sponsor: false, exhibitor: false, email: 'tjones@rns-watch.org' },
  { id: 'a15', initials: 'MD', name: 'Mary Dean', role: '', org: '', color: 'c1', speaker: false, sponsor: false, exhibitor: false, email: 'upshur@buwac.com' },
  { id: 'a16', initials: 'JG', name: 'Jessica Grose', role: '', org: '', color: 'c2', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a17', initials: 'JJ', name: 'Julie Justice', role: '', org: '', color: 'c3', speaker: false, sponsor: false, exhibitor: false, email: 'julie.e.justice@wv.gov' },
  { id: 'a18', initials: 'LO', name: 'Lisa O\'Neal', role: '', org: '', color: 'c4', speaker: false, sponsor: false, exhibitor: false, email: 'loneal@jobsquadinc.org' },
  { id: 'a19', initials: 'EK', name: 'Erika Kirkpatrick', role: '', org: '', color: 'c5', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a20', initials: 'TM', name: 'Taylor Mikalik', role: '', org: '', color: 'c1', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a21', initials: 'RH', name: 'Rhonda Hite', role: '', org: '', color: 'c2', speaker: false, sponsor: false, exhibitor: false, email: 'rhite@eastridgehs.org' },
  { id: 'a22', initials: 'JH', name: 'Jim Hash', role: '', org: '', color: 'c3', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a23', initials: 'DG', name: 'Diane Griffis', role: '', org: '', color: 'c4', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a24', initials: 'JE', name: 'John Empson', role: '', org: '', color: 'c5', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a25', initials: 'AE', name: 'Anna Empson', role: '', org: '', color: 'c1', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a26', initials: 'DG', name: 'Guest of Diane Griffis', role: '', org: '', color: 'c2', speaker: false, sponsor: false, exhibitor: false },
  { id: 'a27', initials: 'CT', name: 'Craig Taylor', role: '', org: '', color: 'c3', speaker: false, sponsor: false, exhibitor: false, email: 'jobcoach@mcoicrp.org' },
  { id: 'a28', initials: 'VC', name: 'Virginia Cleghorn', role: '', org: '', color: 'c4', speaker: false, sponsor: false, exhibitor: false, email: 'vcleghorn@jobsquadinc.org' },
  { id: 'a29', initials: 'JT', name: 'Julie Turley', role: '', org: '', color: 'c5', speaker: false, sponsor: false, exhibitor: false, email: 'barie1@marshall.edu' },
  { id: 'a30', initials: 'MB', name: 'Matt Biafore', role: '', org: '', color: 'c1', speaker: false, sponsor: false, exhibitor: false, email: 'theopshoptjm@gmail.com' },

  // ---- Individual sponsors named on the event page ----
  { id: 's1', initials: 'FW', name: 'Frank & Bevin Weber', role: 'Silver Sponsor', org: 'Frank & Bevin Weber', color: 'c3', speaker: false, sponsor: true, exhibitor: false },
  { id: 's2', initials: 'MH', name: 'Morgan Hassig & Holly Smith', role: 'Bronze Sponsor', org: 'Morgan Hassig & Holly Smith', color: 'c5', speaker: false, sponsor: true, exhibitor: false },
  { id: 's3', initials: 'NS', name: 'Nita Shippy', role: 'CEO / Executive Director, WVARF', org: 'Nita Shippy', color: 'c1', speaker: false, sponsor: true, exhibitor: false },
];

// Descriptions and bios live in program.js; attach them here so every screen
// reads them from the session or person itself.
for (const session of SESSIONS) {
  if (SESSION_DESCRIPTIONS[session.id]) session.desc = SESSION_DESCRIPTIONS[session.id];
}
for (const person of PEOPLE) {
  if (SPEAKER_BIOS[person.id]) person.bio = SPEAKER_BIOS[person.id];
}

// ============================================================
// Venue — Stonewall Resort, Roanoke, WV
// ============================================================

export const VENUE = {
  name: 'Stonewall Resort',
  address: '940 Resort Drive, Roanoke, WV 26447',
  mapUrl: 'https://maps.google.com/?q=Stonewall+Resort,+940+Resort+Dr,+Roanoke,+WV+26447',
  bookingUrl: 'https://be.synxis.com/?Hotel=35494&Chain=21123&arrive=2026-10-20&depart=2026-10-22&adult=1&child=0&group=895123',
  rate: '$189 per night',
  rateNote:
    'The first rate you see includes the $20 resort fee, for a total of $209. Once you click BOOK, the room rate shows at $189 with resort fees and taxes listed separately.',
  deadline: 'September 20, 2026 — or until the block is full',
};

// The Gauley Room is the Shared Office (moved from Potomac on Oct 21) for the whole conference: conference
// operations is based there, and attendees can use it to take calls and
// work on a laptop. Shown on Home, Info and Venue, and announced by a
// notification.
export const SHARED_OFFICE = {
  name: 'Shared Office',
  room: 'Gauley Room',
  summary: 'Need a quiet spot to take a call or catch up on email? Use the Shared Office in the Gauley Room. The conference operations team is based there too, so it’s also the place to find WVARF staff.',
  note: 'Closed to calls and drop-ins Thursday 10:15 AM–12:30 PM while it hosts the remote janitorial training. Open the rest of the conference.',
  where: 'Terrace Level, first in the row of meeting rooms, next to the Kanawha Room.',
};

// Conference rooms, from WVARF's 2026 session schedule (rooms) and the
// resort's floor plan (where). Most sessions are on the Terrace Level.
export const ROOMS = [
  { id: 'r4', name: 'Pecan Room', floor: 'Keynote, plenaries and combined Track A & B breakouts',
    where: 'Terrace Level (marked on the map)' },
  { id: 'r5', name: 'Gauley Room', floor: 'Shared Office: take calls, work on your laptop, find the conference team. Closed Thursday 10:15 AM–12:30 PM for the remote janitorial training. (Wednesday’s Track A breakouts were here.)',
    where: 'Terrace Level, first in the row of meeting rooms, next to the Kanawha Room (marked on the map)' },
  { id: 'r6', name: 'Kanawha Room', floor: 'Track B breakouts',
    where: 'Terrace Level, overlooking the lake and Terrace Lawn (marked on the map)' },
  { id: 'r7', name: 'Greenbrier Room', floor: 'Track C breakouts',
    where: 'Terrace Level, overlooking the lake and Terrace Lawn (marked on the map)' },
  { id: 'r2', name: 'Potomac Room', floor: 'Thursday Track A breakout (Cash Is King, 10:15 AM)',
    where: 'Terrace Level, at the end of the row, next to the Greenbrier Room (marked on the map)' },
  { id: 'r8', name: 'Terrace Foyer', floor: 'Breakfast both days, the Wednesday snack break and the Synergy Connections Challenge',
    where: 'Terrace Level, outside the meeting rooms' },
  { id: 'r9', name: 'Stillwaters Restaurant', floor: 'Buffet lunch, Wednesday and Thursday' },
  { id: 'r10', name: 'Ballroom Foyer', floor: 'Awards Night Reception & Cocktail Hour, Wednesday 5:30 PM',
    where: 'Lobby Level, outside the Stonewall Ballroom' },
  { id: 'r1', name: 'Ballroom II', floor: 'State Use Program Awards Banquet, Wednesday 6:30 PM',
    where: 'Lobby Level, in the Stonewall Ballroom (marked on the map)' },
  { id: 'r3', name: 'Terrace Lawn', floor: 'Tuesday evening reception, beside the firepit',
    where: 'Outdoors, lakeside. The Bluestone, Sutton, Tygart and Summersville rooms on the Lobby Level look out over it.' },
];

export const ROOMS_NOTE =
  'Most sessions are on the Terrace Level.';

// ============================================================
// Sponsors — ordered by tier, highest first.
//
// Logos are self-hosted in /public/logos/ and pre-trimmed: each source file
// came with a different amount of blank canvas baked in (two were a small
// wordmark floating in a 1024- or 4500-pixel square), which made them render
// at wildly different optical sizes. Each is cropped to its artwork and
// normalised to 120px tall, so one CSS rule sizes them all consistently.
// Replace a file in place and keep that convention.
// ============================================================

export const SPONSORS = [
  // Order and levels follow the 2026 foam-board sponsor signs (Oct 16),
  // except the reception sponsor, which Nita moved up to follow the title
  // sponsor (Oct 18).
  {
    id: 'sp8',
    name: 'The Hassig Family',
    tier: 'Title Sponsor',
    donor: true,  // a person or family, not a company: tiles show the name with the icon
    logo: '/logos/sponsor-heart.svg',
    about: ['Our title sponsor. Thank you for making Statewide Synergy possible.'],
  },
  {
    id: 'sp7',
    name: 'BUWAC',
    tier: 'Awards Night Reception Sponsor',
    logo: '/logos/buwac.webp',
    website: 'https://buwac.com/',
    about: [
      'Helping us roll out the welcome mat and create meaningful connections from the very start of Statewide Synergy.',
    ],
  },
  {
    id: 'sp9',
    name: 'The Greater Kanawha Valley Foundation',
    tier: 'Community Partner',
    logo: '/logos/gkvf.webp',
    about: ['Our community partner, helping strengthen nonprofits across West Virginia.'],
  },
  {
    id: 'sp10',
    name: 'Wilson Legal Group, PLLC',
    tier: 'Diamond Sponsor',
    logo: '/logos/wilson-legal-group.webp',
    about: ['A valued champion helping strengthen opportunities, partnerships, and impact across West Virginia.'],
  },
  {
    id: 'sp11',
    name: 'The Pazos Family',
    tier: 'Diamond Sponsor',
    donor: true,  // a person or family, not a company: tiles show the name with the icon
    logo: '/logos/sponsor-heart.svg',
    about: ['A valued champion helping strengthen opportunities, partnerships, and impact across West Virginia.'],
  },
  {
    id: 'sp1',
    name: 'Integrated Resources, Inc.',
    tier: 'Gold Sponsor',
    logo: '/logos/integrated-resources.webp',
    website: 'https://iriwv.com/wp/',
    featured: true,
    about: [
      'A valued champion helping strengthen opportunities, partnerships, and impact across West Virginia.',
    ],
  },
  {
    id: 'sp2',
    name: 'Frank & Bevin Weber',
    tier: 'Silver Sponsor',
    donor: true,  // a person, not a company: tiles show the name with the icon
    // No logo supplied: a generic mark keeps the tile the same weight as
    // the sponsors that have one.
    logo: '/logos/sponsor-heart.svg',
    about: ["Meet the amazing sponsors of this year's event."],
  },
  {
    id: 'sp3',
    name: 'WVABLE',
    tier: 'Bronze Sponsor',
    logo: '/logos/wvable.webp',
    website: 'https://wvable.com/',
    about: [
      'Proud community partners helping us bring people together around opportunity and inclusion.',
    ],
  },
  {
    id: 'sp4',
    name: 'Morgan Hassig & Holly Smith',
    tier: 'Bronze Sponsor',
    donor: true,  // a person, not a company: tiles show the name with the icon
    logo: '/logos/wvarf-mark.webp',  // no logo of their own: the WVARF icon
    about: ['Proud community partners helping us bring people together around opportunity and inclusion.'],
  },
  {
    id: 'sp12',
    name: 'Tina Cobb',
    tier: 'Bronze Sponsor',
    donor: true,  // a person or family, not a company: tiles show the name with the icon
    logo: '/logos/wvarf-mark.webp',
    about: ['Proud community partners helping us bring people together around opportunity and inclusion.'],
  },
  {
    id: 'sp5',
    name: 'Homestead Communications',
    tier: 'Gemstone Sponsor',
    logo: '/logos/homestead-communications.webp',
    website: 'https://www.linkedin.com/in/diane-slaughter-apr-fellow-prsa-8015a58/',
    about: [
      'Every contribution makes an impact, and we’re proud to recognize these friends of WVARF for being part of our mission.',
    ],
  },
  {
    id: 'sp6',
    name: 'Nita Shippy',
    tier: 'Gemstone Sponsor',
    donor: true,  // a person, not a company: tiles show the name with the icon
    logo: '/logos/wvarf-mark.webp',  // no logo of her own: the WVARF icon
    about: ['Every contribution makes an impact, and we’re proud to recognize these friends of WVARF for being part of our mission.'],
  },
  {
    id: 'sp13',
    name: 'Jim Hash',
    tier: 'Gemstone Sponsor',
    donor: true,  // a person or family, not a company: tiles show the name with the icon
    logo: '/logos/wvarf-mark.webp',
    about: ['Every contribution makes an impact, and we’re proud to recognize these friends of WVARF for being part of our mission.'],
  },
  {
    id: 'sp14',
    name: 'Lisa Pellino',
    tier: 'Gemstone Sponsor',
    donor: true,  // a person or family, not a company: tiles show the name with the icon
    logo: '/logos/sponsor-heart.svg',
    about: ['Every contribution makes an impact, and we’re proud to recognize these friends of WVARF for being part of our mission.'],
  },
];

// ============================================================
// Exhibitors
//
// The exhibitor hall roster has not been published yet. The screens below
// are already wired for it — drop entries into this list (same shape as
// SPONSORS, plus an optional `materials` array) and they appear on Home
// and in the People directory with no code change.
//
// Example:
//   {
//     id: 'ex1', name: 'Example Co', logo: '/logos/example.png',
//     website: 'https://example.com',
//     about: ['One or two paragraphs about the organization.'],
//     materials: [{
//       title: 'Example flyer', file: '/materials/example-flyer.pdf',
//       size: 'PDF, 0.4 MB', preview: '/materials/example-flyer-preview.jpg',
//       alt: 'Full text of the flyer, for screen readers.',
//     }],
//   },
// ============================================================

export const EXHIBITORS = [];

// Shown in place of the exhibitor carousel until EXHIBITORS has entries.
export const EXHIBITORS_PENDING = {
  heading: 'Exhibitor hall',
  body: 'The 2026 exhibitor roster is still being confirmed. Exhibitors and their handouts will appear here as soon as they are announced — check back before you travel.',
};

// Shown on a sponsor or exhibitor card that has no handouts yet.
export const MATERIALS_PENDING =
  'Session materials (PDFs) will be posted here during the conference.';

// Sponsor/exhibitor people reference their org by exact name.
export function findOrg(name) {
  if (!name) return null;
  return SPONSORS.find(o => o.name === name) || EXHIBITORS.find(o => o.name === name) || null;
}

// ============================================================
// Conference identity & contacts
// ============================================================

export const CONFERENCE_NAME = 'Statewide Synergy';
export const CONFERENCE_SUBTITLE = '2nd Annual State Use Conference';
export const CONFERENCE_THEME = 'The Power of People & Procurement';
export const CONFERENCE_DATES = 'October 20–22, 2026';

export const CONFERENCE_ABOUT = [
  'This year’s theme, “Statewide Synergy: The Power of People & Procurement,” celebrates the transformative impact of partnerships between West Virginia’s disability community, nonprofit organizations, and state agencies. The conference highlights the potential of WV’s nonprofits to meet state needs through meaningful work, innovative solutions, and collaborative partnerships that strengthen communities across the Mountain State.',
  'Join nonprofit leaders, government partners, and community stakeholders on October 21–22, 2026, at Stonewall Resort, for two days of connection, learning, and celebration. A special Pre-Conference Reception will be held on the evening of October 20, offering attendees an opportunity to network and connect before conference sessions begin.',
  'Throughout the conference, participants will explore best practices, emerging opportunities, and successful partnerships that demonstrate the power of people-driven procurement and community impact. The Awards Banquet will honor outstanding leadership, collaboration, and achievements that embody this year’s theme and showcase the lasting value of mission-focused work throughout West Virginia.',
];

export const REGISTRATION_URL = 'https://synergywv.rsvpify.com/';

export const WVARF = {
  name: 'West Virginia Association of Rehabilitation Facilities, Inc.',
  short: 'WVARF',
  tagline: 'Committed to improving the lives of disabled individuals through State Use and CRPs',
  website: 'https://wvarf.org/',
  resources: 'https://wvarf.org/resources/',
  phone: '(304) 205-7970',
  address: '400 Patterson Lane, Charleston, WV 25311',
  mailing: 'PO Box 6764, Charleston, WV 25362',
  hours: 'Monday–Friday, 8:00 AM–4:30 PM',
  facebook: 'https://www.facebook.com/people/West-Virginia-Association-of-Rehabilitation-Facilities-Inc/100083874717893/',
  mission:
    'To give every individual with a disability the opportunity to have gainful employment — by building a strong network, promoting the services and products of our CRPs, providing education and support, advocating for people with disabilities, encouraging high ethical standards, developing innovative services, and promoting unity.',
  vision:
    'A strong, positive public image of the products and services produced by West Virginia’s community rehabilitation programs — supported with technology, defined niche markets, and marketing at the local, regional, state and national levels.',
  about: [
    'WVARF is a nonprofit that handles service and commodity contracts for Community Rehabilitation Programs (CRPs) in West Virginia’s State Use Program. Those CRPs provide vocational evaluation, training and extended employment; job placement, supported employment and follow-up consultation to people with disabilities across the state.',
    'The West Virginia legislature created the State Use Program in 1984 and strengthened it in 1989. It lets participating CRPs and their employees produce commodities and perform services for state agencies without competitive bidding, at prices set by a governor-appointed committee.',
  ],
};

// What WVARF's CRPs deliver under the State Use Program, from wvarf.org.
export const STATE_USE_SERVICES = [
  'Janitorial services',
  'Temporary employment (clerical, custodial, laborer, cook, groundskeeping)',
  'Grounds maintenance, landscaping and leaf cleanup',
  'Microfilm and microfiche scanning and indexing',
  'Data imaging, warehousing and off-site storage',
  'Data management, keystroke services and form sorting',
  'Pre-sort mail processing',
  'Commercial laundry and floor mat rental',
  'Secure document destruction and courier delivery',
  'Low-impact monitoring — route planning and dispatch for oversized loads',
  'Stream access staffing for public waterways, boat ramps and fishing piers',
  'Contact center support',
];

export const STATE_USE_COMMODITIES = [
  'Mirrors', 'Bottled water', 'Liquid soap', 'Survey stakes',
  'Liquid absorbency kits', 'Industrial wipes', 'Laboratory aprons',
  'Drop cloths', 'Hospital clothing',
];

// Published WVARF documents, from wvarf.org/resources.
export const WVARF_RESOURCES = [
  { id: 'r-ar25', title: 'WVARF FY2025 Annual Report', kind: 'Annual report', url: 'https://wvarf.org/wp-content/uploads/2021/09/WVARF-FY2025-Annual-Report.pdf' },
  { id: 'r-ar24', title: 'WVARF 2024 Annual Report', kind: 'Annual report', url: 'https://wvarf.org/wp-content/uploads/2021/09/WVARF-Annual-Report-2024.pdf' },
  { id: 'r-n2607', title: 'July 2026 Newsletter', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/WVARF-July-2026-Newsletter.pdf' },
  { id: 'r-n2511', title: 'November 2025 Newsletter', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/WVARF-November-2025-Newsletter.pdf' },
  { id: 'r-n2508', title: 'August 2025 — News You Need to Know', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/August-2025_-News-you-need-to-know.pdf' },
  { id: 'r-n2504', title: 'April 2025 Newsletter', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/April-2025-Newsletter-PDF.pdf' },
  { id: 'r-n2501', title: 'January 2025 Newsletter', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/WVARF-January-2025-Newsletter.pdf' },
  { id: 'r-n2408', title: 'August 2024 Newsletter', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/Aug-2024-Newsletter-Finalized.pdf' },
  { id: 'r-n2404', title: 'April 2024 Newsletter', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/WVARF-April-2024-newsletter-1.0.pdf' },
  { id: 'r-n2401', title: 'January 2024 Newsletter', kind: 'Newsletter', url: 'https://wvarf.org/wp-content/uploads/2021/09/January-2024-newsletter-1.pdf' },
];

export const OTHER_EVENTS = [
  { id: 'e1', title: 'WV Regional Disability Resource Fair', url: 'https://wvdisabilityresourcefair.rsvpify.com/' },
];

// WVARF staff, from wvarf.org/about. Phone is each person's direct line and
// email is their work email (WVARF Employee Contact Information, Oct 2026).
// `helps` names what attendees should
// contact that person about during the conference.
export const CONTACTS = [
  { id: 'c1', name: 'Nita Shippy, MA, MBA', title: 'CEO / Executive Director', phone: '(681) 661-0143', email: 'nshippy@wvarf.org', helps: ['Conference questions'] },
  { id: 'c2', name: 'Morgan Hassig', title: 'CFO / Associate Director', phone: '(304) 205-7831', email: 'mhassig@wvarf.org', helps: ['Registration & billing'] },
  { id: 'c3', name: 'Andrea Higginbotham', title: 'Contract Administrator', phone: '(681) 661-0145', email: 'ahigginbotham@wvarf.org', helps: ['Contracts'] },
  { id: 'c4', name: 'Jessica Osbin', title: 'Executive Coordinator', phone: '(304) 244-5464', email: 'josbin@wvarf.org', helps: ['Registration desk'] },
  { id: 'c5', name: 'Dathum Cummings, ABA', title: 'Commodities Contract Manager', phone: '(304) 205-7916', email: 'dcummings@wvarf.org', helps: ['Commodities'] },
  { id: 'c6', name: 'Gary Wolfe', title: 'Contract Manager — Janitorial & Service, Northern WV', phone: '(681) 661-0141', email: 'gwolfe@wvarf.org', helps: ['Janitorial contracts'] },
  { id: 'c7', name: 'Misty Mayville, BS', title: 'Contract Manager — Janitorial & Service, Southern WV', phone: '(681) 661-0144', email: 'mmayville@wvarf.org', helps: ['Janitorial contracts'] },
  { id: 'c8', name: 'Sabrina Jones, AAS', title: 'Accounting Assistant — Accounts Receivable', phone: '(681) 661-0142', email: 'sjones@wvarf.org' },
  { id: 'c9', name: 'Kimberly Nichols, AS', title: 'Accounting Assistant — Accounts Payable', phone: '(681) 661-0146', email: 'knichols@wvarf.org' },
];
