#!/usr/bin/env node
// FIX MATRIX — machine-readable, root-cause-deduplicated view of ALL findings
// from the QA tool reports, each classified by the safe auto-fix policy.
// Writes reports/seo/fix-matrix.json + reports/seo/fix-matrix.md.
//
// Root cause deduplication: findings whose issue strings differ only by a
// variable token (slug, URL, filename, count) collapse into one root cause.
// One template defect therefore produces ONE matrix entry with an affected-URL
// list — not 500 duplicate rows.
//
// Safe auto-fix policy (identical in spirit to scripts/maintenance.js):
//   AUTO_FIXABLE   - internal_link_targets entry whose normalised form matches
//                    exactly one existing slug; stale README current-state
//                    article count; deterministic generated-report refresh.
//   REVIEW_REQUIRED - everything else. Article prose, titles, meta
//                    descriptions, legal/business facts, prices, ALT text and
//                    anything ambiguous are NEVER auto-fixed.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const REPORT_TOOLS = ['frontmatter-check', 'content-duplicate-check', 'internal-link-audit', 'seo-audit', 'sitemap-check', 'schema-check', 'rendered-site-audit'];

function rootCause(issue) {
  return String(issue || '')
    .replace(/https?:\/\/\S+/g, '<url>')
    .replace(/\/[\w./-]+/g, '<path>')
    .replace(/["'][^"']+["']/g, '<q>')
    .replace(/\b\d+\b/g, '<n>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Deterministic safe-fix classification for internal_link_targets.
const arts = L.loadArticles();
const slugSet = new Set(arts.map(a => a.name.replace(/\.md$/, '')));
const norm = s => String(s).toLowerCase().replace(/\s+/g, '-').replace(/\.md$/, '').replace(/\/articles\//g, '').replace(/\/$/, '');
const autoFixableTargets = new Map(); // file -> Set of raw bad targets that are auto-fixable
for (const a of arts) {
  const t = a.fm.internal_link_targets;
  if (!t) continue;
  const arr = Array.isArray(t) ? t : String(t).split(',').map(x => x.trim()).filter(Boolean);
  for (const x of arr) {
    if (slugSet.has(x)) continue;
    if (slugSet.has(norm(x))) {
      if (!autoFixableTargets.has(a.file)) autoFixableTargets.set(a.file, new Set());
      autoFixableTargets.get(a.file).add(x);
    }
  }
}

function classifyFix(tool, f) {
  const s = String(f.issue || '');
  if (tool === 'seo-audit' && /title longer than|meta description longer than/.test(s)) return { status: 'REVIEW_REQUIRED', risk: 'low', fix: f.fix || 'Review signal only' };
  // Token extraction for internal_link_targets findings (bare "…: slug" and quoted forms).
  const tok = (s.match(/references missing slug:\s*(.+)$/) || [])[1] || (s.match(/"([^"]+)"/) || [])[1];
  if (f.file && tok && autoFixableTargets.has(f.file) && autoFixableTargets.get(f.file).has(tok.trim())) {
    return { status: 'AUTO_FIXABLE', risk: 'low', fix: 'scripts/maintenance.js --fix (unambiguous slug normalisation, verified by full re-audit before any PR)' };
  }
  if (/duplicate title|duplicate meta description|near-duplicate title/.test(s)) return { status: 'REVIEW_REQUIRED', risk: 'medium', fix: 'Owner/editorial decision — mass title/description rewrites are forbidden by policy' };
  if (/legal|licence|law|fine|insurance/i.test(s)) return { status: 'REVIEW_REQUIRED', risk: 'high', fix: 'Human verification against primary sources — never auto-fixed' };
  return { status: 'REVIEW_REQUIRED', risk: 'medium', fix: f.fix || 'Inspect and fix manually' };
}

const groups = new Map();
for (const tool of REPORT_TOOLS) {
  const jf = path.join(L.ROOT, 'reports', tool + '.json');
  if (!fs.existsSync(jf)) continue;
  const data = JSON.parse(fs.readFileSync(jf, 'utf8'));
  for (const f of (data.findings || [])) {
    const rc = tool + ' :: ' + rootCause(f.issue);
    if (!groups.has(rc)) groups.set(rc, { tool, rootCause: rootCause(f.issue), severity: f.severity, issues: new Map(), files: new Set() });
    const g = groups.get(rc);
    // Severity of a group = the WORST severity among its members (deterministic).
    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    if (rank[f.severity] < rank[g.severity]) g.severity = f.severity;
    const key = (f.file || '-') + ' :: ' + (f.issue || '');
    g.issues.set(key, { file: f.file, url: f.url, issue: f.issue, fix: f.fix });
    if (f.file && f.file !== '-') g.files.add(f.file);
  }
}

const matrix = [];
let id = 0;
const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
for (const [rc, g] of [...groups.entries()].sort((a, b) => order[a[1].severity] - order[b[1].severity] || a[0].localeCompare(b[0]))) {
  id++;
  const issues = [...g.issues.values()];
  const cls = classifyFix(g.tool, issues[0]);
  matrix.push({
    id: 'FM-' + String(id).padStart(3, '0'),
    severity: g.severity,
    area: g.tool,
    scope: [...g.files].slice(0, 200),
    scopeCount: g.files.size,
    affectedCount: issues.length,
    issue: issues[0].issue,
    rootCause: g.rootCause,
    evidence: issues.slice(0, 20).map(i => (i.file ? i.file + ': ' : '') + i.issue),
    safeToAutoFix: cls.status === 'AUTO_FIXABLE',
    status: cls.status,
    recommendedFix: cls.fix,
    tool: g.tool,
    riskLevel: cls.risk
  });
}

const counts = { P0: 0, P1: 0, P2: 0, P3: 0 };
for (const m of matrix) counts[m.severity]++;
const summary = {
  totalFindings: [...groups.values()].reduce((a, g) => a + g.issues.size, 0),
  rootCauses: matrix.length,
  autoFixable: matrix.filter(m => m.safeToAutoFix).length,
  reviewOnly: matrix.filter(m => !m.safeToAutoFix).length,
  bySeverity: counts
};
const out = { tool: 'fix-matrix', generated: new Date().toISOString(), summary, findings: matrix };
fs.mkdirSync(path.join(L.ROOT, 'reports', 'seo'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'seo', 'fix-matrix.json'), JSON.stringify(out, null, 2));

let md = '# SEO Fix Matrix — ' + out.generated + '\n\n';
md += 'Findings are deduplicated by ROOT CAUSE: one template/config defect = one entry with its affected scope.\n\n';
md += '| Metric | Value |\n|---|---|\n';
md += '| Total findings | ' + summary.totalFindings + ' |\n| Deduplicated root causes | ' + summary.rootCauses + ' |\n';
md += '| Safe auto-fix entries | ' + summary.autoFixable + ' |\n| Review-only entries | ' + summary.reviewOnly + ' |\n';
md += '| P0/P1/P2/P3 root causes | ' + counts.P0 + '/' + counts.P1 + '/' + counts.P2 + '/' + counts.P3 + ' |\n\n';
for (const m of matrix) {
  md += '## ' + m.id + ' [' + m.severity + '] ' + m.area + (m.safeToAutoFix ? ' — AUTO_FIXABLE' : ' — REVIEW_REQUIRED') + '\n\n';
  md += '- Issue: ' + m.issue + '\n- Root cause: ' + m.rootCause + '\n- Affected: ' + m.affectedCount + ' finding(s) in ' + m.scopeCount + ' file(s)\n';
  md += '- Recommended fix: ' + m.recommendedFix + '\n- Risk: ' + m.riskLevel + '\n\n';
}
fs.writeFileSync(path.join(L.ROOT, 'reports', 'seo', 'fix-matrix.md'), md);
console.log('fix-matrix: ' + summary.rootCauses + ' root causes (' + summary.totalFindings + ' findings, ' + summary.autoFixable + ' auto-fixable, ' + summary.reviewOnly + ' review-only)');
