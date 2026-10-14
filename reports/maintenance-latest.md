# Automated Maintenance Report

- Run timestamp (UTC): 2026-10-14T09:44:44.313Z
- MAIN SHA audited: unknown
- Mode: audit only

## RESULT: PASS_WITH_REVIEW

| Metric | Value |
|---|---|
| Total published articles | 981 (baseline 981) |
| Clusters | 14 (baseline 14) |
| QA tool findings (all severities) | P0=0 P1=0 P2=20 P3=372 |
| Maintenance-specific findings | P0=0 P1=0 P2=0 P3=0 (excludes defects already reported by QA tools) |
| Blocking (P0/P1) | 0 |
| QA toolkit | frontmatter-check:ok, content-duplicate-check:ok, internal-link-audit:ok, seo-audit:ok, sitemap-check:ok, schema-check:ok, rendered-site-audit:ok |
| Assistant tests | 31 passed, 0 failed |
| Broken internal links | 0 |
| Orphan pages | 0 |
| Duplicate findings | 14 |
| REVIEW_REQUIRED articles | 4 (motorbike-bluecard-ownership-papers-vietnam, motorbike-border-crossing-vietnam-cambodia, motorbike-border-crossing-vietnam-laos, motorbike-travel-insurance-vietnam) |
| Stale last_reviewed (>365d) | 0 |
| Source/citation warnings | 0 |
| Sitemap status | clean (gaps=0) |
| Schema status | clean |
| Rendered-site audit | pass |
| SEO score | overall 89.4 (OK) |
| SEO regression guard | pass (no metric regressed vs accepted baseline) |
| SEO fix matrix | 6 root causes (392 findings, 0 auto-fixable, 6 review-only) |

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

- P2 [frontmatter-check] 1 finding(s):
  - model content without manufacturer [_articles/yamaha-pg-1-review.md]
- P2 [content-duplicate-check] 14 finding(s):
  - near-duplicate title (similarity 0.71) vs _articles/best-110cc-underbones-vietnam-verified.md [_articles/best-125cc-underbones-vietnam-verified.md]
  - near-duplicate title (similarity 0.67) vs _articles/best-125cc-scooters-vietnam-verified.md [_articles/best-scooters-hanoi-commuting-verified.md]
  - near-duplicate title (similarity 0.63) vs _articles/best-150cc-manual-motorbikes-vietnam-verified.md [_articles/best-manual-clutch-motorbikes-beginners-verified.md]
  - near-duplicate title (similarity 0.67) vs _articles/best-honda-underbones-vietnam-verified.md [_articles/best-underbones-hanoi-commuting-verified.md]
  - near-duplicate title (similarity 0.67) vs _articles/best-scooters-hanoi-commuting-verified.md [_articles/best-underbones-hanoi-commuting-verified.md]
  - near-duplicate title (similarity 0.67) vs _articles/best-scooters-short-riders-vietnam.md [_articles/best-underbones-short-riders-verified.md]
  - near-duplicate title (similarity 0.75) vs _articles/can-tourists-rent-a-motorbike-hanoi.md [_articles/can-tourists-ride-motorbike-vietnam.md]
  - near-duplicate title (similarity 0.67) vs _articles/electric-motorbike-maintenance-basics.md [_articles/motorbike-maintenance-basics-vietnam.md]
  - near-duplicate title (similarity 0.67) vs _articles/electric-motorbike-night-riding-hanoi.md [_articles/night-riding-motorbike-safety-vietnam.md]
  - near-duplicate title (similarity 0.80) vs _articles/hue-motorbike-trip-hanoi.md [_articles/renting-motorbike-hue.md]
  - near-duplicate title (similarity 0.67) vs _articles/longest-range-scooters-vietnam.md [_articles/longest-range-underbones-vietnam-verified.md]
  - near-duplicate title (similarity 0.67) vs _articles/motorbike-night-lights-vietnam.md [_articles/night-riding-motorbike-safety-vietnam.md]
  - near-duplicate title (similarity 0.75) vs _articles/motorbike-rental-digital-nomads-hanoi.md [_articles/nomads-monthly-motorbike-hanoi.md]
  - near-duplicate title (similarity 0.67) vs _articles/semi-auto-carrying-cargo.md [_articles/semi-auto-two-up-riding-technique.md]
- P2 [seo-audit] 4 finding(s):
  - article marked REVIEW_REQUIRED [_articles/motorbike-bluecard-ownership-papers-vietnam.md]
  - article marked REVIEW_REQUIRED [_articles/motorbike-border-crossing-vietnam-cambodia.md]
  - article marked REVIEW_REQUIRED [_articles/motorbike-border-crossing-vietnam-laos.md]
  - article marked REVIEW_REQUIRED [_articles/motorbike-travel-insurance-vietnam.md]
- P3 [seo-audit] 372 finding(s) — signals only; see reports/seo-audit.json
- P2 [rendered-site-audit] 1 finding(s):
  - no breadcrumbs on non-home page [/404.html]

## Safe fixes

None.

Deliberately NOT auto-fixed: all legal, licensing, border, insurance, technical-specification, business-policy, price, travel-rule and safety claims; any ambiguous broken target; stale review content (flagged only).
