# SEO PACKAGE 2 — CONTENT DEPTH 1600+

Owner-approved scope extension (2026-10-25). Existing English articles whose Markdown body had **300-500 words** (inclusive) when the package started are raised to **at least 1600 words** of real content, in small verified batches. The 1600-word figure is an editorial requirement of the site owner, not a ranking threshold published by Google. No new articles, no URL, slug, permalink or canonical change, no content deleted, no redirects.

## Status

| Metric | Value |
|---|---|
| Articles in the site | 981 |
| Eligible at baseline (300-500 words) | 693 |
| Completed (>= 1600 words, batch QA passed) | 0 |
| REVIEW_REQUIRED | 0 |
| Pending | 693 |
| Batches published | 0 |
| Words added by completed articles | 0 |
| Slug / URL / canonical changes | 0 (gate: scripts/seo-package2.js) |

| Group | Eligible | Done | REVIEW_REQUIRED | Pending |
|---|---|---|---|---|
| A — Commercial SEO | 92 | 0 | 0 | 92 |
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

None published yet.

## REVIEW_REQUIRED

None.

## Pending queue (next 25 of 693)

| Queue | URL | Group | Words | Intent | Primary keyword | Cluster | Matrix | SEO status |
|---|---|---|---|---|---|---|---|---|
| 1 | /articles/automatic-vs-manual-motorbike-hanoi/ | A | 349 | commercial | automatic semi automatic or manual | rental | P3 | OPTIMIZED 2026-10-14 |
| 2 | /articles/best-bike-for-hanoi-old-quarter/ | A | 378 | commercial | best bike for hanoi old quarter | rental | P3 | OPTIMIZED 2026-10-14 |
| 3 | /articles/best-scooters-to-rent-hanoi/ | A | 302 | commercial | Hanoi scooter rental | rental | P3 | OPTIMIZED 2026-10-14 |
| 4 | /articles/can-foreigners-rent-a-motorbike-hanoi/ | A | 378 | informational | Hanoi motorbike rental for foreigners | rental | P3 | OPTIMIZED 2026-10-14 |
| 5 | /articles/can-tourists-rent-a-motorbike-hanoi/ | A | 337 | informational | can tourists rent a motorbike in hanoi | rental | P3 | OPTIMIZED 2026-10-15 |
| 6 | /articles/daily-weekly-monthly-motorbike-rental-hanoi/ | A | 371 | commercial | daily vs monthly motorbike rental hanoi | rental | P3 | OPTIMIZED 2026-10-15 |
| 7 | /articles/first-time-renting-a-motorbike-hanoi/ | A | 410 | informational | first time renting motorbike hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 8 | /articles/how-to-book-a-motorbike-rental-hanoi/ | A | 361 | informational | Motorbike rental app Hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 9 | /articles/how-to-rent-a-motorbike-hanoi/ | A | 498 | informational | Rent a motorbike in Hanoi | rental | P3 | OPTIMIZED 2026-10-15 |
| 10 | /articles/motorbike-delivery-long-bien/ | A | 403 | informational | motorbike delivery long bien hanoi | rental | P3 | LINKS_REPAIRED 2026-10-14 |
| 11 | /articles/motorbike-delivery-old-quarter/ | A | 422 | informational | Motorbike rental with hotel delivery | rental | P3 | OPTIMIZED 2026-10-14 |
| 12 | /articles/motorbike-rental-pickup-or-delivery-hanoi/ | A | 373 | informational | Hanoi motorbike rental delivery | rental | P3 | OPTIMIZED 2026-10-15 |
| 13 | /articles/motorbike-rental-price-hanoi/ | A | 407 | commercial | Hanoi motorbike rental prices | rental | P3 | OPTIMIZED 2026-10-15 |
| 14 | /articles/renting-motorbike-hoan-kiem/ | A | 437 | commercial | Hoan Kiem motorbike rental | rental | P3 | OPTIMIZED 2026-10-14 |
| 15 | /articles/renting-motorbike-noi-bai-arrival/ | A | 476 | informational | motorbike rental hanoi airport arrival | rental | P3 | OPTIMIZED 2026-10-15 |
| 16 | /articles/renting-motorbike-six-months-hanoi/ | A | 497 | commercial | long term motorbike rental hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 17 | /articles/renting-motorbike-tay-ho/ | A | 471 | commercial | Tay Ho motorbike rental | rental | P3 | OPTIMIZED 2026-10-14 |
| 18 | /articles/renting-vs-buying-a-motorbike-hanoi/ | A | 326 | informational | renting vs buying motorbike hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 19 | /articles/scooter-vs-semi-automatic-hanoi/ | A | 343 | commercial | scooter vs semi automatic hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 20 | /articles/where-to-park-motorbike-hanoi/ | A | 490 | informational | where to park motorbike hanoi | rental | P3 | LINKS_REPAIRED 2026-10-14 |
| 21 | /articles/best-bike-for-english-teachers-hanoi/ | A | 317 | commercial | best motorbike for english teachers hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 22 | /articles/best-motorbike-for-commuting-hanoi/ | A | 317 | commercial | best motorbike for commuting hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 23 | /articles/best-motorbike-for-day-trips-from-hanoi/ | A | 322 | commercial | best motorbike for day trips hanoi | rental | P3 | OPTIMIZED 2026-10-14 |
| 24 | /articles/best-motorbike-for-expats-hanoi/ | A | 354 | commercial | best motorbike for expats hanoi | rental | P3 | OPTIMIZED 2026-10-15 |
| 25 | /articles/best-motorbike-for-hanoi-traffic/ | A | 372 | commercial | best motorbike for hanoi traffic | rental | P3 | OPTIMIZED 2026-10-14 |

Continue with `node scripts/seo-package2.js --next 10`. Gate and report: `node scripts/seo-package2.js` (also run by the Quality Gate and the weekly maintenance).
