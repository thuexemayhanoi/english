# English SEO Progress Log

Companion to `english-seo-master-matrix.md` (per-URL state) and `english-keyword-clusters.md` (keyword ownership). Regenerate both with `node scripts/build-report.js && node scripts/english-seo-matrix.js` after every verified batch, and record the batch here.

## Standing rules for every batch

- No deletions, no URL/slug/permalink changes, no redirects, no noindex on public pages, no new articles (the 981-article plan is complete).
- Business claims only from `docs/OWNER-FACTS.md`; legal facts only from primary sources; never invent search volumes, rankings or prices.
- Change titles/descriptions only where the primary keyword survives; never bulk-shorten, never lengthen to a quota.
- Verify before recording: `node scripts/build-report.js`, `node scripts/seo-engine-test.js`, `jekyll build` + `node scripts/rendered-site-audit.js`, `node scripts/seo-regression.js`; only then update `matrix-status.json`.

## 2026-10-14 — Full audit, Master Matrix, pillar pages, batch 1, corpus link repair

### State before (remote main 508c368)

| Metric | Value |
|---|---|
| Indexable URLs | 1,003 (981 articles, 14 topic hubs, 8 site pages) |
| QA findings | P0 0 · P1 0 · P2 21 · P3 384 (239 long descriptions, 145 long titles) |
| Rendered-site audit | 7 × P2 "no breadcrumbs" (about, contact, faq, search, privacy, terms, 404) |
| Near-duplicate title pairs | 16 (incl. one pair with identical intent: VinFast Amio vs Evo Lite twice) |
| Articles with contextual in-body links | 216 (links written as `{{ '/articles/x/' \| relative_url }}` were invisible to the audit) |
| Articles referencing other guides by bare slug in prose | 348 (1,587 occurrences, e.g. "see motorbike-rental-deposit-monthly-hanoi") |
| Open Graph / Twitter metadata | none |
| Breadcrumbs | 2 levels (Home > page), microdata only |
| BlogPosting schema | headline/dates/description/author/publisher name only |
| Topic hubs | one-paragraph intro, no curated links (all 14) |
| First-party search data | none (no English Search Console export; SOURCE-MAP) |

### What was built

1. **English SEO Master Matrix engine** — `scripts/english-seo-matrix.js` (plain Node, consumes the existing QA reports; no parallel engine). Outputs `english-seo-master-matrix.{csv,json,md}` with the 14 required fields for all 1,003 URLs, plus `english-keyword-clusters.md`. Inputs it merges: article front matter, `docs/matrix/master-matrix.csv` (945/981 rows joined by title), `keyword-targets.json` (34 core keywords → 57 owner/supporting URLs), `keyword-evidence.json` (recorded tool metrics), `matrix-status.json` (hand-maintained status) and `reports/link-bare-slugs.json`.
2. **Keyword ownership map** — every keyword family from the brief has exactly one owner URL; variants and supporting URLs are explicit. Three keywords are recorded as gaps served honestly by existing URLs (Honda Cub rental, VinFast rental, app/online booking): no article was created and no unoffered service is implied.
3. **Keyword evidence** — Ubersuggest (global, English) returned real volumes for the core family: motorbike rental hanoi 2,900/mo, motorbike rental vietnam 5,400, scooter rental hanoi 480, motorbike rental hanoi old quarter 40, 50cc scooter rental hanoi 30, electric scooter rental hanoi 10; "monthly motorbike rental hanoi" returned 0 (tool has no data; owner history still records it as a recurring real enquiry). Google Search Console is not connected on either OpenRush or OpenSEO, so no first-party clicks/impressions exist yet.
4. **Bare-slug link repair tool** — `scripts/link-bare-slugs.js`: exact-match, protected-region, dry-run-by-default conversion of bare slug references into house-style contextual links whose text is the target article's own title.
5. **Audit extension** — `lib.extractLinks` now resolves `{{ '/path/' \| relative_url }}` links, so every contextual link in the corpus is validated for breakage (0 broken).

### What was changed on the site

- **Shared layouts (site-wide, no article bodies touched)**: Open Graph + Twitter Card tags with a generated 1200×630 social card (`assets/img/og-default.png`, built only from the site logo, name and tagline); 3-level breadcrumbs (Home > topic hub > article) with a JSON-LD BreadcrumbList; BlogPosting enriched with inLanguage, articleSection, keywords, image, isPartOf, author/publisher URLs and logo; WebSite + Organization graph with SearchAction on the homepage (verified identity data only); breadcrumbs added to the six utility pages; "All guides in this topic" heading on hubs.
- **14 topic hubs (pillar pages)**: direct-answer intro (60–110 words, facts from OWNER-FACTS only) + curated "Start here" / by-situation links (6–17 per hub, 150+ curated links in total) + cross-hub links. Hub descriptions for monthly-rental, scooters, motorcycles, manual-clutch, 50cc, electric, maintenance, parts-gear, safety, hanoi, trips and vietnam-travel now carry the owned keyword naturally.
- **Batch 1 — 20 priority URLs** (core keyword owners; every edit asserted against the original text, 96 replacements, 0 misses):

| URL | Before → after |
|---|---|
| how-to-rent-a-motorbike-hanoi | title 69→54 chars, description 190→160, 11 contextual links incl. hub, law, price, deposit, checklist |
| motorbike-rental-price-hanoi | description 191→145, 7 contextual links, 3-question FAQ built from the approved rate card |
| motorbike-rental-requirements-hanoi | title 67→63, description 196→163, legal/document links |
| can-foreigners-rent-a-motorbike-hanoi | description 180→152, IDP/50cc/e-bike/hub links |
| best-scooters-to-rent-hanoi | "Hanoi scooter rental" lead, review/rates/contact links |
| how-to-book-a-motorbike-rental-hanoi | description 197→163 (states "no app"), honest no-app/no-online-payment sentence, 6 links |
| monthly-motorbike-rental-hanoi | hub link, "Cluster 1" jargon removed, 12 bare slugs → links |
| motorbike-delivery-old-quarter | description 171→159, hotel-delivery lead, 9 bare slugs → links |
| motorbike-rental-pickup-or-delivery-hanoi | description 182→158, checklist/booking/monthly/contact links, Old Quarter + Tay Ho cross-links |
| renting-50cc-hanoi | description 193→163, "50cc motorbike rental in Hanoi" lead, broken phrasing fixed, 5 links |
| renting-a-motorbike-hanoi-without-licence | description 196→160, legal alternatives linked |
| renting-motorbike-hanoi-one-day | description carries daily/scooter intent, hub link, 13 bare slugs → links |
| renting-motorbike-hoan-kiem / -old-quarter / -tay-ho | hub links, delivery/monthly links, one mistyped slug fixed, bare slugs → links |
| renting-semi-automatic-underbone-hanoi | description carries "semi-automatic motorbike", 7 links |
| weekly-vs-monthly-motorbike-rental-hanoi | hub/contact links, bare slugs → links |
| can-foreigners-rent-electric-bike-vietnam | description 168→165, honest "VinFast not in published fleet" note, 5 links |
| vinfast-amio-vs-evo-lite | differentiated as the rider-choice guide (title/description/intro), cross-linked |
| vinfast-evo-lite-vs-amio | differentiated as the specs & battery-ecosystem guide, dangling "Review." fixed into links |

- **Corpus-wide link repair**: 348 articles, 1,587 bare slug references → contextual links (plus 10 near-miss slug typos repaired by hand to the same style). Mechanical, exact-match, reversible; no prose, facts or headings changed.

### Verification (all on the final tree)

| Check | Result |
|---|---|
| frontmatter / duplicate / link / seo / sitemap / schema audits | P0 0 · P1 0 · P2 20 · P3 372 · broken links 0 · orphans 0 |
| Jekyll build (1,004 pages) + rendered-site audit | P0 0 · P1 0 · P2 1 (404 page only) |
| Engine test suite | 29 passed, 0 failed |
| Guide Assistant tests (built index) | 31 passed, 0 failed |
| SEO score / fix matrix | 89.4 OK · 6 root causes, 0 auto-fixable |
| SEO regression guard vs baseline 2026-09-28 | PASS; duplicateTitles 16 → 14 (improvement) |
| Weekly maintenance orchestrator | PASS_WITH_REVIEW (no maintenance-specific findings) |
| Article inventory | 981, unchanged; no URL changed |

### State after

| Metric | Before | After |
|---|---|---|
| QA P2 / P3 | 21 / 384 | 20 / 372 |
| Near-duplicate title pairs | 16 | 14 |
| Rendered pages without breadcrumbs | 7 | 1 (404) |
| Articles with contextual in-body links | 216 | 573 |
| Bare slug references in prose | 1,587 | 0 |
| Matrix priority | — | P0 0 · P1 4 · P2 399 · P3 600 |
| Matrix status | — | OPTIMIZED 41 · LINKS_REPAIRED 344 · REVIEW_REQUIRED 4 · AUDITED 614 |

The 4 remaining P1 rows are the REVIEW_REQUIRED legal/travel articles (bluecard, Cambodia and Laos border crossings, travel insurance): owner re-verification against primary sources, not an SEO edit.

### Deliberate non-actions

- No FAQPage schema on /faq/: the 52 answers would have to be duplicated into JSON-LD by hand and Google no longer shows FAQ rich results for commercial sites; recorded as P3.
- `scripts/seo-baseline.json` not updated: the regression guard already passes with an improvement; accept the new duplicate-title metric only after the deployment is verified live (`--update-baseline --reason`).
- No article lengthened; 127 articles under 300 words are listed as a signal, not a task.
- No OpenSEO project was created (it would create resources on the user's account); OpenRush has no connections.

### Next batches (from the matrix P2 queue)

1. **Batch 2 — rental "choosing a bike" and renter-situation commercial pages (22 P2 rows)**: automatic-vs-manual-motorbike-hanoi, best-motorbike-for-hanoi-traffic, best-motorbike-for-expats-hanoi, best-motorbike-for-day-trips-from-hanoi, best-motorbike-for-commuting-hanoi, best-bike-for-hanoi-old-quarter, best-motorbike-for-two-people-hanoi, easiest-motorbikes-for-beginners-hanoi, daily-weekly-monthly-motorbike-rental-hanoi, motorbike-rental-digital-nomads-hanoi, expats-monthly-motorbike-hanoi, english-teachers-monthly-motorbike-hanoi, families-monthly-motorbike-hanoi, plus motorbike-rental-monthly-price-hanoi, e-bike-monthly-rental-hanoi, renting-motorbike-long-bien, motorbike-delivery-long-bien.
2. **Cannibalization watchlist (14 pairs)**: differentiate audience/use case in title + description + H2s and cross-link (list in `english-keyword-clusters.md`).
3. **196 articles with descriptive unlinked references** ("the X article covers…"): convert to contextual links batch by batch; 120 articles with zero inbound related-card links need 2–3 inbound targets each.
4. **Title/description signals**: 143 titles > 65 chars and 229 descriptions > 165 chars, trimmed only where the primary keyword survives.
5. **Connect Google Search Console** for en.rentbikehanoi.com and record queries/pages in `keyword-evidence.json` before re-prioritising.
