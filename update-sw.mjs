// Run after editing anything in site/ that the app precaches (index.html,
// live/*): `node update-sw.mjs`. It refreshes the revision hashes in
// site/sw.js so phones pick up the change on their next visit.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const swPath = new URL('./site/sw.js', import.meta.url);
let sw = readFileSync(swPath, 'utf8');
let changed = 0;
sw = sw.replace(/\{url:"([^"]+)",revision:"([0-9a-f]+)"\}/g, (m, url, rev) => {
  const file = new URL('./site/' + url, import.meta.url);
  if (!existsSync(file)) return m;
  const now = createHash('md5').update(readFileSync(file)).digest('hex');
  if (now !== rev) changed++;
  return `{url:"${url}",revision:"${now}"}`;
});
writeFileSync(swPath, sw);
console.log(changed ? `Updated ${changed} revision(s) in site/sw.js` : 'site/sw.js already up to date');
