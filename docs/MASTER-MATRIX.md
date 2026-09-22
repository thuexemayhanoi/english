# MASTER CONTENT MATRIX — v3 (populated)

Status: ACTIVE CONTENT MATRIX

- 988 strong planned intents remain the planning framework for future articles.
- 50 law/licence articles are already published and VERIFIED (Slice 1: 2026-09-21; Slices 2-3: 2026-09-22 — see docs/matrix/batch-1-status.md).
- The remaining rows are production candidates according to batch order. They are NOT approved for immediate wholesale publication: each batch is written, QA'd and committed through the publishing workflow (README → PUBLISHING WORKFLOW).
- docs/matrix/batch-1-status.md is the authoritative record for legal Batch 1 progress.

Full row-level matrix: docs/matrix/master-matrix.csv. The CSV currently holds 147 committed rows: 81 rental-cluster rows plus the complete 66-row cluster-11 law/licence slice (authored 2026-09-22, 50 published / 16 proposed). Rows for the remaining clusters are authored from this planning framework batch by batch, before each batch is written.
Intent store with provenance: docs/data/intents.csv.

## Summary

- STRONG ARTICLES: 988 (reporting the strong count; no filler added to force exactly 1,000)
- Rows dropped by QA: 12 (exact and near-duplicate detection — see QA section)
- Rows requiring fresh research before publication: 715 (legal R1: 222)
- Data foundation: OWNER-FACTS (approved data), owner-history intents (54 themes), GSC snapshot (2026-08-18→2026-09-16), research skeleton

## Provisional status

The matrix is provisional: the full 6–12 month GSC CSV was not supplied (limitation recorded in docs/SOURCE-MAP.md and docs/CUSTOMER-INTENTS.md — not fabricated, not a blocker). When a larger export arrives, priorities and angles get refined; cluster architecture stays.

## Row schema (per row in CSV)

ID · primary topic · proposed title · primary query/intention · search intent · cluster · subcluster · content type · target audience · source basis · fresh research required · legal/technical sensitivity · closest related article · differentiation reason · internal-link targets · status

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
| 14 Vietnam travel by motorbike | 30 |
| TOTAL | 988 |

## QA results (automated)

- Exact duplicate titles/queries: dropped (e.g. "Hanoi to Tam Dao" appeared as both a day-out article and a route guide — merged).
- Near-duplicate query token sets: dropped (12 total).
- Doorway-page check: area guides limited to 10 districts × 2 genuine angles (renting context + delivery logistics); no neighbourhood-spin pages.
- Thin-topic check: no single-question rows; every row has a stated distinct intent and subcluster rule.
- Cannibalization controls: canonical legal articles live in cluster 11 (50cc/electric/rental articles summarize and link); model review vs comparison vs choosing-guide are separated by intent; route guide vs destination guide separated.
- Known QA limitation: token-based near-dup detection dropped two model reviews whose normalized queries collided (Suzuki VS, Suzuki GN). If these models matter for the catalog, they can be re-added with distinct queries during batch 4 spec population.

## Verification flags carried per row

R1 legal (222 rows: government sources, last_reviewed mandatory) · R2 travel/route · R3 manufacturer specs · R4 business facts (OWNER-FACTS only) · R5 technical service data.

## Hard rules carried into production

- Rental pricing published ONLY for: Honda Wave (150k/day), Yamaha Sirius (150k/day), Honda Click (150k/600k–700k/1m–1.2m), Yamaha Mio (150k/600k–700k/1m–1.2m), Honda Vision (200k/800k–1m/1.8m–2m), Honda Air Blade (200k/800k/1.4m), E-Bike (200k/day; no week/month rate published). 50cc: no fixed published price — contact only. Never infer missing week/month rates; OWNER-FACTS pricing is authoritative.
- Deposit 2–5m VND, late return 20k/hour, +full day after 6h, no insurance provided, no refund for early return — exact OWNER-FACTS wording.
- No availability claims beyond "Contact us to confirm current availability."

## Production batches (after approval)

1. Cluster 11 laws (R1, government sources, last_reviewed)
2. Clusters 1–2 rental core (OWNER-FACTS-driven, conversion-relevant)
3. Cluster 10 + cluster 8 part 1
4. Cluster 8 part 2 + cluster 9
5. Clusters 3–4 (spec population from manufacturer pages into MODEL-DATABASE first)
6. Clusters 5–6
7. Cluster 7 electric (MODEL-DATABASE electric fields)
8. Clusters 12–13 (R2 route verification)
9. Cluster 14 + internal-link audit

Each batch: matrix slice → content → factual QA → duplicate scan → internal-link scan → front-matter validation → single batch commit → Pages build → runtime checks.
