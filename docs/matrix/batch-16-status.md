# Batch 16 status - cluster 4 motorcycle reviews Part 3 (MM-0577-MM-0607)

Authoritative publish/review record for Batch 16. Date: 2026-09-24 (Asia/Ho_Chi_Minh).

## Batch summary

- 31 cluster-4 motorcycle articles published in part-commits (c05daab: 4 comparisons MM-0577-MM-0580; c1d28db: 4 comparisons MM-0581-MM-0584; aae7882: 6 comparisons MM-0585-MM-0590; a29bf8a: 4 choosing guides MM-0591-MM-0594; 1873c0e: 4 choosing guides MM-0595-MM-0598; 9cb2dd6: 5 spec explainers MM-0599-MM-0603; d801f66: 4 spec explainers MM-0604-MM-0607; 16d3604 and d89480d: internal-link slug repairs to verified targets; closing commit: inbound links added from 4 existing articles - honda-wave-alpha-110-review, yamaha-exciter-155-vva-review, best-110cc-underbones-vietnam-verified, honda-future-125-review - plus this batch's matrix rows). Cluster 4: all 106 intents published, COMPLETE.
- Composition: 14 model comparisons (MM-0577-MM-0590), 8 verified-data choosing guides (MM-0591-MM-0598), 9 spec explainers (MM-0599-MM-0607).
- Pre-batch retries (2026-09-24): Suzuki GD110 pages still return HTTP 403; SYM site still blocks automated access and the Excel is no longer in the current lineup. No Suzuki/SYM facts were written anywhere in this batch; all content is built from the verified Honda VN and Yamaha VN rows in MODEL-DATABASE (Batch 14 additions, retrieved 2026-09-23).
- Business facts exclusively from docs/OWNER-FACTS.md: Honda Wave and Yamaha Sirius are the price-published rental classes (150,000 VND/day); every other model article says "Contact us to confirm current availability"; no prices, availability, promotions or guarantees were invented.
- 673 articles site-wide after this batch; cluster 4: 106 of 106 intents published, COMPLETE.

## Verification record

- Verified 2026-09-24 (Asia/Ho_Chi_Minh): remote MAIN holds 675 article files in _articles/ (642 pre-batch + 31 planned batch-16 files + 2 supplementary overlap articles), counted on the remote listing. Live spot-checks: /articles/ renders the 675-guide total, /topics/motorcycles/ renders the 108-guide count; batch-16 pages checked live (why-110cc-is-vietnams-default-engine, honda-wave-alpha-vs-honda-cbr150r, honda-wave-alpha-vs-honda-super-cub) resolve; repaired articles (honda-wave-alpha-110-review, honda-future-125-review) verified live with the line-wrap corruption removed.
- Quality Gate: the gates on the batch-16 part-commits c05daab through 88e63ab failed at the internal-link audit step (internal_link_targets referencing the missing slug honda-wave-alpha-vs-super-cub in honda-blade-vs-honda-super-cub-c125.md and honda-super-cub-vs-yamaha-sirius.md, and a quote-mangled internal_link_targets line in best-110cc-underbones-vietnam-verified.md); several articles additionally carried mid-word line-wrap corruption. All repaired in commit 769a218 (2 target slugs corrected to honda-wave-alpha-vs-honda-super-cub, the quote-mangled line rebuilt with 16 verified targets, wrap corruption joined in 8 articles); gate on 769a218 verified success (all steps) via the commit checks page. Commits a45eeef and 80b0bff are empty reconciliation commits and changed nothing.
- Overlap: a second scheduled run produced Batch 16 concurrently; reconciled per docs/matrix/batch-16-overlap-reconciliation.md (commit 9406764). 7 same-slug articles were superseded in place; 2 supplementary articles retained (honda-wave-alpha-vs-honda-cbr150r, honda-blade-vs-honda-winner-r; matrix rows MM-0608/MM-0609 in docs/matrix/batch-16b-rows.csv). Note: the reconciliation doc lists the MM-0609 slug as honda-blade-vs-winner-r - the published article slug is honda-blade-vs-honda-winner-r.
- Pages: live verification after the repair deployment shows the 675-article index and the 108-guide motorcycles hub with correct content.
- Docs sync: the 31 batch-16 rows plus the 2 batch-16b rows are merged into docs/matrix/master-matrix.csv by this batch-16 docs-sync run (642 -> 675).


## Research provenance

- All technical facts from th
e MODEL-DATABASE Batch 14 verified rows (Honda VN pages for Wave Alpha 110, Blade, Wave RSX, Future 125 FI, Super Cub C125, CT125, Winner R, CBR150R; Yamaha VN pages for Sirius RC 110, Exciter 155 VVA; retrieved 2026-09-23). No secondary sources, no estimated specs, no fields filled where the manufacturer publishes none (Sirius/Exciter seat heights, Wave Alpha/Sirius fuel systems remain unclaimed).
- List prices are date-stamped manufacturer list prices and marked as changing over time in every article that cites them.

## Overlap reconciliation

This batch was produced concurrently by two scheduled runs; see docs/matrix/batch-16-overlap-reconciliation.md for the authoritative reconciliation. Net effect: 31 planned articles above, plus 2 supplementary articles (honda-wave-alpha-vs-honda-cbr150r, honda-blade-vs-winner-r) retained from the second run after 7 same-slug supersessions - 675 published articles site-wide, not 673. MM-0608/MM-0609 rows pending in docs/matrix/batch-16b-rows.csv.
