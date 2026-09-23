#!/usr/bin/env node
/**
 * apply-batch-16-docs.js - server-side finalize for Batch 16 (zero dependencies).
 * Applies docs/sync/batch-16-docs-sync.json:
 *   1. master-matrix.csv row merge (ID-row validated; 31 batch-16 rows + 2 batch-16b rows verbatim)
 *   2. README targeted state patches + DEPLOYMENT STATE / NEXT RECOMMENDED STEP
 *      section replaces + changelog entry 38 (idempotent)
 *   3. MASTER-MATRIX.md targeted patches (cluster-4 completion, CSV row counts)
 *   4. batch-16-status.md verification record (section-boundary aware: preserves the
 *      Research provenance and Overlap reconciliation sections that follow it)
 * Self-diagnosing: every anchor is count-validated; failures write sync-debug.txt.
 */
'use strict';
const fs = require('fs');
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n'); } catch (e) {}
  console.error('apply-batch-16-docs: ' + msg);
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-16-docs-sync.json', 'utf8'));
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
const IDRE = /^(MM-\d{4}|LAW-\d{4}),/;
if (!master.endsWith('\n')) master += '\n';
const masterLines = master.split('\n').filter(Boolean);
const idRowLines = masterLines.filter(l => IDRE.test(l));
const before = idRowLines.length;
diag.push('CSV structure: totalLines=' + masterLines.length + ' idRows=' + before +
  ' firstId=' + (idRowLines[0] || '').split(',')[0] + ' lastId=' + (idRowLines[idRowLines.length - 1] || '').split(',')[0]);
if (merge.expectBefore !== null && before !== merge.expectBefore) {
  die('master-matrix.csv holds ' + before + ' ID rows (expected ' + merge.expectBefore + ')');
}
const ids = new Set(idRowLines.map(l => l.split(',')[0]));
let added = 0, skipped = 0;
for (const rf of merge.rowsFiles) {
  const rows = fs.readFileSync(rf.file, 'utf8');
  const rowIdLines = rows.split('\n').filter(Boolean).filter(l => IDRE.test(l));
  diag.push('rowsFile ' + rf.file + ': idRows=' + rowIdLines.length);
  if (rf.expectRows !== null && rowIdLines.length !== rf.expectRows) {
    die(rf.file + ' holds ' + rowIdLines.length + ' ID rows (expected ' + rf.expectRows + ')');
  }
  for (const l of rowIdLines) {
    const id = l.split(',')[0];
    if (ids.has(id)) { skipped++; continue; }
    masterLines.push(l); ids.add(id); added++;
  }
}
const after = before + added;
if (merge.expectAfter !== null && after !== merge.expectAfter) {
  die('master-matrix.csv holds ' + after + ' ID rows after merge (expected ' + merge.expectAfter + ')');
}
fs.writeFileSync(merge.target, masterLines.join('\n') + '\n');
diag.push('CSV merge OK: added ' + added + ', skipped ' + skipped + ' duplicates; ID rows ' + before + ' -> ' + after);

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

// ---------- 3. MASTER-MATRIX.md ---------
const mm = patchFile('docs/MASTER-MATRIX.md', payload.mmReplaces, 'MASTER-MATRIX');
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);
diag.push('MASTER-MATRIX.md finalized.');

// ---------- 4. batch-16-status.md verification record ----------
const vr = payload.verificationRecord;
if (vr) {
  let st = fs.readFileSync('docs/matrix/batch-16-status.md', 'utf8');
  const idx = st.indexOf('## Verification record');
  if (idx === -1) die('batch-16-status.md: Verification record heading not found');
  const stLines = st.split('\n');
  let seen = false, endLine = stLines.length;
  for (let i = 0; i < stLines.length; i++) {
    if (stLines[i].startsWith('## Verification record')) { seen = true; continue; }
    if (seen && /^## /.test(stLines[i])) { endLine = i; break; }
  }
  const end = stLines.slice(0, endLine).join('\n').length;
  const oldSection = st.slice(idx, end);
  if (!/To be completed/.test(oldSection)) die('batch-16-status.md: unexpected Verification record content');
  st = st.slice(0, idx) + vr + '\n' + st.slice(end);
  if (!st.endsWith('\n')) st += '\n';
  fs.writeFileSync('docs/matrix/batch-16-status.md', st);
  diag.push('batch-16-status.md verification record written (following sections preserved).');
}

diag.push('SUCCESS: batch-16 finalize complete.');
fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n');
console.log('apply-batch-16-docs: batch-16 finalize complete.');
