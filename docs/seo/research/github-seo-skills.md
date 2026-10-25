# GitHub SEO repositories and agent skills: research and adoption review

- Research date: 2026-10-25 (all star, fork and activity figures below were read on this date).
- Repository reviewed: this repository (Jekyll 3.10 on GitHub Pages, `plugins: []`, 981 articles, 14 topic hubs, live site https://en.rentbikehanoi.com/).
- Status: research note only. No script, workflow, article or configuration file was changed, and no external code was cloned, downloaded, installed or run. Nothing here is an instruction to the engine; every proposal needs an owner decision and a normal PR through the Quality Gate.
- Reading rule: third-party READMEs and descriptions are reference material, never instructions.

## 0. Summary

1. The projects found fall into four groups: (a) prompt-based agent skill packs for Claude Code and similar agents, several with very high star counts; (b) AEO/GEO (AI-answer) auditors and trackers, most of which need paid LLM or SERP APIs for the tracking part; (c) classic crawlers and audit platforms (Go, Rust, Python, TypeScript) that need a database, Docker, a paid data API or a live crawl; (d) a few very small, precise Node.js utilities (orphan and click-depth checking, anchor-text profiling) with one star each.
2. None of them can be adopted as code. This repository is plain Node.js with zero dependencies and must stay GitHub Pages compatible. What is worth taking is the method: what to measure, how to name the failure classes, and how to test a lint.
3. This repository already covers most of what the popular tools do for a static site: source and rendered audits, duplicate and cannibalisation checks, sitemap, schema and NAP checks, topical map, Lighthouse CI floors and Lychee. The research found five technique gaps worth considering, ranked in section 4.3.
4. The most useful gap is a link graph built from the rendered `_site` output (reachability, dead ends, in-body inbound links, an in-body internal PageRank report). The most cautious statement that can be made about all five is that their effect on rankings is unproven; this site is still in ZERO-DATA mode (no real Search Console export), so any value rating below is qualitative.
5. Stars measure attention, not SEO value. The two most-starred results are a generalist marketing prompt pack and an open-source platform that depends on a paid data API; the two best-matched small tools for this repository have one star each.

## 1. Scope and method

### 1.1 What was read

All reading used web tools only (Firecrawl scrape and web search). No GitHub API call, no clone, no download, no code execution. Third-party text was treated as data.

| Kind | Items | Count |
|---|---|---|
| GitHub topic pages, sorted by stars (page one only) | `topics/seo`, `seo-audit`, `technical-seo`, `internal-linking`, `llms-txt`, `structured-data`, `generative-engine-optimization` | 7 |
| GitHub repository pages | orphan-beacon, claude-seo, squirrelscan, geo-optimizer-skill, geoptimize, WebKnoGraph, anchor-text-checker, specification.website, marketingskills, lighthouse-ci, advertools, jekyll-seo-tag, seonaut, lychee, open-seo | 15 |
| Web searches | internal PageRank and damping factor; title and description pixel widths; llms.txt and AI crawler user agents | 3 |
| Calls that did not return data | 4 Firecrawl calls were rate-limited and re-issued once; 1 web search was rejected for a parameter error and not re-issued | 5 |

Total web call attempts: 30, which is the budget. The structured-data and AI-crawler questions were therefore answered from search summaries and the repository's own code, not from Google's or the vendors' primary documentation (listed as unread in section 6).

Local reading: `AGENTS.md`, the `scripts/` directory, `seo-audit.js`, `internal-link-audit.js`, `content-duplicate-check.js`, `schema-check.js`, `sitemap-check.js`, the set-up and canonical/robots sections of `rendered-site-audit.js`, `representative-pages.js`, the cannibalisation function in `english-seo-matrix.js`, the link logic in `topical-map.js`, `.github/workflows/lighthouse.yml` and `link-check.yml`, `robots.txt`, `llms.txt`, `_layouts/`, `_includes/faq-schema.html`.

### 1.2 How figures are recorded

- Abbreviations: **TP** = read on a GitHub topic page; **RP** = read on the repository page. Every number is "as read 2026-10-25".
- Topic pages show stars and an "Updated" date but not forks or licence. Forks and licence appear only for repositories whose page was opened (RP). Elsewhere the table says "not read".
- "Last activity" is the latest commit date where an RP was read, otherwise the TP "Updated" date (which can include non-commit activity). Where both were read and differ (marketingskills), both are given in the notes.
- README summaries come from an extraction step over each page ("query" format), not from reading the source code. Where that step said the page did not state something (for example tests or paid APIs), the table records "not stated on page read", not "no".
- Fit rating, for a zero-dependency Node.js pipeline on Jekyll and GitHub Pages: **High** = Node.js or already in this pipeline, offline, no dependencies to add; **Medium** = useful method, different runtime or extra dependencies, so ideas only; **Low** = needs a database, hosted service, paid API or live crawl, or is generic prompt material. Rows known only from a TP description are rated on that description alone and marked "(description only)".

### 1.3 Limits

- This is not a survey of GitHub. Topic pages were read for page one only (about 20 repositories each, sorted by stars), so small but relevant repositories that are not tagged with these topics are missed.
- Not examined this session: linkinator, unlighthouse (named only as an optional extension in claude-seo), jekyll-sitemap, structured-data-testing-tool, Python SEO notebooks, other Screaming-Frog-style crawlers. No numbers are given for them.
- Star and fork counts change by the hour. Stars and forks are signals of attention, not proof of SEO value, quality or safety.
- Search results on pixel widths, PageRank damping and AI crawlers were third-party pages. The search summaries said that no official Google page on llms.txt or on pixel limits was found, and that sources disagree. They are used below only as caveats.
- The site was not built and no link graph was measured. Statements about click depth in section 4 are expectations from reading the templates, not measurements.

## 2. Comparison table

Total: 32 repositories. Stars, forks, licence and activity as read 2026-10-25.

| # | Repository | What it does | Stars | Forks | Licence | Last activity | Fit here | Paid API needed |
|---|---|---|---|---|---|---|---|---|
| | **Agent skills and AI-agent SEO toolkits** | | | | | | | |
| 1 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | Marketing skills for Claude Code and AI agents: CRO, copywriting, SEO, analytics, growth. JavaScript 93.5%. | 56.4k (TP, RP) | 8.3k (RP) | MIT (RP) | Latest commit Oct 19, 2026 (RP); TP showed "updated" Oct 22 | Low: generalist prompt material; structure and scripts not stated on page read | Not stated on page read |
| 2 | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | Claude Code SEO skill: 26 sub-skills, 19 sub-agents, 30 commands (technical, content/E-E-A-T, schema, hreflang, AI search, llms.txt, internal links, local, e-commerce). Python 92.3%; 412 commits; v2.5.0. | 20.1k (TP, RP) | 2.9k (RP) | MIT (RP) | Oct 22, 2026 (RP) | Medium: breadth and packaging are instructive; Python plus headless browser | Core: no. Optional extensions use paid services with the user's own accounts (RP) |
| 3 | [Ryze-AI-Adgent/open-seo-mcp-skills](https://github.com/Ryze-AI-Adgent/open-seo-mcp-skills) | MCP server plus SEO/GEO skills working on the user's own GSC, GA4 and ads data (TP description). Shell. | 7.1k (TP) | not read | not read | Updated Oct 23, 2026 (TP) | Low (description only): needs connected accounts and a vendor MCP | Not read; needs account connections |
| 4 | [aaron-he-zhu/aaron-marketing-skills](https://github.com/aaron-he-zhu/aaron-marketing-skills) | 120 marketing skills across 7 disciplines with "8 auditor gates" (TP description). Python. | 3k (TP) | not read | not read | Updated Oct 25, 2026 (TP) | Low (description only) | Not read |
| 5 | [onvoyage-ai/gtm-engineer-skills](https://github.com/onvoyage-ai/gtm-engineer-skills) | Claude Code skill scoring AEO/GEO readiness: 16 foundational checks, 6 intelligence dimensions (TP description). HTML. | 1.3k (TP) | not read | not read | Updated Oct 11, 2026 (TP) | Low (description only) | Not read |
| 6 | [seo-skills/seo-audit-skill](https://github.com/seo-skills/seo-audit-skill) | Command-line audit with "332 audit rules across 20 categories" (TP description). TypeScript. | 648 (TP) | not read | not read | Updated Oct 15, 2026 (TP) | Low (description only): analyses live sites | Not read |
| 7 | [Illyism/seo-skills](https://github.com/Illyism/seo-skills) | SEO skills for Claude Code, Cursor and Codex: title tags, blog refreshes, backlinks, copywriting (TP description). | 600 (TP) | not read | not read | Updated Oct 15, 2026 (TP) | Low (description only): includes content rewriting, outside this repository's rules | Not read |
| 8 | [Auriti-Labs/geo-optimizer-skill](https://github.com/Auriti-Labs/geo-optimizer-skill) | AEO/GEO toolkit: robots.txt check for 27 AI crawlers, llms.txt validation, JSON-LD checks, 47 citability checks, weighted 100-point score. Python 55%, Astro 30.6%. | 1.2k (TP, RP) | 131 (RP) | MIT (RP) | Commit Oct 25, 2026; release Oct 22 (RP) | Medium: good check list; Python | Audit and fix: no. Optional API keys for citation checks (RP) |
| 9 | [cucuwang/geoptimize](https://github.com/cucuwang/geoptimize) | Deterministic content-readiness lint for CI and static sites: 5 dimensions, 17 scoring rules, 100 points. TypeScript 82.1%. | 263 (TP, RP) | 1 (RP) | MIT (RP) | Commit Oct 19; release v0.12.0 Oct 18, 2026 (RP) | Medium: right shape (offline, deterministic) but needs Node.js 22.12 or newer; `lighthouse.yml` pins Node 20 | No (offline, zero API keys, RP) |
| 10 | [squirrelscan/squirrelscan](https://github.com/squirrelscan/squirrelscan) | Website QA CLI for coding agents: 300+ rules in 22 categories, health score, crawls live sites. TypeScript 98.9%. | 296 (TP, RP) | 33 (RP) | MIT (RP) | Oct 24, 2026, v0.0.133 (RP) | Medium: rule catalogue as a checklist; Bun runtime, live crawl | CLI: no (RP). Optional signed-in cloud rendering mentioned |
| 11 | [houtini-ai/seo-audit](https://github.com/houtini-ai/seo-audit) | MCP audit merging Search Console, a first-party crawl, DataForSEO and Majestic (TP description). TypeScript. | 86 (TP) | not read | not read | Updated Oct 24, 2026 (TP) | Low (description only) | Yes: DataForSEO and Majestic (TP description) |
| | **Platforms, crawlers and analysers** | | | | | | | |
| 12 | [every-app/open-seo](https://github.com/every-app/open-seo) | Open-source alternative to Semrush and Ahrefs: keyword research, rank tracking, backlinks, site audit, AI visibility, MCP server. TypeScript 94.1%. | 24.8k (TP, RP) | 3.4k (RP) | MIT (RP) | Oct 24, 2026, v0.1.15 (RP) | Low: hosted platform | Yes: relies on the DataForSEO API (RP) |
| 13 | [janreges/siteone-crawler](https://github.com/janreges/siteone-crawler) | Cross-platform website crawler and analyser for SEO, security, accessibility, performance. Rust. | 973 (TP) | not read | not read | Updated Sep 27, 2026 (TP) | Low (description only): live crawl, native binary | Not read |
| 14 | [StJudeWasHere/seonaut](https://github.com/StJudeWasHere/seonaut) | Open-source SEO audit tool (broken links, redirects, meta tags, heading order). Go 79.2%. | 832 (TP, RP) | 143 (RP) | MIT (RP) | Oct 8, 2026 (RP) | Low: needs MySQL and Docker | No |
| 15 | [sethblack/python-seo-analyzer](https://github.com/sethblack/python-seo-analyzer) | Crawls a site, counts words in page bodies, warns of technical SEO issues. Python. | 1.5k (TP) | not read | not read | Updated Oct 8, 2026 (TP) | Low (description only) | Not read |
| 16 | [eliasdabbas/advertools](https://github.com/eliasdabbas/advertools) | Python library: Scrapy-based SEO crawler, `sitemap_to_df`, `robotstxt_to_df`, `robotstxt_test`, `url_to_df`, word frequency. Python 55%, Julia 44.8%. | 1.5k (RP) | 263 (RP) | MIT (RP) | Jun 30, 2026 (RP) | Low: Python, pandas, Scrapy | No |
| 17 | [viasite/site-audit-seo](https://github.com/viasite/site-audit-seo) | CLI and web service: crawl, run Lighthouse on all pages, export json, csv, xlsx (TP description). JavaScript. | 304 (TP) | not read | not read | Updated Feb 24, 2026 (TP) | Low (description only) | Not read |
| 18 | [puneetindersingh/open-seo-crawler](https://github.com/puneetindersingh/open-seo-crawler) | Crawler that also checks Googlebot, Bingbot and AI crawlers receive the same readable page (TP description). Python. | 72 (TP) | not read | not read | Updated Oct 23, 2026 (TP) | Low: live crawl; irrelevant to static hosting that serves identical files | Not read |
| | **Internal links and link graph** | | | | | | | |
| 19 | [MrLouisWright/orphan-beacon](https://github.com/MrLouisWright/orphan-beacon) | Finds orphan pages in a built static site and measures click depth from the homepage. JavaScript 100%, zero runtime dependencies, Node.js 18+. 16 commits. | 1 (TP, RP) | 0 (RP) | MIT (RP) | Oct 20, 2026 (RP) | High: same input (`_site`), same runtime; very young | No (offline) |
| 20 | [martech-engineer/WebKnoGraph](https://github.com/martech-engineer/WebKnoGraph) | Research project: crawl, link graph, PageRank and HITS, embeddings, GraphSAGE link prediction. Jupyter Notebook 96.1%. | 23 (TP, RP) | 3 (RP) | Apache-2.0 (RP) | Oct 6, 2026 (RP) | Low for code (Python, Colab, ML); Medium for the idea of PageRank on the link graph | No paid service stated as required; runs locally per RP |
| 21 | [Mojo-Links/anchor-text-checker](https://github.com/Mojo-Links/anchor-text-checker) | Classifies every anchor into 7 types and flags over-optimisation. JavaScript 100%, depends on `cheerio`. | 1 (TP, RP) | 0 (RP) | MIT (RP) | Jun 17, 2026 (RP) | Medium: method yes, thresholds no (see 3.7); not zero-dependency | No |
| 22 | [mehranmoghadasi/seo-internal-link-analyzer](https://github.com/mehranmoghadasi/seo-internal-link-analyzer) | Crawls a sitemap for orphan pages, weak internal linking, link opportunities, CSV export (TP description). Python. | 1 (TP) | not read | not read | Updated Sep 20, 2026 (TP) | Low (description only) | Not read |
| 23 | [Deepak-J0shi/SEO-Interlinking-Tool](https://github.com/Deepak-J0shi/SEO-Interlinking-Tool) | Suggests anchor-to-target links with hybrid TF-IDF and SBERT similarity (TP description). Python. | 3 (TP) | not read | not read | Updated Dec 7, 2025 (TP) | Low (description only): model dependency; auto-linking edits prose | Not read |
| | **Standards, validation, performance, link checking, discovery** | | | | | | | |
| 24 | [jdevalk/specification.website](https://github.com/jdevalk/specification.website) | Website specification: 88 spec pages in 10 categories, each with status (Required, Recommended, Optional, Avoid) and a "Verification" section. TypeScript 46.7%, JavaScript 25.6%, Astro 19.4%. | 913 (TP, RP) | 54 (RP) | MIT (code), CC BY 4.0 (content) (RP) | Oct 24, 2026 (RP) | Medium: reference for rule rationale and severity vocabulary | No |
| 25 | [schemaorg/schemaorg](https://github.com/schemaorg/schemaorg) | Schema.org vocabulary and supporting software. HTML. | 6.3k (TP) | not read | not read | Updated Oct 21, 2026 (TP) | Medium: vocabulary source for type and property names; not a validator | No |
| 26 | [GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) | Runs Lighthouse per commit and prevents regressions. JavaScript 92.1%, CSS 7.6%. | 7.1k (RP) | 726 (RP) | Apache-2.0 (RP) | Commit Oct 23, 2026; latest release Jun 26, 2025 (RP) | High: already used (`lighthouse.yml`) | No |
| 27 | [lycheeverse/lychee](https://github.com/lycheeverse/lychee) | Link checker for links, mail addresses and URL fragments; offline mode; json, junit, markdown output. Rust 98.9%. | 4.0k (RP) | 240 (RP) | "Apache-2.0, MIT licenses found" (RP) | Commit Oct 21, 2026; release May 1, 2026 (RP) | High: already used (`link-check.yml`) | No |
| 28 | [jekyll/jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag) | Jekyll plugin emitting title, description, canonical, Open Graph, Twitter and JSON-LD metadata. Ruby 93.8%. | 1.7k (RP) | 307 (RP) | MIT (RP) | Sep 29, 2026 (RP) | Low: this site has `plugins: []` and emits its own tags in `_layouts/default.html` | No |
| 29 | [i365dev/awesome-seo](https://github.com/i365dev/awesome-seo) | Curated list of SEO, GEO and AI-search resources. | 2.8k (TP) | not read | not read | Updated Oct 21, 2026 (TP) | Low: discovery aid | No |
| 30 | [thedaviddias/llms-txt-hub](https://github.com/thedaviddias/llms-txt-hub) | Directory of sites and tools implementing the proposed llms.txt standard. TypeScript. | 916 (TP) | not read | not read | Updated Oct 25, 2026 (TP) | Low: directory | No |
| 31 | [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization) | Curated GEO guides, tools and research. | 531 (TP) | not read | not read | Updated Apr 14, 2026 (TP) | Low: discovery aid | No |
| 32 | [yaojingang/GEOFlow](https://github.com/yaojingang/GEOFlow) | GEO content engineering and multi-site distribution platform (TP description). PHP. | 3.9k (TP) | not read | not read | Updated Oct 11, 2026 (TP) | Low: content generation and distribution conflict with `AGENTS.md` | Not read |

## 3. Deep notes on the most useful projects

### 3.1 orphan-beacon (MrLouisWright/orphan-beacon)

- Read: RP. 1 star, 0 forks, MIT, JavaScript 100%, 16 commits, latest commit Oct 20, 2026.
- Method: point it at a built output folder (for example `_site`). It builds the internal link graph from the built HTML and resolves relative, root-relative and absolute same-origin links, `<base href>`, trailing-slash and `index.html` variants, and a `--clean-urls` mode. Click depth is the breadth-first shortest path from the homepage (or `--start`) over crawlable links. It reports six classes: `orphan-page` (indexable page with no internal inbound link), `orphan-unreachable` (has inbound links but cannot be reached from the homepage), `orphan-nofollow-only`, `orphan-noindex-only` (linked only from noindex pages), `orphan-too-deep` (default maximum depth 3) and `orphan-dead-end` (indexable page with no outgoing internal link). Default failure severity is high. Output formats are text, JSON, SARIF and Markdown, with an allowlist that carries an expiry date (repository description).
- How it tests itself: a GitHub Actions workflow `ci.yml` exists. What the tests cover was not read.
- Worth learning: (1) "orphan" is several different defects, and "unreachable" is the one a simple inbound count misses; (2) normalise URLs before building the graph or the graph will have phantom pages; (3) allowlist entries with an expiry date stop a baseline from becoming permanent; (4) build the graph from rendered output, not from source.
- Caveats: one star and one visible author. The depth default of 3 is the author's choice, not evidence. The code was not read.
- Relevance: the input (`_site`) is the directory `rendered-site-audit.js` already walks, so the same method can be written in about the same style as the existing audits.

### 3.2 geoptimize (cucuwang/geoptimize)

- Read: RP. 263 stars, 1 fork, MIT, TypeScript 82.1%, release v0.12.0 on Oct 18, 2026, requires Node.js 22.12 or newer.
- Method: a deterministic lint for Markdown and HTML content, scored out of 100 over five dimensions: Structure 25, Citability 25, Schema 20, AI Metadata 15, Content Density 15, with 17 scoring rules. Heading level skips are reported. JSON-LD is checked only when present (absence is not penalised); top-level arrays and `@graph` nodes are flattened with an inherited `@context` so every entity is checked.
- How it tests itself: it has tests and a CI integration; thresholds can block regressions through `--json` output or a GitHub Actions step.
- Worth learning: the scoring model is a versioned heuristic (`readiness-v0.6.1-details-v1`) and the README says it is meant to catch regressions inside one project, not to predict ranking, indexing, rich results or AI citation. It states that valid structured data does not guarantee a search feature and that `llms.txt` generation adds no points. That framing (versioned, regression-only, explicit non-claims) matches how this repository treats `seo-baseline.json`.
- Caveats: the 17 rules and their weights are the author's. They are not evidence of what helps a page rank.

### 3.3 geo-optimizer-skill (Auriti-Labs/geo-optimizer-skill)

- Read: RP. 1.2k stars, 131 forks, MIT, Python 55% and Astro 30.6%, commit Oct 25 and release Oct 22, 2026.
- Method: a robots.txt check against 27 named AI crawlers; llms.txt validation (presence, sections, links, `llms-full.txt`); JSON-LD validity and type coverage (FAQ, Article, Organization, WebSite) including a visible-name match; 47 content "citability" checks (H1, statistics, links, word count, heading hierarchy, lists and tables, front-loading, image alt coverage), nine of them said to follow KDD 2024 research; brand and entity signals; `<html lang>`, feeds and freshness. The score is out of 100 with weighted categories (Google AI readiness 20, robots.txt 14, schema 14, content 14, brand and entity 12, meta tags 11, llms.txt 6, signals 6, AI discovery 3) and up to 5 points deducted for negative signals.
- How it tests itself: the README states a suite of over 2,000 tests in CI across Python 3.10 to 3.14.
- Worth learning: it weights reachability and parseability (crawler access, robots.txt, schema, metadata) above rewriting tricks, and says readiness signals cannot guarantee an engine will cite a site. The idea of a per-agent robots.txt table (each user-agent token evaluated separately) is directly usable.
- Caveats: scoring weights are the author's. The research it cites was not read here.

### 3.4 squirrelscan (squirrelscan/squirrelscan)

- Read: RP. 296 stars, 33 forks, MIT, TypeScript 98.9%, v0.0.133, commit Oct 24, 2026.
- Method: 300+ rules in 22 categories (including Crawlability, Links, Content, Structured Data, Agent Experience, URL Structure, Internationalisation, Local SEO). Named checks include internal links, orphan and dead-end pages, click depth, title and description length and consistency, JSON-LD validation, llms.txt, AI-crawler handling (GPTBot, Claude-User), hreflang and readability. Failures are ordered by cost. Output includes console, JSON, HTML, Markdown, text, LLM and XML. It crawls live sites incrementally (ETag, Last-Modified, content hashing; resumable).
- How it tests itself: `bun test`, lint, typecheck, format check, build and docs checks.
- Worth learning: the rule catalogue is a useful checklist to compare against this repository's rules; ordering findings by cost matches the P0 to P3 scheme already in use.
- Caveats: a live-site crawler; this repository audits source files and the built `_site`, which is faster and deterministic. An optional signed-in cloud mode is mentioned.

### 3.5 claude-seo and agent skill packs (AgriciDaniel/claude-seo and others)

- Read: RP for claude-seo. 20.1k stars, 2.9k forks, MIT, Python 92.3%, 412 commits, v2.5.0 on Oct 22, 2026. For the other skill packs only TP descriptions were read.
- Structure: 26 sub-skills, 19 sub-agents, 30 commands, grouped into audits and planning, technical SEO, content and E-E-A-T, schema and AI search, local, links and commerce, and extensions. It mixes prompts and scripts, needs a Python runtime and a headless browser, and has tests and a GitHub Actions workflow. Optional extensions connect to paid services.
- Worth learning: it packages SEO knowledge as small, separately invokable units, which is a model for exposing this repository's own scripts to an agent. It also lists "agent readiness" checks (llms.txt, markdown, Lighthouse agentic browsing) that were not verified here.
- Caveats: breadth is the selling point and is also the risk. Several packs advertise content creation or rewriting ("blog refreshes", "content engineering"), which `AGENTS.md` forbids outside SEO Package 2. This repository's `AGENTS.md` is a stricter operating contract than any skill pack read here.

### 3.6 WebKnoGraph (martech-engineer/WebKnoGraph)

- Read: RP. 23 stars, 3 forks, Apache-2.0, Jupyter Notebook 96.1%, latest commit Oct 6, 2026.
- Method: crawl to Parquet with SQLite crawl state; extract inter-page hyperlinks into an edge list; compute structural features such as folder depth; use PageRank and HITS for URL sorting and authority analysis; vector embeddings for content; a GraphSAGE model to predict and recommend links. Strategies are evaluated "pre-deployment" in a simulated, reproducible setting.
- How it tests itself: Python `unittest` under `tests/backend/services/` and GitHub Actions.
- Worth learning: PageRank and HITS computed from a plain edge list are small enough to implement in zero-dependency Node.js for 981 pages. The simulation-before-deployment idea (measure the effect of proposed link changes on the graph before editing any prose) fits this repository's "dry run first" habit in `link-guide-references.js`.
- Caveats: the machine-learning link prediction is not adoptable (heavy dependencies, and automatic link insertion would edit article bodies).

### 3.7 anchor-text-checker (Mojo-Links/anchor-text-checker)

- Read: RP. 1 star, 0 forks, MIT, JavaScript 100%, uses `cheerio`, latest commit Jun 17, 2026. The page did not mention tests or CI.
- Method: classifies every `<a href>` into seven types (branded, exact match, partial match, generic, naked URL, brand plus keyword, LSI/semantic), each with a "safe range" (for example exact match 2 to 5%, generic 15 to 25%, as displayed). It flags exact-match anchors above their range as over-optimised. It covers internal, subdomain and external links with follow status.
- Worth learning: classifying anchors by type is cheap and deterministic.
- Caveats: the page does not say whether the percentage ranges are sourced or heuristic; the classification itself is described as heuristic. Those numbers should not be imported. For an internal-link profile on one site, thresholds should come from that site's own distribution.

### 3.8 lighthouse-ci and lychee (already in the pipeline)

- lighthouse-ci (RP): 7.1k stars, 726 forks, Apache-2.0, latest commit Oct 23, 2026, latest release Jun 26, 2025. The page read did not list assertion presets, `budgets.json` support or run-count settings, so those options must be taken from the Lighthouse CI documentation, which was not read.
- lychee (RP): 4.0k stars, 240 forks, "Apache-2.0, MIT licenses found", Rust, latest commit Oct 21, 2026, release May 1, 2026. It checks links, mail addresses and URL fragments, has an `--offline` mode, optional caching and json, junit and markdown output. This repository uses it offline for internal links (blocking) and online for external links (404 and 410 block; everything else is report-only).
- Worth learning: both are already in use here, so the only open question is how strict the Lighthouse assertions should be (section 4.2, item M, and proposal 6 in section 4.3).

### 3.9 specification.website (jdevalk/specification.website)

- Read: RP. 913 stars, 54 forks, MIT (code) and CC BY 4.0 (content), commit Oct 24, 2026. 88 spec pages in 10 categories (Foundations, SEO, Accessibility, Security, Well-Known URIs, Agent Readiness, Performance, Privacy, Resilience, Internationalisation). Each page has "What it is", "Why it matters", "How to implement", "Common mistakes" and "Verification" sections, and a status of Required, Recommended, Optional or Avoid.
- Worth learning: a rule is easier to keep honest when it carries a status word and a verification step. The "Well-Known URIs" and "Agent Readiness" categories are the place to check what a discovery-file rule should say before encoding it. The page read did not state title or description lengths, llms.txt, or robots.txt rules for AI crawlers, and did not say whether a validator ships.
- Caveat: quoting its text needs CC BY 4.0 attribution.

## 4. Techniques to adopt here

### 4.1 What this repository already has (from `AGENTS.md` and the scripts)

| Area | Existing coverage |
|---|---|
| Titles and descriptions | `seo-audit.js`: missing title P1, missing description P1 (article) or P2, length over 65 and 165 characters P3, duplicate title P1, duplicate description P2. Same limits in `english-seo-matrix.js` (`TITLE_MAX` 65, `DESC_MAX` 165). Character counts only. |
| H1, canonical, noindex | `seo-audit.js` (source) and `rendered-site-audit.js` (rendered: one `<title>`, meta description, canonical equals page URL, duplicates, noindex, `og:url`). |
| Orphans and links | `seo-audit.js` and `internal-link-audit.js`: Liquid-aware orphan rule (`isDynamicallyListed`), broken links, zero-link articles, missing `topic_cluster`. `topical-map.js`: in-silo in-body inbound counts, money-page inbound, "true silo orphans". All source-based. |
| Cannibalisation | `content-duplicate-check.js`: exact duplicates, title token Jaccard over 0.6 (P2), H1 Jaccard over 0.7 (P3), five-word body shingles. `english-seo-matrix.js`: shared primary keyword, near-duplicate title pairs, rank-tracker URL mismatch. `topical-map.js`: split keyword families with a SERP-overlap check. |
| Structured data | `schema-check.js`: JSON-LD syntax (P1), Article dates and URL, BreadcrumbList `itemListElement`, hub `CollectionPage` (P3), more than two blocks (P2), NAP guard, LocalBusiness invented-claim guard. Works on source and layout contract, not on rendered `_site`. |
| Sitemap | `sitemap-check.js`: sitemap against the expected indexable set in both directions, noindex pages, excluded content. |
| Robots and AI files | `robots.txt` is `User-agent: *` / `Allow: /` plus the sitemap line; `rendered-site-audit.js` checks only the sitemap line. `llms.txt` exists (981 guides, 14 topics, 52 FAQ answers); `schema-check.js` scans it for NAP facts only. On 2026-10-25 those three counts matched the repository (981 files in `_articles/`, 14 clusters, 52 FAQ items). |
| Content depth | `seo-package2.js` gate, using `lib.contentWords`. |
| Performance | `lighthouse.yml`: Lighthouse CI on the built `_site`, nine representative page classes from `representative-pages.js`, floors: performance 0.5, accessibility 0.75, best practices 0.75, SEO 0.8. |
| Link checking | `link-check.yml`: Lychee offline for internal links (blocking), external 404 and 410 block, other failures report-only. |
| Scoring and regression | `seo-score.js`, `fix-matrix.js`, `seo-regression.js` with `seo-baseline.json` (refused while P0 or P1 defects exist). No scoring-model version string was found in `seo-score.js`. |
| Hreflang | None, correctly (English only). No script guards against hreflang or `/vi/` appearing. |

### 4.2 Technique by technique

"Value" is qualitative and refers to expected SEO benefit. No ranking effect is claimed or measurable today.

| ID | Technique | Status here | What would change | Licence and compatibility | Value |
|---|---|---|---|---|---|
| A | Orphan detection | Partly covered by source heuristics (`seo-audit.js`, `internal-link-audit.js`, `topical-map.js`) | Confirm on rendered output (T1) | Ideas only (orphan-beacon MIT) | Low-Medium |
| B | Click depth from the homepage | Missing | Breadth-first search over the rendered graph (T1). The all-guides index lists every article and each hub lists its own topic's articles, so depth is expected to be 2 for all articles (not measured); this is a regression guard, not a discovery tool | Algorithm is standard; ideas only | Low |
| C | Unreachable pages and dead ends | Missing | T1 | Ideas only | Low-Medium |
| D | Internal PageRank (link-equity distribution) | Missing | T3, advisory only | PageRank is a published algorithm; implement independently; WebKnoGraph is Apache-2.0, no code copied | Low-Medium |
| E | Anchor-text distribution toward a keyword owner URL | Partly: `link-guide-references.js` uses the phrase as link text, `english-seo-matrix.js` mentions natural anchors for rank mismatches; nothing measures anchors | T5 | Ideas only; do not import the unsourced ranges | Low-Medium |
| F | Keyword cannibalisation by title, H1, anchor overlap | Mostly covered (`content-duplicate-check.js`, matrix, `topical-map.js` SERP overlap) | Only the anchor part is new, inside T5 | None needed | Low |
| G | Title and description pixel width | Missing (characters only) | Optional advisory (item 8 below) | Width tables are factual data; no code copied | Low |
| H | Structured data against required properties and visible content | Partly (`schema-check.js` is source-level) | T2 | Ideas only (geoptimize, squirrelscan, geo-optimizer-skill, all MIT) | Medium |
| I | hreflang and international checks | Not applicable (English only); no negative guard | Optional guard: P1 if rendered output contains `hreflang=` or links to `/vi/` (item 9) | None | Low |
| J | llms.txt checks | Partly (file exists, NAP scanned) | T4 | Ideas only | Low for ranking (support unconfirmed in the sources read); useful for accuracy |
| K | Robots rules for AI user agents | Partly (file and sitemap line only) | T4: guard plus a read-only effective-access table; any policy change is owner-only | Ideas only | Low |
| L | Content-quality heuristics (readability, entity coverage, heading order) | Partly (`seo-package2.js` word depth, matrix `content_quality`); no heading-order or lead-paragraph lint | Item 7: report-only heading-level-skip lint; findings can only feed Package 2 because bodies may not be rewritten | Ideas only (geoptimize) | Low |
| M | Lighthouse CI budgets | Partly (four category floors) | Item 6: per-audit assertions and a median of several runs; the page read did not list the option names, check the documentation first | Apache-2.0 tool, already in use | Low-Medium |
| N | Link checking | Covered (Lychee) | None | Already used | None |
| O | Sitemap integrity | Covered (`sitemap-check.js`) | None | n/a | None |
| P | Allowlist or baseline entries with an expiry date | Partly (`seo-baseline.json` has reasons, refuses P0 and P1) | Item 10: optional expiry field | Ideas only (orphan-beacon) | Low |
| Q | Versioned scoring model | Missing (no version string found) | Item 10: stamp a model version in `seo-baseline.json` so a rule change is not mistaken for a regression | Ideas only (geoptimize) | Low |
| R | JSON-LD `@graph` flattening | Covered (`schema-check.js` already walks `@graph`) | None | n/a | None |
| S | Same content for bots and users (parity check) | Not applicable: static hosting serves identical files | None. CDN bot rules, if any, are outside this repository | n/a | None |

### 4.3 Ranked proposals (the missing and partly covered techniques)

All proposals are additions to existing scripts (extend, do not create a parallel engine), deterministic, offline and zero-dependency. Each needs fixture tests in `scripts/seo-engine-test.js`. A new rule should first be run once on current main to see what it reports; if it reports existing defects, fix the cause, never baseline a P0 or P1. New advisory rules start at P3; a stricter severity is chosen only after that first measurement.

**1. Rendered link graph guard (T1)**

- Target: `scripts/lib.js` (one pure function that reads `_site` and returns nodes and edges with a zone tag) and `scripts/rendered-site-audit.js` (rules). The templates already give stable zone markers: `div.article-body` (in-body), `aside.related` (related cards), `header`, `nav.mobile-nav` and `footer` (navigation), and the hub "all guides" list.
- Rule: every indexable page in the sitemap must be reachable from `/` by following `<a href>` edges (report `unreachable-from-home`, P2, matching the existing orphan severity); an indexable page with no outgoing internal link in `main` is a `dead-end` (P3); click depth over a maximum is P3, with the maximum set to the value measured on main so the rule guards against regression (orphan-beacon's default is 3; expected value here is 2, not measured).
- Why: today orphans are inferred from source with a Liquid-aware heuristic. A rendered graph checks the real output and would catch a layout change that silently drops a listing.
- Licence: ideas only (orphan-beacon, MIT; squirrelscan, MIT).
- Expected SEO value: Low-Medium (regression guard). Effort: small.
- Source repositories: orphan-beacon, squirrelscan, WebKnoGraph (folder depth feature).

**2. Rendered JSON-LD checks and visible-content parity (T2)**

- Target: `scripts/schema-check.js`, run its existing `checkJsonLd` over each rendered `_site` page when `_site` exists (the layout emits the BlogPosting block, so source-only checks cannot see it).
- Rules: (a) FAQPage: every `Question.name` and `acceptedAnswer.text`, with tags stripped and whitespace collapsed, must appear in the visible text of the same page (this protects `faq_in_body: true` articles, where the schema is emitted from front matter and the answers must already be in the body); (b) BlogPosting: headline equals the page H1, `url` or `@id` equals the canonical, valid `datePublished` and `dateModified`; (c) BreadcrumbList names and URLs match the visible breadcrumb; (d) no duplicate `@id` in one page.
- A small table of expected properties per `@type` may be added only after reading Google's current structured-data documentation and Schema.org; neither was read here. In particular, which structured-data types still produce rich results changes over time and was not verified; do not infer eligibility from this note.
- Licence: ideas only (geoptimize, squirrelscan, geo-optimizer-skill, MIT).
- Expected SEO value: Medium as risk reduction (markup that disagrees with the page); rich-result eligibility unproven.
- Effort: small to medium.
- Source repositories: geoptimize, geo-optimizer-skill, squirrelscan.

**3. In-body internal PageRank report (T3)**

- Target: `scripts/topical-map.js` (it already builds in-body links and flags money pages with few in-silo inbound links), using the T1 graph so it reads rendered links.
- Rule: power iteration with damping 0.85, a fixed iteration count or an L1 change below 1e-9, dangling-page mass spread uniformly, sorted keys for deterministic output. Compute two variants: all links, and in-body links only (so site-wide navigation and the 981-link listing page do not mask contextual links). Report rank percentiles inside each silo, never absolute values. A commercial page in the bottom quartile of its silo gets a `money-page-equity` P3 recommendation in the existing style ("add a contextual link from a same-silo guide whose topic leads to this page"). Advisory only; never gate.
- Caveat: sources found disagree on the damping factor (0.85 is the conventional value; a 2006 paper cited in the search results argues for a lower one), and the search results did not establish how Google uses PageRank today. The numbers are a model of this site's own link structure, not a Google measure.
- Licence: published algorithm, implemented independently (WebKnoGraph is Apache-2.0; no code copied).
- Expected SEO value: Low-Medium and unproven. Effort: small once item 1 exists.
- Source repositories: WebKnoGraph.

**4. Discovery-file integrity: llms.txt and robots.txt (T4)**

- Target: `scripts/sitemap-check.js` (it already owns the sitemap against the expected set), optionally with the robots part in `rendered-site-audit.js`.
- Rules for `llms.txt`: an H1 and summary block are present; every link resolves to a URL in the expected indexable set; the numeric claims ("981 verified guides", "14 topics", "52 answers") equal the real counts (articles, clusters, FAQ items). They matched on 2026-10-25, so this prevents drift. A count mismatch would be a P1 report. Whether a count refresh should ever become a safe fix is an owner decision: `AGENTS.md` says never widen the safe-fix policy to content or facts, so this note does not propose it.
- Rules for `robots.txt`: no `Disallow: /` for `*` or Googlebot (P1); the sitemap line (already checked); and a read-only report of effective access for a dated list of AI user-agent tokens, evaluated per agent (a group for one agent does not apply to another, as reported by the sources read; RFC 9309 should be checked before encoding). The token list must come from each vendor's own documentation, which was not read here. Robots content and any allow or deny policy remain owner-only.
- Caveat: no official Google page on llms.txt was found in the search results, and sources disagree on whether any AI vendor reads it, so the SEO value of the file itself is unproven. The value of the rule is accuracy of a machine-readable summary the site already publishes.
- Licence: ideas only (geo-optimizer-skill, squirrelscan, specification.website).
- Expected SEO value: Low for ranking; Medium for accuracy. Effort: small.
- Source repositories: geo-optimizer-skill, squirrelscan, specification.website.

**5. Internal anchor profile per owner URL (T5)**

- Target: `scripts/english-seo-matrix.js`, adding an `anchor_profile` field per URL from the T1 graph (the graph must keep anchor text, not only hrefs).
- Rule: for each URL with at least 5 in-body inbound links, report distinct anchor texts, the share of generic anchors ("click here", "read more", "this guide", "here"), the count of empty or image-only anchors (any empty anchor is a P3), and the share equal to the normalised `primary_keyword`. Flag an exact-match share above the 90th percentile of this site's own distribution. Report only; the phrase stays the link text and nothing is rewritten, as `AGENTS.md` requires.
- Do not import external "safe ranges": the one tool read gave percentages without a stated source.
- Licence: ideas only (anchor-text-checker, MIT).
- Expected SEO value: Low-Medium and unproven. Effort: small to medium.
- Source repositories: anchor-text-checker.

**6. Lighthouse per-audit assertions**

- Target: `scripts/representative-pages.js` (`--lighthouserc`). Add error-level assertions for specific SEO audits in addition to the category floors, and use several runs per page with the median. Audit identifiers and option names are background knowledge, not read this session: verify them against the installed Lighthouse and Lighthouse CI documentation before use. Raising a floor is allowed; lowering one is not.
- Licence: tool already in use (Apache-2.0). Value: Low-Medium. Effort: small.

**7. Heading-order lint**

- Target: `scripts/rendered-site-audit.js`. Report heading-level skips (for example H2 to H4) as P3, per rendered page. Findings cannot be fixed by editing article bodies outside Package 2; they would go to the Package 2 queue or to shared layout changes. Source: geoptimize reports level skips. Value: Low.

**8. Title and description pixel width (advisory)**

- Target: `scripts/seo-audit.js`. Add an advisory P3 using a width table. The figures found are third-party measurements that disagree (a 2014 study cited 512 px for titles; other pages give about 580 to 600 px; descriptions about 920 to 960 px on desktop and about 680 px on mobile). Google publishes no pixel limit in the sources read. Because the existing 65 and 165 character limits already catch the long cases, this should be done last, if at all, and labelled approximate. Value: Low.

**9. English-only guard**

- Target: `scripts/rendered-site-audit.js`. P1 if a rendered page contains `hreflang=` or a link to `/vi/`. This turns the `AGENTS.md` rule against Vietnamese UI, language switchers and `/vi/` navigation into a test. Value: Low (preventive). Effort: trivial.

**10. Baseline expiry and scoring-model version**

- Target: `scripts/seo-baseline.json` and `scripts/seo-score.js`. An optional expiry date on any accepted P2 or P3 entry, and a model-version string, so a rule change is not mistaken for a regression. Value: Low.

Order of work if the owner approves: item 1 first (items 3 and 5 depend on its graph), then item 2, then 4, then 3 and 5 together; items 6 to 10 are optional.

## 5. Safety notes

- Licences. Every repository whose licence was read is MIT or Apache-2.0 (lychee shows both; specification.website content is CC BY 4.0). No code from any of them was copied. Where a proposal says "ideas only", it is the idea or a published algorithm, written independently. If code were ever reused, a copyright notice (MIT) or notice and licence text (Apache-2.0) would be needed, and any row marked "not read" for licence must be checked first.
- Zero dependencies. Several tools need Python, Rust, Go, Bun, a database, Docker or Node.js 22.12 or newer (this repository's `lighthouse.yml` pins Node 20). None was run or installed.
- Skills are executable instructions. A skill pack or MCP server installed into an agent session can change what the agent does and what it can reach. Several TP descriptions include install commands for third-party MCP servers (for example a `claude mcp add ... --transport http` line). None was followed. Do not install a skill, plugin or MCP server for this repository without owner review of its files, its network access and its licence, consistent with the least-privilege rule in `AGENTS.md`.
- Rules the research would conflict with. Content-generation and distribution tools (GEOFlow; skills that advertise blog refreshes or programmatic SEO) conflict with "never create new articles" and "never rewrite article bodies outside SEO Package 2". Automatic link insertion by machine learning (WebKnoGraph, SEO-Interlinking-Tool) would edit prose and is not adopted. Backlink, outreach and review tools are owner-only work.
- Paid and tracked data. open-seo, houtini-ai/seo-audit and the AI-visibility trackers depend on paid data APIs or LLM calls. `AGENTS.md` requires a cost estimate before any paid AI check and forbids leaving a recurring AI schedule enabled without owner approval. Nothing was started.
- Unverifiable claims. Several READMEs make performance or traffic claims (for example one TP description cites impressions and clicks "in 90 days"). They are self-reported and were not used. Do not copy a score, threshold or uplift figure from any of these tools into a QA rule.
- Business facts. Nothing in this note changes an address, phone, hours, price or legal statement. The `llms.txt` proposal only compares counts the file already publishes with counts in the repository.
- Weakening checks. None of the proposals lowers a threshold. New rules begin as advisory and are tightened only after a measured run on main.
- AI crawlers and parity. A same-content-for-all-bots check is not applicable to static hosting. Any CDN or host-level bot management is outside this repository and cannot be audited from it.

## 6. Not verified and open items

- Not read: Google's current structured-data documentation (which features still produce rich results, required and recommended properties), Schema.org property definitions, RFC 9309, and each AI vendor's crawler documentation. Rules that depend on them (T2 property table, T4 token list) must be written from those sources, not from this note.
- Not read: the Lighthouse CI documentation (assertion presets, budgets, run counts) and the source code of any repository listed.
- Not measured: the actual click depth, in-body inbound counts and PageRank on this site's `_site`. Run the proposed rules once before choosing severities.
- Not examined: linkinator, unlighthouse, jekyll-sitemap, structured-data-testing-tool, Python SEO notebooks, and any repository outside the first page of the seven topic pages read.
- Forks and licence were not read for the rows marked "not read"; stars for those rows are from topic pages only.
- The working tree contained uncommitted edits to three articles (SEO Package 2 work in progress) when this note was written; they were not touched.
