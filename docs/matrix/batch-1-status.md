# Batch 1 — Slice 1: Legal Articles (REVIEW_REQUIRED)

Published: 2026-09-19 (commit 6b202100). Corrected against primary sources: 2026-09-19.
Article generation is STOPPED. The remaining ~58 law-licence rows will not be written until the corrections below are fully verified.

The master-matrix.csv status column remains "proposed" for these rows (bulk CSV rewrite deferred to avoid truncated-content rewrite risk). This file is the authoritative status record.

| Article slug | Matrix cluster/subcluster | Status |
|---|---|---|
| vietnam-motorbike-licence-classes-explained | 11.1 licence-system | REVIEW_REQUIRED (corrected 2026-09-19) |
| a1-licence-vietnam-what-you-can-ride | 11.1 licence-system | REVIEW_REQUIRED (corrected 2026-09-19) |
| 50cc-licence-vietnam | 11.1 licence-system | REVIEW_REQUIRED (corrected 2026-09-19) |
| electric-bike-licence-vietnam | 11.1 licence-system | REVIEW_REQUIRED (corrected 2026-09-19) |
| can-tourists-ride-motorbike-vietnam | 11.2 foreigners | REVIEW_REQUIRED (corrected 2026-09-19) |
| idp-vietnam-motorbike-rules | 11.2 foreigners | REVIEW_REQUIRED (corrected 2026-09-19) |
| 1968-vienna-convention-idp-vietnam | 11.2 foreigners | REVIEW_REQUIRED (corrected 2026-09-19) |
| helmet-law-vietnam | 11.3 traffic-rules | REVIEW_REQUIRED (corrected 2026-09-19) |
| motorbike-fines-vietnam-overview | 11.4 fines-penalties | REVIEW_REQUIRED (corrected 2026-09-19) |
| drink-driving-limits-motorbike-vietnam | 11.3 traffic-rules | REVIEW_REQUIRED (corrected 2026-09-19) |

## Corrections applied 2026-09-19

1. Licence classes corrected to post-2025 structure: A1 (50-<125cc / 4-<11 kW), A (125-<175cc / 11-<14 kW), A2 (>=175cc / >=14 kW big-bike class), B1 (three-wheel motorbikes, not a car class). Old A1 grandfathering (<175cc / <14 kW) stated.
2. Xe gan may (moped, <50cc or <4 kW electric) clearly distinguished from pedal-type electric bicycles (xe dap dien).
3. Sub-50cc position corrected: no licence, age 16+, Decree 151/2024 training requirement for riders aged 16-18.
4. Fines corrected against Decree 168/2024/ND-CP Article 7: red light / wrong way / sidewalk 4-6M VND (was wrongly "from 1M"); accident-causing behaviour 10-14M; helmet 400-600k; alcohol lowest band 2-3M. Figures not yet clause-verified are explicitly marked "pending verification" in the articles.
5. Absolute insurance/liability claims softened ("voids insurance" -> "can invalidate insurance claims and complicate liability").
6. Official source URLs added to every article's frontmatter sources (Law 36/2024/QH15 licence summary; Ministry of Public Security Decree 168 Art. 7 summary).
7. date_published separated from last_reviewed in frontmatter, schema (datePublished/dateModified) and visible meta line.
8. review_status: REVIEW_REQUIRED added to all 10 articles with a visible review banner.

## Open verification items (blockers for clearing REVIEW_REQUIRED)

- Exact Article 7 clause numbers and figures for: helmet, no-licence, phone use, non-accident lane violations, higher alcohol bands
- Exact wording of the sub-50cc training requirement in Decree 151/2024/ND-CP
- Power thresholds in Law 36/2024/QH15 confirmed against the law text itself
- IDP recognition details against the current regulation text (not secondary articles)
