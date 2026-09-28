#!/usr/bin/env node
// SEO REGRESSION GUARD — compares current stable SEO metrics against the
// committed accepted baseline (scripts/seo-baseline.json).
//
//   node scripts/seo-regression.js                    compare (exit 1 on regression)
//   node scripts/seo-regression.js --update-baseline --reason "..."
//
// Baseline update is DELIBERATE-ONLY and REFUSES while any P0/P1 finding is
// present: a real defect can never be baselined away to make the workflow
// green. The baseline records why it changed.
//
// Guarded metrics (stable properties only):
//   articleCount            exact match (981 published articles)
//   sitemapUrlCount         exact match (generated sitemap coverage)
//   canonicalErrors        higher-is-worse
//   brokenInternalLinks     higher-is-worse
//   orphans                 higher-is-worse
//   schemaErrors            higher-is-worse
//   duplicateTitles         higher-is-worse
//   duplicateMeta           higher-is-worse
//   unexpectedNoindex       higher-is-worse
//   reviewRequiredCount     exact match (a change needs deliberate confirmation)
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const BASELINE_PATH = path.join(__dirname, 'seo-baseline.json');
const args = process.argv.slice(2);
const UPDATE = args.includes('--update-baseline');
const REASON = (args[args.indexOf('--reason') + 1] || '').trim();

// Safe JSON read: no check-then-read race (CodeQL). Returns null if absent/corrupt.
function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
function readReport(t) {
  return readJsonSafe(path.join(L.ROOT, 'reports', t + '.json'));
}
function matches(re, f) { return re.test(String(f.issue || '')); }

function collectMetrics() {
  const arts = L.loadArticles();
  const seo = readReport('seo-audit');
  const ila = readReport('internal-link-audit');
  const smc = readReport('sitemap-check');
  const sch = readReport('schema-check');
  const rsa = readReport('rendered-site-audit');
  const allFindings = [];
  for (const t of ['frontmatter-check', 'content-duplicate-check', 'internal-link-audit', 'seo-audit', 'sitemap-check', 'schema-check', 'rendered-site-audit']) {
    const r = readReport(t);
    for (const f of ((r && r.findings) || [])) allFindings.push(Object.assign({ tool: t }, f));
  }
  // Render the sitemap template like the tools do.
  const sitemapRaw = fs.readFileSync(path.join(L.ROOT, 'sitemap.xml'), 'utf8');
  const sitemapUrlCount = new Set(L.sitemapLocs(sitemapRaw, arts)).size;
  return {
    metrics: {
      articleCount: arts.length,
      sitemapUrlCount: sitemapUrlCount,
      canonicalErrors: allFindings.filter(f => matches(/canonical|\/english\/english/, f)).length,
      brokenInternalLinks: allFindings.filter(f => matches(/broken internal link|broken asset link|broken file link/, f)).length,
      orphans: allFindings.filter(f => matches(/orphan/, f)).length,
      schemaErrors: allFindings.filter(f => matches(/JSON-LD|schema|BreadcrumbList/, f)).length,
      duplicateTitles: allFindings.filter(f => matches(/duplicate title|near-duplicate title/, f)).length,
      duplicateMeta: allFindings.filter(f => matches(/duplicate meta description/, f)).length,
      unexpectedNoindex: allFindings.filter(f => matches(/accidental noindex/, f)).length,
      reviewRequiredCount: arts.filter(a => String(a.fm.review_status || '').toUpperCase() === 'REVIEW_REQUIRED').length
    },
    blockingFindings: allFindings.filter(L.isBlocking).map(f => ({ tool: f.tool, severity: f.severity, file: f.file, issue: f.issue }))
  };
}

const { metrics, blockingFindings } = collectMetrics();

if (UPDATE) {
  if (blockingFindings.length) {
    console.error('seo-regression: REFUSING baseline update — ' + blockingFindings.length + ' blocking P0/P1 finding(s) present. A real defect must never be baselined.');
    for (const b of blockingFindings.slice(0, 10)) console.error('  ' + b.severity + ' [' + b.tool + '] ' + b.file + ' — ' + b.issue);
    process.exit(1);
  }
  if (!REASON) { console.error('seo-regression: --update-baseline requires --reason "<why the accepted state changed>". Recorded history matters.'); process.exit(1); }
  const prev = readJsonSafe(BASELINE_PATH);
  const out = {
    generated: new Date().toISOString().slice(0, 10),
    updatedReason: REASON,
    previousUpdate: prev ? { generated: prev.generated, updatedReason: prev.updatedReason } : null,
    acceptanceCriteria: 'Baseline accepted only when: current layout intentional, Pages green, Quality Gate green, no P0/P1 regression, representative pages render, article inventory intact.',
    metrics
  };
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(out, null, 2) + '\n');
  console.log('seo-regression: baseline updated (' + JSON.stringify(metrics) + ') — reason: ' + REASON);
  process.exit(0);
}

if (!fs.existsSync(BASELINE_PATH)) { console.error('seo-regression: no baseline (scripts/seo-baseline.json). Create it deliberately with --update-baseline --reason.'); process.exit(1); }
const baseline = readJsonSafe(BASELINE_PATH);

// A defect present now fails the guard regardless of the baseline: baselining
// cannot suppress a live P0/P1.
if (blockingFindings.length) {
  console.error('seo-regression: FAIL — ' + blockingFindings.length + ' blocking P0/P1 finding(s) present now (baseline cannot suppress live defects).');
  for (const b of blockingFindings.slice(0, 10)) console.error('  ' + b.severity + ' [' + b.tool + '] ' + b.file + ' — ' + b.issue);
  process.exit(1);
}

const regressions = [];
for (const [k, cur] of Object.entries(metrics)) {
  const base = baseline.metrics[k];
  if (base === undefined) { regressions.push({ metric: k, from: base, to: cur, kind: 'untracked-metric' }); continue; }
  if (k === 'articleCount' || k === 'sitemapUrlCount' || k === 'reviewRequiredCount') {
    if (cur !== base) regressions.push({ metric: k, from: base, to: cur, kind: 'exact' });
  } else {
    if (cur > base) regressions.push({ metric: k, from: base, to: cur, kind: 'higher-is-worse' });
  }
}
const improvements = Object.entries(metrics).filter(([k, v]) => baseline.metrics[k] !== undefined && v < baseline.metrics[k]).map(([k, v]) => k + ': ' + baseline.metrics[k] + ' -> ' + v);

fs.mkdirSync(path.join(L.ROOT, 'reports', 'seo'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'seo', 'regression.json'), JSON.stringify({ tool: 'seo-regression', baseline: { generated: baseline.generated, updatedReason: baseline.updatedReason }, current: metrics, regressions, improvements }, null, 2));

if (regressions.length) {
  console.error('seo-regression: FAIL — got worse vs accepted baseline (' + baseline.generated + '):');
  for (const r of regressions) console.error('  ' + r.metric + ': ' + r.from + ' -> ' + r.to + ' (' + r.kind + ')');
  process.exit(1);
}
console.log('seo-regression: PASS — no metric regressed vs accepted baseline ' + baseline.generated + (improvements.length ? ' (improvements: ' + improvements.join(', ') + ')' : ''));
