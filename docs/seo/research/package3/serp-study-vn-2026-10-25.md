# SERP study, Vietnam, English, 2026-10-25 (Package 3 research) - MEASURED with OpenSEO

**Status: the live SERP step succeeded on the second tool.** OpenRush `inspect_serp` returned HTTP 402 "Insufficient credits" (no data), so the first version of this study was HISTORICAL only. OpenSEO then measured all 18 queries today. MEASURED rows come from that read; anything dated 2026-10-14/15 is HISTORICAL and says so. Nothing was written to the ingest inbox.

## Header

- Tool, market, language, device: OpenSEO `get_serp_results` (volume and KD: `get_keyword_metrics`); Google, Vietnam (location code 2704), English, desktop, depth 30, national (no city). Position = `organicRank` (organic results only); `rank` counts every SERP element.
- Date: 2026-10-25. Calls: `get_serp_results` x3, the brief's limit: part 1 (9 queries, all returned), part 2 (9 queries; 3 failed upstream with "Internal SE Server Error"), one retry of those 3 (all returned). 18 of 18 measured, 30 rows each.
- Credits: no OpenSEO or TinyFish response shows a charge, so none is recorded (the brief's estimate, about 135, is not a charge). OpenRush: none charged.
- Saved in `docs/seo/research/package3/`: verbatim `openseo-serp-vn-2026-10-25-part1.json`, `-part2.json`, `-part2-retry.json` (and `openseo-keyword-metrics-vn-2026-10-25.json`); derived `openseo-serp-vn-2026-10-25-top10.md`.
- Legend. HIST-TRACKER = Ubersuggest `project_position_info`, Vietnam, desktop, 2026-10-14 (URLs stored without host; "/" rows UNKNOWN). HIST-SERP = OpenRush `inspect_serp` snapshots in `docs/seo/keyword-evidence.json` (fetched 2026-10-14/15, VN or US as stated, no device field). OpenSEO rows carry no PAA text, related searches or ratings, so those stay HIST-SERP. Positions are not clicks.
- Other hosts: rentbikehanoi.com, app.rentbikehanoi.com and global.rentbikehanoi.com rank on 6 queries. They are never counted as en.rentbikehanoi.com (AGENTS.md); their link to this site is UNKNOWN (not in OWNER-FACTS). thuexemaynguyentu.com is in no top 30. An earlier OpenSEO top-100 read (2026-10-25) had it outside the top 100 for rows 1, 2 and 4; today agrees.
- Volume and KD: MEASURED (OpenSEO, Vietnam, 2026-10-25). The three head variants returned identical rows (2,400, KD 7), probably Google Ads close-variant grouping (INFERRED): do not add them. HIST-TRACKER's 1,900 / 1,900 / 2,400 and KD 25 / 28 / 24 use another scale.

## Table 1 - all 18 queries

| # | Query | OpenSEO 2026-10-25 desktop VN en, depth 30: position + URL (MEASURED) | 2026-10-14 HIST-TRACKER | Declared owner | Owner match today | OpenSEO volume / KD |
|---|---|---|---|---|---|---|
| 1 | motorbike rental hanoi | not in top 30 | not ranking | `/` | no | 2,400 / 7 (transactional) |
| 2 | hanoi motorbike rental | not in top 30 | not ranking | `/` | no | 2,400 / 7 (commercial) |
| 3 | rent motorbike hanoi | not in top 30 | not ranking | `/` | no | 2,400 / 7 (transactional) |
| 4 | scooter rental hanoi | not in top 30 | #63 `/`, host UNKNOWN | none; nearest `/articles/best-scooters-to-rent-hanoi/` | n/a | 210 / not returned (commercial) |
| 5 | motorbike hire hanoi | not in top 30 | not ranking (unstable) | `/` | no | 20 / not returned (transactional) |
| 6 | monthly motorbike rental hanoi | #16 `/articles/extending-motorbike-rental-hanoi/` | #3 `/articles/daily-weekly-monthly-motorbike-rental-hanoi/` | `/articles/monthly-motorbike-rental-hanoi/` | MISMATCH | not returned |
| 7 | long term motorbike rental hanoi | not in top 30 | not tracked | `/topics/monthly-rental/` | no | not returned |
| 8 | motorbike rental hanoi price | not in top 30 | #66 `/articles/motorbike-rental-budget-monthly-hanoi/` | none; nearest `/articles/motorbike-rental-price-hanoi/` | n/a | 10 / not returned (transactional) |
| 9 | motorbike rental hanoi old quarter | not in top 30 | #4 `/articles/renting-motorbike-old-quarter/` | same URL | no | 30 / not returned (transactional) |
| 10 | honda vision rental hanoi | not in top 30 | not ranking | `/articles/honda-vision-110-review/` | no | not returned |
| 11 | 50cc motorbike rental hanoi | not in top 30 | not tracked | `/articles/renting-50cc-hanoi/` | no | not returned |
| 12 | motorbike rental deposit hanoi | #10 `/articles/can-foreigners-rent-a-motorbike-hanoi/` | #8 `/articles/do-rentals-keep-your-passport-hanoi/` | `/articles/motorbike-rental-deposit-hanoi/` | MISMATCH | not returned |
| 13 | motorbike rental noi bai airport | not in top 30 | #9 `/articles/riding-motorbike-noi-bai-airport-hanoi/` | `/articles/renting-motorbike-noi-bai-arrival/` | no | not returned |
| 14 | hanoi motorbike rental for expats | #10 `/articles/best-motorbike-for-expats-hanoi/` | #14 same URL | `/articles/motorbike-rental-expats-moving-hanoi/` | MISMATCH | not returned |
| 15 | how much to rent a motorbike in hanoi | not in top 30 | #10 `/articles/motorbike-rental-tourists-hanoi-essentials/` | `/articles/motorbike-rental-price-hanoi/` | no | not returned |
| 16 | 50cc motorbike vietnam licence | #15 `/topics/50cc/` | #11 `/articles/what-is-a-50cc-motorbike-vietnam/` | `/articles/50cc-licence-vietnam/` | MISMATCH | not returned |
| 17 | renting a motorbike in hanoi as a tourist | not in top 30 | #12 `/articles/can-tourists-rent-a-motorbike-hanoi/` | same URL | no | not returned |
| 18 | a1 licence vietnam | #15 `/topics/law-licences/` | #17 `/articles/vietnam-motorbike-licence-classes-explained/` | `/articles/a1-licence-vietnam-what-you-can-ride/` | MISMATCH | not returned |

Result (MEASURED, HIST-TRACKER for comparison):

- en.rentbikehanoi.com is in the top 30 on 5 of 18 queries (rows 6, 12, 14, 16, 18), best organic #10 (rows 12, 14).
- 0 of the 16 declared owner URLs is in the top 30 (rows 4, 8 have no exact owner). Every ranking URL is another page of ours: 3 articles, 2 hubs.
- Of the 9 HIST-TRACKER positions inside the top 30 (rows 6, 9, 12-18): 1 same URL (row 14, #14 then, #10 now), 4 another URL of ours (6, 12, 16, 18), 4 absent (9, 13, 15, 17). #63 and #66 (rows 4, 8) lie below depth 30, so absence today is consistent.
- Word counts (MEASURED, repo `lib.contentWords`, HEAD 2183d68, 2026-10-25). Today's rankers are listed with their counts in the protection table. Declared owners: `/` 459; monthly article 539; price article 407; deposit 337; old quarter 560; expats 521; Honda Vision review 373; 50cc licence 416; A1 320; tourist 320; Noi Bai 2,174; 50cc rental 2,185; `/topics/monthly-rental/` 229.

## Measured SERP shape (MEASURED)

The top 10 organic hosts and paths, local-pack names and element ranks per query are in `openseo-serp-vn-2026-10-25-top10.md` (derived from the saved JSON). Summary: facebook.com is in the top 10 of all 18 queries, tripadvisor.com of 16, rentalmotorbikehanoi.com of 9, reddit.com of 8, phungmotorbike.com of 7. A local pack shows on 15 of 18 (above organic #1 on rows 1-5, 9, 13; absent on 15, 16, 18); an AI overview on 8 (rows 6, 7, 9, 12, 14, 15, 16, 18); video on 4; People also ask on 17 (not row 14); ads on row 7 only. The head variants do not share one SERP: top-10 host overlap is 8 of 10 between rows 1 and 5, but 2 to 4 for row 3 against rows 1, 2 and 5, and 3 between rows 1 and 2. The earlier INFERRED claim that "rent motorbike hanoi" shares the SERP of "motorbike rental hanoi" is not supported.

## Brand mentions: "Nguyen Tu" on other domains (MEASURED; who runs each listing is UNKNOWN)

OWNER-FACTS names the business "Hanoi Motorbike Rental Nguyen Tu" and lists only thuexemaynguyentu.com and the English hub, so these are not claimed as ours.

- Tripadvisor "Motorbike Rental Nguyen Tu" (id d9826317; .com, .co.uk, .fr): row 1 #13, row 6 #7, row 7 #8, row 13 #22, row 14 #21.
- motorbikenguyentu.wikidot.com: rows 1 #23, 2 #9, 4 #11, 6 #9, 17 #17. motonguyentu.base44.app: rows 6 #17, 9 #18.
- Facebook group post "Hanoi Motorbike Rental - Nguyen Tu": rows 2 #18, 3 #21, 7 #13; group page "... & Sales - Nguyen Tu": row 11 #4.
- Our own pages (rows 6, 14) carry the name, but both snippets show the site header (name, address, hours, phone), not the article lead (INFERRED effect on clicks).
- None in the top 30 of rows 5, 8, 10, 12, 15, 16, 18. HIST-SERP recorded the same listings: Tripadvisor #7 on row 1 VN (#13 today), wikidot #7 on row 1 US, Tripadvisor #5 on row 4 US, Facebook #8 and Tripadvisor .co.uk #9 on row 6 US.

## Clusters

Measured top 10s are compared with HIST-SERP only where they differ. HIST-SERP exists for rows 1 and 6 (Vietnam) and rows 4, 7 and 16 (United States; row 7 had another query string): not like for like. PAA and related searches are HIST-SERP verbatim; other recorded lists stay in `keyword-evidence.json`. Brand queries are data only.

### 1. Head rental (rows 1-5; owner `/`)

- Intent: shop-seeking, transactional/commercial. Pages: rental-shop homes, a Facebook shop page, Tripadvisor, a Vinwonders guide, a local pack on top; they answer who rents, where, which bikes, tours. The four head homes read (Tigit, Style, rentalmotorbikehanoi, hanoimotorbikerental) showed no per-model price in extracted text.
- Entities: Honda Wave, Vision, Air Blade, Lead, XR150; hotel delivery; one-way; Ha Giang loop.
- Measured vs historical (row 1): 7 of 9 HIST-SERP hosts remain. New: riderly.com #1 (an aggregator listing), reddit.com, rentalmotorbikevietnam.com. Gone: hanoimotorbikerental.com, azmotorbikes.com. Rows 2 and 3 add listicles (bmtraveladv.com, travelchinaguide.com).
- Gaps vs `/`: (a) local-pack ratings (HIST-SERP: 4.9 with 1,100 reviews, 4.8 with 2,100, 5 with 168; off-site, owner-only; OWNER-FACTS forbids review claims on the site); (b) `/` shows six day rates but no weekly or monthly figures, which two competitor listing pages do show.
- PAA (VN): "How much does it cost to rent a motorcycle in Hanoi per day?"; "Can tourists rent a motorbike in Vietnam?"; "Can a foreigner ride a motorbike in Vietnam?"; "Do I need a license to rent a scooter in Vietnam?".
- Competitiveness (INFERRED): low. Not in the top 30 on any head query; shops with hundreds to thousands of Google reviews hold the SERP. KD 7 (MEASURED) suggests on-page effort is not the barrier; local and entity proof is. Many ranking shops are touring operators: partial intent fit.

### 2. Monthly and long term (rows 6-7; owners monthly article, `/topics/monthly-rental/`)

- Intent: commercial, longer stay (expats, students). Pages: monthly category pages and product grids (Phung, Happy Zip, Rentabike), Facebook groups, Reddit, Tripadvisor, aggregator guides; they answer per-model monthly price, km cap, inclusions, deposit type.
- Entities: Honda Vision, Air Blade, Lead, Wave, PCX; Yamaha NVX, Freego; 1,000 km per month cap; maintenance; replacement bike; passport or cash deposit.
- Measured vs historical (row 6): the top 10 changed almost entirely. Out: phungmotorbike.com monthly page (#1 then), rentalmotorbikehanoi.com, izigo.vn, vinwonders, theextramile.co, tigit. In both: happyzipmotorbikes.com, hanoimotorbikerental.com, Facebook. New: hanoimidorihomes.com #1, two Tripadvisor listings, app.rentbikehanoi.com (other host) #5. Phung's monthly page is #2 on rows 7 and 8. AI overview is first on row 6 (as in HIST-SERP) and sixth on row 7 (none in the US snapshot).
- Gaps vs owner: the monthly article carries one VND figure (the deposit); monthly rates sit on the price and expats articles and the hub FAQ, while SERP pages show a price grid on the landing page. A mileage rule is not in OWNER-FACTS, so we cannot fill it.
- PAA (VN, row 6): "How much is a motorbike per month?"; "Can foreigners rent bikes in Vietnam?"; "How much does it cost to rent a bike in Hanoi?"; "Do I need a licence to rent a motorbike in Vietnam?".
- Competitiveness (INFERRED): lower than the earlier "moderate". The tracker's #3 is not in today's top 30; the one monthly signal is the extending article at #16 (396 words); `/topics/monthly-rental/` does not show for row 7. Tracker #3, OpenRush "not in 114 results" and OpenSEO #16 on another URL: three answers, all unsettled.

### 3. Price and deposit (rows 8, 12, 15; owners price article, deposit article)

- Intent: transactional/informational price check. Volume: 10 (price query), others not returned. Pages: bike catalogues with a price per model, FAQ blocks; entities: price per day, week, month; USD on three competitor pages; deposit as an amount or "passport or cash"; insurance not included.
- Gaps vs owner: SERP pages put price and deposit above or beside the bike list. Our price article (407 words) has a rate section and FAQ: the gap is depth, not topic.
- Measured: row 12 is our best row. `can-foreigners-rent-a-motorbike-hanoi` (1,875 words) is #10 with a snippet quoting "typically 2,000,000-5,000,000 VND", the OWNER-FACTS range; five more rentbikehanoi.com-family rows (other hosts) rank there. Third-party snippets quote other deposit ranges: data only, never copied. Rows 12 and 15 open with an AI overview; row 15 has no local pack; all three have PAA (HIST-SERP US: "How much is bike rental in Hanoi?").
- Trust: state only the OWNER-FACTS deposit range and rules, never that documents are kept. Competitiveness (INFERRED): the owners (407 and 337 words) do not show; a long guide (1,875) does, as historically did the passport guide and a tourist-essentials page.

### 4. Place: Old Quarter and Noi Bai (rows 9, 13)

- Old Quarter (MEASURED): AI overview at 4, local pack 1-3, an expat.com forum thread #7, shop homes and Tripadvisor listings. No page of ours in the top 30; other hosts app.rentbikehanoi.com (#23, an old-quarter planning page) and rentbikehanoi.com (#21, a blog page) rank. Volume 30.
- Noi Bai (MEASURED): no AI overview; local pack 1-3; the top 10 is five Tripadvisor domains, four Facebook pages and two shop or category pages: listing intent. No page of ours in the top 30.
- Competitiveness (INFERRED), revised: the earlier "good for Old Quarter" rested on the tracker's #4, which today's read does not reproduce: UNKNOWN until a deeper read (Blockers). Noi Bai stays unknown: the SERP is listing-led.

### 5. Model and class: Honda Vision, 50cc (rows 10-11)

- Vision (transactional, model-specific; MEASURED): model product pages (rentabikevn, Phung, rentalmotorbikehanoi, riderly, azmotorbikes), Facebook posts, a Tripadvisor product; local pack after the first eight organic results. A Mio-vs-Vision cost page on app.rentbikehanoi.com (other host) is #15. The owner is a 373-word review, not in the top 30: consistent with the INFERRED intent mismatch.
- 50cc (MEASURED): rentalmotorbikehanoi.com #1, four Facebook groups, hanoimotorbikerental services #3; video at 13; local pack 3-5; rentbikehanoi.com (other host) #19 and #20. One competitor offers 50cc by request only; another states 50cc bikes are legal without a licence (a legal claim we must not copy; the repo's legal guides decide). PAA "Can I rent a 50cc scooter in Vietnam?" is in two US snapshots (HIST-SERP).
- Gaps vs owner: spec-and-price card for the Vision (rate from OWNER-FACTS only; specs only from MODEL-DATABASE or the manufacturer).
- Competitiveness (INFERRED): Vision low (wrong page type); 50cc low to moderate (the 2,185-word owner is not in the top 30).

### 6. Audience: expats and tourists (rows 14, 17)

- Expats (MEASURED): `best-motorbike-for-expats-hanoi` (354 words) is #10, the tracker's URL, up four places; the owner (521 words) does not show. AI overview at 1, local pack 3-5, the only SERP of the 18 without PAA. #1 is rentabikevn's long-term package page; SERP pages stress maintenance, replacement bike, deposit return.
- Tourists (MEASURED): no page of ours in the top 30; the tracker's #12 is gone. PAA at 2, video at 4, Reddit #2, a Vinwonders guide #3, a tour operator in the local pack.
- Competitiveness (INFERRED): the expat sibling article holds ground; the tourist page lost its tracker rank.

### 7. Licence (rows 16, 18)

- Informational (MEASURED, VN): AI overview first, PAA, video, no local pack. Row 16: a licence page at vietnammotorbikerental.com #1, a Facebook post on 50cc scooters needing no licence, a Reddit thread, rentabikevn "why we refuse to rent 50cc", danangbike twice. Row 18: rentabikevn legal page #1, the Australian embassy page `vietnam.embassy.gov.au` #2 (a government source), saigonlicense, rentbikehanoi.com (other host) #8.
- HIST-SERP (US, row 16): tripadvisor.com, facebook.com, theextramile.co, reddit.com, duyanhmotorbikes.com, youtube.com, traveldudes.com, travel.stackexchange.com. The VN top 10 shares only facebook and reddit with it: the US snapshot is no proxy. PAA (US): "How to get a motorbike license in Vietnam?"; "What is the youngest age to drive a motorcycle?".
- Ours (MEASURED): `/topics/50cc/` (203 words) #15 on row 16 and `/topics/law-licences/` (232 words) #15 on row 18: hubs, neither the owner nor the tracker URL. The `/topics/50cc/` snippet states no licence requirement for sub-50cc bikes: a legal claim that needs a primary-source check (REVIEW_REQUIRED if unsourced).
- Competitiveness (INFERRED): hubs rank, not guides; an official source at #2 on A1 suggests primary sources suit that query (AGENTS.md: legal claims need them).

## Competitor landing pages read (TinyFish, 8 reads, earlier today)

Selection caveat: pages came from the HIST-SERP lists, before any measured SERP existed. Today's top 10 adds unread pages (riderly.com, bmtraveladv.com, travelchinaguide.com, vietnammotorbikerental.com, hanoimidorihomes.com, tuanmotorbike.com/hanoi): the next reads. Schema types: UNKNOWN.

| Page | Type | Above the fold | Prices / deposit / documents / delivery | Trust | CTA | FAQ |
|---|---|---|---|---|---|---|
| tigitmotorbikes.com | multi-city touring rental and tours | "Best price guaranteed" match offer | no price list; "Pre-auth Deposit, rental by card or cash"; office pickup, truck return in some cities | damage waiver, "clear contracts"; widget "No reviews available at the moment"; Hanoi address | "Contact Us" | none |
| stylemotorbikes.com | chain home, one-way and tours | "Vietnam's largest" claim | no price found; none | Google widget "Based on 404 reviews"; Hanoi shop in Old Quarter | bike cards; WhatsApp in reviews only | none |
| rentalmotorbikehanoi.com | tour-led home, no title tag | tours first | no price or deposit; hotel delivery; nationwide delivery, five-day minimum; helps with an IDP | none visible; local pack 5 (168) as recorded | contact | none |
| phungmotorbike.com/monthly-rentals-hanoi | monthly product grid | "1000 kilometers per month" | per-model amounts as digit strings (for example "₫1300000VND"; one reads "₫200000VND"); helmet, rack, phone holder included; 50cc "legal for the people have no license" | none visible | "Book Now" per bike | none |
| hanoimotorbikerental.com | operator home, manual and touring focus | founded "late 2006", Honda-only policy | no price; "Monthly servicing and maintenance are included"; 50cc "only upon request" | years claim | not visible | none |
| happyzipmotorbikes.com monthly | expat monthly category | "from 1 million per month" | passport or security amount as deposit, returned at contract end; free maintenance except flat tyres; breakdown rescue in Hanoi | none visible | "View" per bike | none |
| rentabikevn.com long-term | catalogue | hubs in Hanoi, Danang, HCMC; "Helmets, locks and essentials" | per day in USD per model (US$5 to US$15); no monthly figure in extract | none visible | "View Bike" | footer link only |
| rentalmotorbikevietnam.com | home with tours, bikes, FAQ | tours, then bikes "FROM $" | per bike: day, 1 month, 2 month, "DEPOSIT Passport or $1000"; keeps passports; no insurance; 25% reserve payment (sentence cut off) | Hanoi address and phones; local pack 4.9 (1,100) as recorded | email, Facebook, a messaging number (spelled "Whatup") | side of road, helmet, where to ride, passport, flat tyre, insurance, buy-back, riding lesson |

Patterns: price grids only on monthly and catalogue pages; head homes lead with tours and trust. Never copy: keeping passports, "free" maintenance or rescue, 50cc "no licence needed", reviews or years, any USD figure (no exchange rate was read).

## Rank protection notes

The Ubersuggest tracker (2026-10-14, desktop, Vietnam, host-less URLs), the OpenRush snapshots (2026-10-14/15, VN or US, no device field) and today's OpenSEO read (desktop, Vietnam, depth 30, national) may differ by tool, device and date. A position absent today is absent from the top 30, not necessarily from the top 100. None is ground truth or clicks. Owner match today: 0 of 16 (Table 1); the five rankers are other pages of ours. This table lists what to protect.

| Query | Page(s) that rank (MEASURED today, else HIST-TRACKER) | Do NOT change without evidence |
|---|---|---|
| monthly motorbike rental hanoi | MEASURED #16 extending-motorbike-rental-hanoi (396 words); HIST #3 daily-weekly-monthly page | extending page title, H1, lead; the daily-weekly-monthly page's title, H1 and "how the periods price out"; links feeding both |
| motorbike rental hanoi old quarter | HIST #4 old-quarter article (owner); absent today | title, H1, parking and timing sections. Largest tracker-vs-measured gap: re-read at depth 100 before any edit |
| motorbike rental deposit hanoi | MEASURED #10 can-foreigners-rent-a-motorbike-hanoi (1,875 words); HIST #8 passport guide | can-foreigners deposit and passport passages; passport guide's "Why a passport is the wrong collateral" and "The cash alternative"; do not merge it into the deposit article |
| motorbike rental noi bai airport | HIST #9 riding-to-airport guide (a riding topic); absent today | its title, "The route" and "Timing"; keep the arrival guide separate |
| how much to rent a motorbike in hanoi | HIST #10 tourists essentials; absent today | its "What it costs" section (figures stay as OWNER-FACTS) |
| 50cc motorbike vietnam licence | MEASURED #15 `/topics/50cc/` (203 words); HIST #11 what-is-a-50cc article | hub title and intro; the definition section; any legal edit needs a primary source |
| renting a motorbike in hanoi as a tourist | HIST #12 can-tourists article (owner); absent today | title, H1, licence section |
| hanoi motorbike rental for expats | MEASURED #10 and HIST #14 best-motorbike-for-expats (354 words) | its title, "The licence, sorted properly" and "The arrangement"; a Package 2 expansion must keep the ranking passage |
| a1 licence vietnam | MEASURED #15 `/topics/law-licences/` (232 words); HIST #17 licence-classes-explained | hub title and intro; the classes article's "motorcycle classes after 1 January 2025" section |
| motorbike rental hanoi price; scooter rental hanoi | HIST #66 budget-monthly page; #63 `/` (host UNKNOWN); both below depth 30 | nothing urgent; do not treat `/` as ours |

Rules: slug, permalink and canonical never change; do not re-point internal links, redirect, merge or noindex a non-owner ranker, or move an owner on one snapshot. Today's read adds four protected pages (extending, can-foreigners, `/topics/50cc/`, `/topics/law-licences/`); a URL absent today keeps its protection until a deeper read says otherwise. No owner in the top 30 on 16 of 16 rows is a reason to deepen the measurement and review intent fit, not to act on prose.

## Blockers and next evidence

1. The Ubersuggest tracker project no longer exists: the 25 HIST-TRACKER rows cannot be refreshed.
2. A depth-100 OpenSEO read for rows 6, 9, 13, 15, 17 (a tracker URL vanished or changed) would show whether those pages fell to 31-100: about 25 credits per query from the tool's pricing text (INFERRED, about 125 in total). Owner approval first.
3. A Search Console export is the only evidence that will count as clicks.
