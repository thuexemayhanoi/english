# SEO Package 3: plan, gate and checkpoint

Status on 2026-10-25: **RESEARCH COMPLETE**, **EXPERIMENT VALIDATED** (technical scope only, on `claude/seo-package3-research`). Nothing is merged or deployed. Package 3 starts on main only after SEO Package 2 is complete (every article in `docs/seo/package2-baseline.json` DONE or REVIEW_REQUIRED with a reason) and its QA, CI and deployment are green. On 2026-10-25 Package 2 stands at 45 of 693 done (batch 5 merged as `ca163b7`), 648 pending.

Knowledge base and evidence: [research/seo-package-3-knowledge-base.md](research/seo-package-3-knowledge-base.md). SERP evidence: [research/package3/serp-study-vn-2026-10-25.md](research/package3/serp-study-vn-2026-10-25.md).

## 1. Status vocabulary

RESEARCH COMPLETE · EXPERIMENT VALIDATED · ON-PAGE COMPLETE · QA PASSED · DEPLOYED · LIVE VERIFIED · RANK MONITORING · RANK IMPROVED (only with a newer dated position than the baseline, same tool, market and device) · REVIEW REQUIRED. A commit is never evidence of indexing or ranking.

## 2. What the evidence says (zero-data mode)

1. Head queries ("motorbike rental hanoi", "hanoi motorbike rental", "rent motorbike hanoi", "scooter rental hanoi", "motorbike hire hanoi"): the site is not in the top 30 (MEASURED, OpenSEO, Vietnam, English, desktop, 2026-10-25). A local pack sits above organic #1, and the organic top 10 is shop home pages, Tripadvisor and Facebook. KD 7 and volume 2,400 for the three main variants (MEASURED, OpenSEO). The barrier is local and entity proof (Google Business Profile reviews, consistent name), which is owner-side; on-page edits alone are not expected to move these queries (INFERRED).
2. Measured positions today: monthly #16 (`/articles/extending-motorbike-rental-hanoi/`), deposit #10 (`/articles/can-foreigners-rent-a-motorbike-hanoi/`), expats #10 (`/articles/best-motorbike-for-expats-hanoi/`), 50cc licence #15 (`/topics/50cc/`), A1 licence #15 (`/topics/law-licences/`). None of the 16 declared owner URLs for the 18 queries is in the top 30; all five ranking URLs differ from the declared owner.
3. The 2026-10-14 Ubersuggest positions (monthly #3, Old Quarter #4, deposit #8, Noi Bai #9, how much #10, 50cc licence #11, tourist #12, expats #14, A1 #17) are HISTORICAL; the Ubersuggest project that produced them no longer exists (HTTP 404 on 2026-10-25), and tools, devices and dates differ, so today's absence is not proof of a drop.

## 3. Rank protection rules for Package 3

- Before any edit to a URL that ranks (measured or historical), record: the exact ranking URL, the declared owner, the query's intent, the baseline fingerprint (`rendered-site-audit.js --fingerprint-out`) and a fresh dated position.
- Do not move a keyword to the home page or a pillar to tidy the matrix. Where a non-owner URL ranks (section 2, item 2), the default is to protect it: no title, H1, URL or intent change, and add a contextual link from it to the owner only if it helps the reader. Re-declaring the owner needs two consistent dated snapshots.
- Never change a slug, permalink or canonical, never delete or noindex, never redirect in bulk.

## 4. Batches (after Package 2)

Every batch: fetch main; baseline (fingerprints, positions, matrix rows); apply only methods marked ADOPT or ADAPT in the knowledge base; full QA (build-report, matrix, topical map, engine tests, Jekyll build, rendered audit with `--fingerprint-compare`, schema-check, duplicate check, regression guard, Package 2 gate); PR; merge only on green CI; verify production; update the matrix, `optimization-log.json` (with `expected_signal` and `check_after`) and the progress log.

1. **Batch 1, the five URLs with ranking evidence:** `/articles/extending-motorbike-rental-hanoi/`, `/articles/can-foreigners-rent-a-motorbike-hanoi/`, `/articles/best-motorbike-for-expats-hanoi/`, `/topics/50cc/`, `/topics/law-licences/` (measured 2026-10-25), with `/articles/renting-motorbike-old-quarter/` and `/articles/daily-weekly-monthly-motorbike-rental-hanoi/` as historical-evidence reserves. Work: protect what ranks; answer the query's PAA questions where the page already holds verified facts; one contextual link to the declared owner where it serves the reader; no rewrite.
2. **Batch 2, home page and commercial pillars:** merge the validated research-branch changes (K1 fingerprint tool, K2 Lighthouse per-audit assertions, E2 monthly hub title tag, and E1 entity fields once the owner confirms them); review `/topics/rental/` and `/topics/monthly-rental/` against the measured SERP (price grid needs the price decision in section 5).
3. **Following batches, 5-10 URLs by matrix priority:** the K21 inbound-link work (520 pages with fewer than 3 in-body linking pages), K11 templated descriptions (14 pages), and the matrix P2 queue.

## 5. Owner decisions (REVIEW REQUIRED)

1. Prices: `docs/seo/price-reconciliation.md` is still open. The live home page shows an E-Bike card at 200,000 VND per day and a Yamaha Sirius card at 150,000 VND (both APPROVED in OWNER-FACTS on 2026-09-22), while the owner's reference table of 2026-10-25 lists electric vehicles as "contact" and does not list the Sirius. The site keeps OWNER-FACTS until the owner says which table is current; then one reviewed batch updates OWNER-FACTS first and every surface after it.
2. Identity fields for experiment E1: add the Google Business Profile name "Thuê xe máy ở Hà Nội - Nguyễn Tú", the Maps URL `https://maps.google.com/maps?cid=7448790013669858019` and the listing coordinates to `docs/OWNER-FACTS.md`.
3. Off-site, owner-only: Google Business Profile reviews and completeness, one spelling of the business name across Tripadvisor, wikidot, Facebook and the base44 app listings (who runs them is UNKNOWN), and whether `app.rentbikehanoi.com` (seen at #5 for "monthly motorbike rental hanoi" in the Vietnam SERP) should compete with this site for the same queries.
4. Measurement: Search Console for en.rentbikehanoi.com (switches the matrix to DATA-DRIVEN), and a replacement rank tracker for this domain (the Ubersuggest project is gone; OpenRush has no credits; OpenSEO rank tracking is a paid recurring setup and needs approval). Until then, positions are read with one-off OpenSEO SERP calls (about 7.5 credits per query at depth 30).

## 6. Checkpoint (resume here)

- Research branch: `claude/seo-package3-research` (worktree `/home/user/english-p3` in this session). Commits: Google baseline, deep reads A and B, SERP study, K1 fingerprint tool, K2 Lighthouse assertions, E1 + E2 experiment, knowledge base and this plan.
- Not merged on purpose. Before merging any of it: wait for Package 2 to finish, merge main into the branch, rebuild, re-run every check, then open the Package 3 batch 2 PR.
- Open item: the error-level Lighthouse run dispatched on `fc86ebd` (see the knowledge base experiment log).
- OpenSEO project for this domain: "en.rentbikehanoi.com (EN, Vietnam)" (`72fe88fb-20ca-43ac-bc33-0096ec22b81b`), created 2026-10-25 for SERP and keyword reads; no tracker or schedule is enabled.
