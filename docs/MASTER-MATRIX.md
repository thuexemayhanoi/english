# MASTER CONTENT MATRIX — v3 (populated)

Status: ACTIVE CONTENT MATRIX

- 988 strong planned intents remain the planning framework for future articles.
- 66 law/licence articles are published and VERIFIED (Slice 1: 2026-09-21; Slices 2-4: 2026-09-22 — see docs/matrix/batch-1-status.md). Cluster 11 is complete: 66 of 66 intents published, 0 proposed.
- 81 rental articles are published (cluster 1, Batch 2, 2026-09-22 — see docs/matrix/batch-2-status.md). Cluster 1 is COMPLETE: 81 of 81 intents published, 0 proposed. All business facts come exclusively from docs/OWNER-FACTS.md.
- 45 monthly & long-term rental articles are published (cluster 2, Batch 3, 2026-09-22 — see docs/matrix/batch-3-status.md). Cluster 2 is COMPLETE: 45 of 45 intents published, 0 proposed. Monthly prices are published only for the models named in docs/OWNER-FACTS.md; all other models point to contact for current monthly pricing.
- Cluster 10 (riding skills & safety) is COMPLETE: 55 of 55 intents published (30 in Batch 4 + 25 in Batch 5, 2026-09-22 — see docs/matrix/batch-4-status.md and docs/matrix/batch-5-status.md). Cluster 8 (maintenance & repair) is COMPLETE: 120 of 120 intents published (20 in Batch 4 + 25 in Batch 5 + 25 in Batch 6 + 50 in Batch 7, 2026-09-23 — see docs/matrix/batch-7-status.md). Cluster 9 (parts, accessories & riding gear) is COMPLETE: 90 of 90 intents published (25 in Batch 6, 50 in Batch 8, 15 in Batch 9 — see docs/matrix/batch-9-status.md). Safety articles separate practical riding advice from legal requirements and link to the VERIFIED cluster-11 legal articles; maintenance articles contain no invented torque values, capacities, pressures, electrical values or service intervals.
- Cluster 5 (manual & clutch motorcycles) is COMPLETE: 55 of 55 intents (Batches 17-18, 2026-09-24, MM-0610-MM-0664 — see docs/matrix/batch-17-status.md and docs/matrix/batch-18-status.md). The 28 batch-17 rows are preserved verbatim in docs/matrix/batch-17-rows.csv and the 27 batch-18 rows in docs/matrix/batch-18-rows.csv pending the master-matrix.csv sync merge.
- The remaining rows are production candidates according to batch order. They are NOT approved for immediate wholesale publication: each batch is written, QA'd and committed through the publishing workflow (README → PUBLISHING WORKFLOW).
- docs/matrix/batch-1-status.md is the authoritative rec

ord for legal Batch 1 progress; docs/matrix/batch-2-status.md is the authoritative record for the rental batch; docs/matr
ix/batch-3-status.md is the authoritative record for the monthly & long-term rental batch. docs/matrix/batch-4-status.md is the authoritative record for the safety + maintenance Part 1 batch; docs/matrix/batch-5-status.md is the authoritative record for the safety remainder + maintenance Part 2 batch. docs/matrix/batch-6-status.md is the authoritative record for the maintenance Part 3 + parts/gear Part 1 batch (2026-09-23). docs/matrix/batch-7-status.md is the authoritative record for the maintenance Part 4 batch (2026-09-23, cluster 8 complete). docs/matrix/batch-8-status.md is the authoritative record for the parts/gear Part 2 batch (2026-09-23, MM-0327–MM-0376). docs/matrix/batch-9-status.md is the authoritative record for the parts/gear Part 3 batch (2026-09-23, MM-0377–MM-0391; cluster 9 complete). docs/matrix/batch-10-status.md is the authoritative record for the cluster-3 scooter Part 1 batch (2026-09-23, MM-0392–MM-0416; 25 of 110 cluster-3 intents published). docs/matrix/batch-11-status.md is the authoritative record for the cluster-3 scooter Part 2 batch (2026-09-23, MM-0417–MM-0441, published in part-commits 57ee6be/f93489c/978d63f/90b2e23; 50 of 110 cluster-3 intents published; 507 articles site-wide; new rows preserved verbatim in docs/matrix/batch-11-rows.csv pending the master-matrix.csv sync merge 482 -> 507). docs/matrix/batch-12-status.md is the authoritative record for the cluster-3 scooter Part 3 batch (2026-09-23, MM-0442-MM-0466: 3 Yamaha model reviews verified from Yamaha VN pages, 12 model comparisons, 6 verified-data choosing guides and 4 spec explainers; 75 of 110 cluster-3 intents published; 532 articles site-wide; new rows preserved verbatim in docs/matrix/batch-12-rows.csv pending the master-matrix.csv sync merge 482 -> 532). Batch 13 followed the same day (MM-0467-MM-0501: 13 model comparisons, 10 verified-data choosing guides and 12 spec explainers, built from the verified Honda/Yamaha MODEL-DATABASE rows only because the Suzuki/SYM/Piaggio manufacturer pages remained blocked; 110 of 110 cluster-3 intents published, cluster 3 COMPLETE; 567 articles site-wide; rows preserved verbatim in docs/matrix/batch-13-rows.csv and merged into master-matrix.csv by the docs-sync workflow 532 -> 567, bot commit 9ac0d0f). Batch 14 opened cluster 4 on the same day (MM-0502-MM-0526: 10 manufacturer-verified motorcycle model reviews, 10 model comparisons, 3 verified-data choosing guides and 2 spec explainers, from official Honda VN and Yamaha VN motorcycle pages recorded in MODEL-DATABASE; Suzuki GD110 returned 403 and SYM Excel blocked automated access again, so no Suzuki/SYM facts were written; 25 of 106 cluster-4 intents published, cluster 4 IN PROGRESS; 592 articles site-wide; rows preserved verbatim in docs/matrix/batch-14-rows.csv; see docs/matrix/batch-14-status.md). Batch 15 continued cluster 4 the same day (MM-0527-MM-0576: 17 model comparisons, 8 verified-data choosing guides and 25 spec explainers, built from the same verified Honda VN/Yamaha VN MODEL-DATABASE rows; pre-batch retries: Suzuki GD110 returned HTTP 403 again, SYM no longer lists the Excel in the current lineup, Yamaha PG-1 page not readable, Honda MSX fetch unavailable - no Suzuki/SYM/PG-1/MSX facts written; 75 of 106 cluster-4 intents published, cluster 4 IN PROGRESS; 642 articles site-wide; rows preserved verbatim in docs/matrix/batch-15-rows.csv and merged into master-matrix.csv by the batch-15 docs-sync run; see docs/matrix/batch-15-status.md). Batch 16 completed cluster 4 on 2026-09-24 (MM-0577-MM-0607: 14 model comparisons, 8 verified-data choosing guides, 9 spec explainers, built from the same verified Honda VN/Yamaha VN MODEL-DATABASE rows; pre-batch retries: Suzuki GD110 still HTTP 403, SYM still blocks automated access and the Excel is no longer in the lineup - no Suzuki/SYM facts written; plus 2 supplementary articles retained from the reconciled concurrent-run overlap - see docs/matrix/batch-16-overlap-reconciliation.md and docs/matrix/batch-16b-rows.csv; 106 of 106 planned cluster-4 intents published, cluster 4 COMPLETE; 675 articles site-wide; rows preserved verbatim in docs/matrix/batch-16-rows.csv and docs/matrix/batch-16b-rows.csv and merged into master-matrix.csv by the batch-16 docs-sync run; see docs/matrix/batch-16-status.md).

Full row-level matrix: docs/matrix/master-matrix.csv. The CSV currently holds 730 committed rows (after the batch-14 merge 567 -> 592, bot commit 93d7d5c, the batch-15 docs-sync merge 592 -> 642, the batch-16 docs-sync merge 642 -> 675, the batch-17 docs-sync merge 675 -> 703 and the batch-18 docs-sync merge 703 -> 730; batch rows preserved verbatim in the docs/matrix/batch-N-rows.csv files; merges run via the repo docs-sync workflow): 81 rental-cluster rows (81 published), 45 monthly & long-term rental rows (45 published), the complete 66-row cluster-11 law/licence slice (66 published; renumbered 2026-09-22 from colliding MM-0082–MM-0147 IDs to the unique LAW-0001–LAW-0066 range — see docs/matrix/batch-4-status.md), the complete 55-row cluster-10 safety slice (55 published), 120 cluster-8 maintenance rows (120 published, cluster 8 complete) and 90 cluster-9
 parts/gear rows (90 published; cluster 9 complete) and 110 cluster-3 scooter rows (110 published; cluster 3 complete) and 108 cluster-4 motorcycle rows (108 published; cluster 4 COMPLETE - 106 planned intents plus 2 supplementary overlap articles) and 55 cluster-5 manual & clutch rows (55 published; cluster 5 COMPLETE - 28 in Batch 17 plus 27 in Batch 18). Rows for the remaining clusters are authored from this planning framework batch by batch, before each batch is written.
Intent store with provenance: docs/data/intents.csv.

## Summary

- STRONG ARTICLES: 988 (reporting the strong count; no filler added to force exactly 1,000)
- Rows dropped by QA: 12 (exact and near-duplicate detection — see QA section)
- Rows requiring fresh research before publication: 715 (legal R1: 222)
- Data foundation: OWNER-FACTS (approved data), owne
r-history intents (54 themes), GSC snapshot (2026-08-18→2026-09-16), research skeleton

## Provisional status

The matrix is provisional: the full 6–12 month GSC CSV was not supplied (limitation recorded in docs/SOURCE-MAP.md and docs/CUSTOMER-INTENTS.md — not fabricated, not a blocker). When a larger export arrives, priorities and angles get refined; cluster architecture stays.

## Row schema (per row in CSV)

ID · primary topic · proposed title · primary query/intention · search intent · cluster · su
bcluster · content type · target audience · source basis · fresh research required · legal/technical sensitivity · closest related article · differentiation reason · internal-link targets · status

Source basis values: owner-history / gsc / owner-history+gsc / skeleton / research / skeleton+research — generated variants are never presented as customer quotes or GSC queries.

## Cluster counts (after QA)

| Cluster | Rows |
|---|---|
| 1 Hanoi motorbike rental | 88 |
| 2 Monthly & long-term rental | 45 |
| 3 Scooter reviews & comparisons | 110 |
| 4 Motorcycle reviews & comparisons | 106 |
| 5 Manual & clutch motorcycles | 55 |
| 6 50cc motorbikes | 40 |
| 7 Electric motorbikes & e-bikes | 89 |
| 8 Maintenance & repair | 120 |
| 9 Parts, accessories & riding gear | 90 |
| 10 Riding skills & safety | 55 |
| 11 Vietnam laws & licences | 68 |
| 12 Hanoi travel (riding-relevant) | 54 |
| 13 Motorbike trips from Hanoi | 38 |
| 14 Vietnam travel by m
otorbike | 30 |
| TOTAL | 988 |

## QA results (automated)

- Exact duplicate titles/queries: dropped (e.g. "Hanoi to Tam Dao" appeared as both a day-out article and a route guide — merged).
- Near-duplicate query token sets: dropped (12 total).
- Doorway-page check: area guides limited to 10 districts × 2 genuine angles (renting context + delivery logistics); no neighbourhood-spin pages.
- Thin-topic check: no single-question rows; every row has a stated distinct intent and subcluster rule.
- Cannibalization controls: canonical 
legal articles live in cluster 11 (50cc/electric/rental articles summarize and link); model review vs comparison vs choosing-guide are separated by intent; route guide vs destination guide separated.
- Known QA limitation: token-based near-dup detection dropped two model reviews whose normalized queries collided (Suzuki VS, Suzuki GN). If these models matter for the catalog, they can be re-added with distinct queries during batch 4 spec population.

## Verification flags carried per row

R1 legal (222 r
ows: government sources, last_reviewed mandatory) · R2 travel/route · R3 manufacturer specs · R4 business facts (OWNER-FACTS only) · R5 technical service data.

## Hard rules carried into production

- Rental pricing published ONLY for: Honda Wave (150k/day), Yamaha Sirius (150k/day), Honda Click (150k/600k–700k/1m–1.2m), Yamaha Mio (150k/600k–700k/1m–1.2m), Honda Vision (200k/800k–1m/1.8m–2m), Honda Air Blade (200k/800k/1.4m), E-Bike (200k/day; no week/month rate published). 50cc: no fixed published price — contact only. Never infer missing week/month rates; OWNER-FACTS pricing is authoritative.
- Deposit 2–5m VND, late return 20k/hour, +full day after 6h, no insurance provided, no refund for early return — exact OWNER-FACTS wording.
- No availability claims beyond "Contact us to confirm current availability."

## Production batches (after approval)

1. Cluster 11 laws (R1, government sources, last_reviewed) — COMPLETE (Batch 1)
2. Clusters
 1–2 rental core (OWNER-FACTS-driven, conversion-relevant) — COMPLETE (Batches 2–3)
3. Cluster 10 + cluster 8 part 1 — COMPLETE (Batch 4)
4. Cluster 10 remainder + cluster 8 part 2 — COMPLETE (Batch 5)
5. Cluster 8 part 3 (25) + cluster 9 part 1 (25) — COMPLETE (Batch 6, 2026-09-23)
6. Cluster 8 part 4 (50 remaining) — COMPLETE (Batch 7, 2026-09-23); cluster 9 part 2 (50 of 65) — COMPLETE (Batch 8, 2026-09-23); cluster 9 part 3 (15 remaining) — COMPLETE (Batch 9, 2026-09-23); cluster 3 scooters — COMPLETE (Batches 10-13, 2026-09-23: 110 of 110 intents published); cluster 4 motorcycle reviews (spec population done for Honda/Yamaha; Batch 14 published 25 of 106, Batch 15 published 50 more on 2026-09-23 and Batch 16 published the final 31 on 2026-09-24 - 106 of 106 planned intents COMPLETE (plus 2 supplementary overlap articles, 108 published), see docs/matrix/batch-14-status.md, docs/matrix/batch-15-status.md and docs/matrix/batch-16-status.md) 
7. Clusters 3–4 (spec population from manufacturer pages into MODEL-DATABASE first)
8. Clusters 5–6 (cluster 5 COMPLETE 2026-09-24: 55 of 55 intents via Batches 17-18, see docs/matrix/batch-17-status.md and docs/matrix/batch-18-status.md; cluster 6 50cc next)
7. Cluster 7 electric (MODEL-DATABASE electric fields)
8. Clusters 12–13 (R2 route verification)
9. Cluster 14 + internal-link audit

Each batch: matrix slice → content → factual QA → duplicate scan → internal-link scan → front-matter validation → single batch commit → Pages build → runtime checks.

