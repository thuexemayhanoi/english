#!/usr/bin/env node
/**
 * apply-batch-docs.js — server-side docs sync (zero dependencies).
 *
 * Merges pending batch row files into docs/matrix/master-matrix.csv (ID-deduped,
 * idempotent) and applies strictly-validated README.md state updates from a JSON
 * payload. Runs inside the docs-sync GitHub Actions workflow because README.md
 * and master-matrix.csv exceed the fetch window of the production run tooling.
 *
 * Usage: node scripts/apply-batch-docs.js [payload.json]
 *   payload.json defaults to docs/sync/batch-12-readme-sync.json
 *
 * Validation is strict: every replacement string must occur EXACTLY ONCE,
 * every section heading must be found, and the changelog heading must exist.
 * On any mismatch the script prints an error, writes NOTHING, exits non-zero.
 */

'use strict';

const fs = require('fs');

function die(msg) {
  console.error('apply-batch-docs: ' + msg);
  process.exit(1);
}

const payloadPath = process.argv[2] || 'docs/sync/batch-12-readme-sync.json';
let payload;
try {
  payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
} catch (e) {
  die('cannot read payload ' + payloadPath + ': ' + e.message);
}

// ---------- 1. Merge pending matrix rows (idempotent, ID-deduped) ----------
const csvPath = 'docs/matrix/master-matrix.csv';
let csv = fs.readFileSync(csvPath, 'utf8');
// normalize trailing newline
csv = csv.replace(/\r\n/g, '\n').replace(/\n+$/, '\n');
const existingIds = new Set();
for (const line of csv.split('\n')) {
  if (!line.trim()) continue;
  existingIds.add(line.split(',')[0].trim());
}
let added = 0;
for (const rowFile of payload.rowFiles || []) {
  let rows;
  try {
    rows = fs.readFileSync(rowFile, 'utf8');
  } catch (e) {
    die('cannot read row file ' + rowFile + ': ' + e.message);
  }
  for (const line of rows.replace(/\r\n/g, '\n').split('\n')) {
    if (!line.trim()) continue;
    const id = line.split(',')[0].trim();
    if (!/^(LAW|MM)-\d+$/.test(id)) die('bad row ID "' + id + '" in ' + rowFile);
    if (existingIds.has(id)) continue;
    csv += line + '\n';
    existingIds.add(id);
    added++;
  }
}
const totalRows = [...existingIds].length;

// ---------- 2. README replacements (exact, must occur exactly once) ----------
let readme = fs.readFileSync('README.md', 'utf8');
for (const r of payload.replacements || []) {
  const count = readme.split(r.find).length - 1;
  if (count !== 1) die('replacement find-string occurs ' + count + ' times (expected 1): "' + r.find.slice(0, 80) + '..."');
  readme = readme.replace(r.find, r.replace);
}

// ---------- 3. README section replaces (heading -> next "# " heading) ----------
function replaceSection(text, heading, content) {
  const lines = text.split('\n');
  let h = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === heading) { h = i; break; }
  }
  if (h === -1) die('section heading not found: ' + heading);
  let end = lines.length;
  for (let i = h + 1; i < lines.length; i++) {
    if (/^#\s/.test(lines[i])) { end = i; break; }
  }
  // preserve exactly one blank line before the next heading
  const newLines = lines.slice(0, h + 1).concat([content]).concat(lines.slice(end));
  return newLines.join('\n');
}
for (const s of payload.sectionReplaces || []) {
  readme = replaceSection(readme, s.heading, s.content);
}

// ---------- 4. Changelog prepend ----------
if (payload.changelogPrepend && payload.changelogPrepend.length) {
  const marker = '# CHANGE LOG\n\n';
  const idx = readme.indexOf(marker);
  if (idx === -1) die('changelog heading not found');
  const insert = payload.changelogPrepend.map(e => (e.startsWith('-') ? e : '- ' + e)).join('\n') + '\n';
  readme = readme.slice(0, idx + marker.length) + insert + readme.slice(idx + marker.length);
}

// ---------- 5. Validate, then write ----------
if (!readme.endsWith('\n')) readme += '\n';
for (const must of payload.expectContains || []) {
  if (!readme.includes(must)) die('post-validation failed: README does not contain: ' + must.slice(0, 80));
}
fs.writeFileSync(csvPath, csv);
fs.writeFileSync('README.md', readme);
console.log('apply-batch-docs: merged ' + added + ' new matrix rows (master-matrix.csv now ' + totalRows + ' rows); README updated (' +
  (payload.replacements || []).length + ' replacements, ' +
  (payload.sectionReplaces || []).length + ' sections, ' +
  (payload.changelogPrepend || []).length + ' changelog entries).');
