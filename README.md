# PROJECT IDENTITY

Repository: thuexemayhanoi/english
Live site: https://thuexemayhanoi.github.io/english/
Business: Hanoi Motorbike Rental Nguyen Tu (https://thuexemaynguyentu.com/)
Purpose: original English-language motorbike + Hanoi + Vietnam knowledge hub, target approximately 1,000 articles, supporting rental enquiries.
Owner workflow: AI builds -> owner tests -> useful features stay -> weak features removed -> iterate.

# HARD RULES

- Only this repository may be modified. Never touch thuexemayhanoi/blog.
- English-only public site. No Vietnamese UI, no /vi/ sections, no language switchers, no auto-redirects.
- Business claims come only from docs/OWNER-FACTS.md. Never invent promotions, prices, fleet size, guarantees, reviews, testimonials, delivery promises or availability. Unknowns say "Contact us to confirm current availability."
- Legal content: primary sources only, last_reviewed recorded, legal facts separated from practical advice, review_status for unverified content.
- Technical content: never invent torque values, oil capacities, electrical specs or service intervals.
- No mass content generation without checking docs/MASTER-MATRIX.md first.
- One commit per article batch (50-100 articles), never one commit per article.
- Keep unpublished drafts in _queue/ (excluded from Jekyll output).
- Run scripts/build-report.js before every batch commit.
- Never fabricate commit SHAs, workflow run IDs, build/deploy/runtime results.
- GitHub Pages must stay a static Jekyll site; scripts/ is build-time QA tooling only.

# SOURCE OF TRUTH ORDER

1. Current remote MAIN source code
2. docs/OWNER-FACTS.md for business claims
3. Official / primary sources (laws, decrees, manufacturer specs)
4. docs/MASTER-MATRIX.md for content planning
5. This README (project state)
6. Agent assumptions

If this README conflicts with actual remote MAIN, inspect MAIN and update the README. Never force source code to match stale documentation.

# REPOSITORY MAP

| Path | Purpose |
|---|
---|
| _config.yml | Jekyll config. baseurl /english, articles collection permalink /articles/:title/ |
| _articles/ | Published articles (front matter: title, slug, description, category, tags, content_type, search_intent, topic_cluster, subcluster, date_published, last_reviewed, review_status, sources, internal_link_targets) |
| _queue/ | Unpublished drafts, excluded from output |
| _layouts/ | default.html, article.html (BlogPosting schema, review banner, related links), cluster.html (topic hub with count + empty state) |
| _includes/ | header.html (parent-child dropdown nav + live status pill), footer.html (site-map accordions + social/external links), breadcrumbs.html, contact-cta.html, contact-sheet.html (mobile contact action sheet), guide-assistant.html (static Guide Assistant UI + public business-facts JSON injection) |
| _data/navigation.yml | Single source of truth for navigation taxonomy: 5 parent groups over the 14 clusters + utility (Search/FAQ/Contact) and legal (Privacy/Terms) links; used by header and footer |
| topics/<cluster>/index.md | 14 topic hubs: rental, monthly-rental, scooters, motorcycles, manual-clutch, 50cc, electric, maintenance, parts-gear, safety, law-licences, hanoi, trips, vietnam-travel |
| articles/index.md | All Motorbike Guides — scalable guide library: client-side filter (enhancement only), all 14 topic cards with guide counts, published guides grouped by topic; fully crawlable without JS |
| index.html | Homepage: hero + search, quick-action grid, parent section cards with child links + counts, Featured rental bikes showcase (published daily prices, availability-safe notes), latest guides, contact CTA |
| search.md, search.json | Client-side search page (icon + clear button + suggested topics) and index |
| assistant-index.json | Guide Assistant v2 chunked knowledge index: article section chunks + all 52 FAQ Q&A units (short keys t/h/x/u/topic/tags/st/rs/qa), lazy-loaded on first assistant open; flat chunk list designed to be
 splittable by topic later |
| _data/assistant-business.yml | Curated public business facts for the Guide Assistant (ONLY approved OWNER-FACTS entries; no internal status labels) |
| assets/js/assistant-core.js | Guide Assistant intelligence (pure UMD module shared with Node tests): normalization, synonyms/spelling variants, model aliases, typo tolerance, hybrid chunk ranking, multi-turn context, business-fact answers, answer composition; no external AI/API |
| assets/js/assistant.js | Guide Assistant UI glue: drawer/bottom-sheet overlay, message rendering, follow-up chips; retrieval logic lives in assistant-core.js |
| manifest.webmanifest | PWA preparation (standalone, theme_color, /english/ scope); no service worker yet |
| assets/img/logo.svg | Original 512x512 motorbike logo (blog repo's Logo moto.png, byte-exact PNG embedded in an SVG wrapper — the GitHub write tooling cannot transfer raw binary, so PNG bytes are carried inside text SVG files) — apple-touch-icon + manifest 512 |
| assets/img/icon-192.svg | 192x192 icon derived from the same logo (area-averaged downscale, same palette, 4.3KB PNG payload) — favicon, manifest 192, header brand logo |
| assets/img/bikes/ | Featured rental bike photos for the homepage showcase (SVG-wrapped byte-exact embeds of the owner's catalog photos) |
| about.md, faq.md, contact.md, privacy.md, terms.md, 404.html | Static pages (About/Privacy/Terms are expanded trust pages; FAQ is a 52-question customer FAQ whose body lives in _includes/faq-body.html so /faq/ and the assistant index share one Liquid-processed source; Contact holds verified business contact facts + embedded Google Maps; 404) |
| sitemap.xml | Liquid-generated: home, /articles/, /about/, /search/, 14 hubs, all articles |
| robots.txt | Allows all, points to sitemap |
| assets/css/main.css, assets/js/main.js | Design tokens, Light/Dark/Auto theme, nav, search |
| scripts/ | QA toolkit (see SEO / QA SYSTEM), incl. scripts/assistant-test.js — 25-case Guide Assistan
t suite runnable against local emulated index or a built/live index URL |
| .github/workflows/quality-gate.yml | CI quality gate |
| docs/ | OWNER-FACTS.md, SOURCE-MAP.md, CUSTOMER-INTENTS.md, MODEL-DATABASE.md, MASTER-MATRIX.md, TAXONOMY.md, matrix/master-matrix.csv (988 intents), matrix/batch-1-status.md, data/intents.csv |

# CURRENT STATE

Date: 2026-09-23
- Jekyll site live on GitHub Pages, baseurl /english, English-only UI.
- Theme toggle (Light/Dark/Auto), parent-child header navigation (desktop dropdowns + mobile accordion panel, keyboard accessible), 4-item mobile bottom nav (Home/Guides/Search/Contact -> /contact/), client-side search, breadcrumbs, footer as secondary site map, contact CTAs.
- Utility pages live: /about/, /faq/ (52-question customer FAQ), /contact/ (embedded Google Maps for the verified location), /privacy/, /terms/ — all indexed, in sitemap, linked from nav/footer. About/Privacy/Terms expanded into substantial trust pages (2026-09-22, changelog 15).
- 457 published articles: 66 law/licence articles (VERIFIED, cluster 11 complete — see docs/matrix/batch-1-status.md), 81 Hanoi motorbike rental articles (cluster 1 COMPLETE, Batch 2 — see docs/matrix/batch-2-status.md), 45 monthly & long-term rental articles (cluster 2 COMPLETE, Batch 3 — see docs/matrix/batch-3-status.md), 30 cluster-10 riding skills & safety articles (Batch 4 — see docs/matrix/batch-4-status.md), 20 cluster-8 maintenance Part 1 articles (Batch 4), 25 remaining cluster-10 safety articles and 25 cluster-8 maintenance Part 2 articles (Batch 5 — see docs/matrix/batch-5-status.md), 25 cluster-8 maintenance Part 3 articles and 25 cluster-9 parts/accessories & riding gear Part 1 articles (Batch 6, 2026-09-23 — see docs/matrix/batch-6-status.md), 50 cluster-8 maintenance Part 4 articles completing cluster 8 (Batch 7, 2026-09-23 — see docs/matrix/batch-7-status.md), 50 cluster-9 parts, accessories & riding gear Part 2 articles (Batch 8, 2026-09-23 — see docs/matrix/batch-8-status.md
), and 15 cluster-9 parts, accessories & riding gear Part 3 articles completing cluster 9 (Batch 9, 2026-09-23 — see docs/matrix/batch-9-status.md). Clusters 8, 9 and 10 are COMPLETE (all 55 safety, all 120 maintenance and all 90 parts/gear intents). All business facts in rental, monthly-rental and maintenance articles come exclusively from docs/OWNER-FACTS.md.
- 14 topic hubs live; 7 currently show the empty state ("Guides for this topic are being prepared."); law-licences hub lists all 66 articles, rental hub lists all 81 rental guides, monthly-rental hub lists all 45 monthly & long-term rental guides, safety hub lists all 55 safety guides, maintenance hub lists all 120 maintenance guides, parts-gear hub lists all 90 parts/gear guides.
- /articles/ is a scalable guide library: client-side filter (enhancement only), all 14 topic cards always shown with guide counts, published guides grouped by topic, fully crawlable without JS.
- Homepage: app dashboard (hero + search, quick-action grid, parent section cards) plus a "Featured rental bikes" showcase (6 cards with published daily prices and availability-safe notes).
- Guide Assistant V2 (commit 0fbf1c8e78777b3f05b413fac7c35789eb142928): deterministic client-side retrieval over a chunk-level knowledge index (article sections + all 52 FAQ Q&A units), hybrid ranking, multi-turn page-memory context, typo handling, business-fact answers from _data/assistant-business.yml; no external AI/API, no persistence.
- SEO/QA toolkit live in scripts/ with a passing quality gate workflow (includes the Guide Assistant test suite against the built index).

# COMPLETED / VERIFIED

- Hub architecture: /articles/ is the all-guides index; the law hub is /topics/law-licences/ only; hub links resolved deterministically by permalink (commit 410750f0).
- Malformed double-quoted YAML in 9 article front matters fixed (title/description only, no content changes).
- Sitemap covers all indexable URLs (479 at the Batch-9 state; verified against the 
build report).
- Empty hub states render intentionally; homepage no longer looks broken.
- Footer accordions collapsed by default; law link wall reduced to hub + 4 featured + All law guides.
- Quality toolkit: 8 scripts, zero dependencies, all run clean (P0=0, P1=0, P2=53, P3=122 on current content, Batch-4 state).
- Quality Gate workflow runs on push/PR/dispatch and passes (run 35683518892, commit 0fbf1c8).
- Navigation IA: full 14-cluster taxonomy exposed as parent -> child in header (Rent a bike / Choose a bike / Ride & maintain / Rules / Explore), mobile accordion panel, and footer site map; all driven from _data/navigation.yml; accessible dropdowns (aria-expanded/aria-controls, Escape, outside-click, focus-visible, ArrowDown); bottom nav simplified to Home / Guides / Search / Contact.
- App-shell UI pass: three-tier responsive app feel (phone app-like / tablet hybrid / desktop editorial). Live status pill (open/closed by Asia/Ho_Chi_Minh time, updates every minute, aria-label announces Open/Closed + hours, no OPEN/CLOSED word). Homepage dashboard: hero+search, 6-icon quick-action grid (Rent/Choose/Laws/Safety/Trips/Contact), parent section cards (icon, title, child links, guide count, "Coming soon" styling when empty). Native bottom tab bar with safe-area padding, active top indicator, aria-current, >=52px touch targets. Contact action sheet (bottom sheet, focus management, Escape/backdrop close, links in HTML not JS-only) triggered from bottom-nav Contact and quick-action Contact on <=640px (desktop falls through to /contact/). Search page: search-field with icon + clear button + suggested-topics chips (shown when no query). Designed empty states on hub pages. PWA preparation only: manifest.webmanifest (standalone, theme_color, /english/ scope) + original SVG icon; no service worker. No new crawlable routes; canonical hub links remain in HTML.

# OPEN ISSUES

1. 6 topic clusters have zero published articles (planned content, not a defect — next up per MASTER-M
ATRIX.md ordering: clusters 3–4 scooter and motorcycle reviews, with specification population from manufacturer pages into docs/MODEL-DATABASE.md first).
2. 41 P2 warnings: homepage relies on site defaults (title/description); search.md missing meta description; body H1 alongside layout title H1 on search.md; remaining orphan-link warnings on older articles (owner pruning pass planned). Batch 5 also removed the previous long-meta-description warnings on new articles and cross-linked all 50 new articles into the internal-link graph (P2 reduced from 53 to 41).
3. 122 P3 recommendations: mostly meta descriptions longer than 165 chars on the legal articles; long titles; owner pruning pass planned.
4. Full 6-12 month GSC export not yet available for matrix prioritization (documented in SOURCE-MAP.md).

# MASTER MATRIX STATE

- docs/matrix/master-matrix.csv currently holds 457 committed rows: 81 rental-cluster rows (81 published, cluster 1 complete), 45 monthly & long-term rental rows (45 published, cluster 2 complete), the complete 66-row cluster-11 law/licence slice (66 published; IDs renumbered to the unique LAW-0001–LAW-0066 range in Batch 4 after a collision with the cluster-2 ID range and a corrupted first cell were found — see docs/matrix/batch-4-status.md), the complete 55-row cluster-10 safety slice (55 published, cluster 10 complete), 120 cluster-8 maintenance rows (120 published, cluster 8 complete) and 90 cluster-9 parts/gear rows (90 published, cluster 9 complete). The 988-intent plan in docs/MASTER-MATRIX.md remains the planning framework; rows for the remaining clusters are authored batch by batch, before each batch is written. Remaining rows are production candidates according to batch order (not approved for immediate wholesale publication).
- Cluster order for batches: law-licences (batch 1, 66 intents, COMPLETE) -> rental (batch 2, 81 intents, COMPLETE) -> monthly-rental (batch 3, 45 intents, COMPLETE) -> safety + maintenance Part 1 (batch 4, 30 + 20 in
tents, COMPLETE) -> safety remainder + maintenance Part 2 (batch 5, 25 + 25 intents, COMPLETE) -> maintenance Part 3 + parts-gear Part 1 (batch 6, 25 + 25 intents, COMPLETE 2026-09-23) -> maintenance Part 4 (batch 7, 50 intents, COMPLETE 2026-09-23, cluster 8 done) -> parts-gear Part 3 (batch 9, 15 intents, COMPLETE 2026-09-23, cluster 9 done) -> then model/travel clusters.
- docs/matrix/batch-1-status.md is the authoritative publish/review status for batch 1; docs/matrix/batch-2-status.md is the authoritative record for the rental batch; docs/matrix/batch-3-status.md is the authoritative record for the monthly & long-term rental batch; docs/matrix/batch-4-status.md is the authoritative record for the safety + maintenance Part 1 batch; docs/matrix/batch-5-status.md is the authoritative record for the safety remainder + maintenance Part 2 batch; docs/matrix/batch-6-status.md is the authoritative record for the maintenance Part 3 + parts/gear Part 1 batch. docs/matrix/batch-7-status.md is the authoritative record for the maintenance Part 4 batch (cluster 8 complete). docs/matrix/batch-8-status.md and docs/matrix/batch-9-status.md are the authoritative records for the parts/gear Part 2 and Part 3 batches (cluster 9 complete).

# CONTENT BATCH STATE

- Batch 1 (law-licences): COMPLETE — all 66 cluster-11 intents published and VERIFIED (Slice 1: 2026-09-21; Slices 2-4: 2026-09-22). 0 proposed cluster-11 rows remain. Nine previously published articles received citation-accuracy corrections in the final slice (same commit; no intent, slug or URL changes).
- Batch 2 (rental): COMPLETE — all 81 cluster-1 intents published (Slice 1: 48 articles; Slice 2: 33 articles; both 2026-09-22). 0 proposed cluster-1 rows remain. Business facts sourced exclusively from docs/OWNER-FACTS.md; see docs/matrix/batch-2-status.md.
- Batch 3 (monthly-rental): COMPLETE — all 45 cluster-2 monthly & long-term rental intents published (2026-09-22, one batch). 0 proposed cluster-2 rows remain. Monthl
y prices published only for the OWNER-FACTS models; every other model points to contact for current monthly pricing. See docs/matrix/batch-3-status.md. The same batch fixed two known rental issues: the MM-0075 record in batch-2-status.md (renting-motorbike-hanoi-winter → renting-motorbike-cau-giay) and unsupported superlative/travel-time wording in renting-motorbike-cau-giay.md.
- Batch 4 (safety + maintenance Part 1): 50 articles published (2026-09-22, one batch): 30 cluster-10 riding skills & safety articles (10.1 riding-skills 10, 10.2 road-conditions 10, 10.3 rider-protection 10) and 20 cluster-8 maintenance articles (8.1 maintenance-basics 8, 8.2 common-issues 7, 8.3 ownership-practicalities 5). Cluster 10: 30 of 55 published. Cluster 8: 20 of 120 published. Safety articles separate practical advice from legal requirements and link to the VERIFIED cluster-11 legal articles; maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals. The same batch fixed two pre-existing master-matrix.csv defects (corrupted first law-row ID cell; cluster-11 ID collision with cluster 2 — law rows renumbered LAW-0001–LAW-0066). See docs/matrix/batch-4-status.md.
- Batch 5 (safety remainder + maintenance Part 2): 50 articles published (2026-09-22, one batch): the 25 remaining cluster-10 safety intents (10.1 riding-skills 8: U-turns, hill starts, merging, left turns, group riding, Old Quarter narrow streets, Hanoi bridges, downhill braking; 10.2 road-conditions 9: post-rain surfaces, sun glare, stray animals, road works, dry-season dust, Tet traffic, unlit rural roads, slippery city surfaces, storm stop-or-continue; 10.3 rider-protection 8: gloves, footwear, rain gear, sun protection, horn etiquette, hydration, aggressive-driver de-escalation, dashcams) and 25 cluster-8 maintenance Part 2 intents (8.1 maintenance-basics 8, 8.2 common-issues 12, 8.3 ownership-practicalities 5). Cluster 10 is now COMPLETE (55/55). Clu
ster 8: 45 of 120 published. Safety articles introduce no new legal claims and link to the VERIFIED cluster-11 legal articles; maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals. All 50 new articles cross-link into the existing internal-link graph. See docs/matrix/batch-5-status.md.
- Batch 6 (maintenance Part 3 + parts/gear Part 1): 50 articles published (2026-09-23, one batch): 25 cluster-8 maintenance Part 3 intents (MM-0227–MM-0251) and 25 cluster-9 parts/accessories & riding gear Part 1 intents (MM-0252–MM-0276). Cluster 8: 70 of 120 published (50 remaining, Part 4 next). Cluster 9: 25 of 90 published (65 remaining, Part 2 next). Maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals; parts/gear articles contain no invented prices, availability or safety claims. All 50 new articles cross-link into the existing internal-link graph. See docs/matrix/batch-6-status.md.
- Batch 7 (maintenance Part 4): COMPLETE — 50 cluster-8 maintenance articles published in one batch (2026-09-23, commit 4aff06c; MM-0277–MM-0326: 8.1 maintenance-basics 14, 8.2 common-issues 20, 8.3 ownership-practicalities 16). Cluster 8 is COMPLETE: 120 of 120 intents published, 0 proposed rows remain. Maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals (manual/mechanic is the authority); no prices, availability, promotions or repair costs were invented. All 50 new articles cross-link into the existing internal-link graph. See docs/matrix/batch-7-status.md.
- Batch 9 (parts/gear Part 3): COMPLETE — 15 cluster-9 articles published 2026-09-23 in two part-commits (43358bd, 56c2896); MM-0377–MM-0391: 9.1 helmets 3, 9.2 riding-gear 2, 9.3 accessories-luggage 2, 9.4 security 1, 9.5 parts-accessories 7. Cluster 9 is COMPLETE: 90 of 90 intents published. Same content rules as Batch 8 (no
 invented prices, availability, promotions, torque values, capacities or legal claims; OWNER-FACTS only for business claims). All 15 articles cross-linked into the internal-link graph. See docs/matrix/batch-9-status.md.
- _queue/: empty (no drafts pending).

# SEO / QA SYSTEM

QA tooling in scripts/ (plain Node.js, zero dependencies). Build-time only; GitHub Pages stays static Jekyll.

- scripts/lib.js — shared helpers (front-matter parser, sitemap Liquid renderer, URL rules)
- scripts/frontmatter-check.js — required fields, duplicate slugs, legal/technical source rules
- scripts/content-duplicate-check.js — exact + near-duplicate title/slug/description detection
- scripts/internal-link-audit.js — broken links, orphans, hub/article connectivity
- scripts/seo-audit.js — titles, meta, canonicals, sitemap inclusion, H1, noindex
- scripts/sitemap-check.js — sitemap coverage vs indexable pages
- scripts/schema-check.js — JSON-LD syntax and field rules
- scripts/rendered-site-audit.js — inspects actual Jekyll output in _site/ (titles, canonicals, H1, noindex, rendered links, JSON-LD, Article schema, sitemap-to-file correspondence)
- scripts/build-report.js — runs all, writes reports/quality-latest.md

Blocking rule is centralized in scripts/lib.js (isBlocking): all P0 blocks, and P1 blocks only for clearly structural/correctness findings (duplicate slug, YAML failure, missing required fields, unknown topic_cluster, legal VERIFIED without primary legal sources, invalid dates, broken internal links, missing link targets, missing hubs, doubled /english/english paths, duplicate canonicals, noindex/sitemap integrity, invalid JSON-LD, broken breadcrumbs). Ordinary P2/P3 never block.

Legal source validation: a legal article may stay published while REVIEW_REQUIRED. A legal article can only be considered VERIFIED when sources[] cites at least one class A primary legal domain (chinhphu.vn, vanban.chinhphu.vn, bocongan.gov.vn, *.gov.vn per docs/SOURCE-MAP.md). Secondary sources (t
huvienphapluat.vn etc.) never satisfy VERIFIED on their own. Metadata/status consistency only — article facts are never rewritten by tooling.

Orphan detection is Liquid-aware: articles listed dynamically by their topic hub (cluster.html), the all-guides index (articles/index.md) or the homepage are not orphans; only genuinely disconnected content is flagged.

Severity scale: P0 = broken deployment/indexing, P1 = serious SEO/data issue, P2 = quality warning, P3 = recommendation.
Quality gate (.github/workflows/quality-gate.yml) runs on push to main, pull requests, workflow_dispatch. It builds the site with the official GitHub Pages Jekyll toolchain (actions/jekyll-build-pages) and then runs the rendered-site audit against _site/. Fails only on P0 and clearly structural P1; P2/P3 never block. Reports upload as workflow artifacts, never committed — no commit loop.

Batch production sequence:

MATRIX SLICE -> WRITE ARTICLES -> FRONTMATTER CHECK -> DUPLICATE CHECK -> INTERNAL LINK CHECK -> SEO AUDIT -> SITEMAP CHECK -> SCHEMA CHECK -> QUALITY REPORT -> COMMIT -> PAGES DEPLOY -> RUNTIME VERIFY

Run locally before each batch commit:

    node scripts/build-report.js

# PUBLISHING WORKFLOW

1. Read this README + docs/MASTER-MATRIX.md; pick the batch slice.
2. Write articles into _queue/ until the batch is approved.
3. QA: node scripts/build-report.js (must be P0=0, no structural P1).
4. Move approved articles into _articles/ as one bulk operation.
5. Single batch commit (50-100 articles).
6. Verify Pages build + deploy + runtime behavior (home, hubs, articles, search, sitemap, mobile).
7. Update this README's state sections.

# DEPLOYMENT STATE

- Hosting: GitHub Pages, Jekyll, baseurl /english.
- Latest verified implementation commit: 56c2896b03d537e33f682c116a8eb0cdfc3033c6 (Batch 9: 15 cluster-9 parts/gear Part 3 articles in two part-commits 43358bd and 56c2896; cluster 9 complete). Verified live on Pages on 2026-09-23: all 15 new article pages resolve on the live site,
 the parts-gear hub shows the 90-guide count, and the passing Quality Gate rendered-site audit confirms sitemap coverage (479 indexable URLs expected at the Batch-9 state; 458 article URLs incl. the /articles/ index).
- Latest verified Quality Gate run: 35827544583 (commit 56c2896, success, 2026-09-23).
- Latest verified Pages run: 35827544229 (commit 56c2896; build/deploy checks success, 2026-09-23).
- README-only state updates may create a newer HEAD than the SHAs recorded here; the values above always refer to the last implementation commit whose CI/deploy was actually verified.

- Research/docs-only commit 832320e (MODEL-DATABASE verified rows + README state, 2026-09-23): Quality Gate run 35854310493 success; Pages deployment run 35854310279 success. No runtime content changed (docs/ only).

# NEXT RECOMMENDED STEP

State as of 2026-09-23 (late): Batch 10 is IN PROGRESS via a concurrent scheduled run — 25 cluster-3 scooter articles are published on MAIN (7 model reviews MM-0392–MM-0398, 6 comparisons MM-0399–MM-0404, 12 choosing/spec guides MM-0405–MM-0416; commits 1ac0c1a, b63f2b1, 0c0004d, QA fix 821eeb9), bringing the site to 482 published articles. Model-database research run (this run, commit 832320e) added 12 verified manufacturer rows to docs/MODEL-DATABASE.md (Honda VN: Vision, SH Mode 125, Lead 125 ABS, Vario 125, Vario 160, Air Blade 160; Air Blade 125 partial; Yamaha VN: Grande/Janus/FreeGo/Latte 125, Sirius RC 110; SYM VN: Attila 50; Suzuki and Piaggio blocked 403, rows PENDING). Next: (1) complete the Batch 10 state-docs sync if the concurrent run did not finish it (batch-10 status record, master-matrix.csv rows MM-0392–MM-0416 and count 457→482, MASTER-MATRIX.md counts, README CURRENT STATE); (2) verify the 25 new slugs live on Pages (hub: scooters); (3) continue the cluster-3 slice (110 intents total) with the next ~25–60 articles, cross-checking every model-specific number against the verified MODEL-DATABASE rows and OWNER-FACTS.md as the only business/pricing authority. Do not start a separate overlapping batch until the Batch 10 record is synced.

# CHANGE LOG

- 2026-09-23 (30): Research run — MODEL-DATABASE populated for the cluster 3–4 review batches: 12 verified manufacturer rows (Honda VN: Vision, SH Mode 125, Lead 125 ABS, Vario 125, Vario 160, Air Blade 160; Air Blade 125 partial per rule 1; Yamaha VN: Grande/Janus/FreeGo/Latte 125, Sirius RC 110; SYM VN: Attila 50), each with source URL and retrieval date 2026-09-23, manufacturer suggested retail prices date-stamped, and no secondary-source fills. Suzuki/Piaggio official pages blocked automated access (403) on 2026-09-23 — their rows remain PENDING. No articles published in this research run. NOTE (overlap repair, same day): a concurrent scheduled production run published Batch 10 parts 1–3 (25 cluster-3 scooter articles, MM-0392–MM-0416, commits 1ac0c1a/b63f2b1/0c0004d + QA fix 821eeb9) minutes before this research commit; remote MAIN now holds 482 published articles. This research run did not modify _articles/ and its commit touched only README.md and docs/MODEL-DATABASE.md (verified by commit file list — no clobbering).
- 2026-09-23 (29): Batch 9 — parts, accessories & riding gear (cluster 9) Part 3, cluster COMPLETE: 15 articles published in two part-commits (43358bd, 56c2896; MM-0377–MM-0391). Parts/gear 15 (9.1 helmets: helmet-fasteners-retention-systems, helmet-sun-heat-damage-vietnam, prescription-glasses-under-helmet; 9.2 riding-gear: earplugs-motorbike-wind-noise, hi-vis-vests-motorbike-riders; 9.3 accessories-luggage: pet-carriers-motorbikes-vietnam, waterproof-document-pouches-motorbike; 9.4 security: security-marking-kits-motorbike; 9.5 parts-accessories: portable-jump-starter-packs-motorbikes, tyre-pressure-monitoring-systems-motorbikes, bar-end-weights-vibration, aftermarket-horns-motorbikes, aftermarket-exhausts-motorbikes-vietnam, frame-sliders-engine-case-protection, tank-pads-scooters). Cluste
r 9 is COMPLETE (90/90). Same content rules as Batch 8: no invented prices, availability, promotions, torque values, capacities or legal claims (horn and exhaust articles direct readers to verify current regulations); OWNER-FACTS is the only source of business claims. All 15 articles cross-linked into the internal-link graph; internal_link_targets validated against published slugs (0 broken references). QA: Quality Gate PASS (run 35827544583 on commit 56c2896, no blocking findings; the part-1 commit 43358bd also passed its gate run); Pages deployment run 35827544229 with build/deploy checks success; all 15 new slugs verified live on Pages (article pages, parts-gear hub 90-guide count). Groundwork for the next batch order step: initial verified Honda VN specification rows recorded in docs/MODEL-DATABASE.md (retrieved 2026-09-23; cluster 3 scooter reviews next). State docs: docs/matrix/batch-9-status.md (authoritative batch record), master-matrix.csv 15 new rows (457 rows), MASTER-MATRIX.md counts, README state sections. 457 published articles site-wide.
- 2026-09-23 (28): Batch 8 — parts, accessories & riding gear (cluster 9) Part 2: 50 articles published (MM-0327–MM-0376; part-commits 5b6009f/a234d5f/9a8dae9/36c9d7f/d667458 + QA fixes 651e00e). Parts/gear 50 (9.1 helmets: helmet-safety-standards-explained-vietnam, modular-flip-up-helmets-vietnam, kids-helmets-choosing-vietnam, helmet-ventilation-hot-climate, helmet-visor-tinted-photochromic; 9.2 riding-gear: riding-trousers-lower-body-protection, ce-armour-certification-explained, base-layers-hot-humid-riding, neck-gaiters-dust-masks-riders, armoured-hoodies-casual-riding-wear, cleaning-waterproof-riding-gear, riding-gear-sizing-fit-foreign-riders, pillion-passenger-gear-checklist, offroad-riding-gear-basics, second-hand-riding-gear-risks; 9.3 accessories-luggage: dry-bags-waterproof-luggage-riders, tank-bags-motorbikes-uses, tail-bags-roll-bags-motorbike, front-baskets-scooters-vietnam, gel-seat-pads-comfort-long-r
ides, throttle-assist-long-rides, water-bottle-holders-motorbike-commuters, delivery-rider-accessory-setup, rental-motorbike-modifications, camping-gear-motorbike-trips; 9.4 security: gps-trackers-motorbikes-vietnam, steering-locks-effective-use, home-parking-overnight-security, weather-resistant-locks-motorbike; 9.5 parts-accessories: variator-roller-upgrades-scooter, footpeg-upgrades-tall-riders, handlebar-raisers-riding-ergonomics, handguards-motorbike-vietnam, skid-plates-underbody-protection, paint-protection-ceramic-coatings, seat-reupholstery-comfort, aftermarket-suspension-upgrades, automatic-chain-oilers, portable-tyre-inflators-motorbike, mudguard-extenders-rain-spray, heated-grips-hanoi-winter, aftermarket-led-headlight-bulbs, battery-trickle-chargers-storage, radiator-guards-liquid-cooled, adjustable-levers-motorbikes, kickstand-extensions-soft-ground, buying-parts-physical-markets-vietnam, aftermarket-parts-warranty, installing-accessories-diy-vs-shop, reflective-stickers-motorbike-visibility). Cluster 9 at 75/90 (15 remaining, Part 3 next). Gear articles recommend certification and reputable sourcing without naming or endorsing products or prices; no legal claims beyond links to the published VERIFIED cluster-11 legal articles; nothing implies Nguyen Tu sells or provides the discussed gear. All 50 articles cross-linked into the internal-link graph; internal_link_targets validated against published slugs (0 broken references). QA: front-matter YAML quoting defect in modular-flip-up-helmets-vietnam found and fixed with 8 prose slug-reference cleanups (commit 651e00e); Quality Gate PASS (run 35822647185, commit 651e00e, no blocking findings); Pages deployment run 35822647157 success; new slugs verified live (article pages, parts-gear hub, sitemap; 464 indexable URLs expected at the Batch-8 state). State docs: docs/matrix/batch-8-status.md (authoritative batch record), master-matrix.csv 50 new rows (442 rows), MASTER-MATRIX.md counts, README state sections
. 442 published articles site-wide.
- 2026-09-23 (27): Batch 7 — maintenance & repair (cluster 8) Part 4, cluster COMPLETE: 50 articles published in one batch (MM-0277–MM-0326, commit 4aff06c). Maintenance 50 (8.1 basics: inspecting-brake-discs, front-fork-care-oil-seals, throttle-cable-free-play, idle-speed-adjustment, kick-starter-care, coolant-radiator-care-liquid-cooled, manual-gearbox-oil-change, fuel-injector-cleaning, headlight-aim-adjustment, choosing-replacement-battery, simple-electrical-faults-horn-switches-fuses, reading-spark-plug-condition, fuel-tank-rust-prevention-treatment, tyre-valves-wheel-balancing; 8.2 common-issues: sticking-brakes-caliper-cleaning, motorbike-overheating-causes, clutch-slipping-manual, hard-shifting-gearbox, leaking-fork-seals, handlebar-vibration, battery-draining-overnight, exhaust-popping-backfiring, running-rich-vs-lean, water-in-fuel, brake-squeal-grinding, kick-start-slipping, rear-brake-locking, motorbike-wont-start-after-washing, ignition-switch-problems, burning-smell, low-compression-signs, fuel-starvation-power-loss, stalling-when-hot, clutch-drag-hard-neutral; 8.3 ownership: changing-engine-oil-at-home, deep-water-riding-aftercare, learning-basic-motorbike-maintenance, maintaining-motorbike-without-garage, warranty-dealer-service, preparing-motorbike-for-sale, spare-parts-availability, repair-or-replace-motorbike-parts, buying-motorbike-parts-online, servicing-before-long-trip, electric-motorbike-maintenance-basics, checking-motorbike-after-fall-accident, maintaining-motorbike-you-rarely-ride, tyre-age-replace-by-date, high-usage-delivery-commuter-maintenance, keeping-old-motorbike-alive-high-mileage). Cluster 8 is COMPLETE (120/120). Maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals (manual/mechanic is the authority); no prices, availability, promotions or repair costs invented; OWNER-FACTS is the only source of business claims. All 50 new
 articles cross-linked into the internal-link graph; every internal_link_targets entry validated against published slugs (0 broken references). State docs: docs/matrix/batch-7-status.md (authoritative batch record), master-matrix.csv 50 new rows (392 rows), MASTER-MATRIX.md counts, README CURRENT/OPEN ISSUES/MASTER MATRIX/CONTENT BATCH/DEPLOYMENT/NEXT STEP. QA: Quality Gate PASS (run 35817913152, commit 4aff06c, no blocking findings); Pages deployment run 35817912280 success; new slugs verified live (article pages, maintenance hub, sitemap; 414 indexable URLs expected at the Batch-7 state). 392 published articles site-wide.
- 2026-09-23 (26): Batch 6 — maintenance & repair (cluster 8) Part 3 + parts, accessories & riding gear (cluster 9) Part

... [Content truncated]