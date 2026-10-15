# Automated Maintenance Report

- Run timestamp (UTC): 2026-10-15T03:15:44.075Z
- MAIN SHA audited: unknown
- Mode: audit only

## RESULT: PASS_WITH_REVIEW

| Metric | Value |
|---|---|
| Total published articles | 981 (baseline 981) |
| Clusters | 14 (baseline 14) |
| QA tool findings (all severities) | P0=0 P1=0 P2=5 P3=0 |
| Maintenance-specific findings | P0=0 P1=0 P2=0 P3=0 (excludes defects already reported by QA tools) |
| Blocking (P0/P1) | 0 |
| QA toolkit | frontmatter-check:ok, content-duplicate-check:ok, internal-link-audit:ok, seo-audit:ok, sitemap-check:ok, schema-check:ok, rendered-site-audit:ok |
| Assistant tests | 31 passed, 0 failed |
| Broken internal links | 0 |
| Orphan pages | 0 |
| Duplicate findings | 0 |
| REVIEW_REQUIRED articles | 4 (motorbike-bluecard-ownership-papers-vietnam, motorbike-border-crossing-vietnam-cambodia, motorbike-border-crossing-vietnam-laos, motorbike-travel-insurance-vietnam) |
| Stale last_reviewed (>365d) | 0 |
| Source/citation warnings | 0 |
| Sitemap status | clean (gaps=0) |
| Schema status | clean |
| Rendered-site audit | pass |
| SEO score | overall 96.9 (OK) |
| SEO regression guard | pass (no metric regressed vs accepted baseline) |
| SEO fix matrix | 2 root causes (5 findings, 0 auto-fixable, 2 review-only) |
| English SEO matrix | P0=0 P1=4 P2=0 P3=999, content gaps 23 (unchanged) |
| Topical map | in-silo link share 67%, 244 article(s) without an in-silo inbound link, 0 split keyword families, recommendations P3=6 (unchanged) |

## Counts per cluster

| Cluster | Count |
|---|---|
| rental | 81 |
| monthly-rental | 45 |
| scooters | 110 |
| motorcycles | 108 |
| manual-clutch | 55 |
| 50cc | 40 |
| electric | 89 |
| maintenance | 120 |
| parts-gear | 90 |
| safety | 55 |
| law-licences | 66 |
| hanoi | 54 |
| trips | 38 |
| vietnam-travel | 30 |

## Blocking findings

None.

## Review findings (not auto-fixed)

- P2 [seo-audit] 4 finding(s):
  - article marked REVIEW_REQUIRED [_articles/motorbike-bluecard-ownership-papers-vietnam.md]
  - article marked REVIEW_REQUIRED [_articles/motorbike-border-crossing-vietnam-cambodia.md]
  - article marked REVIEW_REQUIRED [_articles/motorbike-border-crossing-vietnam-laos.md]
  - article marked REVIEW_REQUIRED [_articles/motorbike-travel-insurance-vietnam.md]
- P2 [rendered-site-audit] 1 finding(s):
  - no breadcrumbs on non-home page [/404.html]

## Safe fixes

None.

Deliberately NOT auto-fixed: all legal, licensing, border, insurance, technical-specification, business-policy, price, travel-rule and safety claims; any ambiguous broken target; stale review content (flagged only).
