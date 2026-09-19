# MASTER CONTENT MATRIX — PROPOSED

Status: PROPOSED v2 — awaiting owner approval AND first-party data before row expansion.

## Data foundation (four stores, in priority order)

1. docs/OWNER-FACTS.md — owner-declared business truth; absolute priority for business claims
2. docs/CUSTOMER-INTENTS.md — GSC export + anonymized customer questions; decides real-demand priorities and angles
3. docs/MODEL-DATABASE.md — manufacturer-verified spec store; reviews/comparisons generate from it
4. docs/SOURCE-MAP.md — all external sources with precedence rule

Source precedence: FIRST-PARTY DATA > PRIMARY/OFFICIAL > MANUFACTURER > SPECIALIST PUBLICATION > COMMERCIAL WEBSITE > FORUM. Competitor websites are for discovery, not truth.

The cluster skeleton below is architecture only. After OWNER-FACTS, GSC data and customer questions arrive, intent rows are generated in this order: GSC clusters → customer questions → gap-fill vs this skeleton → dedupe → expand to ~1,000 rows. No articles written until that full matrix is approved.

Target: ~1,000 distinct English articles. This document defines the allocation, subclusters, representative intents, overlap controls, verification flags and batch plan. After approval and first-party data intake, each cluster gets a full matrix file with one row per article (intent, slug, content_type, search_intent, verification flag, demand_source [gsc/customer/skeleton], closest existing/other article, distinctness rationale, internal-link targets).

## Cluster allocation (~1,010 rows)

| # | Cluster | Target |
|---|---|---|
| 1 | Hanoi motorbike rental | 90 |
| 2 | Monthly & long-term rental | 45 |
| 3 | Scooter reviews & comparisons | 110 |
| 4 | Motorcycle reviews & comparisons | 110 |
| 5 | Manual & clutch motorcycles | 55 |
| 6 | 50cc motorbikes | 45 |
| 7 | Electric motorbikes & e-bikes | 90 |
| 8 | Maintenance & repair | 120 |
| 9 | Parts, accessories & riding gear | 90 |
| 10 | Riding skills & safety | 60 |
| 11 | Vietnam laws & licences | 70 |
| 12 | Hanoi travel (riding-relevant) | 55 |
| 13 | Motorbike trips from Hanoi | 40 |
| 14 | Vietnam travel by motorbike | 30 |
| | TOTAL | 1,010 |

Note: allocation is provisional; GSC/customer-intent data may shift weights between clusters (total stays ~1,000).

## Subclusters and representative intents

### 1. Hanoi motorbike rental (90)
- 1.1 How-to rent (20): requirements, documents, deposits, passport policy, inspection checklist, pickup vs delivery
- 1.2 Choosing a bike for Hanoi (15): best scooter for beginners, automatic vs semi-auto in Old Quarter traffic, bike size for two-up riding
- 1.3 Rental practicalities (20): fuel policy, breakdown procedure, helmet inclusion, theft responsibility, deposit negotiation, insurance questions
- 1.4 Customer situations (15): renting as tourist vs expat vs teacher vs student; long-stay; female riders; first-time riders
- 1.5 Area/context guides (20): renting in Long Bien, near Old Quarter, near Tay Ho, airport/arrival logistics — genuine area context, NOT doorway location spins
- All Nguyen Tu-specific facts from OWNER-FACTS only. Availability wording: "Contact us to confirm current availability."

### 2. Monthly & long-term rental (45)
- 2.1 Monthly rental decisions (20): monthly vs daily cost logic, what to check in a monthly contract, maintenance responsibility
- 2.2 Long-term living with a bike (15): registration/inspection for long-term use, switching bikes, storage
- 2.3 Expat/student/teacher contexts (10)
- No invented prices; cost frameworks only unless OWNER-FACTS approves pricing.

### 3. Scooter reviews & comparisons (110)
- 3.1 Model reviews (45): Honda Vision, Air Blade, SH, SH Mode, Lead; Yamaha Janus, Grande, FreeGo; Suzuki Address; Vespa Liberty/Primavera; SYM Elegant — specs from MODEL-DATABASE (manufacturer source), no rental pricing unless fleet-verified
- 3.2 Head-to-head comparisons (35): Vision vs Janus, Air Blade vs SH, Liberty vs Vision, Grande vs FreeGo, etc.
- 3.3 Buying/choosing guidance (20): best scooter by displacement class, for tall riders, for two-up, resale considerations
- 3.4 Model-year/news explainers (10): date-checked updates

### 4. Motorcycle reviews & comparisons (110)
- 4.1 Underbone/semi-auto reviews (35): Wave Alpha, Wave RS, Blade, Future, Sirius, Exciter, Raider, Winner X, GD
- 4.2 Manual/clutch sports underbone comparisons (35): Exciter vs Winner X vs Raider vs Sirius; beginner clutch bikes in Vietnam
- 4.3 Choosing guidance (25): manual vs automatic for Vietnam roads, big bikes (>175cc) and licence implications, touring capability
- 4.4 News/model-year explainers (15)

### 5. Manual & clutch motorcycles (55)
- 5.1 Learning to ride clutch (20): friction zone, hill starts in traffic, stalling recovery, clutch control exercises
- 5.2 Technique deep-dives (15): shifting patterns, engine braking, wet-weather clutch use
- 5.3 Vietnam-specific manual riding (10): manual in Hanoi traffic, long trips on manual underbones
- 5.4 Maintenance awareness for clutch bikes (10): wear signs, cable adjustment basics — general guidance only

### 6. 50cc motorbikes (45)
- 6.1 Models & brands (15): specs verified
- 6.2 Legal position of 50cc (10): licence/age/classification — canonical links to cluster 11, R1
- 6.3 Choosing/using 50cc (10): students, city suitability, speed limits
- 6.4 50cc vs e-bike vs 50cc scooter (10)

### 7. Electric motorbikes & e-bikes (90)
- 7.1 Model reviews & comparisons (30): VinFast, Dat Bike, Selex, Yadea — from MODEL-DATABASE; never imply Nguyen Tu rents them
- 7.2 Battery & charging guides (20): lithium vs lead-acid, home charging in Hanoi, battery swapping, lifespan
- 7.3 Range & performance explainers (15): real-world range factors (speed, temperature, terrain, load), range vs petrol
- 7.4 Buying & ownership (15): registration rules for e-bikes vs e-motorbikes, cost of ownership, incentives
- 7.5 Electric suitability in Hanoi (10): charging infrastructure, rain/flooding electrical safety, commuting

### 8. Maintenance & repair (120)
- 8.1 Routine maintenance (25): oil, air filters, chain care, brake checks, tyre pressure, storage — intervals verified (R5)
- 8.2 Troubleshooting (30): won't start, flat battery, brake noise, overheating, poor fuel economy, electrical faults
- 8.3 System explainers (30): CVT, drum vs disc brakes, FI vs carburettor, charging system
- 8.4 Scooter-specific care (15): belt/roller wear, CVT service concepts
- 8.5 Electric bike maintenance (15): battery care, motor/controller basics, rain care
- 8.6 Finding services in Hanoi (5): descriptive, no invented workshop claims
- Priority source: manufacturer owner's manuals / official service data. No torque/oil/pressure/voltage values from forums.

### 9. Parts, accessories & riding gear (90)
- 9.1 Helmets (20): standards, fit, full-face vs half, replacement after impact, buying in Hanoi
- 9.2 Protective gear (20): gloves, jackets, shoes, rain gear for Vietnam's climate
- 9.3 Parts explainers (25): tyres, brake pads, batteries, mirrors, exhausts, phone mounts
- 9.4 Accessories for Vietnam riding (15): luggage, covers, anti-theft
- 9.5 Buying guidance (10): genuine vs counterfeit, price factors — no invented shop prices

### 10. Riding skills & safety (60)
- 10.1 Core skills (20): low-speed control, braking technique, hazard perception, night and rain riding
- 10.2 Hanoi/Vietnam traffic skills (20): roundabouts, filtering, bus-lane and right-hook risks, rural hazards, mountain roads
- 10.3 Safety topics (15): helmet effectiveness, accident causes, first-aid basics, riding with a passenger
- 10.4 Skill progression (5)

### 11. Vietnam laws & licences (70)
- 11.1 Licence system (20): A1/A/B1 classes, 50cc rules, electric bike rules
- 11.2 Foreigners (15): IDP (1968 convention), Vietnamese licence need, conversion, rental implications
- 11.3 Traffic rules (15): helmet law and standards, drink-driving limits, lane discipline
- 11.4 Fines & penalties (10): current framework, common fines, enforcement reality
- 11.5 Registration & insurance (10): registration, compulsory insurance, inspection
- ALL rows R1: government law/decree text (chinhphu.vn / Ministry of Public Security documents) as source of truth; last_reviewed mandatory; legal facts separated from practical advice.

### 12. Hanoi travel — riding-relevant (55)
- 12.1 Riding in Hanoi (20): traffic culture for foreigners, parking rules, fuel stations, navigating by district, air quality
- 12.2 District guides (15): genuine per-district riding context
- 12.3 Practical Hanoi (20): getting around, bike-reachable day trips, riding seasons — destination facts from vietnam.travel (class A)

### 13. Motorbike trips from Hanoi (40)
- 13.1 Route guides (20): Ninh Binh, Mai Chau, Pu Luong, Ba Vi, Tam Dao, Perfume Pagoda, Moc Chau, Ha Giang loop, Cao Bang, Cat Ba
- 13.2 Trip planning (15): day vs overnight, renting vs own bike, skill requirements, packing
- 13.3 Safety on trips (5)
- R2: independent verification of route conditions and distances.

### 14. Vietnam travel by motorbike (30)
- 14.1 Big-picture guides (10): motorbiking Vietnam, north vs south, coast vs highlands
- 14.2 Long-distance logistics (10): Hanoi to Hue/Hoi An/Saigon, shipping a bike, border/permit zones
- 14.3 Culture & practicalities (10): homestays, fuel and repairs on the road, connectivity

## Overlap / cannibalization controls

1. Rental overview (1.1) vs area guides (1.5): one canonical rental hub; area guides add unique local context
2. Model review (3.1/4.1) vs comparison (3.2/4.2) vs "best for X" (3.3/4.3): distinct intents, cross-linked
3. 50cc legal (6.2) vs licence classes (11.1): 6.2 summarizes, canonical article in cluster 11
4. Electric registration (7.4) vs registration cluster (11.5): single canonical legal article
5. Clutch awareness (5.4) vs maintenance procedures (8.x): procedures only in cluster 8
6. Route guide (13.1) vs destination guide (12.3/14.x): logistics vs things to do
7. Helmet buying (9.1) vs helmet law (11.3): product vs legal, cross-linked
8. No doorway/location-spin pages

Per-batch QA: slug similarity check, distinct intent statement, distinct H1.

## Research flags

R1 legal (government text) · R2 travel/route verification · R3 manufacturer specs · R4 business facts (OWNER-FACTS only) · R5 technical service data

## Production batches (after approval + first-party data)

1. Cluster 11 (laws, government sources, highest verification burden)
2. Clusters 1–2 (rental core, conversion-relevant, OWNER-FACTS-driven)
3. Cluster 10 + cluster 8 part 1
4. Cluster 8 part 2 + cluster 9
5. Clusters 3–4 (reviews from MODEL-DATABASE)
6. Clusters 5–6
7. Cluster 7 (electric, MODEL-DATABASE electric fields)
8. Clusters 12–13
9. Cluster 14 + comparisons cleanup + internal-link audit

## Next step

Owner provides: (a) GSC export 6–12 months, (b) 100–300 anonymized customer questions, (c) OWNER-FACTS filled in. Then: build CUSTOMER-INTENTS data files, populate MODEL-DATABASE from manufacturer pages, expand each cluster to row-per-article matrix under docs/matrix/, resubmit for approval, then Batch 1.
