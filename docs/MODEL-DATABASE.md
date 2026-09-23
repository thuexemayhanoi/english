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

Values read from official Honda Vietnam and Yamaha Vietnam mo
del pages on 2026-09-23 for the Batch 11 cluster-3 articles. Fields not published by the manufacturer are left EMPTY per rule 1. Business fields set only from OWNER-FACTS.

| model | manufacturer | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | brakes | tyre_sizes | storage | price_vn_new | source_url | retrieved_at | in_fleet | pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honda Sh mode 125 | Honda VN | 2026 (current page) | automatic scooter | 124.8 | eSP+, 4-valve, liquid-cooled, EURO 4 | 8.2 kW @ 8,500 rpm | 11.7 Nm @ 5,000 rpm | automatic (CVT) | 5.6 L | 2.16 L/100km | 765 mm | 116 kg | front ABS (Sport/Special/Premium versions) | 80/90-16 front, 100/90-14 rear | 18.5 L underseat | 66,361,091 VND (list, versions shown) | honda.com.vn/xe-may/san-pham/sh-mode-125 | 2026-09-23 | no | contact only |
| Honda SH160i | Honda VN | 2026 (current page) | automatic scooter | 156.9 | eSP+, 4-valve, liquid-cooled | 12.4 kW @ 8,500 rpm | 14.8 Nm @ 6,500 rpm | belt CVT | 7 L | 2.34 L/100km | 799 mm | 134 kg | ABS both wheels + HSTC (Sport/Special/Premium versions) | 100/80-16 front, 120/80-16 rear | 28 L underseat | 104,490,000 VND (list, SH160i Sport) | honda.com.vn/xe-may/san-pham/sh160i125i | 2026-09-23 | no | contact only |
| Honda Vario 125 | Honda VN | 2025/2026 (current page) | automatic scooter | 125 | eSP, PGM-FI, liquid-cooled, EURO 4, idling stop | 8.48 kW @ 8,500 rpm | 11.9 Nm @ 5,000 rpm | automatic (CVT) | 5.5 L | 2.11 L/100km; ~260 km/tank (normal conditions per Honda) | 769 mm | 111 kg | front disc + CBS | 90/80-14 front, 100/80-14 rear | 18 L underseat | 41,913,818 VND (list, versions shown) | honda.com.vn/xe-may/san-pham/vario-125 | 2026-09-23 | no | contact only |
| Honda Vario 160 | Honda VN | 2026 (current page) | automatic scooter | 156.9 | eSP+, 4-valve, liquid-cooled | 11.3 kW @ 8,500 rpm | 14
.1 Nm @ 6,500 rpm | automatic (CVT) | 5.5 L | 2.20 L/100km | 778 mm | 118 kg | front ABS | 100/80-14 front, 120/70-14 rear | 17.9 L underseat; 422 mm flat floor | 56,690,000 VND (list, Sport version) | honda.com.vn/xe-may/san-pham/vario-160 | 2026-09-23 | no | contact only |
| Yamaha NVX 155 VVA ABS | Yamaha VN | 2025 (current page) | automatic scooter | 155.1 | Blue Core, 4-valve, SOHC, liquid-cooled, VVA | 11.3 kW (15.4 PS) @ 8,000 rpm | 13.9 Nm @ 6,500 rpm | CVT | 5.5 L | 2.19 L/100km; up to 200 km/tank (Yamaha claim) | 790 mm | 125 kg (wet) | front disc 230 mm ABS, rear drum 130 mm | 110/80-14 front, 140/70-14 rear | 25 L underseat | 55,300,000 VND (list, VVA ABS version; SP 68m, GP 69m, standard 2025 56.5m) | yamaha-motor.com.vn/xe/nvx-155-vva-abs-mau-hoan-toan-moi-bbn7/ | 2026-09-23 | no | contact only |
| Yamaha Latte 125 | Yamaha VN | 2025 (current page) | automatic scooter | 124.9 | Blue Core, 2-valve, SOHC, forced-air-cooled | 6.05 kW @ 6,500 rpm | 9.77 Nm @ 5,000 rpm | CVT | 5.0 L | 1.80 L/100km | 790 mm | 100 kg (wet) | front disc, rear drum | 90/90-12 front, 100/90-10 rear | 37 L underseat (flat floor) | 39,077,000 VND (list, 2025 limited colour version) | yamaha-motor.com.vn/xe-may/latte | 2026-09-23 | no | contact only |

Notes (2026-09-23): SH160i/125i page presents both versions; 125i output figures were not published on the retrieved page and remain EMPTY. Yamaha warranty published for NVX and Latte: 3 years or 30,000 km, whichever first. Additional manufacturer-published list prices recorded in the Batch 11 articles: Yamaha Janus 125 from 29,151,000 VND; Gear 125 Hybrid from 30,437,000 VND; FreeGo 125 from ~30,340,000 VND (confirm current); Grande from 46,244,000 VND; NMAX from 69,000,000 VND. Suzuki Address page blocked automated retrieval (403) - no Suzuki rows added; retry in a later batch. Honda Click 125i has no Honda VN product page in this retrieval (Thai import) - no technical rows; OWNER-FACTS rental pricing only.


## Verified manufacturer rows - Batch 12 additions (retrieved 2026-09-23)

Values read from official Yamaha Vietnam model pages on 2026-09-23 for the Batch 12 cluster-3 articles (NMAX 155, Gear 125 Hybrid, Lexi 155). Fields not published by the manufacturer are left EMPTY per rule 1. Business fields set only from OWNER-FACTS.

| model | manufacturer | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | brakes | tyre_sizes | storage | price_vn_new | source_url | retrieved_at | in_fleet | pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Yamaha NMAX 155 | Yamaha VN | 2026 (current page) | automatic scooter | 155.1 | Blue Core, 4-valve, SOHC, liquid-cooled, VVA (G3Y1E) | 11.3 kW @ 8,000 rpm | 14.2 Nm @ 6,500 rpm | CVT | 7.1 L | 2.26 L/100km | 770 mm | 131 kg | dual-channel ABS + traction control (TCS) | 110/70-13 front, 130/70-13 rear | 24 L underseat | 69,000,000 VND (list, standard; TECH MAX version also offered) | yamaha-motor.com.vn/xe-may/nmax | 2026-09-23 | no | contact only |
| Yamaha Gear 125 Hybrid | Yamaha VN | 2026 (current page) | automatic scooter | 124.9 | Blue Core, air-cooled, EFI, hybrid assist (smart motor generator, up to 3 s after launch) | 6.2 kW @ 6,500 rpm | 10.6 Nm @ 4,500 rpm | CVT | 5.1 L | 1.7 L/100km | 750 mm | 96 kg | front disc, rear drum + UBS | 110/70-12 tubeless | 17.4 L underseat | from 30,437,000 VND (standard); 34,364,000 VND (premium) | yamaha-motor.com.vn/xe-may/gear-125 | 2026-09-23 | no | contact only |
| Yamaha Lexi 155 VVA-ABS | Yamaha VN | 2026 (current page) | automatic scooter | 155.1 | Blue Core, liquid-cooled, VVA | 11.3 kW @ 8,000 rpm | 14.2 Nm @ 6,500 rpm | CVT | 4.2 L | 2.19 L/100km | 768 mm | 118 kg | front disc ABS, rear drum | 90/90-14 front, 100/90-14 rear | (not published on retrieved page) | 48,900,000 VND (list, VVA-ABS premium version; from 48,500,000 VND across versions) | yamaha-motor.com.vn/xe-may/lexi | 2026-09-23 | no | contact only |

Notes (2026-09-23): Yamaha warranty 3 years or 30,000 km, whichever first (published for Lexi 155). Published payload figures: NMAX 155 167 kg, Gear 125 Hybrid 157 kg. Published dimensions: NMAX 155 1935 x 740 x 1200 mm, wheelbase 1,340 mm, ground clearance 127 mm; Gear 125 Hybrid 1850 x 685 x 1075 mm, wheelbase 1,280 mm, ground clearance 135 mm; Lexi 155 1968 x 719 x 1138 mm, wheelbase 1,353 mm, ground clearance 135 mm. Real-world fuel economy and range vary with speed, load and conditions - articles state this alongside the manufacturer figures.

## Verified manufacturer rows - Batch 14 additions (retrieved 2026-09-23)

Values read from official Honda Vietnam and Yamaha Vietnam motorcycle (xe so / xe con tay) model pages on 2026-09-23 for the Batch 14 cluster-4 articles. Fields not published by the manufacturer are left EMPTY per rule 1 (notably Sirius and Exciter seat heights, Super Cub/CT125 clutch details, Winner R/CBR150R gearbox detail). Business fields set only from OWNER-FACTS. Suzuki (GD110) returned HTTP 403 and SYM (Excel) blocked automated access again in this batch's retries - no Suzuki/SYM rows; retry in a later batch.

| model | manufacturer | model_year | vehicle_type | engine_cc | engine_type | max_power | max_torque | transmission | fuel_tank | fuel_economy_claimed | seat_height | kerb_weight | brakes | tyre_sizes | storage | price_vn_new | source_url | retrieved_at | in_fleet | pricing |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Honda Wave Alpha 110 | Honda VN | current page (2023/2024 history) | semi-automatic underbone | 109.2 | 4-stroke, 1 cylinder, air-cooled | 6.12 kW @ 7,500 rpm | 8.44 Nm @ 5,500 rpm | mechanical 4-speed rotary, electric start | 3.7 L | 1.72 L/100km | 770 mm | 96 kg | (no disc version listed on page) | 70/90-17 front, 80/90-17 rear | (none published) | 18,841,091 VND (list) | honda.com.vn/xe-may/san-pham/wave-alpha-110 | 2026-09-23 | class yes (Honda Wave pricing approved) | OWNER-FACTS only |
| Honda Blade | Honda VN | current page (2018-2023 history) | semi-automatic underbone | 109.1 | 4-stroke, 1 cylinder, air-cooled, Euro 3 | 6.18 kW @ 7,500 rpm | 8.65 Nm @ 5,500 rpm | mechanical 4-speed rotary, kick/electric start | 3.7 L | 1.85 L/100km | 769 mm | 98 kg (spoked drum) / 99 kg (spoked disc, alloy) | Sport version: alloy wheels + front disc; others front drum | 70/90-17 front, 80/90-17 rear | (none published) | 21,943,637 VND (list) | honda.com.vn/xe-may/san-pham/blade | 2026-09-23 | no | contact only |
| Honda Wave RSX | Honda VN | current page (2023/2024/2026 history) | semi-automatic underbone | 109.2 | 4-stroke, 1 cylinder, air-cooled, PGM-FI | 6.46 kW @ 7,500 rpm | 8.70 Nm @ 6,000 rpm | mechanical 4-speed rotary, kick/electric start | 4.0 L | 1.56 L/100km | 760 mm | 98 kg | (versions not itemised on retrieved page) | 70/90-17 front, 80/90-17 rear | U-box (1 half helmet), 4-in-1 key | 25,664,727 VND (list) | honda.com.vn/xe-may/san-pham/wave-rsx | 2026-09-23 | no | contact only |
| Honda Future 125 FI | Honda VN | current page | semi-automatic underbone | 124.9 | 4-stroke, 1 cylinder, air-cooled | 6.83 kW @ 7,500 rpm | 10.2 Nm @ 5,500 rpm | mechanical 4-speed rotary, kick/electric start | 4.6 L | 1.47 L/100km | 756 mm | 104 kg | (versions not itemised on retrieved page) | 70/90-17 front, 80/90-17 rear | (none published) | from 30,622,909 VND (list, 3 versions) | honda.com.vn/xe-may/san-pham/future-125-fi | 2026-09-23 | no | contact only |
| Honda Super Cub C125 | Honda VN | current page | underbone (classic, manual-shift) | 123.9 | 4-stroke, 1 cylinder, air-cooled | 6.87 kW @ 7,500 rpm | 10.15 Nm @ 5,000 rpm | mechanical (4-speed per page transmission data), electric start | 3.7 L | 1.55 L/100km | 780 mm | 109 kg | (not itemised on retrieved page) | 70/90-17 front, 80/90-17 rear | (none published) | 88,353,813 VND (list) | honda.com.vn/xe-may/san-pham/super-cub-c125 | 2026-09-23 | no | contact only |
| Honda CT125 | Honda VN | current page | underbone (adventure-styled, manual-shift) | 123.9 | 4-stroke, 1 cylinder, air-cooled | 6.76 kW @ 6,250 rpm | 10.9 Nm @ 4,750 rpm | 4-speed, electric start | 5.4 L | 1.61 L/100km | 800 mm | 117 kg | (not itemised on retrieved page) | 80/90-17 front, 80/90-17 rear | (rack styling; no litres published) | 85,997,455 VND (list) | honda.com.vn/xe-may/san-pham/ct125 | 2026-09-23 | no | contact only |
| Honda Winner R | Honda VN | current page | manual-clutch sport underbone (xe con tay) | 149.2 | HONDA KC46E, 4-stroke, 1 cylinder, liquid-cooled | 11.5 kW @ 9,000 rpm | 13.5 Nm @ 7,000 rpm | manual clutch (detail not published), electric start | 4.5 L | 2.59 L/100km (UDC method; page notes method change vs 1.98 L/100km prior) | 795 mm | 124 kg | (not itemised on retrieved page) | 90/80-17 front, 120/70-17 rear | (none published) | 46,360,000 VND (list) | honda.com.vn/xe-may/san-pham/winner-r | 2026-09-23 | no | contact only |
| Honda CBR150R | Honda VN | current page | manual-clutch full-fairing sport (xe con tay) | 149.2 | 4-stroke, 1 cylinder, liquid-cooled, DOHC | 12.6 kW @ 9,000 rpm | 14.4 Nm @ 7,000 rpm | manual clutch (detail not published), electric start | 12 L | 2.91 L/100km | 788 mm | 139 kg | (not itemised on retrieved page) | 100/80-17 front, 130/70-17 rear | (none published) | 72,290,000 VND (list) | honda.com.vn/xe-may/san-pham/cbr150r | 2026-09-23 | no | contact only |
| Yamaha Sirius RC 110 | Yamaha VN | current page (RC alloy-wheel version) | semi-automatic underbone (xe so) | 110.3 | 4-stroke, 1 cylinder, SOHC, air-cooled | 5.9 kW @ 8,000 rpm | 9.0 Nm @ 5,000 rpm | 4-speed rotary, wet multi-plate centrifugal clutch | 4.2 L | 2.08 L/100km | (not published on retrieved page) | 100 kg wet | RC version: front hydraulic disc + rear drum; drum and disc versions exist | 70/90-17 front, 80/90-17 rear (with inner tubes) | (none published) | 21,993,000 VND (list, RC version) | yamaha-motor.com.vn/xe/sirius-rc | 2026-09-23 | class yes (Yamaha Sirius pricing approved) | OWNER-FACTS only |
| Yamaha Exciter 155 VVA | Yamaha VN | current page (limited ABS Monster version shown) | manual-clutch sport underbone (xe con tay) | 155 | 4-stroke, 1 cylinder, 4-valve, SOHC, liquid-cooled, VVA, EFI | 13.2 kW (17.9 PS) @ 9,500 rpm | 14.4 Nm @ 8,000 rpm | 6-speed, Assist and Slipper clutch, electric start | 5.4 L | 2.07 L/100km | (not published on retrieved page) | 123 kg wet | front single hydraulic disc 2-piston + rear disc; ABS on limited ABS versions | 90/80-17 front tubeless, 120/70-17 rear tubeless | (none published) | 55,200,000 VND (list, limited ABS Monster version shown) | yamaha-motor.com.vn/xe/exciter-155-vva | 2026-09-23 | no | contact only |

Notes (2026-09-23): Honda published dimensions - Wave Alpha 1913 x 689 x 1076 mm, wheelbase 1224 mm, clearance 134 mm; Blade 1920 x 702 x 1075 mm, wheelbase 1217 mm, clearance 141 mm; Wave RSX 1922 x 709 x 1082 mm, wheelbase 1227 mm, clearance 135 mm; Future 125 FI 1931 x 711 x 1083 mm, wheelbase 1258 mm, clearance 133 mm; Super Cub C125 1910 x 718 x 1002 mm, wheelbase 1243 mm, clearance 136 mm; CT125 1961 x 805 x 1085 mm, wheelbase 1258 mm, clearance 165 mm; Winner R 2013 x 725 x 1075 mm, wheelbase 1277 mm, clearance 153 mm; CBR150R 1983 x 700 x 1090 mm, wheelbase 1312 mm, clearance 151 mm. Yamaha published dimensions - Sirius RC 1890 x 665 x 1035 mm; Exciter 155 VVA 1975 x 665 x 1105 mm. Honda published engine oil capacities (drain/overhaul): Wave Alpha 0.8/1.0 L; Blade 0.8/1.0 L; Wave RSX 0.8/1.0 L; Future 0.7/0.9 L; Super Cub 0.80/0.85-1.00 L; CT125 0.8/0.85-1.0 L; Winner 1.1/1.3 L; CBR150R 1.1/1.3 L. Wave Alpha and Sirius fuel systems are not stated on the retrieved pages - no carburettor or injection claims may be made for those two models. Real-world fuel economy and range vary with speed, load and conditions - articles state this alongside the manufacturer figures.
