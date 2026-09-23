#!/usr/bin/env node
/* One-time Batch 7 docs sync: append matrix rows (342->392), patch README state, remove helpers. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function readFile(p) { return fs.readFileSync(path.join(ROOT, p), 'utf8'); }
function writeFile(p, s) { fs.writeFileSync(path.join(ROOT, p), s, 'utf8'); }
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function rep(file, oldStr, newStr, expect) {
  // Whitespace-flexible match: the target text is unique; its line wrapping
  // in the file must not matter (runs of whitespace match \s+).
  expect = expect || 1;
  let t = readFile(file);
  const pattern = oldStr.split(/\s+/).map(escapeRe).join('\\s+');
  const re = new RegExp(pattern, 'g');
  const matches = t.match(re) || [];
  if (matches.length !== expect) {
    throw new Error(`${file}: expected ${expect} occurrence(s) of ${JSON.stringify(oldStr.slice(0, 80))}, found ${matches.length}`);
  }
  t = t.replace(re, () => newStr);
  writeFile(file, t);
}

// Minimal CSV parser (quoted fields, commas, CRLF-safe).
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQ = false, i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQ = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = []; i++; continue;
    }
    field += c; i++;
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// ---- 1. master-matrix.csv: append 50 rows (342 -> 392) ----
const matrixPath = 'docs/matrix/master-matrix.csv';
const rowsPath = 'docs/matrix/batch-7-rows.csv';
const before = parseCsv(readFile(matrixPath));
const add = parseCsv(readFile(rowsPath));
if (before.length !== 342) throw new Error(`expected 342 existing CSV rows, found ${before.length}`);
if (add.length !== 50) throw new Error(`expected 50 new CSV rows, found ${add.length}`);
for (const r of add) if (r.length !== 16) throw new Error(`new row must have 16 fields, got ${r.length}: ${r[0]}`);
let m = readFile(matrixPath);
if (!m.endsWith('\n')) m += '\n';
m += readFile(rowsPath);
const after = parseCsv(m);
if (after.length !== 392) throw new Error(`expected 392 CSV rows after append, found ${after.length}`);
const ids = new Set(after.map(r => r[0]));
if (ids.size !== 392) throw new Error(`duplicate IDs after append (${ids.size} unique)`);
writeFile(matrixPath, m);
console.log(`master-matrix.csv: ${before.length} -> ${after.length} rows`);

// ---- 2. README state updates ----
const R = 'README.md';
rep(R, '- 342 published articles: 66 law/licence articles',
      '- 392 published articles: 66 law/licence articles');
rep(R, 'see docs/matrix/batch-6-status.md). Cluster 10 is COMPLETE (all 55 safety intents).',
      'see docs/matrix/batch-6-status.md), and 50 cluster-8 maintenance Part 4 articles completing cluster 8 (Batch 7, 2026-09-23 — see docs/matrix/batch-7-status.md). Clusters 10 and 8 are COMPLETE (all 55 safety and all 120 maintenance intents).');
rep(R, 'maintenance hub lists all 70 maintenance guides',
      'maintenance hub lists all 120 maintenance guides');
rep(R, 'Sitemap covers all indexable URLs (364 at the Batch-6 state; verified against the build report).',
      'Sitemap covers all indexable URLs (414 at the Batch-7 state; verified against the build report).');
rep(R, 'holds 342 committed rows: 81 rental-cluster rows', 'holds 392 committed rows: 81 rental-cluster rows');
rep(R, '70 cluster-8 maintenance rows (70 published, 50 planned remaining) and 25 cluster-9 parts/gear rows (25 published, 65 planned remaining)',
      '120 cluster-8 maintenance rows (120 published, cluster 8 complete) and 25 cluster-9 parts/gear rows (25 published, 65 planned remaining)');
rep(R, 'COMPLETE 2026-09-23) -> maintenance Part 4 + parts-gear Part 2 -> then model/travel clusters.',
      'COMPLETE 2026-09-23) -> maintenance Part 4 (batch 7, 50 intents, COMPLETE 2026-09-23, cluster 8 done) -> parts-gear Part 2 -> then model/travel clusters.');
rep(R, 'authoritative record for the maintenance Part 3 + parts/gear Part 1 batch.',
      'authoritative record for the maintenance Part 3 + parts/gear Part 1 batch. docs/matrix/batch-7-status.md is the authoritative record for the maintenance Part 4 batch (cluster 8 complete).');
const batch7Bullet = '- Batch 7 (maintenance Part 4): COMPLETE — 50 cluster-8 maintenance articles published in one batch (2026-09-23, commit 4aff06c; MM-0277–MM-0326: 8.1 maintenance-basics 14, 8.2 common-issues 20, 8.3 ownership-practicalities 16). Cluster 8 is COMPLETE: 120 of 120 intents published, 0 proposed rows remain. Maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals (manual/mechanic is the authority); no prices, availability, promotions or repair costs were invented. All 50 new articles cross-link into the existing internal-link graph. See docs/matrix/batch-7-status.md.\n';
rep(R, '- _queue/: empty (no drafts pending).', batch7Bullet + '- _queue/: empty (no drafts pending).');
rep(R, 'maintenance Part 4 (50 rows) and cluster 9 parts/gear Part 2 (65 rows)',
      'cluster 9 parts/gear Part 2 (65 rows)');
rep(R, 'Batch 6 complete (2026-09-23): 25 cluster-8 maintenance Part 3 + 25 cluster-9 parts/gear Part 1 articles published; site-wide 342 published articles; cluster 8 at 70/120, cluster 9 at 25/90. Next: continue cluster 8 maintenance Part 4 (50 remaining) and cluster 9 parts/gear Part 2 (65 remaining), continuing to use OWNER-FACTS.md as the only source of business and pricing claims and primary/manufacturer sources for any technical specification.',
      'Batch 7 complete (2026-09-23): 50 cluster-8 maintenance Part 4 articles published; cluster 8 COMPLETE at 120/120; site-wide 392 published articles; cluster 9 at 25/90. Next: cluster 9 parts, accessories & riding gear Part 2 (65 remaining), continuing to use OWNER-FACTS.md as the only source of business and pricing claims and primary/manufacturer sources for any technical specification.');
rep(R, '- Latest verified implementation commit: 949f0761b55f7b1041152b886b8e7167d52be3cb (Batch 6: 50 articles — 25 cluster-8 maintenance Part 3, 25 cluster-9 parts/gear Part 1 — plus matrix/state docs and QA reports; pushed in three commits 0801936 + a7ee566 + 949f076). Verified live on Pages on 2026-09-23: new article pages (e.g. choosing-engine-oil-motorbike-vietnam, riding-gear-budget-priority-vietnam) resolve on the live site, the parts-gear hub renders, and the live sitemap contains the new batch-6 slugs (364 indexable URLs; 343 article URLs incl. the /articles/ index).',
      '- Latest verified implementation commit: 4aff06c19b58101e6c5662ce37141db61a3fa2d7 (Batch 7: 50 cluster-8 maintenance Part 4 articles, cluster 8 complete; pushed in one commit). Verified live on Pages on 2026-09-23: new article pages (e.g. inspecting-brake-discs-motorbike, learning-basic-motorbike-maintenance) resolve on the live site, the maintenance hub lists the new guides, and the live sitemap carries the new batch-7 slugs (414 indexable URLs at the Batch-7 state; 393 article URLs incl. the /articles/ index).');
rep(R, '- Latest verified Quality Gate run: 35812243455 (commit 949f076, success, 2026-09-23). Intermediate batch commits 0801936 (run 35812140141) and a7ee566 (run 35812210370) also passed.',
      '- Latest verified Quality Gate run: 35817913152 (commit 4aff06c, success, 2026-09-23).');
rep(R, '- Latest verified Pages run: 35812243105 (commit 949f076, success, 2026-09-23).',
      '- Latest verified Pages run: 35817912280 (commit 4aff06c, success, 2026-09-23).');
const changelogEntry = '- 2026-09-23 (27): Batch 7 — maintenance & repair (cluster 8) Part 4, cluster COMPLETE: 50 articles published in one batch (MM-0277–MM-0326, commit 4aff06c). Maintenance 50 (8.1 basics: inspecting-brake-discs, front-fork-care-oil-seals, throttle-cable-free-play, idle-speed-adjustment, kick-starter-care, coolant-radiator-care-liquid-cooled, manual-gearbox-oil-change, fuel-injector-cleaning, headlight-aim-adjustment, choosing-replacement-battery, simple-electrical-faults-horn-switches-fuses, reading-spark-plug-condition, fuel-tank-rust-prevention-treatment, tyre-valves-wheel-balancing; 8.2 common-issues: sticking-brakes-caliper-cleaning, motorbike-overheating-causes, clutch-slipping-manual, hard-shifting-gearbox, leaking-fork-seals, handlebar-vibration, battery-draining-overnight, exhaust-popping-backfiring, running-rich-vs-lean, water-in-fuel, brake-squeal-grinding, kick-start-slipping, rear-brake-locking, motorbike-wont-start-after-washing, ignition-switch-problems, burning-smell, low-compression-signs, fuel-starvation-power-loss, stalling-when-hot, clutch-drag-hard-neutral; 8.3 ownership: changing-engine-oil-at-home, deep-water-riding-aftercare, learning-basic-motorbike-maintenance, maintaining-motorbike-without-garage, warranty-dealer-service, preparing-motorbike-for-sale, spare-parts-availability, repair-or-replace-motorbike-parts, buying-motorbike-parts-online, servicing-before-long-trip, electric-motorbike-maintenance-basics, checking-motorbike-after-fall-accident, maintaining-motorbike-you-rarely-ride, tyre-age-replace-by-date, high-usage-delivery-commuter-maintenance, keeping-old-motorbike-alive-high-mileage). Cluster 8 is COMPLETE (120/120). Maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals (manual/mechanic is the authority); no prices, availability, promotions or repair costs invented; OWNER-FACTS is the only source of business claims. All 50 new articles cross-linked into the internal-link graph; every internal_link_targets entry validated against published slugs (0 broken references). State docs: docs/matrix/batch-7-status.md (authoritative batch record), master-matrix.csv 50 new rows (392 rows), MASTER-MATRIX.md counts, README CURRENT/OPEN ISSUES/MASTER MATRIX/CONTENT BATCH/DEPLOYMENT/NEXT STEP. QA: Quality Gate PASS (run 35817913152, commit 4aff06c, no blocking findings); Pages deployment run 35817912280 success; new slugs verified live (article pages, maintenance hub, sitemap; 414 indexable URLs expected at the Batch-7 state). 392 published articles site-wide.\n';
rep(R, '# CHANGE LOG\n\n', '# CHANGE LOG\n\n' + changelogEntry);
console.log('README.md: state sections updated');

// ---- 3. remove helper files ----
for (const p of [path.join(ROOT, 'docs/matrix/batch-7-rows.csv'), __filename,
                 path.join(ROOT, '.github/workflows/apply-batch7-docs.yml')]) {
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`removed ${path.relative(ROOT, p)}`); }
}
console.log('Batch 7 docs sync complete');
