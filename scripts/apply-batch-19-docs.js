#!/usr/bin/env node
/**
 * apply-batch-19-docs.js - server-side finalize for Batch 19 (zero dependencies).
 * Applies docs/sync/batch-19-docs-sync.json:
 *   1. master-matrix.csv row merge (ID-row validated; 40 batch-19 rows verbatim, 730 -> 770)
 *   2. README patches: master-matrix bullet, OPEN ISSUES item 1, DEPLOYMENT STATE batch-19 bullet, CHANGE LOG entry
 *   3. MASTER-MATRIX.md patches: CSV row-count, merge chain, cluster-6 row enumeration, cluster-6 bullet
 *   4. docs/matrix/batch-19-status.md final verification append
 * Idempotent: re-running on an already-synced tree makes no changes.
 * Self-diagnosing: failures write sync-debug.txt.
 */
'use strict';
const fs = require('fs');
const NL = String.fromCharCode(10);
const diag = [];
function die(msg) {
  diag.push('FATAL: ' + msg);
  try { fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL); } catch (e) {}
  console.error('apply-batch-19-docs: ' + msg);
  process.exit(1);
}
function patchOnce(text, find, replace, label) {
  if (text.indexOf(find) === -1) {
    if (text.indexOf(replace) !== -1) { diag.push(label + ' already applied: ' + find.slice(0, 50)); return text; }
    die(label + ' anchor not found: ' + find.slice(0, 70));
  }
  const n = text.split(find).length - 1;
  if (n !== 1) die(label + ' anchor occurs ' + n + ' times (expected 1): ' + find.slice(0, 70));
  diag.push(label + ' patch OK: ' + find.slice(0, 60));
  return text.replace(find, replace);
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
  if (hits.length > 1) die(label + ' bullet prefix occurs ' + hits.length + ' ti
mes (expected 1): ' + prefix.slice(0, 70));
  if (hits.length === 0) {
    if (text.indexOf(newLine) !== -1) { diag.push(label + ' bullet already applied'); return text; }
    die(label + ' bullet prefix not found: ' + prefix.slice(0, 70));
  }
  let end = hits[0] + 1;
  while (end < lines.length && !isBoundary(lines[end].trim())) end++;
  lines.splice(hits[0], end - hits[0], newLine);
  diag.push(label + ' bullet replace OK (' + (end - hits[0]) + ' physical line(s)): ' + prefix.slice(0, 60));
  return lines.join(NL);
}
function isIdRow(l) {
  return (l.indexOf('MM-') === 0 && l.length > 7 && l[7] === ',') ||
         (l.indexOf('LAW-') === 0 && l.length > 8 && l[8] === ',');
}

// ---------- 1. master-matrix.csv merge ----------
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-19-docs-sync.json', 'utf8'));
const merge = payload.csvMerge;
if (!merge) die('csvMerge missing');
let master = fs.readFileSync(merge.target, 'utf8');
if (!master.endsWith(NL)) master += NL;
const masterLines = master.split(NL);
if (masterLines[masterLines.length - 1] === '') masterLines.pop();
const idRowLines = masterLines.filter(isIdRow);
const before = idRowLines.length;
diag.push('CSV structure: totalLines=' + masterLines.length + ' idRows=' + before +
  ' firstId=' + idRowLines[0].split(',')[0] + ' lastId=' + idRowLines[idRowLines.length - 1].split(',')[0]);
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
    die(rf.file + ' holds ' + rowIdLines.length + ' ID rows (expected ' + rf.expec
tRows + ')');
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
fs.writeFileSync(merge.target, masterLines.join(NL) + NL);
diag.push('CSV merge OK: added ' + added + ', skipped ' + skipped + ' duplicates; ID rows ' + before + ' -> ' + after);

// ---------- 2. README.md ----------
let readme = fs.readFileSync('README.md', 'utf8');
readme = patchBullet(readme,
  '- docs/matrix/master-matrix.csv holds',
  "- docs/matrix/master-matrix.csv holds 770 committed rows after the batch-19 docs-sync merge (675 -> 703 batch-17, 703 -> 730 batch-18, 730 -> 770 batch-19; 770 published articles): 81 rental-cluster rows (81 published, cluster 1 complete), 45 monthly & long-term rental rows (45 published, cluster 2 complete), the complete 66-row cluster-11 law/licence slice (66 published; IDs renumbered to the unique LAW-0001-LAW-0066 range - see docs/matrix/batch-4-status.md), the complete 55-row cluster-10 safety slice (55 published, cluster 10 complete), 120 cluster-8 maintenance rows (120 published, cluster 8 complete), 90 cluster-9 parts/gear rows (90 published, cluster 9 complete), 110 cluster-3 scooter rows (110 published, cluster 3 complete), 108 cluster-4 motorcycle rows (108 published; cluster 4 COMPLETE: 106 planned intents plus 2 supplementary articles retained from the reconciled Batch 16 concurrent-run overlap), 55 cluster-5 manual & clutch rows (55 published; cluster 5 COMPLETE: 28 in Batch 17 plus 27 in Batch 18) and 40 cluster-6 50cc rows (40 published; cluster 6 COMPLETE: all in Batch 19). The 988-intent plan in docs/MASTER-MATRIX.md remains the planning framework; rows for the remaining clusters are authored batch by batch, before each batch is writte
n. Remaining rows are production candidates according to batch order (not approved for immediate wholesale publication).",
  'README CSV bullet');
readme = patchBullet(readme,
  '1. 3 topic clusters have zero published articles',
  "1. 4 topic clusters have zero published articles (clusters 7, 12, 13, 14 - electric, hanoi, trips, vietnam-travel: planned content, not a defect; next up per docs/MASTER-MATRIX.md ordering: cluster 7 electric, which requires MODEL-DATABASE electric fields from manufacturer pages first; clusters 12-13 need route verification).",
  'README OPEN ISSUES 1');
readme = patchBullet(readme,
  '- Batch 19 (cluster-6 50cc, MM-0665-MM-0704) was published 2026-09-24 in part-commits f2147fe',
  "- Batch 19 (cluster-6 50cc, MM-0665-MM-0704) was published 2026-09-24 in part-commits f2147fe, 81bd7a0, eead9f6, a35b5a4, repairs d8d4ba5 (front-matter quote fix) and 67f7d5c (missing internal_link_targets slug fix), closing inbound-link commit 9ce5a03 (12 existing articles). The Quality Gates on f2147fe and eead9f6 FAILED (front-matter YAML parse error; missing target slug) and both were repaired as above. Post-closing repairs: 0e4cf54 (empty reconciliation commit, changed nothing), fccfa8c (removed stray quotes from the internal_link_targets lines of 12 existing articles - targets appended after the closing YAML quote in 9ce5a03 had created invalid slugs in the internal-link audit; the gate on fccfa8c passed every step except the Guide Assistant test), dbf4e7e (reconstructed docs/matrix/batch-19-rows.csv: joined 9 rows split mid-line during generation, normalized quoting to the batch-18 convention), 2163d30 (named the 50cc category in the 50cc-fines-vietnam intro so the Guide Assistant licence follow-up test retrieves a 50cc answer). FINAL VERIFIED STATE: Quality Gate run 35927676814 (#169) on commit 2163d30 - success, every step including the Guide Assistant test (built index); GitHub Pages deployment 6625676759 of commit 2163d30 - success (2026-09-23T22:2
0:33Z); the live site serves the fixed intro on /articles/50cc-fines-vietnam/; remote MAIN holds 770 article files in _articles/ and all 40 batch-19 slugs verified live.",
  'README DEPLOYMENT batch-19');
{
  const lines = readme.split(NL);
  const marker = 'Batch 19 (cluster-6 50cc) final verification';
  if (readme.indexOf(marker) !== -1) {
    diag.push('README CHANGE LOG entry already present');
  } else {
    let best = -1, max = 0;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (l.indexOf('- 2026-') !== 0) continue;
      const p = l.indexOf(' (');
      const q = l.indexOf('):', p);
      if (p > 0 && q > p) {
        const num = parseInt(l.slice(p + 2, q), 10);
        if (!isNaN(num) && num > max) { max = num; best = i; }
      }
    }
    if (best === -1) {
      diag.push('README CHANGE LOG: no existing dated entries found; skipping changelog insertion (batch-19 state is recorded in CONTENT BATCH STATE and DEPLOYMENT STATE)');
    } else {
      const entry = '- 2026-09-24 (' + (max + 1) + '): ' + marker + ': 40 articles live and verified (MM-0665-MM-0704; part-commits f2147fe/81bd7a0/eead9f6/a35b5a4, repairs d8d4ba5/67f7d5c/0e4cf54/fccfa8c/dbf4e7e/2163d30, closing inbound-link commit 9ce5a03). Quality Gate #169 (run 35927676814) success on 2163d30 including the Guide Assistant test (built index); GitHub Pages deployment 6625676759 success (2026-09-23T22:20:33Z); the live site serves the fixed /articles/50cc-fines-vietnam/ intro; 770 articles site-wide; master-matrix.csv merged 730 -> 770 by the batch-19 docs-sync run; cluster 6 COMPLETE: 40 of 40 intents. Next: cluster 7 (electric, 89 intents - MODEL-DATABASE electric fields first).';
      lines.splice(best, 0, entry);
      readme = lines.join(NL);
      diag.push('README CHANGE LOG entry added as (' + (max + 1) + ') above entry (' + max + ')');
    }
  }
}
fs.writeFileSync('README.md', readme);

// ---------- 3. docs/MASTER-MATRIX.md ----------
let mm = fs.readFileSync('docs/MASTER-MATRIX.md', 'utf8');
mm = patchOnce(mm,
  'The CSV currently holds 730 committed rows (after the batch-14 merge',
  'The CS
V currently holds 770 committed rows (after the batch-14 merge',
  'MM row count');
mm = patchOnce(mm,
  'the batch-17 docs-sync merge 675 -> 703 and the batch-18 docs-sync merge 703 -> 730;',
  'the batch-17 docs-sync merge 675 -> 703, the batch-18 docs-sync merge 703 -> 730 and the batch-19 docs-sync merge 730 -> 770;',
  'MM merge chain');
mm = patchOnce(mm,
  'and 55 cluster-5 manual & clutch rows (55 published; cluster 5 COMPLETE - 28 in Batch 17 plus 27 in Batch 18).',
  'and 55 cluster-5 manual & clutch rows (55 published; cluster 5 COMPLETE - 28 in Batch 17 plus 27 in Batch 18) and 40 cluster-6 50cc rows (40 published; cluster 6 COMPLETE - all in Batch 19).',
  'MM cluster-6 rows');
mm = patchOnce(mm,
  'The 40 batch-19 rows are preserved verbatim in docs/matrix/batch-19-rows.csv pending the master-matrix.csv sync merge 730 -> 770.',
  'The 40 batch-19 rows are preserved verbatim in docs/matrix/batch-19-rows.csv and merged into master-matrix.csv by the batch-19 docs-sync run (730 -> 770).',
  'MM cluster-6 bullet');
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);

// ---------- 4. docs/matrix/batch-19-status.md ----------
const statusPath = 'docs/matrix/batch-19-status.md';
let status = fs.readFileSync(statusPath, 'utf8');
const stMarker = '## Final verification (post-publication repairs)';
if (status.indexOf(stMarker) !== -1) {
  diag.push('batch-19-status.md final verification already present');
} else {
  const section = [
    stMarker,
    '',
    'Verified 2026-09-24 (Asia/Ho_Chi_Minh):',
    '',
    '- Post-closing repair commits: 0e4cf54 (empty reconciliation commit, changed nothing), fccfa8c (removed stray quotes from the internal_link_targets lines of 12 existing articles - targets appended after the closing YAML quote in 9ce5a03 had created invalid slugs in the Quality Gate internal-link audit; the gate on fccfa8c passed every step except the Guide Assistant test), dbf4e7e (reconstructed this rows CSV: joined 9 rows that had been split mid-line duri
ng generation and normalized internal_link_targets quoting to the batch-18 convention), 2163d30 (named the 50cc category in the 50cc-fines-vietnam intro so the Guide Assistant licence follow-up test retrieves a 50cc answer).',
    '- FINAL VERIFIED STATE: Quality Gate run 35927676814 (#169) on commit 2163d30 - success, every step including the Guide Assistant test (built index). GitHub Pages deployment 6625676759 of commit 2163d30 - success (2026-09-23T22:20:33Z). The live site serves the fixed intro on /articles/50cc-fines-vietnam/ (verified with a cache-bypassing fetch; a plain fetch may serve the CDN-cached pre-fix HTML for up to ~10 minutes). Remote MAIN holds 770 article files in _articles/ and all 40 batch-19 slugs are live.',
    '- master-matrix.csv merged 730 -> 770 by the batch-19 docs-sync run; README.md and docs/MASTER-MATRIX.md updated with the verified final state.',
    ''
  ].join(NL);
  status = status.replace(/\\n+$/m, NL) + section;
  fs.writeFileSync(statusPath, status);
  diag.push('batch-19-status.md final verification appended');
}

fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL);
console.log('apply-batch-19-docs: OK (CSV ' + before + ' -> ' + after + '; README/MM/status patched)');
