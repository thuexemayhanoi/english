# SOURCE MAP v2 — English Motorbike Knowledge Hub

Status: PROPOSED v2 — awaiting owner approval and first-party data (GSC export, customer questions, OWNER-FACTS).

## Source precedence (absolute rule)

FIRST-PARTY DATA (owner-provided: GSC, customer questions, OWNER-FACTS)
> PRIMARY / OFFICIAL SOURCE (government law, official tourism, official docs)
> MANUFACTURER (Honda VN, Yamaha VN, VinFast, SYM, Suzuki, Piaggio official specs)
> SPECIALIST PUBLICATION (established media, legal libraries)
> COMMERCIAL WEBSITE (competitors, shops, rental sites)
> FORUM / COMMUNITY.

Competitor websites are for discovery, not truth. Article truth is never decided by majority vote.

## Reliability classes

- A — authoritative / primary (first-party owner data, government, manufacturer, official documentation)
- B — strong specialist or established publication
- C — useful commercial reference
- D — forum / community / inspiration only

---

## 0. FIRST-PARTY DATA (highest priority — owner supplied)

| Source | Type | Class | Topics | How to use | Notes |
|---|---|---|---|---|---|
| Google Search Console export of thuexemaynguyentu.com (6–12 months: query, page, impressions, clicks, position) | First-party search data | A+ | Real search intents driving the business | Primary input for CUSTOMER-INTENTS store and MASTER MATRIX intent generation | Pending owner upload |
| Anonymized customer questions from WhatsApp/Zalo/Facebook (100–300, no names/phone numbers) | First-party voice data | A+ | Real customer intents and phrasing | Seed intents, FAQ content, article angle selection | Pending owner upload; PII must be stripped before upload |
| OWNER-FACTS.md | Owner-declared business facts | A+ | Fleet, pricing rules, deposits, insurance, delivery hours, contact | Absolute priority for all business claims. External websites may NEVER override this file | Template created at docs/OWNER-FACTS.md, awaiting owner data |

## 1. Manufacturer sources (class A for specs)

| Source | Class | Use for | Notes |
|---|---|---|---|
| https://hondavn.com.vn/ (Honda Vietnam) | A | Model catalog and specs: Vision, Air Blade, SH Mode, Wave, Future, Super Cub, Lead, etc. | Canonical source for Honda specs; check model year per article |
| https://yamaha-motor.com.vn/ (Yamaha Motor Vietnam) | A | Specs: Janus, Grande, FreeGo, Sirius, Exciter, PG-1, NEO's, etc. | Canonical for Yamaha |
| https://vinfastauto.com/ (VinFast) | A | Electric specs: power, battery, range, top speed, charge time, test conditions | VinFast publishes range with test conditions; always note that real-world range varies with speed, temperature, terrain, load |
| SYM Vietnam, Suzuki Vietnam, Piaggio Vietnam | A (when added) | Model specs for expanded reviews | Optional expansion |

Rule: manufacturer spec page beats retailer listing, beats classifieds, beats forum — always.

## 2. Government / legal sources (highest tier for law)

| Source | Class | Use for | Notes |
|---|---|---|---|
| Law on Road Traffic Order and Safety (Luật Trật tự, an toàn giao thông đường bộ) via government portal (chinhphu.vn, vanban.chinhphu.vn) and Ministry of Public Security documents | A | Licence classes A1/A and licence conditions, traffic rules | Top tier for legal articles. Track 2026+ amendments from official documents, not summary blogs |
| Underlying decrees on penalties, registration, helmet standards (QCVN) | A | Fines, helmet law, registration | Identify exact decree number and effective date; record last_reviewed |
| thuvienphapluat.vn | B | Legal topic discovery, quick statute lookup | Secondary; always trace to the statute text |
| mva.vn | C | Commentary cross-check | Never sole source |

## 3. Official tourism sources

| Source | Class | Use for | Notes |
|---|---|---|---|
| https://vietnam.travel/ (Vietnam National Authority of Tourism) | A | Destination taxonomy, Hanoi, Northern destinations (Ha Giang, Ha Long, Mai Chau, Ninh Binh, Sa Pa), transport, weather, safety, itineraries | Preferred over commercial travel sites for destination facts |
| insightguides.com | B | Itinerary concepts, traveller questions | Background only |

Commercial travel sites (travelguidevietnam.net, travelhanoi.com.vn, travelhanoi.org, govietnamtrip.com) remain class C/D: discovery only; route/safety facts independently verified (flag R2).

## 4. Technical / service data

Priority order for maintenance articles: manufacturer owner's manual / official service information (A) > specialist publication (B) > everything else. Part-shop sites, forums, Scribd textbooks are topic discovery only. Torque values, oil capacities, pressures, voltages, service intervals NEVER come from forums or shop sites (flag R5).

## 5. SEO / web-development documentation

| Source | Class | Use for |
|---|---|---|
| Google Search Central (developers.google.com/search) | A | Canonical, sitemap, structured data, pagination guidance |
| schema.org | A | Schema types (Article, BreadcrumbList, LocalBusiness, FAQPage) |
| jekyllrb.com docs | A | Liquid, collections, pagination |
| docs.github.com (GitHub Pages) | A | Pages limits, build behavior, plugins |

Implementation decisions follow official docs, never an SEO blog's recipe.

## 6. Competitor / commercial references (discovery only, class C)

hanoimotorbikerental.com · riderly.com · rentalmotorbikehanoi.com · motogo.vn (card UX fields: image, model, type, engine, transmission, licence requirement, suitability, range/fuel, CTA — original design only, no cloning) · chobaoho.vn · gsports.vn · xedienvietthanh.com · xebaonam.com · autopro.com.vn (news structure example, date-checked) · hocngheoto.edu.vn · thietbithaovoxe.com · 2banh.vn forum · Scribd textbook.

All C/D rules from SOURCE-MAP v1 apply: no text, images, diagrams, testimonials, branding, marketing claims as facts.

## Research-verification flags

- R1 legal: current law/decree text (class A government) required
- R2 travel/route: independent verification of conditions, distances, safety
- R3 specs: manufacturer-class source
- R4 business: OWNER-FACTS / class A only; external sites cannot override
- R5 technical: manufacturer service data only for torque/oil/pressure/voltage/intervals
