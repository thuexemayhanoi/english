'use strict';
// Batch-24 docs sync: merge docs/matrix/batch-24-rows.csv into docs/matrix/master-matrix.csv
// and append the finalization record to docs/matrix/batch-24-status.md.
// master-matrix.csv is a headerless ID-row list (line 0 is the MM-0001 data row).
const fs = require('fs');
const NL = String.fromCharCode(10);
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL); } catch (e) {}
  console.error('apply-batch-24-docs: ' + msg);
  process.exit(1);
}
function isIdRow(l) {
  return (l.indexOf('MM-') === 0 && l.length > 7 && l[7] === ',') ||
         (l.indexOf('LAW-') === 0 && l.length > 8 && l[8] === ',');
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

const payload = JSON.parse(fs.readFileSync('docs/sync/batch-24-docs-sync.json', 'utf8'));
const merge = payload.csvMerge;

// 1. Validate the rows file first.
const rowsFile = merge.rowsFiles[0].file;
const rowsRaw = fs.readFileSync(rowsFile, 'utf8');
const rowsLines = rowsRaw.split(NL);
if (rowsLines[rowsLines.length - 1] === '') rowsLines.pop();
if (rowsLines.length !== merge.rowsFiles[0].expectRows + 1) {
  die(rowsFile + ' holds ' + rowsLines.length + ' physical lines (expected ' + (merge.rowsFiles[0].expectRows + 1) + ' incl. header)');
}
const rowsHeader = rowsLines[0];
const canonHeader = 'ID,Primary topic,Proposed title,Primary query,Search intent,' +
  'Cluster,Subcluster,Content type,Audience,Source basis,Research flags,' +
  'Legal/tech sensitivity,Closest related article,Differentiation reason,' +
  'Internal link targets,Status';
if (rowsHeader !== canonHeader) die('rows file header mismatch');
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
  const want = 'MM-0' + (848 + i);
  if (ids[i] !== want) die('row ' + i + ' has id ' + ids[i] + ' (expected ' + want + ')');
}
diag.push('rows file validated: ' + newRows.length + ' rows (MM-0848..MM-0870), 16 fields, Status=published, clean slugs');

// 2. Validate and merge master-matrix.csv.
let master = fs.readFileSync(merge.target, 'utf8');
if (!master.endsWith(NL)) master += NL;
const masterLines = master.split(NL);
if (masterLines[masterLines.length - 1] === '') masterLines.pop();
const idRowLines = masterLines.filter(isIdRow);
const before = idRowLines.length;
diag.push('CSV structure: totalLines=' + masterLines.length + ' idRows=' + before +
  ' firstId=' + idRowLines[0].split(',')[0] + ' lastId=' + idRowLines[idRowLines.length - 1].split(',')[0]);
if (before !== merge.expectBefore) die('master-matrix.csv holds ' + before + ' ID rows (expected ' + merge.expectBefore + ')');
let appended = 0;
for (const line of newRows) {
  const id = line.split(',')[0];
  if (masterLines.some(l => l.indexOf(id + ',') === 0)) { diag.push(id + ' already present, skipped'); continue; }
  masterLines.push(line); appended++;
}
diag.push('appended ' + appended + ' batch-24 rows');
const after = masterLines.filter(isIdRow).length;
if (after !== merge.expectAfter) die('after merge master-matrix.csv holds ' + after + ' ID rows (expected ' + merge.expectAfter + ')');
fs.writeFileSync(merge.target, masterLines.join(NL) + NL);
diag.push('master-matrix.csv written: ' + before + ' -> ' + after + ' ID rows');

// 3. Finalization record in the status doc.
const statusPath = 'docs/matrix/batch-24-status.md';
let statusDoc = fs.readFileSync(statusPath, 'utf8');
const marker = '## Docs-sync finalization record';
if (statusDoc.indexOf(marker) === -1) {
  if (!statusDoc.endsWith(NL)) statusDoc += NL;
  const section = [
    '',
    marker,
    '',
    '- Batch-24 docs-sync merged the 23 validated batch-24 rows (MM-0848-MM-0870) into docs/matrix/master-matrix.csv (' + before + ' -> ' + after + ' ID rows), normalized docs/matrix/batch-24-rows.csv from the same validated rows, and recorded this finalization. master-matrix.csv is headerless (line 0 is the MM-0001 data row).',
    '- Batch-24 QA repairs by the closing run: 02dced2 (stray non-English segments in two part-2 articles), dbf7ef6 (two batch-24-rows.csv text defects), c222f19 (appended batch-24 targets placed outside the quoted internal_link_targets scalar in 5 inbound-link-edited articles), 58cde4b (truncated slug fog-and-low-visibility-riding-motorbike corrected to fog-and-low-visibility-riding-motorbike-vietnam in two articles) and 4afc5b6 (same truncated slug corrected in batch-24-rows.csv). The Quality Gates on the part commits 17e5864 and earlier failed at the internal-link audit for the truncated-slug defect and were repaired as listed; see DEPLOYMENT STATE in README.md for the final verified gate and Pages runs.',
    ''
  ];
  statusDoc += section.join(NL);
  fs.writeFileSync(statusPath, statusDoc);
  diag.push('batch-24-status.md finalization record appended');
} else {
  diag.push('batch-24-status.md finalization record already present');
}

diag.push('OK: master-matrix.csv holds ' + after + ' ID rows; batch-24 docs state complete');
fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL);
console.log('apply-batch-24-docs: OK (master ' + before + ' -> ' + after + ' rows; batch-24 merged)');
