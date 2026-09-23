# Batch 12 status — cluster 3 scooter reviews Part 3 (MM-0442–MM-0466)

Authoritative publish/review record for Batch 12. Date: 2026-09-23 (Asia/Ho_Chi_Minh).

## Batch summary

- 25 cluster-3 scooter articles published in four part-commits (d80b634: 3 Yamaha model reviews; 8db94c4 + later part: 12 model comparisons; f81cf7c: choosing guides and spec explainers; d06dae8: inbound internal links from 6 published scooter guides).
- Manufacturer research: Yamaha VN model pages (NMAX 155, Gear 125 Hybrid, Lexi 155) retrieved 2026-09-23; three verified rows added to docs/MODEL-DATABASE.md. All technical facts in the articles come from those pages; no field was filled from secondary sources. Business facts exclusively from docs/OWNER-FACTS.md.
- 532 articles site-wide after this batch; cluster 3: 75 of 110 intents published (35 remain).

## Article table (all PUBLISHED 2026-09-23)

| ID | Title | Subcluster |
|---|---|---|
| MM-0442 | Yamaha NMAX 155 Review: Premium Hardware at Vietnam's Top End | 3.1 model-reviews |
| MM-0443 | Yamaha Gear 125 Hybrid Review: The Budget Scooter with Electric Assist | 3.1 model-reviews |
| MM-0444 | Yamaha Lexi 155 Review: The Big-Wheel Comfort Commuter | 3.1 model-reviews |
| MM-0445 | Yamaha NMAX 155 vs NVX 155: Two Personalities, One Engine | 3.2 model-comparisons |
| MM-0446 | Yamaha NMAX 155 vs Honda SH160i: Premium Scooter Icons Compared | 3.2 model-comparisons |
| MM-0447 | Yamaha Lexi 155 vs NMAX 155: Comfort or Sport? | 3.2 model-comparisons |
| MM-0448 | Yamaha Lexi 155 vs Honda SH Mode 125: The Value Premium Trade | 3.2 model-comparisons |
| MM-0449 | Honda Air Blade 125 vs Vario 125: Honda's 125cc Pair Compared | 3.2 model-comparisons |
| MM-0450 | Honda Vario 160 vs Air Blade 160: Two Sporty Hondas, One Garage | 3.2 model-comparisons |
| MM-0451 | Honda Vision vs Honda Lead 125: Simplicity or Storage? | 3.2 model-comparisons |
| MM-0452 | Honda Vision vs Yamaha FreeGo 125: The Commuter Duel | 3.2 model-comparisons |
| MM-0453 | Yamaha Gear 125 vs Honda Vision: Entry Scooters Compared | 3.2 model-comparisons |
| MM-0454 | Yamaha Gear 125 vs FreeGo 125: Which Budget Yamaha? | 3.2 model-comparisons |
| MM-0455 | Yamaha Gear 125 vs Janus 125: Yamaha's Budget Pair Compared | 3.2 model-comparisons |
| MM-0456 | Yamaha Latte 125 vs Honda Lead 125: The Storage Champions | 3.2 model-comparisons |
| MM-0457 | Best Scooters for Short Riders in Vietnam: Verified Seat Heights | 3.3 choosing-guides |
| MM-0458 | The Most Fuel-Efficient Scooters in Vietnam: Verified Figures Ranked | 3.3 choosing-guides |
| MM-0459 | New Scooters Under 40 Million VND: Verified List Prices | 3.3 choosing-guides |
| MM-0460 | The Lightest Scooters in Vietnam: Verified Weights for New Riders | 3.3 choosing-guides |
| MM-0461 | Best Scooters for Storage in Vietnam: Verified Capacities Ranked | 3.3 choosing-guides |
| MM-0462 | Best Scooters for Hanoi Commuting: A Verified-Data Guide | 3.3 choosing-guides |
| MM-0463 | Stop and Start Systems on Scooters: How Idling Stop Works in Vietnam | 3.4 specs-explained |
| MM-0464 | Hybrid Scooter Systems Explained: Yamaha's Blue Core Electric Assist | 3.4 specs-explained |
| MM-0465 | Scooter Payload Limits Explained: What Those Kilogram Figures Mean | 3.4 specs-explained |
| MM-0466 | Traction Control vs ABS on Scooters: Verified Models in Vietnam | 3.4 specs-explained |

Subcluster counts: 3.1 model-reviews 3, 3.2 model-comparisons 12, 3.3 choosing-guides 6, 3.4 specs-explained 4.

## Duplicate / cannibalization check (pre-write, against all 507 previously published articles)

- No existing article reviewed the NMAX 155, Gear 125 Hybrid or Lexi 155 (Batches 10–11 covered Vision, Air Blade 125/160, Lead, Janus, FreeGo, Grande, SH Mode, SH160i, Vario 125/160, NVX, Latte).
- No existing comparison covered any of the 12 new pairings; each model-review article covers one model only, per the MASTER-MATRIX cannibalization rule.
- New choosing guides do not cannibalize existing data articles: short-riders (seat-height ranking) vs scooter-seat-heights-comparison-vietnam (data table), fuel-economy ranking vs scooter-fuel-economy-comparison-vietnam (mixed fleet + tips), under-40m price bracket vs new-scooter-prices-vietnam-verified (all brackets), lightest scooters vs lightest-motorbikes-for-new-riders (all bike types), storage ranking vs scooter-underseat-storage-comparison (helmet fit), Hanoi commuting vs best-motorbike-for-hanoi-traffic (all bike types). Closest articles are cross-linked, not duplicated.
- New spec explainers do not duplicate existing explainers: idling-stop (no prior article), hybrid systems (no prior article; Gear review covers one model), payload limits (new data angle; two-up guide covers riding practice), TCS vs ABS (HSTC article covers one Honda system; ABS guide covers braking only).

## QA (2026-09-23)

- Front-matter validation: all 25 articles carry the required fields; slugs are lowercase-kebab and unique against the 507 existing articles; no internal double quotes in descriptions; model reviews and comparisons carry manufacturer sources.
- Internal-link validation: all internal_link_targets validated against the remote slug set; inbound links added from 6 published scooter guides (yamaha-nvx-155-review, honda-sh-160-review, yamaha-janus-125-review, yamaha-freego-125-review, honda-lead-125-review, best-scooters-two-up-riding-vietnam) in part-commit d06dae8.
- Honest process note: the Quality Gate on part-commits d80b634 (run 35863603551) and 8db94c4 (run 35863804421) failed transiently because those part-commits contained forward internal-link references to articles published in later part-commits of the same batch (same known pattern as Batches 10 and 11). The gate on the later part-commit f81cf7c passed (run 35863940794) and the gate on the final batch state, commit d06dae8, is the authoritative result: PASS — Quality Gate run 35863983644, no blocking findings.
- GitHub Pages: deployment of commit d06dae8 verified — Pages run 35863983933, all jobs (build, report-build-status, deploy) completed with success on 2026-09-23.
- Runtime verification (2026-09-23): the live /articles/ index renders the 532-guide total; the /topics/scooters/ hub renders the 75-guide count; 10 of the 25 new article pages spot-checked live and resolve with correct content (yamaha-nmax-155-review, yamaha-gear-125-hybrid-review, yamaha-lexi-155-review, honda-vario-160-vs-honda-air-blade-160, yamaha-lexi-155-vs-honda-sh-mode-125, scooters-under-40-million-vietnam, tcs-vs-abs-scooters-vietnam, scooter-payload-load-limits-vietnam, best-scooters-short-riders-vietnam, scooter-hybrid-systems-explained).
- Remote verification: all 25 expected new slugs confirmed present on remote MAIN; no duplicate filenames.

## State-docs notes

- New matrix rows are preserved verbatim in docs/matrix/batch-12-rows.csv for merging into docs/matrix/master-matrix.csv (482 -> 532 rows together with the pending batch-11 rows) and README.md. Because README.md and master-matrix.csv exceed the 32,793-character fetch window of this run's GitHub read tooling, the merge is performed server-side by the repo docs-sync workflow (scripts/apply-batch-docs.js + .github/workflows/docs-sync.yml) from the payload docs/sync/batch-12-readme-sync.json, triggered by pushes changing docs/sync/**. The script validates every replacement strictly and exits non-zero without writing on any mismatch.
- docs/MODEL-DATABASE.md updated with the three new verified Yamaha rows and retrieval notes (commit in this state-docs set).
- Cluster 3 after this batch: 75 of 110 intents published; 35 remain. Remaining intents mostly require Suzuki / Piaggio / SYM manufacturer pages, which returned HTTP 403 to automated retrieval in Batches 10–12 — retry in the next batch, or design non-model-specific intents from the verified Honda/Yamaha data. Next production target per docs/MASTER-MATRIX.md: cluster 3 Part 4, then cluster 4 motorcycle reviews with continued manufacturer-page spec research into docs/MODEL-DATABASE.md first.
