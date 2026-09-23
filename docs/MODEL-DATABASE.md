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

Values below were read from Honda Vietnam model detail pages on 2026-09-23 (Batch 9 groundwork for the cluster 3 scooter-review batch). Fields not yet confirmed on a manufacturer page are left EMPTY per rul
e 1 — do not fill from press or retailer pages.

| model | manufacturer | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_system | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | brakes | tyre_sizes | storage | licence_class_vn | source_url | retrieved_at | in_fleet | pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honda Vision | Honda VN | 2025/2026 (current page) | automatic scooter | 110 | eSP, 4-stroke, single, air-cooled | | | automatic (CVT) | PGM-FI (electronic fuel injection) | | | | | 97 kg | | front wheel 16 inch (manufacturer page) | | | honda.com.vn (Xe máy — Vision detail page) | 2026-09-23 | yes (pricing approved) | OWNER-FACTS only |
| Honda Air Blade 125 | Honda VN | 2025 (current page) | automatic scooter | 125 | (page lists coolant temp warning — liquid-cooled) | | | automatic (CVT) | | | | | | 110 kg | | | 23.2 L underseat (2 half-helmets), USB-C charge port | | honda.com.vn (Xe máy — Air Blade 125 detail page) | 2026-09-23 | yes (pricing approved; category pricing only) | OWNER-FACTS only |
| Honda Air Blade 160 | Honda VN | 2025 (current page) | automatic scooter | 160 | (page lists coolant temp warning — liquid-cooled) | | | automatic (CVT) | | | | | | 113 kg | | | USB-C charge port, smart key, LCD meter | | honda.com.vn (Xe máy — Air Blade 160 detail page) | 2026-09-23 | no (not a price-published fleet model) | contact only |
| Honda Lead 125 | Honda VN | 2024/2025 (current page) | automatic scooter | 125 | eSP+, 4-valve, liquid-cooled | | | automatic (CVT) | PGM-FI | | | | | | ABS version available (manufacturer news page) | | | underseat 37 L (2 full helmets), analogue+digital meter | | honda.com.vn (Xe máy — Lead detail page + Lead 125 ABS news) | 2026-09-23 | no (not a price-published fleet model) | contact only |

Notes (2026-09-23): kerb weights and dimensions recorded above as published by Honda VN (Vision 1,925 × 686 
× 1,126 mm; Air Blade 125 1,884 × 687 × 1,085 mm; Air Blade 160 1,887 × 686 × 1,086 mm). Power/torque, fuel tank, seat height, brake and tyre fields remain EMPTY until read from the manufacturer spec tables; secondary sources (including manufacturer news and press coverage) must not be used to fill them.

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

## Verified manufacturer rows - Batch 11 additions (retrieved 2026-09-23)

Values read from official Honda Vietnam and Yamaha Vietnam model pages on 2026-09-23 for the Batch 11 cluster-3 articles. Fields not published by the manufacturer are left EMPTY per rule 1. Business fields set only from OWNER-FACTS.

| model | manufacturer | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | brakes | tyre_sizes | storage | price_vn_new | source_url | retrieved_at | in_fleet | pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honda Sh mode 125 | Honda VN | 2026 (current page) | automatic scooter | 124.8 | eSP+, 4-valve, liquid-cooled, EURO 4 | 8.2 kW @ 8,500 rpm | 11.7 Nm @ 5,000 rpm | automatic (CVT) | 5.6 L | 2.16 L/100km | 765 mm | 116 kg | front ABS (Sport/Special/Premium versions) | 80/90-16 front, 100/90-14 rear | 18.5 L underseat | 66,361,091 VND (list, versions shown) | honda.com.vn/xe-may/san-pham/sh-mode-125 | 2026-09-23 | no | contact only |
| Honda SH160i | Honda VN | 2026 (current page) | automatic scooter | 156.9 | eSP+, 4-valve, liquid-cooled | 12.4 kW @ 8,500 rpm | 14.8 Nm @ 6,500 rpm | belt CVT | 7 L | 2.34 L/100km | 799 mm | 134 kg | ABS both wheels + HSTC (Sport/Special/Premium versions) | 100/80-16 front, 120/80-16 rear | 28 L underseat | 104,490,000 VND (list, SH160i Sport) | honda.com.vn/xe-may/san-pham/sh160i125i | 2026-09-23 | no | contact only |
| Honda Vario 125 | Honda VN | 2025/2026 (current page) | automatic scooter | 125 | eSP, PGM-FI, liquid-cooled, EURO 4, idling stop | 8.48 kW @ 8,500 rpm | 11.9 Nm @ 5,000 rpm | automatic (CVT) | 5.5 L | 2.11 L/100km; ~260 km/tank (normal conditions per Honda) | 769 mm | 111 kg | front disc + CBS | 90/80-14 front, 100/80-14 rear | 18 L underseat | 41,913,818 VND (list, versions shown) | honda.com.vn/xe-may/san-pham/vario-125 | 2026-09-23 | no | contact only |
| Honda Vario 160 | Honda VN | 2026 (current page) | automatic scooter | 156.9 | eSP+, 4-valve, liquid-cooled | 11.3 kW @ 8,500 rpm | 14.1 Nm @ 6,500 rpm | automatic (CVT) | 5.5 L | 2.20 L/100km | 778 mm | 118 kg | front ABS | 100/80-14 front, 120/70-14 rear | 17.9 L underseat; 422 mm flat floor | 56,690,000 VND (list, Sport version) | honda.com.vn/xe-may/san-pham/vario-160 | 2026-09-23 | no | contact only |
| Yamaha NVX 155 VVA ABS | Yamaha VN | 2025 (current page) | automatic scooter | 155.1 | Blue Core, 4-valve, SOHC, liquid-cooled, VVA | 11.3 kW (15.4 PS) @ 8,000 rpm | 13.9 Nm @ 6,500 rpm | CVT | 5.5 L | 2.19 L/100km; up to 200 km/tank (Yamaha claim) | 790 mm | 125 kg (wet) | front disc 230 mm ABS, rear drum 130 mm | 110/80-14 front, 140/70-14 rear | 25 L underseat | 55,300,000 VND (list, VVA ABS version; SP 68m, GP 69m, standard 2025 56.5m) | yamaha-motor.com.vn/xe/nvx-155-vva-abs-mau-hoan-toan-moi-bbn7/ | 2026-09-23 | no | contact only |
| Yamaha Latte 125 | Yamaha VN | 2025 (current page) | automatic scooter | 124.9 | Blue Core, 2-valve, SOHC, forced-air-cooled | 6.05 kW @ 6,500 rpm | 9.77 Nm @ 5,000 rpm | CVT | 5.0 L | 1.80 L/100km | 790 mm | 100 kg (wet) | front disc, rear drum | 90/90-12 front, 100/90-10 rear | 37 L underseat (flat floor) | 39,077,000 VND (list, 2025 limited colour version) | yamaha-motor.com.vn/xe-may/latte | 2026-09-23 | no | contact only |

Notes (2026-09-23): SH160i/125i page presents both versions; 125i output figures were not published on the retrieved page and remain EMPTY. Yamaha warranty published for NVX and Latte: 3 years or 30,000 km, whichever first. Additional manufacturer-published list prices recorded in the Batch 11 articles: Yamaha Janus 125 from 29,151,000 VND; Gear 125 Hybrid from 30,437,000 VND; FreeGo 125 from ~30,340,000 VND (confirm current); Grande from 46,244,000 VND; NMAX from 69,000,000 VND. Suzuki Address page blocked automated retrieval (403) - no Suzuki rows added; retry in a later batch. Honda Click 125i has no Honda VN product page in this retrieval (Thai import) - no technical rows; OWNER-FACTS rental pricing only.
