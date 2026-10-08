#!/usr/bin/env node
// SEO SCORE — deterministic category scoring from the existing QA tool reports.
// Reads reports/*.json (seo-audit, internal-link-audit, sitemap-check,
// schema-check, frontmatter-check, content-duplicate-check, and rendered-site
// audit when a build exists) and writes reports/seo/score.json.
//
// Design rules:
// - Scores are per-category; the overall number NEVER hides a defect: any
//   blocking P0/P1 finding sets status=INVALIDATED_BY_DEFECTS and surfaces the
//   defect list, regardless of how high the numbers are.
// - P0 zeroes its category. P1/P2/P3 deduct per occurrence, with a per-category
//   cap on P3 deductions so a large corpus of length warnings cannot produce a
//   misleadingly low score.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

// A finding maps to exactly one category. Order matters: first match wins.
// Classify by issue text (tools use stable issue strings).
function classify(issue) {
  const s = String(issue || '');
  if (/stale \/english baseurl|stale legacy GitHub Pages URL|broken asset link|broken file link|malformed URL/.test(s)) return 'technicalSeo';
  if (/missing from sitemap|sitemap URL with no corresponding|excluded content in sitemap|noindex page included in sitemap|indexable URL missing from sitemap|duplicate sitemap URL|topic hub omitted from sitemap|sitemap URL not absolute|sitemap is invalid|sitemap missing|accidental noindex|rendered sitemap\.xml missing/.test(s)) return 'crawlIndexability';
  if (/canonical|sitemap gaps?/.test(s)) return 'canonicalSitemap';
  if (/broken internal link|orphan|no internal links from article|broken breadcrumb/.test(s)) return 'internalLinking';
  if (/JSON-LD|schema|BreadcrumbList|missing Article/.test(s)) return 'structuredData';
  if (/duplicate title|duplicate meta description|no H1|multiple H1|missing title|empty <title>|no <title>|missing meta description|has no meta description|no H1|near-duplicate title|multiple <title>|empty <title>/.test(s)) return 'onPageStructure';
  if (/title longer than|meta description longer than|title shorter|description shorter/.test(s)) return 'reviewSignals';
  return 'other';
}

const CATEGORIES = ['technicalSeo', 'crawlIndexability', 'canonicalSitemap', 'internalLinking', 'structuredData', 'onPageStructure', 'reviewSignals', 'other'];
const PENALTY = { P0: 1000, P1: 25, P2: 5, P3: 0.5 };
const P3_CAP_PER_CATEGORY = 15;
const P2_CAP_PER_CATEGORY = 40;

const REPORT_TOOLS = ['seo-audit', 'internal-link-audit', 'sitemap-check', 'schema-check', 'frontmatter-check', 'content-duplicate-check', 'rendered-site-audit'];
const findings = [];
for (const t of REPORT_TOOLS) {
  const jf = path.join(L.ROOT, 'reports', t + '.json');
  if (!fs.existsSync(jf)) continue;
  const data = JSON.parse(fs.readFileSync(jf, 'utf8'));
  for (const f of (data.findings || [])) findings.push(Object.assign({ tool: t }, f));
}
const blocking = findings.filter(L.isBlocking);
const p0 = findings.filter(f => f.severity === 'P0');
const p1 = findings.filter(f => f.severity === 'P1');

const perCategory = {};
for (const c of CATEGORIES) perCategory[c] = { score: 100, findings: 0, p0: 0, p1: 0, p2: 0, p3: 0 };
for (const f of findings) {
  const c = classify(f.issue);
  const cat = perCategory[c];
  cat.findings++;
  if (f.severity in PENALTY) cat[f.severity.toLowerCase()]++;
}
for (const c of CATEGORIES) {
  const cat = perCategory[c];
  let penalty = cat.p0 * PENALTY.P0 + cat.p1 * PENALTY.P1 + Math.min(cat.p2 * PENALTY.P2, P2_CAP_PER_CATEGORY) + Math.min(cat.p3 * PENALTY.P3, P3_CAP_PER_CATEGORY);
  cat.score = Math.max(0, Math.round((100 - penalty) * 10) / 10);
}

const categoryScores = Object.fromEntries(CATEGORIES.map(c => [c, perCategory[c].score]));
const scores = Object.values(categoryScores);
const overall = Math.round((scores.reduce((a, x) => a + x, 0) / scores.length) * 10) / 10;
const status = p0.length || p1.length ? 'INVALIDATED_BY_DEFECTS' : 'OK';

const report = {
  tool: 'seo-score',
  status,
  overall: overall,
  categories: perCategory,
  categoryScores,
  findingCounts: { P0: p0.length, P1: p1.length, P2: findings.filter(f => f.severity === 'P2').length, P3: findings.filter(f => f.severity === 'P3').length },
  blockingCount: blocking.length,
  blocking: blocking.map(b => ({ tool: b.tool, severity: b.severity, file: b.file, url: b.url, issue: b.issue })),
  note: 'Any P0/P1 finding invalidates the overall score (status INVALIDATED_BY_DEFECTS). Category scores remain visible for diagnosis. reviewSignals (P3 length warnings etc.) are informational and never mask defects.'
};
fs.mkdirSync(path.join(L.ROOT, 'reports', 'seo'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'seo', 'score.json'), JSON.stringify(report, null, 2));
console.log('seo-score: overall=' + overall + ' status=' + status);
for (const c of CATEGORIES) console.log('  ' + c + ': ' + categoryScores[c] + ' (findings ' + perCategory[c].findings + ')');
// The score tool itself never fails the build: defects are surfaced (and blocked)
// by the QA tools and the regression guard. A score with defects is data, not a
// gate — the gate is lib.isBlocking, already enforced elsewhere.
