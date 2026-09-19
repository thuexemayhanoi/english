# CUSTOMER INTENTS — First-Party Intent Store (v2, populated)

Provenance labels (never mix them up):
- REAL OWNER-HISTORY INTENT — recurring themes actually handled by the business
- GSC-DERIVED INTENT — observed Search Console/SiteGuru queries (thuexemaynguyentu.com, 2026-08-18 → 2026-09-16)
- RESEARCH-DERIVED INTENT — from authoritative external research
- GENERATED EXPANSION — AI-expanded related intents; NOT literal customer quotes and NOT actual GSC queries

## 1. GSC-DERIVED INTENTS (observed, Vietnamese)

| Query | Clicks | Impr. | Avg pos |
|---|---|---|---|
| thuê xe máy phố cổ | 11 | 32 | 3.6 |
| thuê xe máy phố cổ hà nội | 4 | 15 | 11.5 |
| thue xe may ha noi | 0 | 3 | 33.0 |
| thuê xe máy hà nội | 0 | 4 | 44.3 |
| thuê xe máy hà nội phố cổ | 0 | 3 | 12.3 |

Historical SEO evidence also contains: "motorbike rental hanoi".

English intent families derived (translation of demand, NOT volume claims): Hanoi motorbike rental · rent a motorbike in Hanoi · Hanoi Old Quarter motorbike rental · motorbike rental near Hanoi Old Quarter · monthly motorbike rental Hanoi · scooter rental Hanoi · motorcycle rental Hanoi · motorbike rental for expats Hanoi.

RULE: never claim English search volume from Vietnamese query performance.

GSC LIMITATION (recorded): a full 6–12 month raw GSC CSV was NOT supplied. Do not fabricate one. The matrix is provisional and can be refined when a larger export arrives. This is not a blocker.

## 2. REAL OWNER-HISTORY INTENTS (54 themes)

Pricing: daily price · weekly price · monthly price · deposit amount · deposit return timing.
Documents/legal: required documents · foreigner eligibility · tourist legality · licence for motorcycle in Vietnam · licence for 50cc.
Bike choice: suitable bike for foreigners · for monthly use · for English teachers · 50cc availability · automatic scooter · manual/semi-automatic · electric motorcycles · e-bikes · electric range · electric charge time · electric vs petrol in Hanoi · scooter vs semi-automatic · two-up bike · bike for Hanoi traffic.
Logistics: delivery availability · delivery cost · delivery to Old Quarter / Long Bien / Tay Ho · shop location · opening hours · WhatsApp contact · Zalo contact.
Care & incidents: breakdown procedure · where to take bike for maintenance · outside repair shops · high-mileage inspection timing · puncture/inner-tube responsibility · loose chain · bike not feeling normal.
Returns & policy: late return · early return · refund of unused time · insurance inclusion · own insurance need.
Riding: Hanoi to nearby destinations · day-trip bike · long-distance bike · pre-ride checks · safe riding in Hanoi traffic · foreigner riding knowledge · documents to carry while riding · after-puncture actions.

Full list with per-theme provenance: docs/data/intents.csv (source_type=owner-history).

## 3. GENERATED EXPANSIONS

The 54 themes are expanded into related English search intents in the MASTER MATRIX (e.g. "deposit return" → deposit guide, deposit scam avoidance, deposit vs passport). Every generated row carries source basis `generated-expansion` — never presented as a customer quote or GSC query.

## 4. Matrix integration

Matrix rows are generated in priority order: GSC-derived families → real owner-history intents → research-derived fill → generated expansion to reach ~1,000 distinct intents. Each row records its source basis.
