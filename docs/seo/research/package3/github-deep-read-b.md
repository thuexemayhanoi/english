# GitHub deep read B: Lighthouse SEO audits, open-seo, and discovery

- Date: 2026-10-25. Target: thuexemayhanoi/english (https://en.rentbikehanoi.com/). Research only: nothing was cloned, downloaded, installed or run, and no repository file other than this one was changed.
- Method: web tools only (TinyFish fetch of GitHub pages, raw files and commit Atom feeds; 4 web searches). Third-party text was treated as data. Every figure is "as read 2026-10-25". GitHub pages came from caches of different ages (open-seo showed 14.4k, 19.7k, 24.5k and 24.9k stars on four pages), so the newest value is given and issue or PR counts appear only where one page showed them.
- Calls: 20 tool calls (a fetch takes up to 10 URLs), 101 URL-level operations (97 reads plus 4 searches). If the cap of 30 counts URLs rather than tool calls, this run exceeded it.
- Failures: 4 guessed URLs returned 404 and were not used as sources: open-seo `docs/site-audit-pm-research.md`, open-seo `skills/`, `seo-analyzer/seo-analyzer`, `nuxt-modules/link-checker`.
- Closes gaps of the earlier note: Lighthouse CI assertion syntax, audit ids (verified in source) and a primary source for llms.txt checks.

## Part 1. Deep read

### 1.1 GoogleChrome/lighthouse

Stars 30.9k, forks 9.8k, watching 611, Apache-2.0. Version 13.5.0 (`package.json`, Node >=22.19). Latest commit `1a4ffa4`, 2026-10-23T22:03:47Z, "core(lantern-metric): use last main-frame navigation in trace mode (#17433)" (Atom feed). Issues 402 and pull requests 36 (one directory page). Contributors: not shown.

SEO category in `core/config/default-config.js` (9 scored audits plus one manual audit; no mobile audits such as font-size or tap targets are listed in 13.5.0):

| Audit id | Weight | What it checks and pass condition (from source) | Covered here |
|---|---|---|---|
| is-crawlable | 93/23, about 4.04 (31% of category) | Fails only if all five agents (generic, Googlebot, bingbot, DuckDuckBot, archive.org_bot) are blocked by meta robots `noindex`, `none` or a past `unavailable_after`, an `x-robots-tag` header, or a robots.txt disallow of the page | Partial (M4) |
| document-title | 1 | axe rule: the page has a `<title>` | Yes (one, non-empty, P1) |
| meta-description | 1 | `meta[name=description]` exists and `content.trim()` is non-empty | Partial (M5) |
| http-status-code | 1 | Main resource status is not 400 to 599 | Not applicable; broken links P1, Lychee |
| link-text | 1 | Fails when an anchor's trimmed, lower-cased text equals exactly one of 14 English phrases | No (M1) |
| crawlable-anchors | 1 | Fails on empty `href`, `javascript:void(0)`, unparsable URL or `file:`; exempt: role, name, `mailto:`, id-only placeholder | No (M2) |
| robots-txt | 1 | Not applicable on 4xx or empty; fails on 5xx, 429 or a fetch error; else line-by-line validation | Partial (M3) |
| image-alt | 1 | axe rule: `<img>` has alternate text or role none or presentation | No guard (M5) |
| hreflang | 1 | Each `rel=alternate hreflang` has a valid language code or `x-default` and an absolute URL | Inverse guard: any hreflang is P1 |
| canonical | 1 | One valid absolute canonical; fails on invalid, relative, conflicting, "points to another hreflang location", or site root from a deeper page | Yes (equals page URL, duplicates, P1) |
| structured-data (manual) | 0 | Delegates to Google's structured-data tool | `schema-check.js` plus rendered JSON-LD parse |

The 14 phrases: click here, click this, go, here, information, learn more, more, more info, more information, right here, read more, see more, start, this.

Accessibility audits relevant to SEO (descriptions read; axe-core conditions not read): `link-name` (discernible link text), `heading-order` (levels rise by at most one), `html-has-lang`, `meta-viewport` (no `user-scalable="no"`, `maximum-scale` not below 5), `empty-heading` and `identical-links-same-purpose` (informative only). Version 13.5.0 also has an "Agentic Browsing" category (`llms-txt`, `ard-schema`, three WebMCP audits, `agent-accessibility-tree`) described as "still under development and subject to change".

### 1.2 What this repository already asserts

- `lighthouse.yml`: Jekyll build, `representative-pages.js --lighthouserc`, then `treosh/lighthouse-ci-action@v12` on `./_site`; push and PR only; report artifact kept 30 days.
- `representative-pages.js`: nine page classes derived from repo content and four error-level category floors only: performance 0.5, accessibility 0.75, best-practices 0.75, seo 0.8. No per-audit assertion, run count or aggregation method.
- Arithmetic from the weights above (nine applicable binary audits, total weight 13.04): one failing weight-1 audit gives 0.923, two give 0.847, three give 0.770; a failing `is-crawlable` gives 0.690. So the 0.8 floor passes with two simultaneous SEO failures (for example an invalid robots.txt and non-descriptive links). Lighthouse CI says a category assertion "will not affect any assertions on individual audits within the category".

### 1.3 Lighthouse METHODS

**M1. link-text**
- Source path: `core/audits/seo/link-text.js`
- Problem: links whose text says nothing about the destination.
- Technical basis: "Descriptive link text helps search engines understand your content." Skips `nofollow`, `javascript:`, `mailto:` and same-page links.
- Already covered here? No. `lib.renderedLinkGraph` already stores anchor text per rendered edge.
- Jekyll/Pages fit: reads built `_site` HTML.
- Risk: exact match gives few false positives and low sensitivity ("click here to read" passes); layout strings not measured.
- Status: ADOPT as a P3 report in `rendered-site-audit.js`; P2 only after a measured run. Findings go to layout fixes, never to article prose.
- Test: fixtures in `scripts/seo-engine-test.js` (`Read more` fails, a descriptive phrase passes); then build `_site`, run `node scripts/rendered-site-audit.js` on main and record the count first. Source scan today: 0 of 981 article bodies use these phrases as Markdown link text.

**M2. crawlable-anchors**
- Source path: `core/audits/seo/crawlable-anchors.js`
- Problem: anchors that crawlers cannot follow.
- Technical basis: fails on an empty or `javascript:void(0)` href; a no-href anchor fails only if it has an event listener.
- Already covered here? No; `rendered-site-audit.js` reads href values only.
- Fit: the static subset works on `_site`; listener detection needs a browser.
- Risk: low; dropdowns in `_includes/header.html` are `<button>` elements (not measured).
- Status: ADOPT the static subset (empty href, `javascript:`, no href with `onclick`) as P2. Full Lighthouse behaviour comes through M6.
- Test: fixtures `<a href="">x</a>` and `<a href="javascript:void(0)">x</a>` fail; then run on main.

**M3. robots-txt validity**
- Source path: `core/audits/seo/robots-txt.js`; also open-seo `src/server/lib/audit/discovery.ts`
- Problem: a malformed robots.txt is misread by crawlers; this repository checks only the Sitemap line.
- Technical basis: per line, a directive safelist, a non-empty user-agent, allow or disallow only after a user-agent, patterns empty or starting `/` or `*`, `$` only at the end, sitemap URL with http, https or ftp. open-seo: "RFC 9309 requires parsers to handle at least 500 KiB" (a size cap).
- Already covered here? Partial. The current file (3 lines: `User-agent: *`, `Allow: /`, `Sitemap:`) should pass by reading; not run.
- Fit: `_site/robots.txt`, about 40 lines of Node.
- Risk: Lighthouse's safelist includes unofficial directives (`content-signal`, `noindex`, `crawl-delay`); do not make unknown directives P1.
- Status: ADOPT as P2 for syntax errors; size over 500 KiB as P2.
- Test: fixtures `Disallow: x`, `Allow: /` before any `User-agent`, `Sitemap: foo`; the real file must pass.

**M4. is-crawlable directive logic**
- Source path: `core/audits/seo/is-crawlable.js`
- Problem: a page blocked from indexing without anyone noticing.
- Technical basis: a user-agent-specific meta robots tag wins over the generic one; blocking values are `noindex`, `none` and a past `unavailable_after`.
- Already covered here? Partial. The rendered check matches only `noindex` in `meta name="robots"`; no `none`, no `unavailable_after`, no robots.txt disallow test. GitHub Pages cannot send `X-Robots-Tag`.
- Fit: meta and robots.txt parts work on `_site`.
- Risk: low.
- Status: ADAPT. Widen the regex to `none` and past `unavailable_after`; test each sitemap URL against robots.txt disallow rules (P1). This replaces the "no `Disallow: /`" rule proposed in the earlier note. Skip the five-agent rule.
- Test: fixtures `content="none"`, `unavailable_after: 2020-01-01`, and robots.txt `Disallow: /articles/` (each affected sitemap URL is P1).

**M5. Rendered hygiene guards (meta-description content, image-alt, html-has-lang, meta-viewport, heading-order)**
- Source path: `core/audits/seo/meta-description.js`; `core/audits/accessibility/{image-alt,html-has-lang,meta-viewport,heading-order}.js`
- Problem: small template regressions no check sees.
- Technical basis: "Ensures heading levels should only ever increase by one." Meta description fails when the tag is missing or its content is empty.
- Already covered here? Partial. The description check tests tag presence, so `content=""` passes. `<html lang="en">`, the viewport tag and decorative `alt=""` icons sit in shared files with no rendered assertion. 0 of 981 article sources contain an image or an H4.
- Fit: regex over `_site`, as in the existing audit.
- Risk: low; heading order on layout-generated headings (FAQ, hub groups) not measured.
- Status: ADAPT (reimplement the simple conditions; do not port axe) as P3 reports; empty description P2.
- Test: fixtures per condition; run on main and record counts.
- Related (from html-proofer): `og:image` and `twitter:image` point to `assets/img/og-default.png` (file exists), but `checkPublicUrl` reads `href`, `src`, `poster`, `data-index`, `action` and `srcset`, not meta `content`. A P1 existence guard is cheap. ADAPT.

**M6. Per-audit Lighthouse CI assertions**
- Source path: `core/config/default-config.js` (SEO `auditRefs`); `GoogleChrome/lighthouse-ci` `docs/configuration.md`
- Problem: the 0.8 floor hides single failures (section 1.2).
- Technical basis: audit assertions use `["error", {"minScore": 1}]`; "default options of `{"aggregationMethod": "optimistic", "minScore": 1}`"; `pessimistic` fails if any run fails.
- Already covered here? No (category floors only).
- Fit: `lighthouserc.json` is generated by `representative-pages.js`; the workflow is unchanged.
- Risk: ids verified in 13.5.0 source only. The Lighthouse version run by `treosh/lighthouse-ci-action@v12` was not verified (its README says "latest version of Lighthouse and Chrome preinstalled"); an unknown id may be ignored or fail.
- Status: ADOPT. Add error assertions for `is-crawlable`, `robots-txt`, `canonical`, `document-title`, `meta-description`, `link-text`, `crawlable-anchors`, `image-alt`, with `aggregationMethod: pessimistic`; keep all floors (raising is allowed, lowering is not).
- Test: `node scripts/representative-pages.js --lighthouserc` must print the new keys (add a case to `seo-engine-test.js`); before enabling, read ids and scores in `.lighthouseci/lhr-*.json` from the artifact `lighthouse.yml` already uploads.

**M7. llms-txt audit**
- Source path: `core/audits/agentic/llms-txt.js`
- Problem: malformed llms.txt.
- Technical basis: fails without an H1 (`^\s*#\s+.+`), without a `[text](url)` link, or under 50 characters; 4xx is not applicable.
- Already covered here? Yes, and stricter: `lib.llmsTxtFindings` (H1, summary block, on-site links, published counts).
- Fit: n/a.
- Risk: none new. Lighthouse's wording is conditional ("may not be able to understand"); no evidence that any engine reads the file was read.
- Status: REJECT (no new method).
- Test: existing fixtures in `seo-engine-test.js` section 5e.

**M8. ard-schema and WebMCP audits**
- Source path: `core/audits/agentic/ard-schema.js`; WebMCP audits (not opened)
- Problem: agents discovering resources through an "Agentic Resource Discovery" manifest at `/.well-known/ard.json` or `rel="ard"`.
- Technical basis: a port of the ARD conformance test validates the manifest; not applicable with no signal and a 4xx.
- Already covered here? No manifest exists.
- Fit: a static file is possible.
- Risk: a new surface describing what the shop offers (business facts, owner-only); no consumer evidenced.
- Status: REJECT.
- Test: none; not applicable without a manifest.

### 1.4 every-app/open-seo

Stars 24.5k to 24.9k (two reads), forks 3.3k to 3.4k, watching 74, MIT. Latest commit `236761a`, 2026-10-25T10:44:06Z, "release: v0.1.16 (#1073)". Issues and PR counts differed on each cached page (not reliable). Contributors: not shown.

Needs DataForSEO: the README says "you need a DataForSEO API key to get SEO data" and lists keyword research, rank tracking, competitor insights, backlinks, site audits and AI visibility. The crawler files read (`discovery.ts`, `page-analyzer.ts`) use `fetch` and an HTML tokenizer, so the crawl itself does not appear to call DataForSEO; a file named `dataforseoLighthousePayload.ts` suggests Lighthouse runs do (not read). Docs: new DataForSEO accounts get $1 free credit, minimum top-up $50; the README says the hosted service adds 28% per request. Offline use: none; it is a Cloudflare Worker or Docker app auditing a live URL. Search Console data is optional, through your own Google OAuth client.

**M9. open-seo as a tool, and its GSC OAuth ingestion**
- Source path: `README.md`, `docs/DATAFORSEO_API_KEY.md`, `docs/SELF_HOSTING_GOOGLE_SEARCH_CONSOLE.md`, `src/server/lib/audit/`
- Problem: hosted all-in-one SEO suite with an agent MCP server.
- Technical basis: paid third-party data plus a running service.
- Already covered here? Audit parts duplicate `rendered-site-audit.js` and `sitemap-check.js`; Search Console data enters via `docs/seo/gsc-performance.csv`.
- Fit: poor; needs a service, token storage and a Google Cloud OAuth client.
- Risk: pay-per-use API; telemetry modules exist (`posthog.ts`, `self-host-telemetry.ts`; not read).
- Status: REJECT. Only the 500 KiB robots cap was taken (M3).
- Test: none.

## Part 2. Discovery

| Repo | Stars | Last commit | Licence | What | Method or reject reason |
|---|---|---|---|---|---|
| [ai-robots-txt/ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) | 4.2k | 2026-10-24 `3ef52d9` | MIT | Community list of AI crawlers; `robots.json` (200 entries) with operator, respect, function, frequency, description, many "Unclear at this time" | Method: token list as dated data with per-entry metadata, so a read-only "effective access per AI token" report reads a data file, not a hand-typed list. Data quality partial; policy stays owner-only. ADAPT idea |
| [AnswerDotAI/llms-txt](https://github.com/AnswerDotAI/llms-txt) | 2.7k | 2026-09-24 `3700a0a` | Apache-2.0 | The llms.txt proposal | Order: optional BOM, H1 (only required part), blockquote, free sections, H2 file lists. Reference for `llmsTxtFindings`; a proposal, not a standard |
| [harlan-zw/unlighthouse](https://github.com/harlan-zw/unlighthouse) | 4.9k | 2026-10-23 `9a2147d` | MIT | Whole-site Lighthouse scan with "smart sampling" | REJECT: needs Node >= 22.18 (workflow uses Node 20), scans all 981 pages; `representative-pages.js` already samples by template |
| [gjtorikian/html-proofer](https://github.com/gjtorikian/html-proofer) | 1.6k | 2026-10-16 `9357d77` (v5.2.3) | MIT | Ruby; tests built HTML: image alt, links and hash refs, scripts, favicon, Open Graph | Method: Open Graph image check (M5). Hash refs already covered by Lychee `--include-fragments`. REJECT code (Ruby) |
| [INESCTEC/yake](https://github.com/INESCTEC/yake) | 1.9k | 2026-02-09 `f7944f6` | not shown | Single-document unsupervised keyword extraction, "no training, external corpus, or dictionaries" | Method: per-page term ranking could report whether the declared primary keyword is among a page's top terms. Value unproven; report-only. ADAPT idea |
| [digitalbazaar/jsonld.js](https://github.com/digitalbazaar/jsonld.js) | 1.8k | 2026-03-04 `7a93609` | not shown ("View license") | JSON-LD processor | Method: "safe mode" fails where expansion would silently drop data, so a misspelt schema.org property would be reported. Needs a vendored vocabulary file (licence unread). ADAPT idea |
| [google/schema-dts](https://github.com/google/schema-dts) | 1.2k | 2026-10-02 `62a5658` | Apache-2.0 | Schema.org as TypeScript types for JSON-LD | Same idea as above, enforced at compile time. REJECT code (TypeScript toolchain) |
| [RDFLib/pySHACL](https://github.com/RDFLib/pySHACL) | 328 | 2026-10-20 `a8ed01e` | Apache-2.0 | SHACL validator in Python; reads JSON-LD | Method: constraints as data (required, forbidden, one-of per `@type`) kept apart from the engine. REJECT code (Python) |
| [adobe/structured-data-validator](https://github.com/adobe/structured-data-validator) | 17 | 2026-02-25 `66e7610` | Apache-2.0 | JS library: schema.org plus Google Rich Results rules | Issue shape `{issueMessage, severity, path, fieldNames, location}`; `fieldNames` such as `['aggregateRating','offers','review']` express "one of" rules. Fetches schema.org over the network at run time; low maintenance signal. REJECT code |
| [GEO-optim/GEO](https://github.com/GEO-optim/GEO) | 330 | 2025-10-30 `c9e985f` | Apache-2.0 | Research code for Generative Engine Optimization | REJECT: `geo_functions.py` uses LLM prompts to rewrite source text (quotations, statistics, tone), which `AGENTS.md` forbids; "up to 40%" is self-reported; no commit for a year |
| [elmohq/elmo](https://github.com/elmohq/elmo) | 490 (topic page) | 2026-10-23 `cb6bf6e` | not shown | Self-hosted AI-visibility tracker; runs prompts "several times a day" via scraping providers and model APIs | REJECT: paid runs and a recurring schedule need owner approval. Noted: store cited URLs and grounding searches per answer; one answer per prompt is a sample |
| [GrowthBook/growthbook](https://github.com/GrowthBook/growthbook) | 8.5k | 2026-10-23 `7c856b5` | not shown | Feature flags and experimentation; stats engine with "SRM checks" | REJECT: needs an SDK, a data source and traffic; no Search Console export exists (ZERO-DATA), so no test can be powered |

Notes:
- Also read, not tabulated: axe-core (7.7k stars, `develop` 2026-10-21 `6b52b84`; engine behind Lighthouse's accessibility audits); robots-parser (168, MIT, 2026-10-08; RFC 9309 parser used by Lighthouse); schemata-validator (0 stars, MIT, 2026-10-22); structured-data-testing-tool (79, ISC); extruct (966, BSD-3-Clause); html-validate (GitHub page is a GitLab mirror, 19 stars).
- International SEO: no maintained standalone hreflang validator found (topic page top result 58 stars, last updated 2022; search returned hosted tools and agent skill definitions). The Lighthouse `hreflang` audit is the reference and is not applicable here (guard exists).
- Internal linking and topic clusters: the search found only WordPress plugins (Pillark, Supan Content, Relinka), none opened or rated. `lib.js` already has `clickDepth` and `pageRank`.
- Entity extraction: high-star topic results are general NLP libraries (DeepPavlov 7k, nlp.js 6.6k, spark-nlp 4.2k); none is usable zero-dependency here. YAKE is the only candidate.
- CRO for local service pages: no relevant repository (CRO topic page: marketingskills, excluded, and a 2019 repository; search returned agency blogs). Sources: [Hreflang Checker](https://swetrix.com/tools/hreflang-checker), [Pillark](https://cn.wordpress.org/plugins/pillark/), [service checklist](https://groverwebdesign.com/website-optimization/landing-page-conversion-checklist-service-businesses/).

## Instructions found in third-party files that were not followed

- unlighthouse README: "Using an AI agent? Get the unlighthouse Skill on skilld.dev" (not followed).
- open-seo README: `npx skills add every-app/open-seo --skill simple-issue-description` and links to set up its MCP server and agent skills (not followed; no OpenSEO tool was used for this note).
- open-seo `DATAFORSEO_API_KEY.md`: obtain and set an API key (not followed; no key requested).
- Install and run commands in the READMEs of Lighthouse, pySHACL, YAKE, schema-dts, html-proofer, GEO and others (not run).
- GEO `geo_functions.py` prompts telling a model to "change the text of the source" (read as data; not run).

## Not read

- axe-core rule definitions (conditions of `image-alt`, `link-name`, `html-has-lang`, `heading-order`); Lighthouse `html-lang-valid`; developer.chrome.com audit pages; the Lighthouse CI default run count; the Lighthouse version run by `treosh/lighthouse-ci-action@v12`.
- open-seo `multipage-checks.ts`, `lighthouse.ts`, `posthog.ts`, `dataforseoLighthousePayload.ts`.
- The ARD specification and its port; the GEO paper and GEO-Bench; the YAKE paper; licence names marked "not shown"; Pillark, Supan Content and Relinka repositories; contributor counts for every repository.
- No rendered counts: `_site` was not built, so M1 to M5 counts are unmeasured (source scans only).
