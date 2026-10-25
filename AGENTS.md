# AGENTS.md — Rules for AI agents and automation working on this repository

## Source of truth order

Repo truth > memory > old reports > any prompt. Always fetch and inspect the
CURRENT remote main before acting. Never rely on remembered state.

## Never

- Rewrite article bodies outside the SEO Package 2 scope (see "SEO Package 2"
  below: only the frozen list of 300-500 word articles may be expanded, and
  never rewritten wholesale). Global presentation changes belong in the
  shared layout/CSS/JS (see README "ARTICLE UI OWNERSHIP").
- Create new articles, batches or filler pages. The production plan is COMPLETE;
  SEO Package 2 expands existing articles and creates none.
- Change indexed URLs, slugs, permalinks or canonicals casually.
- Weaken QA thresholds, blocking rules or assertions to get a green run.
- Baseline a real defect (P0/P1) to make the workflow green — the regression
  guard refuses this by design; do not work around it.
- Auto-change business facts (address, phone, hours, prices, claims) or
  legal/current-sensitive content.
- Bypass PR verification: safe fixes must pass the full re-audit on the exact
  repaired tree before merge.
- Force-push main. Two maintenance writers must never run simultaneously
  (concurrency groups enforce this — keep them).
- Touch thuexemayhanoi/blog or any other repository.
- Introduce Vietnamese UI, language switchers or /vi/ navigation.

## System ownership map

- QA engine: scripts/lib.js (central blocking rule, shared word counter
  contentWords, link-graph helpers clickDepth/pageRank/renderedLinkGraph,
  llmsTxtFindings), frontmatter-check, content-duplicate-check,
  internal-link-audit, seo-audit, sitemap-check (also llms.txt links and
  counts), schema-check, rendered-site-audit (also the rendered link graph:
  every sitemap page reachable from the home page, click depth capped at the
  measured 2, dead ends, English-only guard against hreflang and /vi/ links),
  seo-package2 (content-depth gate), build-report.js; gate:
  .github/workflows/quality-gate.yml.
- Autonomous SEO loop: scripts/maintenance.js regenerates the English SEO
  Master Matrix after the QA tools (Audit -> Matrix), reports its priorities
  and content gaps, raises P1 on matrix P0 rows and carries a material matrix
  change as the "matrix refresh" safe fix; unchanged matrices are restored
  byte-for-byte. Never widen the safe-fix policy to content or facts.
- Maintenance engine: scripts/maintenance.js (orchestrator) +
  scripts/maintenance-escalate.js (deduplicated issue + safe-fix PR) +
  .github/workflows/weekly-maintenance.yml.
- SEO engine: scripts/seo-audit.js / rendered-site-audit.js (audits) +
  scripts/seo-score.js (category scores) + scripts/fix-matrix.js
  (root-cause Fix Matrix).
- Regression baselines: scripts/maintenance-baseline.json (inventory; update
  deliberate-only via --update-baseline) and scripts/seo-baseline.json (stable
  SEO metrics; update via seo-regression.js --update-baseline --reason,
  refused while P0/P1 defects exist).
- Safe-fix engine: the --fix path inside scripts/maintenance.js. Policy:
  deterministic, low-risk only (unambiguous slug normalisation, stale README
  current-state count, generated report refresh). Everything else is
  REVIEW_REQUIRED.
- PR verifier: the safe-fixes job in weekly-maintenance.yml (rebuild, full
  re-audit, article-count check, one PR, squash merge only on green).
- Lighthouse: .github/workflows/lighthouse.yml + scripts/representative-pages.js.
- Link checking: .github/workflows/link-check.yml (Lychee; internal blocking,
  external report-only).
- Code scanning: .github/workflows/codeql.yml (code only, never content).
- Engine tests: scripts/seo-engine-test.js (fixture-based, production-safe).
- English SEO Master Matrix: scripts/english-seo-matrix.js (consumes the tool
  reports + docs/matrix/master-matrix.csv + docs/seo/keyword-targets.json;
  writes docs/seo/english-seo-master-matrix.{csv,json,md} and
  english-keyword-clusters.md). Status lives in docs/seo/matrix-status.json;
  third-party metrics only in docs/seo/keyword-evidence.json (tool + date).
  Progress log: docs/seo/english-seo-progress.md. Never invent metrics.
- Zero-data research layer: scripts/seo-research-ingest.js ingests raw connector
  exports from docs/seo/research/inbox/ (git-ignored) into
  docs/seo/keyword-evidence.json (every block names tool + date;
  _serp_snapshot* blocks feed the content gap register) and
  docs/seo/keyword-universe.json (on-topic demand rows per market). The matrix
  engine maps them to serving URLs and regenerates docs/seo/keyword-universe.md,
  serp-landscape.md and link-prospects.md (matrix files in maintenance.js).
  It also ingests the Ubersuggest rank-tracker and AI-visibility exports into
  `_tracking` (dated positions per keyword and ranking URL); the matrix turns
  positions 4-20 into P2 quick wins and flags a different ranking URL than the
  declared owner (optimization-log batches with `rank_work: true` wait for the
  next snapshot). Positions are not clicks: ZERO-DATA mode stays until a real
  Search Console export exists. The OpenSEO AI-answer export (`openseo_ai_visibility`:
  per prompt and engine whether this domain was cited or named, the pages and
  domains cited) becomes a second `ai_visibility_snapshots` entry; the matrix
  prints it as "AI answers and citations" and link-prospects.md lists the cited
  domains. A citation is not a ranking and one answer per prompt and engine is
  a sample. A paid AI check needs its cost estimated first; never leave a
  recurring AI schedule enabled without the owner's approval.
  Never invent or round a metric; never target a competitor brand name; never
  create an article for a gap. Off-site work (reviews, Google Business Profile,
  outreach) is owner-only.
- Topical map: scripts/topical-map.js (Pillar-Hub-Silo map, silo integrity,
  contextual link equity: a PageRank model over in-body links and related cards,
  reported as percentiles with a P3 money-page-equity recommendation,
  demand per cluster, keyword clusters by URL, split families with a SERP-overlap
  check, REVIEW_REQUIRED recommendations) writes docs/seo/topical-map.{json,md} after the matrix;
  both are matrix files in maintenance.js. It never creates articles, edits
  prose or changes URLs; recommendations are worked by hand in small batches.
- DATA-DRIVEN switch: docs/seo/gsc-performance.csv (a real Search Console
  export; header-only template gsc-performance.template.csv) flips the matrix
  from ZERO-DATA to DATA-DRIVEN mode (lib.js parseGscCsv/gscSignal). Never
  fabricate an export or a measured figure; an unknown layout is rejected.
- NAP guard: scripts/schema-check.js checks name, address, phone, hours and
  Organization/LocalBusiness JSON-LD (incl. @graph) against docs/OWNER-FACTS.md.
  A mismatch is P1 and owner-only to fix; never weaken the guard.
- Indexing: .github/workflows/indexnow.yml + scripts/indexnow-submit.js + the
  32-hex key file at the repo root. Runs after a successful Pages deployment,
  submits only live-sitemap URLs, waits for the key file. Never submit URLs
  outside the sitemap; Google stays with the sitemap and Search Console.
- Link repair: scripts/link-bare-slugs.js (bare slug in prose -> contextual
  link; exact matches only; dry run by default, --apply records
  reports/link-bare-slugs.json). Not a rewrite tool.
- Link resolution: scripts/link-guide-references.js (descriptive reference ->
  contextual link only when the target is certain: declared related guides,
  exact title, --cluster-candidates fallback, --overrides reviewed map; the
  phrase is the link text, never rewritten). scripts/related-links-fill.js
  (inbound related cards via internal_link_targets only). Dry runs write
  reports/*-dry-run.json (git-ignored); --apply reports are the audit trail
  the matrix reads. Verified optimisation batches are recorded in
  docs/seo/optimization-log.json (date, batch, note, urls); never mark a URL
  OPTIMIZED without a recorded batch.
- FAQ and title tags: the cluster and article layouts render `faq:` front
  matter as a Common questions section and emit FAQPage JSON-LD from it
  (`faq_in_body: true` = schema only). Every answer must restate
  docs/OWNER-FACTS.md or a VERIFIED article; never add a question whose
  answer is not already on the site. The default layout appends the brand
  suffix to the title tag only when the whole string fits 65 characters;
  `title_tag:` overrides (homepage). Do not reintroduce a fixed suffix.

## SEO Package 2 — CONTENT DEPTH 1600+ (owner-approved scope extension, 2026-10-25)

The site owner allows expanding existing English articles whose Markdown body had
300-500 words (inclusive) to at least 1,600 words of real content. This replaces,
for those URLs only, the earlier rule that articles are never lengthened to hit a
quota. The 1,600-word figure is an editorial requirement of the owner, not a
ranking threshold published by Google. Scope and rules:

- Scope is frozen in docs/seo/package2-baseline.json (693 articles measured on
  main 7fcfc73 with lib.contentWords). Articles outside 300-500 words stay as they
  are unless a shared component needs a fix. The checkpoint is
  docs/seo/package2-status.json; the dossier is
  docs/seo/seo-package-2-content-depth.md; the list is
  docs/seo/package2-eligible.csv.
- Words are counted by lib.contentWords (Markdown body only: no front matter,
  code, HTML/Liquid, URLs or layout-generated components such as related cards,
  sources and the Common questions rendered from `faq:` front matter). Never
  count another way to reach the target.
- Work in small batches (first 5, then 10-20), each through the full QA suite and
  a PR merged only on green CI; record the batch in package2-status.json,
  optimization-log.json (`package: 2`), english-seo-progress.md and the matrix.
  A Package 2 batch never flips a URL to OPTIMIZED, never changes ranking, GSC or
  indexability data, and never lowers a QA threshold.
- Every added passage must give the reader something new and verifiable
  (process, example, comparison table, scenario, FAQ restating verified facts,
  contextual internal links in the Pillar-Hub-Silo structure). No padding, no
  repeated passages, no invented experience, customers, reviews, test results,
  specifications, prices or legal claims. A fact that cannot be verified is not
  written: record the URL as REVIEW_REQUIRED with the reason and move on.
- Business facts come only from docs/OWNER-FACTS.md; legal statements only from
  primary sources; model figures only from docs/MODEL-DATABASE.md or official
  manufacturer pages. Title, description, H1, slug, permalink, canonical and
  keyword ownership change only with a recorded reason (slug, permalink and
  canonical never). `last_reviewed` changes only when a real review of the
  expanded page took place.
- Do not claim completion for a URL that was not processed: the package is
  complete only when every article in the baseline list is DONE (>= 1,600 words)
  or REVIEW_REQUIRED with a reason, CI and deployment are green and the progress
  report matches the repository.
- Tooling: scripts/seo-package2.js (baseline, queue, gate; run by the Quality Gate
  and the weekly maintenance). A DONE article below 1,600 words, a changed slug
  or URL, a missing eligible article or a status entry outside the scope is a
  blocking P1; pending articles never block.

## Hanoi motorbike rental keyword mission (owner-approved, 2026-10-25)

- Primary keyword owner: "Hanoi motorbike rental" and its core variants
  (motorbike rental Hanoi, rent motorbike Hanoi, motorcycle rental Hanoi,
  motorbike hire Hanoi) belong to the home page `/` (moved from /topics/rental/
  on recorded evidence in docs/seo/keyword-targets.json); /topics/rental/ is the
  supporting guide index under the distinct title "Hanoi Rental Guides". The
  home page rental summary uses OWNER-FACTS only. No URL or canonical changed.
- Data labels: MEASURED (a dated tool snapshot), HISTORICAL (an older dated
  snapshot, e.g. the 2026-10-14 rank tracker), INFERRED (reasoned, not measured),
  UNKNOWN. Never present INFERRED as a ranking or a measurement.
- Targeted SEO edits on Priority A pages (titles, leads, link targets, one
  contextual link) are allowed in small recorded batches; wholesale rewrites
  stay limited to SEO Package 2.
- Not every article must reach 1,600 words (owner direction of the same
  date): Package 2 batches follow keyword priority, money pages first, and a
  narrow article that already answers its query completely may stay shorter.
  A status for complete-as-is articles is not implemented; until it is, such
  articles stay pending in docs/seo/package2-status.json.
- GitHub SEO research: docs/seo/research/github-seo-skills.md (32 repositories,
  stars, forks and licences as read 2026-10-25). Only ideas and published
  algorithms were adopted, written independently; never install a third-party
  skill, plugin or MCP server for this repository without owner review.

## When extending the system

Prefer extend > integrate > refactor. Do not create parallel competing engines
or duplicate workflows that already exist. Keep GitHub Pages compatibility
(plugins: []), plain Node.js with zero dependencies for scripts, and least
privilege for workflow permissions.
