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
| Honda Vision | automatic scooter | 200,000 | 800,000–1,000,000 | 1,800,000–2,000,000 | yes (pricing approved) | see verified Honda row below |
| Honda Air Blade | automatic scooter | 200,000 | 800,000 | 1,400,000 | yes (pricing approved) | see verified Honda rows below |
| Honda Click | automatic scooter | 150,000 | 600,000–700,000 | 1,000,000–1,200,000 | yes (pricing approved) | PENDING-VERIFICATION (not a Honda VN catalogue model — verify from official source of the actual unit) |
| Yamaha Mio | automatic scooter | 150,000 | 600,000–700,000 | 1,000,000–1,200,000 | yes (pricing approved) | PENDING-VERIFICATION (not in current Yamaha VN catalogue — verify from official source of the actual unit) |

50cc and electric models: in_fleet=uncertain, pricing=contact-only (OWNER-FACTS).

## Verified manufacturer rows (retrieved 2026-09-23, official manufacturer model pages)

Values below were read from official manufacturer Vietnam model detail pages on 2026-09-23 (Batch 10 research groundwork for the cluster 3 scooter-review batch). Fields not confirmed on a manufacturer page are left EMPTY per rule 1 — do not fill from press, retailer or classified pages. `price_vn_new` is the manufacturer's suggested retail price as published on the same page, date-stamped. Claimed fuel economy is the manufacturer's own figure; articles must state real-world consumption varies.

### Honda VN (www.honda.com.vn model detail pages)

| model | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | tyre_sizes | storage/features | price_vn_new (2026-09-23) | source_url | retrieved_at | in_fleet | rental pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honda Vision | 2025/2026 (current page) | automatic scooter | 109.5 | eSP, 4-stroke, single, air-cooled, PGM-FI, idling stop | 6.59 kW @ 7,500 rpm | 9.29 Nm @ 6,000 rpm | automatic (CVT) | 4.8 L | 1.82 L/100 km (manufacturer claim) | 785 mm | 97 kg | front 80/90-16M/C 43P; rear 90/90-14M/C 46P | front box with USB-C port; smart key (version-dependent); always-on headlight | 36,808,363 VND | https://www.honda.com.vn/xe-may/san-pham/vision | 2026-09-23 | yes (OWNER-FACTS) | OWNER-FACTS only |
| Honda SH Mode 125 | 2025/2026 (current page) | automatic scooter | 124.8 | 4-stroke, single, liquid-cooled | 8.2 kW @ 8,500 rpm | 11.7 Nm @ 5,000 rpm | automatic (CVT) | 5.6 L | 2.16 L/100 km (manufacturer claim) | 765 mm | 116 kg | front 80/90-16M/C 43P; rear 100/90-14M/C 57P | | 66,361,091 VND | https://www.honda.com.vn/xe-may/san-pham/sh-mode-125 | 2026-09-23 | no | contact only |
| Honda Lead 125 ABS | 2025 (current page) | automatic scooter | 124.8 | 4-stroke, single, liquid-cooled | 8.22 kW @ 8,500 rpm | 11.7 Nm @ 5,250 rpm | automatic (CVT) | 6.0 L | 2.1 L/100 km (manufacturer claim) | 760 mm | 114 kg | front 90/90-12 44J; rear 100/90-10 56J | ABS version | 45,841,091 VND | https://www.honda.com.vn/xe-may/san-pham/lead-abs | 2026-09-23 | no | contact only |
| Honda Vario 125 | 2025 (current page) | automatic scooter | 125 | 4-stroke, single, liquid-cooled | 8.48 kW @ 8,500 rpm | 11.9 Nm @ 5,000 rpm | automatic (CVT) | 5.5 L | 2.11 L/100 km (manufacturer claim) | 769 mm | 111 kg | front 90/80-14M/C 43P; rear 100/80-14M/C 48P | | 41,913,818 VND | https://www.honda.com.vn/xe-may/san-pham/vario-125 | 2026-09-23 | no | contact only |
| Honda Vario 160 | 2025 (current page) | automatic scooter | 156.9 | 4-stroke, single, liquid-cooled | 11.3 kW @ 8,500 rpm | 14.1 Nm @ 6,500 rpm | automatic (CVT) | 5.5 L | 2.20 L/100 km (manufacturer claim) | 778 mm | 118 kg | front 100/80-14M/C 48P; rear 120/70-14M/C 61P | | 56,690,000 VND | https://www.honda.com.vn/xe-may/san-pham/vario-160 | 2026-09-23 | no | contact only |
| Honda Air Blade 160 | 2025 (current page) | automatic scooter | 156.9 | 4-stroke, single, liquid-cooled | 11.2 kW @ 8,000 rpm | 14.8 Nm @ 6,000 rpm | automatic (CVT) | 4.4 L | 2.23 L/100 km (manufacturer claim) | 775 mm | 113 kg | front 90/80-14M/C 43P; rear 100/80-14M/C 48P | USB-C charge port, smart key, LCD meter | 58,790,000 VND | https://www.honda.com.vn/xe-may/san-pham/air-blade-160125 | 2026-09-23 | no (Air Blade fleet pricing covers the 125 class) | contact only |

Honda dimensions recorded on the same pages (2026-09-23): Vision 1,925 × 686 × 1,126 mm; SH Mode 125 1,950 × 668 × 1,110 mm; Lead 125 ABS 1,844 × 714 × 1,132 mm; Vario 125 1,919 × 687 × 1,075 mm; Vario 160 1,929 × 695 × 1,088 mm; Air Blade 160 1,887 × 686 × 1,086 mm. Air Blade 125 (fleet class, OWNER-FACTS pricing): manufacturer page lists 110 kg kerb, 1,884 × 687 × 1,085 mm, 23.2 L underseat storage (2 half-helmets), USB-C port; the page's numeric spec table serves the 160 version, so Air Blade 125 power/torque fields remain EMPTY (per rule 1, not filled from secondary sources).

### Yamaha VN (yamaha-motor.com.vn model detail pages)

| model | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | brakes | tyres | storage | price_vn_new (2026-09-23) | source_url | retrieved_at | in_fleet | rental pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Yamaha Grande 125 (standard, 2025) | 2025 | automatic scooter | 124.9 | Blue Core Hybrid, 4-stroke, 2-valve, SOHC, air-cooled | 6.05 kW @ 6,500 rpm | 9.77 Nm @ 5,000 rpm | CVT | 4.0 L | 1.73 L/100 km (manufacturer claim) | (not listed) | 100 kg wet | front disc, rear drum | front 110/70-12 47L; rear 110/70-12 47L | 27 L underseat with LED light, smart key, Y-Connect | 46,637,000 VND (standard 2025) | https://yamaha-motor.com.vn/xe/grande-phien-ban-tieu-chuan-mau-moi-nhat-2025-bjjd/ | 2026-09-23 | no | contact only |
| Yamaha Janus 125 (standard, all-new) | 2025 | automatic scooter | 124.9 | Blue Core, 4-stroke, air-cooled | 7.0 kW @ 8,000 rpm | 9.6 Nm @ 5,500 rpm | CVT | 4.2 L | 1.98 L/100 km (manufacturer claim) | 770 mm | 97 kg | front disc, rear drum | front tubeless 80/80-14M/C 43P; rear tubeless 100/70-14M/C 51P | 15.3 L underseat, USB charge port | 29,151,000 VND | https://yamaha-motor.com.vn/xe/janus-phien-ban-tieu-chuan-hoan-toan-bj7p/ | 2026-09-23 | no | contact only |
| Yamaha FreeGo 125 (standard) | 2025 | automatic scooter | 124.9 | Blue Core, 4-stroke, 2-valve, SOHC, air-cooled (force-cooled) | 7.0 kW @ 8,000 rpm | 9.0 Nm @ 5,500 rpm | CVT | 3.9 L | 2.03 L/100 km (manufacturer claim) | 780 mm | 100 kg wet | front disc, rear drum | front tubeless 100/90-12 59J; rear tubeless 110/90-12 64L | 25 L underseat, 12V charge port | 30,731,000 VND | https://yamaha-motor.com.vn/xe/freego-phien-ban-tieu-chuan-mau-moi-b4ub/ | 2026-09-23 | no | contact only |
| Yamaha Latte 125 (standard) | 2025 | automatic scooter | 124.9 | Blue Core, 4-stroke, 2-valve, SOHC, air-cooled (force-cooled) | 6.05 kW @ 6,500 rpm | 9.77 Nm @ 5,000 rpm | CVT | 5.0 L | 1.80 L/100 km (manufacturer claim) | 790 mm | 100 kg wet | front disc, rear drum | front tubeless 90/90-12 44J; rear tubeless 100/90-10 56J | 37 L underseat | 38,291,000 VND | https://yamaha-motor.com.vn/xe/latte-phien-ban-tieu-chuan-mau-moi-b0r5/ | 2026-09-23 | no | contact only |
| Yamaha Sirius RC 110 (alloy-wheel version) | 2025 | semi-auto underbone (4-speed) | 110.3 | 4-stroke, 2-valve, SOHC, air-cooled, carburettor VM21x1 | 5.9 kW @ 8,000 rpm | 9.0 Nm @ 5,000 rpm | 4-speed manual (rotary), wet multi-plate clutch | 4.2 L | 2.08 L/100 km (manufacturer claim) | 770 mm | 100 kg wet | front disc, rear drum | front 70/90-17 38P (tubed); rear 80/90-17 44P (tubed) | | 21,993,000 VND | https://yamaha-motor.com.vn/xe/sirius-rc-phien-ban-vanh-duc-mau-moi-bgyc/ | 2026-09-23 | no (Sirius fleet class per OWNER-FACTS refers to rental pricing only) | OWNER-FACTS only |

Yamaha dimensions recorded on the same pages (2026-09-23): Grande 1,820 × 684 × 1,155 mm; Janus 1,850 × 705 × 1,120 mm; FreeGo 1,915 × 685 × 1,110 mm; Latte 1,821 × 684 × 1,158 mm; Sirius RC 1,890 × 665 × 1,035 mm. Note: Yamaha lists some weights as "wet weight"; articles must not relabel them as kerb weight without noting the manufacturer's term.

### SYM VN (www.sym.com.vn model detail page)

| model | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | kerb_weight | brakes | tyres | price_vn_new (2026-09-23) | source_url | retrieved_at | in_fleet | rental pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SYM Attila 50 | current page | 50cc scooter | 49.5 | 4-stroke, air-cooled | 2.45 kW @ 8,500 rpm | 3.2 Nm @ 6,500 rpm | automatic | 6.2 L | 2.22 L/100 km (manufacturer claim) | 107 kg (dry weight as listed) | front disc, rear drum | front 110/70-12; rear 120/70-12 | 26,200,000 VND (VAT included) | https://www.sym.com.vn/san-pham/attila-50-5.html | 2026-09-23 | uncertain (50cc: contact only) | contact only |

SYM dimensions recorded on the same page: Attila 50 1,880 × 680 × 1,120 mm, wheelbase 1,294 mm, ground clearance 100 mm.

## PENDING — blocked official pages (2026-09-23)

- Suzuki VN (suzuki.com.vn): returned HTTP 403 to automated access on 2026-09-23. Address / Burgman / Raider / GD / VS rows remain unpopulated — do NOT fill from dealer sites.
- Piaggio VN (piaggio.com / piaggio.com.vn): blocked automated access on 2026-09-23. Liberty / Zip / Medley / Vespa rows remain unpopulated.
- Honda Click, Yamaha Mio (fleet models with approved OWNER-FACTS pricing): not present in the current Honda VN / Yamaha VN online catalogues; specification verification must come from the official source for the actual units rented — leave EMPTY until then.
- Yamaha Latigo: not found in the current Yamaha VN catalogue on 2026-09-23; treat as discontinued/unverified.

## Petrol fields (per row)

model · manufacturer · model_year · vehicle_type · engine_cc · engine_type · max_power · max_torque · transmission · fuel_system · fuel_tank · fuel_economy_claimed (with condition) · seat_height · kerb_weight · brakes (drum/disc, ABS/CBS) · tyre sizes · storage · licence_class_vn (R1) · price_vn_new (optional, date-stamped) · source_url · retrieved_at · in_fleet · pricing

licence_class_vn: left EMPTY in all rows above pending R1 verification from the current Vietnamese legal source; articles must link the VERIFIED cluster-11 legal articles instead of asserting a class here.

## Electric fields (per row)

model · manufacturer · model_year · category (e-motorbike/e-moped/e-bike, R1) · nominal_power · max_power · top_speed · battery_chemistry · battery_capacity_kWh · claimed_range + test_conditions · real_world_range_notes · charging_time (standard/fast) · removable_battery · battery_warranty · seat_height · kerb_weight · storage · licence_class_vn · registration_requirement_vn · price_vn (date-stamped) · source_url · retrieved_at · in_fleet · pricing

## Catalog to populate (manufacturer pages, before relevant article batches)

Honda: ~~Vision, SH Mode, Lead, Vario~~ (verified 2026-09-23), SH, Click, GR, Future, Super Cub, Wave Alpha, Wave RS, Blade, Winner X, MSX
Yamaha: ~~Janus, Grande, FreeGo, Latte, Sirius~~ (verified 2026-09-23), Exciter, PG-1, NEO's, NXT
Suzuki: Address, Burgman, Raider, GD, VS (blocked 2026-09-23 — retry later run)
Piaggio/Vespa: Liberty, Zip, Medley, Primavera, Sprint, GTS (blocked 2026-09-23 — retry later run)
SYM: ~~Attila 50~~ (verified 2026-09-23), Elegant, Excel
Electric: VinFast (Feliz, Klara, Theon, Vento...), Dat Bike (Weaver...), Selex, Yadea, Ikigai
50cc: verified per model from manufacturer sources

Population happens per batch with fresh manufacturer-page research; each row records source URL and retrieval date.
