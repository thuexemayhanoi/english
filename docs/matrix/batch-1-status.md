# Batch 1 — Slice 1: Published Articles

Commit: 6b202100b5e72af481b5956535cd0d3329bed33f
Published: 2026-09-19. Cluster 11 (law-licences), first 10 of 68 rows.

The master-matrix.csv `status` column remains "proposed" for these rows (bulk CSV rewrite deferred to the next full batch commit to avoid a truncated-content rewrite risk). This file is the authoritative batch status record.

| Article slug | Matrix cluster/subcluster | Status |
|---|---|---|
| vietnam-motorbike-licence-classes-explained | 11.1 licence-system | published |
| a1-licence-vietnam-what-you-can-ride | 11.1 licence-system | published |
| 50cc-licence-vietnam | 11.1 licence-system (50cc legal) | published |
| electric-bike-licence-vietnam | 11.1 licence-system (electric legal) | published |
| can-tourists-ride-motorbike-vietnam | 11.2 foreigners | published |
| idp-vietnam-motorbike-rules | 11.2 foreigners | published |
| 1968-vienna-convention-idp-vietnam | 11.2 foreigners | published |
| helmet-law-vietnam | 11.3 traffic-rules | published |
| motorbike-fines-vietnam-overview | 11.4 fines-penalties | published |
| drink-driving-limits-motorbike-vietnam | 11.3 traffic-rules | published |

R1 verification basis: Law on Road Traffic Order and Safety No. 36/2024/QH15 (effective 2025-01-01); Decree 168/2024/ND-CP; Decree 151/2024/ND-CP; 1968 Vienna Convention on Road Traffic. All articles carry last_reviewed: 2026-09-19 and legal-facts-vs-practical-advice separation.

Open verification items for the next pass:
- Exact current fine band figures per violation (verify against current decree text, not secondary articles)
- Current sub-50cc licence boundary after Decree 151/2024 implementation
- Electric classification power figures (4 kW / 50 km/h / 11 kW) against the law text
