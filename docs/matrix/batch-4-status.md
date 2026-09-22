# Batch 4 Status — Riding Skills & Safety (cluster 10) + Maintenance & Repair Part 1 (cluster 8)

Authoritative record for the 50-article safety + maintenance production batch (MM-0127–MM-0176). Batches 1 (law/licences, 66 articles), 2 (cluster 1 rental, 81) and 3 (cluster 2 monthly & long-term rental, 45) are COMPLETE — see docs/matrix/batch-1-status.md, docs/matrix/batch-2-status.md, docs/matrix/batch-3-status.md. This batch also fixed two pre-existing master-matrix.csv defects found during pre-production review: (1) the first cluster-11 law row had a corrupted ID cell ("... [Content truncated]MM-0082"), and (2) the cluster-11 law slice IDs MM-0082–MM-0147 collided with the cluster-2 monthly range MM-0082–MM-0126 and with this batch's MM-0127–MM-0176. The 66 law rows were renumbered to a unique LAW-0001–LAW-0066 prefix; no law article, slug, title or status changed, and batch-1-status.md (which records slugs, not matrix IDs) is unaffected.

## Batch 4 (2026-09-22): 30 safety + 20 maintenance articles

Published 2026-09-22 as one batch commit. All business facts come exclusively from docs/OWNER-FACTS.md — the sole approved business-fact authority. No prices, availability, fleet size, promotions, discounts, guarantees, insurance coverage, delivery promises, testimonials or repair costs were invented; wording uses "Contact us to confirm current availability." where relevant. Maintenance articles contain no torque values, oil capacities, tyre pressures, electrical values or manufacturer service intervals; where exact model-specific data matters, the articles direct readers to the owner's manual, manufacturer specification or a qualified mechanic. Safety articles separate practical riding advice from legal requirements, reuse only the verified cluster-11 legal baseline via links to the published VERIFIED legal articles, and introduce no new legal claims. Safety content does not imply that good technique eliminates risk. Each intent is distinct from the rental, monthly and law clusters; no doorway or filler pages were written.

Safety cluster counts: 30 published / 25 remaining planned. Maintenance cluster counts: 20 published / 100 remaining planned (Part 1 of the maintenance slice).

| Matrix row | Article title | Subcluster | Status |
|---|---|---|---|
| MM-0127 | Emergency Braking on a Motorbike in Vietnam | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0128 | Cornering a Motorbike Well in Vietnam | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0129 | Slow-Speed Control: Riding a Motorbike Through Dense Traffic | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0130 | Filtering Through Traffic Safely on a Motorbike | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0131 | Defensive Riding on a Motorbike in Vietnam | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0132 | Riding a Motorbike at Night in Vietnam | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0133 | Carrying a Passenger Safely on a Motorbike | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0134 | Carrying Luggage and Loads on a Motorbike | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0135 | Blind Spots: Riding Around Buses and Trucks in Vietnam | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0136 | Roundabouts and Junctions on a Motorbike in Vietnam | 10.1 riding-skills | PUBLISHED 2026-09-22 |
| MM-0137 | Riding a Motorbike in Heavy Rain in Vietnam | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0138 | Riding Through Flooded Streets on a Motorbike | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0139 | Riding a Motorbike in Strong Wind | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0140 | Hot Weather Riding on a Motorbike in Vietnam | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0141 | Winter Riding on a Motorbike in Hanoi | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0142 | Riding a Motorbike in Fog and Low Visibility | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0143 | Riding on Gravel and Loose Surfaces on a Motorbike | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0144 | Potholes and Bad Roads: Protecting Yourself and Your Motorbike | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0145 | Riding Mountain Passes on a Motorbike in Vietnam | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0146 | Rush Hour Riding in Hanoi: Staying Safe in Peak Traffic | 10.2 road-conditions | PUBLISHED 2026-09-22 |
| MM-0147 | How to Choose and Fit a Helmet in Vietnam | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0148 | What to Wear Riding a Motorbike in Vietnam | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0149 | Eye Protection While Riding a Motorbike | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0150 | A First Aid Kit for Motorbike Riders in Vietnam | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0151 | First Response at a Motorbike Accident in Vietnam | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0152 | Riding Fatigue on Long Motorbike Trips | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0153 | Being Seen: Visibility Tactics for Motorbike Riders | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0154 | Hand Signals for Motorbike Riders in Vietnam | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0155 | The Pre-Ride Safety Check | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0156 | New Rider Mistakes on Vietnamese Roads | 10.3 rider-protection | PUBLISHED 2026-09-22 |
| MM-0157 | Motorbike Maintenance Basics for Vietnam | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0158 | Checking Engine Oil on a Motorbike | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0159 | Chain Maintenance on a Motorbike in Vietnam | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0160 | Tyre Care and Pressure Basics for Motorbikes | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0161 | Checking Brakes on a Motorbike | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0162 | Battery Care on a Motorbike | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0163 | Lights and Electrical Checks on a Motorbike | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0164 | When to Service a Motorbike in Vietnam | 8.1 maintenance-basics | PUBLISHED 2026-09-22 |
| MM-0165 | Flat Tyre Repair on a Motorbike in Vietnam | 8.2 common-issues | PUBLISHED 2026-09-22 |
| MM-0166 | A Dead Battery: Recovering a Motorbike That Won't Start | 8.2 common-issues | PUBLISHED 2026-09-22 |
| MM-0167 | Brake Pads: Signs, Replacement and What to Expect | 8.2 common-issues | PUBLISHED 2026-09-22 |
| MM-0168 | Spark Plugs on a Motorbike: Basics for Vietnam | 8.2 common-issues | PUBLISHED 2026-09-22 |
| MM-0169 | Carburettor vs Fuel Injection on Vietnamese Motorbikes | 8.2 common-issues | PUBLISHED 2026-09-22 |
| MM-0170 | Preventing Rust on a Motorbike in Vietnam | 8.3 ownership-practicalities | PUBLISHED 2026-09-22 |
| MM-0171 | An Overheating Motorbike: Causes and What to Do | 8.2 common-issues | PUBLISHED 2026-09-22 |
| MM-0172 | Diagnosing Motorbike Noises: A Rider's Guide | 8.2 common-issues | PUBLISHED 2026-09-22 |
| MM-0173 | Washing and Cleaning a Motorbike Properly | 8.3 ownership-practicalities | PUBLISHED 2026-09-22 |
| MM-0174 | Storing a Motorbike for Weeks or Months in Vietnam | 8.3 ownership-practicalities | PUBLISHED 2026-09-22 |
| MM-0175 | Finding a Trustworthy Motorbike Mechanic in Vietnam | 8.3 ownership-practicalities | PUBLISHED 2026-09-22 |
| MM-0176 | Genuine Versus Fake Motorbike Parts in Vietnam | 8.3 ownership-practicalities | PUBLISHED 2026-09-22 |
