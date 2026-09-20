# WEBSITE TAXONOMY — English Motorbike Knowledge Hub

Status: ACTIVE — synchronized with the implemented architecture (14 canonical topic clusters). The implemented cluster set is authoritative; user-facing labels may differ from slugs.

## 0. Navigation grouping (user-facing parents)

Navigation parents are presentation concepts defined in `_data/navigation.yml`; they do not create URLs. Canonical hub URLs remain `/topics/<cluster>/`.

- Rent a bike → `rental`, `monthly-rental`
- Choose a bike → `scooters`, `motorcycles`, `manual-clutch`, `50cc`, `electric`
- Ride & maintain → `maintenance`, `parts-gear`, `safety`
- Rules → `law-licences`
- Explore → `hanoi`, `trips`, `vietnam-travel`

## 1. Content categories (top level — 14 canonical clusters)

1. `rental` — Hanoi motorbike rental
2. `monthly-rental` — Monthly / long-term motorbike rental
3. `scooters` — Scooter reviews, comparisons, buying guidance
4. `motorcycles` — Motorcycle reviews, comparisons
5. `manual-clutch` — Manual and clutch motorcycles
6. `50cc` — 50cc bikes and licence-free riding
7. `electric` — Electric motorbikes and e-bikes
8. `maintenance` — Maintenance and repair
9. `parts-gear` — Parts, accessories, riding gear
10. `safety` — Riding skills and safety
11. `law-licences` — Vietnam motorbike laws and licences
12. `hanoi` — Hanoi travel and riding in Hanoi
13. `trips` — Motorbike trips from Hanoi
14. `vietnam-travel` — Vietnam travel related to riding/transport

Note: `parts-gear` (implemented) supersedes the earlier proposed `parts-accessories` slug. Do not rename existing cluster slugs casually.

## 2. Entity taxonomies

### 2.1 Bike types
scooter (automatic) · underbone (semi-automatic) · manual/clutch motorcycle · 50cc motorbike · moped · electric motorbike · electric bicycle (e-bike) · electric moped · off-road/dirt bike · cafe racer/styled bike · big bike (>175cc)

### 2.2 Manufacturers
Honda · Yamaha · Suzuki · Piaggio/Vespa · SYM · Kymco · Ducar · VinFast · Dat Bike · Yadea · Selex · Ikigai · Honsha · other local e-bike brands

### 2.3 Notable models (spec discovery targets — verify from manufacturer pages; NOT a rental fleet list)
- Honda: Vision, Air Blade, SH, SH Mode, Lead, Vario, Click, GR, Future, Super Cub, Wave Alpha, Wave RS, Blade, Winner X, MSX
- Yamaha: Janus, Grande, FreeGo, Latigo, Sirius, Exciter, PG-1, NXT, NEO's
- Suzuki: Address, Burgman, Raider, GD, VS
- Piaggio/Vespa: Liberty, Zip, Medley, Vespa Primavera/Sprint/GTS
- SYM: Elegant, Attila, Excel
- Electric: VinFast Feliz/Klara/Theon, Dat Bike Weaver, Selex Camel, Yadea models
- 50cc: various underbone/scooter 50cc models (verify each from manufacturer source)

### 2.4 Components / technical topics
engine (2-stroke/4-stroke) · CVT transmission · clutch · carburettor vs fuel injection · brakes (drum/disc, ABS, CBS) · suspension · tyres · battery (lead-acid/lithium) · charging system · lights/electrical · chain and sprocket · fuel system · air filter · oil system · cooling · ECU · regenerative braking

### 2.5 Hanoi districts (riding-relevant)
Hoan Kiem (Old Quarter) · Ba Dinh · Dong Da · Hai Ba Trung · Cau Giay · Tay Ho (expat area) · Thanh Xuan · Ha Dong · Hoang Mai · Long Bien (shop location) · Bac/Nam Tu Liem · suburbs and ring roads

### 2.6 Destinations / trip entities
Ninh Binh (Trang An, Tam Coc) · Ha Long · Cat Ba · Mai Chau · Pu Luong · Moc Chau · Sa Pa · Ha Giang loop · Cao Bang (Ban Gioc) · Ba Vi · Duong Lam · Perfume Pagoda (Chua Huong) · Tam Dao · Dien Bien · Phong Nha · Hue · Hoi An · Ho Chi Minh Road · coastal routes

### 2.7 Law / licence topics
licence classes (A1, A2, B1) · IDP and 1968 Vienna Convention · converting foreign licences · Vietnamese licence for foreigners · Law on Road Traffic Order and Safety · penalty decrees and current fine levels · helmet standards (QCVN) · age minimums · 50cc/electric classification rules · vehicle registration · compulsory insurance (TNGT) · drink-driving limits · traffic signal and lane rules · driving tests

## 3. Vehicle card data model (for model pages)

image · model · manufacturer · vehicle type · engine size / power · transmission (auto/semi-auto/manual) · licence requirement · suitability profile · fuel economy or electric range (with test condition) · price status (rental pricing ONLY for verified fleet models; informational models get no Nguyen Tu pricing)

## 4. Article metadata schema (consistent across project)

title · slug · description · author · category · tags · content_type (guide/review/comparison/faq/news/legal/how-to) · search_intent (informational/commercial-investigational/transactional) · topic_cluster · subcluster · vehicle_type · manufacturer · model · model_year · last_reviewed · sources · internal_link_targets · demand_source (gsc/customer/skeleton)

## 5. Site architecture principles

- Jekyll, GitHub Pages, baseurl `/english`, `relative_url` everywhere
- Mobile-first (390px QA), Light/Dark/Auto theme
- Breadcrumbs, category hubs, search, vehicle/model filters, structured data (Article, BreadcrumbList; LocalBusiness on contact pages only)
- SEO implementation follows Google Search Central / schema.org / Jekyll / GitHub Pages official documentation, not blog recipes
- `_queue/` for unpublished drafts, excluded from production output
- Accordion footer, contact CTAs to +84 942 467 674 within 09:00–21:00 only
