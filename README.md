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
| assistant-index.json | Guide Assistant v2 chunked knowledge index: article section chunks + all 52 FAQ Q&A units (short keys t/h/x/u/topic/tags/st/rs/qa), lazy-loaded on first assistant open; flat chunk list designed to
 
b
e
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
| scripts/ | QA toolkit (see SEO / QA SYSTEM), incl. scripts/assistant-test.js — 25-case Guide As
si
st
an
t suite runnable against local emulated index or a built/live index URL |
| .github/workflows/quality-gate.yml | CI quality gate |
| docs/ | OWNER-FACTS.md, SOURCE-MAP.md, CUSTOMER-INTENTS.md, MODEL-DATABASE.md, MASTER-MATRIX.md, TAXONOMY.md, matrix/master-matrix.csv (988 intents), matrix/batch-1-status.md, data/intents.csv |

# CURRENT STATE

Date: 2026-09-23
- Jekyll site live on GitHub Pages, baseurl /english, English-only UI.
- Theme toggle (Light/Dark/Auto), parent-child header navigation (desktop dropdowns + mobile accordion panel, keyboard accessible), 4-item mobile bottom nav (Home/Guides/Search/Contact -> /contact/), client-side search, breadcrumbs, footer as secondary site map, contact CTAs.
- Utility pages live: /about/, /faq/ (52-question customer FAQ), /contact/ (embedded Google Maps for the verified location), /privacy/, /terms/ — all indexed, in sitemap, linked from nav/footer. About/Privacy/Terms expanded into substantial trust pages (2026-09-22, changelog 15).
- 730 published articles: 27 cluster-5 manual & clutch articles (Batch 18, 2026-09-24 — see docs/matrix/batch-18-status.md) on top of the earlier 703: 28 cluster-5 manual & clutch articles (Batch 17, 2026-09-24 — see docs/matrix/batch-17-status.md) on top of the earlier 675: 66 law/licence articles (VERIFIED, cluster 11 complete — see docs/matrix/batch-1-status.md), 81 Hanoi motorbike rental articles (cluster 1 COMPLETE, Batch 2 — see docs/matrix/batch-2-status.md), 45 monthly & long-term rental articles (cluster 2 COMPLETE, Batch 3 — see docs/matrix/batch-3-status.md), 30 cluster-10 riding skills & safety articles (Batch 4 — see docs/matrix/batch-4-status.md), 20 cluster-8 maintenance Part 1 articles (Batch 4), 25 remaining cluster-10 safety articles and 25 cluster-8 maintenance Part 2 articles (Batch 5 — see docs/matrix/batch-5-status.md), 25 cluster-8 maintenance Part 3 articles and 25 cluster-9 parts/accessories & riding gear Part 1 articles (Batch 6, 2026-09-23 — see docs/matrix/
bat
ch-
6-status.md), 50 cluster-8 maintenance Part 4 articles completing cluster 8 (Batch 7, 2026-09-23 — see docs/matrix/batch-7-status.md), 50 cluster-9 parts, accessories & riding gear Part 2 articles (Batch 8, 2026-09-23 — see docs/matrix/batch-8-status.md
), and 15 cluster-9 parts, accessories & riding gear Part 3 articles completing cluster 9 (Batch 9, 2026-09-23 — see docs/matrix/batch-9-status.md). Clusters 8, 9 and 10 are COMPLETE (all 55 safety, all 120 maintenance and all 90 parts/gear intents). Since then, cluster-3 scooter production published 25 articles in Batch 10 (MM-0392–MM-0416), 25 in Batch 11 (MM-0417–MM-0441) and 35 in Batch 13 (MM-0467–MM-0501) — 110 of 110 cluster-3 intents published, cluster 3 COMPLETE (see docs/matrix/batch-10-status.md through docs/matrix/batch-13-status.md). Cluster-4 motorcycle production published 25 articles in Batch 14 (MM-0502-MM-0526: 10 manufacturer-verified model reviews, 10 model comparisons, 3 verified-data choosing guides, 2 spec explainers - see docs/matrix/batch-14-status.md), and 50 cluster-4 motorcycle articles in Batch 15 (MM-0527-MM-0576: 17 model comparisons, 8 verified-data choosing guides, 25 spec explainers - see docs/matrix/batch-15-status.md), and 31 cluster-4 motorcycle articles in Batch 16 (MM-0577-MM-0607: 14 model comparisons, 8 verified-data choosing guides, 9 spec explainers - see docs/matrix/batch-16-status.md). All business facts in rental, monthly-rental, maintenance and scooter articles come exclusively from docs/OWNER-FACTS.md.
- 14 topic hubs live; 4 currently show the empty state (Batch 18 completed the manual-clutch hub: 55 guides) ("Guides for this topic are being prepared."); law-licences hub lists all 66 articles, rental hub lists all 81 rental guides, monthly-rental hub lists all 45 monthly & long-term rental guides, safety hub lists all 55 safety guides, maintenance hub lists all 120 maintenance guides, parts-gear hub lists all 90 parts/gear guides, scooters hub lists all 110 sco
oter
 gui
des; motorcycles hub lists all 108 motorcycle guides (106 planned cluster-4 intents plus 2 supplementary articles from the reconciled Batch 16 overlap).
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
- Navigation IA: full 14-cluster taxonomy exposed as parent -> child in header (Rent a bike / Choose a bike / Ride & maintain / Rules / Explore), mobile accordion panel, an
d foo
ter s
ite map; all driven from _data/navigation.yml; accessible dropdowns (aria-expanded/aria-controls, Escape, outside-click, focus-visible, ArrowDown); bottom nav simplified to Home / Guides / Search / Contact.
- App-shell UI pass: three-tier responsive app feel (phone app-like / tablet hybrid / desktop editorial). Live status pill (open/closed by Asia/Ho_Chi_Minh time, updates every minute, aria-label announces Open/Closed + hours, no OPEN/CLOSED word). Homepage dashboard: hero+search, 6-icon quick-action grid (Rent/Choose/Laws/Safety/Trips/Contact), parent section cards (icon, title, child links, guide count, "Coming soon" styling when empty). Native bottom tab bar with safe-area padding, active top indicator, aria-current, >=52px touch targets. Contact action sheet (bottom sheet, focus management, Escape/backdrop close, links in HTML not JS-only) triggered from bottom-nav Contact and quick-action Contact on <=640px (desktop falls through to /contact/). Search page: search-field with icon + clear button + suggested-topics chips (shown when no query). Designed empty states on hub pages. PWA preparation only: manifest.webmanifest (standalone, theme_color, /english/ scope) + original SVG icon; no service worker. No new crawlable routes; canonical hub links remain in HTML.

# OPEN ISSUES

1. 4 topic clusters have zero published articles (cluster 5 completed by Batches 17-18; remaining: 50cc, electric, hanoi, trips, vietnam-travel — planned content, not a defect (planned content, not a defect — next up per MASTER-M
ATRIX.md ordering: clusters 3–4 scooter and motorcycle reviews, with specification population from manufacturer pages into docs/MODEL-DATABASE.md first).
2. 41 P2 warnings: homepage relies on site defaults (title/description); search.md missing meta description; body H1 alongside layout title H1 on search.md; remaining orphan-link warnings on older articles (owner pruning pass planned). Batch 5 also removed the previous long-meta-description warnings
 on ne
w arti
cles and cross-linked all 50 new articles into the internal-link graph (P2 reduced from 53 to 41).
3. 122 P3 recommendations: mostly meta descriptions longer than 165 chars on the legal articles; long titles; owner pruning pass planned.
4. Full 6-12 month GSC export not yet available for matrix prioritization (documented in SOURCE-MAP.md).

# MASTER MATRIX STATE
- docs/matrix/master-matrix.csv holds 675 committed rows after the batch-16 docs-sync merge (642 previously committed rows + 31 rows from docs/matrix/batch-16-rows.csv and 2 rows from docs/matrix/batch-16b-rows.csv; plus 28 cluster-5 batch-17 rows preserved in docs/matrix/batch-17-rows.csv and 27 cluster-5 batch-18 rows preserved in docs/matrix/batch-18-rows.csv pending the next sync merge; 730 published articles): 81 rental-cluster rows (81 published, cluster 1 complete), 45 monthly & long-term rental rows (45 published, cluster 2 complete), the complete 66-row cluster-11 law/licence slice (66 published; IDs renumbered to the unique LAW-0001-LAW-0066 range - see docs/matrix/batch-4-status.md), the complete 55-row cluster-10 safety slice (55 published, cluster 10 complete), 120 cluster-8 maintenance rows (120 published, cluster 8 complete), 90 cluster-9 parts/gear rows (90 published, cluster 9 complete), 110 cluster-3 scooter rows (110 published, cluster 3 complete) and 108 cluster-4 motorcycle rows (108 published; cluster 4 COMPLETE: 106 planned intents plus 2 supplementary articles retained from the reconciled Batch 16 concurrent-run overlap). The 988-intent plan in docs/MASTER-MATRIX.md remains the planning framework; rows for the remaining clusters are authored batch by batch, before each batch is written. Remaining rows are production candidates according to batch order (not approved for immediate wholesale publication).
- Cluster order for batches: law-licences (batch 1, 66 intents, COMPLETE) -> rental (batch 2, 81 intents, COMPLETE) -> monthly-rental (batch 3, 45 intents, COMPLETE) -> sa
fety + 
mainten
ance Parts 1-2 (batches 4-5, COMPLETE) -> maintenance Part 3 + parts-gear Part 1 (batch 6, COMPLETE) -> maintenance Part 4 (batch 7, COMPLETE) -> parts-gear Parts 2-3 (batches 8-9, COMPLETE, cluster 9 done) -> cluster-3 scooters (batches 10-13, 110 of 110 intents published, cluster 3 COMPLETE) -> cluster-4 motorcycle reviews (batch 14 published 25 of 106 and batch 15 published 50 more on 2026-09-23, 75 of 106 published, IN PROGRESS; Honda/Yamaha manufacturer research recorded in MODEL-DATABASE, Suzuki/SYM pages still blocked) -> then the remaining model/travel clusters per docs/MASTER-MATRIX.md.
- docs/matrix/batch-1-status.md through docs/matrix/batch-9-status.md are the authoritative records for batches 1-9 (see each file). docs/matrix/batch-10-status.md through docs/matrix/batch-13-status.md are the authoritative records for the cluster-3 scooter batches (MM-0392-MM-0501). docs/matrix/batch-14-status.md is the authoritative record for the cluster-4 motorcycle Part 1 batch (MM-0502-MM-0526). docs/matrix/batch-15-status.md is the authoritative record for the cluster-4 motorcycle Part 2 batch (MM-0527-MM-0576). docs/matrix/batch-16-status.md is the authoritative record for the cluster-4 motorcycle Part 3 batch (MM-0577-MM-0607); docs/matrix/batch-16-overlap-reconciliation.md records the concurrent-run overlap resolution (2 supplementary articles, MM-0608/MM-0609 in docs/matrix/batch-16b-rows.csv).
# CONTENT BATCH STATE

- Batch 1 (law-licences): COMPLETE — all 66 cluster-11 intents published and VERIFIED (Slice 1: 2026-09-21; Slices 2-4: 2026-09-22). 0 proposed cluster-11 rows remain. Nine previously published articles received citation-accuracy corrections in the final slice (same commit; no intent, slug or URL changes).
- Batch 2 (rental): COMPLETE — all 81 cluster-1 intents published (Slice 1: 48 articles; Slice 2: 33 articles; both 2026-09-22). 0 proposed cluster-1 rows remain. Business facts sourced exclusively from docs/OWNER-FACTS.md; see docs
/matrix/
batch-2-
status.md.
- Batch 3 (monthly-rental): COMPLETE — all 45 cluster-2 monthly & long-term rental intents published (2026-09-22, one batch). 0 proposed cluster-2 rows remain. Monthl
y prices published only for the OWNER-FACTS models; every other model points to contact for current monthly pricing. See docs/matrix/batch-3-status.md. The same batch fixed two known rental issues: the MM-0075 record in batch-2-status.md (renting-motorbike-hanoi-winter → renting-motorbike-cau-giay) and unsupported superlative/travel-time wording in renting-motorbike-cau-giay.md.
- Batch 4 (safety + maintenance Part 1): 50 articles published (2026-09-22, one batch): 30 cluster-10 riding skills & safety articles (10.1 riding-skills 10, 10.2 road-conditions 10, 10.3 rider-protection 10) and 20 cluster-8 maintenance articles (8.1 maintenance-basics 8, 8.2 common-issues 7, 8.3 ownership-practicalities 5). Cluster 10: 30 of 55 published. Cluster 8: 20 of 120 published. Safety articles separate practical advice from legal requirements and link to the VERIFIED cluster-11 legal articles; maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals. The same batch fixed two pre-existing master-matrix.csv defects (corrupted first law-row ID cell; cluster-11 ID collision with cluster 2 — law rows renumbered LAW-0001–LAW-0066). See docs/matrix/batch-4-status.md.
- Batch 5 (safety remainder + maintenance Part 2): 50 articles published (2026-09-22, one batch): the 25 remaining cluster-10 safety intents (10.1 riding-skills 8: U-turns, hill starts, merging, left turns, group riding, Old Quarter narrow streets, Hanoi bridges, downhill braking; 10.2 road-conditions 9: post-rain surfaces, sun glare, stray animals, road works, dry-season dust, Tet traffic, unlit rural roads, slippery city surfaces, storm stop-or-continue; 10.3 rider-protection 8: gloves, footwear, rain gear, sun protection, horn etiquette, hydration, aggressive-d
river de-
escalatio
n, dashcams) and 25 cluster-8 maintenance Part 2 intents (8.1 maintenance-basics 8, 8.2 common-issues 12, 8.3 ownership-practicalities 5). Cluster 10 is now COMPLETE (55/55). Clu
ster 8: 45 of 120 published. Safety articles introduce no new legal claims and link to the VERIFIED cluster-11 legal articles; maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals. All 50 new articles cross-link into the existing internal-link graph. See docs/matrix/batch-5-status.md.
- Batch 6 (maintenance Part 3 + parts/gear Part 1): 50 articles published (2026-09-23, one batch): 25 cluster-8 maintenance Part 3 intents (MM-0227–MM-0251) and 25 cluster-9 parts/accessories & riding gear Part 1 intents (MM-0252–MM-0276). Cluster 8: 70 of 120 published (50 remaining, Part 4 next). Cluster 9: 25 of 90 published (65 remaining, Part 2 next). Maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals; parts/gear articles contain no invented prices, availability or safety claims. All 50 new articles cross-link into the existing internal-link graph. See docs/matrix/batch-6-status.md.
- Batch 7 (maintenance Part 4): COMPLETE — 50 cluster-8 maintenance articles published in one batch (2026-09-23, commit 4aff06c; MM-0277–MM-0326: 8.1 maintenance-basics 14, 8.2 common-issues 20, 8.3 ownership-practicalities 16). Cluster 8 is COMPLETE: 120 of 120 intents published, 0 proposed rows remain. Maintenance articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals (manual/mechanic is the authority); no prices, availability, promotions or repair costs were invented. All 50 new articles cross-link into the existing internal-link graph. See docs/matrix/batch-7-status.md.
- Batch 9 (parts/gear Part 3): COMPLETE — 15 cluster-9 articles published 2026-09-23 in two part-commits (43358bd, 56c2896); MM-0
377–MM-039
1: 9.1 hel
mets 3, 9.2 riding-gear 2, 9.3 accessories-luggage 2, 9.4 security 1, 9.5 parts-accessories 7. Cluster 9 is COMPLETE: 90 of 90 intents published. Same content rules as Batch 8 (no
 invented prices, availability, promotions, torque values, capacities or legal claims; OWNER-FACTS only for business claims). All 15 articles cross-linked into the internal-link graph. See docs/matrix/batch-9-status.md.
- Batch 10 (cluster-3 scooters Part 1): 25 articles published 2026-09-23 (MM-0392–MM-0416) — see docs/matrix/batch-10-status.md.
- Batch 11 (cluster-3 scooters Part 2): 25 articles published 2026-09-23 (MM-0417–MM-0441, part-commits 57ee6be/f93489c/978d63f/90b2e23) — see docs/matrix/batch-11-status.md. 507 articles site-wide at that state.
- Batch 12 (cluster-3 scooters Part 3): 25 articles published 2026-09-23 (MM-0442–MM-0466: 3 Yamaha model reviews, 12 model comparisons, 6 verified-data choosing guides, 4 spec explainers; part-commits d80b634/8db94c4/f81cf7c/d06dae8) — see docs/matrix/batch-12-status.md. 532 articles site-wide; cluster 3: 75 of 110 intents published.
- Batch 13 (cluster-3 scooters Part 4, final part): 35 articles published 2026-09-23 (MM-0467–MM-0501: 13 model comparisons, 10 verified-data choosing guides, 12 spec explainers; part-commits a58bb52/37abf1c, front-matter repair b4c9808, inbound links in the batch-13 closing commit) — see docs/matrix/batch-13-status.md. 567 articles site-wide; cluster 3: 110 of 110 intents published, COMPLETE.
- Batch 14 (cluster-4 motorcycle reviews Part 1): 25 articles published 2026-09-23 (MM-0502-MM-0526: 10 model reviews, 10 model comparisons, 3 verified-data choosing guides, 2 spec explainers; part-commits 789fe6a/a36d06d/a04221b/6b7e8f6, closing inbound-link commit b09f75c) - see docs/matrix/batch-14-status.md. 592 articles site-wide; cluster 4: 25 of 106 intents published, IN PROGRESS.
- Batch 15 (cluster-4 motorcycle reviews Part 2): 50 articles published 2026-09-23 (MM-0527-MM-0576: 17 model c
omparisons,
 8 verified
-data choosing guides, 25 spec explainers; part-commits 6135732/57676f8/df488df/6f956eb/3b35570, closing commit 791603a, link repair 66809b8, assistant-core repair b495db8) - see docs/matrix/batch-15-status.md. 642 articles site-wide; cluster 4: 75 of 106 intents published, IN PROGRESS. All technical facts from the verified Honda VN/Yamaha VN MODEL-DATABASE rows; business facts exclusively from OWNER-FACTS; no Suzuki/SYM/PG-1/MSX facts written.
- Batch 16 (cluster-4 motorcycle reviews Part 3): 31 articles published 2026-09-24 (MM-0577-MM-0607: 14 model comparisons, 8 verified-data choosing guides, 9 spec explainers; part-commits 6dfc122/c05daab/c1d28db/aae7882/a29bf8a/1873c0e/9cb2dd6/d801f66, link repairs 16d3604/d89480d, closing commit 88e63ab, internal-link and wrap repair 769a218) - see docs/matrix/batch-16-status.md. Cluster 4 COMPLETE: 106 of 106 planned intents published. A second scheduled run produced the same batch concurrently; reconciled per docs/matrix/batch-16-overlap-reconciliation.md - 2 supplementary articles retained (honda-wave-alpha-vs-honda-cbr150r, honda-blade-vs-honda-winner-r; MM-0608/MM-0609). 675 articles site-wide; /topics/motorcycles/ lists 108 guides. All technical facts from the verified Honda VN/Yamaha VN MODEL-DATABASE rows; business facts exclusively from OWNER-FACTS; no Suzuki/SYM facts written.
- _queue/: empty (no drafts pending).
- Batch 18 (cluster-5 manual & clutch Part 2, final): 27 articles published 2026-09-24 (MM-0638-MM-0664: 6 manual-clutch technique guides, 8 semi-auto technique guides, 8 manual-model guides on verified Honda/Yamaha data, 5 renting-owning guides; part-commits 4eb36eb, ad3b04b, slug repairs 3c58a41 and a3b0b3b, part 3 17b372d, closing inbound-link commit f03394a). 730 articles site-wide; cluster 5: 55 of 55 intents published, COMPLETE. See docs/matrix/batch-18-status.md.
- Batch 17 (cluster-5 manual & clutch Part 1): 28 articles published 2026-09-24 (MM-0610-MM-0637: 10 manual-clutc
h learning-t
echnique gui
des, 10 semi-auto technique/renting guides, 8 manual/semi-auto model articles including the manufacturer-verified Yamaha PG-1 review and three PG-1 comparisons; part-commits f91228f, d0e2e40, 2ecad39, slug repair 4c61880, 8 inbound-link commits). 703 articles site-wide; cluster 5: 28 of 55 intents published, IN PROGRESS. All model facts from verified Honda VN / Yamaha VN MODEL-DATABASE rows (PG-1 retrieved 2026-09-24); business facts exclusively from OWNER-FACTS. See docs/matrix/batch-17-status.md.

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

Legal source validation: a 
legal article
 may stay pub
lished while REVIEW_REQUIRED. A legal article can only be considered VERIFIED when sources[] cites at least one class A primary legal domain (chinhphu.vn, vanban.chinhphu.vn, bocongan.gov.vn, *.gov.vn per docs/SOURCE-MAP.md). Secondary sources (t
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
- Batch 
16 (cluster-4 
motorcycle Par
t 3, MM-0577-MM-0607) was published 2026-09-23/24 in part-commits 6dfc122 (concurrent-run overlap, 9 articles), c05daab, c1d28db, aae7882, a29bf8a, 1873c0e, 9cb2dd6, d801f66, link repairs 16d3604 and d89480d, closing commit 88e63ab (inbound links + matrix rows), with the overlap reconciled in 9406764 (docs/matrix/batch-16-overlap-reconciliation.md; 2 supplementary articles retained: honda-wave-alpha-vs-honda-cbr150r, honda-blade-vs-honda-winner-r). The Quality Gates on commits c05daab through 88e63ab FAILED at the internal-link audit (missing slug honda-wave-alpha-vs-super-cub referenced in two articles and a quote-mangled internal_link_targets line in best-110cc-underbones-vietnam-verified.md, plus mid-word line-wrap corruption in several articles). All repaired in commit 769a218: 2 target slugs corrected to honda-wave-alpha-vs-honda-super-cub, the quote-mangled line rebuilt with 16 verified targets, wrap corruption joined; gate on 769a218 verified success (commit checks page). Commits a45eeef and 80b0bff are empty reconciliation commits that changed nothing. Live verification: /articles/ renders the 675-guide total, /topics/motorcycles/ renders the 108-guide count, and repaired article pages (honda-wave-alpha-110-review, honda-future-125-review) verified live with the corruption removed.
- Docs-sync state commits: the batch-15 finalization (bot commit e569f65) merged the 50 batch-15 rows (592 -> 642) and applied the batch-15 README/MASTER-MATRIX state; the batch-16 finalization run (scripts/apply-batch-16-docs.js, payload docs/sync/batch-16-docs-sync.json) merges the 31 batch-16 rows plus the 2 batch-16b rows (642 -> 675) and applies the batch-16 README/MASTER-MATRIX state updates.
- Batch-15 state for reference: gate run 35901347073 on b495db8, Pages run 35901345994, 642 articles. Batch-14 state: implementation commit b09f75c, gate run 35874723441, Pages run 35874723270.
- - Batch 20 (cluster-7 electric Part 1, MM-0705-MM-0754) was p
ublished 2026-0
9-24 in part-commits 7577a01 (10), f46d74c (10), 0bd9c45 (10), f85f4be (9) and bc2dd6a (11), with the closing docs commit 9759861 (rows/status/MODEL-DATABASE/README/MASTER-MATRIX) and the inbound-link commit adding targets from 12 existing articles. Gates on the part-commits 7577a01 through f85f4be failed at the internal-link audit on forward references to slugs published in later parts (expected mid-batch state); the final-state gate result on the closing commits is recorded in docs/matrix/batch-20-status.md and below. VERIFIED FINAL STATE: link-repair commit a2c0110 (replaced nonexistent slug a1-licence-electric-examples with dat-bike-weaver-plus-plus-review in fast-electric-motorbike-licence-vietnam); Quality Gate run 35930437593 (#181) on a2c0110 SUCCESS; Pages build run 35930436962 (#212) on a2c0110 SUCCESS (1m 58s); live verification 2026-09-24: /topics/electric/ lists 50 guides, /articles/ lists 820 guides, and spot-checked batch-20 pages (what-is-electric-motorbike-vietnam, vinfast-feliz-ii-review, dat-bike-weaver-plus-plus-review, yadea-e-bikes-vietnam, v-green-battery-swap-vietnam, where-to-charge-electric-motorbike-hanoi, why-electric-mopeds-capped-50kmh-vietnam, electric-motorbike-day-trips-range-planning-hanoi) all render live.
- - Batch 21 (cluster-7 electric Part 2, final, MM-0755-MM-0793) was published 2026-09-24 in part-commits d328f7b (8 articles MM-0755-MM-0762), e08b147 (9 articles MM-0763-MM-0771), a9c9812 (9 articles MM-0772-MM-0780), a05ab86 (9 articles MM-0781-MM-0789) and fe9d10a (4 articles MM-0790-MM-0793), with the closing inbound-link commit 7b52fe0 adding link targets from 14 existing articles. Gates on the part-commits d328f7b, e08b147 and a9c9812 failed at the internal-link audit on forward references to slugs published in later parts (expected mid-batch state); VERIFIED FINAL STATE: Quality Gate run 35936140161 on a05ab86 SUCCEEDED, Quality Gate run 35936174657 (#187) on fe9d10a SUCCEEDED, Quality Gate run 35936236158 (#188) on 7b52fe0 SUCCEEDED, and Pages build run 35936235790 (#219) on 7b52fe0 SUCCEEDED. Live verification 2026-09-24: /topics/electric/ lists the 89 cluster-7 guides, /articles/ lists 859 guides, and batch-21 pages render live. Cluster 7 is COMPLETE: 89 of 89 intents published via Batches 20-21; 859 published articles site-wide.
README-only state updates may create a newer HEAD than the SHAs recorded here; the values a
bove always refer to the last implementation commit whose CI/deploy was actually verified.
# NEXT RECOMMENDED STEP
Batch 21 (cluster-7 electric Part 2, final) is published (2026-09-24): 39 articles (MM-0755-MM-0793; part-commits d328f7b, e08b147, a9c9812, a05ab86, fe9d10a, closing inbound-link commit 7b52fe0), 859 published articles site-wide, cluster 7 COMPLETE: 89 of 89 intents published via Batches 20-21. All model facts came from verified VinFast / Dat Bike / Yadea MODEL-DATABASE rows (retrieved 2026-09-24; Yadea spec fields left empty because the official spec tables were not readable, so no Yadea specs were written); legal articles cite the VERIFIED class A primary sources (Law 36/2024/QH15 and Decree 168/2024 on xaydungchinhsach.chinhphu.vn); business facts exclusively from OWNER-FACTS. Next per the MASTER-MATRIX production plan: clusters 12-14 (Hanoi travel 54, motorbike trips from Hanoi 38, Vietnam travel 30 intents; R2 route/place verification from reliable sources before writing each batch).