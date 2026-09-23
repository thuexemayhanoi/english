# Batch 9 Status — Parts, Accessories & Riding Gear Part 3 (cluster 9 COMPLETE at 90/90)

Authoritative record for the 15-article Batch 9 production run (MM-0377–MM-0391). Batches 1 (law/licences, 66 articles), 2 (cluster 1 rental, 81), 3 (cluster 2 monthly & long-term rental, 45), 4 (safety Part 1 + maintenance Part 1, 50), 5 (safety remainder + maintenance Part 2, 50), 6 (maintenance Part 3 + parts/gear Part 1, 50), 7 (maintenance Part 4, 50, cluster 8 COMPLETE) and 8 (parts/gear Part 2, 50) are COMPLETE — see docs/matrix/batch-1-status.md through docs/matrix/batch-8-status.md.

## Batch 9 (2026-09-23): 15 parts, accessories & riding gear articles

Published 2026-09-23 in two part-commits (43358bd: 8 articles, 56c2896: 7 articles). This batch completes cluster 9 (parts, accessories & riding gear): 90 of 90 intents published; 0 remain.

All business facts come exclusively from docs/OWNER-FACTS.md — the sole approved business-fact authority. No prices, availability, fleet size, promotions, discounts, guarantees, insurance coverage, delivery promises or testimonials were invented. Parts/gear articles recommend certification and reputable sourcing without naming or endorsing specific products or prices, contain no legal claims beyond links to the published VERIFIED cluster-11 legal articles (legal requirements on horns and exhausts are explicitly directed to current-regulation checks rather than asserted), and do not imply that Nguyen Tu sells or provides any of the discussed gear. Technical articles contain no invented torque values, oil capacities, tyre pressures, electrical values or service intervals; where exact model-specific data matters, the articles direct readers to the owner's manual, manufacturer specification or a qualified mechanic.

Each intent is distinct from every published article in clusters 1, 2, 8, 9, 10 and 11; no doorway or filler pages were written. Cannibalization check: retention hardware, sun/heat degradation, glasses-under-helmet fit, hearing protection, conspicuity vests, pet carriage, ownership marking, jump packs, TPMS, bar-end weights, horns, exhausts, frame sliders, tank pads and document pouches each target an intent not covered by the 75 published cluster-9 articles or the rider-protection articles of cluster 10; the closest overlapping topics (helmet fit, eye protection, reflective stickers, horn etiquette, handlebar vibration, battery care, tyre inflators, crash bars, paint protection, dry bags, documents to carry) are cross-linked rather than duplicated.

Subcluster counts in this batch: 9.1 helmets 3 (MM-0377–MM-0379), 9.2 riding-gear 2 (MM-0380–MM-0381), 9.3 accessories-luggage 2 (MM-0382, MM-0391), 9.4 security 1 (MM-0383), 9.5 parts-accessories 7 (MM-0384–MM-0390).

| Matrix row | Article title | Subcluster | Status |
|---|---|---|---|
| MM-0377 | Helmet Fasteners: Double-D Rings vs Quick-Release Buckles | 9.1 helmets | PUBLISHED 2026-09-23 |
| MM-0378 | Sun and Heat Damage to Motorbike Helmets in Vietnam | 9.1 helmets | PUBLISHED 2026-09-23 |
| MM-0379 | Riding with Prescription Glasses Under a Helmet | 9.1 helmets | PUBLISHED 2026-09-23 |
| MM-0380 | Earplugs and Wind Noise: Protecting Your Hearing on a Motorbike | 9.2 riding-gear | PUBLISHED 2026-09-23 |
| MM-0381 | Hi-Vis Vests for Motorbike Riders | 9.2 riding-gear | PUBLISHED 2026-09-23 |
| MM-0382 | Carrying Pets on a Motorbike in Vietnam | 9.3 accessories-luggage | PUBLISHED 2026-09-23 |
| MM-0383 | Security Marking Kits: Proof of Ownership for Your Motorbike | 9.4 security | PUBLISHED 2026-09-23 |
| MM-0384 | Portable Jump Starter Packs for Motorbikes | 9.5 parts-accessories | PUBLISHED 2026-09-23 |
| MM-0385 | Tyre Pressure Monitoring Systems for Motorbikes | 9.5 parts-accessories | PUBLISHED 2026-09-23 |
| MM-0386 | Bar-End Weights and Handlebar Vibration | 9.5 parts-accessories | PUBLISHED 2026-09-23 |
| MM-0387 | Aftermarket Horns for Motorbikes | 9.5 parts-accessories | PUBLISHED 2026-09-23 |
| MM-0388 | Aftermarket Exhausts on Motorbikes in Vietnam | 9.5 parts-accessories | PUBLISHED 2026-09-23 |
| MM-0389 | Frame Sliders and Engine Case Protection | 9.5 parts-accessories | PUBLISHED 2026-09-23 |
| MM-0390 | Tank Pads on Scooters | 9.5 parts-accessories | PUBLISHED 2026-09-23 |
| MM-0391 | Waterproof Document Pouches for Riding in Vietnam | 9.3 accessories-luggage | PUBLISHED 2026-09-23 |

Parts/gear cluster counts after this batch: 90 published / 0 remaining — cluster 9 COMPLETE. Next production target per docs/MASTER-MATRIX.md: the next approved cluster per the batch order (clusters 3–4, scooter and motorcycle reviews, with specification population from manufacturer pages into docs/MODEL-DATABASE.md first — initial verified Honda VN rows recorded 2026-09-23).

## QA (2026-09-23)

- Front-matter validation: all 15 articles carry complete required fields (title, slug, description, category, tags, content_type, search_intent, topic_cluster, subcluster, date_published, last_reviewed, sources, internal_link_targets); slugs match filenames; descriptions free of internal double quotes; no duplicate slugs against the 442 previously published articles. Remote front-matter check passed as part of the Quality Gate.
- Internal-link validation: every internal_link_targets entry in all 15 articles was validated against the 442 remote published slugs before publication — 0 broken references. One candidate intent (home tool kit) was dropped during planning because a toolkit article already existed; it was replaced with the security-marking intent.
- Content rules: no invented torque values, oil capacities, tyre pressures, electrical values or service intervals; no pricing, availability, promotion or safety-guarantee claims; no product endorsements or invented legal requirements (horn and exhaust articles direct readers to verify current regulations); OWNER-FACTS is the only source of business claims (none needed in this batch).
- Remote Quality Gate: PASS — run 35827544583 on commit 56c2896 (2026-09-23), no blocking findings; the part-1 commit 43358bd also passed its Quality Gate run before part 2 was pushed.
- GitHub Pages deployment: run 35827544229 on commit 56c2896 (2026-09-23); the commit's build, deploy and report-build-status checks all completed with success. Verified live: all 15 new article pages render on the live site, and the parts-gear hub shows the 90-guide count.
- MODEL-DATABASE groundwork (next batch order step): initial Honda VN specification rows (Vision, Air Blade 125/160, Lead 125) verified from honda.com.vn model pages and recorded in docs/MODEL-DATABASE.md with retrieval date 2026-09-23; power and torque figures remain empty until verified against manufacturer pages (DB rule 1).
