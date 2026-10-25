# Price reconciliation — OWNER-FACTS vs the owner's reference table

Status: **REVIEW_REQUIRED (owner decision).** Recorded 2026-10-25 during SEO Package 2. Nothing in `docs/OWNER-FACTS.md` or on the site has been changed: only the site owner can say which source is current.

## Sources compared

1. `docs/OWNER-FACTS.md` — the site's business fact store (rental prices APPROVED 2026-09-22; E-Bike and Yamaha Sirius day rates APPROVED 2026-09-22). This is what the site publishes today.
2. The owner's reference data ("Dữ liệu chuẩn — Cho thuê xe máy Nguyễn Tú") supplied in the project owner's standing instructions on 2026-10-25: NAP, price table and deposit policy. The table states that rental prices are reference prices to be confirmed before booking.

Name, address (112 Nguyen Van Cu Street, Bo De, Long Bien, Hanoi), phone (+84 942 467 674), opening hours (09:00-21:00 daily), website, payment forms and the "never claim a universal no-deposit policy" rule are consistent in both sources.

## Price comparison (VND)

| Vehicle | Field | OWNER-FACTS | Owner reference table | Status |
|---|---|---|---|---|
| Honda Wave | day | 150,000 | 150,000 | CONSISTENT |
| Honda Wave | week | not published | 700,000 | ONLY IN REFERENCE |
| Honda Wave | month | not published | 900,000-1,200,000 | ONLY IN REFERENCE |
| Yamaha Sirius | day | 150,000 | not listed | ONLY IN OWNER-FACTS |
| Honda Vision | day | 200,000 | 200,000 | CONSISTENT |
| Honda Vision | week | 800,000-1,000,000 | 1,000,000 | OVERLAP (the reference value is inside the OWNER-FACTS range) |
| Honda Vision | month | 1,800,000-2,000,000 | 1,800,000-2,000,000 | CONSISTENT |
| Honda Air Blade | day | 200,000 | 200,000 | CONSISTENT |
| Honda Air Blade | week | 800,000 | 1,000,000 | **DIFFERENT** |
| Honda Air Blade | month | 1,400,000 | 1,500,000 | **DIFFERENT** |
| Honda Click / Yamaha Mio | day | 150,000 | 150,000 | CONSISTENT |
| Honda Click / Yamaha Mio | week | 600,000-700,000 | 700,000 | OVERLAP |
| Honda Click / Yamaha Mio | month | 1,000,000-1,200,000 | 900,000-1,200,000 | **DIFFERENT** (low end) |
| 50cc scooter | day | no fixed price, contact | 200,000 | **CONFLICT** |
| 50cc scooter | week / month | contact | quoted separately | CONSISTENT (no figure) |
| E-Bike / electric bike | day | 200,000 | contact | **CONFLICT** |
| E-Bike / electric bike | week / month | contact | contact | CONSISTENT (no figure) |

Deposit: OWNER-FACTS gives "typically 2,000,000-5,000,000 VND depending on vehicle and conditions"; the reference table gives per-model deposits within the same range (Wave 2-3 million, Vision 4-5 million, Air Blade 3 million, Click / Mio 2 million, 50cc scooter 4 million). The range is CONSISTENT; the per-model deposits exist only in the reference table and are not published. The reference text also mentions that some documentary guarantee options may be discussed separately: OWNER-FACTS forbids claiming that the business keeps a customer's passport or identity documents, so no such option is published.

## Rules until the owner decides

1. Publish only CONSISTENT figures and the OWNER-FACTS ranges that already contain the reference value (OVERLAP). Quote them exactly as OWNER-FACTS words them.
2. Never add a new figure for a DIFFERENT, ONLY IN REFERENCE or CONFLICT cell, and never publish a 50cc or E-Bike price in new text. Where an existing sentence already carries one, leave it as it is and treat it as part of this review.
3. Never derive one model's price from another's; never claim availability: "Contact us to confirm current availability".
4. `scripts/seo-package2.js --lint` lists every new sentence that gives a weekly, monthly, 50cc or e-bike price (and every VND amount that is not in OWNER-FACTS) as an item to confirm; SEO Package 2 batches do not add such statements.

## Where the differing figures are already published (not changed)

The OWNER-FACTS weekly and monthly figures appear on many surfaces: the homepage bike showcase (`index.html`), the FAQ data (`_data/faq.json`), the Guide Assistant business facts (`_data/assistant-business.yml`) and the rental, monthly-rental and price articles. Counting files that contain the string (a string can also be an unrelated figure): `800,000` in 53 files, `600,000` in 39, `1,400,000` in 27, `1,200,000` in 24, `1,000,000` in 42, `700,000` in 11, `900,000` in 7, `1,500,000` in 1. The E-Bike day rate of 200,000 VND is on the homepage showcase and in the FAQ data; the 50cc scooter has no published price.

## Decision needed from the owner

Which table is current for each DIFFERENT, ONLY IN REFERENCE and CONFLICT cell above, and whether the E-Bike day rate and a 50cc day rate may be published. When the owner confirms, one reviewed batch updates `docs/OWNER-FACTS.md` first, then `_data/assistant-business.yml`, `_data/faq.json`, `index.html` and the affected articles together, so that no page keeps an older figure.
