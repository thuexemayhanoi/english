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
|---|---|
| _config.yml | Jekyll config. baseurl /english, articles collection permalink /articles/:title/ |
| _articles/ | Published articles (front matter: title, slug, description, category, tags, content_type, search_intent, topic_cluster, subcluster, date_published, last_reviewed, review_status, sources, internal_link_targets) |
| _queue/ | Unpublished drafts, excluded from output |
| _layouts/ | default.html, article.html (BlogPosting schema, review banner, related links), cluster.html (topic hub with count + empty state) |
| _includes/ | header.html (parent-child dropdown nav + live status pill), footer.html (site-map accordions + social/external links), breadcrumbs.html, contact-cta.html, contact-sheet.html (mobile contact action sheet), guide-assistant.html (static Guide Assistant UI + public business-facts JSON injection) |
| _data/navigation.yml | Single source of truth for navigation taxonomy: 5 parent groups over the 14 clusters + utility (Search/FAQ/Contact) and legal (Privacy/Terms) links; used by header and footer |
| topics/<cluster>/index.md | 14 topic hubs: rental, monthly-rental, scooters, motorcycles, manual-clutch, 50cc, electric, maintenance, parts-gear, safety, law-licences, hanoi, trips, vietnam-travel |
| articles/index.md | All Motorbike Guides — true all-article index, grouped by cluster |
| index.html | Homepage: hero + search, quick-action grid, parent section cards with child links + counts, latest guides, contact CTA |
| search.md, search.json | Client-side search page (icon + clear button + suggested topics) and index |
| assistant-index.json | Guide Assistant knowledge index: title, description, url, topic_cluster, tags, review_status, stripped article text — lazy-loaded on first assistant open |
| _data/assistant-business.yml | Curated public business facts for the Guide Assistant (ONLY approved OWNER-FACTS entries; no internal status labels) |
| assets/js/assistant.js | Static client-side Guide Assistant: deterministic retrieval (synonyms, stopwords, light stemming, weighted scoring) over assistant-index.json + business facts; no external AI/API |
| manifest.webmanifest | PWA preparation (standalone, theme_color, /english/ scope); no service worker yet |
| assets/img/logo.svg | Original 512x512 motorbike logo (blog repo's Logo moto.png, byte-exact PNG embedded in an SVG wrapper — the GitHub write tooling cannot transfer raw binary, so PNG bytes are carried inside text SVG files) — apple-touch-icon + manifest 512 |
| assets/img/icon-192.svg | 192x192 icon derived from the same logo (area-averaged downscale, same palette, 4.3KB PNG payload) — favicon, manifest 192, header brand logo |
| assets/img/bikes/ | Featured rental bike photos for the homepage showcase (SVG-wrapped byte-exact embeds of the owner's catalog photos) |
| about.md, faq.md, contact.md, privacy.md, terms.md, 404.html | Static pages (About kept as informational page; FAQ links to guides; Contact holds verified business contact facts; Privacy/Terms are informational-site policies) |
| sitemap.xml | Liquid-generated: home, /articles/, /about/, /search/, 14 hubs, all articles |
| robots.txt | Allows all, points to sitemap |
| assets/css/main.css, assets/js/main.js | Design tokens, Light/Dark/Auto theme, nav, search |
| scripts/ | QA toolkit (see SEO / QA SYSTEM) |
| .github/workflows/quality-gate.yml | CI quality gate |
| docs/ | OWNER-FACTS.md, SOURCE-MAP.md, CUSTOMER-INTENTS.md, MODEL-DATABASE.md, MASTER-MATRIX.md, TAXONOMY.md, matrix/master-matrix.csv (988 intents), matrix/batch-1-status.md, data/intents.csv |

# CURRENT STATE

Date: 2026-09-20
- Jekyll site live on GitHub Pages, baseurl /english, English-only UI.
- Theme toggle (Light/Dark/Auto), parent-child header navigation (desktop dropdowns + mobile accordion panel, keyboard accessible), 4-item mobile bottom nav (Home/Guides/Search/Contact -> /contact/), client-side search, breadcrumbs, footer as secondary site map, contact CTAs.
- Utility pages live: /about/, /faq/, /contact/, /privacy/, /terms/ — all indexed, in sitemap, linked from nav/footer.
- 10 published articles, all in cluster law-licences, all marked REVIEW_REQUIRED.
- 14 topic hubs live; 13 currently show the empty state ("Guides for this topic are being prepared."); law-licences hub lists all 10 articles.
- Homepage shows active hubs with counts first, empty hubs marked "Coming soon".
- App-shell UI pass: compact sticky app bar with safe-area support and a live shop-status pill (open/closed dot by Hanoi time, 09:00–21:00); mobile homepage redesigned as an app dashboard (hero + search, quick-action grid, parent section cards with child links + counts); native-style bottom tab bar with active indicator and aria-current; mobile contact action sheet (Call/WhatsApp/Zalo/Address/Main website) triggered from the bottom-nav and quick-action Contact; improved search page (icon, clear button, suggested topics); designed empty states; PWA preparation (manifest.webmanifest + SVG icon, no service worker yet).
- SEO/QA toolkit live in scripts/ with a passing quality gate workflow.

# COMPLETED / VERIFIED

- Hub architecture: /articles/ is the all-guides index; the law hub is /topics/law-licences/ only; hub links resolved deterministically by permalink (commit 410750f0).
- Malformed double-quoted YAML in 9 article front matters fixed (title/description only, no content changes).
- Sitemap covers all 32 indexable URLs (verified against live sitemap and build report).
- Empty hub states render intentionally; homepage no longer looks broken.
- Footer accordions collapsed by default; law link wall reduced to hub + 4 featured + All law guides.
- Quality toolkit: 7 scripts, zero dependencies, all run clean (P0=0, P1=0, P2=16, P3=9 on current content).
- Quality Gate workflow runs on push/PR/dispatch and passes (run 35483885564, commit ecb6d3d3).
- Navigation IA: full 14-cluster taxonomy exposed as parent -> child in header (Rent a bike / Choose a bike / Ride & maintain / Rules / Explore), mobile accordion panel, and footer site map; all driven from _data/navigation.yml; accessible dropdowns (aria-expanded/aria-controls, Escape, outside-click, focus-visible, ArrowDown); bottom nav simplified to Home / Guides / Search / Contact.
- App-shell UI pass: three-tier responsive app feel (phone app-like / tablet hybrid / desktop editorial). Live status pill (open/closed by Asia/Ho_Chi_Minh time, updates every minute, aria-label announces Open/Closed + hours, no OPEN/CLOSED word). Homepage dashboard: hero+search, 6-icon quick-action grid (Rent/Choose/Laws/Safety/Trips/Contact), parent section cards (icon, title, child links, guide count, "Coming soon" styling when empty). Native bottom tab bar with safe-area padding, active top indicator, aria-current, >=52px touch targets. Contact action sheet (bottom sheet, focus management, Escape/backdrop close, links in HTML not JS-only) triggered from bottom-nav Contact and quick-action Contact on <=640px (desktop falls through to /contact/). Search page: search-field with icon + clear button + suggested-topics chips (shown when no query). Designed empty states on hub pages. PWA preparation only: manifest.webmanifest (standalone, theme_color, /english/ scope) + original SVG icon; no service worker. No new crawlable routes; canonical hub links remain in HTML.

# OPEN ISSUES

1. All 10 published legal articles are REVIEW_REQUIRED: exact Decree 168/2024 fine clauses, helmet clause figures, IDP recognition details under Circular 12/2025/TT-BCA need verification against primary legal text before review banners can be cleared.
2. 4 P2 warnings: missing meta description on about.md / search.md; homepage relies on site defaults (title/description); body H1 alongside layout title H1 on about.md / search.md.
3. 9 P3 recommendations: meta descriptions longer than 165 chars on several articles; one title over 65 chars.
4. 13 topic clusters have zero published articles.
5. Full 6-12 month GSC export not yet available for matrix prioritization (documented in SOURCE-MAP.md).

# MASTER MATRIX STATE

- docs/matrix/master-matrix.csv holds 988 intents across the 14 clusters.
- Cluster order for batches: law-licences (batch 1, ~68 intents) -> rental -> monthly-rental -> safety -> maintenance -> then model/travel clusters.
- docs/matrix/batch-1-status.md is the authoritative publish/review status for batch 1.

# CONTENT BATCH STATE

- Batch 1 (law-licences): 10 of ~68 published; all 10 REVIEW_REQUIRED. Remaining ~58 law-licence articles on hold until the 10 are verified.
- Batches 2+: not started.
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

Legal source validation: a legal article may stay published while REVIEW_REQUIRED. A legal article can only be considered VERIFIED when sources[] cites at least one class A primary legal domain (chinhphu.vn, vanban.chinhphu.vn, bocongan.gov.vn, *.gov.vn per docs/SOURCE-MAP.md). Secondary sources (thuvienphapluat.vn etc.) never satisfy VERIFIED on their own. Metadata/status consistency only — article facts are never rewritten by tooling.

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
- Latest verified implementation commit: 6304f2b8140be5e658cac5e8987c945d98ce3c81 (legal verification pass: 10 law-licence articles verified against primary sources).
- Latest verified Quality Gate run: 35628910295 = SUCCESS (head 6304f2b).
- Latest verified Pages run: 35628912529 = BUILD SUCCESS + DEPLOY SUCCESS (head 6304f2b).
- README-only state updates may create a newer HEAD than the SHAs recorded here; the values above always refer to the last implementation commit whose CI/deploy was actually verified.

# NEXT RECOMMENDED STEP

Legal verification pass complete (2026-09-21): all 10 published law-licence articles verified against the full text of Law 36/2024/QH15, Decree 168/2024/ND-CP and Circular 12/2025/TT-BCA; material corrections applied (licence class structure, fine clauses, IDP rules); review_status cleared to VERIFIED. See docs/matrix/batch-1-status.md. Next: resume Batch 1 (remaining ~58 law-licence articles).

# CHANGE LOG

- 2026-09-22 (15): Trust-page expansion — /about/, /privacy/ and /terms/ rebuilt as substantial core pages (about 1,770 / 1,670 / 1,660 visible words respectively). About: full Who-we-are (verified business facts from OWNER-FACTS), what the English guide covers, how business facts are verified (owner-maintained truth source, availability always confirmed, no unsupported promotions), legal-research method (Vietnamese primary texts → government sources → treaty sources → secondary discovery only; informational not legal advice), technical-content principles (manufacturer-preferred specs, no invented torque/oil/electrical/interval values), rental periods/policies, why the site exists, and editorial-update policy. Privacy: rebuilt to describe actual functionality — no accounts/payments/analytics/newsletter/CRM, cautious hosting wording; theme localStorage; Guide Assistant as client-side retrieval (no external AI API, page-memory history, cleared on leave); contact via tel/WhatsApp/Zalo links only (no server-side form — describes what happens after the user opens WhatsApp); Google Maps embed disclosure; external links; GitHub Pages hosting; first-party vs third-party cookie distinction (no "no cookies whatsoever" overclaim); retention, children, security (no "100% secure" claims), how to avoid third-party parts, choices, updates, contact. Terms: informational-website terms (explicitly NOT the rental contract) covering scope, informational purpose, no legal advice (with worked examples of why licence/fine details go stale), enquiries-are-not-bookings, availability, prices (published = owner-approved at display time; confirmed arrangement governs; no inferred prices), deposit/return/insurance principles plus delivery caution, rider responsibility, Guide Assistant (retrieval convenience, REVIEW_REQUIRED signpost behaviour), technical/maintenance, travel, external services, plain-English IP, availability, measured reliance clause, changes, and full contact block. No URL, taxonomy, schema or architecture changes; one H1 per page; all facts sourced from OWNER-FACTS and the VERIFIED legal articles. QA: P0=0, blocking P1=0, broken links=0, sitemap gaps=0, gate PASS.

- 2026-09-22 (14): Contact map + FAQ/AI-search pass. /contact/ now has an embedded Google Maps card ("Visit Nguyen Tu") using an address-based output=embed iframe for the verified business location (share link resolved to "Thuê xe máy ở Hà Nội - Nguyễn Tú, 112 Đ. Nguyễn Văn Cừ, Bồ Đề, Hà Nội" — matches the approved address); the maps.app.goo.gl short link kept as a visible "Open in Google Maps" link; responsive 16:10 aspect-ratio card, lazy iframe; contact info + map in a balanced two-column desktop layout (single column below 900px). Added one LocalBusiness JSON-LD (name, alternateName, url, telephone, address, openingHours, hasMap — verified facts only, no ratings/geo/priceRange). privacy.md updated with an accurate "Embedded Google Maps" section. /faq/ rebuilt as a 52-question customer FAQ in 7 sections (Renting 8, Prices 11, Choosing a bike 7, Licences 10, Safety 7, Location 5, Maintenance 4) with H2 sections, H3 questions, a jump-to nav, direct-answer-first style, contextual internal links to the 10 VERIFIED legal articles and topic hubs; visible crawlable HTML, no JS injection, no FAQPage/QAPage schema (Google no longer shows FAQ rich results). OWNER-FACTS price table synchronized with the owner-approved 2026-09-22 rates (Yamaha Sirius 150k/day, E-Bike 200k/day, Honda Click and Yamaha Mio split into separate rows).

- 2026-09-22 (13): Added a premium "Featured rental bikes" showcase section to the homepage (between the quick actions and Explore). Six bike cards — Honda Vision, Honda Air Blade, Honda Wave, Yamaha Sirius, Yamaha Mio, E-Bike — each with model name, one category line, daily price, "Contact us to confirm availability." note and an Ask Nguyen Tu CTA to /contact/. 3-column desktop grid, 2-column tablet, single column mobile; hover lift on desktop only; existing tokens, light/dark compatible. Bike photos copied from repo-root originals into assets/img/bikes/ as SVG-wrapped byte-exact embeds (same technique as logo.svg — the GitHub write tooling cannot transfer raw binary); images lazy-loaded, 800x600, object-fit contain on a 4:3 media area. Honda Vision uses IMG_2972.PNG (showroom Vision shot); Scooter Automatic 50cc.JPG rejected (it is a SYM Jet 50, not a Vision). Model spelling corrected to "Honda Air Blade". NOTE (owner): E-Bike 200,000 VND/day and Yamaha Sirius 150,000 VND/day were published per direct owner instruction on 2026-09-22 but are not yet in docs/OWNER-FACTS.md's price table — update the fact store to match.

- 2026-09-22 (12): Added the Guide Assistant — a static client-side helper (NOT an AI chatbot; no external model/API/server). One floating "Ask Nguyen Tu" button (desktop: right-side 380px drawer; mobile: compact button above the bottom nav opening a 92dvh bottom sheet with safe-area insets). Answers come from a new assistant-index.json (published articles: title/description/url/topic_cluster/tags/review_status/stripped text, lazy-loaded on first open) plus _data/assistant-business.yml curated strictly from APPROVED OWNER-FACTS entries (identity, hours, published prices only, deposit, late return, no-insurance, payments, cautious delivery wording, availability fallback). Deterministic retrieval with synonym groups, English stopwords, light stemming and weighted scoring (title/tags/description/text); REVIEW_REQUIRED sources answered conservatively; low-confidence questions fall back to search/contact links without guessing. Single-overlay rule via a shared overlay:opening event: Guide Assistant and the Contact sheet can never be open together; Escape/X/backdrop close, scroll lock, focus restoration and a race-free backdrop hide (mirrors the hardened contact-sheet pattern). Chat history is page-memory only; no tracking, no persistence. Assistant responses are not crawlable pages and are not in the sitemap; source links point to canonical article URLs. Suggested-question chips: Rental prices, Monthly rental, Do I need a licence?, 50cc rules, Where are you?, Opening hours.

- 2026-09-21 (12): Legal verification pass — all 10 published law-licence articles verified against primary sources (full text of Law 36/2024/QH15 and Decree 168/2024/NĐ-CP via chinhphu.vn portals, bocongan.gov.vn summaries, Circular 12/2025/TT-BCA, UN Treaty Collection/UNECE for the Vienna Convention). Major corrections: licence classes fixed to the actual Article 57 structure (A1 ≤125cc/≤11 kW, A above, B1 three-wheel — the previously published A/A2 175cc tiers do not exist in the new law); all "pending verification" fine figures clause-verified (helmet, phone, alcohol bands with points/suspension, no-licence by engine size); IDP recognition grounded in Article 58(6) plus the carry-both-documents fine; moped/e-bike definitions grounded in Article 3; overstated 16–18 training requirement removed; secondary luatvietnam.vn citations replaced with primary URLs. review_status: VERIFIED on all 10; last_reviewed 2026-09-21; date_published unchanged. Batch 1 unlocked (see docs/matrix/batch-1-status.md).

- 2026-09-21 (11): Small hardening/cleanup pass — (1) fixed the contact-sheet backdrop race: closeSheet now uses a single stored backdrop-hide timer that openSheet clears and closeSheet restarts, and the timer only hides the backdrop if the sheet is still closed (close-then-quick-reopen can no longer hide a live backdrop); (2) fixed a broken `align-items` declaration (stray line break) in .empty-state; (3) synced README deployment state and sitemap count to current verified values; (4) adopted the existing motorbike logo (Logo moto.png from the blog repo) as the site branding: favicon, apple-touch-icon, manifest icons (512 + 192) and header brand logo (24px, no header height change); the original 512x512 PNG bytes are embedded byte-exact in SVG wrappers (assets/img/logo.svg) because the GitHub write tooling corrupts raw binary uploads, and a 192x192 variant (assets/img/icon-192.svg, area-averaged downscale from the same palette) serves the favicon, manifest and header; generic icon.svg removed. Note: iOS does not render SVG apple-touch-icons (same limitation as the previous generic SVG icon); replacing the wrappers with plain PNGs via a binary-capable upload path would remove that limitation.

- 2026-09-20 (10): Removed the experimental floating utility dock entirely (owner tested on iPhone Safari; redundant with the Contact sheet) — deleted _includes/utility-dock.html, its include in default.html, all dock CSS (buttons, tokens, sheet-panel generalization, chat placeholder) and all dock JS (openDockPanel/closeDockPanel/activePanel, dock backdrops, data-panel-close listeners). Contact sheet restored to a single clean openSheet/closeSheet state flow with its own Escape handler. Footer social pills, bottom nav, header, theme system and all routes/SEO untouched. A floating "AI Assistant" button may return only when a real local assistant exists.

- 2026-09-20 (9): Quick-actions refinement — removed the Explore section (Facebook/TripAdvisor/Pinterest/SoundCloud/blog) from the Quick Actions sheet; it now contains only practical contact actions (Call/Zalo/WhatsApp/Map/Main website). Social/external destinations live in the footer only, redesigned as rounded icon pills (.social-pill) in the Elsewhere column; the /blog/ link relabeled "Vietnamese blog". Unused .sheet-section-label CSS removed; openSheet now closes any open dock panel so sheets never stack.

- 2026-09-20 (8): Floating utility dock (<=1024px only) — two rounded premium buttons above the bottom tab bar on phones: Chat (opens an honest placeholder panel for a future local assistant; no fake backend) and Quick actions (bottom sheet with Call/Zalo/WhatsApp/Map/Main website plus Facebook/TripAdvisor/Pinterest/SoundCloud/English blog). Sheets share the contact-sheet pattern (backdrop, Escape, focus management, follow-then-close); Escape now also closes the contact sheet. Social/external links also added to the footer Elsewhere column. Dock hidden on desktop; charcoal token set for light/dark themes.
- 2026-09-20 (7): Hamburger fix — restored .nav-toggle display rule inside the 1279px breakpoint (regression in faff8cd6).

- 2026-09-20 (6): App-shell UI pass — compact sticky app bar with env(safe-area-inset-*) support; live shop-status pill (open/closed dot computed from Asia/Ho_Chi_Minh time, 09:00–21:00, updates every minute, aria-label announces Open/Closed + hours, no visible word); mobile homepage redesigned as an app dashboard (hero+search, 6-item quick-action grid, parent section cards with child links + guide counts + "Coming soon" styling); native-style bottom tab bar (safe-area padding, active top indicator, aria-current, >=52px touch targets); mobile contact action sheet (Call/WhatsApp/Zalo/Address/Main website, focus management, Escape/backdrop close, links in HTML); search page improved (icon + clear button + suggested-topic chips); designed empty states on hub pages; PWA preparation (manifest.webmanifest + original SVG icon, no service worker). Desktop stays editorial; sheet only intercepts <=640px, otherwise falls through to /contact/. No new crawlable routes; all canonical hub links stay in HTML.
- 2026-09-20 (5): Responsive header fix — three-tier breakpoints (>=1280px wide desktop with expanded 1480px header container + More dropdown, 641-1279px hamburger panel, <=640px phone + bottom nav); brand responsive labels (full on >=769px, compact on smaller); right-edge dropdown alignment for Explore/More; white-space:nowrap on all nav items; body container stays 1160px.
- 2026-09-20 (4): Navigation correction — About kept and moved before Guides; added FAQ (/faq/), Contact (/contact/), Privacy Policy (/privacy/), Terms & Conditions (/terms/) pages; header order Home/About/Guides + topic groups + Search/FAQ/Contact, with Privacy/Terms in the mobile panel and footer Discover column; bottom nav Contact now targets /contact/; sitemap and QA expectations extended to 32 indexable URLs.
- 2026-09-20 (3): Navigation/IA pass — _data/navigation.yml centralizes the parent->child taxonomy (5 groups over 14 clusters); header rebuilt with accessible disclosure dropdowns + mobile accordion panel sharing one markup; footer rebuilt as a secondary site map (5 guide groups + Discover + verified contact facts incl. Zalo); mobile bottom nav simplified to Home/Guides/Search/Contact; docs/TAXONOMY.md synchronized with the implemented 14-cluster set (parts-gear supersedes parts-accessories).
- 2026-09-20 (2): QA hardening — centralized blocking rule (lib.isBlocking) across all validators; rendered-site-audit.js added and wired into quality-gate.yml with a real Jekyll build (actions/jekyll-build-pages); Liquid-aware orphan detection; corrected report metrics (TOTAL PAGES = indexable set, MISSING SCHEMA/MISSING META mapped precisely, no double counting); conservative legal source validation (VERIFIED requires class A primary legal domains); README deployment-state wording fixed to avoid self-referential SHA drift.
- 2026-09-20: Added SEO + content quality toolkit (scripts/, quality-gate workflow); fixed hub architecture (/articles/ = all guides, deterministic hub links, empty hub states, footer/sitemap fixes); fixed malformed YAML in 9 article front matters. Restructured README as project brain (this file).
- 2026-09-19: Visual redesign deployed; 10 legal articles published; data foundation (docs/) established; 14 topic hubs + all-guides index created.
