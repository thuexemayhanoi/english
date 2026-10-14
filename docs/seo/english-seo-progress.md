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
