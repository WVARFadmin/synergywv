// Session materials (all PDFs) that attendees can open.
//
// HOW MATERIALS ARE ADDED: Nita converts each presentation or handout to a
// PDF, shares it (Adobe Acrobat, SharePoint or OneDrive "anyone with the
// link" link) and sends the link. Each link becomes one entry below, tied to
// its session by session id in SESSIONS (conference.js). Nothing is stored
// in the app itself, so the site stays small and Nita can replace a file at
// the same link without a new upload.
//
// A session can have several entries. Fields:
//   session  session id, e.g. 'w8a'
//   title    what the attendee sees
//   kind     Presentation | Handout | Worksheet | Resource
//   url      the shareable link (opens in a new tab)
//   note     small line under the title, e.g. 'PDF · opens in Adobe Acrobat'
//
// (A file placed in /public/materials/ can still be used with `file:`
// instead of `url:`, but links are the standard.)
const link = (session, title, url, kind = 'Presentation', note = 'PDF · opens in a new tab') =>
  ({ session, title, url, kind, size: note });

// From the Link to Materials column of WVARF_2026_Presenter_Submission_Checklist
// (Oct 13). One entry per distinct link per session; repeats are skipped.
export const MATERIALS = [
  link('w4a', 'Presentation: David Mitchell',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:2b46cf54-afe7-4d06-bad6-3023b05dfee5',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('w4c', 'Presentation: Alyce Almond',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:7c2e4e55-6f09-44ab-ab2c-4ddccb343a2b',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('w8a', 'Presentation: Mark Fox',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:ffd46645-57a6-4e05-a5d5-995dd1e4ef92',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('w8a', 'Presentation: Michael Yon',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:4a08b746-d3de-4aec-99a7-2862af25b79a',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('t6t', 'Presentation: Michael Yon',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:d395fa3c-fde6-47c5-a15c-583c3c49849a',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
];

export const materialsFor = (sessionId) => MATERIALS.filter(m => m.session === sessionId);
export const hasMaterials = (sessionId) => MATERIALS.some(m => m.session === sessionId);
