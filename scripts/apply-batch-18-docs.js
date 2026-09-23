#!/usr/bin/env node
/**
 * apply-batch-18-docs.js - server-side finalize for Batch 18 (zero dependencies).
 * Applies docs/sync/batch-18-docs-sync.json:
 *   1. master-matrix.csv row merge (ID-row validated; 27 batch-18 rows verbatim, 703 -> 730)
 *   2. README targeted state patches + NEXT RECOMMENDED STEP section replace + changelog entry 40 (idempotent)
 *   3. MASTER-MATRIX.md targeted patches (cluster-5 COMPLETE state)
 * Self-diagnosing: every anchor is count-validated; failures write sync-debug.txt.
 */
'use strict';
const fs = require('fs');
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n'); } catch (e) {}
  console.error('apply-batch-18-docs: ' + msg);
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-18-docs-sync.json', 'utf8'));
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
for (const s of payload.sectionReplaces || []) {
  const lines = readme.split('\n');
  let found = 0;
  for (let i = 0; i < lines.length; i++) if (lines[i].trim() === s.heading) found++;
  if (found !== 1) die('README section heading occurs ' + found + ' times (expected 1): ' + s.heading);
  let h = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i].trim() === s.heading) { h = i; break; }
  let e = lines.length;
  for (let i = h + 1; i < lines.length; i++) if (lines[i].startsWith('# ')) { e = i; break; }
  lines.splice(h + 1, e - h - 1, s.content);
  readme = lines.join('\n');
  diag.push('README section replace OK: ' + s.heading);
}
fs.writeFileSync('README.md', readme);

// ---------- 3. MASTER-MATRIX.md ----------
const mm = patchFile('docs/MASTER-MATRIX.md', payload.mmReplaces, 'MM');
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);

fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n');
console.log('apply-batch-18-docs: OK (CSV ' + before + ' -> ' + after + '; README/MM patched)');
