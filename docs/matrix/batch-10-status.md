# Batch 10 Status — Cluster 3 Scooter Reviews Part 1 (25 of 110 cluster-3 intents)

Authoritative record for the 25-article Batch 10 production run (MM-0392–MM-0416). Batches 1–9 are COMPLETE — see docs/matrix/batch-1-status.md through docs/matrix/batch-9-status.md.

## Batch 10 (2026-09-23): 25 scooter review & comparison articles

Published 2026-09-23 in three part-commits (1ac0c1a: 7 model reviews, b63f2b1: 6 comparisons, 0c0004d: 12 choosing/spec guides) plus one repair commit (821eeb9).

All technical facts (engine displacement, power, torque, fuel consumption, tank size, seat height, kerb weight, dimensions, tyre sizes, storage, retail list prices, warranty) come exclusively from official manufacturer pages — honda.com.vn and yamaha-motor.com.vn model pages, retrieved 2026-09-23 and recorded in docs/MODEL-DATABASE.md. Fields a manufacturer does not publish are left out of the articles rather than estimated (notably: Yamaha Grande engine output; Honda Air Blade 125 power/torque/economy). No torque values, oil capacities, tyre pressures, electrical specs or service intervals were invented. All business facts (rental rates, deposit, policy) come exclusively from docs/OWNER-FACTS.md. Rental prices are published only for the OWNER-FACTS models (Honda Vision 200k/day; Air Blade category 200k/800k/1.4m); every other model directs readers to contact for current availability. No availability claims, promotions or fleet claims were made.

## Published articles

| Matrix row | Article title | Subcluster | Status |
|---|---|---|---|
| MM-0392 | Honda Vision 110 Review: Vietnam's Default City Scooter | 3.1 model-reviews | PUBLISHED 2026-09-23 |
| MM-0393 | Honda Air Blade 160 Review: The Sporty Commuter Scooter | 3.1 model-reviews | PUBLISHED 2026-09-23 |
| MM-0394 | Honda Air Blade 125 Review: The Balanced Middle Ground | 3.1 model-reviews | PUBLISHED 2026-09-23 |
| MM-0395 | Honda Lead 125 Review: The Storage Champion | 3.1 model-reviews | PUBLISHED 2026-09-23 |
| MM-0396 | Yamaha Janus 125 Review: The Value Challenger | 3.1 model-reviews | PUBLISHED 2026-09-23 |
| MM-0397 | Yamaha FreeGo 125 Review: The Practical Sporty Scooter | 3.1 model-reviews | PUBLISHED 2026-09-23 |
| MM-0398 | Yamaha Grande Review: The Style-First City Scooter | 3.1 model-reviews | PUBLISHED 2026-09-23 |
| MM-0399 | Honda Vision vs Yamaha Janus: The Entry Scooter Duel | 3.2 model-comparisons | PUBLISHED 2026-09-23 |
| MM-0400 | Honda Air Blade 160 vs Honda Lead 125: Pace or Space? | 3.2 model-comparisons | PUBLISHED 2026-09-23 |
| MM-0401 | Yamaha Janus 125 vs FreeGo 125: Same Engine, Different Missions | 3.2 model-comparisons | PUBLISHED 2026-09-23 |
| MM-0402 | Honda Vision vs Honda Air Blade: Entry Level or Step Up? | 3.2 model-comparisons | PUBLISHED 2026-09-23 |
| MM-0403 | Honda Lead vs Yamaha Grande: Two Storage Champions Compared | 3.2 model-comparisons | PUBLISHED 2026-09-23 |
| MM-0404 | Honda vs Yamaha Scooters in Vietnam: Which Brand Suits You? | 3.2 model-comparisons | PUBLISHED 2026-09-23 |
| MM-0405 | 110cc vs 125cc Scooters: Does the Extra 15cc Matter? | 3.3 choosing-guides | PUBLISHED 2026-09-23 |
| MM-0406 | Scooter Seat Heights in Vietnam: Verified Figures and Why They Matter | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0407 | Scooter Underseat Storage Compared: What Fits Where | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0408 | Scooter Fuel Economy Compared: Verified Manufacturer Figures | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0409 | 16-Inch Wheel Scooters: Why Honda Fits Big Fronts in Vietnam | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0410 | Smart Key Scooters: How Keyless Systems Work in Vietnam | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0411 | Which Scooters Have ABS in Vietnam? | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0412 | Scooter Tyre Sizes Explained: Reading 80/90-16, 110/70-12 and Friends | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0413 | Scooter Power and Torque Explained: kW and Nm for Real Riders | 3.4 specs-explained | PUBLISHED 2026-09-23 |
| MM-0414 | Premium Scooters in Vietnam: SH, Vario, NMAX, XMAX and What You Pay For | 3.3 choosing-guides | PUBLISHED 2026-09-23 |
| MM-0415 | Buying Your First Scooter in Vietnam: A Practical Guide | 3.3 choosing-guides | PUBLISHED 2026-09-23 |
| MM-0416 | How to Read a Scooter Spec Sheet Before Renting or Buying | 3.4 specs-explained | PUBLISHED 2026-09-23 |

Subcluster counts: 3.1 model-reviews 7, 3.2 model-comparisons 6, 3.3 choosing-guides 4, 3.4 specs-explained 8.

## Duplicate / cannibalization check (pre-write, against all 457 previously published articles)

- No model review, model comparison, engine-class explainer, seat-height table, storage-capacity table, published-economy table, wheel-size, smart-key, ABS-availability, tyre-size-decoding, power/torque-explainer, premium-tier, first-purchase or spec-reading article existed.
- Closest existing articles are cross-linked, not duplicated: best-scooters-to-rent-hanoi (rental rates, not specs), scooter-under-seat-storage-guide (organising, not capacity data), improving-fuel-economy-motorbike (habits, not model figures), air-cooled-vs-liquid-cooled-motorbike (engine types, not models), disc-vs-drum-brakes-motorbike (brake types, not ABS availability), lightest-motorbikes-for-new-riders and best-motorbikes-for-tall-riders-vietnam (audience guides, not data tables), choosing-replacement-tyres-motorbike-vietnam (buying tyres, not decoding sizes).
- Model review vs comparison vs choosing-guide separated by intent per the MASTER-MATRIX cannibalization rule.

## QA (2026-09-23)

- Front-matter validation: all 25 articles carry the required fields; slugs are lowercase-kebab and unique against the 457 existing articles; no internal double quotes in descriptions; model reviews carry manufacturer and model metadata.
- Internal-link validation: all internal_link_targets were validated against the remote slug set. One defect found by the Quality Gate internal-link audit: 2 articles referenced a non-existent slug (choosing-replacement-tyres-vietnam); repaired in commit 821eeb9 to the correct slug (choosing-replacement-tyres-motorbike-vietnam). After the repair the internal-link audit passes with 0 broken references.
- Honest process note: the Quality Gate runs on parts 1 (1ac0c1a) and 2 (b63f2b1) failed transiently because those part-commits contained forward internal-link references to articles published in later part-commits of the same batch; the gate on the final batch state, commit 821eeb9, is the authoritative result: PASS — all steps succeeded (front-matter check, duplicate check, internal link audit, SEO audit, sitemap check, schema check, Jekyll build, rendered-site audit, Guide Assistant test, build report).
- GitHub Pages: deployment of the batch verified live — the /topics/scooters/ hub renders the 25-guide count and the new article pages resolve (spot-checked honda-vision-110-review).
- Remote verification: 482 article files on remote MAIN after the batch; all 25 expected new slugs present; no duplicate filenames.

## State-docs notes

- New matrix rows are preserved verbatim in docs/matrix/batch-10-rows.csv and merged into docs/matrix/master-matrix.csv (457 -> 482 rows) and README.md by the repo's apply-batch-10-docs sync step (same pattern as Batches 7-9), because those two files exceed the fetch window of the current run's GitHub read tooling and cannot be safely rewritten client-side.
- docs/MODEL-DATABASE.md and docs/MASTER-MATRIX.md updated in this commit with full verified specification rows and batch-10 state.
- Cluster 3 after this batch: 25 of 110 intents published; 85 remain. Next production target per docs/MASTER-MATRIX.md: cluster 3 Part 2 (further model reviews/comparisons — SH Mode, Vario, NVX, Latte and remaining subclusters — with continued manufacturer-page spec research into docs/MODEL-DATABASE.md first), then cluster 4 motorcycle reviews.
