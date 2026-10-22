import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { CONFERENCE_SURVEY, SESSION_SURVEY, SESSION_HIDDEN_FIELDS, fieldNames } from './src/data/surveys.js';
import { ENTRY_FIELDS, PHOTO_FIELDS } from './src/data/challenge.js';

// Netlify Forms only stores fields it has seen in a static HTML form at
// deploy time. This writes /__forms.html with a hidden copy of each survey
// form, built from src/data/surveys.js, so new questions are picked up on
// the next deploy with no extra step. The app posts answers to this page.
function netlifyForms() {
  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const form = (survey, hidden) => {
    const inputs = ['submitted_at', ...fieldNames(survey, hidden)]
      .map(n => `    <input type="text" name="${esc(n)}" />`).join('\n');
    return `  <form name="${esc(survey.formName)}" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden>\n    <input type="hidden" name="form-name" value="${esc(survey.formName)}" />\n    <input name="bot-field" />\n${inputs}\n  </form>`;
  };
  // A form from a plain field list; `files` makes `photo` a file upload.
  const plain = (name, fields, files = false) =>
    `  <form name="${esc(name)}" method="POST" data-netlify="true" netlify-honeypot="bot-field"${files ? ' enctype="multipart/form-data"' : ''} hidden>\n    <input type="hidden" name="form-name" value="${esc(name)}" />\n    <input name="bot-field" />\n` +
    fields.map(n => `    <input type="${files && n === 'photo' ? 'file' : 'text'}" name="${esc(n)}" />`).join('\n') + '\n  </form>';
  return {
    name: 'netlify-forms',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: '__forms.html',
        source: `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Forms</title><meta name="robots" content="noindex"></head><body>\n${form(SESSION_SURVEY, SESSION_HIDDEN_FIELDS)}\n${form(CONFERENCE_SURVEY, [])}\n${plain('challenge-entry', ['submitted_at', ...ENTRY_FIELDS])}\n${plain('challenge-photo', PHOTO_FIELDS, true)}\n${plain('conference-photo', ['name', 'email', 'square', 'caption', 'share_ok', 'release', 'photo'], true)}\n</body></html>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    netlifyForms(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // The icons are already precached by globPatterns; adding them again
      // would list them twice.
      includeManifestIcons: false,
      // No includeAssets list: globPatterns below already picks up every logo
      // and font. Listing them in both places made Workbox see each file twice
      // with different revisions, so the service worker failed and offline
      // mode never worked.
      manifest: {
        name: 'Statewide Synergy \u2014 WVARF State Use Conference',
        short_name: 'Statewide Synergy',
        description:
          'Agenda, speakers, sponsors, hotel details and WVARF resources for the 2nd Annual State Use Conference at Stonewall Resort, October 20\u201322, 2026.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FBFAF7',
        theme_color: '#11308A',
        icons: [
          { src: '/assets/wvarf-mark.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/assets/wvarf-logo-white-bg.png', sizes: '576x576', type: 'image/png', purpose: 'any' },
          { src: '/assets/wvarf-logo-dark-bg.png', sizes: '576x576', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // The manifest is added by the plugin itself, so it isn't globbed here.
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
        // Staff pages and the zip library aren't part of the attendee app.
        globIgnores: ['__forms.html', 'leaderboard.html', 'photos.html', 'players.html', 'live/jszip.min.js'],
        // Addresses the app must never answer itself: Netlify forms, the
        // projector and photo pages, the Challenge functions, and files.
        navigateFallbackDenylist: [
          /^\/__forms\.html/, /^\/leaderboard/, /^\/photos/, /^\/players/, /^\/api\//, /^\/\.netlify\//,
          /^\/materials\//, /\.(pdf|docx?|pptx?|xlsx?|csv|zip)$/i,
        ],
        runtimeCaching: [
          {
            // Speaker headshots are served from the event page's CDN (and one
            // from the WV DRS website), so they work offline once seen.
            urlPattern: /^https:\/\/(cdn\.rsvpify\.com|wvdrs\.org)\/.*\.(jpe?g|png|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'speaker-photos',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 5173 },
});
