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
| _includes/ | header.html, footer.html (collapsed accordions), breadcrumbs.html, contact-cta.html |
| topics/<cluster>/index.md | 14 topic hubs: rental, monthly-rental, scooters, motorcycles, manual-clutch, 50cc, electric, maintenance, parts-gear, safety, law-licences, hanoi, trips, vietnam-travel |
| articles/index.md | All Motorbike Guides — true all-article index, grouped by cluster |
| index.html | Homepage: hero + search, topic tiles with counts / "Coming soon", latest guides, contact CTA |
| search.md, search.json | Client-side search page and index |
| about.md, 404.html | Static pages |
| sitemap.xml | Liquid-generated: home, /articles/, /about/, /search/, 14 hubs, all articles |
| robots.txt | Allows all, points to sitemap |
| assets/css/main.css, assets/js/main.js | Design tokens, Light/Dark/Auto theme, nav, search |
| scripts/ | QA toolkit (see SEO / QA SYSTEM) |
| .github/workflows/quality-gate.yml | CI quality gate |
| docs/ | OWNER-FACTS.md, SOURCE-MAP.md, CUSTOMER-INTENTS.md, MODEL-DATABASE.md, MASTER-MATRIX.md, TAXONOMY.md, matrix/master-matrix.csv (988 intents), matrix/batch-1-status.md, data/intents.csv |

# CURRENT STATE

Date: 2026-09-20
- Jekyll site live on GitHub Pages, baseurl /english, English-only UI.
- Theme toggle (Light/Dark/Auto), responsive + sticky mobile nav, client-side search, breadcrumbs, collapsed accordion footer, contact CTAs.
- 10 published articles, all in cluster law-licences, all marked REVIEW_REQUIRED.
- 14 topic hubs live; 13 currently show the empty state ("Guides for this topic are being prepared."); law-licences hub lists all 10 articles.
- Homepage shows active hubs with counts first, empty hubs marked "Coming soon".
- SEO/QA toolkit live in scripts/ with a passing quality gate workflow.

# COMPLETED / VERIFIED

- Hub architecture: /articles/ is the all-guides index; the law hub is /topics/law-licences/ only; hub links resolved deterministically by permalink (commit 410750f0).
- Malformed double-quoted YAML in 9 article front matters fixed (title/description only, no content changes).
- Sitemap covers all 28 indexable URLs (4 core pages + 14 hubs + 10 articles) — verified against live sitemap.
- Empty hub states render intentionally; homepage no longer looks broken.
- Footer accordions collapsed by default; law link wall reduced to hub + 4 featured + All law guides.
- Quality toolkit: 7 scripts, zero dependencies, all run clean (P0=0, P1=0, P2=16, P3=9 on current content).
- Quality Gate workflow runs on push/PR/dispatch and passes (run 35483885564, commit ecb6d3d3).

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
- Latest verified implementation commit: ecb6d3d354a9896e05129e1d679616679f47af46 (quality toolkit with Liquid-aware sitemap rendering).
- Latest verified Quality Gate run: 35484080284 = SUCCESS.
- Latest verified Pages run: 35484079926 = BUILD SUCCESS + DEPLOY SUCCESS.
- README-only state updates may create a newer HEAD than the SHAs recorded here; the values above always refer to the last implementation commit whose CI/deploy was actually verified. The QA-hardening commit that follows this README update records its own verification in the CHANGE LOG entry below once observed.

# NEXT RECOMMENDED STEP

Verify the 10 REVIEW_REQUIRED legal articles against primary legal sources (Decree 168/2024/ND-CP fine clauses, helmet clause, Circular 12/2025/TT-BCA IDP conversion), clear their review_status, then resume Batch 1 (remaining ~58 law-licence articles).

# CHANGE LOG

- 2026-09-20 (2): QA hardening — centralized blocking rule (lib.isBlocking) across all validators; rendered-site-audit.js added and wired into quality-gate.yml with a real Jekyll build (actions/jekyll-build-pages); Liquid-aware orphan detection; corrected report metrics (TOTAL PAGES = indexable set, MISSING SCHEMA/MISSING META mapped precisely, no double counting); conservative legal source validation (VERIFIED requires class A primary legal domains); README deployment-state wording fixed to avoid self-referential SHA drift.
- 2026-09-20: Added SEO + content quality toolkit (scripts/, quality-gate workflow); fixed hub architecture (/articles/ = all guides, deterministic hub links, empty hub states, footer/sitemap fixes); fixed malformed YAML in 9 article front matters. Restructured README as project brain (this file).
- 2026-09-19: Visual redesign deployed; 10 legal articles published; data foundation (docs/) established; 14 topic hubs + all-guides index created.
