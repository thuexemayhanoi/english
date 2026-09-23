#!/usr/bin/env node
/**
 * apply-batch-15-docs.js - server-side finalize for Batch 15 (zero dependencies).
 * Applies docs/sync/batch-15-docs-sync.json:
 *   1. master-matrix.csv row merge (592 -> 642, batch-15 rows verbatim)
 *   2. README targeted state patches + DEPLOYMENT STATE / NEXT RECOMMENDED STEP
 *      section replaces + changelog entry 37 (idempotent)
 *   3. MASTER-MATRIX.md targeted patches (cluster-4 progress, CSV row counts)
 *   4. batch-15-status.md verification record
 * Self-diagnosing: every anchor is count-validated; failures write sync-debug.txt.
 */
'use strict';
const fs = require('fs');
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n'); } catch (e) {}
  console.error('apply-batch-15-docs: ' + msg);
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-15-docs-sync.json', 'utf8'));
diag.push('payload loaded; readmeReplaces=' + (payload.readmeReplaces || []).length +
  '; mmReplaces=' + (payload.mmReplaces || []).length +
  '; sectionReplaces=' + (payload.sectionReplaces || []).length);

function patchFile(file, replaces, label) {
  let text = fs.readFileSync(file, 'utf8');
  for (const r of replaces || []) {
    const n = text.split(r.find).length - 1;
    if (n !== 1) die(label + ' anchor occurs ' + n + ' times (expected 1): ' + r.find.slice(0, 70));
    text = text.replace(r.find, r.replace);
    diag.push(label + ' patch OK: ' + r.find.slice(0, 60));
  }
  return text;
}

// ---------- 1. master-matrix.csv merge ----------
const merge = payload.csvMerge;
if (!merge) die('csvMerge missing');
let master = fs.readFileSync(merge.target, 'utf8');
const rows = fs.readFileSync(merge.rowsFile, 'utf8');
if (!master.endsWith('\n')) master += '\n';
const masterLines = master.split('\n').filter(Boolean);
const hasHeader = !/^(MM-|LAW-)/.test(masterLines[0]);
const bodyStart = hasHeader ? 1 : 0;
const before = masterLines.length - bodyStart;
if (before !== merge.expectBefore) die('master-matrix.csv holds ' + before + ' rows (expected ' + merge.expectBefore + ')');
const ids = new Set(masterLines.slice(bodyStart).map(l => l.split(',')[0]));
const rowLines = rows.split('\n').filter(Boolean);
let added = 0, skipped = 0;
for (const l of rowLines) {
  const id = l.split(',')[0];
  if (!id) continue;
  if (ids.has(id)) { skipped++; continue; }
  masterLines.push(l); ids.add(id); added++;
}
const after = masterLines.length - bodyStart;
if (after !== merge.expectAfter) die('master-matrix.csv holds ' + after + ' rows after merge (expected ' + merge.expectAfter + ')');
fs.writeFileSync(merge.target, masterLines.join('\n') + '\n');
diag.push('CSV merge OK: added ' + added + ', skipped ' + skipped + ' duplicates; rows ' + before + ' -> ' + after);

// ---------- 2. README ----------
let readme = patchFile('README.md', payload.readmeReplaces, 'README');
function replaceSection(text, heading, content) {
  const lines = text.split('\n');
  let found = 0;
  for (let i = 0; i < lines.length; i++) if (lines[i].trim() === heading) found++;
  if (found !== 1) die('section heading occurs ' + found + ' times (expected 1): ' + heading);
  let h = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].trim() === heading) { h = i; break; }
  let end = lines.length;
  for (let i = h + 1; i < lines.length; i++) if (/^#\s/.test(lines[i])) { end = i; break; }
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
diag.push('README finalized.');

// ---------- 3. MASTER-MATRIX.md ----------
const mm = patchFile('docs/MASTER-MATRIX.md', payload.mmReplaces, 'MASTER-MATRIX');
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);
diag.push('MASTER-MATRIX.md finalized.');

// ---------- 4. batch-15-status.md verification record ----------
const vr = payload.verificationRecord;
if (vr) {
  let st = fs.readFileSync('docs/matrix/batch-15-status.md', 'utf8');
  const idx = st.indexOf('## Verification record');
  if (idx === -1) die('batch-15-status.md: Verification record heading not found');
  if (!/finalized after gate\/Pages\/live verification/.test(st.slice(idx))) die('batch-15-status.md: unexpected Verification record content');
  st = st.slice(0, idx) + vr;
  if (!st.endsWith('\n')) st += '\n';
  fs.writeFileSync('docs/matrix/batch-15-status.md', st);
  diag.push('batch-15-status.md verification record written.');
}

diag.push('SUCCESS: batch-15 finalize complete.');
fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n');
console.log('apply-batch-15-docs: batch-15 finalize complete.');
