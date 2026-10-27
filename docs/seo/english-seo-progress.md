# English SEO Progress Log

Companion to `english-seo-master-matrix.md` (per-URL state) and `english-keyword-clusters.md` (keyword ownership). Regenerate both with `node scripts/build-report.js && node scripts/english-seo-matrix.js` after every verified batch, and record the batch here.

## Standing rules for every batch

- No deletions, no URL/slug/permalink changes, no redirects, no noindex on public pages, no new articles (the 981-article plan is complete).
- Business claims only from `docs/OWNER-FACTS.md`; legal facts only from primary sources; never invent search volumes, rankings or prices.
- Change titles/descriptions only where the primary keyword survives; never bulk-shorten, never lengthen to a quota. One owner-approved exception since 2026-10-25: SEO Package 2 expands the frozen list of 300-500 word articles to at least 1,600 words of real content (see the Package 2 sections below and `docs/seo/seo-package-2-content-depth.md`).
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

Live verification of pass 4 (commit f64c9ed on main): Quality Gate run 38554187473 success, pages build and deployment run 38554185641 success (11:07 UTC), Link Check run 38554187412 success, CodeQL run 38554187650 success. Fetched after the deploy (Firecrawl, no cache), `/articles/child-passengers-motorbike-vietnam/` serves both new in-body links (helmet law, passenger rules) alongside its primary-source citations.

## 2026-10-14 — Pass 5: hub FAQ sections, sitemap freshness, local-business schema

Site has no search data yet (new domain), so this pass works the signals a new site can control.

- **Common questions on five hubs** (`/topics/rental/`, `/topics/monthly-rental/`, `/topics/law-licences/`, `/topics/trips/`, `/topics/electric/`): 20 questions taken from the recorded People-also-ask and related searches for "motorbike rental hanoi" (`keyword-evidence.json`, `_serp_snapshot`), each answered in two or three sentences from `docs/OWNER-FACTS.md` or a VERIFIED article and linked to the serving guide. The cluster layout renders the section and emits FAQPage JSON-LD from the hub's `faq:` front matter, so the structured data always matches the visible text. Rich-result eligibility for FAQ is limited on commercial sites; the value here is query matching, answer-engine citations and the pillar page answering its own PAA questions.
- **Sitemap**: the 14 hub URLs now carry `<lastmod>` equal to the newest `last_reviewed` in their cluster (verified against the inventory, 0 mismatches); 995 of 1,003 URLs carry lastmod. Site pages stay without lastmod rather than using the build time.
- **Homepage schema**: the publisher node is now typed `Organization` + `LocalBusiness` with the approved opening hours (09:00–21:00 daily) and the map link already published on `/contact/`; no new business claim.
- Verification on the final tree: all source audits P0/P1 0 (seo-audit P2 4 = REVIEW_REQUIRED banners), build 1004 pages, rendered audit P2 1 (404), engine tests 29/29, Guide Assistant 31/31, Quality Gate PASS, regression guard PASS. Rendered `/topics/rental/` carries BreadcrumbList, CollectionPage and FAQPage (5 questions); homepage graph types WebSite + Organization/LocalBusiness.

## 2026-10-14 — Pass 6: title tags, homepage title, article-level FAQ on the money pages

Driven by the Ubersuggest site audit of the live domain (150 URLs crawled, overall 90, 0 broken, 0 redirected; recorded in `keyword-evidence.json` `_site_audits`): 111 of 150 titles were "too long" only because the shared layout appended " | Hanoi Motorbike Guide" to every page title, and the homepage title was the bare site name.

- **Title tag rule** (`_layouts/default.html`): a page's `title_tag` wins; otherwise the brand suffix is appended only when the whole string fits 65 characters, else the page title stands alone. Rendered titles over 65 characters: 0 of 1,003 (hubs and short titles keep the brand, long article titles keep their keywords instead of an ellipsis).
- **Homepage title**: "Hanoi Motorbike Guide: Motorbike Rental, Laws and Riding Tips" (61 chars), also used for Open Graph; the H1, description and schema are unchanged.
- **Article-level Common questions** (`_layouts/article.html`, `faq:` front matter → visible section after the body plus FAQPage JSON-LD; `faq_in_body: true` emits the schema only): 15 questions on the five money articles (how to rent, price, requirements, monthly, tourists), answered strictly from OWNER-FACTS (payment methods, late-return charge, delivery conditions, deposit range, no refund for unused time, no rider insurance) and the VERIFIED licence articles (IDP, minimum age, car licence). The price article keeps its existing in-body FAQ and only gains the schema.
- Verification on the final tree: all source audits P0/P1 0, build 1004 pages, rendered audit P2 1 (404), engine tests 29/29, Guide Assistant 31/31, Quality Gate PASS, regression guard PASS; rendered money articles carry BreadcrumbList + FAQPage + BlogPosting.
- Left as is from the audit: `/search/` is thin by word count (utility page, never noindexed by site rule); two "non-friendly URL" flags are tool heuristics on clean paths and URLs are never changed.

Live verification of passes 5 and 6: `/topics/rental/` serves the Common questions section (5 Q&A) and the live sitemap carries lastmod on all 14 hubs (995 of 1,003 URLs); `/articles/how-to-rent-a-motorbike-hanoi/` serves its three Common questions and the title tag without the brand suffix ("How to Rent a Motorbike in Hanoi: A Step-by-Step Guide"). Quality Gate and Pages succeeded on 1cc14ef and 160a2d5.

## 2026-10-14 — Pass 7: accessibility fixes from Lighthouse (shared layout only)

Lighthouse 12 run locally against the built tree (mobile emulation; scores in `keyword-evidence.json` `_site_audits`): performance 98–99, SEO 100, best practices 100, accessibility 84–89. Three accessibility failures, all in shared code:

- `assets/css/main.css` had a line break inside `var(--accent-ink)` on the search button, so the declaration was invalid and the button text rendered black on the red accent (4.1:1). Fixed; the WhatsApp button (white on #1ea952, 3.06:1) now uses `--wa: #11813a` (4.98:1) with a `--wa-ink` token so dark mode keeps a readable pair.
- The assistant button hides its text label on small screens and had no accessible name; `aria-label="Ask Nguyen Tu"` added.
- The contact sheet and assistant panel were `aria-hidden` while containing focusable links; both now carry `inert`, toggled by the existing open/close code.

After the fixes Lighthouse accessibility is 100 on the homepage and the money article, with performance, SEO and best practices unchanged. Rendered audit, engine tests (29/29), Guide Assistant (31/31) and Quality Gate pass. Compression, cache-TTL and minification findings are artefacts of the local static server and were left alone.

Live verification of pass 7 (commit 05f8c0b): the production homepage serves the keyword-bearing title, the assistant button with its accessible name, both dialogs with `inert`, and the Organization + LocalBusiness node with opening hours.

## 2026-10-14 — Pass 8: Common questions on the remaining nine hubs

Five more live SERP snapshots (OpenRush, recorded in `keyword-evidence.json` `_serp_snapshot_hubs`: safety, scooters, 50cc, Vietnam trips, riding in Hanoi; AI overviews present on all five, forums and tour operators dominate the organic results) supplied the People-also-ask questions for the informational hubs. All 14 hubs now carry a Common questions section with FAQPage JSON-LD: 55 questions in total, each answered in two or three sentences from a VERIFIED article or OWNER-FACTS and linked to the serving guide (no prices, intervals or claims beyond what those sources state). Verification on the final tree: source audits P0/P1 0, build 1004 pages, rendered audit P2 1 (404), engine tests 29/29, Guide Assistant 31/31, Quality Gate PASS, regression guard PASS; rendered hubs: 14 FAQPage blocks, 55 questions.

## 2026-10-14 — Five-weapon programme, weapon 01: blog foundation (Homepage, About, Pillar–Hub–Silo, FAQ, Contact, Privacy, Terms, technical SEO)

Audit result: every foundation page already exists with title, description, breadcrumbs and canonical; the homepage links all 14 hubs through the navigation data and lists the six most recently reviewed guides; Contact carries LocalBusiness schema, Privacy and Terms are indexable utility pages. Three gaps fixed:

- **FAQ**: the 52-question customer FAQ now lives in `_data/faq.json`; `_includes/faq-body.html` renders exactly the same markup (verified byte-equivalent apart from whitespace) and `_includes/faq-schema.html` emits FAQPage JSON-LD from the same data, so the visible answers and the structured data cannot drift. Internal links in the data use `@@/path/` placeholders that the include resolves with `site.baseurl`.
- **Pillar–Hub–Silo**: each hub's "All guides in this topic" list is now grouped by sub-cluster with humanised headings (for example the rental hub shows How to rent, Choosing bike, Rental practicalities, Renter situations, Area guides), making the silo structure visible to readers and crawlers.
- **About**: AboutPage JSON-LD linking the Organization and WebSite nodes.

Verification: all source audits P0/P1 0 (seo-audit P2 4 = REVIEW_REQUIRED banners), build 1004 pages, rendered audit P2 1 (404), engine tests 29/29, Guide Assistant 31/31 with the same 52 FAQ chunks, Quality Gate PASS, regression guard PASS.

## 2026-10-14 — Weapons 02 and 03: audit matrix A–Z, content factory guards

- **Weapon 02 (SEO Audit Matrix A–Z)** already runs end to end (`scripts/english-seo-matrix.js`: cannibalization, technical findings, keyword ownership, P0–P3). Added a **content gap register**: every People-also-ask question and related search recorded from live SERPs (`keyword-evidence.json`) is resolved to the URL that serves it, using the question's distinctive words (generic subject words such as motorbike, rental, Hanoi never decide a match). Result on this date: 55 recorded questions, 51 served by a Common-questions entry or a title, 4 unserved and all off-topic ("#1 cause of death", "$1000 for 2 weeks", "12 second rule", "2 fingers down"). Tooling never creates articles for gaps; the register is the owner's decision list.
- **Weapon 03 (AI Content Factory)**: the production plan is complete at 981 articles and the repo forbids new batches, so the factory's remaining job is quality control. `content-duplicate-check.js` now compares article bodies inside each cluster with five-word shingles (P3 from similarity 0.30, P2 from 0.60, never blocking) in addition to title, slug, description and primary-query checks: 39,528 pairs compared, 0 findings. A fixture pair with identical bodies is part of `seo-engine-test.js` (31/31).
- **Tracking set up with the connectors**: a Ubersuggest project for en.rentbikehanoi.com (Vietnam, English) tracks 25 commercial and licence keywords weekly and an AI Search Visibility brand with 10 prompts (ChatGPT, Gemini, Google AI Overviews) monthly against Tigit Motorbikes and Flamingo Scooters. First data arrives within about a day; nothing is recorded until it exists.

## 2026-10-14 — Weapon 04: AI search optimizer (AEO / GEO)

What answer engines and AI crawlers now get:

- **Entity**: the homepage publisher node is Organization + LocalBusiness with name, alternate Vietnamese name, address, telephone, opening hours, map, `areaServed` Hanoi, a `contactPoint` and a `knowsAbout` list of the site's seven subject areas; `sameAs` links the main Vietnamese site and the Facebook page. Contact carries LocalBusiness, About carries AboutPage, every page a BreadcrumbList, every article BlogPosting with dates and section.
- **FAQ / direct answers**: FAQPage JSON-LD on all 14 hubs (55 questions), the five money articles (15) and the customer FAQ (52), each answer matching the visible text and restating owner-approved or VERIFIED facts; hub intros open with a direct answer; many law articles open with "Short answer:".
- **`/llms.txt`**: a plain-text guide for AI crawlers naming the site, the business, the 14 hubs, the FAQ, contact and about pages, the owner-approved key facts (prices, deposit, insurance, payment, licence rule) and the sitemap. robots.txt allows every crawler.
- **Measurement**: 10 AI-visibility prompts (ChatGPT, Gemini, Google AI Overviews) tracked monthly in the Ubersuggest brand created today against Tigit Motorbikes and Flamingo Scooters; first report in about a day. Live SERPs on this date show AI overviews on every informational query sampled, so the FAQ and entity work targets the surfaces that exist.
- Verification: schema-check P0/P1 0, build, rendered audit P2 1 (404), sitemap-check 0 gaps.

## 2026-10-14 — Weapon 05: autonomous SEO engineer (Audit → Matrix → Fix → Test → QA → Report)

The loop now runs unattended inside the existing weekly maintenance workflow, with the production guards it already had:

1. **Audit**: the six QA tools, the Guide Assistant tests and the SEO engines (score, fix matrix, regression guard) run on the current main.
2. **Matrix**: `maintenance.js` regenerates the English SEO Master Matrix and keyword clusters from those fresh reports, prints the priorities and content-gap count in the maintenance report, and raises a maintenance P1 whenever the matrix holds a P0 row. A material change (priorities, status, issue frequency, gaps) becomes the "matrix refresh" safe fix; otherwise the committed files are restored byte-for-byte so nothing noisy is committed.
3. **Fix**: only the deterministic safe-fix policy (slug normalisation, stale README count, generated report and matrix refresh). Legal, business, price, safety and travel content is never touched automatically; it stays REVIEW_REQUIRED for the owner.
4. **Test / QA**: the safe-fix job rebuilds the exact repaired tree and re-runs the full audit; the article-count check and the regression guard refuse to push on any regression; the Quality Gate runs again on the PR.
5. **Report**: `reports/maintenance-latest.md` (row "English SEO matrix"), `reports/maintenance.json` (`seoMatrix`), the deduplicated maintenance issue and, when safe fixes exist, one PR squash-merged only on green.

Dry run on this tree: RESULT PASS_WITH_REVIEW (the four REVIEW_REQUIRED articles), matrix P0 0 · P1 4 · P2 0 · P3 999, content gaps 4, matrix unchanged, engine tests 31/31. Rank and AI-visibility data from the Ubersuggest project feed the next re-prioritisation once they exist.

## 2026-10-14 — ZERO-DATA / COLD-START mode: public research layer, data-driven switch, NAP guard, IndexNow

Context: en.rentbikehanoi.com has no Search Console, GA4, traffic or ranking data. The brief for this pass: research SERPs, keywords, competitors, intent, topical map and content gaps from public sources, record only real figures, complete the workflow, and switch to DATA-DRIVEN mode only when real data exists. Nothing below is estimated by hand; every number sits in `docs/seo/keyword-evidence.json` or `docs/seo/keyword-universe.json` with the tool and date that produced it.

### Research recorded (connectors: OpenRush, Firecrawl; Ubersuggest baseline from the earlier pass)

- **10 live SERP snapshots** (US market, 2026-10-14): five commercial Hanoi/Vietnam rental queries and five informational hub queries, with SERP features, local-pack entries (ratings and review counts as displayed), People also ask, related searches, top organic URLs and where the brand already appears (TripAdvisor #5 for "scooter rental hanoi", #9 UK for "monthly motorbike rental hanoi", a Facebook post #8). en.rentbikehanoi.com holds no organic position yet. → `docs/seo/serp-landscape.md`.
- **Competitor set**: 20 organic competitors across 12 seed queries (94 available) plus a deep dive on the strongest, rentalmotorbikevietnam.com (106 indexed keywords, 22 in the top 3, ~474 estimated visits/month, 60% transactional; its homepage carries 456 of those visits).
- **Keyword demand**: research_keywords in the US, UK, Australia and Vietnam markets (ideas and suggestions), the competitor keyword gap against five rivals (738 rows available, 100 read) and the deep-dive top keywords → `docs/seo/keyword-universe.json`: **138 on-topic rows** (105 core, 13 adjacent, 11 other-city, 9 competitor-brand); off-topic rows the tools returned (Vietnamese coffee, cost of living, Top Gear, US state licence rules, other countries) were dropped and are listed in the builder log, never in the repo.
- **Key finding — demand is in-country**: "motorbike rental hanoi" is estimated at 2,400 searches/month from Vietnam against 110 from the US, 10 UK and 10 AU; "motorbike rental vietnam" 3,600 (VN) vs 320 (US). The primary audience searches in English after arriving in, or while living in, Vietnam. Commercial Hanoi queries show a local pack above the organic results on every snapshot, won by Google Business Profiles with hundreds to thousands of reviews; organic slots go to TripAdvisor, Facebook groups and rental-shop homepages. Informational queries carry an AI overview plus Reddit/Facebook threads and dated, sourced explainers with FAQ pairs — the format the hubs and money articles already use.
- **Link profiles**: theextramile.co (domain rank 121, 96 referring domains) and tigitmotorbikes.com (rank 276, 1967 referring domains, 300 read); spam-filtered referring domains (spam score ≤ 20, competitors' own properties excluded) → **58 prospects** in `docs/seo/link-prospects.md` for the owner's outreach. Our baseline: domain authority 2, 23 referring domains (Ubersuggest, 2026-10-14).
- **Content formats** of three ranking pages (Firecrawl) recorded in `_content_formats`; the reading and its implications in `_analysis` (interpretation, flagged as such).

### Repository changes

- **Engine (scripts/english-seo-matrix.js)**: every `_serp_snapshot*` block now feeds the content gap register (91 recorded questions, 6 unresolved — all off-topic for a rental guide: "What are some new electric bike brands?", "How much does an electric bike usually cost?", "What is the #1 cause of death in Vietnam?", "Is $1000 enough for 2 weeks in Vietnam?", "What is the 12 second rule for motorcycles?", "What does 2 fingers down mean to bikers?"); "near me" queries resolve to /contact/. New **keyword universe coverage**: each row is mapped to its serving URL in a fixed order (keyword-targets owner by stemmed word set → title/primary keyword containing every word, pillars first for generic head terms → Common questions → partial match, reported as weak). Result: 104 of 105 core keywords served (86 strong, 18 weak), 1 gap (bmw motorcycles vietnam — not a target). Three documents are regenerated every run and treated as matrix files by maintenance.js: `serp-landscape.md`, `keyword-universe.md`, `link-prospects.md`. The coverage stemmer now strips plurals before other suffixes ("mopeds"/"moped" compared equal); one false P1 disappeared.
- **Keyword ownership**: 12 owners/variants added to `docs/seo/keyword-targets.json` for the head terms the research surfaced (Motorbike Vietnam, Scooters in Vietnam, Scooter rental Vietnam, Mopeds Vietnam, the "hire" variants) — 26 owner URLs, 0 missing. Hub /topics/scooters/ title "Scooters" → "Scooters in Vietnam" and a description that names renting in Hanoi, so the pillar covers its owned keywords.
- **NAP guard (scripts/schema-check.js)**: name, address, phone, hours and Organization/LocalBusiness JSON-LD (including @graph members) checked against docs/OWNER-FACTS.md on every business-facing surface; wrong value = P1, approved number without the "Street" form = P3. Four address strings aligned to the approved form ("112 Nguyen Van Cu, …" → "112 Nguyen Van Cu Street, …": the contact-sheet include and three articles); schema-check is now P0–P3 0. Fixture-tested.
- **DATA-DRIVEN switch (dormant)**: `docs/seo/gsc-performance.csv` (Search Console export; header-only template committed) flips the matrix mode automatically: measured clicks, impressions and impression-weighted position become row evidence, quick-win (≥50 impressions at position 4–20) and low-CTR (≥200 impressions, top 3, CTR < 2%) bands raise P3 → P2, measured queries are mapped to serving URLs, the matrix header states the mode. Parser and bands in `scripts/lib.js` (parseGscCsv, gscSignal), fixture-tested; an unknown layout is rejected. Verified on a two-row test export: mode DATA-DRIVEN, one quick win raised, then restored to ZERO-DATA.
- **IndexNow**: key file at the repo root, `scripts/indexnow-submit.js` (live-sitemap allow-list, key-file liveness wait, changed-file → URL mapping via lib.js, retries, report artifact) and `.github/workflows/indexnow.yml` (after each successful pages-build-deployment; manual full resubmission). Google stays with the sitemap and Search Console.
- Docs: README (SEO / QA SYSTEM, NEXT RECOMMENDED STEP), AGENTS.md ownership map, this log.

### Verification (all on the final tree)

Six source audits P0/P1 0 (seo-audit P2 4 = the REVIEW_REQUIRED banners), schema-check 0 findings, engine tests 40/40, seo-score and fix-matrix regenerated, seo-regression PASS, Jekyll build 1004 pages, rendered-site audit P2 1 (the 404 page), Guide Assistant 31/31 (52 FAQ chunks), key file served at /7b288e5014f42a58a1571ea53a457bbc.txt, hub title renders "Scooters in Vietnam | Hanoi Motorbike Guide". Matrix: P0 0 · P1 4 (the four REVIEW_REQUIRED owner re-verifications) · P2 0 · P3 999.

### Owner-side levers this repository cannot pull

1. Google Business Profile: reviews and identical NAP decide the local pack that sits above every commercial Hanoi result.
2. Search Console property for en.rentbikehanoi.com; export → `docs/seo/gsc-performance.csv` → DATA-DRIVEN mode.
3. Outreach from `docs/seo/link-prospects.md` (editorial mentions, listings, partners; never paid links).
4. Keep the TripAdvisor and Facebook pages that already rank aligned with OWNER-FACTS and linked to the site.

## 2026-10-14 — Weapon 06: autonomous SEO engine (zero-data): research ingest, Vietnam-market SERPs, topical map

Brief: run Weapon 06 in ZERO-DATA mode — audit the repository, keep the SEO Matrix, research SERPs, build the topical map, cluster keywords and find content gaps — reusing the five existing weapons and never inventing data. No Search Console, GA4 or paid API was used; every figure below carries its tool, market and date in `docs/seo/keyword-evidence.json` / `docs/seo/keyword-universe.json`.

### Part 1 — research ingest engine (commit f40d062)

- `scripts/seo-research-ingest.js`: raw connector exports dropped into the git-ignored `docs/seo/research/inbox/` are merged deterministically and idempotently into the evidence file (`_serp_snapshot_ingested` per query and market with position history, `_competitors` + deep dives, `_competitor_backlinks`, `_keyword_gap`, `_ingest_log`) and the keyword universe (classification core / adjacent / other-city / competitor-brand and topic rules now live in the repository; cars, food, cost-of-living, accommodation and other countries are dropped). Re-ingesting changes nothing. Fixture-tested.
- Research added with the connectors: 16 SERP snapshots in total, 3 of them for the Vietnam market ("electric motorbike rental hanoi", "monthly motorbike rental hanoi", "motorbike rental hanoi"), plus hub-level US snapshots (licence for foreigners, Ha Giang loop rental, can tourists rent) and demand seeds for trips, gear, electric, riding and repair. Universe: 138 → 159 on-topic rows (116 core).
- Vietnam-market SERP for "motorbike rental hanoi": rental-shop homepages fill the organic slots (tigitmotorbikes.com, stylemotorbikes.com, rentalmotorbikehanoi.com, phungmotorbike.com, hanoimotorbikerental.com), the business's TripAdvisor page sits at #7, the same three Google Business Profiles hold the local pack. In the primary market the competition is shop websites, not Facebook threads.

### Part 2 — topical map engine (this commit series)

- `scripts/topical-map.js` → `docs/seo/topical-map.{json,md}`: 14 clusters, 981 articles; in-body links that stay inside their silo 1967 (64%), cross-silo 1121; **354 articles receive no in-body link from their own silo** (hub listing and related cards only); hubs with fewer than three start-here links: 0; keyword clusters by serving URL 40; split keyword families 4; SERP questions served 158, unserved 7 (all off-topic); demand served (core, VN market) 50340/50460.
- Weakest silos by in-silo share: parts-gear 36%, manual-clutch 38%, 50cc 41%, hanoi 45%; most silo orphans: motorcycles 71, scooters 58, parts-gear 44, manual-clutch 30. Largest cross-silo flows: parts-gear → maintenance 104, parts-gear → safety 92, monthly-rental → rental 70 (gear → maintenance/safety pointers are intentional; the rest is the queue).
- Recommendations (all REVIEW_REQUIRED): serp-gap 1, hub-links-outside-silo 13, silo-leak 4, silo-orphans 14, keyword-cluster 15, money-page-inbound 50, split-family 4, owned-keyword-coverage 1. Demand gaps: "triumph motorcycles vietnam", "mutt motorcycles vietnam", "bmw motorcycles vietnam" (big-bike brand queries, not targets). Split families: "bike honda vietnam", "honda motorbike vietnam", "motorbike route vietnam", "motorbike vietnamese".
- Autonomous loop: maintenance.js now runs Audit → Matrix → Map, reports the map row and carries map changes with the matrix-refresh safe fix; dry run on this tree PASS_WITH_REVIEW, map unchanged. Engine tests 51/51.

### What the map says to do next (by hand, in batches)

1. Contextual in-silo links for the 50 money pages with fewer than two in-silo inbound links (rental, monthly-rental, scooters first), then the 354 silo orphans, highest-demand silos first (vietnam-travel, rental, law-licences, scooters).
2. Declare one owner for each split keyword family in `docs/seo/keyword-targets.json`.
3. Keep ingesting research: drop new connector exports into the inbox, run the ingest, the matrix and the map; switch to DATA-DRIVEN mode the day a Search Console export exists.

## 2026-10-14 — Working the matrix and the map: batch 1 (keyword ownership, pillar titles, in-silo links for the money pages)

The matrix itself holds only the four REVIEW_REQUIRED owner re-verifications above P3, so the work queue is the topical map (`docs/seo/topical-map.md`). First batch, by hand, in the order the map ranks it.

- **Keyword ownership (data only)**: the four split keyword families are consolidated under pillar owners in `docs/seo/keyword-targets.json` ("Vietnamese motorbikes" + "Motorbikes in Vietnam" + "Honda motorbike Vietnam" and variants → /topics/motorcycles/; "Motorbike routes Vietnam" → /topics/trips/); 55 owned keywords on 63 owner URLs, 0 missing. The coverage stemmer now equates "Vietnamese" with "Vietnam" in both engines, and declared GAP keywords no longer raise an owned-keyword-coverage recommendation.
- **Pillars**: motorcycles hub title "Motorcycles" → "Motorcycles in Vietnam" (matches the scooters hub and covers the new owned terms); trips hub description names northern Vietnam and is back under 165 characters; the law hub's Start here list links "What counts as a moped under Vietnamese law", the head-term carrier the map flagged.
- **In-silo links (hand-written)**: one short navigational paragraph in each of 20 rental and monthly-rental guides — the eight district area guides now point to neighbouring district guides (geography checked), the how-to, first-time, requirements and foreigners guides point to the situation and audience guides, the three monthly guides point to the lifestyle guides. Result: every commercial rental and monthly-rental page has at least two in-body inbound links from its own silo (21 target URLs). The automated alternative was measured first and rejected: linking existing phrases would have reached only 33 of 250 queue targets, with model names landing on comparison pages instead of reviews.
- **Map before → after**: recommendations 102 → 77 (money-page-inbound 50 → 34, split families 4 → 0, keyword-cluster flags 15 → 11); commercial pages with fewer than two in-silo inbound links 139 → 119 (the remainder are model-comparison pages in scooters, motorcycles, manual-clutch and electric); in-silo in-body links 1967 → 2014; articles without an in-silo inbound link 354 → 347. Matrix unchanged at P0 0 · P1 4 · P2 0 · P3 999; keyword universe weak matches 24 → 20.
- **Next batches from the map**: the 34 remaining money-page recommendations are model-comparison pages (link them from the matching model reviews and "best of" lists in the same silo), then the 347 silo orphans, highest-demand silos first (vietnam-travel, law-licences, scooters).

## 2026-10-14 — Working the matrix and the map: batch 2 (the queue is closed)

Brief: finish the whole matrix. The matrix rows above P3 are still the four REVIEW_REQUIRED legal/insurance re-verifications, which stay owner-only by repository rule; everything the topical map could ask of the repository has now been done.

- **Reviews → comparisons**: every model review in the scooters, motorcycles, manual-clutch and electric silos ends with a "Head-to-head comparisons involving this model" paragraph generated from the comparison slugs (36 reviews, 180 links, link text = the comparison titles, same silo only). Model names are disambiguated by exact token match (Blade ≠ Air Blade; Sirius → the Sirius RC 110 review), and the paragraph is skipped where the review already linked the comparison.
- **Shortlists**: 46 hand-written navigational paragraphs on the specs-explained and line-up guides (seat heights, kerb weights, tank range, fuel economy, power-to-weight, model years, spec-sheet reading, the Honda and Yamaha line-ups, electric cost-of-ownership and test-ride guides) pointing at the "best of" and price-list pages they feed. Commercial pages with fewer than two in-silo in-body inbound links: 119 → 0.
- **Silo orphans**: `related-links-fill.js --same-silo` (new flag: count only cards from the article's own cluster) added 31 same-silo related cards, plus 9 manual card additions; true silo orphans (no in-body link and no same-silo card) undefined → 0. Articles without an in-body link from their silo 347 → 244; in-silo in-body links 2014 → 2265 (67% of in-body links now stay inside their silo).
- **Keyword ownership and classification**: "Hanoi to Ho Chi Minh by motorbike" (+ Saigon-to-Hanoi variants) → the north-south route guide, "One way motorbike rental Vietnam" (+ scooter variants) → the one-way rental guide, "Motorbike holidays Vietnam" → the Vietnam travel pillar; big-bike brand and model queries (BMW, Triumph, Mutt, GB350, CBR650R…) are classified adjacent, Ha Long / Sa Pa / Ha Giang / Laos rental queries other-city. Keyword universe: 160 rows, 97 core keywords strongly served, 12 weak, 0 gaps; 62 owned keywords on 64 owner URLs.
- **Map rules**: "silo-orphans" now means a true orphan (the related cards the layout renders are real links); "hub-links-outside-silo" fires only above 30% of start-here links. Recommendations 77 → 13: serp-gap 1, silo-leak 4, keyword-cluster 7, hub-links-outside-silo 1 — all informational (four clusters whose in-body links are structurally cross-silo: gear → maintenance/safety, 50cc and manual → rental and law; seven keyword-cluster notes; seven off-topic People-also-ask questions).
- **Matrix**: unchanged at P0 0 · P1 4 · P2 0 · P3 999. QA on the final tree: six audits P0/P1 0, engine tests 51/51, regression PASS, build 1004 pages, rendered audit P2 1 (404), Guide Assistant 31/31.

### What is left, and whose it is

1. The four REVIEW_REQUIRED articles (bluecard ownership papers, Laos and Cambodia border crossings, travel insurance): owner re-verification against primary sources, then VERIFIED with a new last_reviewed — never by tooling.
2. Google Business Profile reviews and NAP (local pack), a Search Console property (→ DATA-DRIVEN mode), outreach from link-prospects.md.
3. Periodic research refresh through the inbox and ingest engine; the weekly maintenance run keeps the matrix and the map current.

## 2026-10-15 — Working the matrix and the map: batch 3 (resolver accuracy, ownership refinements, one fact correction)

Brief: continue the matrix. The P0–P2 queue was already empty, so this batch audited the matrix's own evidence: how every keyword-universe row and every recorded SERP question is mapped to a serving URL.

- **Resolver bugs found and fixed** (scripts/english-seo-matrix.js): the gap stemmer reduced "motorbikes" to *motorbik* but left "motorbike" whole, so the singular counted as a distinctive word and produced nonsense matches (Suzuki and Yamaha queries "served" by a 50cc licence question). Singular and plural now share one stem (also licence/licenses, bike/bikes; "used" is kept whole so it never matches "use"). Declared keywords are now matched exactly before the stemmed word set: "Vietnamese motorbikes", declared for the motorcycles pillar since batch 1, had silently resolved to the travel pillar. One owner resolver now serves the keyword universe and the content gap register, rental queries stay on rental pages, a guide or review is preferred over a head-to-head comparison, and competitor brand names, places outside Vietnam and marketplace ("for sale") queries are recorded as non-gaps. Laos-only riding queries are classified adjacent.
- **Keyword ownership**: a "Zero-data refinements (2026-10-15)" group of 19 keywords in docs/seo/keyword-targets.json for rows the title resolver had sent to unrelated pages (e.g. "buy motorbike in vietnam" → a parts-buying article, "motorbike across vietnam" → a left-turn technique article, "electric motorbike vietnam" → an insurance article). Owners: the electric, 50cc and law pillars, the tourist buying guide, the traffic-culture primer, the new-scooter price list, the Hanoi rental price guide, the Honda CT125 review, the motorcycles pillar for brand head terms, the one-way rental guide for "rental Hanoi to Ho Chi Minh". "Suzuki motorbike Vietnam" and "Temporary Vietnamese motorbike licence" are declared GAP: the site has no verified Suzuki data and describes no temporary-licence route, so nothing is claimed.
- **SERP evidence (OpenRush, US, 2026-10-15)**: "motorbike vietnam" (travel advice, tours, routes, legal riding), "vietnamese motorbikes" (fleets, for-sale listings, model recommendations, brands) and "mopeds vietnam" (informational: learning to ride, legal moped definition, industry). The first two share 0 of 7 organic URLs, so the travel and motorcycles pillars keep separate owners; the topical map now records such a family as an intent split verified by SERP overlap (fewer than 3 shared URLs) instead of a consolidation recommendation. The mopeds SERP confirms the informational owner (the moped definition guide) despite the tool's commercial label.
- **Fact correction**: the electric market overview said Honda and Yamaha sell no electric two-wheelers in Vietnam, and docs/MODEL-DATABASE.md repeated it. Honda Vietnam's official electric page lists the ICON e: and CUV e: (and announced the UC3 in January 2026); Yamaha Motor Vietnam lists the NEO's. The sentence now names those models with the official pages as sources; no specification or price was added until verified rows exist.
- **Pillar**: the maintenance hub's Start here gains the common-issues guides (flat tyre repair, diagnosing a noise, after heavy rain), the largest subcluster (53 articles) that had no curated link.
- **Results**: keyword universe core strongly served 97 → 106, weak 12 → 2 (both declared GAP), gaps 0; content gap register 20 unserved questions, all off-topic or outside the site's services (tours, Grab, rent-to-own e-bikes, accident statistics, brand rankings); map recommendations 13 → 6 (four structural silo-leak notes, the off-topic SERP questions, one third-party intent label contradicted by the SERP); split families 0, one SERP-verified intent split. Matrix unchanged at P0 0 · P1 4 · P2 0 · P3 999. QA: six audits P0/P1 0, engine tests 53/53 (two new topical-map cases), regression PASS, build 1004 pages, rendered audit P2 1 (404), Guide Assistant 31/31, maintenance PASS_WITH_REVIEW with matrix and map unchanged.

### What is left, and whose it is

1. The four REVIEW_REQUIRED articles (bluecard ownership papers, Laos and Cambodia border crossings, travel insurance): owner re-verification against primary sources.
2. Verified Honda/Yamaha electric and Suzuki rows for docs/MODEL-DATABASE.md, retrieved from the manufacturers' official pages, before any model page or specification mentions them.
3. Google Business Profile, Search Console (→ DATA-DRIVEN mode), outreach from link-prospects.md, periodic research refresh.

## 2026-10-15 — Working the matrix: batch 4 (filling the gaps from primary sources)

Brief: keep working the matrix without stopping; where information is missing, research it online and fill it in. The production plan is complete, so every gap is filled inside an existing URL, from primary sources only.

- **A legal error found and corrected across the electric silo.** 22 articles, the VinFast line-up table, two hub FAQ answers and docs/MODEL-DATABASE.md called the VinFast Evo, Feliz II and Viper licence-free because their motors are under 4 kW. Article 34(1)(g) of Law 36/2024/QH15, as the site's own VERIFIED law articles record, defines the moped by both limits: 4 kW or less and a design speed of no more than 50 km/h. These three are designed for up to 70 km/h, and VinFast's own January 2026 release says only the speed-limited Evo Lite needs no licence. Every statement now gives an A1 licence for the 70 km/h models and keeps the Evo Lite and Amio licence-free; the 4 kW tables now carry the speed limit too. 49 sentences in 25 articles and 2 hubs were corrected by hand; nothing else in those pages changed. A follow-up sweep of every remaining "4 kW" licence statement added the missing 50 km/h condition in 9 more articles (among them the e-bike vs scooter comparison table, which said a licence is needed "only above 4 kW", and the rental-requirements FAQ) and in the electric licence answer of the site FAQ data.
- **Verified manufacturer rows added** (official Vietnamese pages, retrieved 2026-10-15): Honda ICON e: (1.81 kW, 48 km/h, licence-free moped), CUV e: and UC3 (about 6 kW, 80–82 km/h, A1); Yamaha NEO's (2.3 kW, no published top speed); Suzuki Satria (147.3 cc) and V-Strom 250SX (249 cc), both class A. They now serve "honda electric bike vietnam", "yamaha motorbike vietnam" and "suzuki motorbike vietnam" inside the electric market overview, the Honda and Yamaha line-up guides and the motorcycles pillar, which also names SYM and Piaggio as official Vietnamese sellers without unverified figures.
- **New SERP research (OpenRush, US):** helmet law, traffic fines for foreigners, buying a motorbike as a tourist, semi-automatics, repair shops in Hanoi, Hanoi parking, long-term rental for expats. The on-topic questions they raised are answered by VERIFIED pages that already existed, now mapped: the 1968 Convention and IDP guides (American licences, 1949 IDPs, international licences), the police-stop guide, the used 50cc checklist, the tourist buying guide (can a foreigner buy a motorbike) and the learner-permit guide (temporary licences). The law hub's FAQ question now names "tourists and other foreigners"; the resolver treats "drive" and "ride" as one word on two wheels.
- **Results:** core keywords 108 strongly served, 0 weak, 0 gaps; content gap register 34 → 23, all off-topic, opinion or data the site does not hold (moped prices, rent-to-own); matrix unchanged at P0 0 · P1 4 · P2 0 · P3 999. QA: six audits P0/P1 0, engine tests 53/53, regression PASS, build 1004 pages, rendered audit P2 1 (404), Guide Assistant 31/31.

## 2026-10-15 — Working the matrix: batch 5 (the first real position data)

Brief: keep working the matrix. The queue was empty, so the next evidence was the one the site now produces itself: two weeks after launch the Ubersuggest rank tracker (25 keywords, Vietnam, English, desktop, created 2026-10-14) returned its first positions. Search Console is still not connected in OpenSEO or OpenRush, so this is position data only, not clicks or traffic.

- **What the tracker says (snapshot 2026-10-14):** 15 of 25 tracked keywords already rank in the top 100: one at #3 (monthly motorbike rental Hanoi), four on page 1 (Old Quarter #4, deposit #8, Noi Bai airport #9, how much to rent #10), five at #11-#17 (50cc licence, tourist rental, expats, A1 licence, rental requirements), five deeper. The head terms (Hanoi motorbike rental, motorbike rental Hanoi, rent motorbike Hanoi, motorbike rental Vietnam) are not in the top 100 yet, as expected for a new domain with 23 referring domains. AI answers (OpenAI, 10 tracked prompts): the brand is not counted in any answer, but a spelling variant of the business name ("Nguyen Tu Hanoi Motorbike Rental") appears once at rank 2 for the monthly-rental-for-expats prompt; competitors such as Tigit, Style Motorbikes and Happy Zip are named for the where-to-rent prompt, and the licence prompts name no brand.
- **Engine:** the ingest engine reads the three Ubersuggest exports into `_tracking.rank_snapshots` and `ai_visibility_snapshots` (idempotent, history kept); the matrix uses the latest snapshot: positions 4-20 are P2 quick wins, a different URL ranking than the declared owner is a cannibalisation signal, a "Tracked rankings" table is added to the matrix, and a URL worked on in a rank_work batch waits for the next snapshot (so work is not re-raised from the same data). Thirteen tracked keywords without an owner were declared (`tracked: true`: served, never P1). 4 new engine tests (57 in total).
- **What the data showed about the site's own links:** the pages that rank are not always the declared owners. Eight owners were out-ranked by a neighbouring page (monthly rental, deposit, Noi Bai rental, price, 50cc licence, A1, expats, rental requirements), and several owners were barely linked (the Noi Bai arrival guide had one inbound link; the rental requirements guide three). Each pair now links both ways with natural anchors, the rental hub lists the Noi Bai guides, and the owners received links from the pages that already rank.
- **Hand work on the pages that already rank (11 pages):** 30 Common questions (FAQPage schema) whose answers restate OWNER-FACTS or the page itself (passport and deposit, Old Quarter, Noi Bai, tourist essentials, 50cc, tourists, expats, licence classes, group rental, daily/weekly/monthly, expats owner); four descriptions now carry the published daily rate or the deposit; Contact us links on the passport, Old Quarter and tourist guides; the VERIFIED licence pages gained navigation links and questions that restate their own text only. No price, policy, address or legal statement changed.
- **Results:** matrix P0 0 · P1 4 · P2 0 · P3 999 (the nine quick-win rows and the eight mismatches are marked worked until the 2026-10-21 snapshot); audits P0/P1 0, engine tests 57/57, Guide Assistant 31/31.

### What is left, and whose it is

1. Read the next snapshot (2026-10-21) and re-evaluate every URL worked on: positions that did not move after two snapshots point to authority, not on-page work, and then to link-prospects.md (owner-side outreach).
2. Connect Search Console in the OpenSEO project (https://app.openseo.so/p/aaa8663e-ba05-4f9a-b81e-cffe2053bdc8/settings/integrations) or in the OpenRush dashboard: the matrix then switches to DATA-DRIVEN mode and measures clicks and impressions.
3. The four REVIEW_REQUIRED articles, Google Business Profile and its NAP, and the "Nguyen Tu Hanoi Motorbike Rental" name variant in AI answers (use one spelling everywhere off-site).

## 2026-10-15 — Working the matrix: batch 6 (the first AI-answer check)

Brief: keep working the matrix. The rank tracker answers "where do we rank on Google"; the open question was whether the AI answer engines (Google AI Overviews, ChatGPT, Gemini) cite the site at all. Search Console is still not connected, so this is a measured sample of answers, not traffic.

- **What was run:** one OpenSEO AI-visibility check, United States, English, the same 10 renter and licence prompts the Ubersuggest AI tracker uses, on three engines (30 answers requested, 28 collected; both failures were Google AI Overviews, upstream unavailable). Estimated $0.18 (180 credits) before running, 158 credits actually used (483 to 325). A five-engine check (adding Claude and Perplexity, which are billed at live API prices) was estimated at 3,010 credits, above both the balance and the 2,000-credit confirmation threshold, so it was not run. The OpenSEO AI tracker that the check needs was created with its weekly schedule paused immediately (no recurring spend; a scheduled check would cost about 60 credits).
- **What the answers say:** this domain was cited as a source in 3 of 28 collected answers and its brand name was named in none. All three citations are ChatGPT: the tourist-rental answer cites the can-tourists guide (for the licence and IDP rules it states), the price answer cites the price guide (listed first among its sources), and the electric-bike answer cites the FAQ page. Gemini (10 answers) and Google AI Overviews (8 answers) cited the site in none. For the five licence prompts ChatGPT mostly cites official or primary sources (Vietnamese legal portals, the police and government news sites, an embassy page, a legal database); one rental-shop page appears among its sources for the IDP prompt, and none of the answers cites a licence guide of this site. Google AI Overviews lean on Facebook (8 of 8 collected answers list a Facebook page), YouTube, Reddit and Instagram; for the "which shop offers monthly rental for expats" prompt all three engines cite shop sites. ChatGPT's tourist answer lists four rental businesses with a star rating and a review count (269 to 2,057 reviews); the business is not among them.
- **Engine:** scripts/seo-research-ingest.js reads the export (doc type `openseo_ai_visibility`: results rows, cited sources by domain and by URL; extracted from the connector output) into a second `ai_visibility_snapshots` entry (idempotent, keyed by date and tool); the matrix prints "AI answers and citations" (prompt by engine table, pages of this site cited, most-cited domains) and adds the AI citation of a page to its evidence line; link-prospects.md lists the domains the engines cite and the AI line of its starting point. Pages cited by an AI answer carry a "keep its facts and answer-first text accurate and stable" note. 3 new engine tests (60 in total). Also repaired the local assistant-test emulation, which still read the FAQ include as a Liquid template after the FAQ moved to _data/faq.json (one junk FAQ unit instead of 52, so one case drifted to 30/31 locally; the production index tested by the Quality Gate was never affected and no assertion changed).
- **No content change in this batch.** The three cited pages were rebuilt a few minutes before the check (batch 5 FAQs, links and descriptions); engines may still hold older copies. Rewriting pages to chase one sample of answers would be guessing, so the work waits for the next measurement.

### What is left, and whose it is

1. Re-run the rank tracker read on 2026-10-21 and the monthly Ubersuggest AI-visibility read; repeat the OpenSEO AI-answer check (about 160 credits for three engines) after the next rank snapshot to see whether the batch 5 pages move from "not cited" to "cited". Do not re-enable the weekly AI schedule without the owner's approval.
2. Owner-only, and the AI data points at them: a complete Google Business Profile with genuine reviews (ChatGPT's local list for the tourist prompt is made of rated, reviewed businesses), one consistent spelling of the business name everywhere off-site, and a correct presence where the engines look (a Facebook page, YouTube, answers on community sites) restating only docs/OWNER-FACTS.md.
3. Search Console, the four REVIEW_REQUIRED articles and the off-site outreach in link-prospects.md remain with the owner.

## 2026-10-25 — SEO Package 2 (content depth 1600+): foundation

Brief (site owner): raise every existing article whose Markdown body has 300-500 words to at least 1,600 words of real content, in small verified batches, without new articles and without changing a URL, slug, permalink or canonical. The 1,600 figure is an editorial requirement of the owner, not a Google threshold.

- **Audit of the starting state (main 7fcfc73):** the shared counter `lib.contentWords` (Markdown body only; no front matter, code, HTML/Liquid, URLs or layout-generated components) measured all 981 articles: 172 below 300 words, **693 between 300 and 500**, 116 between 501 and 745, none above. The old matrix `words` metric (whitespace tokens including Markdown markers) put 725 articles in the same band; it is kept only for the legacy content-quality score. The 693 are frozen in `docs/seo/package2-baseline.json` (original word counts never change; all 981 starting counts are kept for a scope-drift check): Group A commercial 92, Group B informational 337, Group C supporting 264; matrix priority P3 for 692 and P1 for 1 (the already REVIEW_REQUIRED travel-insurance guide); SEO status OPTIMIZED 442, LINKS_REPAIRED 240, AUDITED 11; search intent informational 589, commercial 104. Fifteen of them already rank in the rank-tracker snapshot of 2026-10-14 and two are cited by AI answers, so their lead, title keyword and facts are preserved when they are expanded.
- **Tooling:** `scripts/seo-package2.js` (baseline `--init`, report and gate, `--write` for the eligible list and the dossier, `--next N` for the queue), the shared counter in `scripts/lib.js`, the matrix columns Original Words, Current Words and Package 2 (priority, status and indexability are untouched: a word count never flips OPTIMIZED), the Quality Gate step, build-report and maintenance integration, and 13 engine tests (73 in total). Blocking P1: a DONE article below 1,600 words, a changed slug/URL, a missing eligible article, a status entry outside the scope.
- **Data repair:** `docs/matrix/master-matrix.csv` row MM-0025 had a mid-word line wrap in its primary query ("best bike for ha / noi old quarter"); repaired to "best bike for hanoi old quarter" so the matrix and the Package 2 list carry the right keyword.
- **Rules recorded in AGENTS.md:** business facts only from OWNER-FACTS, legal facts only from primary sources, model figures only from the verified database or official pages; every added passage must be new and verifiable; unverifiable facts become REVIEW_REQUIRED with a reason; `last_reviewed` moves only after a real review; no completion claim for an unprocessed URL.
- **Queue:** Group A first (rental and monthly-rental guides, prices, districts, Honda Vision, scooter and 50cc rental, expat, tourist and teacher rentals), then Group B, then Group C; inside a group by matrix priority, keyword ownership and cluster. No article is processed yet at this point of the log: the first batch (5 articles) follows.

## 2026-10-25 — SEO Package 2, batch 1 (5 articles, Group A)

Brief: validate the whole pipeline on five Group A articles before scaling: write, independent verification, fix rounds, full QA, merge on green CI.

- **Articles (original -> final words):** `best-bike-for-hanoi-old-quarter` 378 -> 2,369; `renting-motorbike-tay-ho` 471 -> 2,387; `motorbike-delivery-long-bien` 403 -> 2,584; `renting-50cc-hanoi` 405 -> 2,185; `honda-vision-vs-yamaha-janus` 344 -> 2,376 (2,001 -> 11,897 words in total, +9,896). Same URL, slug and canonical; titles and descriptions unchanged; `last_reviewed` set to 2026-10-25 because an independent verifier really re-read each page against its sources that day.
- **How they were produced:** one writer per article (research with WebSearch and Firecrawl query-scrapes of primary pages, at most 3 per article), one independent verifier per article that tried to refute it (4 of 5 first drafts failed: 2 BLOCKERs in Tay Ho, 3 MAJORs in Long Bien, 1 MAJOR in 50cc, 2 MAJORs in Old Quarter), a fix round and a second verification. Old Quarter needed three rounds; its last fixes were applied from the third verifier's findings and checked by lint and QA, without a fourth independent pass. Cost of the 18-agent workflow: about 2.84 million subagent tokens and 27 minutes (2 agents in parallel).
- **What the verifiers caught:** invented specifics (bridge dimensions, hectares, distances), policies the owner never stated (a delivery person, a forecourt handover, a deposit return, an after-hours return, a test ride), unsourced generalisations ("most renters", "half the residents"), a list titled "ranked" whose order contradicted its own criterion, a legal-instrument attribution the cited page did not make, a quote strengthened from "can be a hectic place" to "is", and internal wording leaking into reader text. Each was removed, hedged or sourced.
- **New facts on the site, all sourced:** the low-emission zone pilot of 1 July 2026 (Zone 1 in the Hoan Kiem and Old Quarter area, 19:00-24:00 on Friday, Saturday and Sunday for the first phase to 31 December 2026; VietnamPlus and the Viet Nam Government Portal, read 2026-10-25), the Law 36/2024/QH15 Articles 33(2), 34(1)(g) and 59(1)(a)-(b) wording for 50cc mopeds (primary text), for the Vision and Janus comparison no new figure was added: the specification rows, the list prices (Vision 31,506,545 VND, Janus 29,151,000 VND) and the Janus warranty that were already on the page were re-read on the Honda and Yamaha pages and confirmed by the verifier, and the new sections only explain what those published figures mean.
- **Prices:** no weekly, monthly, 50cc or E-Bike price was added to any page; only the six consistent daily rates and the 2,000,000-5,000,000 VND deposit range appear (`docs/seo/price-reconciliation.md`, owner decision pending). `--lint` now lists any new such statement.
- **Original passages removed or reworded (all unsupported, contradictory or consolidated):** Old Quarter: the "ranked" order, "half the Old Quarter's residents", "the lightest steering", "15 km/h", "the compact models go first in peak season", the "slim bike fits lot rows a big scooter cannot" sentence (contradicted by the size table) and a typo; Long Bien: an invented deposit-stays claim, an after-hours return, "minutes away"; 50cc: "compulsory insurance is carried by the owner's fleet side" (conflicts with OWNER-FACTS) and the unsourced "never offered official new 50s"; Tay Ho: the "common delivery destination" sentence was softened (owner to confirm); Vision vs Janus: a bullet saying the Janus makes more torque "at lower revs" that contradicted the engine section.
- **Tooling gained from the batch:** lint now rejects internal process wording, unlinked guide references (the matrix rule moved into `lib.js` so both use it: three of the five pages had first been raised to P1/P2 by the matrix because the longer text contained descriptive guide references), more than 4 new `internal_link_targets` and a separator the layout cannot split; it lists every new numeric claim for confirmation; the writing guide has a "lessons from batch 1" section. 83 engine tests.
- **QA on the exact tree:** build-report P0 0 / P1 0; matrix P0 0 · P1 4 · P2 0 · P3 999 (unchanged: no priority or status moved); engine tests, regression guard, Jekyll build (1,004 pages) and rendered audit P0/P1 0; Guide Assistant 31/31; duplicate check P2 0. `assistant-index.json` grew from 4,433,054 to 4,538,312 bytes (+105 KB for five pages, about 21 KB per expanded article): at that rate 693 expanded articles would take it to roughly 19 MB, which is a risk for the lazily loaded assistant on phones and should be reviewed by the owner before the package nears completion.
- **Findings for the owner (not fixed here):** `do-electric-motorbikes-need-insurance-vietnam` (Package 2 queue 387) and `do-you-need-insurance-for-50cc-vietnam` (out of scope, unchanged) state that renters rely on the shop's fleet insurance cover, which conflicts with OWNER-FACTS (the business provides no insurance); `hoan-kiem-walking-street-motorbike-visitors` (Package 2 queue in Group C) says to ride in and park but does not mention the Zone 1 evening restriction; `scooter-vs-semi-automatic-hanoi` says scooters are "a bit wider than an underbone in the tightest alleys", but the published Vision width (686 mm) is below the Wave Alpha (689 mm); the Vision row of `docs/MODEL-DATABASE.md` is column-shifted (97 kg under "brakes", front wheel under "storage"); the price differences in `docs/seo/price-reconciliation.md`.
- **Status:** 5 of 693 done, 0 REVIEW_REQUIRED, 688 pending. Rollback: `rollback/pre-package2-foundation` (main 7fcfc73) before the foundation; the pre-merge head of main is recorded in the pull request.


## 2026-10-25 — SEO Package 2, batch 2 (10 articles, Group A)

Brief: continue Package 2 in queue order with the procedure of `docs/seo/package2-agent-prompts.md` (writer, independent verifier, fixer, delta verifier), full QA, merge on green CI.

- **Articles (original -> final words):** `how-to-book-a-motorbike-rental-hanoi` 361 -> 2,156; `how-to-rent-a-motorbike-hanoi` 498 -> 1,890; `motorbike-rental-pickup-or-delivery-hanoi` -> 1,882; `renting-motorbike-hoan-kiem` 437 -> 2,153; `renting-motorbike-noi-bai-arrival` 476 -> 2,174; `automatic-vs-manual-motorbike-hanoi` -> 2,410; `best-scooters-to-rent-hanoi` 302 -> 2,064; `first-time-renting-a-motorbike-hanoi` 410 -> 2,292; `motorbike-delivery-old-quarter` 422 -> 2,205; `can-foreigners-rent-a-motorbike-hanoi` 378 -> 1,855 (4,006 -> 21,081 words in total). Same URLs, slugs and canonicals.
- **Verification:** every article had an independent verifier; five first drafts failed with MAJOR findings (implied shop policies and repetition in pickup-or-delivery, repetition in Noi Bai, an overstated accident-duty sentence in first-time renting, a wrong passenger exception in best scooters, the Article 57 licence list in can-foreigners) and passed a delta verification after a fix round; one more MAJOR (an FAQ contradicting the page in automatic-vs-manual) was replaced with the verifier's wording. The delta verifier of best scooters caught a second legal error introduced by the fix itself ("child under 14 with an adult").
- **Legal correction found on the way:** Law 36/2024/QH15 Article 33(1)(c) allows a child **under 12** as the second passenger, with no adult condition; `motorbike-passenger-rules-vietnam` and `child-passengers-motorbike-vietnam` (both VERIFIED) said "under 14 with an adult", the rule of the old law. Corrected against the Government page both cite (re-read 2026-10-25).
- **Fines not restated:** Decree 238/2026/ND-CP, in force since 15 August 2026, amends Decree 168/2024/ND-CP; its amended Article 18 could not be read, so the can-foreigners guide states no fine amounts and points to the fine guides. The VERIFIED legal guides that quote Decree 168/2024 amounts as issued need a re-check against the amendment (owner task, listed below).
- **Prices:** only the six consistent daily rates and the 2,000,000-5,000,000 VND deposit range; no weekly, monthly, 50cc or E-Bike price was added.
- **QA on the exact tree:** lint 0 errors on all ten; build-report P0 0 / P1 0 (P2 5: the four REVIEW_REQUIRED articles and the 404 page without breadcrumbs, both pre-existing); matrix P0 0 · P1 4 · P2 0 · P3 999 (no priority moved); engine tests 83/83; regression guard PASS; Jekyll build 1,004 pages; rendered audit P0/P1 0; Guide Assistant 31/31; duplicate check P2 0.
- **Findings for the owner:** listed in the batch notes in `docs/seo/package2-status.json` (Zone 1 wording in two Hoan Kiem articles and the Old Quarter rental guide, helmet and insurance statements beyond OWNER-FACTS, deposit-return promises, IDP fine labels, the Decree 238/2026 amendment, two model-database rows).
- **Status:** 15 of 693 done, 0 REVIEW_REQUIRED, 678 pending.

## 2026-10-25 — Hanoi motorbike rental: keyword owner, GitHub SEO techniques, link graph

Brief (site owner, "Claude Ultra Master Mission"): research the best open-source SEO tooling on GitHub, adopt what fits this pipeline, and make the site compete for "Hanoi motorbike rental" and its variants, in small verified batches, zero-data mode, no URL changes.

- **Research (docs/seo/research/github-seo-skills.md):** 32 repositories compared (stars, forks, licence and activity as read 2026-10-25; rows not opened say "not read"), nine studied in depth. Adopted as ideas and published algorithms, written independently: rendered link-graph reachability and click depth (orphan-beacon, squirrelscan; MIT), PageRank over the internal link graph (WebKnoGraph; Apache-2.0), llms.txt integrity (geo-optimizer-skill; MIT). Not adopted: content generation, ML auto-linking, paid-API platforms, any third-party skill or MCP server install.
- **Engine (tests 83 -> 96):** `lib.clickDepth`, `lib.pageRank`, `lib.percentileRanks`, `lib.elementRanges`, `lib.renderedLinkGraph`, `lib.llmsTxtFindings`. Rendered audit on the built site (MEASURED 2026-10-25): 1,004 pages, 63,607 internal links (51,130 navigation, 5,548 related cards, 3,938 in-body, 1,968 listings), every sitemap page reachable from the home page, click depth 0/1/2 for 1/35/967 pages, no dead ends; the depth guard is set to the measured 2. The English-only rule of AGENTS.md is now a blocking test. Topical map: contextual PageRank percentiles and P3 money-page-equity recommendations (23 at introduction). Sitemap check: llms.txt links and counts; it caught "981 verified guides" while 4 articles are REVIEW_REQUIRED, now "981 guides".
- **Keyword owner:** "Hanoi motorbike rental" (plus motorbike rental Hanoi, rent motorbike Hanoi, motorcycle rental Hanoi, motorbike hire Hanoi, best motorbike rental Hanoi) moved from /topics/rental/ to `/`. Evidence: MEASURED OpenSEO SERP read on 2026-10-25 (Vietnam, English, desktop, top 100): the organic top 10 for "motorbike rental hanoi" is mostly rental-shop home pages plus listings (Riderly, Tripadvisor) and guides, as in the OpenRush snapshots of 2026-10-14 (which also show a local pack); en.rentbikehanoi.com is not in the top 100 for "hanoi motorbike rental", "motorbike rental hanoi" or "scooter rental hanoi" (rentbikehanoi.com, another domain, sits at #40 and #37 for the last two). The home page holds the LocalBusiness entity and the site-wide navigation equity, so it is the page best placed for a shop-intent query (INFERRED). "Rent motorbike Hanoi" is INFERRED to share the SERP of "motorbike rental hanoi".
- **Data fix:** the rank-tracker ingest stored ranking URLs without their host, so the 2026-10-14 rows with url "/" (#63 scooter rental hanoi, #65 electric bike rental hanoi) may be another domain's home page; they are now marked UNKNOWN in the matrix, and future snapshots keep the full address of any other domain and leave it out of this site's bands (test added). The Ubersuggest project for en.rentbikehanoi.com no longer exists in the connected account and OpenRush has no credits left, so no new rank snapshot could be taken (blockers for the owner).
- **On-page:** home page title "Hanoi Motorbike Rental Nguyen Tu: Rates, Booking and Guides" (59 characters), meta description, H1 "Hanoi motorbike rental and riding guides", and an answer-first rental summary (address, hours, the six published day rates and the E-Bike rate, deposit range, booking channels, payment, delivery wording, insurance, licence pointer) with links to the rental money pages, all from OWNER-FACTS; the hub is retitled "Hanoi Rental Guides: Prices, Deposits, Documents, Returns" and links the home page; llms.txt lists both. Contextual links to `/` from the price, deposit and monthly guides (and the pickup-or-delivery guide in Package 2 batch 2): the home page sat at the 35th percentile of contextual link equity with 3 in-body inbound links.
- **Not claimed:** no ranking change is claimed; the next rank snapshot and a Search Console export are the only evidence that will count.

## 2026-10-25 — SEO Package 2, batch 3 (10 articles, Priority A rental money pages)

Brief: the keyword mission's Priority A money pages (long-term terms, return, inspection, problems, inclusions, audience pages), same procedure as batch 2, full QA, merge on green CI.

- **Articles (original -> final words):** `renting-motorbike-six-months-hanoi` 497 -> 1,941; `three-month-motorbike-rental-hanoi` 375 -> 1,992; `returning-a-rental-motorbike-hanoi` 339 -> 2,413; `expats-monthly-motorbike-hanoi` 304 -> 2,003; `renting-motorbike-year-hanoi` 403 -> 1,706; `rental-motorbike-inspection-checklist` 341 -> 2,445; `common-motorbike-rental-problems-hanoi` 406 -> 1,878; `what-is-included-motorbike-rental-hanoi` 350 -> 2,098; `motorbike-rental-english-teachers-hanoi` 445 -> 2,109; `motorbike-rental-international-students-hanoi` 439 -> 2,051 (3,899 -> 20,636 words in total). Same URLs, slugs and canonicals; no title changed; four descriptions changed with recorded reasons.
- **Verification:** every article had an independent verifier; four passed on the first round with MINOR findings, six failed with MAJOR findings (a restating planning calendar in the year guide, unverified Click/Mio specifications in the inspection checklist, the registration certificate stated as travelling with the bike, shop insurance implied, sibling passages copied near-verbatim in the teachers and students pages, a mis-stated moped definition) and passed a delta verification after a fix round.
- **Cross-article rule:** OWNER-FACTS does not say whether the registration certificate travels with a rental bike and the VERIFIED police-impound guide says it stays with the owner, so every batch-3 page asks at handover which registration papers travel with the bike (the original or a certified copy).
- **Sources:** Firecrawl ran out of credits during the batch; primary-text reads continued with Tavily extract (Law 36/2024/QH15 Articles 34(1)(g), 56(1)(d), 57 and 59(1)(a); Circular 12/2025/TT-BCA Article 24(1)). The procedure documents now name that fallback. No fine amounts are stated (Decree 238/2026/ND-CP amends Decree 168/2024/ND-CP).
- **Prices:** only the published daily rates and the 2,000,000-5,000,000 VND deposit range; no weekly, monthly, 50cc or E-Bike price was added.
- **QA on the exact tree:** lint 0 errors on all ten; build-report P0 0 / P1 0 (P2 5, pre-existing); matrix P0 0 · P1 4 · P2 0 · P3 999; engine tests 83/83; regression guard PASS; Jekyll build 1,004 pages; rendered audit P0/P1 0; Guide Assistant 31/31; duplicate check P2 0.
- **Findings for the owner (not edited; outside the batch):** articles that state insurance carried by the shop (`compulsory-motorbike-insurance-vietnam`, `is-insurance-included-motorbike-rental-hanoi`, `theft-loss-responsibility-rental-motorbike-hanoi`) or helmets as standard (`do-hanoi-rentals-include-helmets`, `helmet-law-vietnam`, `best-motorbike-for-students-hanoi`); maintenance "included" or a returning deposit (`long-term-renting-vs-buying-residents-hanoi`, `motorbike-rental-expats-moving-hanoi`); an implied one-week trial (`commuting-by-motorbike-monthly-hanoi`) and an implied rider-named agreement (`students-semester-motorbike-rental-hanoi`); the Article 56 sentence in three insurance guides (Article 56(1)(d) lists the owner's insurance certificate among documents a driver carries); `foreign-licence-exchange-vietnam` (passport in the dossier, fine amounts) and `foreign-student-motorbike-licence-vietnam` (dormitory registration instead of a residence card); `hanoi-university-areas-riding-guide` (moped age 18, the law says 16); `motorbike-required-equipment-vietnam` versus `police-impound-motorbike-vietnam` on where the registration copy is (and the impound guide's reading of Decree 168 Article 48); the Honda Vision row of `docs/MODEL-DATABASE.md` (empty fields while articles quote the manufacturer page) and the dead Yamaha Sirius RC URL; the Yamaha Sirius day rate (approved in OWNER-FACTS but absent from the owner's 2026-10-25 reference table).
- **Review corrections (Codex, PR #7):** Law 36/2024/QH15 Article 56, re-read 2026-10-25, accepts a certified copy of the registration certificate only for a vehicle mortgaged to a credit institution with its original confirmation (56(1)(a)), lists the owner's compulsory insurance certificate among the documents a rider carries (56(1)(d)) and allows electronic identification accounts (56(3)); Circular 12/2025/TT-BCA Article 24(5)(a) limits a licence exchanged for a foreigner to the residence-card and foreign-licence term. The batch-3 pages and `documents-to-carry-motorbike-vietnam` were corrected; writing-guide section 10 records the rules. Still to correct (owner or a later batch): "registration copy" advice in `50cc-pre-ride-checklist`, `electric-motorbike-fines-vietnam`, `motorbike-required-equipment-vietnam`, `motorbike-trip-prep-checklist-hanoi` and `documents-needed-rent-motorbike-hanoi`; "never expire" without the exchanged-licence limit in `motorbike-licence-validity-renewal-vietnam` and `expired-licence-fine-vietnam`.
- **Status:** 25 of 693 done, 0 REVIEW_REQUIRED, 668 pending.

## 2026-10-25 — SEO Package 2, batch 4 (10 articles, Priority A choosing and riding pages)

Brief: the next Priority A queue items (renting versus buying, scooter versus semi-automatic, parking, and the best-bike pages for commuting, tall riders, English teachers, day trips, Hanoi traffic, long distance and students), same procedure, full QA, merge on green CI.

- **Articles (original -> final words):** `renting-vs-buying-a-motorbike-hanoi` 326 -> 2,036; `scooter-vs-semi-automatic-hanoi` 343 -> 2,309; `where-to-park-motorbike-hanoi` 490 -> 2,170; `best-motorbike-for-commuting-hanoi` 317 -> 2,174; `best-motorbikes-for-tall-riders-vietnam` 304 -> 2,215; `best-bike-for-english-teachers-hanoi` 317 -> 1,907; `best-motorbike-for-day-trips-from-hanoi` 322 -> 2,221; `best-motorbike-for-hanoi-traffic` 372 -> 2,083; `best-motorbike-for-long-distance-vietnam` 349 -> 2,398; `best-motorbike-for-students-hanoi` 327 -> 1,980 (3,467 -> 21,493 words in total). Same URLs, slugs and canonicals; no title changed; four descriptions changed with recorded reasons.
- **Verification:** every article had an independent verifier and every first draft needed a fix round (unsourced purchase prices, width and cost claims the model data refutes, an unread Decree 168 holding passage, near-verbatim passages from sibling pages, an incomplete moped definition, implied shop processes for trips out of Hanoi); each passed a delta verification.
- **Legal reads (Tavily, 2026-10-25):** Law 36/2024/QH15 Articles 13, 34(1)(g), 34(2)(b), 56, 57, 59 and 89; Circular 12/2025/TT-BCA Article 24; Circular 38/2024/TT-BGTVT Article 6 (speed limits); the Official Gazette record of Decree 238/2026/ND-CP (in force 15 August 2026, amending Decree 168/2024; amended text not read, so no fine amounts).
- **Business limit:** the day-trip and long-distance pages state that support is primarily for Hanoi and local use and ask the shop before booking; nothing implies rescue, delivery outside Hanoi, one-way rental or a touring package.
- **Prices:** only published daily rates and the deposit range in new text; two original sentences that carry a monthly figure (commuting) or the E-Bike day rate (students) keep those figures verbatim (price-reconciliation rule 2).
- **QA on the exact tree:** lint 0 errors on all ten; build-report P0 0 / P1 0; matrix P0 0 · P1 4 · P2 0 · P3 999; engine tests 98/98; regression guard PASS; Jekyll build 1,004 pages; rendered audit P0/P1 0, max click depth 2; Guide Assistant 31/31; duplicate check P2 0.
- **Findings for the owner (not edited):** `what-to-carry-riding-motorbike-vietnam` (helmet and toolkit "normally" included); `expat-motorbike-licence-vietnam` (exchanged classes "with no expiry date", against Circular 12/2025 Article 24(5)(a)); `ha-giang-loop-motorbike-guide` and `hue-motorbike-trip-hanoi` (invite 1,000 km round trips on a Hanoi rental); `motorbike-speed-limits-vietnam` (cites Circular 31/2019, replaced by Circular 38/2024 from 1 January 2025); `xe-dap-mai-rules-vietnam` and `electric-bike-licence-vietnam` disagree on a pedal e-bike age; `rental-motorbike-outside-hanoi` ("shops that forbid it", "commonly restrict", unsourced); the GitHub repository setting that stops the weekly maintenance workflow from opening its safe-fix PR ("GitHub Actions is not permitted to create or approve pull requests"); the shared Lychee and Lighthouse concurrency groups cancel runs across pull requests.
- **Status:** 35 of 693 done, 0 REVIEW_REQUIRED, 658 pending.

## 2026-10-25 — SEO Package 2, batch 5 (10 articles, Priority A rental problem and audience pages)

Brief: the next Priority A queue items (lost key, puncture, loose chain, outside repairs, high mileage, fuel policy, the easiest and lightest bikes for beginners, digital nomads, female riders), same procedure, full QA, merge on green CI.

- **Articles (original -> final words):** `lost-key-rental-motorbike-hanoi` 338 -> 1,766; `punctured-tyre-on-rental-motorbike` 333 -> 2,031; `easiest-motorbikes-for-beginners-hanoi` 371 -> 2,107; `lightest-motorbikes-for-new-riders` 337 -> 1,906; `loose-chain-on-rental-motorbike` 348 -> 2,342; `outside-repair-shops-rental-motorbike` 342 -> 2,267; `high-mileage-rental-motorbike-inspection` 364 -> 2,053; `motorbike-rental-fuel-policy-hanoi` 364 -> 1,900; `motorbike-rental-digital-nomads-hanoi` 488 -> 1,811; `motorbike-rental-female-riders-hanoi` 466 -> 2,033 (3,751 -> 20,216 words in total). Same URLs, slugs and canonicals; no title changed.
- **Verification:** every article had an independent verifier; nine needed a fix round and passed a delta verification, female riders passed on the first verification. Typical first-draft failures: implied shop rules (a lost-key charge, a fuel rule, records the shop keeps, helmets included), unsourced wear and mileage predictions, a duplicated illustrative scenario between sibling pages, over-budget link sets and near-verbatim licence passages shared with sibling pages.
- **Primary and manufacturer reads (2026-10-25, TinyFish and Tavily; Firecrawl had no credits):** Law 36/2024/QH15 (Articles 33, 34(1)(g), 56, 57, 59), Circular 12/2025/TT-BCA Article 24; the Honda Vietnam owner's manuals for the Wave Alpha and the AFS110 models (chain slack 25-35 mm and 30-40 mm, do not ride beyond 50 mm; octane RON 91 or higher for the Vietnam type; ethanol 10% or less; fill limit); the UK FCDO Vietnam travel advice (bag-snatching, motorbike risk), quoted as foreign travel advice, not as Vietnamese law.
- **Business limits:** OWNER-FACTS wording for maintenance ("may include"), consumables, the ~1,500 km owner guidance and Hanoi/local support; fuel arrangements, lost keys, outside repairs and helmets are written as handover questions because OWNER-FACTS states no rule for them.
- **Prices:** only published daily rates and the deposit range in new text; two original sentences that carry the E-Bike day rate (lightest) or monthly figures (digital nomads) keep those figures verbatim (price-reconciliation rule 2).
- **QA on the exact tree:** lint 0 errors on all ten; build-report P0 0 / P1 0; matrix P0 0 · P1 4 · P2 0 · P3 999 (the same four P1 rows as before); engine tests 98/98; regression guard PASS; Jekyll build 1,004 pages; rendered audit P0/P1 0, max click depth 2, unreachable 0; Guide Assistant 31/31; duplicate check P2 0.
- **Findings for the owner (not edited):** `motorbike-rental-deposit-hanoi` and `how-deposit-returns-work-hanoi` treat a lost key as a deposit deduction, and the latter's description promises the deposit back in cash with no deductions (OWNER-FACTS states neither); `inner-tubes-vs-tubeless-motorbike` ("overwhelmingly tube-type", unsourced); `motorbike-rental-price-hanoi` ("Fuel is the renter's") and `most-fuel-efficient-scooters-vietnam-verified` ("Rental fuel is your cost"), OWNER-FACTS states no fuel rule; `rental-motorbike-fuel-what-petrol` (Wave and Sirius "designed around RON95", the Wave Alpha manual lists RON 91 or higher for the Vietnam type); `rental-motorbike-inspection-checklist` (refers to "two conventions", the fuel page now describes three); `rental-motorbike-breakdown-hanoi` and `rental-motorbike-feels-wrong` (unsourced shop behaviour); `do-hanoi-rentals-include-helmets`, `helmet-law-vietnam` and `what-to-carry-riding-motorbike-vietnam` (helmets or a toolkit included as standard, not in OWNER-FACTS; a child-age claim not in Article 33); `carrying-luggage-motorbike-safely-vietnam` versus `what-to-carry-riding-motorbike-vietnam` (cross-body bags). Price decisions still open in `docs/seo/price-reconciliation.md` (including the homepage E-Bike and Yamaha Sirius day-rate cards).
- **Status:** 45 of 693 done, 0 REVIEW_REQUIRED, 648 pending.

## 2026-10-27 — SEO Package 2, batch 6 (10 articles, Priority A rental problem and season pages)

Brief: the next Priority A queue items (a bike that feels wrong, breakdowns, riding outside Hanoi, which petrol, couples, what to carry, complete beginners, Tet, the rainy season, winter). Same procedure, full QA, merge on green CI. The five district pages (`renting-motorbike-ba-dinh`, `-cau-giay`, `-dong-da`, `-hai-ba-trung`, `-thanh-xuan`) are held for a dedicated batch: expanding them with shared text would create near-duplicate doorway pages, and each needs district facts that can be verified.

- **Articles (original -> final words):**
  - `rental-motorbike-feels-wrong` 336 -> 2,081
  - `rental-motorbike-breakdown-hanoi` 413 -> 2,030
  - `rental-motorbike-outside-hanoi` 446 -> 2,187
  - `rental-motorbike-fuel-what-petrol` 452 -> 2,117
  - `renting-motorbike-couple-hanoi` 476 -> 1,876
  - `what-to-carry-riding-motorbike-vietnam` 428 -> 1,671
  - `renting-motorbike-hanoi-complete-beginner` 478 -> 1,898
  - `renting-motorbike-hanoi-tet-holidays` 494 -> 2,081
  - `renting-motorbike-hanoi-rainy-season` 403 -> 1,845
  - `renting-motorbike-hanoi-winter` 426 -> 1,919
  - Total: 4,352 -> 19,705 words.
- **URLs, titles and descriptions:**
  - Same URLs, slugs and canonicals. No title or H1 changed.
  - Three descriptions changed, each for a recorded reason:
    - feels-wrong: the old description told riders to "ride it straight back" with soft brakes, which contradicts the page's stop-and-call list.
    - breakdown: the old description stated a shop-pays policy that OWNER-FACTS does not publish.
    - fuel-what-petrol: the old description said "RON95 vs other grades". The new one names the E10 RON 95-III and E5 RON 92 grades on sale.
- **Verification:**
  - Every article went through writer, independent verifier, fixer and delta verifier.
  - Typical first-draft failures:
    - implied shop rules (who pays for a breakdown, helmets included, a replacement bike the same day);
    - unsourced weather and traffic patterns (afternoon storms "20-40 minutes", "Hanoi empties at Tet");
    - "RON 95 is the standard grade";
    - the learner rules ignoring the licence-free moped class;
    - legal articles cited to the wrong clause (IDP recognition is Art. 57(6)(b); 57(8)(b) is the carrying duty).
  - Retention after the fixes: 62-75% of original sentences, lint 0 errors on all ten.
- **Primary, manufacturer and official reads (2026-10-25 to 2026-10-27):**
  - Law 36/2024/QH15: Articles 20(1), 21(1), 25(3), 33, 34(1)(g), 56, 57(6)(b) and 57(8)(b), 59(1)(a), 80.
  - Circular 12/2025/TT-BCA, Article 24(5)(a).
  - Circular 38/2024/TT-BGTVT: speed tables, following distance and built-up area signs.
  - Honda Vietnam owner's manuals:
    - Wave Alpha (AFB110MD): RON 91 or higher for the Vietnam type; ethanol 10% or less; choke bands 10-35°C; fuel valve ON/OFF only; against jump-starting from a car battery; document pouch.
    - Vision (NSC110).
  - Ministry of Industry and Trade notices of 28 May and 22 October 2026, and the Government portal of 1 June 2026: E10 RON 95-III and E5 RON 92.
  - WMO Hanoi climatology 1991-2020 and the ADB/World Bank climate risk country profile.
  - Labour Code consolidated text (Art. 111(3), 112).
  - The Government portal report of 22 October 2026 on notice 11483/TB-BNV: the Tet 2027 civil-service break is 4-10 February; the first day of Tet falls on Saturday 6 February.
  - UK FCDO travel advice, quoted as foreign advice, not as Vietnamese law.
- **Business limits:**
  - OWNER-FACTS wording for maintenance ("may include"), consumables, the ~1,500 km guidance, local support, no 24/7 rescue and the late-return charge.
  - Helmets, the registration and insurance papers, fuel level and the Tet opening days are written as handover questions, because OWNER-FACTS states no rule for them.
- **Prices:** no new price figure. Published daily rates and the deposit range appear only where already published.
- **QA on the exact tree:**
  - build-report P0 0 / P1 0.
  - Matrix P0 0, P1 4, P2 0, P3 999 (the same four P1 rows as before).
  - Duplicate check P2 0, with no body-overlap finding.
  - Engine tests 98/98; regression guard PASS.
  - Jekyll build 1,004 pages; rendered audit P0/P1 0, max click depth 2, unreachable 0.
  - Guide Assistant 31/31; Package 2 gate blocking 0.
- **Findings for the owner (not edited):**
  - Fines quoted without a read of the amended penalty decree (Decree 238/2026 not read):
    - `motorbike-passenger-rules-vietnam`: 400,000-600,000 VND.
    - `motorbikes-on-expressway-vietnam`: 4-6 million VND.
    - `rental-motorbike-inspection-checklist` and `riding-rental-motorbike-hanoi-rain`: unlit riding and a missing mirror.
  - `motorbike-speed-limits-vietnam` still cites Circular 31/2019. Circular 38/2024 replaced it from 1 January 2025, with the same values.
  - `dead-battery-motorbike-vietnam` says car-to-bike jump starts work. The Wave Alpha manual advises against jump-starting from a car battery.
  - Petrol grades:
    - `hanoi-petrol-stations-guide-riders` and `fuel-grades-petrol-stations-vietnam` still call RON 95 the standard grade.
    - `motorbike-rental-fuel-policy-hanoi` omits the E10/E5 timeline.
  - Deposit and return terms that OWNER-FACTS does not state:
    - `early-return-rental-motorbike-hanoi`: deposit "returned in full, on the spot", and a weekly price that sits in an open price-reconciliation cell.
    - `how-deposit-returns-work-hanoi`: cash back on the spot.
    - `late-return-rental-motorbike-hanoi`: after-hours returns agreed in advance.
  - Weather claims:
    - `riding-rental-motorbike-hanoi-rain`: storms of 20-40 minutes and wet drum brakes that "grab", both unsourced.
    - `winter-riding-motorbike-hanoi`: "12-17 C" and "weeks of drizzle", against the WMO averages.
    - `hanoi-riding-seasons-guide`: winter as December-January, against the WMO averages.
  - `scooters-with-usb-c-charging-verified` says the Vision lists no charging port. The Honda Vietnam Vision page lists USB-C.
  - `idp-vietnam-motorbike-rules` cites Article 57(8) for IDP recognition. Recognition is in 57(6)(b).
  - `motorbike-learner-permit-vietnam` ignores the licence-free moped class.
  - Owner facts not published for these claims:
    - `best-motorbike-for-two-people-hanoi`: both helmets fit in the Vision's box.
    - `motorbike-trip-prep-checklist-hanoi`: distance limits and the frequency of police checks.
    - The helmet, compulsory-insurance and required-equipment guides: helmets included, the shop carries insurance, a registration copy kept under the seat.
  - Still open from batch 5: `do-hanoi-rentals-include-helmets`, `helmet-law-vietnam`, and the price decisions in `docs/seo/price-reconciliation.md`.
- **Status:** 55 of 693 done, 0 REVIEW_REQUIRED, 638 pending.

## 2026-10-27 — SEO Package 2, batch 7 (10 articles, riding in rain and the monthly-rental cluster)

Brief: the next Priority A queue items, riding a rental in rain plus nine monthly-rental pages (delivery and pickup, electric bikes, breakdowns, choosing a bike, commuting, high mileage, learning to ride, maintenance, a term through Tet). Same procedure, full QA, merge on green CI. Held back:
- the monthly and weekly price pages (owner price decision pending in `docs/seo/price-reconciliation.md`);
- `extending-motorbike-rental-hanoi` (a measured ranking URL, protected);
- `english-teachers-monthly-motorbike-hanoi` (overlap with the batch-3 teacher page);
- the five district pages (doorway risk).

- **Articles (original -> final words):**

  | Article | Before | After |
  |---|---|---|
  | `riding-rental-motorbike-hanoi-rain` | 425 | 1,921 |
  | `delivery-pickup-monthly-rental-hanoi` | 317 | 1,840 |
  | `e-bike-monthly-rental-hanoi` | 313 | 2,470 |
  | `breakdowns-during-long-term-rental-hanoi` | 307 | 2,268 |
  | `choosing-motorbike-monthly-rental-hanoi` | 331 | 2,317 |
  | `commuting-by-motorbike-monthly-hanoi` | 322 | 2,186 |
  | `high-mileage-monthly-rental-hanoi` | 322 | 2,215 |
  | `learning-to-ride-monthly-rental-hanoi` | 333 | 2,362 |
  | `maintenance-during-monthly-rental-hanoi` | 372 | 2,389 |
  | `monthly-rental-through-tet-hanoi` | 332 | 2,182 |
  | **Total** | **3,374** | **22,150** |

  Same URLs, slugs and canonicals. No title, H1 or description changed.
- **Verification:** every article had an independent verifier.
  - Riding-rain and learning-to-ride passed the first verification with MINORs.
  - The other eight needed a fix round and a delta verification.
  - For e-bike, commuting and through-tet, the lead applied the delta verifier's exact replacement text.
  - Typical first-draft failures:
    - implied shop rules (who collects a bike, what a mid-term check covers, a charger supplied, a slipped collection window charged as late return);
    - repetition inside the page and 8-word runs copied from sibling pages;
    - a fuel-economy ranking stated in the wrong order;
    - a feature treated as missing because a manufacturer page did not list it;
    - a regulation amendment cited as in force before its effective date.
- **Legal currency checks (read 2026-10-27, primary texts):**
  - **Licence circular:** Circular 108/2026/TT-BCA (Official Gazette, in force 1 July 2026) replaced Circular 12/2025/TT-BCA (Article 41(6)). Article 24(5)(a) keeps its number. The documents it points to now include a visa or temporary residence card valid for 90 days or more. The IDP articles are now 27-30. The writing guide is updated.
  - **Law 36/2024/QH15:** amended by Law 118/2025/QH15 from 1 July 2026. The clauses this site cites are unchanged (consolidated text 55/VBHN-VPQH).
  - **QCVN 04:2021/BXD:** its charging-area provisions arrive through Amendment 01:2026 (Circular 31/2026/TT-BXD), in force 15 December 2026.
- **Other sources:**
  - Circular 38/2024/TT-BGTVT.
  - Honda Vietnam Wave Alpha and Vision owner's manuals.
  - Honda Vietnam model pages and MODEL-DATABASE rows.
  - MoIT notices of 22 October 2026 and 10 February 2026.
  - Government portal reports of 2 July 2026 (Zone 1) and 22 October 2026 (Tet 2027).
  - Ministry of Public Security charging advice of 25 July 2023.
  - WMO Hanoi 1991-2020.
- **Business limits:**
  - OWNER-FACTS wording only: maintenance "may include", consumables "may be the renter's responsibility", ~1,500 km owner guidance, local support, no 24/7 rescue, late return 20,000 VND per hour, no automatic refund for early return, no insurance from Nguyen Tu.
  - Delivery, swaps, mid-term checks, chargers, Tet opening days and renewals are questions to ask.
- **Prices:** no new price figure, no electric price, and no weekly or monthly figure in new text.
- **QA on the exact tree:**
  - lint 0 errors on all ten (retention 64-100%);
  - build-report P0 0 / P1 0;
  - matrix P0 0 · P1 4 · P2 0 · P3 999 (the same four P1 rows);
  - duplicate check P2 0, no body overlap;
  - engine tests 98/98;
  - regression guard PASS;
  - Jekyll build 1,004 pages;
  - rendered audit P0/P1 0, max click depth 2, unreachable 0;
  - Guide Assistant 31/31;
  - Package 2 gate blocking 0.
- **Findings for the owner (not edited):**
  - **Legal currency (high priority):**
    - 24 articles cite Circular 12/2025/TT-BCA as current. It was replaced on 1 July 2026. The list is kept with the batch records, and a reviewed correction batch is needed.
    - Pages naming the Ministry of Transport in licensing or citing Law 36 Article 62(7) (repealed) need review.
  - **Electric bikes:**
    - `charging-safety-home-electric-bike` and `electric-motorbike-commuting-hanoi` advise overnight charging. The Ministry of Public Security advice says not to charge overnight or when no adult is home.
    - `e-bike-helmet-rules-vietnam` cites Article 33(2) for pedal e-bikes; the rule is Article 31(3).
    - `electric-motorbike-power-kw-licence-vietnam` puts a 30 km/h model in the pedal-assist class; the limit is 25 km/h.
    - `can-foreigners-rent-electric-bike-vietnam` omits the 50 km/h design-speed condition.
  - **Vision features:** `stop-and-start-scooters-explained` and `best-motorbike-for-commuting-hanoi` say the Vision has no stop-start. Honda's Vision page lists idling stop.
  - **Insurance and storage:**
    - `best-motorbike-for-expats-hanoi` tells riders to carry the bike's insurance (OWNER-FACTS: no insurance from Nguyen Tu).
    - `automatic-or-semi-automatic-monthly-hanoi` calls semi-automatics lighter and more fuel-efficient (1 kg and 0.1 L/100 km on Honda's figures).
  - **Rainy season:** `best-scooters-rainy-season-commuting-vietnam` says the season lasts about four months.
  - **Deposits:** `switching-bikes-mid-rental-hanoi` describes deposit handling not in OWNER-FACTS.
  - **Ride-hailing:** `monthly-rental-vs-ride-hailing-hanoi` gives an unsourced crossover.
  - **Unsourced figures:**
    - `hanoi-motorbike-commute-corridors`: peak hours.
    - `tet-holiday-motorbike-travel-vietnam`: "half of all shops close", "fuel stations mostly stay open".
  - **Still open from batches 5 and 6:** the price decisions in `docs/seo/price-reconciliation.md`.
- **Status:** 65 of 693 done, 0 REVIEW_REQUIRED, 628 pending.
