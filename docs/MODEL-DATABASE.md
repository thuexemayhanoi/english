# MODEL DATABASE — Vehicle Spec Store

Rules:
1. Specs ONLY from manufacturer official pages (Honda VN, Yamaha VN, VinFast, SYM, Suzuki, Piaggio VN). Missing value → leave empty. Never fill from retailer/classified/forum.
2. Claimed range always cites the manufacturer's test condition; articles must state real-world range varies (speed, temperature, terrain, load).
3. Model-year change → new row; old rows retained for comparison articles with year labels.
4. `in_fleet` and `pricing` set ONLY from docs/OWNER-FACTS.md. Default false/no-price.
5. Reviews/comparisons generate FROM this database so numbers are consistent site-wide.
6. `spec_status`: APPROVED (owner-supplied rental data) / PENDING-VERIFICATION (must be checked against manufacturer page before the article is written).

## Seed rows — fleet models (rental data APPROVED, specs PENDING-VERIFICATION)

| model | type | day VND | week VND | month VND | in_fleet | spec_status |
|---|---|---|---|---|---|---|
| Honda Wave (Alpha/RS class) | semi-auto underbone | 150,000 | — | — | yes (pricing approved) | PENDING-VERIFICATION |
| Honda Vision | automatic scooter | 200,000 | 800,000–1,000,000 | 1,800,000–2,000,000 | yes (pricing approved) | PENDING-VERIFICATION |
| Honda Air Blade | automatic scooter | 200,000 | 800,000 | 1,400,000 | yes (pricing approved) | PENDING-VERIFICATION |
| Honda Click | automatic scooter | 150,000 | 600,000–700,000 | 1,000,000–1,200,000 | yes (pricing approved) | PENDING-VERIFICATION |
| Yamaha Mio | automatic scooter | 150,000 | 600,000–700,000 | 1,000,000–1,200,000 | yes (pricing approved) | PENDING-VERIFICATION |

50cc and electric models: in_fleet=uncertain, pricing=contact-only (OWNER-FACTS).

## Verified manufacturer rows — Honda VN (retrieved 2026-09-23, honda.com.vn model pages)

Values below were read from Honda Vietnam model detail pages on 2026-09-23 (Batch 9 groundwork for the cluster 3 scooter-review batch). Fields not yet confirmed on a manufacturer page are left EMPTY per rule 1 — do not fill from press or retailer pages.

| model | manufacturer | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_system | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | brakes | tyre_sizes | storage | licence_class_vn | source_url | retrieved_at | in_fleet | pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honda Vision | Honda VN | 2025/2026 (current page) | automatic scooter | 110 | eSP, 4-stroke, single, air-cooled | | | automatic (CVT) | PGM-FI (electronic fuel injection) | | | | | 97 kg | | front wheel 16 inch (manufacturer page) | | | honda.com.vn (Xe máy — Vision detail page) | 2026-09-23 | yes (pricing approved) | OWNER-FACTS only |
| Honda Air Blade 125 | Honda VN | 2025 (current page) | automatic scooter | 125 | (page lists coolant temp warning — liquid-cooled) | | | automatic (CVT) | | | | | | 110 kg | | | 23.2 L underseat (2 half-helmets), USB-C charge port | | honda.com.vn (Xe máy — Air Blade 125 detail page) | 2026-09-23 | yes (pricing approved; category pricing only) | OWNER-FACTS only |
| Honda Air Blade 160 | Honda VN | 2025 (current page) | automatic scooter | 160 | (page lists coolant temp warning — liquid-cooled) | | | automatic (CVT) | | | | | | 113 kg | | | USB-C charge port, smart key, LCD meter | | honda.com.vn (Xe máy — Air Blade 160 detail page) | 2026-09-23 | no (not a price-published fleet model) | contact only |
| Honda Lead 125 | Honda VN | 2024/2025 (current page) | automatic scooter | 125 | eSP+, 4-valve, liquid-cooled | | | automatic (CVT) | PGM-FI | | | | | | ABS version available (manufacturer news page) | | | underseat 37 L (2 full helmets), analogue+digital meter | | honda.com.vn (Xe máy — Lead detail page + Lead 125 ABS news) | 2026-09-23 | no (not a price-published fleet model) | contact only |

Notes (2026-09-23): kerb weights and dimensions recorded above as published by Honda VN (Vision 1,925 × 686 × 1,126 mm; Air Blade 125 1,884 × 687 × 1,085 mm; Air Blade 160 1,887 × 686 × 1,086 mm). Power/torque, fuel tank, seat height, brake and tyre fields remain EMPTY until read from the manufacturer spec tables; secondary sources (including manufacturer news and press coverage) must not be used to fill them.

## Petrol fields (per row)

model · manufacturer · model_year · vehicle_type · engine_cc · engine_type · max_power · max_torque · transmission · fuel_system · fuel_tank · fuel_economy_claimed (with condition) · seat_height · kerb_weight · brakes (drum/disc, ABS/CBS) · tyre sizes · storage · licence_class_vn (R1) · price_vn_new (optional, date-stamped) · source_url · retrieved_at · in_fleet · pricing

## Electric fields (per row)

model · manufacturer · model_year · category (e-motorbike/e-moped/e-bike, R1) · nominal_power · max_power · top_speed · battery_chemistry · battery_capacity_kWh · claimed_range + test_conditions · real_world_range_notes · charging_time (standard/fast) · removable_battery · battery_warranty · seat_height · kerb_weight · storage · licence_class_vn · registration_requirement_vn · price_vn (date-stamped) · source_url · retrieved_at · in_fleet · pricing

## Catalog to populate (manufacturer pages, before relevant article batches)

Honda: Vision, Air Blade, SH, SH Mode, Lead, Vario, Click, GR, Future, Super Cub, Wave Alpha, Wave RS, Blade, Winner X, MSX
Yamaha: Janus, Grande, FreeGo, Latigo, Sirius, Exciter, PG-1, NEO's, NXT
Suzuki: Address, Burgman, Raider, GD, VS
Piaggio/Vespa: Liberty, Zip, Medley, Primavera, Sprint, GTS
SYM: Elegant, Attila, Excel
Electric: VinFast (Feliz, Klara, Theon, Vento...), Dat Bike (Weaver...), Selex, Yadea, Ikigai
50cc: verified per model from manufacturer sources

Population happens per batch with fresh manufacturer-page research; each row records source URL and retrieval date.
