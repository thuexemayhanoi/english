#!/usr/bin/env node
/**
 * apply-batch-14b-docs.js - server-side finalize for Batch 14 (zero dependencies).
 * Applies docs/sync/batch-14b-docs-sync.json: README DEPLOYMENT STATE section replace
 * (verified run IDs) + changelog entry 36 (idempotent). Self-diagnosing like revision 3.
 */
'use strict';
const fs = require('fs');
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n'); } catch (e) {}
  console.error('apply-batch-14b-docs: ' + msg);
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-14b-docs-sync.json', 'utf8'));
diag.push('payload loaded; sectionReplaces=' + (payload.sectionReplaces || []).length);
let readme = fs.readFileSync('README.md', 'utf8');
diag.push('README.md length=' + readme.length);
function replaceSection(text, heading, content) {
  const lines = text.split('\n');
  let found = 0;
  for (let i = 0; i < lines.length; i++) { if (lines[i].trim() === heading) found++; }
  if (found !== 1) die('section heading occurs ' + found + ' times (expected 1): ' + heading);
  let h = -1;
  for (let i = 0; i < lines.length; i++) { if (lines[i].trim() === heading) { h = i; break; } }
  let end = lines.length;
  for (let i = h + 1; i < lines.length; i++) { if (/^#\s/.test(lines[i])) { end = i; break; } }
  diag.push('README section OK: ' + heading + ' (heading line ' + (h + 1) + ', ends line ' + end + ')');
  return lines.slice(0, h + 1).concat([content]).concat(lines.slice(end)).join('\n');
}
for (const s of payload.sectionReplaces || []) readme = replaceSection(readme, s.heading, s.content);
if (payload.changelogPrepend && payload.changelogPrepend.length && payload.changelogIdempotencyMarker) {
  if (readme.includes(payload.changelogIdempotencyMarker)) {
    diag.push('README changelog entry already present, skipped (idempotent)');
  } else {
    const marker = '# CHANGE LOG\n\n';
    const idx = readme.indexOf(marker);
    if (idx === -1) die('changelog heading not found');
    const insert = payload.changelogPrepend.map(e => (e.startsWith('-') ? e : '- ' + e)).join('\n') + '\n';
    readme = readme.slice(0, idx + marker.length) + insert + readme.slice(idx + marker.length);
    diag.push('README changelog prepended: ' + payload.changelogPrepend.length + ' entries');
  }
}
if (!readme.endsWith('\n')) readme += '\n';
for (const must of payload.expectContains || []) {
  if (!readme.includes(must)) die('post-validation failed: README does not contain: ' + must.slice(0, 80));
  diag.push('README expectContains OK: "' + must.slice(0, 60) + '"');
}
fs.writeFileSync('README.md', readme);
diag.push('SUCCESS: README finalized for batch 14.');
fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n');
console.log('apply-batch-14b-docs: README finalized for batch 14.');
