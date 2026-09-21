# Batch 1 — Slice 1: Legal Articles (VERIFIED)

Published: 2026-09-19 (commit 6b202100). First correction pass: 2026-09-19. Full primary-source verification pass: 2026-09-21.
All 10 published legal articles have been verified against the full text of Law 36/2024/QH15, Decree 168/2024/NĐ-CP, Circular 12/2025/TT-BCA and official UN treaty material. Review banners removed.

The master-matrix.csv status column remains "proposed" for the remaining rows (bulk CSV rewrite deferred to avoid truncated-content rewrite risk). This file is the authoritative status record.

| Article slug | Matrix cluster/subcluster | Status |
|---|---|---|
| vietnam-motorbike-licence-classes-explained | 11.1 licence-system | VERIFIED 2026-09-21 |
| a1-licence-vietnam-what-you-can-ride | 11.1 licence-system | VERIFIED 2026-09-21 |
| 50cc-licence-vietnam | 11.1 licence-system | VERIFIED 2026-09-21 |
| electric-bike-licence-vietnam | 11.1 licence-system | VERIFIED 2026-09-21 |
| can-tourists-ride-motorbike-vietnam | 11.2 foreigners | VERIFIED 2026-09-21 |
| idp-vietnam-motorbike-rules | 11.2 foreigners | VERIFIED 2026-09-21 |
| 1968-vienna-convention-idp-vietnam | 11.2 foreigners | VERIFIED 2026-09-21 |
| helmet-law-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-21 |
| motorbike-fines-vietnam-overview | 11.4 fines-penalties | VERIFIED 2026-09-21 |
| drink-driving-limits-motorbike-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-21 |

## Primary legal documents used (2026-09-21 verification)

- Law on Road Traffic Order and Safety No. 36/2024/QH15, full text (xaydungchinhsach.chinhphu.vn) — Articles 3, 8, 31, 57, 58, 59, 89
- Law No. 36/2024/QH15, original record (vanban.chinhphu.vn, docid 211194)
- Decree 168/2024/NĐ-CP, full text (xaydungchinhsach.chinhphu.vn) — Articles 7, 9, 18
- Ministry of Public Security summaries of Article 7 fines (bocongan.gov.vn)
- Circular 12/2025/TT-BCA, full text (xaydungchinhsach.chinhphu.vn) — exchange of foreign licences
- UN Treaty Collection: 1968 Vienna Convention on Road Traffic (treaties.un.org, Chapter XI-B-19); UNECE (Vietnam acceded 2014)
- Hai Phong Police (congan.haiphong.gov.vn): Resolution 32/2007/NQ-CP helmet history

## Material corrections applied 2026-09-21

1. Licence class structure corrected against Article 57 of the law itself: the post-2025 classes are A1 (up to and including 125cc / 11 kW), A (above 125cc / 11 kW, the single big-bike class) and B1 (three-wheel). The previously published "A = 125–175cc, A2 = 175cc+" structure does not exist in the new law; A2 is only a pre-2025 class preserved by Article 89 transitional rules.
2. A1 boundaries corrected to "up to and including 125cc / 11 kW" (the law says "đến 125 cm³ / đến 11 kW"), affecting the 125cc scooter coverage claim.
3. Transitional rules completed: old A1 = 50–<175cc / 4–<14 kW; old A2 = ≥175cc / ≥14 kW; old A3 = three-wheel (Article 89).
4. Moped definition grounded in Article 3: ≤50cc or ≤4 kW electric, design speed ≤50 km/h, excluding xe đạp máy. Pedal e-bike definition grounded (power cut at 25 km/h / when pedalling stops, non-motorised).
5. The "16–18 year olds must complete a Decree 151/2024 training programme before riding" claim was removed as overstated: the training is organised through high schools/vocational institutions; there is no universal certificate prerequisite (Article 58(4) requires understanding and skill; traffic police have publicly clarified this).
6. All previously "pending verification" fine figures now clause-verified against Decree 168/2024/NĐ-CP: helmet 400–600k (Art. 7(2)(h),(i)); phone use 800k–1M (Art. 7(4)(đ)); red light / wrong way / sidewalk 4–6M (Art. 7(7)); accident-causing 10–14M (Art. 7(10)); alcohol bands 2–3M / 6–8M / 8–10M with points and 22–24 month suspension (Art. 7(6)(a),(8)(b),(9)(d),(12),(13)); no-licence 2–4M ≤125cc and 6–8M above (Art. 18(5),(7)).
7. IDP rules grounded in Article 58(6): 1968 Vienna Convention member-state IDPs or national licences, vehicle-appropriate; 1949 Geneva Convention permits not recognised. Added the Art. 18(5)(b) fine for IDP holders not carrying the national licence. Foreign-licence exchange conditions verified against Circular 12/2025/TT-BCA (residence papers ≥3 months, valid national licence, IDPs not exchangeable).
8. Vienna Convention article grounded: Vietnam's 2014 accession (UNECE/UN Treaty Collection), plus domestic effect via Article 58(6) rather than treaty inference alone.
9. Helmet article grounded in Article 31(2)-(3) (riders and passengers, standard-compliant, fastened; pedal e-bike riders included) and Resolution 32/2007/NQ-CP history (gov.vn police source); under-6 passenger fine exemption noted.
10. Electric-bike article table corrected: A1 up to 11 kW, A above 11 kW (no 11–14 kW "A" tier or 14 kW "A2" tier in the new law); transitional old-A1 coverage 4–<14 kW.
11. Sources replaced: luatvietnam.vn (secondary) citations replaced with full-text primary URLs (chinhphu.vn portals, bocongan.gov.vn, treaties.un.org, UNECE). All URLs link-checked.
12. last_reviewed set to 2026-09-21; date_published unchanged (2026-09-19); review_status set to VERIFIED on all 10 articles.

## Open verification items

None blocking. Minor watch items:

- The traffic police have drafted amendments to Circular 12/2025/TT-BCA (e.g. visa-based eligibility for licence exchange); IDP article notes that requirements may change. Re-check before the next batch of foreigner-focused articles.
- Fine levels are always subject to decree amendment; re-verify before any future fine-related article batch.

## Batch 1 status

The foundational legal verification for the licence-system, foreigners, traffic-rules and fines subclusters is complete. Batch 1 (remaining ~58 law-licence articles) is SAFE TO RESUME, using the verified facts in this file as the baseline.
