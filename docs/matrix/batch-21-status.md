# Batch 21 status — cluster 7 electric motorbikes and e-bikes, Part 2 (MM-0755-MM-0793)

Authoritative publish/review record for Batch 21. Date: 2026-09-24 (Asia/Ho_Chi_Minh).

## Batch summary

- 39 cluster-7 articles published 2026-09-24 in part-commits: d328f7b (8 articles MM-0755-MM-0762: 4 legal guides, 4 battery/tech explainers), e08b147 (9 articles MM-0763-MM-0771: 6 riding/charging guides, 2 seasonal battery guides, 1 owning guide), a9c9812 (9 articles MM-0772-MM-0780: 4 battery/maintenance/repair guides, 3 owning guides, 2 model reviews), a05ab86 (9 articles MM-0781-MM-0789: 3 lineup/pricing guides, 4 model comparisons, 2 ecosystem guides), fe9d10a (4 articles MM-0790-MM-0793 closing part: 1 legal guide, 1 delivery use-case guide, 1 beginner briefing, 1 touring guide). Closing inbound-link commit 7b52fe0 added link targets from 14 existing articles to the batch-21 pages.
- Composition: 5 legal guides (7.2, review_status VERIFIED), 8 riding/charging guides (7.3), 6 buying/owning guides (7.4), 10 battery/maintenance/tech guides (7.5), 4 model reviews and lineup guides (7.6), 6 comparison/ecosystem guides (7.7).
- Pre-batch research recorded in docs/MODEL-DATABASE.md (retrieved 2026-09-24): VinFast electric model data (Evo, Evo Lite, Feliz II, Viper, Amio) from the official VinFast corporate news release on vinfastauto.us (the Vietnamese site vinfastauto.com.vn blocked automated access), including V-Green swap-station counts and swap/rental fees; Dat Bike Weaver, Weaver 200 and Weaver++ specifications from the official dat.bike product pages; Yadea VN official listed prices only from yadea.com.vn (technical spec tables not readable from the automated page view, so all Yadea spec fields are EMPTY and no Yadea specs were written). No VinFast/Dat Bike/Yadea technical field was filled from press, retailer or classified pages.
- All legal articles (electric-motorbike-power-kw-licence-vietnam, do-electric-motorbikes-need-insurance-vietnam, registering-electric-motorbike-vietnam, electric-motorbike-fines-vietnam, can-you-ride-electric-motorbike-with-car-licence-vietnam) are review_status VERIFIED citing the class A primary legal sources already verified for the cluster-11 and batch-20 canonicals (Law 36/2024/QH15 and Decree 168/2024 full texts on xaydungchinhsach.chinhphu.vn). No new legal claims beyond the repo's verified facts were introduced.
- Business facts exclusively from docs/OWNER-FACTS.md (E-Bike day rate 200,000 VND; contact-only availability; deposit 2-5m VND; no insurance; no invented promotions, delivery, fleet or availability claims). All VinFast/Dat Bike/Yadea prices cited are manufacturer list prices from official pages, never presented as rental prices.
- 859 articles site-wide after this batch; cluster 7 COMPLETE: 89 of 89 intents published (50 in Batch 20 + 39 in Batch 21).

## Distinctness / cannibalization pre-check

- All 39 slugs verified unique against the 820 pre-existing article files (remote listing checked before writing).
- The electric licence canonicals (electric-bike-licence-vietnam, fast-electric-motorbike-licence-vietnam) keep the canonical licence questions; batch-21 legal articles are electric-specific spin-offs (kW-to-licence mapping, insurance scope, registration, fines, car-licence coverage) that summarize and link, per the batch-20 pattern.
- Model reviews vs comparisons vs lineup guides remain separated by intent per the matrix cannibalization rule (Evo Lite review vs Evo Lite-vs-Amio comparison vs VinFast lineup guide; Weaver review vs Weaver-vs-Weaver-200 comparison vs Dat Bike lineup guide).
- v-green-battery-swap-network-guide covers the station network (verified counts and fees); battery-swap-vs-home-charging-vietnam keeps the method comparison; electric-motorbike-spare-battery-strategy keeps the second-pack strategy.
- Battery/maintenance articles cover traction-pack topics (chemistry, capacity, health check, charger care, seasonal range) distinct from the petrol 12V battery articles (battery-care-motorbike-vietnam, choosing-replacement-battery-motorbike-vietnam) and from electric-motorbike-maintenance-basics (general routine).
- riding-electric-motorbike-flooded-streets covers electric flood practice; flooded-streets-riding-motorbike-vietnam keeps the general petrol-side guide; ip-ratings-electric-motorbikes-explained covers the rating system only.

## Verification record

- Remote MAIN verified to hold 859 article files in _articles/ (820 pre-batch + 39 batch-21 files) after the closing part-commit fe9d10a; all 39 expected batch-21 slugs verified present on remote.
- Quality Gate history for this batch: the gates on part-commits d328f7b, e08b147 and a9c9812 FAILED at the internal-link audit because articles in those commits referenced slugs published in later part-commits (forward references; expected mid-batch state for a multi-part batch). Front-matter and duplicate checks passed on every part-commit. Gate result on the final state: the Quality Gate on a05ab86 (run 35936140161) SUCCEEDED, the Quality Gate on fe9d10a (run 35936174657, gate #187) SUCCEEDED, and the Quality Gate on the closing inbound-link commit 7b52fe0 (run 35936236158, gate #188) SUCCEEDED. Pages build and deployment run 35936235790 (#219) on 7b52fe0 SUCCEEDED.
- Live verification 2026-09-24: /topics/electric/ lists the 89 cluster-7 guides (batch-21 titles present); /articles/ lists 859 guides; spot-checked batch-21 article pages render live on GitHub Pages.
- Rows preserved verbatim in docs/matrix/batch-21-rows.csv; pending the master-matrix.csv docs-sync merge 820 -> 859.

## Cluster 7 progress

Cluster 7 (electric motorbikes and e-bikes) is COMPLETE: 89 of 89 intents published (50 in Batch 20, 39 in Batch 21). The next production candidates per the MASTER-MATRIX production plan are clusters 12-14 (Hanoi travel 54, motorbike trips from Hanoi 38, Vietnam travel 30 intents), which require R2 route/place verification from reliable sources before writing.
