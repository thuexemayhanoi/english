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

[UPDATE 2026-09-22, final slice: BATCH 1 IS COMPLETE — all 66 cluster-11 law/licence articles are published and VERIFIED; 0 proposed cluster-11 rows remain. The sentence below is retained as the historical record of the Slice-1/2 state only; do NOT resume Batch 1 — see the Slice 3 and Slice 4 / Final Batch 1 sections below.]

The foundational legal verification for the licence-system, foreigners, traffic-rules and fines subclusters is complete. Batch 1 (remaining ~58 law-licence articles) is SAFE TO RESUME, using the verified facts in this file as the baseline.

## Slice 2 (2026-09-22): 10 further VERIFIED legal articles

Published 2026-09-22. All verified against the full texts of Law 36/2024/QH15, Decree 168/2024/NĐ-CP, Decree 238/2026/NĐ-CP and Circular 12/2025/TT-BCA (chinhphu.vn / gov.vn portals). The cluster-11 matrix slice (66 rows) was added to docs/matrix/master-matrix.csv in the same batch; the status column is now kept in sync (20 published / 46 proposed).

| Article slug | Matrix cluster/subcluster | Status |
|---|---|---|
| minimum-age-ride-motorbike-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| foreign-licence-exchange-vietnam | 11.2 foreigners | VERIFIED 2026-09-22 |
| documents-to-carry-motorbike-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| lending-motorbike-unlicensed-rider-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| motorbike-passenger-rules-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| right-turn-on-red-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| wrong-way-riding-fine-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| compulsory-motorbike-insurance-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| motorbike-accident-duties-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| no-licence-fine-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |

Key facts clause-verified in this slice: rider ages (Law 36/2024 Art. 59: 16 mopeds, 18 A1); 16-to-under-18 on licence-required machines 400–600k (Decree 168 Art. 18(4)(a), wording clarified by Decree 238/2026 from 2026-08-15); owner lending to an unqualified rider 8–10m individual / 16–20m organisation (Art. 32(10)); unlicensed riding 2–4m up to 125 cc / 6–8m above (Art. 18(5)(b),(7)(b)); document carriage 200–300k per missing paper (Art. 18(2)); compulsory third-party insurance required (Law Art. 56 + Decree 67/2023) with 200–300k fine (Art. 18(2)); one-passenger rule with narrow two-person exceptions (Law Art. 33; Decree 168 Art. 7(2) 400–600k); right-turn-on-red only by police signal, auxiliary sign or dedicated lane (Law Art. 11 precedence + QCVN 41/2024); wrong-way riding 4–6m (Art. 7(7)); post-accident duties stop/warn/preserve/help/report (Law Art. 80) with accident-causing violations 10–14m (Art. 7(10)).

## Slice 3 (2026-09-22): 30 further VERIFIED legal articles

Published 2026-09-22 as one batch commit (per owner instruction to move from 10-article slices to 30-50 article batches). All facts reused the verified legal baseline above or were clause-verified against the full texts of Law 36/2024/QH15, Decree 168/2024/NĐ-CP, Circular 12/2025/TT-BCA, Circular 14/2025/TT-BXD, Circular 154/2025/TT-BTC, Circular 65/2024/TT-BTC, Circular 31/2019/TT-BGTVT and Decree 238/2026/NĐ-CP (chinhphu.vn / gov.vn portals). The matrix status column is now 50 published / 16 proposed for cluster 11.

| Article slug | Matrix cluster/subcluster | Status |
|---|---|---|
| how-to-get-a1-licence-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| vietnam-a1-licence-test | 11.1 licence-system | VERIFIED 2026-09-22 |
| motorbike-licence-validity-renewal-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| lost-motorbike-licence-replacement-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| old-licence-classes-after-2025-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| b1-three-wheel-licence-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| ride-125cc-with-car-licence-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| vietnam-a-licence-what-you-can-ride | 11.1 licence-system | VERIFIED 2026-09-22 |
| motorbike-licence-points-system-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| lose-all-licence-points-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| fast-electric-motorbike-licence-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| what-is-a-moped-vietnam-law | 11.1 licence-system | VERIFIED 2026-09-22 |
| xe-dap-mai-rules-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| motorbike-learner-permit-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| a1-licence-cost-vietnam | 11.1 licence-system | VERIFIED 2026-09-22 |
| expat-motorbike-licence-vietnam | 11.2 foreigners | VERIFIED 2026-09-22 |
| foreign-licence-exchange-documents-vietnam | 11.2 foreigners | VERIFIED 2026-09-22 |
| foreign-student-motorbike-licence-vietnam | 11.2 foreigners | VERIFIED 2026-09-22 |
| which-countries-idp-valid-vietnam | 11.2 foreigners | VERIFIED 2026-09-22 |
| idp-validity-period-vietnam | 11.2 foreigners | VERIFIED 2026-09-22 |
| non-1968-licence-vietnam | 11.2 foreigners | VERIFIED 2026-09-22 |
| vietnam-licence-test-in-english | 11.2 foreigners | VERIFIED 2026-09-22 |
| child-passengers-motorbike-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| stopped-by-traffic-police-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| motorbikes-on-expressway-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| motorbike-lane-rules-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| riding-on-sidewalk-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| phone-use-while-riding-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| motorbike-speed-limits-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| overtaking-rules-motorbike-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |

Key facts clause-verified in this slice: A1/A licences have no expiry date (Law 36/2024 Art. 57; renewed only on card damage/loss); A1 test 25 questions, pass 21/25, class A pass 23/25, điểm liệt safety questions fail the paper (TT 12/2025/TT-BCA Phụ lục II); minimum training hours fixed by TT 14/2025/TT-BXD from 1 September 2025 (class A: 32 hours including 20 theory; A1 a shorter programme); exam fees 60,000 VND theory / 70,000 VND practical per attempt, licence issuance fee reduced by 20,000 VND against the previous schedule (TT 154/2025/TT-BTC, effective 2026-01-01); 12-point licence system with restoration after ≥6 months via knowledge test (Law Art. 61 + TT 65/2024); expressway ban on motorbikes with 4-6m fine and 3-5 month suspension (Law Art. 25 + Decree 168 Art. 7(9)); speed limits urban 60 / rural 70 motorbikes, mopeds 40 (TT 31/2019/TT-BGTVT as amended); lane discipline and right-overtake fine 600-800k (Decree 168 Art. 7(5)); lane splitting not separately regulated; no learner permit class for motorbikes (training centres issue practice documentation only); licence exchange requires ≥3 months residence and a certified translation, no English-language test available (TT 12/2025/TT-BCA).

## Slice 4 / Final Batch 1 (2026-09-22): last 16 VERIFIED law/licence articles — cluster 11 complete

Published 2026-09-22 as one batch commit (66 of 66 cluster-11 intents published; 0 proposed). All facts clause-verified against the full texts of Law 36/2024/QH15, Decree 168/2024/NĐ-CP, Decree 118/2021/NĐ-CP, the Law on Handling Administrative Violations 68/2012/QH13 (as amended) and Circular 31/2019/TT-BGTVT (chinhphu.vn / thuvienphapluat.vn full texts).

| Article slug | Matrix cluster/subcluster | Status |
|---|---|---|
| traffic-light-rules-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| lane-splitting-legal-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| motorbike-required-equipment-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| motorbike-night-lights-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| motorbike-bus-lanes-vietnam | 11.3 traffic-rules | VERIFIED 2026-09-22 |
| fake-licence-penalties-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| underage-riding-penalties-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| riding-without-number-plates-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| leaving-accident-scene-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| speeding-fines-motorbike-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| red-light-fine-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| unregistered-motorbike-fine-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| expired-licence-fine-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| riding-while-suspended-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| how-to-pay-traffic-fine-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |
| police-impound-motorbike-vietnam | 11.4 fines-penalties | VERIFIED 2026-09-22 |

Key facts clause-verified in this slice: signal priority order and green/yellow/red meanings (Law 36/2024 Art. 11); lane splitting not separately regulated (no dedicated clause; falls under Art. 13 lane rules); mandatory equipment bands (Decree 168 Art. 14(1) 400-600k: horn, mirrors, lights, brakes, plates); riding unlit 18:00-06:00 200-400k (Art. 7(2)(g)); dedicated lanes closed to other vehicles (Law Art. 13(4)); overtaking on the left with narrow-road exceptions (Law Art. 14); speeding bands 5-10 km/h 400-600k, 10-20 km/h 800k-1M, over 20 km/h 6-8M + 4 points, organised group speeding 8-10M + 10-12 month suspension (Art. 7(2)(b), (4)(a), (8)(a), (9)(b), (12)(b), (13)); red light 4-6M + 4 points (Art. 7(7)(c), (13)(c)); wrong lane 600-800k + 4 points (Art. 7(5)(d)); right-side overtake 600-800k (Art. 7(5)(đ)); wrong-way/sidewalk 4-6M + 2 points (Art. 7(7)(a), (13)(a)); hit-and-run 8-10M + 6 points (Art. 7(9)(c), (13)); accident-causing 10-14M + 10 points (Art. 7(10), (13)); no plates 4-6M with fake-plate confiscation (Art. 14(3), (5)(a)); registration defects 2-3M (Art. 14(2)); origin-unprovable vehicle confiscation possible (Art. 14(5)(b)); underage bands: reprimand under 16, 400-600k for 16-under-18 on licence-required machines (Art. 18(1), (4)(a)); invalid/no licence 2-4M ≤125cc / 6-8M above (Art. 18(5)(a), (7)(b)); expressway ban on motorbikes 4-6M + 6 points, no suspension (Art. 7(7)(b), (13)(c) as worded); vehicle holding grounds list (Art. 48 incl. 48(3) papers-not-produced holding); fine payment deadline 10 days from decision receipt (Law XLVPHC Art. 78), payment forms Treasury/bank cash, transfer, postal (Decree 118/2021 Art. 20), instalments ≤6 months, ≤3 instalments, first ≥40% (Art. 79); A1/A/B1 licences have no expiry (Law Art. 57(5)).

Corrections made to previously published articles during final verification (citation accuracy, same commit): motorbike-lane-rules-vietnam, overtaking-rules-motorbike-vietnam and wrong-way-riding-fine-vietnam cited repealed-Law article numbers (Art. 30) where Law 36/2024's renumbered articles apply (Art. 13, 14, 10); motorbike-speed-limits-vietnam misstated the Decree 168 speeding bands; motorbikes-on-expressway-vietnam claimed a 3-5 month suspension that Art. 7 does not attach to the motorbike expressway ban (points deduction only); motorbike-fines-vietnam-overview had incorrect point values; no-licence-fine-vietnam mislabeled a source clause; documents-to-carry-motorbike-vietnam overstated Art. 18(2) (insurance fine applies to all riders; the not-carrying fine applies to transport-business riders, private riders fall to Art. 48(3) holding).

Batch 1 result: 66 published law/licence articles, all 66 cluster-11 matrix rows published, 0 proposed. Cluster 11 is COMPLETE.
