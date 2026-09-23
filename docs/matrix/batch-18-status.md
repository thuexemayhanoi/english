# Batch 18 status - cluster 5 manual & clutch motorcycles Part 2, final (MM-0638-MM-0664)

Authoritative publish/review record for Batch 18. Date: 2026-09-24 (Asia/Ho_Chi_Minh).

## Batch summary

- 27 cluster-5 articles published 2026-09-24 in part-commits: 4eb36eb (9 articles MM-0638-MM-0646: 6 manual-clutch technique guides, 3 semi-auto technique guides), ad3b04b (9 articles MM-0647-MM-0655: 5 semi-auto technique guides, 4 manual-model guides on verified Honda/Yamaha data), slug repairs 3c58a41 (correct smoothing-semi-auto-launch-jerk slug and Super Cub link target) and a3b0b3b (removed the misnamed smoothing-semi-auto-launch-jirk file), 17b372d (9 articles MM-0656-MM-0664: 4 manual-model guides, 5 renting-owning guides), and closing inbound-link commit f03394a (links from 11 existing articles: clutch-control-friction-zone-practice, how-to-ride-manual-clutch-motorbike-vietnam, riding-semi-automatic-first-time, honda-wave-alpha-110-review, honda-winner-r-review, yamaha-exciter-155-vva-review, honda-ct125-review, yamaha-sirius-rc-110-review, manual-motorbike-rental-checklist-hanoi, where-to-practise-riding-hanoi, honda-future-125-vs-honda-wave-rsx; plus a prose typo fix in learning-manual-on-rented-bike-hanoi).
- Composition: 6 learning-manual technique guides (5.1), 8 semi-auto technique guides (5.2), 8 manual-model guides (5.3: Super Cub C125, Future 125 FI, CT125 touring setup, Winner R vs Exciter 155 ownership costs, CBR150R city use, Wave Alpha 110, Wave RSX commuting, Sirius RC 110 for learners), 5 renting-owning guides (5.4).
- All model-specific facts come from verified Honda VN / Yamaha VN rows in docs/MODEL-DATABASE.md (retrieved 2026-09-23); Suzuki and SYM manufacturer pages remain blocked, so no Suzuki/SYM facts were written anywhere in this batch. Technique articles contain no invented torque values, oil capacities, tyre pressures or service intervals.
- Business facts exclusively from docs/OWNER-FACTS.md (Honda Wave and Yamaha Sirius are the price-pub
lished rental classes at 150,000 VND/day; deposit 2-5m VND); every other availability statement says "Contact us to confirm current availability"; no prices, promotions, guarantees or delivery claims were invented.
- 730 articles site-wide after this batch; cluster 5: 55 of 55 intents published, COMPLETE (28 in Batch 17 plus 27 here).

## Distinctness / cannibalization pre-check

- All 27 slugs verified unique against the 703 pre-existing article files (remote listing checked before writing).
- No existing article covers these manual-clutch niches (slow-speed clutch balance, two-up clutch work, wet-weather clutch, neutral-coasting dangers, tight U-turns, week-one practice plan) or these semi-auto deep-dives (two-up, cargo, gravel, descents, long-distance touring, fuel habits, launch jerk, kick-starting).
- Model guides are riding/ownership-focused on verified manufacturer data; cluster-4 articles already cover model reviews and comparisons, so the new guides cover living with the bikes rather than re-reviewing specs.
- Renting-owning guides are distinct from the batch-17 rental checklist and expectations articles: learner etiquette on a rental, monthly manual-class rental, used sport-underbone buying, manual-underbone ownership costs, and the new-underbone dealer purchase flow.

## Verification record

- Verified 2026-09-24 (Asia/Ho_Chi_Minh): remote MAIN holds 730 article files in _articles/ (703 pre-batch + 27 batch-18 files), counted on the remote listing after the closing inbound-link commit; all 27 expected batch-18 slugs verified present on remote, including the repaired smoothing-semi-auto-launch-jerk slug (misnamed -jirk file removed).
- Quality Gate history for this batch: the intermediate part-commit gates failed (front-matter check) after the closing commit f03394a accidentally corrupted two pre-existing review files (_articles/honda-wave-alpha-110-review.md and _articles/yamaha-sirius-rc-110-review.md were truncated to broken front matter). Repair commit dc89b16 restored both files from their pre-corruption versions (769a218 / d818c1e) and re-applied the intended batch-18 inbound link targets; repair commit 1449804 fixed an invalid internal_link_targets slug (riding-honda-wave-rsx-commuting-guide -> honda-wave-rsx-commuting-guide) in two batch-18 articles.
- Quality Gate: run 35920675688 on the final state commit 1449804 completed with SUCCESS (verified via the GitHub Actions API on 2026-09-24, Asia/Ho_Chi_Minh): front-matter, duplicate, internal-link, SEO, sitemap, schema, Jekyll build, rendered-site audit and assistant-index checks all passed. This gate covers all 730 article files including both repairs.
- Docs Sync workflow: run 35917378306 on commit 43afc05 SUCCESS; bot commit cd34cd6 merged the 27 rows into docs/matrix/master-matrix.csv (703 -> 730, +27 row lines verified in the commit stats) and applied the README/MASTER-MATRIX state patches; every anchor validated.
- Pages deployment: run 35920674043 on commit 1449804 completed with SUCCESS; the live site serves the final batch state.
- Pages deployment / live runtime checks (2026-09-24, verified against the deployed site): /articles/ renders the 730-guide total; /topics/manual-clutch/ renders the 55-guide count; batch-18 pages verified live (e.g. /articles/yamaha-sirius-rc-110-learner-guide/ and /articles/smoothing-semi-auto-launch-jerk/); the restored /articles/honda-wave-alpha-110-review/ renders its full review body with the verified Honda figures and the new link target; /articles/honda-future-125-riding-guide/ and /articles/riding-honda-wave-alpha-110-guide/ carry the corrected honda-wave-rsx-commuting-guide target.
- Rows preserved verbatim in docs/matrix/batch-18-rows.csv; merged into docs/matrix/master-matrix
.csv (703 -> 730) by the docs-sync workflow (scripts/apply-batch-18-docs.js, payload docs/sync/batch-18-docs-sync.json).

## Cluster 5 closeout

Cluster 5 (manual & clutch motorcycles) is COMPLETE: 55 of 55 intents published via Batches 17-18. Next per the MASTER-MATRIX production plan: cluster 6 (50cc, 40 intents — verify 50cc manufacturer facts in MODEL-DATABASE before writing), then cluster 7 (electric, requires MODEL-DATABASE electric fields first).
