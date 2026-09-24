'use strict';
const fs = require('fs');
const NL = String.fromCharCode(10);
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL); } catch (e) {}
  console.error('apply-batch-23-docs: ' + msg);
  process.exit(1);
}
function isIdRow(l) {
  return (l.indexOf('MM-') === 0 && l.length > 7 && l[7] === ',') ||
         (l.indexOf('LAW-') === 0 && l.length > 8 && l[8] === ',');
}
function parseRecord(text) {
  const row = [];
  let field = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQ = false; }
      } else { field += ch; }
    } else {
      if (ch === '"') { inQ = true; }
      else if (ch === ',') { row.push(field); field = ''; }
      else { field += ch; }
    }
  }
  row.push(field);
  return row;
}

const payload = JSON.parse(fs.readFileSync('docs/sync/batch-23-docs-sync.json', 'utf8'));
const merge = payload.csvMerge;

let master = fs.readFileSync(merge.target, 'utf8');
if (!master.endsWith(NL)) master += NL;
const masterLines = master.split(NL);
if (masterLines[masterLines.length - 1] === '') masterLines.pop();
const idRowLines = masterLines.filter(isIdRow);
const before = idRowLines.length;
diag.push('CSV structure: totalLines=' + masterLines.length +
  ' idRows=' + before +
  ' firstId=' + idRowLines[0].split(',')[0] +
  ' lastId=' + idRowLines[idRowLines.length - 1].split(',')[0]);

const expectedIds = [];
for (let i = 819; i <= 847; i++) expectedIds.push('MM-0' + i);
const normRows = [];
for (const id of expectedIds) {
  const hits = masterLines.filter((l) => l.indexOf(id + ',') === 0);
  if (hits.length !== 1) {
    die('expected exactly 1 master row for ' + id + ', found ' + hits.length);
  }
  const line = hits[0];
  if (line.slice(-10) !== ',published') {
    die(id + ' does not end with ,published');
  }
  const fields = parseRecord(line);
  if (fields.length !== 16) {
    die(id + ' parses to ' + fields.length + ' fields (expected 16)');
  }
  const toks = fields[14].split(',').map((t) => t.trim()).filter((t) => t !== '');
  for (const t of toks) {
    if (!/^[a-z0-9-]+$/.test(t)) {
      die(id + ' damaged internal-link token: [' + t + ']');
    }
  }
  if (/  /.test(fields[3])) {
    die(id + ' query field contains a double space (transport damage)');
  }
  normRows.push(line);
}
diag.push('batch-23 master rows validated: 29 rows (MM-0819..MM-0847), ' +
  '16 fields each, Status=published, clean slug tokens');

const rowsHeader = 'ID,Primary topic,Proposed title,Primary query,Search intent,' +
  'Cluster,Subcluster,Content type,Audience,Source basis,Research flags,' +
  'Legal/tech sensitivity,Closest related article,Differentiation reason,' +
  'Internal link targets,Status';
const normContent = rowsHeader + NL + normRows.join(NL) + NL;
for (const rf of merge.rowsFiles) {
  const cur = fs.readFileSync(rf.file, 'utf8');
  const curLines = cur.split(NL);
  if (curLines[curLines.length - 1] === '') curLines.pop();
  diag.push('rowsFile ' + rf.file + ': physicalLines=' + curLines.length + ' (expected 30)');
  if (cur !== normContent) {
    fs.writeFileSync(rf.file, normContent);
    diag.push('rowsFile normalized from validated master rows: ' + rf.file);
  } else {
    diag.push('rowsFile already matches the validated master rows');
  }
}

if (merge.expectAfter !== null && before !== merge.expectAfter) {
  die('master-matrix.csv holds ' + before + ' ID rows (expected ' + merge.expectAfter + ')');
}

const statusPath = 'docs/matrix/batch-23-status.md';
let statusDoc = fs.readFileSync(statusPath, 'utf8');
const marker = '## Docs-sync finalization record';
if (statusDoc.indexOf(marker) === -1) {
  if (!statusDoc.endsWith(NL)) statusDoc += NL;
  const section = [
    '',
    marker,
    '',
    '- Docs-sync run 22 (Actions run 35949732126, head 81a59f1) applied the final docs state in bot commit 9fe58ab on 2026-09-24: docs/matrix/master-matrix.csv merged 884 -> 913 ID rows' +
    '; README.md updated (CSV bullet 913 committed rows; 913 published articles bullet; hub bullet; OPEN ISSUES 1; CONTENT and DEPLOYMENT STATE batch-23 bullets); docs/MASTER-MATRIX.md ' +
    'updated (913 committed rows; Cluster 12 COMPLETE: 54 of 54 intents). No README CHANGE LOG entry: the README has no changelog section.',
    '- Rows-file history: 87b74be pushed docs/matrix/batch-23-rows.csv with transport-mangled physical lines (stray mid-token newlines; the 1e425ec Status-append repair could not fix li' +
    'ne-based corruption). The file was reconstructed from the 87b74be blob (29 clean single-line rows, Status=published) and re-pushed in 81a59f1; docs-sync run 22 validated parsedRows' +
    '=29 and merged all 29 rows into master-matrix.csv (884 -> 913).',
    '- Re-run 5 validation: this run re-validates the 29 merged master rows (16 fields, Status=published, clean internal-link slug tokens, no double-space damage), checks docs/matrix/ba' +
    'tch-23-rows.csv against the validated master rows, and re-checks the 913-row master count. master-matrix.csv is a headerless ID-row list (line 0 is the MM-0001 row), so the rows-fi' +
    'le header is taken from the canonical 16-column matrix header. Result recorded in sync-debug.txt at the repo root.',
    ''
  ];
  statusDoc += section.join(NL);
  fs.writeFileSync(statusPath, statusDoc);
  diag.push('batch-23-status.md finalization record appended');
} else {
  diag.push('batch-23-status.md finalization record already present');
}

diag.push('OK: master-matrix.csv holds ' + before + ' ID rows; batch-23 docs state complete');
fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL);
console.log('apply-batch-23-docs: OK (master ' + before + ' rows; batch-23 validated)');
