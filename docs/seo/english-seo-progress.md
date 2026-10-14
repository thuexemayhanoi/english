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

## 2026-10-14 — Passes 2 and 3: metadata, inbound links, guide references, money pages, legal consistency; matrix P2 queue cleared

### Pass 2 (commit d28bcfe, verified live)

- 156 titles rewritten to ≤ 65 characters and 229 meta descriptions to ≤ 165, one URL at a time, primary keyword kept; two near-duplicate pairs re-titled (underbones for delivery vs beginners; NMAX vs Lexi), one tourist-licence title kept free of the word "licence" so the Guide Assistant regression suite stays green.
- `scripts/related-links-fill.js`: every article with fewer than two explicit inbound related cards received two same-subcluster sources (298 source articles edited, `internal_link_targets` only).
- `scripts/link-guide-references.js` pass 1: 346 descriptive references ("the deposit article covers…") in 234 articles became contextual links; resolution limited to the author's declared related guides or exact titles.
- Matrix after pass 2: P0 0 · P1 4 · P2 238 · P3 761; OPTIMIZED 507 · LINKS_REPAIRED 320 · AUDITED 172.

### Pass 3 (this commit)

What changed on the site:

- Bare slug repair pass 2: 46 sentence-initial (capitalised) slugs in 30 articles became links; cumulative trail 1,642 links in 352 articles (`reports/link-bare-slugs.json`).
- Guide references pass 2: 254 references in 198 articles resolved through a reviewed per-phrase override map (225 decisions, including 8 corrections of the same-cluster fallback) plus the fallback's own 29 unambiguous hits. Pass 3: the last 33 articles resolved by hand (34 edits; hub links where a reference names a topic rather than an article; one anaphoric "as that article describes" reworded because the guide was already linked in the same sentence).
- Money pages batch 2: 8 commercial rental / monthly-rental pages received 38 contextual links to the pricing, monthly, deposit, licence, helmet, inspection and contact pages. No fact, price or claim changed.
- Legal consistency: 7 rental and review articles still said "A1 covers up to 175 cc". Each now states the rule the site's VERIFIED licence articles document under Law 36/2024/QH15 (a new A1 stops at 125 cc; A1 licences issued before 2025 stay valid to 175 cc; 150–155 cc bikes need class A) and links the A1 and class A guides. These are consistency edits against existing primary-source articles, not new legal research; listed for owner awareness in `optimization-log.json` (batch `legal-consistency-a1`).

Engine fixes (all deterministic, zero dependencies):

- `english-seo-matrix.js`: 36 cluster-7 rows of `docs/matrix/master-matrix.csv` (MM-0755…MM-0793) were recorded without the topic column, so the primary query was being read from the subcluster column; this had produced 30 false cannibalization P2 rows ("shares primary keyword 7.2 legal"). The engine now detects that layout by shape. The CSV itself is untouched (docs-sync owns it); normalising those rows and the 4 titles with unquoted commas (MM-0606, MM-0757, MM-0774, one more) is a docs task.
- Unlinked-reference detector: existing links are replaced by a marker before matching, so a reference that is already linked ("covered in our [brakes guide]", "(see our [IDP guide])") is never counted; self-references ("this article walks through") are excluded. After the link passes this had left 80 false P2 rows.
- Priority rule: soft signals (short body, related-cards-only) no longer make a commercial page P2 on their own; a money page (rental / monthly-rental, commercial intent) with no in-body links still does.
- `link-bare-slugs.js`: accepts sentence-initial capitalised slugs; dry runs write `reports/*-dry-run.json` (ignored by git) so the apply trail is never overwritten.
- `link-guide-references.js`: `--overrides <file.json>` (reviewed phrase → slug | null decisions, validated against the inventory) and `--cluster-candidates` (same-cluster fallback with a stricter two-thirds rule).
- `scripts/seo-baseline.json`: the improved duplicate-title metric (16 → 0) accepted with `--update-baseline --reason` after pass 2 was verified live; the guard now fails if a duplicate title returns.

### Verification (all on the final tree)

| Check | Result |
|---|---|
| frontmatter / duplicate / internal-link / sitemap / schema | P0 0 · P1 0 · P2 0 · P3 0 |
| seo-audit | P0 0 · P1 0 · P2 4 (the REVIEW_REQUIRED banners) · P3 0 |
| jekyll build | 1004 pages, 982 article pages |
| rendered-site-audit | P0 0 · P1 0 · P2 1 (404 page, by design) |
| seo-engine-test / assistant-test (built index) | 29/29 · 31/31 |
| build-report | QUALITY GATE: PASS |
| seo-score | 96.9 (other 75: 5 review-only findings) |
| seo-regression | PASS, baseline accepted 2026-10-14 |
| Article diffs | additive only (no article lost a line) |

### State after

| Metric | After pass 1 | After pass 3 |
|---|---|---|
| Matrix priority | P0 0 · P1 4 · P2 399 · P3 600 | P0 0 · P1 4 · P2 0 · P3 999 |
| Matrix status | OPTIMIZED 41 · LINKS_REPAIRED 344 · AUDITED 614 | OPTIMIZED 577 · LINKS_REPAIRED 310 · REVIEW_REQUIRED 4 · AUDITED 112 |
| QA P2 / P3 | 20 / 372 | 4 / 0 |
| Titles > 65 chars / descriptions > 165 chars | 143 / 229 | 0 / 0 |
| Near-duplicate title pairs | 14 | 0 |
| Articles with unlinked guide references | 196 | 0 |
| Articles with zero explicit inbound related links | 120 | 0 |
| Bare slug references in prose | 0 (1,587 repaired) | 0 (46 more repaired) |

The P2 queue is empty. The 4 P1 rows are the REVIEW_REQUIRED legal/travel articles (owner re-verification against primary sources). The remaining P3 rows are informational signals, not tasks: 188 articles whose only internal links are related cards (candidates for one or two in-body links when they are next edited) and 123 articles under 300 words (never lengthened to hit a quota).

### Next steps

1. Owner: re-verify the 4 REVIEW_REQUIRED articles (bluecard, Cambodia and Laos border crossings, travel insurance) against primary sources and clear the banners.
2. Docs: normalise the 36 shifted cluster-7 rows and the 4 unquoted-comma titles in `docs/matrix/master-matrix.csv` (docs-sync tooling), then re-run `node scripts/english-seo-matrix.js`.
3. Connect Google Search Console for en.rentbikehanoi.com and record real queries in `docs/seo/keyword-evidence.json`; the domain currently has no measured organic rankings (OpenRush/OpenSEO/Ubersuggest, 2026-10-14), so on-site evidence drives priorities until then.
4. When an article is next edited for any reason, add one or two in-body contextual links if it is one of the 188 related-cards-only articles (`seo_issues` column); never bulk-edit bodies.

### Live verification of pass 3 (commit e7f02be on main)

- GitHub Actions on e7f02be: Quality Gate run 38551030793 success; pages build and deployment run 38551030852 success (10:40 UTC); Weekly Maintenance run 38551031138 success with no safe-fix PR opened (no open pull requests).
- Live pages fetched after the deploy (Firecrawl, no cache): `/articles/documents-needed-rent-motorbike-hanoi/` serves the corrected A1 sentence with its link to the A1 guide; `/articles/renting-motorbike-hue/` serves the new Hai Van Pass link; Open Graph image, article metadata and canonical URLs intact.
- OpenRush `audit_site` on the live domain (sitemap discovery, 1,003 URLs, 20 sampled across every template): on-page score 96.8, high 0, medium 0, low 2. Both low findings reviewed and left as they are: the "missing alt" hits are the decorative header and assistant logos (`alt=""` + `aria-hidden`, correct for decorative images), and the one "long title" is the tool counting the site-name suffix. Recorded in `docs/seo/keyword-evidence.json` (`_site_audits`).
- Note for future watchers: the container cannot reach en.rentbikehanoi.com directly (network policy); live checks go through the Firecrawl connector.

## 2026-10-14 — Pass 4: first in-body contextual links for the 188 related-cards-only articles

Every article whose only internal links were the related cards now carries one to three contextual links inside its prose (188 articles, 381 links). Each link sits on an existing phrase and points to one of the article's own declared related guides, or to a topic hub where the phrase names a topic rather than an article; no sentence, fact, price or legal figure was changed (one double space was collapsed). Anchors were chosen by hand from candidate sentences that share at least two significant words with the target's title (scratch helper, not a repo tool), then applied with the asserted-anchor applier (exactly one occurrence, target must exist).

| Cluster | Articles |
|---|---|
| law-licences | 58 |
| motorcycles | 31 |
| electric | 31 |
| hanoi | 26 |
| trips | 17 |
| manual-clutch | 9 |
| rental | 7 |
| scooters | 6 |
| vietnam-travel | 2 |
| 50cc | 1 |

Verification on the final tree: frontmatter / duplicate / internal-link / sitemap / schema P0-P3 all 0; seo-audit P2 4 (REVIEW_REQUIRED banners); build 1004 pages; rendered-site-audit P2 1 (404 page); engine tests 29/29; Guide Assistant 31/31 on the built index; Quality Gate PASS; seo-score 96.9; regression guard PASS; article diffs additive only.

Matrix after pass 4: P0 0 · P1 4 · P2 0 · P3 999; OPTIMIZED 645 · LINKS_REPAIRED 310 · REVIEW_REQUIRED 4 · AUDITED 44; related-cards-only articles 188 → 0. The only remaining P3 signal is length (123 articles under 300 words), which stays a signal: articles are never lengthened to hit a quota. Logged as batch `in-body-links-1` in `docs/seo/optimization-log.json`.
