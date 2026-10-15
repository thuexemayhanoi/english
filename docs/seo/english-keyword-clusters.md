# English Keyword Clusters

Generated 2026-10-15 by `scripts/english-seo-matrix.js`. Keyword ownership is defined in `docs/seo/keyword-targets.json` (hand-authored, one owner URL per keyword family); the 14 topic clusters are the implemented site taxonomy (`docs/TAXONOMY.md`, `_data/navigation.yml`). No search volumes are stated: no English Search Console export exists yet (docs/SOURCE-MAP.md), and volumes are never invented.

## Rules

- Every URL has exactly ONE primary search intent and ONE primary keyword; variants and secondary keywords are listed on the owner, never spread across competing URLs.
- Topic hubs (`/topics/<cluster>/`) are the pillar pages; commercial rental intents live in `rental` and `monthly-rental` and link outward to the vehicle, legal, safety and travel clusters.
- Cannibalization is avoided by differentiating audience, question, location, vehicle type, comparison or use case — never by creating keyword-variant articles. The production plan is complete; gaps are served by the nearest existing URL.
- Only services actually offered are targeted (docs/OWNER-FACTS.md): daily/weekly/monthly rental, Hanoi delivery by arrangement, WhatsApp/Zalo/phone/walk-in booking. No app, no online payment, no insurance, no promotions.

## Core keyword groups -> owner URLs

### Core Keywords

| Keyword | Intent | Owner URL | Owner title | Coverage | Supporting URLs | Note |
|---|---|---|---|---|---|---|
| Hanoi motorbike rental | commercial | /topics/rental/ | Hanoi Motorbike Rental | full | /articles/how-to-rent-a-motorbike-hanoi/, /articles/motorbike-rental-price-hanoi/, /articles/motorbike-rental-requirements-hanoi/, /articles/best-scooters-to-rent-hanoi/ |  |
| Motorbike rental Hanoi _(variant of Hanoi motorbike rental)_ | commercial | /topics/rental/ | Hanoi Motorbike Rental | full |  |  |
| Motorcycle rental Hanoi _(variant of Hanoi motorbike rental)_ | commercial | /topics/rental/ | Hanoi Motorbike Rental | full |  |  |
| Best motorbike rental Hanoi _(variant of Hanoi motorbike rental)_ | commercial | /topics/rental/ | Hanoi Motorbike Rental | partial |  | Shop-selection intent. Served by the hub plus trust pages; never claim rankings, awards or reviews (OWNER-FACTS). |
| Rent a motorbike in Hanoi | informational | /articles/how-to-rent-a-motorbike-hanoi/ | How to Rent a Motorbike in Hanoi: A Step-by-Step Guide | full | /articles/first-time-renting-a-motorbike-hanoi/, /articles/how-to-book-a-motorbike-rental-hanoi/ |  |
| Hanoi scooter rental | commercial | /articles/best-scooters-to-rent-hanoi/ | Best Scooters to Rent in Hanoi for Foreigners | full | /topics/scooters/, /articles/scooter-vs-semi-automatic-hanoi/ |  |
| Cheap motorbike rental Hanoi _(variant of Hanoi motorbike rental prices)_ | commercial | /articles/motorbike-rental-price-hanoi/ | How Much Does It Cost to Rent a Motorbike in Hanoi? | partial |  | Served by the published price table only; no discount or promotion wording (OWNER-FACTS). |

### Rental Services

| Keyword | Intent | Owner URL | Owner title | Coverage | Supporting URLs | Note |
|---|---|---|---|---|---|---|
| Hanoi motorbike rental delivery | commercial | /articles/motorbike-rental-pickup-or-delivery-hanoi/ | Shop Pickup vs Delivery When Renting a Motorbike in Hanoi | full | /articles/motorbike-delivery-old-quarter/, /articles/motorbike-delivery-long-bien/, /articles/delivery-pickup-monthly-rental-hanoi/ | Delivery may be available depending on location and arrangement; never promise free delivery, fixed fees or delivery times. |
| Motorbike rental with hotel delivery | commercial | /articles/motorbike-delivery-old-quarter/ | Motorbike Delivery to the Hanoi Old Quarter: How It Works | full | /articles/motorbike-rental-pickup-or-delivery-hanoi/, /articles/hotel-parking-motorbike-hanoi/ |  |
| Motorbike rental Hanoi Old Quarter | commercial | /articles/renting-motorbike-old-quarter/ | Renting a Motorbike in the Hanoi Old Quarter: What to Know | full | /articles/motorbike-delivery-old-quarter/, /articles/best-bike-for-hanoi-old-quarter/, /articles/renting-motorbike-hoan-kiem/ |  |
| Monthly motorbike rental Hanoi | commercial | /articles/monthly-motorbike-rental-hanoi/ | Monthly Motorbike Rental in Hanoi: How It Works | full | /topics/monthly-rental/, /articles/motorbike-rental-monthly-price-hanoi/, /articles/monthly-motorbike-rental-requirements-hanoi/ |  |
| Long term motorbike rental Hanoi | commercial | /topics/monthly-rental/ | Monthly Motorbike Rental | full | /articles/renting-motorbike-six-months-hanoi/, /articles/renting-motorbike-year-hanoi/, /articles/three-month-motorbike-rental-hanoi/ |  |
| Weekly motorbike rental Hanoi | commercial | /articles/weekly-vs-monthly-motorbike-rental-hanoi/ | Weekly or Monthly Motorbike Rental in Hanoi: The Crossover | full | /articles/daily-weekly-monthly-motorbike-rental-hanoi/ |  |
| Daily scooter rental Hanoi | commercial | /articles/renting-motorbike-hanoi-one-day/ | Renting a Motorbike in Hanoi for Just One Day | full | /articles/daily-weekly-monthly-motorbike-rental-hanoi/, /articles/best-scooters-to-rent-hanoi/ |  |
| Motorbike rental app Hanoi | commercial | /articles/how-to-book-a-motorbike-rental-hanoi/ | How to Book a Motorbike Rental in Hanoi (WhatsApp, Zalo, Walk-In) | full |  | No app exists. The booking guide answers the query honestly: WhatsApp, Zalo, phone or walk-in. |
| Online motorbike booking Hanoi _(variant of Motorbike rental app Hanoi)_ | commercial | /articles/how-to-book-a-motorbike-rental-hanoi/ | How to Book a Motorbike Rental in Hanoi (WhatsApp, Zalo, Walk-In) | partial |  |  |

### Vehicle Categories

| Keyword | Intent | Owner URL | Owner title | Coverage | Supporting URLs | Note |
|---|---|---|---|---|---|---|
| 50cc motorbike rental Hanoi | commercial | /articles/renting-50cc-hanoi/ | Renting a 50cc Bike in Hanoi: What to Know Before You Book | full | /topics/50cc/, /articles/can-foreigners-ride-50cc-vietnam/ | 50cc price is contact-only (OWNER-FACTS). |
| 50cc scooter rental Hanoi _(variant of 50cc motorbike rental Hanoi)_ | commercial | /articles/renting-50cc-hanoi/ | Renting a 50cc Bike in Hanoi: What to Know Before You Book | partial |  |  |
| Honda Cub rental Hanoi **GAP** | informational | /articles/riding-honda-super-cub-c125-vietnam/ | Riding the Honda Super Cub C125 in Vietnam | partial |  | No Cub appears in the approved price list, so no rental page is created or implied; the riding guide serves the query and availability is contact-only. |
| Automatic scooter rental Hanoi _(variant of Hanoi scooter rental)_ | commercial | /articles/best-scooters-to-rent-hanoi/ | Best Scooters to Rent in Hanoi for Foreigners | partial | /articles/automatic-vs-manual-motorbike-hanoi/ |  |
| Semi automatic motorbike rental Hanoi | commercial | /articles/renting-semi-automatic-underbone-hanoi/ | Renting a Semi-Automatic Underbone in Hanoi: What to Expect | full | /articles/scooter-vs-semi-automatic-hanoi/, /topics/manual-clutch/ |  |
| Electric motorbike rental Hanoi | commercial | /articles/can-foreigners-rent-electric-bike-vietnam/ | Can Foreigners Rent an E-Bike or Electric Motorbike in Vietnam? | full | /articles/e-bike-monthly-rental-hanoi/, /topics/electric/ | Only the E-Bike day rate is published; weekly/monthly electric rates are contact-only. |
| VinFast electric scooter rental Hanoi _(variant of Electric motorbike rental Hanoi)_ **GAP** | commercial | /articles/can-foreigners-rent-electric-bike-vietnam/ | Can Foreigners Rent an E-Bike or Electric Motorbike in Vietnam? | partial |  | No VinFast rental model is in the approved fleet list; availability is contact-only. Supporting lineup guide: /articles/vinfast-electric-scooter-lineup-vietnam/. |
| Motorbike rental without a license Hanoi | informational | /articles/renting-a-motorbike-hanoi-without-licence/ | Renting a Motorbike in Hanoi Without a Licence: The Real Risks | full | /articles/renting-50cc-hanoi/, /articles/can-foreigners-ride-50cc-vietnam/, /articles/no-licence-fine-vietnam/ |  |

### Travel & Local Intent

| Keyword | Intent | Owner URL | Owner title | Coverage | Supporting URLs | Note |
|---|---|---|---|---|---|---|
| Hanoi Old Quarter motorbike rental _(variant of Motorbike rental Hanoi Old Quarter)_ | commercial | /articles/renting-motorbike-old-quarter/ | Renting a Motorbike in the Hanoi Old Quarter: What to Know | full |  |  |
| Hoan Kiem motorbike rental | commercial | /articles/renting-motorbike-hoan-kiem/ | Renting a Motorbike in Hoan Kiem: What to Know | full | /articles/exploring-hoan-kiem-by-motorbike/ |  |
| Tay Ho motorbike rental | commercial | /articles/renting-motorbike-tay-ho/ | Renting a Motorbike in Tay Ho: What to Know | full | /articles/tay-ho-west-lake-area-guide-riders/ |  |
| Motorbike rental near Hanoi hotels _(variant of Hanoi motorbike rental delivery)_ | commercial | /articles/motorbike-rental-pickup-or-delivery-hanoi/ | Shop Pickup vs Delivery When Renting a Motorbike in Hanoi | partial | /articles/hotel-parking-motorbike-hanoi/ |  |
| Hanoi motorbike travel guide | informational | /topics/hanoi/ | Hanoi Travel | full | /articles/west-lake-loop-motorbike-route/, /articles/exploring-hoan-kiem-by-motorbike/, /articles/where-to-park-motorbike-hanoi/ |  |
| Renting a motorbike in Vietnam | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | full | /articles/can-tourists-ride-motorbike-vietnam/, /articles/renting-vs-buying-motorbike-vietnam-long-trip/, /articles/one-way-motorbike-rental-vietnam/ |  |
| Hanoi motorbike rental prices | commercial | /articles/motorbike-rental-price-hanoi/ | How Much Does It Cost to Rent a Motorbike in Hanoi? | full | /articles/motorbike-rental-monthly-price-hanoi/, /articles/motorbike-rental-deposit-hanoi/ |  |
| Hanoi motorbike rental requirements | informational | /articles/motorbike-rental-requirements-hanoi/ | Motorbike Rental Requirements in Hanoi: Documents, Licence, Age | full | /articles/documents-needed-rent-motorbike-hanoi/, /articles/can-tourists-rent-a-motorbike-hanoi/ |  |
| Hanoi motorbike rental for foreigners | informational | /articles/can-foreigners-rent-a-motorbike-hanoi/ | Can Foreigners Rent a Motorbike in Hanoi? | full | /articles/motorbike-rental-tourists-hanoi-essentials/, /articles/can-tourists-ride-motorbike-vietnam/ |  |
| Hanoi motorcycle routes and safety | informational | /topics/safety/ | Riding Skills and Safety | full | /topics/trips/, /articles/riding-hanoi-old-quarter-narrow-streets/, /articles/west-lake-loop-motorbike-route/ |  |

### Zero-data discoveries (2026-10-14)

| Keyword | Intent | Owner URL | Owner title | Coverage | Supporting URLs | Note |
|---|---|---|---|---|---|---|
| Motorbike Vietnam | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | full | /topics/law-licences/, /topics/safety/, /topics/trips/ | Generic head term surfaced by the zero-data research (docs/seo/keyword-universe.json: third-party estimate, US market); the Vietnam travel hub is the pillar, the law, safety and trips hubs support it. |
| Vietnam motorbike _(variant of Motorbike Vietnam)_ | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | full |  |  |
| Motorbiking in Vietnam _(variant of Motorbike Vietnam)_ | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | partial |  |  |
| Motorbike riding Vietnam _(variant of Motorbike Vietnam)_ | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | full |  |  |
| Motorbike hire Vietnam _(variant of Renting a motorbike in Vietnam)_ | commercial | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | partial |  | British/Australian wording of the same intent (keyword-universe.json, AU market). |
| Motorbike hire Hanoi _(variant of Hanoi motorbike rental)_ | commercial | /topics/rental/ | Hanoi Motorbike Rental | partial |  | British/Australian wording of the same intent. |
| Scooters in Vietnam | informational | /topics/scooters/ | Scooters in Vietnam | full | /articles/best-scooters-to-rent-hanoi/ | Vehicle-category head term; the scooter pillar answers it and routes rental intent to the Hanoi scooter rental guide. |
| Vietnam scooters _(variant of Scooters in Vietnam)_ | informational | /topics/scooters/ | Scooters in Vietnam | full |  |  |
| Vietnamese scooters _(variant of Scooters in Vietnam)_ | informational | /topics/scooters/ | Scooters in Vietnam | full |  |  |
| Scooter rental Vietnam | commercial | /topics/scooters/ | Scooters in Vietnam | full | /articles/best-scooters-to-rent-hanoi/, /topics/50cc/ | Vietnam-wide scooter rental intent; served by the scooter pillar (which links the Hanoi rental guides) because the business rents in Hanoi only. Never claim rental in other cities. |
| Mopeds Vietnam | informational | /articles/what-is-a-moped-vietnam-law/ | What Counts as a Moped Under Vietnamese Law | full | /topics/50cc/ | "Moped" is the legal 50cc class in Vietnam; the definition guide owns it, the 50cc hub supports it. |
| Vietnamese moped _(variant of Mopeds Vietnam)_ | informational | /articles/what-is-a-moped-vietnam-law/ | What Counts as a Moped Under Vietnamese Law | full |  |  |
| Vietnamese motorbikes | informational | /topics/motorcycles/ | Motorcycles in Vietnam | full | /topics/scooters/, /topics/manual-clutch/ | Generic "which bikes exist in Vietnam" head term (keyword-universe.json, US market); the motorcycles pillar owns it, the scooter and manual-clutch pillars support it. Consolidates a split family (topical map 2026-10-14). |
| Vietnamese motorcycle _(variant of Vietnamese motorbikes)_ | informational | /topics/motorcycles/ | Motorcycles in Vietnam | full |  |  |
| Motorbikes in Vietnam _(variant of Vietnamese motorbikes)_ | informational | /topics/motorcycles/ | Motorcycles in Vietnam | full |  |  |
| Honda motorbike Vietnam | informational | /topics/motorcycles/ | Motorcycles in Vietnam | full | /articles/best-honda-underbones-vietnam-verified/, /articles/honda-scooter-lineup-vietnam-explained/ | Brand head term; the motorcycles pillar (Honda and Yamaha model reviews) owns it, the Honda underbone and scooter line-up guides support it. Consolidates two split families. |
| Honda motorcycles in Vietnam _(variant of Honda motorbike Vietnam)_ | informational | /topics/motorcycles/ | Motorcycles in Vietnam | full |  |  |
| Honda bike Vietnam _(variant of Honda motorbike Vietnam)_ | informational | /topics/motorcycles/ | Motorcycles in Vietnam | partial |  |  |
| Honda bikes in Vietnam _(variant of Honda motorbike Vietnam)_ | informational | /topics/motorcycles/ | Motorcycles in Vietnam | partial |  |  |
| Motorbike routes Vietnam | informational | /topics/trips/ | Motorbike Trips from Hanoi | full | /articles/vietnam-motorbike-backpacker-trail/, /topics/vietnam-travel/ | Route-planning head term; the trips pillar owns it, the backpacker-trail guide and the Vietnam travel pillar support it. Consolidates a split family. |
| Motorbike route Vietnam _(variant of Motorbike routes Vietnam)_ | informational | /topics/trips/ | Motorbike Trips from Hanoi | full |  |  |
| Motorbike holidays Vietnam _(variant of Motorbike Vietnam)_ | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | partial |  |  |
| Hanoi to Ho Chi Minh by motorbike | informational | /articles/hanoi-to-ho-chi-minh-city-by-motorbike/ | Hanoi to Ho Chi Minh City by Motorbike: The North-to-South Ride | full | /topics/vietnam-travel/, /articles/one-way-motorbike-rental-vietnam/ | North-south route head term (keyword-universe.json); the route guide owns it, the Vietnam travel pillar and the one-way rental guide support it. |
| Saigon to Hanoi motorbike _(variant of Hanoi to Ho Chi Minh by motorbike)_ | informational | /articles/hanoi-to-ho-chi-minh-city-by-motorbike/ | Hanoi to Ho Chi Minh City by Motorbike: The North-to-South Ride | partial |  |  |
| Motorbike from Hanoi to Ho Chi Minh _(variant of Hanoi to Ho Chi Minh by motorbike)_ | informational | /articles/hanoi-to-ho-chi-minh-city-by-motorbike/ | Hanoi to Ho Chi Minh City by Motorbike: The North-to-South Ride | full |  |  |
| One way motorbike rental Vietnam | commercial | /articles/one-way-motorbike-rental-vietnam/ | One-Way Motorbike Rental in Vietnam: How North to South Works | full | /topics/vietnam-travel/ | One-way (city-to-city) rental intent; the business rents in Hanoi only, so the guide explains the option without claiming the service (OWNER-FACTS). |
| One way scooter rental Vietnam _(variant of One way motorbike rental Vietnam)_ | commercial | /articles/one-way-motorbike-rental-vietnam/ | One-Way Motorbike Rental in Vietnam: How North to South Works | partial |  |  |
| Vietnam scooter rental one way _(variant of One way motorbike rental Vietnam)_ | commercial | /articles/one-way-motorbike-rental-vietnam/ | One-Way Motorbike Rental in Vietnam: How North to South Works | partial |  |  |

### Zero-data refinements (2026-10-15)

| Keyword | Intent | Owner URL | Owner title | Coverage | Supporting URLs | Note |
|---|---|---|---|---|---|---|
| Electric motorbike Vietnam | informational | /topics/electric/ | Electric Motorbikes and E-Bikes | full | /articles/vietnam-electric-two-wheeler-market-overview/, /articles/cheapest-electric-motorbikes-vietnam-list-prices/ | Zero-data keyword universe (docs/seo/keyword-universe.json, third-party estimate); the electric pillar answers the head term, previously resolved by title to a single insurance article. |
| Honda electric bike Vietnam _(variant of Electric motorbike Vietnam)_ | informational | /articles/vietnam-electric-two-wheeler-market-overview/ | Vietnam Electric Two-Wheeler Market: A Verified Overview | partial |  | The market overview names the Honda (ICON e:, CUV e:, UC3) and Yamaha (NEO's) electric models from the manufacturers' official Vietnamese pages (re-checked 2026-10-15); no specifications are claimed until verified rows exist in docs/MODEL-DATABASE.md. |
| 50cc motorbike Vietnam | informational | /topics/50cc/ | 50cc Motorbikes | full |  | Zero-data keyword universe (docs/seo/keyword-universe.json, third-party estimate); the 50cc pillar, not the single licence article. |
| Buying a motorbike in Vietnam | informational | /articles/buying-motorbike-as-tourist-vietnam/ | Buying a Motorbike in Vietnam as a Tourist: The Honest Guide | full | /articles/buying-first-scooter-vietnam-guide/, /articles/renting-vs-buying-a-motorbike-hanoi/ | Zero-data keyword universe (docs/seo/keyword-universe.json, third-party estimate); English-language searchers are mostly travellers, so the tourist buying guide owns the head term and the first-scooter guide supports it for residents. Previously resolved by title to a parts-buying article. |
| Motorbike Vietnam price _(variant of New scooter prices Vietnam)_ | informational | /articles/new-scooter-prices-vietnam-verified/ | What a New Scooter Costs in Vietnam: Verified 2026 List Prices | partial |  | Verified manufacturer list prices; rental prices are served by /articles/motorbike-rental-price-hanoi/. |
| Vietnam motorbike traffic _(variant of How Vietnamese traffic works)_ | informational | /articles/vietnam-traffic-culture-riding-overview/ | How Vietnamese Traffic Actually Works: A Riding Culture Primer | partial | /topics/safety/ | The traffic-culture primer, previously resolved by title to the traffic-light rules article. |
| Vietnam bike _(variant of Motorbike Vietnam)_ | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | partial |  | "bike" is the riders' shorthand; previously resolved by title to a Dat Bike line-up guide. |
| Travel Vietnam motorbike _(variant of Motorbike Vietnam)_ | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | full |  |  |
| Motorbike around Vietnam _(variant of Motorbike Vietnam)_ | informational | /topics/vietnam-travel/ | Vietnam Travel by Motorbike | partial |  |  |
| Motorbike across Vietnam _(variant of Hanoi to Ho Chi Minh by motorbike)_ | informational | /articles/hanoi-to-ho-chi-minh-city-by-motorbike/ | Hanoi to Ho Chi Minh City by Motorbike: The North-to-South Ride | partial |  | Riding the length of the country; previously resolved by title to a left-turn technique article. |
| Motorbike licence Vietnam | informational | /topics/law-licences/ | Vietnam Motorbike Laws and Licences | full |  | Zero-data keyword universe (docs/seo/keyword-universe.json, third-party estimate); the law and licences pillar. |
| Vietnam bike licence _(variant of Motorbike licence Vietnam)_ | informational | /topics/law-licences/ | Vietnam Motorbike Laws and Licences | partial |  |  |
| Temporary Vietnamese motorbike licence _(variant of Motorbike licence Vietnam)_ **GAP** | informational | /topics/law-licences/ | Vietnam Motorbike Laws and Licences | partial |  | No temporary-licence route is described on the site; the pillar's licence options (IDP, exchange for residents) are the nearest honest answer. Any new sentence needs verification against current law first. |
| Hanoi motorbike rental cost _(variant of Hanoi motorbike rental prices)_ | commercial | /articles/motorbike-rental-price-hanoi/ | How Much Does It Cost to Rent a Motorbike in Hanoi? | full |  |  |
| Scooter rental Vietnam price _(variant of Hanoi motorbike rental prices)_ | commercial | /articles/motorbike-rental-price-hanoi/ | How Much Does It Cost to Rent a Motorbike in Hanoi? | partial |  | The only verified rental prices on the site are the Hanoi rates in docs/OWNER-FACTS.md. |
| Honda CT125 Vietnam _(variant of Honda CT125 review)_ | commercial | /articles/honda-ct125-review/ | Honda CT125 Review: The Cub That Wants to Go Exploring | full |  | Model head term; the review is the model page (previously resolved to a comparison). |
| Yamaha motorbike Vietnam _(variant of Honda motorbike Vietnam)_ | informational | /topics/motorcycles/ | Motorcycles in Vietnam | full | /articles/yamaha-scooter-lineup-vietnam-explained/ | Brand head term served like the Honda one: the motorcycles pillar, with the Yamaha line-up guide in support. |
| Motorbike rental Hanoi to Ho Chi Minh _(variant of One way motorbike rental Vietnam)_ | commercial | /articles/one-way-motorbike-rental-vietnam/ | One-Way Motorbike Rental in Vietnam: How North to South Works | full | /articles/hanoi-to-ho-chi-minh-city-by-motorbike/ | Renting for the north-south ride is the one-way rental question; the route guide keeps the journey keywords (Hanoi to Ho Chi Minh by motorbike). |
| Suzuki motorbike Vietnam _(variant of Honda motorbike Vietnam)_ **GAP** | informational | /topics/motorcycles/ | Motorcycles in Vietnam | partial |  | No Suzuki model data on the site: the Suzuki Vietnam manufacturer pages were not retrievable when the model database was built (docs/matrix/batch-13-status.md). The motorcycles pillar is the nearest honest page; Suzuki facts may be added only from verified manufacturer rows. |

## Topic cluster map (14 clusters, 981 articles)

| # | Cluster | Hub (pillar) | Articles | Commercial | Informational | Avg words | Subclusters |
|---|---|---|---|---|---|---|---|
| 1 | rental | /topics/rental/ | 81 | 34 | 47 | 410 | 5 |
| 2 | monthly-rental | /topics/monthly-rental/ | 45 | 12 | 33 | 356 | 5 |
| 3 | scooters | /topics/scooters/ | 110 | 51 | 59 | 371 | 4 |
| 4 | motorcycles | /topics/motorcycles/ | 108 | 65 | 43 | 333 | 4 |
| 5 | manual-clutch | /topics/manual-clutch/ | 55 | 9 | 46 | 385 | 4 |
| 6 | 50cc | /topics/50cc/ | 40 | 0 | 40 | 398 | 6 |
| 7 | electric | /topics/electric/ | 89 | 5 | 84 | 342 | 9 |
| 8 | maintenance | /topics/maintenance/ | 120 | 0 | 120 | 438 | 3 |
| 9 | parts-gear | /topics/parts-gear/ | 90 | 0 | 90 | 374 | 5 |
| 10 | safety | /topics/safety/ | 55 | 0 | 55 | 331 | 3 |
| 11 | law-licences | /topics/law-licences/ | 66 | 0 | 66 | 393 | 4 |
| 12 | hanoi | /topics/hanoi/ | 54 | 0 | 54 | 492 | 3 |
| 13 | trips | /topics/trips/ | 38 | 0 | 38 | 452 | 3 |
| 14 | vietnam-travel | /topics/vietnam-travel/ | 30 | 0 | 30 | 571 | 4 |

### Subclusters

**rental**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 1.1 how-to-rent | 20 | /articles/can-foreigners-rent-a-motorbike-hanoi/, /articles/can-tourists-rent-a-motorbike-hanoi/, /articles/common-motorbike-rental-problems-hanoi/ |
| 1.2 choosing-bike | 15 | /articles/automatic-vs-manual-motorbike-hanoi/, /articles/best-bike-for-english-teachers-hanoi/, /articles/best-bike-for-hanoi-old-quarter/ |
| 1.3 rental-practicalities | 20 | /articles/do-you-need-insurance-to-ride-vietnam/, /articles/early-return-rental-motorbike-hanoi/, /articles/high-mileage-rental-motorbike-inspection/ |
| 1.4 renter-situations | 15 | /articles/motorbike-rental-digital-nomads-hanoi/, /articles/motorbike-rental-english-teachers-hanoi/, /articles/motorbike-rental-expats-moving-hanoi/ |
| 1.5 area-guides | 11 | /articles/motorbike-delivery-long-bien/, /articles/motorbike-delivery-old-quarter/, /articles/renting-motorbike-ba-dinh/ |

**monthly-rental**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 2.1 monthly-basics | 8 | /articles/long-term-renting-vs-buying-residents-hanoi/, /articles/monthly-motorbike-rental-hanoi/, /articles/monthly-motorbike-rental-requirements-hanoi/ |
| 2.2 long-term-planning | 10 | /articles/early-return-monthly-rental-hanoi/, /articles/extending-motorbike-rental-hanoi/, /articles/late-return-monthly-rental-hanoi/ |
| 2.3 long-term-operations | 10 | /articles/breakdowns-during-long-term-rental-hanoi/, /articles/consumables-monthly-rental-hanoi/, /articles/e-bike-monthly-rental-hanoi/ |
| 2.4 renter-lifestyles | 12 | /articles/commuting-by-motorbike-monthly-hanoi/, /articles/delivery-pickup-monthly-rental-hanoi/, /articles/english-teachers-monthly-motorbike-hanoi/ |
| 2.5 choosing-long-term | 5 | /articles/automatic-or-semi-automatic-monthly-hanoi/, /articles/choosing-motorbike-monthly-rental-hanoi/, /articles/licence-expiry-during-long-rental-hanoi/ |

**scooters**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 3.1 model-reviews | 16 | /articles/honda-air-blade-125-review/, /articles/honda-air-blade-160-review/, /articles/honda-lead-125-review/ |
| 3.2 model-comparisons | 38 | /articles/honda-air-blade-125-vs-honda-vario-125/, /articles/honda-air-blade-160-vs-honda-lead-125/, /articles/honda-lead-125-vs-honda-vario-160/ |
| 3.3 choosing-guides | 23 | /articles/110cc-vs-125cc-scooters/, /articles/best-125cc-scooters-vietnam-verified/, /articles/best-155-160cc-scooters-vietnam/ |
| 3.4 specs-explained | 33 | /articles/16-inch-wheel-scooters-vietnam/, /articles/esp-vs-blue-core-engines-explained/, /articles/euro-4-scooters-vietnam/ |

**motorcycles**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 4.1 model-reviews | 10 | /articles/honda-blade-110-review/, /articles/honda-cbr150r-review/, /articles/honda-ct125-review/ |
| 4.2 model-comparisons | 43 | /articles/honda-blade-vs-honda-cbr150r/, /articles/honda-blade-vs-honda-ct125/, /articles/honda-blade-vs-honda-future-125/ |
| 4.3 choosing-guides | 19 | /articles/best-110cc-underbones-vietnam-verified/, /articles/best-125cc-underbones-vietnam-verified/, /articles/best-150cc-manual-motorbikes-vietnam-verified/ |
| 4.4 specs-explained | 36 | /articles/125cc-vs-110cc-underbones/, /articles/abs-on-underbones-vietnam-explained/, /articles/alloy-vs-spoked-wheels-motorbikes/ |

**manual-clutch**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 5.1 learning-manual | 16 | /articles/clutch-control-friction-zone-practice/, /articles/clutch-technique-stop-and-go-traffic/, /articles/coasting-neutral-dangers-manual-motorbike/ |
| 5.2 semi-auto-technique | 16 | /articles/clutch-lever-adjustment-underbones/, /articles/cold-start-underbone-choke-warmup/, /articles/fuel-efficient-riding-habits-underbone/ |
| 5.3 manual-model-guides | 16 | /articles/cbr150r-city-riding-guide/, /articles/honda-blade-drum-vs-disc/, /articles/honda-ct125-touring-setup-guide/ |
| 5.4 renting-owning | 7 | /articles/buying-new-underbone-dealer-guide-vietnam/, /articles/buying-used-sport-underbone-verified/, /articles/learning-manual-on-rented-bike-hanoi/ |

**50cc**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 6.1 understanding-50cc | 8 | /articles/50cc-mopeds-vs-50cc-underbones/, /articles/50cc-vs-110cc-motorbike-vietnam/, /articles/50cc-vs-e-bike-vietnam/ |
| 6.2 legal-rules | 7 | /articles/50cc-fines-vietnam/, /articles/50cc-motorbike-myths-law-vietnam/, /articles/50cc-training-high-school-vietnam/ |
| 6.3 riding-50cc | 8 | /articles/50cc-day-trip-range-limits/, /articles/50cc-hills-bridges-hanoi/, /articles/50cc-in-the-rain-vietnam/ |
| 6.4 buying-owning | 9 | /articles/50cc-parking-hanoi/, /articles/50cc-resale-value-vietnam/, /articles/50cc-running-costs-vietnam/ |
| 6.5 maintenance | 5 | /articles/50cc-brakes-drum-checks/, /articles/50cc-common-problems-first-year/, /articles/50cc-tyres-small-wheels-care/ |
| 6.6 gear-safety | 3 | /articles/50cc-pre-ride-checklist/, /articles/safety-gear-teen-50cc-riders/, /articles/teaching-teens-50cc-safe-riding/ |

**electric**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 7.1 understanding-electric | 10 | /articles/electric-moped-vs-electric-motorcycle-vietnam/, /articles/electric-motorbike-battery-capacity-explained/, /articles/electric-motorbike-battery-chemistry-vietnam/ |
| 7.2 legal-electric | 10 | /articles/can-foreigners-rent-electric-bike-vietnam/, /articles/can-you-ride-electric-motorbike-with-car-licence-vietnam/, /articles/do-electric-motorbikes-need-insurance-vietnam/ |
| 7.3 riding-charging | 14 | /articles/battery-swap-vs-home-charging-vietnam/, /articles/charging-electric-motorbike-apartment-rental/, /articles/charging-electric-motorbike-at-home-vietnam/ |
| 7.4 buying-owning | 14 | /articles/best-electric-moped-students-vietnam/, /articles/buying-first-electric-motorbike-vietnam/, /articles/buying-used-electric-motorbike-vietnam/ |
| 7.5 battery-maintenance | 11 | /articles/electric-motorbike-battery-health-check/, /articles/electric-motorbike-battery-lifespan-vietnam/, /articles/electric-motorbike-battery-replacement-vietnam/ |
| 7.6 model-reviews | 11 | /articles/dat-bike-lineup-vietnam-guide/, /articles/dat-bike-weaver-200-review/, /articles/dat-bike-weaver-plus-plus-review/ |
| 7.7 comparisons | 6 | /articles/dat-bike-weaver-200-vs-weaver-plus-plus/, /articles/electric-motorbike-day-trips-range-planning-hanoi/, /articles/vinfast-amio-vs-evo-lite/ |
| 7.7 comparisons-ecosystem | 8 | /articles/dat-bike-weaver-200-vs-vinfast-feliz-2/, /articles/dat-bike-weaver-vs-weaver-200/, /articles/electric-motorbike-delivery-riders-vietnam/ |
| 7.8 gear-safety | 5 | /articles/charging-safety-home-electric-bike/, /articles/e-bikes-with-kids-vietnam/, /articles/electric-motorbike-breakdown-what-to-do/ |

**maintenance**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 8.1 maintenance-basics | 38 | /articles/air-cooled-vs-liquid-cooled-motorbike/, /articles/air-filter-care-motorbike-vietnam/, /articles/battery-care-motorbike-vietnam/ |
| 8.2 common-issues | 53 | /articles/battery-draining-overnight-motorbike/, /articles/brake-light-indicator-repair-motorbike/, /articles/brake-pads-replacement-motorbike-vietnam/ |
| 8.3 ownership-practicalities | 29 | /articles/buying-motorbike-parts-online-vietnam/, /articles/changing-engine-oil-at-home-vietnam/, /articles/checking-motorbike-after-fall-accident/ |

**parts-gear**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 9.1 helmets | 13 | /articles/full-face-vs-open-face-helmet-vietnam/, /articles/helmet-care-replacing-guide-vietnam/, /articles/helmet-fasteners-retention-systems/ |
| 9.2 riding-gear | 15 | /articles/armoured-hoodies-casual-riding-wear/, /articles/base-layers-hot-humid-riding/, /articles/body-armour-motorbike-riders/ |
| 9.3 accessories-luggage | 21 | /articles/backpack-vs-saddlebags-motorbike/, /articles/camping-gear-motorbike-trips/, /articles/cargo-nets-bungee-cords-motorbike/ |
| 9.4 security | 7 | /articles/disc-locks-chains-motorbike-security/, /articles/gps-trackers-motorbikes-vietnam/, /articles/home-parking-overnight-security/ |
| 9.5 parts-accessories | 34 | /articles/adjustable-levers-motorbikes/, /articles/aftermarket-exhausts-motorbikes-vietnam/, /articles/aftermarket-horns-motorbikes/ |

**safety**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 10.1 riding-skills | 18 | /articles/balancing-pillion-riding-motorbike-vietnam/, /articles/carrying-luggage-motorbike-safely-vietnam/, /articles/cornering-motorbike-vietnam/ |
| 10.2 road-conditions | 19 | /articles/after-rain-slippery-roads-motorbike/, /articles/dust-dry-season-riding-vietnam/, /articles/flooded-streets-riding-motorbike-vietnam/ |
| 10.3 rider-protection | 18 | /articles/dashcams-motorbike-riding-vietnam/, /articles/eye-protection-riding-motorbike-vietnam/, /articles/first-aid-kit-motorbike-riders-vietnam/ |

**law-licences**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 11.1 licence-system | 20 | /articles/50cc-licence-vietnam/, /articles/a1-licence-cost-vietnam/, /articles/a1-licence-vietnam-what-you-can-ride/ |
| 11.2 foreigners | 11 | /articles/1968-vienna-convention-idp-vietnam/, /articles/can-tourists-ride-motorbike-vietnam/, /articles/expat-motorbike-licence-vietnam/ |
| 11.3 traffic-rules | 18 | /articles/child-passengers-motorbike-vietnam/, /articles/documents-to-carry-motorbike-vietnam/, /articles/drink-driving-limits-motorbike-vietnam/ |
| 11.4 fines-penalties | 17 | /articles/compulsory-motorbike-insurance-vietnam/, /articles/expired-licence-fine-vietnam/, /articles/fake-licence-penalties-vietnam/ |

**hanoi**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 12.1 districts-neighbourhoods | 19 | /articles/ba-dinh-area-guide-riders/, /articles/bac-tu-liem-area-guide-riders/, /articles/bat-trang-pottery-village-motorbike-ride/ |
| 12.2 city-routes-landmarks | 18 | /articles/hanoi-ceramic-mosaic-road-motorbike-route/, /articles/hanoi-lakes-motorbike-riding-guide/, /articles/hanoi-museums-motorbike-visit-guide/ |
| 12.3 city-practical-knowledge | 17 | /articles/apartment-living-motorbike-hanoi/, /articles/getting-around-hanoi-without-vietnamese/, /articles/hanoi-guided-motorbike-tours-vs-self-riding/ |

**trips**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 13.1 day-trips | 15 | /articles/ba-vi-national-park-day-trip-motorbike/, /articles/bac-ninh-craft-loop-motorbike-ride/, /articles/co-loa-citadel-motorbike-ride/ |
| 13.2 multi-day-trips | 15 | /articles/ba-be-lake-motorbike-trip-hanoi/, /articles/cao-bang-ban-gioc-motorbike-trip/, /articles/cat-ba-ha-long-motorbike-trip-ferry/ |
| 13.3 trip-planning | 8 | /articles/fuel-atm-phone-coverage-rural-rides-vietnam/, /articles/how-far-motorbike-day-trip-hanoi/, /articles/motorbike-ferry-train-transport-vietnam/ |

**vietnam-travel**

| Subcluster | Articles | Example URLs |
|---|---|---|
| 14.1 transport-comparisons | 4 | /articles/motorbike-vs-domestic-flights-vietnam/, /articles/motorbike-vs-sleeper-bus-vietnam/, /articles/motorbike-vs-train-vietnam-long-distance/ |
| 14.2 renting-around-vietnam | 6 | /articles/renting-motorbike-da-lat/, /articles/renting-motorbike-da-nang/, /articles/renting-motorbike-ho-chi-minh-city/ |
| 14.3 borders-and-ownership | 5 | /articles/buying-motorbike-as-tourist-vietnam/, /articles/motorbike-bluecard-ownership-papers-vietnam/, /articles/motorbike-border-crossing-vietnam-cambodia/ |
| 14.4 nationwide-travel-planning | 15 | /articles/hai-van-pass-motorbike-guide/, /articles/hanoi-to-ho-chi-minh-city-by-motorbike/, /articles/highway-1-vietnam-motorbike-riding/ |

## Cannibalization watchlist

| URL | Signal | Recommended differentiation |
|---|---|---|

## Gaps (no dedicated URL; served by nearest existing URL — no new articles)

| Keyword | Served by | Why |
|---|---|---|
| Honda Cub rental Hanoi | /articles/riding-honda-super-cub-c125-vietnam/ | No Cub appears in the approved price list, so no rental page is created or implied; the riding guide serves the query and availability is contact-only. |
| VinFast electric scooter rental Hanoi | /articles/can-foreigners-rent-electric-bike-vietnam/ | No VinFast rental model is in the approved fleet list; availability is contact-only. Supporting lineup guide: /articles/vinfast-electric-scooter-lineup-vietnam/. |
| Temporary Vietnamese motorbike licence | /topics/law-licences/ | No temporary-licence route is described on the site; the pillar's licence options (IDP, exchange for residents) are the nearest honest answer. Any new sentence needs verification against current law first. |
| Suzuki motorbike Vietnam | /topics/motorcycles/ | No Suzuki model data on the site: the Suzuki Vietnam manufacturer pages were not retrievable when the model database was built (docs/matrix/batch-13-status.md). The motorcycles pillar is the nearest honest page; Suzuki facts may be added only from verified manufacturer rows. |
