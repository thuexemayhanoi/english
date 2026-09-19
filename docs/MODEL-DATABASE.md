# MODEL DATABASE — Vehicle Spec Store (schema)

Status: SCHEMA — to be populated from manufacturer pages (class A) only. Retailer/classified/forum values are never entered as spec truth. Every row records source URL, retrieval date, and model year.

## Petrol bikes — fields

model · manufacturer · model_year · vehicle_type (scooter / underbone / manual / 50cc) · engine_cc · engine_type (2T/4T, cooled) · max_power · max_torque · transmission (auto/CVT, semi-auto, manual, gears) · fuel_system (carburettor/FI) · fuel_tank_capacity · fuel_economy_claimed (with test condition) · seat_height · kerb_weight · brakes (drum/disc, ABS/CBS) · tyre sizes · storage · licence_class_vn (A1/A/B1/none per current law, flag R1) · price_vn_new (optional, date-stamped) · source_url · retrieved_at · in_nguyen_tu_fleet (from OWNER-FACTS only)

## Electric bikes — fields

model · manufacturer · model_year · category (e-motorbike / e-moped / e-bike per Vietnamese classification, flag R1) · nominal_power · max_power · top_speed · battery_chemistry (LFP/NMC/lead-acid) · battery_capacity_kWh · claimed_range + test_conditions (e.g. VinFast published test condition) · real_world_range_notes (varies with speed, temperature, terrain, load) · charging_time (standard/fast) · removable_battery (yes/no) · battery_warranty · seat_height · kerb_weight · storage · licence_class_vn · registration_requirement_vn · price_vn (optional, date-stamped) · source_url · retrieved_at · in_nguyen_tu_fleet (OWNER-FACTS only)

## Rules

1. Specs only from manufacturer official pages (Honda VN, Yamaha VN, VinFast, SYM, Suzuki, Piaggio VN). If a manufacturer page lacks a value, leave it empty — never fill from a retailer or forum.
2. Claimed range must always cite the manufacturer's test condition; articles must state real-world range varies.
3. Each model-year change creates a new row; old rows retained for comparison articles with year labels.
4. `in_nguyen_tu_fleet` is set ONLY from docs/OWNER-FACTS.md. Default false.
5. Comparisons and reviews are generated FROM this database, so numbers are consistent site-wide.

## Seed catalog (to populate after approval)

Honda: Vision, Air Blade, SH, SH Mode, Lead, Wave Alpha, Wave RS, Future, Super Cub, Winner X, MSX
Yamaha: Janus, Grande, FreeGo, Latigo, Sirius, Exciter, PG-1, NEO's
Suzuki: Address, Raider, GD, VS, Burgman
Piaggio/Vespa: Liberty, Zip, Medley, Primavera, Sprint, GTS
SYM: Elegant, Attila, Excel
Electric: VinFast (Feliz, Klara, Theon, Vento...), Dat Bike (Weaver...), Selex, Yadea, Ikigai
50cc: model list from discovery, specs verified per model
