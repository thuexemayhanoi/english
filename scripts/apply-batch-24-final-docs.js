// Batch 24 final docs: targeted README.md + docs/MASTER-MATRIX.md state updates.
// Run from repo root by the Docs Sync workflow. Fails loudly if an anchor is missing.
const fs = require('fs');

function load(p) { return fs.readFileSync(p, 'utf8'); }
function save(p, c) { fs.writeFileSync(p, c); }

function replaceOnce(content, oldStr, newStr, label) {
  const n = content.split(oldStr).length - 1;
  if (n !== 1) throw new Error('FATAL(' + label + '): expected exactly 1 occurrence, found ' + n);
  return content.split(oldStr).join(newStr);
}
function replaceRegexOnce(content, regex, newStr, label) {
  const matches = content.match(regex);
  if (!matches || matches.length !== 1) throw new Error('FATAL(' + label + '): expected exactly 1 regex match, found ' + (matches ? matches.length : 0));
  return content.replace(regex, newStr);
}

let readme = load('README.md');
let matrix = load('docs/MASTER-MATRIX.md');

// Idempotency guard: already applied -> no-op success.
if (readme.includes('936 published articles') && matrix.includes('Batch 24 opened cluster 13')) {
  console.log('batch-24 final docs already applied; nothing to do');
  process.exit(0);
}

// 1. CURRENT STATE date
readme = replaceOnce(readme, 'Date: 2026-09-23', 'Date: 2026-09-24', 'current-state-date');

// 2. CURRENT STATE article-count bullet (whole line)
readme = replaceRegexOnce(readme, /^- 913 published articles:[^\n]*$/m,
  '- 936 published articles: 23 cluster-13 trips articles (Batch 24, MM-0848-MM-0870, 2026-09-24 \u2014 see docs/matrix/batch-24-status.md) opening cluster 13 (23 of 38 intents published, IN PROGRESS: 15 day-trip route guides (13.1) and 8 trip-planning guides (13.3)), on top of the earlier 913 published across clusters 1-12 (see docs/matrix/batch-23-status.md and the earlier batch-status documents). All business facts come exclusively from docs/OWNER-FACTS.md.',
  'article-count-bullet');

// 3. CURRENT STATE topic-hub bullet
readme = replaceRegexOnce(readme, /- 14 topic hubs live; 2 currently show the empty state \(trips and vietnam-travel \u2014 planned content, not a defect\)/,
  '- 14 topic hubs live; 1 currently shows the empty state (vietnam-travel \u2014 planned content, not a defect)',
  'hub-empty-state');
readme = replaceOnce(readme, 'hanoi hub lists all 54 Hanoi travel guides,',
  'trips hub lists all 23 trip guides (15 day-trip route guides and 8 trip-planning guides, Batch 24), hanoi hub lists all 54 Hanoi travel guides,',
  'hub-trips-listing');

// 4. OPEN ISSUES item 1 (whole line)
readme = replaceRegexOnce(readme, /^1\. 2 topic clusters have zero published articles[^\n]*first\)\.$/m,
  '1. 1 topic cluster has zero published articles (cluster 14 - Vietnam travel: planned content, not a defect). Cluster 13 trips is IN PROGRESS: 23 of 38 intents published 2026-09-24 (Batch 24, MM-0848-MM-0870 - see docs/matrix/batch-24-status.md). Next up per docs/MASTER-MATRIX.md ordering: the remaining 15 multi-day cluster-13 trip intents (Mai Chau, Moc Chau, Ha Long/Cat Ba, Ha Giang, Cao Bang/Ban Gioc, Ba Be, Northeast loop, Northwest loop, Lang Son, Sapa, Pu Luong, Phong Nha, Hue, central coast Da Nang-Hoi An, first-mountain-trip comparison) as Batch 25, then cluster 14 vietnam-travel (30 intents); both need R2 route/place verification from reliable sources first.',
  'open-issues-1');

// 5. MASTER MATRIX STATE leading sentence
readme = replaceOnce(readme,
  'docs/matrix/master-matrix.csv holds 913 committed rows after the batch-23 docs-sync merge (884 -> 913; 913 published articles):',
  'docs/matrix/master-matrix.csv holds 936 committed rows after the batch-24 docs-sync merge (913 -> 936; 936 published articles; the 23 cluster-13 rows are preserved verbatim in docs/matrix/batch-24-rows.csv):',
  'master-matrix-state');

// 6. CONTENT BATCH STATE: insert Batch 24 bullet before the Batch 23 bullet
const b24Bullet = '- Batch 24 (cluster-13 trips Part 1): 23 articles published 2026-09-24 (MM-0848-MM-0870: 15 day-trip route guides (13.1: Tam Dao, Ba Vi, Duong Lam, Thay/Tay Phuong pagodas, Perfume Pagoda, Co Loa, Bac Ninh craft loop, Dai Lai, Quan Son, Thung Nai, Ninh Binh, Soc Temple, Hung Kings, Nui Coc, and the Tam Dao vs Ba Vi comparison) and 8 trip-planning guides (13.3: trip-prep checklist, day-trip distance, seasons, navigation/offline maps, rural fuel/ATM/coverage, ferry/train transport, budgeting, overnight stays); part-commits c03d6f1, ba792d4, afb52cc, 452e01e and b67e548, wording repair 02dced2, rows/status commits 80ec1f1 and dbf7ef6, closing inbound-link commit 17e5864 (12 existing articles) with link repair c222f19, and QA link repair 58cde4b (truncated fog-slug in 2 articles - the cause of all earlier internal-link-audit gate failures) with rows follow-up 4afc5b6 - see docs/matrix/batch-24-status.md. 936 articles site-wide; cluster 13: 23 of 38 intents published, IN PROGRESS. Route facts verified per article in front-matter sources; business facts exclusively from OWNER-FACTS.';
readme = replaceOnce(readme, '- Batch 23 (cluster-12 Hanoi travel Part 2, cluster 12 COMPLETE):',
  b24Bullet + '
- Batch 23 (cluster-12 Hanoi travel Part 2, cluster 12 COMPLETE):',
  'content-batch-state-insert');

// 7. DEPLOYMENT STATE: insert Batch 24 bullet at the top of the list
const depBullet = '- Batch 24 (cluster-13 trips Part 1, MM-0848-MM-0870) was published 2026-09-24 in part-commits c03d6f1, ba792d4, afb52cc, 452e01e and b67e548, wording repair 02dced2, rows/status commits 80ec1f1 and dbf7ef6, closing inbound-link commit 17e5864 (12 existing articles), link repairs c222f19 (quoted internal_link_targets scalar in 5 articles) and 58cde4b (truncated slug fog-and-low-visibility-riding-motorbike-vietnam in 2 articles, the cause of all earlier internal-link-audit gate failures) with rows follow-up 4afc5b6, and docs-sync tooling 54e91e5. The Quality Gates on the part-commits failed at the internal-link audit until the 58cde4b repair. FINAL VERIFIED STATE: Quality Gate run 35954191800 on 58cde4b - success; Quality Gate run 35954199830 on 4afc5b6 - success (2026-09-24T04:07:20Z); Docs Sync run 35954225195 on 54e91e5 - success (its first merge attempt failed validation because 6 rows in batch-24-rows.csv had embedded newlines; diagnostics commit 7dfe727, rows repair 96666e0, retry 7248d1f); Docs Sync run 35954407188 on 7248d1f - success, bot merge commit c8b42a1 (master-matrix.csv 913 -> 936). Live verification: /topics/trips/ lists the 23 cluster-13 guides, /articles/ lists 936 guides, and batch-24 article pages render live (e.g. /articles/tam-dao-day-trip-motorbike/). Remote MAIN holds 936 article files in _articles/ and all 23 batch-24 slugs verified present.';
readme = replaceOnce(readme, '# DEPLOYMENT STATE\n- Hosting: GitHub Pages, Jekyll, baseurl /english.\n',
  '# DEPLOYMENT STATE\n- Hosting: GitHub Pages, Jekyll, baseurl /english.\n' + depBullet + '\n',
  'deployment-state-insert');

// 8. docs/MASTER-MATRIX.md: batch-24 sentence after the batch-23 sentence
matrix = replaceOnce(matrix, '884 -> 913). Cluster 12 is COMPLETE: 54 of 54 intents published.',
  '884 -> 913). Cluster 12 is COMPLETE: 54 of 54 intents published. Batch 24 opened cluster 13 on 2026-09-24 (MM-0848-MM-0870: 23 of 38 trips intents \u2014 15 day-trip route guides (13.1) and 8 trip-planning guides (13.3) \u2014 see docs/matrix/batch-24-status.md; rows preserved verbatim in docs/matrix/batch-24-rows.csv and merged into master-matrix.csv by the batch-24 docs-sync, 913 -> 936). Cluster 13 is IN PROGRESS: 23 of 38 intents published.',
  'master-matrix-docs-insert');

save('README.md', readme);
save('docs/MASTER-MATRIX.md', matrix);
console.log('OK: README.md and docs/MASTER-MATRIX.md updated for batch-24 finalization (913 -> 936, cluster 13 IN PROGRESS)');
