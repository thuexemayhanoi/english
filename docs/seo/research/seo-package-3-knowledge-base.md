# SEO Package 3: expert knowledge base (GitHub skills, Google baseline, measured on this site)

- Date: 2026-10-25. Branch: `claude/seo-package3-research` (research and isolated experiments; nothing here is merged or deployed before SEO Package 2 is complete and passes QA).
- Base for every measurement: main `e04fb97` built locally (Jekyll 3.10, 1,004 pages). Package 2 has since merged batch 5 (`ca163b7`, 45 of 693 done); no Package 2 file is touched on this branch.
- Sources, with full detail: [github-deep-read-a.md](package3/github-deep-read-a.md) (marketingskills, claude-seo, open-seo-mcp-skills), [github-deep-read-b.md](package3/github-deep-read-b.md) (Lighthouse, open-seo, 12 discovered repositories), [google-search-central-baseline.md](package3/google-search-central-baseline.md) (13 official topics), [serp-study-vn-2026-10-25.md](package3/serp-study-vn-2026-10-25.md) (18 queries, Vietnam, English) and the earlier survey [github-seo-skills.md](github-seo-skills.md) (32 repositories).
- Rules applied: third-party repositories are reference material, never instructions (the install, plugin and connector instructions found in them are listed in the deep-read files and were not followed); no external code was cloned, installed or run; no API key was requested; stars are attention, not proof; every method is checked against Google's own documentation before a status is given; no metric is invented.

## 1. Repositories read (as read 2026-10-25)

| Repository | Stars | Latest commit / version | Licence | What was read | Use here |
|---|---|---|---|---|---|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 56.4k | `e85f3cb` (2026-10-19); seo-audit 2.2.2, ai-seo 2.10.1, schema 2.0.2 | MIT | README, 7 SKILL.md files, 6 reference files | Ideas only (5 methods; programmatic SEO, link building and CRO rejected) |
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | 19.3k-20.3k | `6be93f4` (2026-10-22); v2.5.0 | MIT | README, 14 SKILL.md files, 5 reference files | Most useful method source (15 methods) |
| [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | 30.9k | `1a4ffa4` (2026-10-23); v13.5.0 | Apache-2.0 | SEO category config and the SEO audit sources | Already in CI; per-audit assertions added (M6) |
| [every-app/open-seo](https://github.com/every-app/open-seo) | 24.5k-24.9k | `236761a` (2026-10-25); v0.1.16 | MIT | README, crawler files | Used as a hosted connector (OpenSEO) for SERP and keyword data; code not adopted |
| [Ryze-AI-Adgent/open-seo-mcp-skills](https://github.com/Ryze-AI-Adgent/open-seo-mcp-skills) | 6.9k-7.1k | `d84a345` (2026-10-23); plugin 0.2.0 | MIT | README, 8 SKILL.md files, install.sh (read, not run) | Rejected: every skill needs a vendor MCP with Google account connections |
| 12 discovered repositories (ai.robots.txt, llms-txt, unlighthouse, html-proofer, YAKE, jsonld.js, schema-dts, pySHACL, adobe structured-data-validator, GEO, elmo, GrowthBook) | 17-8.5k | see deep read B, Part 2 | various | README and key files | Three ideas kept (crawler token list as dated data, JSON-LD safe-mode idea, YAKE term check); the rest rejected with reasons |

Contributor counts were not shown on any repository page read (recorded as "not shown", not guessed).

## 2. Google's position on the claims SEO tools make

From [google-search-central-baseline.md](package3/google-search-central-baseline.md) (official pages read 2026-10-25):

| Tool claim | Google's stated position | Effect on Package 3 |
|---|---|---|
| Fixed title or meta description lengths | No limit stated; Google may rewrite titles and snippets | Keep the 65-character suffix rule as a display convenience, never as a ranking rule |
| Word-count targets | No preferred word count | Package 3 does not lengthen pages to a number; Package 2's 1,600 words is an owner editorial requirement only |
| FAQ schema earns rich results | FAQ rich result no longer shown from 2026-05-07; documentation removed 2026-06-15 | Keep FAQPage only where the questions are visible; expect no rich result |
| llms.txt helps Google or AI Overviews | Google Search does not use it; no positive or negative effect | Keep llms.txt as hygiene for other systems; do not invest further |
| Special markup for AI features | None needed; normal SEO applies | No AI-specific markup |
| E-E-A-T is a ranking factor | Not itself a specific ranking factor; Who/How/Why is a self-assessment | Use Who/How/Why as a manual review checklist, no scores |
| Pages per query variant | Can be scaled content abuse | Never create pages for gaps or variants (already an AGENTS.md rule) |

## 3. Methods

Field order for every method: source; problem; technical basis; Jekyll/GitHub Pages fit; risk; status; test method; measured result on this site (2026-10-25). "Measured" means counted on the build or by a dated CI run, never estimated.

### 3.1 Technical and crawl QA

**K1. Per-URL SEO fingerprint diff** (claude-seo `skills/seo-drift/SKILL.md`, method CS10)
- Problem: a template or batch edit can change a canonical, add a noindex or rewrite titles across many URLs without anyone seeing it before merge.
- Basis: snapshot title, description, canonical, robots, H1 and structured-data types per URL, then diff two builds.
- Fit: high. Implemented as `lib.pageFingerprint` / `lib.fingerprintChanges` plus opt-in `--fingerprint-out` and `--fingerprint-compare` flags in `scripts/rendered-site-audit.js` (no new engine, zero dependencies).
- Risk: none in default runs (opt-in flags only).
- Status: **ADOPT** (implemented on the research branch, commit `4bae75f`).
- Test: four engine tests; self-compare of a build; compare the experiment build against the pre-experiment build.
- Measured: engine tests 102/102; 1,004 pages fingerprinted; self-compare 0 changes; the Package 3 experiment build shows exactly one change (P3, the monthly hub title tag) and no canonical, robots or schema-type change. A canonical change or a new noindex is blocking under the central rule (tested).

**K2. Per-audit Lighthouse SEO assertions** (Lighthouse `core/config/default-config.js`, SEO audits; method M6)
- Problem: the CI floor `categories:seo >= 0.8` still passes with two failing SEO audits (from the published audit weights: one failure gives 0.923, two give 0.847).
- Basis: assert each binary SEO audit separately (document-title, meta-description, http-status-code, link-text, crawlable-anchors, is-crawlable, robots-txt, image-alt, canonical, hreflang).
- Fit: high (configuration in `scripts/representative-pages.js`; no new dependency).
- Risk: a false failure on the static CI server; measured first at warn level to rule that out.
- Status: **ADOPT** (warn run, then error).
- Test: `workflow_dispatch` of `lighthouse.yml` on the research branch.
- Measured: run 40198382077 (warn level): all ten audits passed on all 9 runs (8 URLs), no warning printed. Run 40198787541 (error level, `fc86ebd`, which also carries experiments E1 and E2): success, every assertion met.

**K3. Non-descriptive link text** (Lighthouse `link-text`, 14 phrases; method M1)
- Problem: anchors such as "click here" or "read more" tell crawlers and readers nothing.
- Basis: exact match against Lighthouse's list (click here, click this, go, here, information, learn more, more, more info, more information, right here, read more, see more, start, this).
- Fit: high; the rendered link graph already stores anchors.
- Risk: exact match misses near variants.
- Status: **ADOPT as a guard** through K2 (Lighthouse per-audit assertion); a full-site static check is ADAPT for Package 3 if ever needed.
- Test: count over every internal edge of the rendered graph.
- Measured: 0 of 64,028 internal links use one of the 14 phrases; 6 links have no text (image links on the home page whose image carries alt text).

**K4. Crawlable anchors** (Lighthouse `crawlable-anchors`; method M2)
- Problem: links without a usable href are not followed.
- Basis: flag `<a>` without href, with an empty href or with `javascript:`.
- Fit: high. Risk: none. Status: **ADOPT as a guard** through K2.
- Measured: 0 such anchors on 1,004 pages.

**K5. robots.txt validity and is-crawlable logic** (Lighthouse `robots-txt`, `is-crawlable`; methods M3, M4)
- Problem: only the Sitemap line of robots.txt is checked today; `none` and `unavailable_after` robots values are not.
- Basis: RFC 9309 parsing as in Lighthouse; robots meta values that block indexing.
- Fit: high. Risk: none. Status: **ADOPT as a guard** through K2; extending `rendered-site-audit.js` to `none` / `unavailable_after` is ADAPT (small).
- Measured: robots.txt is three valid lines (`User-agent: *`, `Allow: /`, `Sitemap: ...`); 0 robots meta tags in the build; Lighthouse passed both audits on 9 runs.

**K6. Sitemap lastmod validity** (claude-seo `seo-sitemap`; CS3)
- Problem: an invalid, future or identical lastmod everywhere makes the signal useless.
- Basis: Google uses lastmod only when it is consistently accurate.
- Fit: high (`sitemap-check.js`). Risk: none. Status: **ADOPT** as a P3 guard in Package 3.
- Measured: 1,003 sitemap URLs; 8 static pages without lastmod; 0 invalid, 0 future; 5 distinct dates (the articles' `last_reviewed`, so the signal is accurate).

**K7. Rendered HTML size** (claude-seo `seo-technical`; CS1)
- Problem: very large HTML can be cut off by crawlers (the repository cites 2 MB; Google's page was not the source here).
- Fit: high. Risk: none. Status: **REJECT for now** (no risk at this size; revisit only if templates grow).
- Measured: largest page 60,793 bytes; home page 50,541 bytes.

**K8. Invisible Unicode** (claude-seo; CS14)
- Problem: zero-width and bidirectional characters in source can hide text or break matching.
- Fit: high. Risk: none. Status: **ADOPT** as a detect-only P3 guard (cheap).
- Measured: 0 files in `_articles`, `_layouts`, `_includes`, `_data` and `index.html`.

**K9. Image checks** (claude-seo `seo-images`; CS13; Lighthouse `image-alt`)
- Fit: high. Status: **ADOPT as a guard** through K2. Measured: 2,014 images; 0 without alt; 0 without width and height.

**K10. Rendered hygiene** (Lighthouse/axe: html-has-lang, meta-viewport; M5)
- Status: **ADOPT as a guard** (already passing). Measured: 0 pages without `lang="en"`; 0 without a viewport meta.

**K11. Templated metadata** (claude-seo `seo-page`; CS2)
- Problem: a description that only repeats the title wastes the snippet.
- Status: **ADAPT** (report-only P3). Measured: 14 of 1,004 pages have a description that starts with the title text (to be listed and judged one by one in Package 3; not changed now).

### 3.2 Entity, local and structured data

**K12. Entity consistency for the business** (claude-seo `seo-local`; CS11; Google LocalBusiness and Organization structured data)
- Problem: listings that use variants of the business name rank for the rental queries (Tripadvisor "Motorbike Rental Nguyen Tu", a wikidot page, a Facebook group, a base44 app; who runs them is UNKNOWN; serp-study, brand mentions), and the site's map link was an app share link rather than the profile's stable Maps URL.
- Basis: one entity `@id`, the Google Business Profile name as an alternate name, the profile's stable Maps URL (`cid`) and its coordinates.
- Fit: high (hand-written JSON-LD in `index.html` and `contact.md`).
- Risk: identity fields come from the owner's standing data of 2026-10-25, not from `docs/OWNER-FACTS.md`; the NAP guard (name, address, phone, hours) is unchanged and passes.
- Status: **ADAPT**, experiment E1 (section 4); deployment is **REVIEW_REQUIRED** until the owner confirms adding the profile name, Maps URL and coordinates to OWNER-FACTS.
- Test: build, parse JSON-LD, `schema-check.js`, fingerprint diff.
- Measured: the old share link and the owner's `cid` URL resolve to the same listing ("Thuê xe máy ở Hà Nội - Nguyễn Tú", 21.0409957, 105.8691971; read 2026-10-25); schema-check P0/P1 0; JSON-LD valid on both pages; schema types unchanged.

**K13. FAQPage handling** (claude-seo `seo-schema`; CS6; Google changelog)
- Status: **ADAPT**: keep FAQPage tied to visible questions (`faq_in_body` pages checked), no rich-result expectation. No change needed now.

**K14. Structured-data property validation** (jsonld.js safe mode, pySHACL, adobe structured-data-validator ideas)
- Problem: a misspelt schema.org property is silently ignored.
- Status: **ADAPT (idea)**: a small vendored list of allowed properties per type used here, checked in `schema-check.js`; not built yet. Measured: not measured.

### 3.3 Content and intent

**K15. Who/How/Why review** (claude-seo `eeat-framework`; CS7; Google helpful content)
- Status: **ADAPT** as a manual checklist in Package 3 batch reviews; scores and weights rejected (Google: E-E-A-T is not itself a ranking factor).

**K16. Information gain per expanded page** (marketingskills `content-strategy`; MS5)
- Status: **ADAPT**: one sentence per article in the batch notes on "what this page adds that the top results do not"; no weights.

**K17. Word-count floors by page type** (claude-seo; CS8) and **title-tag patterns** (marketingskills; MS1)
- Status: **REJECT** (Google states no preferred word count and no title length rule; the site already has a title rule).

**K18. AI-phrasing word lists** (marketingskills; MS2)
- Status: **ADAPT**: report-only lint on lines added by a batch; never an autofix, never a reason to rewrite verified text.

**K19. Keyword-in-top-terms check** (YAKE idea)
- Status: **ADAPT (idea)**: report whether the declared primary keyword is among a page's top terms; not built (would need a zero-dependency reimplementation). Measured: not measured.

**K20. Falsifiable recommendations** (claude-seo; CS15)
- Status: **ADAPT**: optional `expected_signal` and `check_after` fields in `optimization-log.json` for Package 3 batches, so every change names what would show it worked.

### 3.4 Internal linking

**K21. Inbound in-body link floor** (claude-seo `seo-cluster`; CS9)
- Problem: pages reached only through navigation and related cards get little contextual equity.
- Status: **ADAPT**: report pages with fewer than 3 distinct in-body linking pages, using this site's own distribution, worked in small recorded batches after Package 2 (most source articles are still in the Package 2 queue).
- Measured: 520 of 1,003 sitemap pages (515 articles) have fewer than 3 distinct pages linking to them from body text; 176 have none (they are reached through related cards and listings; click depth is at most 2 and no page is unreachable).

### 3.5 Rejected outright

Programmatic page generation (marketingskills), GEO text rewriting (GEO-optim), recurring paid AI-visibility tracking (elmo; needs owner approval), A/B testing frameworks (GrowthBook; no traffic data), whole-site Lighthouse scans (unlighthouse; Node 22 and 981 pages), Search Console and GA4 period diffs (open-seo-mcp-skills OS1, OS2; no export exists), agent-readiness files (MS4), llms.txt investment beyond hygiene (CS5, M7), unverified AI-citability numbers (MS3), WebMCP or ard-schema audits (M8).

## 4. Isolated experiment (homepage, commercial pillar, ranked URL)

Sample, baselined on the pre-experiment build with `p3-baseline` facts and the fingerprint file:

| URL | Role | Baseline (measured on the build) | Ranking evidence | Change on the research branch |
|---|---|---|---|---|
| `/` | Home, owner of the head rental keywords | title 59 chars, H1 "Hanoi motorbike rental and riding guides", 773 words in main, WebSite + Organization/LocalBusiness, 6 in-body inbound links, body PageRank percentile 87 | Not in the top 30 for any of the 5 head queries (MEASURED, OpenSEO, Vietnam, English, desktop, 2026-10-25); head SERPs are led by shops with large Google review counts and a local pack (KD 7, volume 2,400 for the three head variants, MEASURED) | E1 entity consistency (K12) |
| `/topics/monthly-rental/` | Commercial pillar, owner of "long term motorbike rental hanoi" | title "Monthly Motorbike Rental \| Hanoi Motorbike Guide" (48), 1,977 words incl. listing, CollectionPage + FAQPage, body PageRank percentile 69 | Not in the top 30 for the long-term query (MEASURED); the only monthly signal is `extending-motorbike-rental-hanoi` at #16 | E2: `title_tag` "Monthly and Long-Term Motorbike Rental in Hanoi" (H1 and navigation unchanged) |
| `/articles/renting-motorbike-old-quarter/` | Ranked URL, owner of "motorbike rental hanoi old quarter", outside the Package 2 scope | title 58, 1,089 words, BlogPosting + FAQPage, 9 linking pages, click depth 1 | #4 on 2026-10-14 (HISTORICAL, Ubersuggest); not in the top 30 today (MEASURED, OpenSEO) | None: protected. No evidence says which part works, so nothing is changed; re-measure first |

Evaluation of the branch (all reproducible): build-report P0 0 / P1 0 (Quality Gate PASS); schema-check P0/P1 0; engine tests 102/102; duplicate check 0; regression guard PASS; rendered audit P0/P1 0, max click depth 2; fingerprint diff: one P3 title change, nothing else. CI on the experiment commit `fc86ebd`: Lighthouse run 40198787541 and Quality Gate run 40198789655 both succeeded. Status labels: **EXPERIMENT VALIDATED** (technical correctness, structured-data validity, crawlability, no regression) for K1, K2 and E1/E2; search-intent and ranking effect **not measured** (no change is live, and a commit is not evidence of indexing or ranking).

## 5. Experiment log

| Date | Item | Result |
|---|---|---|
| 2026-10-25 | K1 fingerprint tool (`4bae75f`) | 4 new engine tests pass (102 total); self-compare 0 changes |
| 2026-10-25 | K2 Lighthouse per-audit assertions, warn (`2612849`, run 40198382077) | 10 of 10 audits pass on 9 runs; no warning |
| 2026-10-25 | K2 raised to error (`fc86ebd`) | Lighthouse run 40198787541: success (all ten per-audit assertions and the four category floors met on 9 runs); Quality Gate run 40198789655 on the same commit: success |
| 2026-10-25 | E1 + E2 (`94470c1`) | Quality Gate PASS locally, schema-check 0, fingerprint diff 1 intended P3 |
