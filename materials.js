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
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:ded6f3d4-8bb9-485f-8ce0-156caa37a90e',
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
  // Added from the checklist's "correct version" (Oct 15). Every link above and
  // below matches the presenter row it sits on in that sheet.
  link('w6c', 'Presentation: Travis Kline',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:297c7c5d-b028-453f-8742-660ec1bb6029',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('t3a', 'Presentation: Morgan Hassig',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:dab33ae3-6978-4b6f-942e-caaebf4f9a47',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('t3c', 'Presentation: Travis Kline',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:8ba9ebcb-1378-4684-afbd-c1ea0e007749',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  // Two links in one cell for Zach Sandy: both listed under his session.
  link('t6a', 'Zach Sandy: Material 1 of 2',
    'https://acrobat.adobe.com/id/urn:aaid:sc:va6c2:5c0258c1-56cf-4ddc-984f-5e24837da141',
    'Resource', 'PDF · opens in Adobe Acrobat'),
  link('t6a', 'Zach Sandy: Material 2 of 2',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:a26e3d69-b08e-4f28-82b9-ce3bcaba7c15',
    'Resource', 'PDF · opens in Adobe Acrobat'),
  // Added Oct 18 from the checklist (rows for Misty Mayville, Aimee White,
  // Morgan Robinson, Tina Cobb and Andrea Higginbotham).
  link('t6c', 'Apprenticeship Visual: Misty Mayville',
    'https://acrobat.adobe.com/id/urn:aaid:sc:va6c2:5e7f9e44-ac29-4fad-8edf-817baba43f7f',
    'Resource', 'PDF · opens in Adobe Acrobat'),
  link('t6c', 'Benefits of Apprenticeship (handout): Misty Mayville',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:ce4fd37d-63bd-4802-90f8-0a19a9ee0405',
    'Handout', 'PDF · opens in Adobe Acrobat'),
  link('w6a', 'Presentation: Aimee White',
    'https://acrobat.adobe.com/id/urn:aaid:sc:va6c2:17027b2d-2190-4faf-8dd9-5002da447b2c',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('w8b', 'Presentation: Morgan Robinson',
    'https://acrobat.adobe.com/id/urn:aaid:sc:va6c2:def72951-62c7-4dab-ad73-d9476a52e544',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('w8b', 'Strategy to Story Worksheet: Morgan Robinson',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:36e8350a-7ba8-4fe8-ba65-0f9d111af761',
    'Worksheet', 'PDF · opens in Adobe Acrobat'),
  link('t2', 'Presentation: Tina Cobb',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:b732025b-4321-4b46-ad55-8e0bba6f540b',
    'Presentation', 'PDF · opens in Adobe Acrobat'),
  link('rj1', 'Janitorial Supervisor Training: Andrea Higginbotham',
    'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:68bb2faa-ff5b-4efc-9704-d3b5c2d3e484',
    'Handout', 'PDF · opens in Adobe Acrobat'),
];

export const materialsFor = (sessionId) => MATERIALS.filter(m => m.session === sessionId);
export const hasMaterials = (sessionId) => MATERIALS.some(m => m.session === sessionId);
