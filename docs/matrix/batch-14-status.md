# Batch 14 status — cluster 4 motorcycle reviews Part 1 (MM-0502–MM-0526)

Authoritative publish/review record for Batch 14. Date: 2026-09-23 (Asia/Ho_Chi_Minh).

## Batch summary

- 25 cluster-4 motorcycle articles published in part-commits (789fe6a: 5 model reviews MM-0502–MM-0506; a36d06d: 5 model reviews MM-0507–MM-0511; a04221b: 5 choosing guides/spec explainers MM-0522–MM-0526; 6b7e8f6: 10 model comparisons MM-0512–MM-0521; b09f75c: closing inbound links from 4 rental guides + comparison cross-links added to the 3 verified-data guides). Cluster 4: 25 of 106 intents published, IN PROGRESS.
- Manufacturer research (MODEL-DATABASE, retrieved 2026-09-23): Honda VN motorcycle pages for Wave Alpha 110, Blade, Wave RSX, Future 125 FI, Super Cub C125, CT125, Winner R and CBR150R; Yamaha VN pages for Sirius RC 110 and Exciter 155 VVA. Full spec tables recorded. Suzuki GD110 returned HTTP 403 again and the SYM Excel page blocked automated access again — no Suzuki/SYM facts were written anywhere in this batch; no field was filled from secondary sources, no spec was estimated. Fields not published by the manufacturer were left empty (notably Sirius and Exciter seat heights, Super Cub/CT125 clutch details, Winner R/CBR150R gearbox ratios).
- Business facts exclusively from docs/OWNER-FACTS.md: Honda Wave and Yamaha Sirius are the price-published rental classes (150,000 VND/day); every other model article says "Contact us to confirm current availability"; no prices, availability, promotions or guarantees were invented.
- 592 articles site-wide after this batch; cluster 4: 25 of 106 intents published.

## Article table (all PUBLISHED 2026-09-23)

| ID | Title | Subcluster |
|---|---|---|
| MM-0502 | Honda Wave Alpha 110 Review: Vietnam's Entry-Level Workhorse | 4.1 model-reviews |
| MM-0503 | Honda Blade 110 Review: The Street-Smart Budget Underbone | 4.1 model-reviews |
| MM-0504 | Honda Wave RSX Review: Fuel Injection for the 110 Class | 4.1 model-reviews |
| MM-0505 | Honda Future 125 FI Review: The Long-Legs Underbone | 4.1 model-reviews |
| MM-0506 | Yamaha Sirius RC 110 Review: Honda's Oldest Rival, Refreshed | 4.1 model-reviews |
| MM-0507 | Honda Super Cub C125 Review: The Icon, Priced Like a Premium Scooter | 4.1 model-reviews |
| MM-0508 | Honda CT125 Review: The Cub That Wants to Go Exploring | 4.1 model-reviews |
| MM-0509 | Honda Winner R Review: The Manual-Clutch Sport Underbone | 4.1 model-reviews |
| MM-0510 | Yamaha Exciter 155 VVA Review: Vietnam's Favourite Clutch Bike | 4.1 model-reviews |
| MM-0511 | Honda CBR150R Review: The Entry to Full-Fairing Sport Riding | 4.1 model-reviews |
| MM-0512 | Honda Wave Alpha vs Honda Blade: Which Budget Underbone? | 4.2 model-comparisons |
| MM-0513 | Honda Wave RSX vs Yamaha Sirius: The 110 Class Benchmark | 4.2 model-comparisons |
| MM-0514 | Honda Blade vs Yamaha Sirius: Budget 110 Head-to-Head | 4.2 model-comparisons |
| MM-0515 | Honda Wave Alpha vs Yamaha Sirius: The Two Rental Classics | 4.2 model-comparisons |
| MM-0516 | Honda Future 125 vs Wave RSX: Step Up or Stay Small? | 4.2 model-comparisons |
| MM-0517 | Honda Future 125 vs Yamaha Sirius: Big Underbone vs Light 110 | 4.2 model-comparisons |
| MM-0518 | Honda Super Cub C125 vs Future 125 FI: Style Icon vs Working Hero | 4.2 model-comparisons |
| MM-0519 | Honda CT125 vs Super Cub C125: Adventure Cub vs Classic Cub | 4.2 model-comparisons |
| MM-0520 | Honda Winner R vs Yamaha Exciter 155: The Clutch Underbone Duel | 4.2 model-comparisons |
| MM-0521 | Honda CBR150R vs Winner R: Fairing Sport or Naked Underbone? | 4.2 model-comparisons |
| MM-0522 | Best 110cc Underbone Motorbikes in Vietnam: The Verified Data Guide | 4.3 choosing-guides |
| MM-0523 | Best 125cc Underbone Motorbikes in Vietnam: Verified Data Guide | 4.3 choosing-guides |
| MM-0524 | Best 150cc Manual-Clutch Motorbikes in Vietnam: Verified Data Guide | 4.3 choosing-guides |
| MM-0525 | Semi-Automatic Gearboxes Explained: How a Vietnamese Underbone Shifts | 4.4 specs-explained |
| MM-0526 | Alloy vs Spoked Wheels on Vietnamese Motorbikes: What to Choose | 4.4 specs-explained |

Subcluster counts: 4.1 model-reviews 10, 4.2 model-comparisons 10, 4.3 choosing-guides 3, 4.4 specs-explained 2.

## Duplicate / cannibalization check (pre-write, against all 567 previously published articles)

- No previously published article reviews or compares any motorcycle (xe số / manual-clutch) model: the existing 110 model reviews/comparisons are all scooters (Vario, Vision, Air Blade, Lead, SH family) — different vehicles with different slugs and intents. Existing general articles (automatic-vs-manual-motorbike-hanoi, scooter-vs-semi-automatic-hanoi, easiest-motorbikes-for-beginners-hanoi) are transmission-choice guides, not model reviews; the new batch cross-links them rather than duplicating them.
- The new spec explainers do not duplicate existing maintenance content: semi-automatic-gearbox-explained is a how-it-works article (centrifugal-clutch-care-semi-automatic and hard-shifting-gearbox-motorbike are maintenance/symptom guides and are cross-linked); alloy-vs-spoked-wheels-motorbikes is a parts-choice article anchored to published version data (no prior wheel-choice article exists for motorcycles; the 16-inch-wheel article is scooter-specific).
- Boundary rule recorded for cluster 5 (manual & clutch motorcycles, 55 planned intents): Batch 14 covers model-level reviews/comparisons/choosing guides/spec explainers; cluster 5 owns learning-to-ride, clutch technique and ownership topics. No cluster-5 intent was consumed.
- Each comparison covers a unique pairing; no pairing existed in the matrix before this batch.

## Quality / front-matter validation

- Every article passes the front-matter contract: title, slug, description, category, tags, content_type, search_intent, topic_cluster, subcluster, date_published, last_reviewed, sources, internal_link_targets; model reviews additionally carry manufacturer and model. Slugs are lowercase-kebab and unique. No doubled /english paths. No review_status claims (non-legal content).
- All 25 articles list every internal link target verbatim; link targets published in an earlier part-commit only (no forward links at any commit): reviews first, then guides, then comparisons, then the closing inbound-link commit.
- Publisher-side QA note: the production run tooling cannot execute node scripts; front-matter, slug, duplicate and internal-link checks were reproduced with equivalent validation in the production sandbox before each push. The repo Quality Gate re-runs the full suite on every push (see DEPLOYMENT STATE).

## Research provenance

- Honda VN model pages (retrieved 2026-09-23): honda.com.vn/xe-may/san-pham/wave-alpha-110, /blade, /wave-rsx, /future-125-fi, /super-cub-c125, /ct125, /winner-r, /cbr150r.
- Yamaha VN model pages (retrieved 2026-09-23): yamaha-motor.com.vn/xe/sirius-rc/ and /xe/exciter-155-vva/.
- Suzuki (GD110) 403 and SYM (Excel) blocked on 2026-09-23 retries — recorded in MODEL-DATABASE; no Suzuki/SYM rows, no Suzuki/SYM article facts.
- List prices are date-stamped manufacturer list prices and marked as changing over time in every article that cites them.

## Verification record

- See README DEPLOYMENT STATE (finalized by the batch-14b docs-sync payload after gate/Pages/live verification).
