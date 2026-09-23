#!/usr/bin/env node
'use strict';
const fs = require('fs');
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n'); } catch (e) {}
  console.error('apply-batch-14-docs: ' + msg);
  process.exit(1);
}
function normalizeMojibake(text, label) {
  const pairs = [
    ['\u00e2\u0080\u0094', '\u2014'],
    ['\u00e2\u0080\u0093', '\u2013'],
    ['\u00e2\u0086\u0092', '\u2192'],
    ['\u00c2\u00b7', '\u00b7'],
    ['\u00c3\u0097', '\u00d7'],
    ['\u00c3\u00a1', '\u00e1']
  ];
  let count = 0;
  for (const p of pairs) {
    const parts = text.split(p[0]);
    if (parts.length > 1) { count += parts.length - 1; text = parts.join(p[1]); }
  }
  diag.push(label + ' mojibake repaired: ' + count + ' sequences');
  return text;
}
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-14-docs-sync.json', 'utf8'));
diag.push('payload loaded; replacements=' + (payload.replacements || []).length + '; mmReplacements=' + (payload.mmReplacements || []).length);
function observedCount(text, r) {
  if (r.regex) { const re = new RegExp(r.regex, 'g'); return (text.match(re) || []).length; }
  return text.split(r.find).length - 1;
}
const csvPath = 'docs/matrix/master-matrix.csv';
let csv = fs.readFileSync(csvPath, 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '\n');
const existingIds = new Set();
for (const line of csv.split('\n')) { if (!line.trim()) continue; existingIds.add(line.split(',')[0].trim()); }
diag.push('master-matrix.csv existing unique IDs=' + existingIds.size);
for (const rowFile of payload.rowFiles || []) {
  const rows = fs.readFileSync(rowFile, 'utf8');
  for (const line of rows.replace(/\r\n/g, '\n').split('\n')) {
    if (!line.trim()) continue;
    const id = line.split(',')[0].trim();
    if (!/^(LAW|MM)-\d+$/.test(id)) die('bad row ID "' + id + '" in ' + rowFile);
    if (existingIds.has(id)) { diag.push('row already present, skipped: ' + id); continue; }
    csv += line + '\n';
    existingIds.add(id);
  }
}
const totalRows = existingIds.size;
function replaceValidated(text, r, label) {
  const count = observedCount(text, r);
  const expect = r.expectedCount == null ? 1 : r.expectedCount;
  if (count !== expect) {
    diag.push(label + ' MISMATCH: occurs ' + count + ' times, expected ' + expect + ': "' + String(r.find == null ? r.regex : r.find).slice(0, 120) + '"');
    die(label + ' replacement occurs ' + count + ' times (expected ' + expect + ')');
  }
  diag.push(label + ' OK: occurs ' + count + ' times (expected ' + expect + '): "' + String(r.find == null ? r.regex : r.find).slice(0, 90) + '"');
  if (r.regex) return text.replace(new RegExp(r.regex), r.replace);
  if (r.occurrence == null) return text.replace(r.find, r.replace);
  const parts = text.split(r.find);
  const idx = r.occurrence;
  if (idx > count - 1) die(label + ' occurrence index ' + idx + ' out of range');
  let out = parts[0];
  for (let i = 1; i < parts.length; i++) out += (i - 1 === idx ? r.replace : r.find) + parts[i];
  return out;
}
let readme = fs.readFileSync('README.md', 'utf8');
diag.push('README.md length=' + readme.length);
for (const r of payload.replacements || []) readme = replaceValidated(readme, r, 'README');
function replaceSection(text, heading, content) {
  const lines = text.split('\n');
  let h = -1;
  for (let i = 0; i < lines.length; i++) { if (lines[i].trim() === heading) { h = i; break; } }
  if (h === -1) die('section heading not found: ' + heading);
  let end = lines.length;
  for (let i = h + 1; i < lines.length; i++) { if (/^#\s/.test(lines[i])) { end = i; break; } }
  diag.push('README section OK: ' + heading + ' (heading line ' + (h + 1) + ', ends line ' + end + ')');
  return lines.slice(0, h + 1).concat([content]).concat(lines.slice(end)).join('\n');
}
for (const s of payload.sectionReplaces || []) readme = replaceSection(readme, s.heading, s.content);
if (payload.changelogPrepend && payload.changelogPrepend.length) {
  const marker = '# CHANGE LOG\n\n';
  const idx = readme.indexOf(marker);
  if (idx === -1) die('changelog heading not found');
  const insert = payload.changelogPrepend.map(e => (e.startsWith('-') ? e : '- ' + e)).join('\n') + '\n';
  readme = readme.slice(0, idx + marker.length) + insert + readme.slice(idx + marker.length);
  diag.push('README changelog prepended: ' + payload.changelogPrepend.length + ' entries');
}
if (!readme.endsWith('\n')) readme += '\n';
for (const must of payload.expectContains || []) {
  if (!readme.includes(must)) die('post-validation failed: README does not contain: ' + must.slice(0, 80));
  diag.push('README expectContains OK: "' + must.slice(0, 60) + '"');
}
let mm = normalizeMojibake(fs.readFileSync('docs/MASTER-MATRIX.md', 'utf8'), 'MASTER-MATRIX');
diag.push('MASTER-MATRIX.md length=' + mm.length);
for (const r of payload.mmReplacements || []) mm = replaceValidated(mm, r, 'MASTER-MATRIX');
for (const must of payload.mmExpectContains || []) {
  if (!mm.includes(must)) die('post-validation failed: MASTER-MATRIX does not contain: ' + must.slice(0, 80));
  diag.push('MASTER-MATRIX expectContains OK: "' + must.slice(0, 60) + '"');
}
let mdb = normalizeMojibake(fs.readFileSync('docs/MODEL-DATABASE.md', 'utf8'), 'MODEL-DATABASE');
if (!mdb.includes('Batch 14 additions')) {
  mdb += '\n' + fs.readFileSync('docs/sync/batch-14-model-database-appendix.md', 'utf8');
  if (!mdb.endsWith('\n')) mdb += '\n';
  diag.push('MODEL-DATABASE appendix appended');
} else {
  diag.push('MODEL-DATABASE appendix already present, skipped');
}
fs.writeFileSync(csvPath, csv);
fs.writeFileSync('README.md', readme);
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);
fs.writeFileSync('docs/MODEL-DATABASE.md', mdb);
diag.push('SUCCESS: master-matrix.csv rows=' + totalRows + '; README, MASTER-MATRIX and MODEL-DATABASE updated.');
fs.writeFileSync('sync-debug.txt', diag.join('\n') + '\n');
console.log('apply-batch-14-docs: master-matrix.csv rows=' + totalRows + '; README, MASTER-MATRIX and MODEL-DATABASE updated.');
