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

// RFC-4180-ish CSV parser: handles quoted fields containing commas and embedded newlines.
function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (ch !== '\r') field += ch;
    }
  }
  if (field !== '' || row.length > 1 || (row.length === 1 && row[0] !== '')) { row.push(field); rows.push(row); }
  return rows;
}
function csvEscape(f) {
  return /[",\n\r]/.test(f) ? '"' + f.replace(/"/g, '""') + '"' : f;
}
function cleanField(f) {
  let v = f.replace(/\s+/g, ' ').trim();
  // Remove stray Status tokens that a previous append-to-physical-line repair
  // (commit 1e425ec) inserted inside quoted fields, e.g. "...slug,published rest..."
  v = v.replace(/,\s*published\b/g, '').trim();
  return v;
}

// ---------- CSV merge ----------
const payload = JSON.parse(fs.readFileSync('docs/sync/batch-23-docs-sync.json', 'utf8'));
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
const fixedRowsFiles = [];
for (const rf of merge.rowsFiles) {
  const raw = fs.readFileSync(rf.file, 'utf8');
  const parsed = parseCsv(raw);
  diag.push('rowsFile ' + rf.file + ': parsedRows=' + (parsed.length - 1) + ' (physical idRows=' + raw.split(NL).filter(isIdRow).length + ')');
  const header = parsed[0].map(f => f.trim());
  const expectedHeader = 'ID,Primary topic,Proposed title,Primary query,Search intent,Cluster,Subcluster,Content type,Audience,Source basis,Research flags,Legal/tech sensitivity,Closest related article,Differentiation reason,Internal link targets,Status'.split(',');
  if (header.join('|') !== expectedHeader.join('|')) die(rf.file + ': unexpected header columns: ' + header.join('|'));
  const outLines = [header.map(csvEscape).join(',')];
  const dataRows = parsed.slice(1);
  if (rf.expectRows !== null && dataRows.length !== rf.expectRows) {
    die(rf.file + ' holds ' + dataRows.length + ' parsed rows (expected ' + rf.expectRows + ')');
  }
  for (let r = 0; r < dataRows.length; r++) {
    let fields = dataRows[r].map(cleanField);
    if (fields.length && fields[fields.length - 1] === 'published') fields.pop();
    if (fields.length !== expectedHeader.length - 1) {
      die(rf.file + ' row ' + (r + 1) + ': ' + fields.length + ' fields after cleaning (expected ' + (expectedHeader.length - 1) + '): ' + fields[0]);
    }
    const rowLine = fields.map(csvEscape).concat(['published']).join(',');
    if (!isIdRow(rowLine)) die(rf.file + ' row ' + (r + 1) + ' does not serialize as an ID row: ' + rowLine.slice(0, 40));
    outLines.push(rowLine);
  }
  const fixedContent = outLines.join(NL) + NL;
  fixedRowsFiles.push({ file: rf.file, content: fixedContent });
  for (const l of outLines.slice(1)) {
    const id = l.split(',')[0];
    if (ids.has(id)) { skipped++; continue; }
    masterLines.push(l); ids.add(id); added++;
  }
  const rowIds = outLines.slice(1).map(l => l.split(',')[0]);
  const expectedIds = [];
  for (let i = 819; i <= 847; i++) expectedIds.push('MM-0' + i);
  if (rowIds.join(',') !== expectedIds.join(',')) die(rf.file + ': row IDs are not MM-0819..MM-0847 in order: ' + rowIds.join(','));
}
const after = before + added;
if (merge.expectAfter !== null && after !== merge.expectAfter) {
  die('master-matrix.csv holds ' + after + ' ID rows after merge (expected ' + merge.expectAfter + ')');
}
const lastId = masterLines.filter(isIdRow).pop().split(',')[0];
if (lastId !== 'MM-0847') die('last ID row is ' + lastId + ' (expected MM-0847)');
fs.writeFileSync(merge.target, masterLines.join(NL) + NL);
for (const frf of fixedRowsFiles) {
  if (fs.readFileSync(frf.file, 'utf8') !== frf.content) {
    fs.writeFileSync(frf.file, frf.content);
    diag.push('rowsFile normalized to one line per row (repairs the 1e425ec mid-row Status inserts): ' + frf.file);
  }
}
diag.push('CSV merge OK: added ' + added + ', skipped ' + skipped + ' duplicates; ID rows ' + before + ' -> ' + after);

// ---------- README ----------
let readme = fs.readFileSync('README.md', 'utf8');
readme = patchBullet(readme,
  '- docs/matrix/master-matrix.csv holds',
  '- docs/matrix/master-matrix.csv holds 913 committed rows after the batch-23 docs-sync merge (884 -> 913; 913 published articles): 81 rental-cluster rows (81 published, cluster 1 complete), 45 monthly & long-term rental rows (45 published, cluster 2 complete), the complete 66-row cluster-11 law/licence slice (66 published; IDs renumbered to the unique LAW-0001-LAW-0066 range - see docs/matrix/batch-4-status.md), the complete 55-row cluster-10 safety slice (55 published, cluster 10 complete), 120 cluster-8 maintenance rows (120 published, cluster 8 complete), 90 cluster-9 parts/gear rows (90 published, cluster 9 complete), 110 cluster-3 scooter rows (110 published, cluster 3 complete), 108 cluster-4 motorcycle rows (108 published; cluster 4 COMPLETE: 106 planned intents plus 2 supplementary articles retained from the reconciled Batch 16 concurrent-run overlap), 55 cluster-5 manual & clutch rows (55 published; cluster 5 COMPLETE: 28 in Batch 17 plus 27 in Batch 18), 40 cluster-6 50cc rows (40 published; cluster 6 COMPLETE: all in Batch 19), 89 cluster-7 electric rows (89 published; cluster 7 COMPLETE: 50 in Batch 20 plus 39 in Batch 21) and 54 cluster-12 Hanoi travel rows (54 published; cluster 12 COMPLETE: 25 in Batch 22 plus 29 in Batch 23). The 988-intent plan in docs/MASTER-MATRIX.md remains the planning framework; rows for the remaining clusters are authored batch by batch, before each batch is written. Remaining rows are production candidates according to batch order (not approved for immediate wholesale publication).',
  'README CSV bullet');

readme = patchBullet(readme,
  '- 730 published articles:',
  '- 913 published articles: 29 cluster-12 Hanoi travel articles (Batch 23, MM-0819-MM-0847, 2026-09-24 — see docs/matrix/batch-23-status.md) completing cluster 12 (54 of 54 intents published), on top of the earlier 884 published across clusters 1-11 and the cluster-12 Part 1 (see docs/matrix/batch-22-status.md and the earlier batch-status documents). All business facts come exclusively from docs/OWNER-FACTS.md.',
  'README CURRENT STATE published-articles bullet');

readme = patchBullet(readme,
  '- 14 topic hubs live;',
  '- 14 topic hubs live; 2 currently show the empty state (trips and vietnam-travel — planned content, not a defect) ("Guides for this topic are being prepared."); hanoi hub lists all 54 Hanoi travel guides, law-licences hub lists all 66 law articles, rental hub lists all 81 rental guides, monthly-rental hub lists all 45 monthly & long-term rental guides, safety hub lists all 55 safety guides, maintenance hub lists all 120 maintenance guides, parts-gear hub lists all 90 parts/gear guides, scooters hub lists all 110 scooter guides, motorcycles hub lists all 108 motorcycle guides, manual-clutch hub lists all 55 manual & clutch guides, 50cc hub lists all 40 50cc guides, electric hub lists all 89 electric guides.',
  'README hub bullet');

(function () {
  const marker = 'next up per docs/MASTER-MATRIX.md ordering: cluster 13 trips (38 intents)';
  if (readme.indexOf(marker) !== -1) { diag.push('README OPEN ISSUES 1 already applied'); return; }
  const lines = readme.split(NL);
  let hit = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('1. ') === 0 && lines[i].indexOf('zero published articles') !== -1) { hit = i; break; }
  }
  if (hit === -1) die('README OPEN ISSUES 1: no "1. ..." line mentioning zero published articles');
  let end = hit + 1;
  while (end < lines.length && !isBoundary(lines[end].trim())) end++;
  lines.splice(hit, end - hit, '1. 2 topic clusters have zero published articles (clusters 13 and 14 - motorbike trips from Hanoi and Vietnam travel: planned content, not a defect; next up per docs/MASTER-MATRIX.md ordering: cluster 13 trips (38 intents) and cluster 14 vietnam-travel (30 intents), which need R2 route/place verification from reliable sources first).');
  diag.push('README OPEN ISSUES 1 replace OK (' + (end - hit) + ' physical line(s))');
  readme = lines.join(NL);
})();

readme = insertBeforeLine(readme, '- _queue/',
  '- Batch 23 (cluster-12 Hanoi travel Part 2, cluster 12 COMPLETE): 29 articles published 2026-09-24 (MM-0819-MM-0847: 12 district/neighbourhood guides incl. the July 2025 administrative-restructuring explainer (12.1), 9 city-route and landmark guides (12.2), 8 city-practical guides (12.3); part-commits b348f7b/8b50ef8/532e5d5/f4e03b8/6de3123/738ad68, dropped-file repair b43c6a9, wording repairs d935b2d/304ae55, closing inbound-link commit bfc7fa8, rows commits 87b74be/1e425ec, front-matter repairs 7de7e5f/a2f5ed7, QA repairs 4c91266/673d1ec) - see docs/matrix/batch-23-status.md. 913 articles site-wide; cluster 12: 54 of 54 intents published, COMPLETE. Travel facts verified per article in front-matter sources; business facts exclusively from OWNER-FACTS.',
  '- Batch 23 (cluster-12 Hanoi travel Part 2, cluster 12 COMPLETE)',
  'README CONTENT batch-23 bullet');

readme = insertAfterLine(readme, '- Hosting:',
  '- Batch 23 (cluster-12 Hanoi travel Part 2, MM-0819-MM-0847) was published 2026-09-24 in part-commits b348f7b, 8b50ef8, 532e5d5, f4e03b8, 6de3123 and 738ad68, with dropped-file repair b43c6a9 (2 articles: hanoi-motorbike-photo-spots, hotel-parking-motorbike-hanoi), wording repairs d935b2d and 304ae55, closing inbound-link commit bfc7fa8 (24 existing articles), rows commits 87b74be and 1e425ec, front-matter repair 7de7e5f, and closing-run QA repairs 4c91266 (bad internal_link_targets slug regression in apartment-living-motorbike-hanoi), 673d1ec (stray quoted segments in internal_link_targets in 10 inbound-link-edited articles) and a2f5ed7 (trailing commas on sources list items that broke strict YAML and silently dropped 15 articles from the Jekyll collection build). The Quality Gates on the part-commits and on 7de7e5f/4c91266 FAILED at the internal-link audit (mid-batch forward references plus the two QA regressions repaired by the closing run). FINAL VERIFIED STATE: Quality Gate run 35949098104 on 673d1ec - success; GitHub Pages deployment 35949097637 of 673d1ec - success (2026-09-24T02:54:08Z); Quality Gate run 35949237040 on a2f5ed7 - success; GitHub Pages deployment 35949236142 of a2f5ed7 - success (2026-09-24T02:56:07Z). Live verification: /topics/hanoi/ lists the 54 cluster-12 guides, /articles/ lists 913 guides, and batch-23 article pages render live (e.g. /articles/hanoi-train-street-motorbike-guide/). Remote MAIN holds 913 article files in _articles/ and all 29 batch-23 slugs verified present.',
  '- Batch 23 (cluster-12 Hanoi travel Part 2, MM-0819-MM-0847) was published 2026-09-24',
  'README DEPLOYMENT batch-23 bullet');

(function () {
  const marker = 'Batch 23 (cluster-12 Hanoi travel Part 2) final verification';
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
    diag.push('README CHANGE LOG: no changelog section found; skipping entry insertion');
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
  const entry = '- 2026-09-24 (' + (max + 1) + '): ' + marker + ': 29 articles live and verified (MM-0819-MM-0847; part-commits b348f7b/8b50ef8/532e5d5/f4e03b8/6de3123/738ad68, dropped-file repair b43c6a9, inbound-link commit bfc7fa8, front-matter repairs 7de7e5f/a2f5ed7, QA repairs 4c91266/673d1ec). Quality Gate run 35949237040 success on a2f5ed7 and run 35949098104 success on 673d1ec; GitHub Pages deployments 35949236142 and 35949097637 success; 913 articles site-wide; master-matrix.csv merged 884 -> 913 by the batch-23 docs-sync run; cluster 12 COMPLETE: 54 of 54 intents. Next: cluster 13 trips (38 intents) and cluster 14 vietnam-travel (30 intents), requiring R2 route/place verification first.';
  readme = readme.slice(0, insertAt) + entry + NL + readme.slice(insertAt);
  diag.push('README CHANGE LOG entry added as (' + (max + 1) + ') before entry (' + max + ')');
})();
fs.writeFileSync('README.md', readme);

// ---------- MASTER-MATRIX.md ----------
let mm = fs.readFileSync('docs/MASTER-MATRIX.md', 'utf8');
(function () {
  const re = /The CSV currently holds \d+ committed rows[^\n]*/;
  if (mm.indexOf('The CSV currently holds 913 committed rows') !== -1) { diag.push('MM row count already 913'); return; }
  if (!re.test(mm)) die('MM row count sentence not found (regex failed)');
  mm = mm.replace(re, 'The CSV currently holds 913 committed rows (after the batch-22 docs-sync merges 770 -> 820 -> 859 -> 884 and the batch-23 docs-sync merge 884 -> 913)');
  diag.push('MM row count sentence replaced');
})();
(function () {
  const anchor = 'Cluster 12 is IN PROGRESS: 25 of 54 intents published.';
  const sentence = 'Batch 23 completed cluster 12 on 2026-09-24 (MM-0819-MM-0847: 29 articles — 12 district/neighbourhood guides incl. the July 2025 administrative-restructuring explainer (12.1), 9 city-route and landmark guides (12.2), 8 city-practical guides (12.3) — see docs/matrix/batch-23-status.md; rows preserved verbatim in docs/matrix/batch-23-rows.csv and merged into master-matrix.csv by the batch-23 docs-sync, 884 -> 913). Cluster 12 is COMPLETE: 54 of 54 intents published.';
  if (mm.indexOf('Batch 23 completed cluster 12') !== -1) { diag.push('MM batch-23 sentence already present'); return; }
  const n = mm.split(anchor).length - 1;
  if (n !== 1) die('MM cluster-12 in-progress anchor occurs ' + n + ' times (expected 1)');
  mm = mm.replace(anchor, sentence);
  diag.push('MM batch-23 sentence applied');
})();
fs.writeFileSync('docs/MASTER-MATRIX.md', mm);

fs.writeFileSync('sync-debug.txt', diag.join(NL) + NL);
console.log('apply-batch-23-docs: OK (CSV ' + before + ' -> ' + after + '); README/MM patched');
