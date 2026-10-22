// ============================================================
// Attendee surveys
//
// Two surveys, both answered inside the app and saved to Netlify Forms:
//   SESSION_SURVEY     one form, used for every educational session
//   CONFERENCE_SURVEY  the whole-event survey
//
// HOW WE WRITE SURVEY QUESTIONS (keep to this for every future survey)
// ------------------------------------------------------------------
// Each survey mixes standard satisfaction questions with formative ones.
// The formative questions ask what content actually helps attendees do
// their jobs at nonprofit State Use Program member organizations, so the
// answers tell WVARF what to keep, cut and add next time:
//   - usefulness to the person's own role and organization
//   - whether they expect to put something to use, and soon
//   - what was most useful, and what would have made it more useful
//   - what to cover more of, and what is missing
// Phrase them neutrally, as ordinary "help us improve" questions. Every
// formative question should lead to a decision about future content.
//
// Question types:
//   rating   1–5, Poor to Excellent
//   agree    1–5, Strongly disagree to Strongly agree
//   useful   1–5, Not at all useful to Extremely useful
//   nps      0–10 likelihood to recommend
//   choice   one of `options`
//   multi    any of `options` (saved as one comma-separated field)
//   grid     several rows sharing one scale (`scale`); each row is saved
//            as its own field, `${id}_${row.id}`
//   text     long answer;  short: one-line answer;  email: email address
//
// showIf: { id, equals } shows a question only when another question has
// that answer (hidden answers are not sent).
//
// Field names (`id`s) become columns in the Netlify Forms export. Never
// rename or reuse one once responses have come in; add a new id instead.
// The build writes a hidden copy of every field into /__forms.html so
// Netlify knows about it (see vite.config.js); no extra step is needed.
// ============================================================

export const SCALES = {
  rating: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'],
  agree: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  useful: ['Not at all useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful'],
};

// "About you" — asked on both surveys, remembered on the device so people
// only pick once. Optional contact details come last.
const ROLE_OPTIONS = [
  'Executive director / CEO',
  'Program or operations manager',
  'Employment, job coaching or vocational staff',
  'Finance or administration',
  'Sales, marketing or business development',
  'Contract or site supervisor',
  'Board member',
  'State agency or government partner',
  'Other',
];
const ORG_OPTIONS = [
  'State Use Program member (CRP)',
  'Other nonprofit',
  'State or federal agency',
  'Business, vendor or sponsor',
  'Other',
];

const ABOUT_YOU = {
  title: 'About you',
  note: 'Helps us see which content works for which roles.',
  questions: [
    { id: 'role', type: 'choice', label: 'Which best describes your role?', options: ROLE_OPTIONS, remember: true },
    { id: 'org_type', type: 'choice', label: 'What type of organization are you with?', options: ORG_OPTIONS, remember: true },
  ],
};

const CONTACT = {
  title: 'Contact (optional)',
  note: 'Leave blank to stay anonymous.',
  questions: [
    { id: 'name', type: 'short', label: 'Your name', remember: true, autoComplete: 'name' },
    { id: 'organization', type: 'short', label: 'Organization', remember: true, autoComplete: 'organization' },
    { id: 'email', type: 'email', label: 'Email', remember: true, autoComplete: 'email' },
    { id: 'follow_up', type: 'choice', label: 'May WVARF follow up with you about your answers?', options: ['Yes', 'No'] },
  ],
};

// Session ids and details are sent with every session response as hidden
// fields, so one form serves every session, this year and next.
export const SESSION_HIDDEN_FIELDS = ['session_id', 'session_title', 'session_day', 'session_time', 'session_room', 'session_speakers', 'session_tags'];

export const SESSION_SURVEY = {
  formName: 'session-feedback',
  title: 'Session feedback',
  intro: 'Two minutes, and every answer is optional. Your feedback shapes next year’s sessions.',
  sections: [
    {
      title: 'The session',
      questions: [
        { id: 'overall', type: 'rating', label: 'Overall, how would you rate this session?' },
        { id: 'speaker_quality', type: 'agree', label: 'The presenter(s) were knowledgeable and engaging.' },
        { id: 'well_organized', type: 'agree', label: 'The session was well organized and made good use of the time.' },
        { id: 'matched_description', type: 'agree', label: 'The session matched its description in the program.' },
        { id: 'content_level', type: 'choice', label: 'The content level was…', options: ['Too basic', 'About right', 'Too advanced'] },
      ],
    },
    {
      title: 'Putting it to use',
      questions: [
        { id: 'useful_for_role', type: 'useful', label: 'How useful was this session for your role?' },
        { id: 'useful_for_org', type: 'useful', label: 'How useful was it for your organization’s State Use Program work?' },
        { id: 'will_apply', type: 'choice', label: 'Will you put something from this session to use?', options: ['Already planning to', 'Yes, within 3 months', 'Yes, later this year', 'Probably not', 'Not sure yet'] },
        { id: 'most_useful', type: 'text', label: 'What was the most useful thing you took away?' },
        { id: 'more_useful', type: 'text', label: 'What would have made this session more useful to you?' },
        {
          id: 'more_of', type: 'multi', label: 'Next time, more of… (pick any)',
          options: ['Practical tools and templates', 'West Virginia examples', 'State Use contract specifics', 'Funding and grant information', 'Time for questions', 'Peer discussion', 'Hands-on activity', 'Follow-up resources'],
        },
      ],
    },
    ABOUT_YOU,
    CONTACT,
  ],
};

export const CONFERENCE_SURVEY = {
  formName: 'conference-feedback',
  title: 'Conference feedback',
  intro: 'About five minutes, and every answer is optional. Tell us what worked, what didn’t, and what would make next year more valuable.',
  sections: [
    {
      title: 'Overall',
      questions: [
        { id: 'overall', type: 'rating', label: 'Overall, how would you rate Statewide Synergy 2026?' },
        { id: 'recommend', type: 'nps', label: 'How likely are you to recommend this conference to a colleague?' },
        { id: 'attend_again', type: 'choice', label: 'Do you plan to attend next year?', options: ['Yes', 'Maybe', 'No'] },
        { id: 'first_time', type: 'choice', label: 'Was this your first WVARF State Use Conference?', options: ['Yes', 'No'] },
      ],
    },
    {
      title: 'Content and relevance',
      questions: [
        { id: 'relevant_to_role', type: 'agree', label: 'The content was relevant to my role.' },
        { id: 'leave_with_ideas', type: 'agree', label: 'I’m leaving with ideas I can put to use right away.' },
        { id: 'real_challenges', type: 'agree', label: 'Sessions reflected the real challenges my organization faces.' },
        { id: 'speaker_quality', type: 'agree', label: 'Speakers were knowledgeable and well prepared.' },
        { id: 'most_valuable', type: 'text', label: 'Which session or topic was most valuable to you, and why?' },
        { id: 'less_relevant', type: 'text', label: 'Was any content less relevant to your work? What would have fit better?' },
      ],
    },
    {
      title: 'Educational tracks',
      questions: [
        {
          id: 'track', type: 'grid', label: 'How useful was each track you attended?',
          scale: [...SCALES.useful, 'Didn’t attend'],
          rows: [
            { id: 'a', label: 'Track A: Capacity Building & Organization Longevity' },
            { id: 'b', label: 'Track B: Sales & Marketing' },
            { id: 'c', label: 'Track C: Client Support & Vocational Rehabilitation' },
          ],
        },
        { id: 'track_mix', type: 'choice', label: 'Did the tracks offer the right topics for your role?', options: ['Yes', 'Partly', 'No'] },
        { id: 'session_length', type: 'choice', label: 'Session length (one hour) was…', options: ['Too short', 'About right', 'Too long'] },
        { id: 'topics_next_year', type: 'text', label: 'What topics, tracks or speakers would you like next year?' },
      ],
    },
    {
      title: 'The State Use Program',
      questions: [
        { id: 'sup_understanding', type: 'agree', label: 'The conference helped me understand what the State Use Program offers my organization.' },
        { id: 'sup_value', type: 'rating', label: 'How would you rate the value of State Use Program participation to your organization right now?' },
        {
          id: 'sup_resources', type: 'multi', label: 'Which WVARF and State Use resources would you like to hear more about? (pick any)',
          options: ['New contract opportunities', 'Commodities and eCommerce', 'Mini Grant Program', 'Training and apprenticeships', 'Legislative updates and advocacy', 'Compliance and reporting help', 'Peer networking between members', 'Cost-saving and purchasing programs'],
        },
        { id: 'sup_improve', type: 'text', label: 'What one thing would make the State Use Program more valuable to your organization?' },
      ],
    },
    {
      // Added Oct 21 at Nita's request. Follow-up questions appear only for
      // the matching answer (`showIf`).
      title: 'State Use Legislative Committee',
      questions: [
        {
          id: 'leg_committee', type: 'choice',
          label: 'Are you interested in joining the State Use Legislative Committee? We will meet once a month with Daniel Hall to discuss legislative needs throughout the session and plan a quarterly site visit.',
          options: ['Yes', 'No', 'Not me, but I’d like to nominate someone at my organization'],
        },
        { id: 'leg_email', type: 'email', label: 'Your email (submit it and you will be enrolled)', autoComplete: 'email', showIf: { id: 'leg_committee', equals: 'Yes' } },
        { id: 'leg_nominee_name', type: 'short', label: 'Name of the person you’re nominating', showIf: { id: 'leg_committee', equals: 'Not me, but I’d like to nominate someone at my organization' } },
        { id: 'leg_nominee_email', type: 'email', label: 'Their email', showIf: { id: 'leg_committee', equals: 'Not me, but I’d like to nominate someone at my organization' } },
      ],
    },
    {
      title: 'Event experience',
      questions: [
        {
          id: 'logistics', type: 'grid', label: 'Please rate…',
          scale: [...SCALES.rating, 'N/A'],
          rows: [
            { id: 'registration', label: 'Registration and check-in' },
            { id: 'venue', label: 'Venue and meeting rooms' },
            { id: 'food', label: 'Meals and breaks' },
            { id: 'schedule', label: 'Schedule and pacing' },
            { id: 'networking', label: 'Networking opportunities' },
            { id: 'reception', label: 'Tuesday reception' },
            { id: 'banquet', label: 'Awards Banquet' },
            { id: 'app', label: 'This conference app' },
            { id: 'communication', label: 'Information before the event' },
          ],
        },
        { id: 'improve_one', type: 'text', label: 'What one change would most improve next year’s conference?' },
        { id: 'comments', type: 'text', label: 'Anything else you’d like to share?' },
      ],
    },
    ABOUT_YOU,
    CONTACT,
  ],
};

// Sessions that get a survey: everything educational. Meals, breaks,
// socials, registration and the Challenge are left out.
const NO_SURVEY_TAGS = ['Meal', 'Break', 'Social', 'Networking', 'Awards'];
export function hasSessionSurvey(session) {
  if (/^Registration/.test(session.title)) return false;
  return !(session.tags || []).some(t => NO_SURVEY_TAGS.includes(t));
}

// When surveys open. A session survey opens when the session starts; the
// conference survey opens Thursday morning. Eastern daylight time.
const DATES = { 1: '2026-10-20', 2: '2026-10-21', 3: '2026-10-22' };
export function sessionStart(session) {
  const m = session.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return NaN;
  const h = (+m[1] % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  return Date.parse(`${DATES[session.day]}T${String(h).padStart(2, '0')}:${m[2]}:00-04:00`);
}
export const CONFERENCE_SURVEY_OPENS = Date.parse('2026-10-22T08:00:00-04:00');

// Every field name a survey can send — used to build /__forms.html.
export function fieldNames(survey, hidden = []) {
  const names = [...hidden];
  for (const sec of survey.sections) {
    for (const q of sec.questions) {
      if (q.type === 'grid') q.rows.forEach(r => names.push(`${q.id}_${r.id}`));
      else names.push(q.id);
    }
  }
  return names;
}
