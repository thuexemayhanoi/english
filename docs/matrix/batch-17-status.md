# Batch 17 status - cluster 5 manual & clutch motorcycles Part 1 (MM-0610-MM-0637)

Authoritative publish/review record for Batch 17. Date: 2026-09-24 (Asia/Ho_Chi_Minh).

## Batch summary

- 28 cluster-5 articles published 2026-09-24 in part-commits: f91228f (10 manual-clutch learning-technique guides MM-0610-MM-0619), d0e2e40 (10 semi-auto technique and renting guides MM-0620-MM-0629), 2ecad39 (8 model articles MM-0630-MM-0637 incl. the manufacturer-verified Yamaha PG-1 review and three PG-1 comparisons), slug repair 4c61880 (internal_link_targets fix: monthly-motorbike-rental-hanoi in renting-semi-automatic-underbone-hanoi), and 8 closing inbound-link commits (460dfd0, c6b7a79, 6a6f6df, 0fa1ff9, d818c1e, aa0171f, 9e24a66, 98e1571) adding links from existing articles (rotary-gearbox-vs-manual-clutch-explained, semi-automatic-gearbox-explained, best-manual-clutch-motorbikes-beginners-verified, xe-so-vs-xe-con-tay-explained, yamaha-sirius-rc-110-review, honda-blade-110-review, honda-ct125-review, honda-wave-rsx-review) into the batch-17 articles.
- Composition: 10 learning-manual technique guides (5.1), 8 semi-auto technique guides (5.2), 2 renting-owning guides (5.4), 8 manual-model guides (5.3: 1 model review, 3 model comparisons, 3 trim/version guides, 2 sport-class riding guides).
- Pre-batch research (2026-09-24): Yamaha PG-1 2026 standard-version page retrieved and verified from yamaha-motor.com.vn; recorded as a new verified row in docs/MODEL-DATABASE.md (commit a54d256) with the Sirius FI / Sirius line data from the same manufacturer page family. Suzuki and SYM manufacturer pages remain blocked (403 / automated-access block), so no Suzuki/SYM facts were written anywhere in this batch.
- Business facts exclusively from docs/OWNER-FACTS.md: Honda Wave and Yamaha Sirius are the price-published rental classes (150,000 VND/day); every other model article says "Contact us to confirm current availability"; no prices, availability, promotions, guarantees or delivery claims were invented. Technique articles contain no invented torque values, oil capacities, tyre pressures or service intervals.
- 703 articles site-wide after this batch; cluster 5: 28 of 55 intents published, IN PROGRESS (27 remaining for a later batch).

## Distinctness / cannibalization pre-check

- All 28 slugs verified unique against the 675 pre-existing article files (remote listing checked before writing).
- No existing article teaches manual-clutch technique (cluster 4 covered model reviews/comparisons/spec explainers; cluster 8 covered clutch faults; cluster 10 covered general riding safety) - the learning/technique space for manual and semi-automatic bikes was empty.
- The PG-1 was never covered in clusters 3-4 (its manufacturer page was blocked during those batches); its review and comparisons are new model coverage built from the newly verified manufacturer row.
- honda-blade-drum-vs-disc and yamaha-sirius-fi-vs-sirius-rc cover trim/version choice within one model; existing comparisons cross models only.

## Verification record

- Verified 2026-09-24 (Asia/Ho_Chi_Minh): remote MAIN holds 703 article files in _articles/ (675 pre-batch + 28 batch-17 files), counted on the remote listing after the model part-commit; all 28 expected batch-17 slugs verified present on remote.
- Quality Gate and Pages deployment: verified after the closing docs commit; state recorded in README DEPLOYMENT STATE. The gate on the first part-commit f91228f was expected to flag internal_link_targets referencing part-2 slugs (targets published in the immediately following commit d0e2e40); the gate on the final batch state is the pass/fail that counts, consistent with the batch-16 repair precedent.
- Rows preserved verbatim in docs/matrix/batch-17-rows.csv; merged into docs/matrix/master-matrix.csv (675 -> 703) by the docs-sync workflow (scripts/apply-batch-17-docs.js, payload docs/sync/batch-17-docs-sync.json).

## Remaining cluster-5 work (next batch)

27 of 55 intents remain: further manual-clutch technique (slow-speed clutch balance, two-up clutch handling, wet-weather clutch technique), semi-auto ownership deep-dives, manual-model coverage for remaining verified models, and renting-owning guides. Author the remaining rows from the 988-intent framework before writing, per the MASTER-MATRIX rules.
