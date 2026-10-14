# AGENTS.md — Rules for AI agents and automation working on this repository

## Source of truth order

Repo truth > memory > old reports > any prompt. Always fetch and inspect the
CURRENT remote main before acting. Never rely on remembered state.

## Never

- Rewrite all 981 article bodies. Global presentation changes belong in the
  shared layout/CSS/JS (see README "ARTICLE UI OWNERSHIP").
- Create new articles, batches or filler pages. The production plan is COMPLETE.
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

- QA engine: scripts/lib.js (central blocking rule), frontmatter-check,
  content-duplicate-check, internal-link-audit, seo-audit, sitemap-check,
  schema-check, rendered-site-audit, build-report.js; gate:
  .github/workflows/quality-gate.yml.
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

## When extending the system

Prefer extend > integrate > refactor. Do not create parallel competing engines
or duplicate workflows that already exist. Keep GitHub Pages compatibility
(plugins: []), plain Node.js with zero dependencies for scripts, and least
privilege for workflow permissions.
