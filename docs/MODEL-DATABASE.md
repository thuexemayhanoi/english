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

## Verified manufacturer rows — Honda VN + Yamaha VN (retrieved 2026-09-23, Batch 10 spec research)

Full specification tables read from official manufacturer model pages for the cluster 3 Part 1 scooter-review batch. These rows supersede the partial seed rows above (which remain for history). Fields not confirmed on a manufacturer page are left EMPTY per rule 1. Retail prices are the manufacturers' suggested retail prices ("giá bán lẻ đề xuất") as listed on their Vietnam sites on 2026-09-23.

### Honda VN (honda.com.vn model pages)

| model | model_year | engine_cc | engine_type | max_power | max_torque | transmission | fuel_system | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | dimensions (mm) | brakes | tyre_sizes | storage | list_price_vn | source_url | retrieved_at |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honda Vision | 2026 (current page) | 109.5 | eSP, 4-stroke, single, air-cooled | 6.59 kW @ 7,500 rpm | 9.29 Nm @ 6,000 rpm | automatic (CVT belt) | PGM-FI; ACG starter; idling stop | 4.8 L | 1.82 L/100 km (manufacturer claim) | 785 mm | 97 kg | 1,925 x 686 x 1,126; wheelbase 1,277 mm; clearance 175 mm | | front 80/90-16, rear 90/90-14 | | from 31,506,545 VND | honda.com.vn/xe-may/san-pham/vision | 2026-09-23 |
| Honda Air Blade 160 | 2025/2026 (current page) | 156.9 | 4-stroke, single, liquid-cooled | 11.2 kW @ 8,000 rpm | 14.8 Nm @ 6,000 rpm | belt CVT | | 4.4 L | 2.23 L/100 km (manufacturer claim) | 775 mm | 113 kg | 1,887 x 686 x 1,086; wheelbase 1,286 mm; clearance 142 mm | | front 90/80-14, rear 100/80-14 | USB-C port, smart key, LCD meter | family from 42,404,727 VND | honda.com.vn/xe-may/san-pham/air-blade-160125 | 2026-09-23 |
| Honda Air Blade 125 | 2025/2026 (current page) | 125 | liquid-cooled | | | belt CVT | | | | | 110 kg | | | | 23.2 L underseat (two half-helmets), USB-C port | family from 42,404,727 VND | honda.com.vn/xe-may/san-pham/air-blade-160125 | 2026-09-23 |
| Honda Lead ABS | 2025/2026 (current page) | 124.8 | 4-stroke, single, liquid-cooled | 8.22 kW @ 8,500 rpm | 11.7 Nm @ 5,250 rpm | belt CVT | | 6.0 L | 2.1 L/100 km (manufacturer claim) | 760 mm | 114 kg | 1,844 x 714 x 1,132; wheelbase 1,273 mm; clearance 140 mm | ABS version available | front 90/90-12, rear 100/90-10 | 37 L underseat (two full helmets), analogue+digital meter | from 39,753,818 VND | honda.com.vn/xe-may/san-pham/lead-abs | 2026-09-23 |

Notes: Honda VN does not publish a separate full spec table for the Air Blade 125 variant; its power/torque/economy fields stay EMPTY. Honda VN product list page (2026-09-23) also lists: SH350i from 151,390,000; SH160i/125i from 76,670,182; SH Mode 125 from 59,684,727; Vario 160 from 56,690,000; Vario 125 from 41,913,818; Super Cub C125 from 87,372,000; Future 125 FI from 30,622,909; Wave Alpha 110 from 17,957,455; Wave RSX from 22,130,182; Winner R from 46,360,000 VND.

### Yamaha VN (yamaha-motor.com.vn model pages)

| model | model_year | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | dimensions (mm) | brakes | tyre_sizes | storage | list_price_vn | source_url | retrieved_at |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Yamaha Janus 125 | current (2025/2026 pages) | 124.9 | Blue Core, 4-stroke, single; Stop & Start | 7.0 kW @ 8,000 rpm | 9.6 Nm @ 5,500 rpm | CVT (dry centrifugal clutch) | 4.2 L | 1.98 L/100 km (manufacturer claim) | 770 mm | 97 kg | 1,850 x 705 x 1,120; wheelbase 1,260 mm; clearance 135 mm | front hydraulic disc, rear drum | front 80/80-14 tubeless, rear 100/70-14 tubeless | 15.3 L; USB charge port | from 29,151,000 VND; warranty 3 yr/30,000 km | yamaha-motor.com.vn/xe/janus-phien-ban-tieu-chuan-hoan-toan-bj7p/ | 2026-09-23 |
| Yamaha FreeGo 125 | current (2025/2026 pages) | 124.9 | Blue Core, 4-stroke, 2-valve, SOHC, forced-air-cooled | 7.0 kW @ 8,000 rpm | 9.0 Nm @ 5,500 rpm | CVT; oil capacity 0.84 L at change | 3.9 L | 2.03 L/100 km (manufacturer claim) | 780 mm | 100 kg (wet) | 1,915 x 685 x 1,110; wheelbase 1,280 mm; clearance 135 mm | front disc, rear drum; FreeGo S ABS version; LED headlight | front 100/90-12 tubeless, rear 110/90-12 tubeless | 25 L; SmartKey; phone charge port | std from 30,340,000; FreeGo S ABS from 34,265,500 VND | yamaha-motor.com.vn/xe/freego-phien-ban-tieu-chuan-mau-moi-b4ub/ | 2026-09-23 |
| Yamaha Grande | current (2025/2026 pages) | | Blue Core Hybrid (capacity/output not published on model page) | | | | | | | 100 kg (wet) | 1,820 x 684 x 1,155; clearance 127 mm | front single hydraulic disc, rear drum; LED front | 110/70-12 front and rear (MAXXIS fitment) | 27 L lit underseat; SmartKey; USB; Y-Connect | from 46,244,000 VND | yamaha-motor.com.vn/xe/grande-phien-ban-tieu-chuan-mau-moi-nhat-2025/ | 2026-09-23 |

Notes: Yamaha VN category pages (2026-09-23) additionally list: Latte — Blue Core 125, claimed 1.8 L/100 km, 37 L trunk, SmartKey, from 38,095,000 VND; NVX 155 VVA — Blue Core 155, ABS version from 55,300,000 VND, 25 L trunk; Lexi 155 VVA-ABS from 48,500,000 VND; NMAX from 69,000,000 VND; XMAX from 140,000,000 VND. Grande engine output fields stay EMPTY until published on a Yamaha VN model page.
