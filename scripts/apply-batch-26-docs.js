'use strict';
// Batch-26 docs sync: merge docs/matrix/batch-26-rows.csv into docs/matrix/master-matrix.csv,
// apply strictly-validated README.md and docs/MASTER-MATRIX.md state updates from the JSON
// payload, optionally insert the Batch-26 DEPLOYMENT STATE bullet (payload.deployBullet) and
// append the finalization record to docs/matrix/batch-26-status.md.
// master-matrix.csv is a headerless ID-row list (line 0 is the MM-0001 data row).
const fs = require('fs');
const NL = String.fromCharCode(10);
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL); } catch (e) {}
  console.error('apply-batch-26-docs: ' + msg);
  process.exit(1);
}
function parseRecord(text) {
  const row = []; let field = ''; let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQ = false; }
      } else { field += ch; }
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else { field += ch; }
    }
  }
  row.push(field); return row;
}
function isIdRow(l) {
  return (l.indexOf('MM-') === 0 && l.length > 7 && l[7] === ',') ||
         (l.indexOf('LAW-') === 0 && l.length > 8 && l[8] === ',');
}
function toTolerant(s) {
  return s.replace(/[.*+?^${()|[\]\\]/g, '\\&').replace(/ /g, '\\s+').replace(/-/g, '[\\u2014\\-]');
}
function applyPairs(text, pairs, label) {
  for (const p of pairs) {
    const re = new RegExp(toTolerant(p.find), 'g');
    const n = (text.match(re) || []).length;
    if (n !== 1) die(label + ' find-string matches ' + n + ' times (expected 1): "' + p.find.slice(0, 90) + '..."');
    text = text.replace(re, function () { return p.replace; });
  }
  return text;
}
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-26-docs-sync.json', 'utf8'));

// 1. CSV merge (skipped when payload.csvMerge is absent — later phases).
let mergedNote = 'csv merge skipped (no csvMerge in payload)';
if (payload.csvMerge) {
  const merge = payload.csvMerge;
  const rowsFile = merge.rowsFiles[0].file;
  const rowsRaw = fs.readFileSync(rowsFile, 'utf8');
  const rowsLines = rowsRaw.split(NL);
  if (rowsLines[rowsLines.length - 1] === '') rowsLines.pop();
  if (rowsLines.length !== merge.rowsFiles[0].expectRows + 1) {
    die(rowsFile + ' holds ' + rowsLines.length + ' physical lines (expected ' + (merge.rowsFiles[0].expectRows + 1) + ' incl. header)');
  }
  const canonHeader = 'ID,Primary topic,Proposed title,Primary query,Search intent,' +
    'Cluster,Subcluster,Content type,Audience,Source basis,Research flags,' +
    'Legal/tech sensitivity,Closest related article,Differentiation reason,' +
    'Internal link targets,Status';
  if (rowsLines[0] !== canonHeader) die('rows file header mismatch');
  const newRows = [];
  for (let i = 1; i < rowsLines.length; i++) {
    const line = rowsLines[i];
    const fields = parseRecord(line);
    if (fields.length !== 16) die(fields[0] + ' parses to ' + fields.length + ' fields (expected 16)');
    if (fields[15] !== 'published') die(fields[0] + ' Status is not published');
    const toks = fields[14].split(',').map(t => t.trim()).filter(t => t !== '');
    for (const t of toks) if (!/^[a-z0-9-]+$/.test(t)) die(fields[0] + ' damaged internal-link token: [' + t + ']');
    if (/  /.test(fields[3])) die(fields[0] + ' query field contains a double space (transport damage)');
    newRows.push(line);
  }
  const ids = newRows.map(r => r.split(',')[0]);
  for (let i = 0; i < ids.length; i++) {
    const want = 'MM-0' + (886 + i);
    if (ids[i] !== want) die('row ' + i + ' has id ' + ids[i] + ' (expected ' + want + ')');
  }
  diag.push('rows file validated: ' + newRows.length + ' rows (MM-0886..MM-0915), 16 fields, Status=published, clean slugs');

  let master = fs.readFileSync(merge.target, 'utf8');
  if (!master.endsWith(NL)) master += NL;
  const masterLines = master.split(NL);
  if (masterLines[masterLines.length - 1] === '') masterLines.pop();
  const idRowLines = masterLines.filter(isIdRow);
  const before = idRowLines.length;
  if (before !== merge.expectBefore) die('master-matrix.csv holds ' + before + ' ID rows (expected ' + merge.expectBefore + ')');
  let appended = 0;
  for (const line of newRows) {
    const id = line.split(',')[0];
    if (masterLines.some(l => l.indexOf(id + ',') === 0)) { diag.push(id + ' already present, skipped'); continue; }
    masterLines.push(line); appended++;
  }
  const after = masterLines.filter(isIdRow).length;
  if (after !== merge.expectAfter) die('after merge master-matrix.csv holds ' + after + ' ID rows (expected ' + merge.expectAfter + ')');
  fs.writeFileSync(merge.target, masterLines.join(NL) + NL);
  mergedNote = 'master-matrix.csv ' + before + ' -> ' + after + ' ID rows (appended ' + appended + ')';
  diag.push(mergedNote);
}

// 2. README pairs.
let readme = fs.readFileSync('README.md', 'utf8');
readme = applyPairs(readme, payload.readmePairs || [], 'README');
// Optional deployment-state bullet (inserted after the Hosting line, newest-first).
if (payload.deployBullet) {
  if (readme.indexOf('Batch 26 (cluster-14 vietnam-travel') !== -1) {
    diag.push('deploy bullet already present, skipped');
  } else {
    const hi = readme.indexOf('# DEPLOYMENT STATE');
    if (hi === -1) die('README has no DEPLOYMENT STATE header');
    const anchor = '- Hosting: GitHub Pages, Jekyll, baseurl /english.';
    const ai = readme.indexOf(anchor, hi);
    if (ai === -1) die('no Hosting anchor in DEPLOYMENT STATE');
    const lineEnd = readme.indexOf(NL, ai);
    const insertAt = lineEnd === -1 ? readme.length : lineEnd + 1;
    readme = readme.slice(0, insertAt) + payload.deployBullet + NL + readme.slice(insertAt);
    diag.push('Batch-26 DEPLOYMENT STATE bullet inserted');
  }
}
if (!readme.endsWith(NL)) readme += NL;
for (const must of payload.expectContains || []) {
  if (readme.indexOf(must) === -1) die('post-validation failed: README does not contain: ' + must.slice(0, 80));
}
fs.writeFileSync('README.md', readme);
diag.push('README.md updated (' + (payload.readmePairs || []).length + ' validated replacements)');

// 3. MASTER-MATRIX pairs.
let mm = fs.readFileSync('docs/MASTER-MATRIX.md', 'utf8');
mm = applyPairs(mm, payload.mmPairs || [], 'MASTER-MATRIX');
if (!mm.endsWith(NL)) mm += NL;
for (const must of payload.mmExpectContains || []) {
  if (mm.indexOf(must) === -1) die('post-validation failed: MASTER-MATRIX does not contain: ' + must.slice(0, 80));
}
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);
diag.push('docs/MASTER-MATRIX.md updated (' + (payload.mmPairs || []).length + ' validated replacements)');

// 4. Finalization record in the status doc.
const statusPath = 'docs/matrix/batch-26-status.md';
let statusDoc = fs.readFileSync(statusPath, 'utf8');
const marker = '## Docs-sync finalization record';
if (statusDoc.indexOf(marker) === -1) {
  if (!statusDoc.endsWith(NL)) statusDoc += NL;
  const section = [
    '',
    marker,
    '',
    '- Batch-26 docs-sync merged the 30 validated batch-26 rows (MM-0886-MM-0915) into docs/matrix/master-matrix.csv (951 -> 981 ID rows) and recorded this finalization. master-matrix.csv is headerless (line 0 is the MM-0001 data row).',
    '- Batch-26 publication record: part-commits 79f3994, 550b668, ee799d8, 4c876ef, 3678055 and d5b0a51; wording/source repair 44c278c; closing inbound-link commit 8aeed05 (14 existing articles). See DEPLOYMENT STATE in README.md for the verified gate and Pages runs.',
    ''
  ];
  statusDoc += section.join(NL);
  fs.writeFileSync(statusPath, statusDoc);
  diag.push('batch-26-status.md finalization record appended');
} else {
  diag.push('batch-26-status.md finalization record already present');
}

diag.push('OK: ' + mergedNote);
console.log('apply-batch-26-docs: OK — ' + mergedNote + '; README + MASTER-MATRIX updated.');
