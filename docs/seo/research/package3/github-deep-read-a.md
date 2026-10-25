# GitHub deep read A: marketingskills, claude-seo, open-seo-mcp-skills

- Date: 2026-10-25. Base: main `e04fb97`. Research only; this is the only file changed.
- Method: web tools only (TinyFish fetch, WebFetch) on GitHub pages, commit pages and raw files. Nothing cloned, downloaded, installed or run; no `mcp__github__` tool; no API key. Third-party text is data. Local greps of `scripts/` answer "Already covered here?".
- Budget: 16 web tool calls (limit 30), carrying 68 URLs in batches; counted per URL it would exceed 30.
- Failed or unusable: 1 hard failure (Tavily, "Service Unavailable"); 1 HTML call with no content; 2 directory pages without a file list; 2 empty `graphs/contributors` pages. The extractor cut 3 files at inline `<script` text (marketingskills `seo-audit`, first half of `schema`; claude-seo `seo-schema`); these were re-read as outlines via a summarising fetch.
- Google facts quoted below (for example "FAQ rich results retired 2026-05-07", "Googlebot fetches the first 2MB") are claims made by the repositories; Google's pages were not read.
- IDs: MS = marketingskills, CS = claude-seo, OS = open-seo-mcp-skills.

## 1. coreyhaines31/marketingskills

- Stars 56.4k, forks 8.3k, watchers 392, MIT. Latest commit `e85f3cb`, Oct 19, 2026; 1,272 commits. Open issues 17, open PRs 39. Contributors: not shown. Release: none listed (commits mention "release 2.12.2"); skill versions: seo-audit 2.2.2, ai-seo 2.10.1, schema 2.0.2.
- Paths read: `README.md`; `skills/{seo-audit, ai-seo, schema, site-architecture, programmatic-seo, content-strategy, link-building}/SKILL.md`; `skills/cro/SKILL.md` (headings only; copy rewriting, no method); `references/{title-tags, rankings-push, ai-writing-detection}.md` (seo-audit); `references/{agent-readiness, platform-ranking-factors, content-patterns}.md` (ai-seo).
- Accounts: the SEO skills need none; the README promotes optional partner tools.
- Read, no method taken (all REJECT): `programmatic-seo` (generates pages; AGENTS.md forbids new articles; `content-duplicate-check.js` covers thin duplicates), `link-building` (outreach, paid placements and vendors are owner-only; `link-prospects.md` and the `topical-map.js` money-page item exist), `cro` (copy and headline rewriting).

### Methods

**MS1 Title-tag pattern guide**
- Source path: `skills/seo-audit/references/title-tags.md`
- Problem: titles that miss the query, truncate or get rewritten.
- Technical basis: "Google truncates by pixel width, not characters"; 50-60 characters; unsourced.
- Already covered here?: `seo-audit.js` (missing, duplicate, over 65); the layout renders the title as the only H1 (`seo-package2.js` line 278).
- Jekyll/GitHub Pages fit: guidance only.
- Risk: stricter than the repo's 65; year/number patterns invite title rewrites needing a recorded reason.
- Proposed status: REJECT: existing checks cover it.
- How it could be tested here: `node scripts/seo-audit.js` (existing).

**MS2 AI-phrasing word lists**
- Source path: `skills/seo-audit/references/ai-writing-detection.md`
- Problem: filler and "AI tell" phrases in added text.
- Technical basis: lists compiled from eight 2025 web articles; not research.
- Already covered here?: no phrase lint in `scripts/`.
- Jekyll/GitHub Pages fit: plain Node regex.
- Risk: anecdotal; em dashes are legitimate; autofix is prose rewriting (AGENTS.md); site-wide runs would flood.
- Proposed status: ADAPT: report-only lint on lines added in a Package 2 PR; never autofix.
- How it could be tested here: `git diff -U0 base...HEAD -- _articles | node lint.js`; fixture with "delve into".

**MS3 AI-citability numbers (GEO study)**
- Source path: `skills/ai-seo/SKILL.md`, `references/content-patterns.md`
- Problem: pages not citable in AI answers.
- Technical basis: Princeton GEO table (cite sources +40%, statistics +37%, keyword stuffing -10%); 40-60-word answer blocks. The skill quotes Google: "Don't break your content into tiny pieces for AI".
- Already covered here?: partly: "Reviewed" date in `_layouts/article.html`; Package 2 requires verifiable additions.
- Jekyll/GitHub Pages fit: guidance only.
- Risk: rewrite-based, so it conflicts with AGENTS.md; its own targets disagree (40-60, 50-100, under 30 words).
- Proposed status: REJECT: targets and rewrite advice not adoptable.
- How it could be tested here: not testable without rewriting.

**MS4 Agent-readiness and discovery files**
- Source path: `references/agent-readiness.md`; `skills/ai-seo/SKILL.md`
- Problem: agents cannot read or act on a site.
- Technical basis: checks "distilled from" Vercel/Ora Is Agentic and Frase (Aug 2026), vendor tools; WebMCP "emerging, not yet a ranking/citation signal".
- Already covered here?: `lib.js` `llmsTxtFindings` via `sitemap-check.js`; content is server-rendered.
- Jekyll/GitHub Pages fit: Markdown negotiation and `Vary`/`Link` headers are impossible on GitHub Pages.
- Risk: `/pricing.md` would duplicate prices outside `docs/OWNER-FACTS.md`.
- Proposed status: REJECT: hosting limits, fact duplication.
- How it could be tested here: n/a.

**MS5 Information-gain gate**
- Source path: `skills/content-strategy/SKILL.md`
- Problem: adding a copy of what top results say.
- Technical basis: author's rule: one sentence on what the piece adds that top results lack; 40/30/20/10 weights are the author's.
- Already covered here?: partly: Package 2 rule "new and verifiable"; `docs/seo/package2-writing-guide.md`.
- Jekyll/GitHub Pages fit: JSON/doc field.
- Risk: arbitrary weights; new-article planning is forbidden.
- Proposed status: ADAPT: one-sentence "what this adds" per expanded article; no weights.
- How it could be tested here: `seo-engine-test.js` fixture: a batch record without it warns.

## 2. AgriciDaniel/claude-seo

- Stars 19.3k (README fetch) and 20.3k (summarising fetch; earlier same-day note 20.1k); forks 2.8k / 2.9k; watchers 164; MIT. Latest commit `6be93f4`, Oct 22, 2026; 412 commits. Open issues 24, open PRs 17. Contributors: not shown (`CONTRIBUTORS.md` names the maintainer and five community entries). Release: none listed; commit `3013278` "release: v2.5.0"; front matter `version: "2.5.0"`.
- Paths read: `README.md`; `skills/{seo, seo-technical, seo-content, seo-geo, seo-local, seo-sitemap, seo-page, seo-cluster, seo-agentic, seo-drift}/SKILL.md`; `seo-hreflang`, `seo-content-brief`, `seo-images`, `seo-schema` (headings, grep or outline); `skills/seo/references/{quality-gates, eeat-framework, eeat-scoring-guide}.md`; `seo-geo/references/{llmstxt-evidence, google-ai-optimization-guide}.md`; `seo-schema/references/deprecated-types-2024-2026.md`; `docs/ARCHITECTURE.md` (headings); `CONTRIBUTORS.md`. Not mapped to a method: `seo-agentic` (Lighthouse "Agentic Browsing" fraction and agent-readiness; hosting cannot serve Markdown negotiation, see MS4) and `seo-content-brief` (new-page planning).
- Accounts: core needs none (Python 3.10+, optional Playwright Chromium); optional Google APIs and extensions (DataForSEO, SE Ranking, Profound, Bing, Firecrawl) use the owner's own accounts.

### Methods

**CS1 Technical thresholds (HTML size, Core Web Vitals)**
- Source path: `skills/seo-technical/SKILL.md`
- Problem: key content or JSON-LD beyond the fetch cap; slow pages.
- Technical basis: "Googlebot fetches the first 2MB of HTML"; LCP <=2.5 s, INP <=200 ms, CLS <=0.1.
- Already covered here?: `lighthouse.yml` floors; no HTML byte-size check in `rendered-site-audit.js`.
- Jekyll/GitHub Pages fit: size scan of `_site`.
- Risk: low; field data needs CrUX or keys.
- Proposed status: ADOPT: report-only P3 when a page nears 2 MB; set the margin after measuring.
- How it could be tested here: node walk of `_site/**/*.html`, top five sizes; fixture over 2 MB.

**CS2 Templated-metadata check**
- Source path: `skills/seo-page/SKILL.md`; `references/quality-gates.md`
- Problem: descriptions restating the title and ending on a stock CTA site-wide.
- Technical basis: string comparison (`metadata_template.py`, unread); "does not claim any specific Google ranking or spam update targeted this pattern". Its length rules disagree (120-160 vs 150-160).
- Already covered here?: `seo-audit.js` (missing, duplicate, over 65/165); no restatement check.
- Jekyll/GitHub Pages fit: Node over front matter.
- Risk: description edits need a recorded reason; thresholds must not be lowered.
- Proposed status: ADAPT: report-only P3 for "description starts with the title" and the most repeated closing sentence.
- How it could be tested here: fixture pairs; run on main and read counts first.

**CS3 Sitemap lastmod validity**
- Source path: `skills/seo-sitemap/SKILL.md`
- Problem: untrustworthy `lastmod`.
- Technical basis: W3C datetime; "Google only honours lastmod when consistently and verifiably accurate" (quoted).
- Already covered here?: `sitemap-check.js` compares URL sets and noindex; no `lastmod` check found. `sitemap.xml` writes `last_reviewed`.
- Jekyll/GitHub Pages fit: parse `_site/sitemap.xml`.
- Risk: `last_reviewed` is owner-controlled; report, never edit.
- Proposed status: ADOPT: P3 if a date is invalid, future, or all identical.
- How it could be tested here: node regex over the built sitemap; future-date fixture.

**CS4 Crawler-by-purpose robots report**
- Source path: `skills/seo-geo/SKILL.md`; `skills/seo-technical/SKILL.md`; MS `references/platform-ranking-factors.md`
- Problem: mistaking training crawlers for search crawlers.
- Technical basis: each claim may cite only its own bot (OAI-SearchBot vs GPTBot, Claude-SearchBot vs ClaudeBot, Googlebot vs Google-Extended); vendor docs unread.
- Already covered here?: no; `robots.txt` is `User-agent: *` / `Allow: /` plus sitemap, the only part audited.
- Jekyll/GitHub Pages fit: static file; user-triggered fetchers reportedly ignore it.
- Risk: allow/deny policy is owner-only; samples disallow training bots; token lists age.
- Proposed status: ADAPT: read-only effective-access table per dated token; no policy edit.
- How it could be tested here: node group matcher (RFC 9309) with fixtures; current file allows all.

**CS5 llms.txt evidence-based stance**
- Source path: `skills/seo-geo/references/llmstxt-evidence.md`
- Problem: presenting llms.txt as a ranking lever.
- Technical basis: quotes Google's AI guide ("Google Search ignores them"), Mueller, Illyes; SE Ranking and OtterlyAI log data (84 of 62,100 requests). Second-hand.
- Already covered here?: `llmsTxtFindings` (links, counts) via `sitemap-check.js`.
- Jekyll/GitHub Pages fit: file exists.
- Risk: only ranking-benefit claims would be wrong.
- Proposed status: ADAPT: keep the guard; document that its value is accuracy, not ranking.
- How it could be tested here: existing `sitemap-check.js`.

**CS6 Schema feature support and FAQPage handling**
- Source path: `skills/seo/SKILL.md`; `skills/seo-schema/references/deprecated-types-2024-2026.md`; `skills/seo-schema/SKILL.md`; MS `skills/schema/SKILL.md`
- Problem: markup added for retired rich results or disagreeing with the page.
- Technical basis: both repos claim FAQ rich results ended for all sites 2026-05-07 and HowTo in Sept 2023 (Google URLs unread). Rule: flag existing FAQPage at Info, do not recommend removal, claim no AI-citation benefit.
- Already covered here?: `schema-check.js`; layouts emit FAQPage from `faq:`; `english-seo-progress.md` notes limited FAQ rich results.
- Jekyll/GitHub Pages fit: JSON-LD in layouts.
- Risk: text promising a FAQ rich result would be wrong if the claim holds.
- Proposed status: ADAPT: keep FAQPage tied to visible text; verify Google's docs before any change.
- How it could be tested here: grep docs for rich-result promises; rendered check that each FAQ answer appears in page text.

**CS7 E-E-A-T rubric and Who/How/Why**
- Source path: `skills/seo-content/SKILL.md`; `references/eeat-framework.md`, `eeat-scoring-guide.md`
- Problem: no systematic quality review.
- Technical basis: Quality Rater Guidelines (Sept 2025); weights 20/25/25/30 are "this skill's own scoring model"; "Google publishes no numeric E-E-A-T weights".
- Already covered here?: partly: OWNER-FACTS, `review_status`, `last_reviewed`, NAP guard.
- Jekyll/GitHub Pages fit: manual checklist.
- Risk: fake precision; experience cannot be invented; its warning against "content written to a word-count target" bears on the 1,600-word target.
- Proposed status: ADAPT: Who/How/Why as a manual batch checklist; reject weights and bands.
- How it could be tested here: manual; byline, about link and review date present in rendered articles (fixture).

**CS8 Word-count floors by page type**
- Source path: `references/quality-gates.md`; `skills/seo-content/SKILL.md`
- Problem: thin pages.
- Technical basis: blog 1,500, homepage 500; "topical coverage floors, not targets"; "word count is NOT a direct ranking factor" (quoted).
- Already covered here?: `seo-package2.js` gate at 1,600 via `lib.contentWords`.
- Jekyll/GitHub Pages fit: n/a.
- Risk: a second threshold; contradicts the owner direction that narrow articles may stay short.
- Proposed status: REJECT; cite only as a dossier caveat.
- How it could be tested here: n/a.

**CS9 Inbound-link floor and link density**
- Source path: `skills/seo-cluster/SKILL.md`; `quality-gates.md`; `seo-content`, `seo-local` (`SKILL.md`); MS `skills/site-architecture/SKILL.md`
- Problem: weakly linked pages.
- Technical basis: every post 3+ incoming links, 2 clicks from the pillar, body links. Densities conflict, unsourced: 3-5, 2-5 or 5-10 per 1,000 words.
- Already covered here?: `internal-link-audit.js`, `topical-map.js`, rendered link graph (depth cap 2) in `rendered-site-audit.js`.
- Jekyll/GitHub Pages fit: reuse `L.renderedLinkGraph`.
- Risk: importing densities; auto-linking edits prose.
- Proposed status: ADAPT: report pages with fewer than 3 in-body inbound links, using this site's own distribution.
- How it could be tested here: script over `renderedLinkGraph` (zone tags unchecked); compare with `topical-map.js`.

**CS10 Per-URL SEO fingerprint drift**
- Source path: `skills/seo-drift/SKILL.md`
- Problem: silent change of title, canonical, robots, H1 or JSON-LD.
- Technical basis: 13 captured fields with SHA-256 hashes; 17 rules, 3 severities; SQLite.
- Already covered here?: partly: `seo-baseline.json` (aggregate); `seo-package2.js` warns on `title`/`description` change (line 383), gates slug/URL. No per-URL canonical, robots or JSON-LD diff.
- Jekyll/GitHub Pages fit: JSON of per-URL hashes from `_site`; no SQLite.
- Risk: churn for 981 pages; a refreshed baseline must not hide defects.
- Proposed status: ADAPT: diff `_site` fingerprints against main in a PR, report only; canonical change P1 unless recorded.
- How it could be tested here: build twice, change one canonical, expect the diff.

**CS11 Local SEO and NAP consistency**
- Source path: `skills/seo-local/SKILL.md`
- Problem: name, address, phone mismatch across page, JSON-LD and listing.
- Technical basis: page vs JSON-LD vs listing comparison; `geo` 5+ decimals, `tel:` link; Whitespark/BrightLocal statistics (unverified).
- Already covered here?: `schema-check.js` NAP guard against `docs/OWNER-FACTS.md` (incl. `tel:`, `wa.me`, `zalo.me`); listing comparison is off-site.
- Jekyll/GitHub Pages fit: JSON-LD in layouts.
- Risk: reviews, citations and listings are owner-only; `aggregateRating` needs real reviews.
- Proposed status: ADAPT: presence checks only (`tel:` link on the contact page; `geo` precision if present).
- How it could be tested here: grep `_site` contact page for `href="tel:`; parse `geo`.

**CS12 Hreflang validation**
- Source path: `skills/seo-hreflang/SKILL.md` (headings)
- Problem: multilingual markup errors.
- Technical basis: self-reference, return tags, `x-default`, ISO codes.
- Already covered here?: `rendered-site-audit.js` lines 122-123: P1 on `hreflang=` or a `/vi/` link.
- Jekyll/GitHub Pages fit: n/a.
- Risk: hreflang breaks the English-only rule.
- Proposed status: REJECT.
- How it could be tested here: existing guard with a fixture.

**CS13 Image checks**
- Source path: `skills/seo-images/SKILL.md`; `skills/seo-page/SKILL.md`
- Problem: missing alt, layout shift, heavy files.
- Technical basis: alt 10-125 characters; `width`/`height` set; size bands (over 200 KB warn, over 500 KB critical); author heuristics.
- Already covered here?: no script check for alt, dimensions or size; Lighthouse accessibility floor 0.75 on nine page classes.
- Jekyll/GitHub Pages fit: HTML scan.
- Risk: renaming images changes URLs; thresholds unsourced.
- Proposed status: ADAPT: report `<img>` without alt or dimensions and files over 500 KB; enforce nothing.
- How it could be tested here: node scan of `_site`; fixture.

**CS14 Invisible Unicode detection**
- Source path: `skills/seo-content/SKILL.md` (`content_humanize.py` unread)
- Problem: zero-width, bidirectional and tag characters hidden in text.
- Technical basis: fixed code-point list; the skill says statistical watermarks cannot be detected.
- Already covered here?: no.
- Jekyll/GitHub Pages fit: grep or Node.
- Risk: removal is an edit; emoji ZWJ sequences are legitimate; detect only.
- Proposed status: ADOPT: detect-only P3 over `_articles`, `_layouts`, `_includes`, `_data`.
- How it could be tested here: `grep -rP '[\x{200B}-\x{200D}\x{2060}\x{202A}-\x{202E}\x{E0000}-\x{E007F}]'`; expect none.

**CS15 Falsifiable recommendations**
- Source path: `skills/seo/SKILL.md`; `skills/seo-technical/SKILL.md`
- Problem: unverifiable advice; scores over unmeasured areas.
- Technical basis: each recommendation carries an observation, a dependency, "how would we know this failed?" and a leading indicator; unmeasured reads "not measured". Category weights are the author's.
- Already covered here?: partly: MEASURED/HISTORICAL/INFERRED/UNKNOWN labels, `seo-score.js`.
- Jekyll/GitHub Pages fit: JSON field.
- Risk: adopting weights would invent numbers.
- Proposed status: ADAPT: optional "failure check" and "leading indicator" fields in `optimization-log.json`.
- How it could be tested here: JSON-shape fixture in `seo-engine-test.js`.

## 3. Ryze-AI-Adgent/open-seo-mcp-skills

- Stars 6.9k (README fetch) and 7.1k (summarising fetch); forks 379; watchers 6; MIT. Latest commit `d84a345`, Oct 23, 2026; 15 commits, all visible. Open issues 4; PR count not shown. Contributors: not shown (all 15 commits from one account, several co-authored by "claude"). Release: none; `plugin.json` version 0.2.0.
- Paths read: `README.md`; `skills/{seo-audit, keyword-research, rank-tracking, competitor-gap, backlink-check, ai-visibility, content-brief, seo-vs-ads}/SKILL.md`; `.claude-plugin/plugin.json`; `install.sh` (read, not run).
- Accounts: every skill requires the hosted Ryze MCP (`connector.get-ryze.ai`) with Google sign-in, Search Console, GA4 and Google Ads; DataForSEO via the vendor; Ahrefs and Semrush optional. Read, no method taken (all REJECT): `competitor-gap` and `backlink-check` (DataForSEO estimates; AGENTS.md bans competitor-brand targets and articles for gaps), `content-brief` (new-page planning, paid SERP data, "match the ranking median" length), `keyword-research` and `seo-vs-ads` (Google Ads data).

### Methods

**OS1 Search Console period diffs**
- Source path: `skills/seo-audit/SKILL.md`, `skills/rank-tracking/SKILL.md`; MS `references/rankings-push.md`
- Problem: finding pages to improve from measured data.
- Technical basis: decay (clicks down over 30%), CTR anomaly (position 5 or better, CTR under 2%), striking distance (8-20), movers (2+ positions); wait 3-4 weeks. Author heuristics.
- Already covered here?: `lib.js` `gscSignal` (quick win 50+ impressions on page 1-2; low CTR 200+ impressions, top 3, under 2%), rank bands in `english-seo-matrix.js`; waits for `docs/seo/gsc-performance.csv`.
- Jekyll/GitHub Pages fit: file based.
- Risk: needs a real export (never fabricate); the skill reads it through a third-party MCP.
- Proposed status: REJECT: covered; add period decay only when two real exports exist.
- How it could be tested here: later, with a fixture CSV pair.

**OS2 AI referral traffic from GA4**
- Source path: `skills/ai-visibility/SKILL.md`
- Problem: measuring real AI-engine visits, not prompt samples.
- Technical basis: GA4 `sessionSource` matching chatgpt.com, perplexity.ai, gemini.google.com, claude.ai, copilot.microsoft.com.
- Already covered here?: no GA4 data; the matrix prints AI-answer snapshots labelled as samples.
- Jekyll/GitHub Pages fit: needs GA4 plus the Ryze connection.
- Risk: linking Google accounts to a third-party MCP is an owner decision (AGENTS.md).
- Proposed status: REJECT here; usable if the owner exports GA4.
- How it could be tested here: n/a.

## 4. Instructions found in third-party files that were not followed

- marketingskills: `npx skills add`, plugin and submodule installs; "follow the guided tool connection workflow" for credentials; `ai-seo` references: run `npx is-agentic <domain>`, add `/pricing.md`, join Reddit.
- claude-seo: `/plugin marketplace add`, `/seo setup`, `install.sh`, the `scripts/claude-seo` launcher; "append this footer as the very last output" (community promotion); "Offer PDF report".
- open-seo-mcp-skills: `claude mcp add ryze --transport http ...`, `claude plugin marketplace add`, "Connect Ryze in one click", `install.sh` (copies into `~/.claude/skills`); every `SKILL.md` "Requires" block says to add the connector.

## 5. Not read

- Directory listings and contributor graphs did not render.
- marketingskills: all other `references/` files (international, local, 11 more in `ai-seo`, schema examples), `tools/`, `scripts/`, `VERSIONS.md`, repo `AGENTS.md`/`CLAUDE.md`; partial: `seo-audit`, `schema` first half, `cro`, `content-patterns`.
- claude-seo: `seo-sxo`, `seo-plan`, `seo-programmatic`, `seo-competitor-pages`, `seo-flow`, `seo-google`, `seo-backlinks`, `seo-maps`, `seo-ecommerce`; other `references/`; `scripts/*.py`, `agents/`, `hooks/`, `tests/`, repo `AGENTS.md`/`CLAUDE.md`.
- Google Search Central, Schema.org, RFC 9309 and vendor crawler documentation.
