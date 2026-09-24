'use strict';
const fs = require('fs');
const NL = String.fromCharCode(10);
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL); } catch (e) {}
  console.error('apply-batch-22-docs: ' + msg);
  process.exit(1);
}
function isBoundary(t) {
  if (t === '') return true;
  if (t.indexOf('- ') === 0 || t.indexOf('* ') === 0) return true;
  if (t.indexOf('#') === 0) return true;
  if (t.length >= 3 && t[1] === '.' && t[2] === ' ' && t[0] >= '0' && t[0] <= '9') return true;
  return false;
}
function patchBullet(text, prefix, newLine, label) {
  const lines = text.split(NL);
  const hits = [];
  for (let i = 0; i < lines.length; i++) if (lines[i].indexOf(prefix) === 0) hits.push(i);
  if (hits.length > 1) die(label + ' bullet prefix occurs ' + hits.length + ' times (expected 1): ' + prefix.slice(0, 70));
  if (hits.length === 0) {
    if (text.indexOf(newLine) !== -1) { diag.push(label + ' bullet already applied'); return text; }
    die(label + ' bullet prefix not found: ' + prefix.slice(0, 70));
  }
  let end = hits[0] + 1;
  while (end < lines.length && !isBoundary(lines[end].trim())) end++;
  lines.splice(hits[0], end - hits[0], newLine);
  diag.push(label + ' bullet replace OK (' + (end - hits[0]) + ' physical line(s)): ' + prefix.slice(0, 50));
  return lines.join(NL);
}
function insertBeforeLine(text, anchorPrefix, newLines, marker, label) {
  if (text.indexOf(marker) !== -1) { diag.push(label + ' already applied'); return text; }
  const lines = text.split(NL);
  const hits = [];
  for (let i = 0; i < lines.length; i++) if (lines[i].indexOf(anchorPrefix) === 0) hits.push(i);
  if (hits.length !== 1) die(label + ' anchor occurs ' + hits.length + ' times (expected 1): ' + anchorPrefix.slice(0, 70));
  lines.splice(hits[0], 0, newLines);
  diag.push(label + ' inserted before anchor: ' + anchorPrefix.slice(0, 50));
  return lines.join(NL);
}
function insertAfterLine(text, anchorPrefix, newLine, marker, label) {
  if (text.indexOf(marker) !== -1) { diag.push(label + ' already applied'); return text; }
  const lines = text.split(NL);
  const hits = [];
  for (let i = 0; i < lines.length; i++) if (lines[i].indexOf(anchorPrefix) === 0) hits.push(i);
  if (hits.length !== 1) die(label + ' anchor occurs ' + hits.length + ' times (expected 1): ' + anchorPrefix.slice(0, 70));
  lines.splice(hits[0] + 1, 0, newLine);
  diag.push(label + ' inserted after anchor: ' + anchorPrefix.slice(0, 50));
  return lines.join(NL);
}
function isIdRow(l) {
  return (l.indexOf('MM-') === 0 && l.length > 7 && l[7] === ',') ||
         (l.indexOf('LAW-') === 0 && l.length > 8 && l[8] === ',');
}

// ---------- CSV merge ----------
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-22-docs-sync.json', 'utf8'));
const merge = payload.csvMerge;
let master = fs.readFileSync(merge.target, 'utf8');
if (!master.endsWith(NL)) master += NL;
const masterLines = master.split(NL);
if (masterLines[masterLines.length - 1] === '') masterLines.pop();
const idRowLines = masterLines.filter(isIdRow);
const before = idRowLines.length;
diag.push('CSV structure: totalLines=' + masterLines.length + ' idRows=' + before + ' firstId=' + idRowLines[0].split(',')[0] + ' lastId=' + idRowLines[idRowLines.length - 1].split(',')[0]);
if (merge.expectBefore !== null && before !== merge.expectBefore) {
  die('master-matrix.csv holds ' + before + ' ID rows (expected ' + merge.expectBefore + ')');
}
const ids = new Set(idRowLines.map(l => l.split(',')[0]));
let added = 0, skipped = 0;
for (const rf of merge.rowsFiles) {
  const rows = fs.readFileSync(rf.file, 'utf8');
  const rowIdLines = rows.split(NL).filter(Boolean).filter(isIdRow);
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
const lastId = masterLines.filter(isIdRow).pop().split(',')[0];
if (lastId !== 'MM-0818') die('last ID row is ' + lastId + ' (expected MM-0818)');
fs.writeFileSync(merge.target, masterLines.join(NL) + NL);
diag.push('CSV merge OK: added ' + added + ', skipped ' + skipped + ' duplicates; ID rows ' + before + ' -> ' + after);

// ---------- README ----------
let readme = fs.readFileSync('README.md', 'utf8');
readme = patchBullet(readme,
  '- docs/matrix/master-matrix.csv holds',
  "- docs/matrix/master-matrix.csv holds 884 committed rows after the batch-22 docs-sync merge (the batch-19 merge 730 -> 770, the batch-20 merge 770 -> 820, the batch-21 merge 820 -> 859 and the batch-22 merge 859 -> 884; 884 published articles): 81 rental-cluster rows (81 published, cluster 1 complete), 45 monthly & long-term rental rows (45 published, cluster 2 complete), the complete 66-row cluster-11 law/licence slice (66 published; IDs renumbered to the unique LAW-0001-LAW-0066 range - see docs/matrix/batch-4-status.md), the complete 55-row cluster-10 safety slice (55 published, cluster 10 complete), 120 cluster-8 maintenance rows (120 published, cluster 8 complete), 90 cluster-9 parts/gear rows (90 published, cluster 9 complete), 110 cluster-3 scooter rows (110 published, cluster 3 complete), 108 cluster-4 motorcycle rows (108 published; cluster 4 COMPLETE: 106 planned intents plus 2 supplementary articles retained from the reconciled Batch 16 concurrent-run overlap), 55 cluster-5 manual & clutch rows (55 published; cluster 5 COMPLETE: 28 in Batch 17 plus 27 in Batch 18), 40 cluster-6 50cc rows (40 published; cluster 6 COMPLETE: all in Batch 19), 89 cluster-7 electric rows (89 published; cluster 7 COMPLETE: 50 in Batch 20 plus 39 in Batch 21) and 25 cluster-12 Hanoi travel rows (25 published; cluster 12 IN PROGRESS: 25 of 54 intents published). The 988-intent plan in docs/MASTER-MATRIX.md remains the planning framework; rows for the remaining clusters are authored batch by batch, before each batch is written. Remaining rows are production candidates according to batch order (not approved for immediate wholesale publication).",
  'README CSV bullet');

(function () {
  const marker = '1. 2 topic clusters have zero published articles (clusters 13 and 14';
  if (readme.indexOf(marker) !== -1) { diag.push('README OPEN ISSUES 1 already applied'); return; }
  const lines = readme.split(NL);
  let hit = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('1. ') === 0 && lines[i].indexOf('zero published articles') !== -1) { hit = i; break; }
  }
  if (hit === -1) die('README OPEN ISSUES 1: no "1. ..." line mentioning zero published articles');
  let end = hit + 1;
  while (end < lines.length && !isBoundary(lines[end].trim())) end++;
  lines.splice(hit, end - hit, "1. 2 topic clusters have zero published articles (clusters 13 and 14 - motorbike trips from Hanoi and Vietnam travel: planned content, not a defect; next up per docs/MASTER-MATRIX.md ordering: the 29 remaining cluster-12 Hanoi travel intents, then cluster 13 trips (38 intents) and cluster 14 vietnam-travel (30 intents), which need R2 route/place verification from reliable sources first).");
  diag.push('README OPEN ISSUES 1 replace OK (' + (end - hit) + ' physical line(s))');
  readme = lines.join(NL);
})();

readme = insertBeforeLine(readme, '- _queue/',
  "- Batches 17-21 state: Batches 17-18 (cluster-5 manual & clutch) COMPLETE - 55 of 55 intents published 2026-09-23/24 (28 in Batch 17, 27 in Batch 18; see docs/matrix/batch-17-status.md and docs/matrix/batch-18-status.md). Batch 19 (cluster-6 50cc) COMPLETE - 40 of 40 intents published 2026-09-24 (see docs/matrix/batch-19-status.md). Batches 20-21 (cluster-7 electric) COMPLETE - 89 of 89 intents published 2026-09-24 (50 in Batch 20, 39 in Batch 21; see docs/matrix/batch-20-status.md and docs/matrix/batch-21-status.md).",
  '- Batches 17-21 state:',
  'README CONTENT batches-17-21 bullet');

readme = insertBeforeLine(readme, '- _queue/',
  "- Batch 22 (cluster-12 Hanoi travel Part 1): 25 articles published 2026-09-24 (MM-0794-MM-0818: 7 district/neighbourhood guides (12.1), 9 city-route and landmark guides (12.2), 9 city-practical guides (12.3); part-commits 36df4fe, b889512, 5057246, e1ef421, 7199dc9, closing inbound-link commit c3adbe2, repairs 5595dba/1d16a0f/1da2995, rows no-op 7a7920e) - see docs/matrix/batch-22-status.md. 884 articles site-wide; cluster 12: 25 of 54 intents published, IN PROGRESS. Travel facts verified from sources (July 2025 Hanoi ward restructuring; Long Bien Bridge 2026 repair closure and 27 May 2026 reopening; Hoan Kiem walking-street schedule); business facts exclusively from OWNER-FACTS.",
  '- Batch 22 (cluster-12 Hanoi travel Part 1)',
  'README CONTENT batch-22 bullet');

readme = insertAfterLine(readme, '- Hosting:',
  "- Batch 22 (cluster-12 Hanoi travel Part 1, MM-0794-MM-0818) was published 2026-09-24 in part-commits 36df4fe, b889512, 5057246, e1ef421 and 7199dc9, with closing inbound-link commit c3adbe2 (15 existing articles), link repairs 5595dba, 1d16a0f and 1da2995, rows commit a9dd4b9, rows no-op 7a7920e and closing status commit 673789e. The Quality Gates on 5057246 and 7199dc9 FAILED at the internal-link audit (mid-batch forward reference; bad target slug) and were repaired as above. FINAL VERIFIED STATE: Quality Gate run 35942266956 on a9dd4b9 - success; Quality Gate run 35942491685 on 7a7920e - success; GitHub Pages deployment 6628013557 of a9dd4b9 - success (2026-09-24T01:19:21Z); GitHub Pages deployment 6628042294 of 7a7920e - success (2026-09-24T01:21:46Z). Live verification: /topics/hanoi/ lists the 25 cluster-12 guides, /articles/ lists 884 guides, and batch-22 article pages render live (e.g. /articles/riding-motorbike-noi-bai-airport-hanoi/). Remote MAIN holds 884 article files in _articles/ and all 25 batch-22 slugs verified live.",
  '- Batch 22 (cluster-12 Hanoi travel Part 1, MM-0794-MM-0818) was published 2026-09-24',
  'README DEPLOYMENT batch-22 bullet');

(function () {
  const marker = 'Batch 22 (cluster-12 Hanoi travel Part 1) final verification';
  if (readme.indexOf(marker) !== -1) {
    diag.push('README CHANGE LOG entry already present');
    return;
  }
  const flat = [];
  const map = [];
  for (let i = 0; i < readme.length; i++) {
    if (readme.charCodeAt(i) === 10) continue;
    flat.push(readme[i]); map.push(i);
  }
  const flatStr = flat.join('');
  const hIdx = flatStr.toLowerCase().indexOf('change log');
  if (hIdx === -1) {
    diag.push('README CHANGE LOG: no changelog section found; skipping entry insertion (batch-22 state is recorded in CONTENT BATCH STATE and DEPLOYMENT STATE)');
    return;
  }
  let max = 0, firstEntryFlat = -1;
  let s = 0;
  while (true) {
    const e = flatStr.indexOf('- 2026-', s);
    if (e === -1) break;
    const o = flatStr.indexOf('(', e);
    const c = flatStr.indexOf('):', o);
    if (o > e && o - e < 15 && c > o && c - o < 8) {
      const num = parseInt(flatStr.slice(o + 1, c), 10);
      if (!isNaN(num)) {
        if (e > hIdx && firstEntryFlat === -1) firstEntryFlat = e;
        if (num > max) max = num;
      }
    }
    s = e + 7;
  }
  if (firstEntryFlat === -1) {
    diag.push('README CHANGE LOG: heading found but no dated entries; skipping entry insertion');
    return;
  }
  const insertAt = map[firstEntryFlat];
  const entry = '- 2026-09-24 (' + (max + 1) + '): ' + marker + ': 25 articles live and verified (MM-0794-MM-0818; part-commits 36df4fe/b889512/5057246/e1ef421/7199dc9, closing inbound-link commit c3adbe2, repairs 5595dba/1d16a0f/1da2995). Quality Gate run 35942491685 success on 7a7920e and run 35942266956 success on a9dd4b9; GitHub Pages deployments 6628042294 and 6628013557 success; 884 articles site-wide; master-matrix.csv merged 770 -> 884 by the batch-22 docs-sync run; cluster 12 IN PROGRESS: 25 of 54 intents. Next: the 29 remaining cluster-12 Hanoi travel intents, then cluster 13 trips (38) and cluster 14 vietnam-travel (30).';
  readme = readme.slice(0, insertAt) + entry + NL + readme.slice(insertAt);
  diag.push('README CHANGE LOG entry added as (' + (max + 1) + ') before entry (' + max + ')');
})();
fs.writeFileSync('README.md', readme);

// ---------- MASTER-MATRIX.md ----------
let mm = fs.readFileSync('docs/MASTER-MATRIX.md', 'utf8');
(function () {
  const re = /The CSV currently holds \d+ committed rows[^\n]*/;
  if (mm.indexOf('The CSV currently holds 884 committed rows') !== -1) { diag.push('MM row count already 884'); return; }
  if (!re.test(mm)) die('MM row count sentence not found (regex failed)');
  mm = mm.replace(re, 'The CSV currently holds 884 committed rows (after the batch-14 merge 567 -> 592, the batch-15 docs-sync merge 592 -> 642, the batch-16 docs-sync merge 642 -> 675, the batch-17 docs-sync merge 675 -> 703, the batch-18 docs-sync merge 703 -> 730, the batch-19 docs-sync merge 730 -> 770, and the batch-22 docs-sync merges 770 -> 820 -> 859 -> 884)');
  diag.push('MM row count sentence replaced');
})();
(function () {
  const pairs = [
    ['pending the master-matrix.csv sync merge 730 -> 770', 'merged into master-matrix.csv by the batch-19 docs-sync (730 -> 770)'],
    ['pending the master-matrix.csv sync merge 770 -> 820', 'merged into master-matrix.csv by the batch-22 docs-sync (770 -> 820 -> 884)'],
    ['pending the master-matrix.csv sync merge 820 -> 859', 'merged into master-matrix.csv by the batch-22 docs-sync (820 -> 859 -> 884)']
  ];
  for (const p of pairs) {
    if (mm.indexOf(p[0]) !== -1) { mm = mm.split(p[0]).join(p[1]); diag.push('MM pending-phrase replaced: ' + p[0]); }
    else diag.push('MM pending-phrase absent (already merged or reworded): ' + p[0]);
  }
})();
(function () {
  const anchor = 'Cluster 7 is COMPLETE: 89 of 89 intents published.';
  const sentence = ' Batch 22 opened cluster 12 with 25 of 54 Hanoi travel intents published 2026-09-24 (MM-0794-MM-0818: 7 district/neighbourhood guides, 9 city-route/landmark guides, 9 city-practical guides - see docs/matrix/batch-22-status.md; rows preserved verbatim in docs/matrix/batch-22-rows.csv and merged into master-matrix.csv by the batch-22 docs-sync, 859 -> 884). Cluster 12 is IN PROGRESS: 25 of 54 intents published.';
  if (mm.indexOf('Batch 22 opened cluster 12') !== -1) { diag.push('MM batch-22 sentence already present'); return; }
  const n = mm.split(anchor).length - 1;
  if (n !== 1) die('MM cluster-7 completion anchor occurs ' + n + ' times (expected 1)');
  mm = mm.replace(anchor, anchor + sentence);
  diag.push('MM batch-22 sentence appended');
})();
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);

fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL);
console.log('apply-batch-22-docs: OK (CSV ' + before + ' -> ' + after + '); README/MM patched');
