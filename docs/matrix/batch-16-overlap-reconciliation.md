# Batch 16 overlap reconciliation - concurrent production runs (2026-09-23/24)

Authoritative record of the concurrent-producer overlap during Batch 16 (cluster 4 Part 3), written by the second producer after standing down. This file must be read together with docs/matrix/batch-16-status.md.

## What happened

- Two scheduled production runs started Batch 16 almost simultaneously (commits 20 seconds apart):
  - Run A pushed "Batch 16 part 1: cluster-4 motorcycle comparisons MM-0577-MM-0585 (9 articles)" (commit 6dfc122, 2026-09-23T18:26:37Z).
  - Run B pushed "Batch 16 part 1: 4 model comparisons MM-0577-MM-0580" (commit c05daab, 18:26:57Z) and continued alone through parts 2-7 and the closing commit (88e63ab, 18:34:42Z), publishing the full planned 31 intents MM-0577-MM-0607.
- On detecting the overlap, Run A stopped all further article production and did not push parts 2-5.

## Resolution

- Run B's batch overwrote 7 of Run A's 9 articles at identical slugs with its own verified versions (same intents, same slugs - no duplicate content remains from these 7).
- 2 of Run A's articles were NOT covered by Run B's 31 intents and remain published with distinct, non-cannibalizing intents:
  - MM-0608 honda-wave-alpha-vs-honda-cbr150r - "Honda Wave Alpha vs Honda CBR150R: The Two Ends of Honda's Range"
  - MM-0609 honda-blade-vs-winner-r - "Honda Blade vs Honda Winner R: Styled 110 or Clutch-Controlled 150"
- Both were checked against Run B's 31 intents (batch-16-rows.csv) and all 642 previously published slugs: neither pairing existed anywhere before Batch 16, and neither duplicates a Batch 16 intent. Both are built exclusively from the MODEL-DATABASE Batch 14 verified rows (Honda VN pages, retrieved 2026-09-23); business facts exclusively from OWNER-FACTS.
- Their matrix rows are preserved verbatim in docs/matrix/batch-16b-rows.csv.

## Corrected totals

- Remote article files: 675 (642 before Batch 16 + 31 planned Batch 16 articles + 2 supplementary overlap articles; 7 of Run A's 9 pushes were superseded in place).
- Cluster 4: all 106 planned intents published (Run B's status is authoritative for the 106); plus 2 supplementary articles = 108 cluster-4 articles. After the planned batch-16 docs-sync merge (642 -> 673 rows), append batch-16b-rows.csv (MM-0608, MM-0609) to reach 675 matrix rows, matching the 675 published articles.

## Required follow-up for the next docs-sync run

1. Run scripts/apply-batch-16-docs.js (Run B's finalization: master-matrix.csv 642 -> 673, README batch-16 state).
2. Append docs/matrix/batch-16b-rows.csv rows MM-0608 and MM-0609 to master-matrix.csv (673 -> 675).
3. Correct the README article count from 673 to 675 published articles and note "cluster 4: 106 planned intents COMPLETE plus 2 supplementary articles from the reconciled Batch 16 overlap (see docs/matrix/batch-16-overlap-reconciliation.md)".
4. Update the batch-16-status.md article count (673 -> 675) accordingly.

## Live verification performed (2026-09-23, by Run A)

- GitHub Pages serves the merged state: /articles/ renders 675 guides.
- Spot-checked live and resolving with correct content: honda-wave-alpha-vs-honda-cbr150r, honda-blade-vs-winner-r (Run A), honda-wave-rsx-vs-yamaha-exciter-155 (Run B).
