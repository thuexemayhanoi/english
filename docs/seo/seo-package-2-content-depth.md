# SEO PACKAGE 2 — CONTENT DEPTH 1600+

Owner-approved scope extension (2026-10-25). Existing English articles whose Markdown body had **300-500 words** (inclusive) when the package started are raised to **at least 1600 words** of real content, in small verified batches. The 1600-word figure is an editorial requirement of the site owner, not a ranking threshold published by Google. No new articles, no URL, slug, permalink or canonical change, no content deleted, no redirects.

## Status

| Metric | Value |
|---|---|
| Articles in the site | 981 |
| Eligible at baseline (300-500 words) | 693 |
| Completed (>= 1600 words, batch QA passed) | 15 |
| REVIEW_REQUIRED | 0 |
| Pending | 678 |
| Batches published | 2 |
| Words added by completed articles | 26975 |
| Slug / URL / canonical changes | 0 (gate: scripts/seo-package2.js) |

| Group | Eligible | Done | REVIEW_REQUIRED | Pending |
|---|---|---|---|---|
| A — Commercial SEO | 92 | 15 | 0 | 77 |
| B — Informational SEO | 337 | 0 | 0 | 337 |
| C — Supporting content | 264 | 0 | 0 | 264 |

Baseline frozen 2026-10-25 on main 7fcfc73: 981 articles measured; 172 were below 300 words and 116 above 500 (out of scope, kept as they were).

## How words are counted

lib.contentWords: Markdown body only; excludes front matter, fenced/inline code, HTML tags and comments, Liquid, link URLs, images, bare URLs and the layout-generated components (related cards, sources, Common questions rendered from faq: front matter, navigation, footer); a word is a whitespace/dash-separated token with a letter or digit. Implemented once in `scripts/lib.js` (`contentWords`) and used by `scripts/seo-package2.js` and the SEO Master Matrix. The older matrix `words` metric (whitespace tokens including Markdown markers) is kept only for the legacy content-quality score and is not used for Package 2.

## Scope rules

- Only articles in `docs/seo/package2-baseline.json` (frozen) are processed; articles outside 300-500 words are untouched unless a shared component needs a fix.
- Every expansion adds new, verifiable information (process, examples, comparison tables, scenarios, FAQ from verified facts, internal links in the Pillar-Hub-Silo structure); repetition to reach the count is not accepted.
- Business facts only from `docs/OWNER-FACTS.md`; technical figures only from the verified model database or official sources; legal statements only from primary sources. A fact that cannot be verified is not written; the URL is recorded as REVIEW_REQUIRED with the reason and the package moves on.
- Title, meta description, H1 and keyword ownership change only with a recorded reason. `last_reviewed` changes only when a real review of the expanded page took place.
- A batch is merged only after the full QA suite passes on the exact tree; thresholds are never lowered.

## Grouping and queue

Group A (commercial): rental and monthly-rental guides, prices, districts (Old Quarter, Long Bien, Hoan Kiem, Tay Ho and others), Honda Vision / scooter / 50cc rental, expat, tourist, teacher and student rentals. Group B (informational): rental requirements, deposits, insurance and licences; law and licence guides; safety; scooter comparisons; maintenance; electric and battery; 50cc licence and law. Group C: Hanoi travel and attractions, routes, Vietnam travel, motorcycles, manual and clutch, parts and gear, the remaining 50cc topics. Inside a group the queue follows the matrix priority, then keyword ownership (`docs/seo/keyword-targets.json`), then the cluster order. The full list with original and current word counts, search intent, primary keyword, topic cluster, matrix priority and SEO status is `docs/seo/package2-eligible.csv`.

## Batches

| Batch | Date | Articles | Commit | QA | Notes |
|---|---|---|---|---|---|
| p2-01 | 2026-10-25 | 5 | c952758824a4c52211f160452549b08af0bf3efd | lint 0 errors; independent verification (writer + verifier, 1-3 rounds); build-report P0 0 P1 0; engine tests 82/82; Jekyll build and rendered audit P0/P1 0; assistant 31/31; duplicate check P2 0 | Group A, queue 2/10/17/88/91. Tay Ho, Long Bien, 50cc and Vision-vs-Janus passed independent verification (Vision first time, the others after one fix round); Old Quarter needed three rounds and its last fixes were applied from the third verifier's findings and checked by lint and QA (no fourth independent pass). Removed or reworded original passages: Old Quarter ranked order and the unsourced half-the-residents, lightest-steering, 15 km/h and peak-season availability claims; Long Bien invented deposit, after-hours-return and minutes-away claims; 50cc compulsory-insurance-carried-by-the-fleet sentence (conflicts with OWNER-FACTS) and the unsourced no-official-new-50s claim; Tay Ho common-delivery-destination sentence softened (owner to confirm); Vision-vs-Janus bullet that contradicted the engine section. No weekly, monthly, 50cc or E-Bike price added (docs/seo/price-reconciliation.md). Findings for the owner: do-electric-motorbikes-need-insurance-vietnam (Package 2 queue 387) and do-you-need-insurance-for-50cc-vietnam (out of scope, unchanged) state fleet insurance cover, which conflicts with OWNER-FACTS; hoan-kiem-walking-street-motorbike-visitors does not mention the 1 July 2026 Zone 1 evening restriction. |
| p2-02 | 2026-10-25 | 10 |  | lint 0 errors; independent verification of every article (verifier, fix round and delta verifier where findings were MAJOR); build-report P0 0 P1 0; engine tests; Jekyll build and rendered audit P0/P1 0; assistant tests; duplicate check P2 0 | Group A, queue order of the second batch. Every article passed an independent verifier; pickup-or-delivery, Noi Bai arrival, first-time renting, best scooters and can-foreigners needed a fix round and passed a delta verification; automatic-vs-manual (one MAJOR, replaced with the verifier's wording) and the MINOR findings elsewhere were applied by the lead and checked by lint and QA. Recorded front matter changes: how-to-book title now carries its primary keyword ("Motorbike rental app Hanoi") and says there is no app; pickup-or-delivery description drops "and test-ride" (no test-ride policy in OWNER-FACTS); best-scooters description named three models, claimed what foreigners actually rent and lacked "Hanoi scooter rental"; can-foreigners description says deposit instead of cash deposit. Delivery-old-quarter title deliberately unchanged: a title with motorbike rental plus Hanoi Old Quarter would compete with the ranking /articles/renting-motorbike-old-quarter/. Removed or reworded original passages: how-to-book "both work for foreign numbers", "in Vietnamese or simple English" and three implied shop policies (photos on the spot, test ride and swap, booking secures the bike); how-to-rent "Shops will hand you a bike without asking" and the deposit-comes-back sentence; pickup-or-delivery test-riding lead clause, test-ride/swap, first ten minutes, deliverer present, deposit and contract travel, quickest deposit settlement, inside a few kilometres; Hoan Kiem one-way loop, actively enforced, roughly fifteen minutes and case-by-case delivery; Noi Bai 25-30 km (now 27 km from the Vietnam Airlines guide), the shop-cannot-hand-you-a-bike-at-the-terminal sentence and two unsourced airport-road claims; automatic-vs-manual The Vietnamese default, Learning time: minutes, less ground clearance, narrower/lighter/every roadside shop, cheapest and simplest (the day rates are equal); best-scooters three models dominate, most popular scooter in Vietnam, the unverified Click bodywork/running-gear sentence, suits most riders, the regular-unleaded/serviced-by-the-shop bullet; first-time automatics creep from idle (a centrifugal clutch is disengaged at idle), most visitors use, nerves wear off within a day; delivery-old-quarter ten minutes, about fifteen minutes' ride, identical to the shop version; can-foreigners the lead claim that foreigners rent every day with no residence status or bank account needed, stock changes week to week, return deposits, process takes minutes, foreigners rent here every day, the phone-number and residence-card lines, old A1 up to 175 cc, Under 50 cc, every fine amount (Decree 238/2026/ND-CP amends Decree 168/2024 from 15 August 2026 and its amended Article 18 could not be read). No weekly, monthly, 50cc or E-Bike price added (docs/seo/price-reconciliation.md). Legal correction outside the batch: motorbike-passenger-rules-vietnam and child-passengers-motorbike-vietnam said a child under 14 with an adult may be a second passenger; Law 36/2024/QH15 Article 33(1)(c), as quoted by the Government page both articles cite, says a child under 12 with no adult condition (re-read 2026-10-25). Findings for the owner: exploring-hoan-kiem-by-motorbike and hoan-kiem-walking-street-motorbike-visitors describe one continuous Friday-to-Sunday closure (the 2026 reports give 19:00-24:00 on each day) and omit Zone 1; renting-motorbike-old-quarter omits the Zone 1 evening restriction and keeps an unsourced fifteen-minute ride; do-hanoi-rentals-include-helmets, helmet-law-vietnam and renting-motorbike-hanoi-one-day state helmet policies not in OWNER-FACTS; motorbike-rental-requirements-hanoi and compulsory-motorbike-insurance-vietnam state insurance carried by the shop, against OWNER-FACTS; motorbike-rental-deposit-hanoi and returning-a-rental-motorbike-hanoi promise deposit return on the spot in cash; which-countries-idp-valid-vietnam and idp-validity-period-vietnam call an IDP without the national licence a document-carriage fine; the Decree 238/2026 amendment may affect fine amounts quoted across the legal guides; docs/MODEL-DATABASE.md gives the Vision as 110 cc where Honda publishes 109.5 cc and its Yamaha Sirius RC URL now returns 404. |

## REVIEW_REQUIRED

None.

## Completed articles

| Queue | URL | Group | Original | Current | Batch |
|---|---|---|---|---|---|
| 1 | /articles/automatic-vs-manual-motorbike-hanoi/ | A | 349 | 2410 | p2-02 |
| 2 | /articles/best-bike-for-hanoi-old-quarter/ | A | 378 | 2369 | p2-01 |
| 3 | /articles/best-scooters-to-rent-hanoi/ | A | 302 | 2064 | p2-02 |
| 4 | /articles/can-foreigners-rent-a-motorbike-hanoi/ | A | 378 | 1855 | p2-02 |
| 7 | /articles/first-time-renting-a-motorbike-hanoi/ | A | 410 | 2292 | p2-02 |
| 8 | /articles/how-to-book-a-motorbike-rental-hanoi/ | A | 361 | 2156 | p2-02 |
| 9 | /articles/how-to-rent-a-motorbike-hanoi/ | A | 498 | 1890 | p2-02 |
| 10 | /articles/motorbike-delivery-long-bien/ | A | 403 | 2584 | p2-01 |
| 11 | /articles/motorbike-delivery-old-quarter/ | A | 422 | 2205 | p2-02 |
| 12 | /articles/motorbike-rental-pickup-or-delivery-hanoi/ | A | 373 | 1882 | p2-02 |
| 14 | /articles/renting-motorbike-hoan-kiem/ | A | 437 | 2153 | p2-02 |
| 15 | /articles/renting-motorbike-noi-bai-arrival/ | A | 476 | 2174 | p2-02 |
| 17 | /articles/renting-motorbike-tay-ho/ | A | 471 | 2387 | p2-01 |
| 88 | /articles/renting-50cc-hanoi/ | A | 405 | 2185 | p2-01 |
| 91 | /articles/honda-vision-vs-yamaha-janus/ | A | 344 | 2376 | p2-01 |

## Pending queue (next 25 of 678)

| Queue | URL | Group | Words | Intent | Primary keyword | Cluster | Matrix | SEO status |
|---|---|---|---|---|---|---|---|---|
| 5 | /articles/can-tourists-rent-a-motorbike-hanoi/ | A | 337 | informational | can tourists rent a motorbike in hanoi | rental | P3 | OPTIMIZED 2026-10-15 |
| 6 | /articles/daily-weekly-monthly-motorbike-rental-hanoi/ | A | 371 | commercial | daily vs monthly motorbike rental hanoi | rental | P3 | OPTIMIZED 2026-10-15 |
| 13 | /articles/motorbike-rental-price-hanoi/ | A | 407 | commercial | Hanoi motorbike rental prices | rental | P3 | OPTIMIZED 2026-10-15 |
| 16 | /articles/renting-motorbike-six-months-hanoi/ | A | 497 | commercial | long term motorbike rental hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 18 | /articles/renting-vs-buying-a-motorbike-hanoi/ | A | 326 | informational | renting vs buying motorbike hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 19 | /articles/scooter-vs-semi-automatic-hanoi/ | A | 343 | commercial | scooter vs semi automatic hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 20 | /articles/where-to-park-motorbike-hanoi/ | A | 490 | informational | where to park motorbike hanoi | rental | P3 | LINKS_REPAIRED 2026-10-14 |
| 21 | /articles/best-bike-for-english-teachers-hanoi/ | A | 317 | commercial | best motorbike for english teachers hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 22 | /articles/best-motorbike-for-commuting-hanoi/ | A | 317 | commercial | best motorbike for commuting hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 23 | /articles/best-motorbike-for-day-trips-from-hanoi/ | A | 322 | commercial | best motorbike for day trips hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 24 | /articles/best-motorbike-for-expats-hanoi/ | A | 354 | commercial | best motorbike for expats hanoi | rental | P3 | OPTIMIZED 2026-10-15 |
| 25 | /articles/best-motorbike-for-hanoi-traffic/ | A | 372 | commercial | best motorbike for hanoi traffic | rental | P3 | OPTIMIZED 2026-10-14 |
| 26 | /articles/best-motorbike-for-long-distance-vietnam/ | A | 349 | commercial | best motorbike for long distance vietnam | rental | P3 | OPTIMIZED 2026-10-14 |
| 27 | /articles/best-motorbike-for-students-hanoi/ | A | 327 | commercial | best motorbike for students hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 28 | /articles/best-motorbikes-for-tall-riders-vietnam/ | A | 304 | commercial | best motorbike for tall riders vietnam | rental | P3 | OPTIMIZED 2026-10-14 |
| 29 | /articles/common-motorbike-rental-problems-hanoi/ | A | 406 | informational | motorbike rental problems hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 30 | /articles/easiest-motorbikes-for-beginners-hanoi/ | A | 371 | commercial | easiest motorbike beginners hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 31 | /articles/high-mileage-rental-motorbike-inspection/ | A | 364 | informational | high mileage rental riding | rental | P3 | OPTIMIZED 2026-10-14 |
| 32 | /articles/lightest-motorbikes-for-new-riders/ | A | 337 | commercial | lightest motorbikes for beginners | rental | P3 | OPTIMIZED 2026-10-14 |
| 33 | /articles/loose-chain-on-rental-motorbike/ | A | 348 | informational | loose chain rental motorbike | rental | P3 | OPTIMIZED 2026-10-14 |
| 34 | /articles/lost-key-rental-motorbike-hanoi/ | A | 338 | informational | lost key rental motorbike hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 35 | /articles/motorbike-rental-digital-nomads-hanoi/ | A | 488 | commercial | motorbike rental digital nomads hanoi | rental | P3 | LINKS_REPAIRED 2026-10-14 |
| 36 | /articles/motorbike-rental-english-teachers-hanoi/ | A | 445 | commercial | motorbike rental english teachers hanoi | rental | P3 | LINKS_REPAIRED 2026-10-14 |
| 37 | /articles/motorbike-rental-female-riders-hanoi/ | A | 466 | informational | motorbike rental female riders hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 38 | /articles/motorbike-rental-fuel-policy-hanoi/ | A | 364 | informational | motorbike rental fuel policy hanoi | rental | P3 | OPTIMIZED 2026-10-14 |

Continue with `node scripts/seo-package2.js --next 10`. Gate and report: `node scripts/seo-package2.js` (also run by the Quality Gate and the weekly maintenance).
