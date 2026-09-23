#!/usr/bin/env node
/**
 * apply-batch-14-docs.js - server-side docs sync for Batch 14 (zero dependencies).
 *
 * Merges docs/matrix/batch-14-rows.csv into docs/matrix/master-matrix.csv (ID-deduped,
 * idempotent), applies strictly-validated README.md updates, MASTER-MATRIX.md updates
 * and appends the Batch 14 manufacturer rows to docs/MODEL-DATABASE.md from
 * docs/sync/batch-14-model-database-appendix.md. Runs inside the docs-sync workflow
 * because long repo files exceed the fetch window of the production run tooling
 * (fetch mojibake makes client-side rewrites unsafe).
 *
 * Validation is strict: every replacement find-string must occur EXACTLY the
 * expected number of times; on any mismatch the script writes NOTHING, exits non-zero.
 */
'use strict';
const fs = require('fs');
function die(msg) { console.error('apply-batch-14-docs: ' + msg); process.exit(1); }
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-14-docs-sync.json', 'utf8'));

// ---------- 1. Merge pending matrix rows (idempotent, ID-deduped) ----------
const csvPath = 'docs/matrix/master-matrix.csv';
let csv = fs.readFileSync(csvPath, 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '\n');
const existingIds = new Set();
for (const line of csv.split('\n')) { if (!line.trim()) continue; existingIds.add(line.split(',')[0].trim()); }
for (const rowFile of payload.rowFiles || []) {
  const rows = fs.readFileSync(rowFile, 'utf8');
  for (const line of rows.replace(/\r\n/g, '\n').split('\n')) {
    if (!line.trim()) continue;
    const id = line.split(',')[0].trim();
    if (!/^(LAW|MM)-\d+$/.test(id)) die('bad row ID "' + id + '" in ' + rowFile);
    if (existingIds.has(id)) continue;
    csv += line + '\n';
    existingIds.add(id);
  }
}
const totalRows = existingIds.size;

// ---------- 2. Exact-once replacements (string or regex, count-validated) ----------
function replaceValidated(text, r, label) {
  if (r.regex) {
    const re = new RegExp(r.regex, 'g');
    const count = (text.match(re) || []).length;
    const expect = r.expectedCount == null ? 1 : r.expectedCount;
    if (count !== expect) die(label + ' regex occurs ' + count + ' times (expected ' + expect + '): ' + r.regex);
    return text.replace(new RegExp(r.regex), r.replace);
  }
  const count = text.split(r.find).length - 1;
  const expect = r.expectedCount == null ? 1 : r.expectedCount;
  if (count !== expect) die(label + ' replacement occurs ' + count + ' times (expected ' + expect + '): "' + String(r.find).slice(0, 80) + '..."');
  if (r.occurrence == null) return text.replace(r.find, r.replace);
  // replace only the given occurrence index
  const parts = text.split(r.find);
  const idx = r.occurrence;
  if (idx > count - 1) die(label + ' occurrence index ' + idx + ' out of range');
  let out = parts[0];
  for (let i = 1; i < parts.length; i++) out += (i - 1 === idx ? r.replace : r.find) + parts[i];
  return out;
}

// ---------- 3. README: replacements, section replaces, changelog prepend ----------
let readme = fs.readFileSync('README.md', 'utf8');
for (const r of payload.replacements || []) readme = replaceValidated(readme, r, 'README');
function replaceSection(text, heading, content) {
  const lines = text.split('\n');
  let h = -1;
  for (let i = 0; i < lines.length; i++) { if (lines[i].trim() === heading) { h = i; break; } }
  if (h === -1) die('section heading not found: ' + heading);
  let end = lines.length;
  for (let i = h + 1; i < lines.length; i++) { if (/^#\s/.test(lines[i])) { end = i; break; } }
  return lines.slice(0, h + 1).concat([content]).concat(lines.slice(end)).join('\n');
}
for (const s of payload.sectionReplaces || []) readme = replaceSection(readme, s.heading, s.content);
if (payload.changelogPrepend && payload.changelogPrepend.length) {
  const marker = '# CHANGE LOG\n\n';
  const idx = readme.indexOf(marker);
  if (idx === -1) die('changelog heading not found');
  const insert = payload.changelogPrepend.map(e => (e.startsWith('-') ? e : '- ' + e)).join('\n') + '\n';
  readme = readme.slice(0, idx + marker.length) + insert + readme.slice(idx + marker.length);
}
if (!readme.endsWith('\n')) readme += '\n';
for (const must of payload.expectContains || []) if (!readme.includes(must)) die('post-validation failed: README does not contain: ' + must.slice(0, 80));

// ---------- 4. MASTER-MATRIX updates ----------
let mm = fs.readFileSync('docs/MASTER-MATRIX.md', 'utf8');
for (const r of payload.mmReplacements || []) mm = replaceValidated(mm, r, 'MASTER-MATRIX');
for (const must of payload.mmExpectContains || []) if (!mm.includes(must)) die('post-validation failed: MASTER-MATRIX does not contain: ' + must.slice(0, 80));

// ---------- 5. MODEL-DATABASE append (idempotent) ----------
let mdb = fs.readFileSync('docs/MODEL-DATABASE.md', 'utf8');
if (!mdb.includes('Batch 14 additions')) {
  mdb += '\n' + fs.readFileSync('docs/sync/batch-14-model-database-appendix.md', 'utf8');
  if (!mdb.endsWith('\n')) mdb += '\n';
}

// ---------- 6. Validate + write ----------
fs.writeFileSync(csvPath, csv);
fs.writeFileSync('README.md', readme);
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);
fs.writeFileSync('docs/MODEL-DATABASE.md', mdb);
console.log('apply-batch-14-docs: master-matrix.csv rows=' + totalRows + '; README, MASTER-MATRIX and MODEL-DATABASE updated.');
