# English Motorbike Knowledge Hub — Project Map

Repository: thuexemayhanoi/english
Live site: https://thuexemayhanoi.github.io/english/
Business: Hanoi Motorbike Rental Nguyen Tu (https://thuexemaynguyentu.com/)

## Current state (2026-09-19)

- Jekyll site live on GitHub Pages, baseurl /english, English-only UI
- Theme toggle (Light/Dark/Auto), mobile nav, client-side search, breadcrumbs, accordion footer, contact CTAs
- Collections: _articles (published articles, permalink /articles/:slug/), _queue (excluded from output)
- 10 legal articles published (cluster law-licences), all currently marked REVIEW_REQUIRED pending re-verification of fine figures
- 14 topic cluster hubs live at /topics/<cluster>/ plus an all-guides index at /articles/
- Data foundation in docs/: OWNER-FACTS.md, SOURCE-MAP.md, CUSTOMER-INTENTS.md, MODEL-DATABASE.md, MASTER-MATRIX.md, TAXONOMY.md, matrix/master-matrix.csv (988 intents), matrix/batch-1-status.md, data/intents.csv
- SEO: sitemap.xml (Liquid-generated), robots.txt, BlogPosting schema per article, CollectionPage schema per hub, BreadcrumbList markup

## Next steps

1. Finish verification of the 10 REVIEW_REQUIRED legal articles (exact Decree 168/2024 fine clauses, helmet clause, IDP recognition details); then clear their review banners
2. Resume Batch 1 (remaining ~58 law-licence articles) only after the 10 corrections are verified
3. Batches 2+ follow cluster order: rental, monthly-rental, safety, maintenance, then model/travel clusters
4. Keep unpublished drafts in _queue/; publish 50-100 articles per batch commit
5. When a full 6-12 month GSC export becomes available, refine master-matrix.csv priorities (documented as a known limitation in SOURCE-MAP.md)

## Data stores (docs/)

| File | Purpose |
|---|---|
| OWNER-FACTS.md | Approved / unverified / do-not-use business facts. Highest authority for business claims |
| SOURCE-MAP.md | Reference sources, reliability classes A-D, usage rules |
| CUSTOMER-INTENTS.md | Real owner-histo
ry intents, GSC-derived intents, research-derived, generated expansions (clearly separated) |
| MODEL-DATABASE.md | Structured vehicle data from manufacturer sources |
| MASTER-MATRIX.md + matrix/master-matrix.csv | ~988 article intents with cluster, intent type, status, differentiation |
| matrix/batch-1-status.md | Authoritative publish/review status for batch 1 (CSV bulk rewrite deferred) |
| TAXONOMY.md | Cluster/subcluster definitions |

Precedence rule: FIRST-PARTY DATA > PRIMARY/OFFICIAL SOURCE > MANUFACTURER > SPECIALIST PUBLICATION > COMMERCIAL WEBSITE > FORUM.

## Site architecture

- layouts: default, article (BlogPosting schema, review banner, related links), cluster (topic hub)
- includes: header (nav + theme toggle), footer, breadcrumbs, contact-cta
- pages: home, /articles/ (all guides + topic directory), /topics/<cluster>/ (14 hubs), /search/, /about/, 404
- assets: assets/css/main.css, assets/js/main.js (theme + search)

## Workflow rules

- One commit per article batch (50-100 articles), never one commit per article
- Legal articles: primary sources only, last_reviewed recorded, legal facts separated from practical advice, review_status used for unverified content
- Business claims: OWNER-FACTS.md only; unknowns say "Contact us to confirm current availability"
- After each batch: verify live site (home, hubs, articles, search, sitemap, mobile)

## Content quality toolkit

QA tooling lives in scripts/ (plain Node.js, zero dependencies). It is build-time tooling only; GitHub Pages stays a static Jekyll site.

- scripts/frontmatter-check.js — required fields, duplicate slugs, legal/technical source rules
- scripts/content-duplicate-check.js — exact and near-duplicate title/slug/description detection
- scripts/internal-link-audit.js — broken links, orphans, hub/article connectivity
- scripts/seo-audit.js — titles, meta, canonicals, sitemap inclusion, H1, noindex
- scripts/sitemap-check.js — sitemap coverage vs indexable pages
- scripts/schema-check.js — JSON-LD syntax and field rules
- scripts/build-report.js — runs everything, writes reports/quality-latest.md

The quality gate (.github/workflows/quality-gate.yml) runs on push to main, pull requests, and manual dispatch. It fails only on P0 errors and clearly structural P1 errors; P2/P3 warnings do not block deployment. Reports are uploaded as workflow artifacts, never committed, so no commit loop occurs.

Severity scale: P0 = broken deployment/indexing, P1 = serious SEO/data issue, P2 = quality warning, P3 = recommendation.

### Batch production sequence

MATRIX SLICE -> WRITE ARTICLES -> FRONTMATTER CHECK -> DUPLICATE CHECK -> INTERNAL LINK CHECK -> SEO AUDIT -> SITEMAP CHECK -> SCHEMA CHECK -> QUALITY REPORT -> COMMIT -> PAGES DEPLOY -> RUNTIME VERIFY

Run the whole toolkit locally before each batch commit:

    node scripts/build-report.js
