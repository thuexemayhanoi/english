#!/usr/bin/env node
// MAINTENANCE ORCHESTRATOR (production plan is COMPLETE: no article creation here).
// Audits the current repository state against the existing QA toolkit plus a
// committed baseline (scripts/maintenance-baseline.json), writes
// reports/maintenance-latest.md + reports/maintenance.json, and can apply a
// narrow set of deterministic SAFE FIXES with --fix (never on legal/business/
// price/spec content). Baseline updates are deliberate-only via --update-baseline.
//
// Modes:
//   node scripts/maintenance.js               audit only (default)
//   node scripts/maintenance.js --fix         audit + apply safe fixes
//   node scripts/maintenance.js --update-baseline   refresh baseline AFTER a
//                                             deliberate, owner-approved change
// Exit code: 0 = PASS or PASS_WITH_REVIEW, 1 = FAIL (blocking findings or
// baseline drift such as an unexpected article count change).
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const L = require('./lib');

const ROOT = L.ROOT;
const BASELINE_PATH = path.join(__dirname, 'maintenance-baseline.json');
const REPORT_MD = path.join(ROOT, 'reports', 'maintenance-latest.md');
const REPORT_JSON = path.join(ROOT, 'reports', 'maintenance.json');
const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const UPDATE_BASELINE = args.includes('--update-baseline');

if (!fs.existsSync(BASELINE_PATH)) {
  console.error('maintenance: baseline missing (scripts/maintenance-baseline.json). Run with --update-baseline once.');
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));

// ---------- findings ----------
const findings = []; // {severity, area, detail, fix, dup}
// dup:true marks a maintenance finding that reports the SAME defect a QA tool
// already reported (counted in toolSeverityTotals). Dup entries stay visible
// in the detailed list but are excluded from maintenance totals and blocking
// determination so nothing is double-counted; the tool's own blocking exit
// code already fails the audit.
function add(severity, area, detail, fix, dup) { findings.push({ severity, area, detail, fix, dup: !!dup }); }

function mainSha() { return process.env.GITHUB_SHA || 'unknown'; }
function readmeText() { return fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8'); }

// ---------- 1. run the existing QA toolkit ----------
const hasSite = fs.existsSync(path.join(ROOT, '_site'));
const tools = ['frontmatter-check', 'content-duplicate-check', 'internal-link-audit', 'seo-audit', 'sitemap-check', 'schema-check'];
if (hasSite) tools.push('rendered-site-audit');
const toolResults = {};
// Aggregate severity totals from the QA-tool reports themselves. Blocking
// findings are also re-surfaced as maintenance P1 entries (dedup key below).
const toolSeverityTotals = { P0: 0, P1: 0, P2: 0, P3: 0 };
// Per-file index of tool findings, used to mark maintenance findings that
// duplicate a tool finding (same file + same offending token in the issue).
const toolFindingsByFile = new Map();
for (const t of tools) {
  const r = spawnSync(process.execPath, [path.join(__dirname, t + '.js')], { encoding: 'utf8' });
  const jf = path.join(ROOT, 'reports', t + '.json');
  const data = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : null;
  toolResults[t] = { status: r.status, data };
  if (r.status !== 0) add('P0', t, 'validator exited non-zero (' + r.status + ') — see that tool report for the blocking finding(s)', 'inspect ' + t + '.js output');
  for (const f of ((data && data.findings) || [])) {
    toolSeverityTotals[f.severity] = (toolSeverityTotals[f.severity] || 0) + 1;
    if (!toolFindingsByFile.has(f.file)) toolFindingsByFile.set(f.file, []);
    toolFindingsByFile.get(f.file).push(f);
  }
}
// Does a QA tool already report this defect (same file, same offending token)?
function toolReportsDefect(file, token) {
  token = String(token);
  for (const f of (toolFindingsByFile.get(file) || [])) {
    if (String(f.issue || '').includes(token)) return true;
  }
  return false;
}

// Guide Assistant regression (Mode 1 against source, or Mode 2 against a built index).
const builtIndex = path.join(ROOT, '_site', 'assistant-index.json');
const at = spawnSync(process.execPath, [path.join(__dirname, 'assistant-test.js'), ...(fs.existsSync(builtIndex) ? [builtIndex] : [])], { encoding: 'utf8' });
const assistantOK = at.status === 0;
const atOut = (at.stdout || '') + (at.stderr || '');
const atm = atOut.match(/(\d+) passed,\s*(\d+) failed/);
const assistantSummary = atm ? (atm[1] + ' passed, ' + atm[2] + ' failed') : (assistantOK ? 'completed' : 'failed');
if (!assistantOK) add('P0', 'assistant-test', 'Guide Assistant regression suite failed', 'fix assistant-core.js/assistant.js before next deploy');

// ---------- 2. baseline / inventory consistency ----------
const arts = L.loadArticles();
const currentSlugs = arts.map(a => a.name.replace(/\.md$/, '')).sort();
const expectedSlugs = baseline.slugs;
const added = currentSlugs.filter(s => !expectedSlugs.includes(s));
const removed = expectedSlugs.filter(s => !currentSlugs.includes(s));
const perCluster = {};
for (const a of arts) { const c = a.fm.topic_cluster || 'NONE'; perCluster[c] = (perCluster[c] || 0) + 1; }

if (arts.length !== baseline.articleCount)
  add('P1', 'inventory', 'article count is ' + arts.length + ' but baseline expects ' + baseline.articleCount + (added.length ? ' — new files: ' + added.join(', ') : '') + (removed.length ? ' — missing files: ' + removed.join(', ') : ''), 'investigate; only update the baseline after a deliberate owner-approved change (--update-baseline)');
const clusterDrift = Object.keys(baseline.perCluster).filter(c => (perCluster[c] || 0) !== baseline.perCluster[c])
  .map(c => c + ': ' + (baseline.perCluster[c] || 0) + ' -> ' + (perCluster[c] || 0));
if (clusterDrift.length) add('P1', 'inventory', 'per-cluster count drift: ' + clusterDrift.join('; '), 'investigate before touching the baseline');
const unknownClusters = Object.keys(perCluster).filter(c => !L.CLUSTERS.includes(c));
if (unknownClusters.length) add('P1', 'inventory', 'unknown topic_cluster values: ' + unknownClusters.join(', '), 'use one of the 14 production clusters');

// ---------- 3. REVIEW_REQUIRED consistency ----------
const reviewRequired = arts.filter(a => String(a.fm.review_status || '').toUpperCase() === 'REVIEW_REQUIRED');
const badRs = arts.filter(a => a.fm.review_status && !['VERIFIED', 'REVIEW_REQUIRED'].includes(String(a.fm.review_status).toUpperCase()));
for (const a of badRs) add('P2', 'review_status', a.file + ': invalid review_status ' + JSON.stringify(a.fm.review_status), 'use VERIFIED or REVIEW_REQUIRED (uppercase)', toolReportsDefect(a.file, 'review_status'));
const layout = fs.readFileSync(path.join(ROOT, '_layouts', 'article.html'), 'utf8');
if (!layout.includes('review-banner')) add('P1', 'review_status', 'article layout no longer renders the review banner', 'restore the review_required branch in _layouts/article.html');
const baselineRR = (baseline.reviewStatus && baseline.reviewStatus.REVIEW_REQUIRED) || 0;
if (reviewRequired.length !== baselineRR)
  add('P2', 'review_status', 'REVIEW_REQUIRED count changed: ' + baselineRR + ' -> ' + reviewRequired.length + ' (' + reviewRequired.map(a => a.name).join(', ') + ')', 'confirm the change is deliberate (a re-verification flipping to VERIFIED is good news; new REVIEW_REQUIRED means re-review content)');

// ---------- 4. stale last_reviewed ----------
const STALE_DAYS = baseline.staleAfterDays || 365;
const stale = arts.filter(a => a.fm.last_reviewed && (Date.now() - new Date(a.fm.last_reviewed)) / 864e5 > STALE_DAYS)
  .map(a => a.name + ' (' + a.fm.last_reviewed + ')');
if (stale.length) add('P3', 'stale-review', stale.length + ' article(s) not reviewed for over ' + STALE_DAYS + ' days: ' + stale.slice(0, 10).join(', ') + (stale.length > 10 ? ' …' : ''), 'schedule an owner re-verification pass; do not auto-rewrite');

// ---------- 5. source/citation metadata ----------
// frontmatter-check owns the deep rules (empty legal sources, VERIFIED-without-primary,
// non-array). The article layout only renders http(s) entries, so descriptive
// citations (e.g. "honda.com.vn — official model pages") are fine and internal
// docs/ references are never exposed publicly. Maintenance only flags legal
// articles with an entirely empty sources list as a review reminder.
for (const a of arts) {
  const s = a.fm.sources;
  const empty = !s || (Array.isArray(s) && s.length === 0);
  if (empty && a.fm.topic_cluster === 'law-licences')
    add('P2', 'sources', a.file + ': legal article with empty sources', 'cite primary sources or set REVIEW_REQUIRED', toolReportsDefect(a.file, 'without sources'));
}

// ---------- 6. malformed internal_link_targets (unambiguous-target safe fix) ----------
const slugSet = new Set(currentSlugs);
const norm = s => String(s).toLowerCase().replace(/\s+/g, '-').replace(/\.md$/, '').replace(/\/articles\//g, '').replace(/\/$/, '');
const safeFixes = [];
for (const a of arts) {
  const t = a.fm.internal_link_targets;
  if (!t) continue;
  const arr = Array.isArray(t) ? t : String(t).split(',').map(x => x.trim()).filter(Boolean);
  const bad = arr.filter(x => !slugSet.has(x)); // raw (un-normalised) targets are treated as defective by the link audit
  for (const b of bad) {
    const n = norm(b);
    const matches = currentSlugs.filter(s => s === n);
    // The link audit flags the same broken target (blocking) — mark as dup so
    // the maintenance totals do not double-count it; the safe fix still applies.
    const dup = toolReportsDefect(a.file, b);
    if (matches.length === 1) {
      safeFixes.push({ file: a.file, kind: 'internal_link_target', from: b, to: matches[0] });
      add('P2', 'internal_link_targets', a.file + ': target ' + JSON.stringify(b) + ' matches exactly one existing slug', 'auto-fixable with --fix (normalise to ' + matches[0] + ')', dup);
    } else {
      add('P1', 'internal_link_targets', a.file + ': target ' + JSON.stringify(b) + ' matches no existing slug', 'fix manually — never guess a target', dup);
    }
  }
}

// ---------- 7. line-wrap / mid-word corruption (evidence-based, corpus-wide) ----------
// A genuine compound ("longest-wheelbase" wrapped at the hyphen) is harmless.
// Corruption (a hyphen INSERTED mid-word when text was hard-wrapped) is flagged
// only when the corpus itself proves it: the unhyphenated joined word exists
// elsewhere in the repo and the hyphenated form does not.
const HYPHEN_OK = new Set(['e', 're', 'co', 'non', 'pre', 'semi', 'two', 'three', 'up', 'out', 'sub', 'anti', 'multi', 'full', 'half', 'self', 'well', 'mid', 'top', 'long', 'cross', 'flat', 'smart', 'under', 'over', 'side', 'front', 'rear', 'day', 'open', 'close', 'free', 'toll', 'stop', 'test', '50cc', '110cc', '125cc', '155cc', '160cc', '150cc', 'a1']);
const corpus = (arts.map(a => a.raw).join('\n') + '\n' + readmeText());
function countOcc(hay, needle) { let n = 0, i = 0; while ((i = hay.indexOf(needle, i)) !== -1) { n++; i += needle.length; } return n; }
function wrapCheck(file, text) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const m = lines[i].match(/([A-Za-z][a-z]{1,})-$/);
    if (!m) continue;
    if (HYPHEN_OK.has(m[1].toLowerCase())) continue;
    const next = lines[i + 1];
    const nw = next.match(/^([a-z]+)/);
    if (!nw) continue;
    const joined = m[1] + nw[1];
    const hyphened = m[1] + '-' + nw[1];
    // Evidence: the joined word is a real word used elsewhere; the hyphenated
    // form is rare/absent => the trailing hyphen was inserted by wrapping.
    if (countOcc(corpus, joined) >= 3 && countOcc(corpus, hyphened) <= 1)
      add('P2', 'line-wrap', file + ':' + (i + 2) + ': suspected mid-word line wrap ("' + m[1] + '-" + "' + nw[1] + '" reconstructs "' + joined + '", which the corpus uses ' + countOcc(corpus, joined) + 'x)', 'join the lines (corruption class first seen in README on 2026-09-24)');
  }
}
wrapCheck('README.md', readmeText());
for (const a of arts) wrapCheck(a.file, a.raw);

// ---------- 8. README / current-state consistency ----------
const readme = readmeText();
const readmeCounts = [...readme.matchAll(/(\d+) published articles/g)].map(m => Number(m[1]));
if (readmeCounts.length === 0) add('P3', 'readme', 'README no longer states a published-article count', 'restore the count statement');
// Historical "Batch NN" deployment-state records legitimately describe counts at
// their time; only non-historical (current-state) statements may be corrected.
for (const line of readme.split('\n')) {
  if (!/(\d+) published articles/.test(line)) continue;
  if (/^(\s*-\s*)+Batch \d/.test(line) || /site-wide/.test(line)) continue;
  const n = Number(line.match(/(\d+) published articles/)[1]);
  if (n !== arts.length) {
    add('P3', 'readme', 'README current-state line states stale article count ' + n + ' (actual ' + arts.length + '): ' + line.trim().slice(0, 100), 'auto-fixable with --fix');
    safeFixes.push({ file: 'README.md', kind: 'readme-count', line, from: n, to: arts.length });
  }
}

// ---------- 9. generated artifacts consistency ----------
const qLatest = path.join(ROOT, 'reports', 'quality-latest.md');
if (fs.existsSync(qLatest)) {
  const m = fs.readFileSync(qLatest, 'utf8').match(/\|\s*TOTAL ARTICLES\s*\|\s*(\d+)/);
  if (m && Number(m[1]) !== arts.length) {
    safeFixes.push({ file: 'reports/quality-latest.md', kind: 'generated-report', description: 'refresh via build-report.js' });
    add('P3', 'generated', 'reports/quality-latest.md TOTAL ARTICLES is stale (' + m[1] + ' vs ' + arts.length + ')', 'auto-fixable with --fix (build-report refresh)');
  }
}
const idxTpl = fs.readFileSync(path.join(ROOT, 'assistant-index.json'), 'utf8');
if (!/for\s+a\s+in\s+site\.articles/.test(idxTpl) || !/\{%\s*endfor\s*%\}/.test(idxTpl))
  add('P1', 'generated', 'assistant-index.json no longer looks like the Liquid-generated template (article loop missing)', 'restore the Jekyll template; a static index would go stale');
const sitemapTpl = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
if (!/for\s+a\s+in\s+site\.articles/.test(sitemapTpl))
  add('P1', 'generated', 'sitemap.xml no longer contains the article loop', 'restore the Liquid template');

// ---------- 10. no production mode ----------
if (fs.existsSync(path.join(ROOT, '_queue'))) {
  const drafts = fs.readdirSync(path.join(ROOT, '_queue')).filter(f => !f.startsWith('.'));
  if (drafts.length) add('P2', 'no-production', '_queue/ contains ' + drafts.length + ' unpublished draft(s)', 'production plan is COMPLETE; drafts must not ship silently — confirm they are deliberately parked');
}

// ---------- baseline update (deliberate-only) ----------
if (UPDATE_BASELINE) {
  const byCluster = {};
  for (const a of arts) { const c = a.fm.topic_cluster || 'NONE'; byCluster[c] = (byCluster[c] || 0) + 1; }
  const rs = {};
  for (const a of arts) { const r = String(a.fm.review_status || 'MISSING').toUpperCase(); rs[r] = (rs[r] || 0) + 1; }
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({
    generated: new Date().toISOString().slice(0, 10),
    articleCount: arts.length,
    clusters: L.CLUSTERS,
    perCluster: byCluster,
    reviewStatus: rs,
    slugs: currentSlugs,
    staleAfterDays: STALE_DAYS
  }, null, 1) + '\n');
  console.log('maintenance: baseline updated to ' + arts.length + ' articles. Commit this deliberately.');
}

// ---------- safe fixes ----------
const fixedFiles = [];
function applyFixes() {
  const perFile = new Map();
  for (const f of safeFixes.filter(s => s.kind === 'internal_link_target')) {
    if (!perFile.has(f.file)) perFile.set(f.file, new Set());
    perFile.get(f.file).add(f.from + '=>' + f.to);
  }
  for (const [file, edits] of perFile) {
    const p = path.join(ROOT, file);
    let text = fs.readFileSync(p, 'utf8');
    for (const e of edits) {
      const [from, to] = e.split('=>');
      // Replace only inside the internal_link_targets value, first occurrence of the raw token.
      const re = new RegExp('(internal_link_targets:[^\\n]*)' + from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      if (re.test(text)) text = text.replace(re, (m, g) => g + to);
    }
    fs.writeFileSync(p, text);
    fixedFiles.push(file);
  }
  const readmeFix = safeFixes.filter(s => s.kind === 'readme-count');
  if (readmeFix.length) {
    const p = path.join(ROOT, 'README.md');
    let text = fs.readFileSync(p, 'utf8');
    const before = text;
    // Only the exact flagged current-state lines; historical Batch records are never touched.
    for (const f of readmeFix) {
      const fixedLine = f.line.replace(f.from + ' published articles', f.to + ' published articles');
      text = text.split('\n').map(ln => (ln === f.line ? fixedLine : ln)).join('\n');
    }
    if (text !== before) { fs.writeFileSync(p, text); fixedFiles.push('README.md'); }
  }
  if (safeFixes.some(s => s.kind === 'generated-report')) {
    const r = spawnSync(process.execPath, [path.join(__dirname, 'build-report.js')], { encoding: 'utf8' });
    if (r.status === 0) fixedFiles.push('reports/quality-latest.md');
  }
  return fixedFiles;
}
if (FIX && safeFixes.length) applyFixes();

// ---------- result ----------
// Blocking = maintenance findings (P0/P1, excluding duplicates already counted
// and blocked by the QA tools' own non-zero exit) OR any QA tool that reported
// blocking findings (its exit code non-zero already surfaced as a P0 above).
const blocking = findings.filter(f => (f.severity === 'P0' || f.severity === 'P1') && !f.dup);
const reviewItems = findings.filter(f => (f.severity === 'P2' || f.severity === 'P3') && !f.dup);
// QA-tool P2/P3 findings are report-only review items, aggregated per tool.
const toolReview = {};
for (const t of tools) {
  const fs2 = ((toolResults[t].data && toolResults[t].data.findings) || []).filter(f => f.severity === 'P2' || f.severity === 'P3');
  if (fs2.length) toolReview[t] = fs2;
}
const toolReviewCount = Object.values(toolReview).reduce((a, x) => a + x.length, 0);
const result = blocking.length ? 'FAIL' : ((reviewItems.length || toolReviewCount) ? 'PASS_WITH_REVIEW' : 'PASS');

// ---------- report ----------
const now = new Date();
// Maintenance-specific totals exclude dup entries (already counted in tool totals).
const counts = { P0: 0, P1: 0, P2: 0, P3: 0 };
for (const f of findings) if (!f.dup) counts[f.severity]++;
const ilData = toolResults['internal-link-audit'] && toolResults['internal-link-audit'].data || {};
const dupData = toolResults['content-duplicate-check'] && toolResults['content-duplicate-check'].data || {};

let md = '';
md += '# Automated Maintenance Report\n\n';
md += '- Run timestamp (UTC): ' + now.toISOString() + '\n';
md += '- MAIN SHA audited: ' + mainSha() + '\n';
md += '- Mode: ' + (FIX ? 'audit + safe fixes' : 'audit only') + '\n\n';
md += '## RESULT: ' + result + '\n\n';
md += '| Metric | Value |\n|---|---|\n';
md += '| Total published articles | ' + arts.length + ' (baseline ' + baseline.articleCount + ') |\n';
md += '| Clusters | ' + Object.keys(perCluster).length + ' (baseline ' + baseline.clusters.length + ') |\n';
md += '| QA tool findings (all severities) | P0=' + toolSeverityTotals.P0 + ' P1=' + toolSeverityTotals.P1 + ' P2=' + toolSeverityTotals.P2 + ' P3=' + toolSeverityTotals.P3 + ' |\n';
md += '| Maintenance-specific findings | P0=' + counts.P0 + ' P1=' + counts.P1 + ' P2=' + counts.P2 + ' P3=' + counts.P3 + ' (excludes defects already reported by QA tools) |\n';
md += '| Blocking (P0/P1) | ' + blocking.length + ' |\n';
md += '| QA toolkit | ' + tools.map(t => t + ':' + (toolResults[t].status === 0 ? 'ok' : 'EXIT ' + toolResults[t].status)).join(', ') + ' |\n';
md += '| Assistant tests | ' + assistantSummary + ' |\n';
md += '| Broken internal links | ' + (ilData.brokenLinks !== undefined ? ilData.brokenLinks : 'n/a') + ' |\n';
md += '| Orphan pages | ' + (ilData.orphans !== undefined ? ilData.orphans : 'n/a') + ' |\n';
md += '| Duplicate findings | ' + ((dupData.findings || []).length) + ' |\n';
md += '| REVIEW_REQUIRED articles | ' + reviewRequired.length + ' (' + reviewRequired.map(a => a.name.replace(/\.md$/, '')).join(', ') + ') |\n';
md += '| Stale last_reviewed (>' + STALE_DAYS + 'd) | ' + stale.length + ' |\n';
md += '| Source/citation warnings | ' + findings.filter(f => f.area === 'sources' && !f.dup).length + ' |\n';
md += '| Sitemap status | ' + (toolResults['sitemap-check'] && toolResults['sitemap-check'].status === 0 ? 'clean (gaps=0)' : 'CHECK') + ' |\n';
md += '| Schema status | ' + (toolResults['schema-check'] && toolResults['schema-check'].status === 0 ? 'clean' : 'CHECK') + ' |\n';
md += '| Rendered-site audit | ' + (hasSite ? (toolResults['rendered-site-audit'] && toolResults['rendered-site-audit'].status === 0 ? 'pass' : 'CHECK') : 'not run (no _site build in this run)') + ' |\n\n';

md += '## Counts per cluster\n\n| Cluster | Count |\n|---|---|\n';
for (const c of L.CLUSTERS) md += '| ' + c + ' | ' + (perCluster[c] || 0) + ' |\n';

md += '\n## Blocking findings\n\n' + (blocking.length ? blocking.map(f => '- **' + f.severity + '** [' + f.area + '] ' + f.detail + ' — fix: ' + f.fix).join('\n') : 'None.') + '\n';
md += '\n## Review findings (not auto-fixed)\n\n';
{
  const lines = [];
  for (const f of reviewItems) lines.push('- ' + f.severity + ' [maintenance/' + f.area + '] ' + f.detail + ' — ' + f.fix);
  // QA-tool P2 findings, listed per tool (report-only, never auto-fixed).
  for (const t of Object.keys(toolReview)) {
    const p2 = toolReview[t].filter(f => f.severity === 'P2');
    const p3 = toolReview[t].filter(f => f.severity === 'P3');
    if (p2.length) {
      lines.push('- P2 [' + t + '] ' + p2.length + ' finding(s):');
      for (const f of p2.slice(0, 20)) lines.push('  - ' + f.issue + ' [' + f.file + ']');
      if (p2.length > 20) lines.push('  - … ' + (p2.length - 20) + ' more (see reports/' + t + '.json)');
    }
    if (p3.length) lines.push('- P3 [' + t + '] ' + p3.length + ' finding(s) — signals only; see reports/' + t + '.json');
  }
  md += (lines.length ? lines.join('\n') : 'None.') + '\n';
}
md += '\n## Safe fixes\n\n';
if (FIX) {
  md += (fixedFiles.length ? 'Applied to: ' + fixedFiles.join(', ') : 'None applicable.') + '\n';
} else {
  md += (safeFixes.length ? 'Available (run with --fix or via the workflow fix job): ' + safeFixes.map(s => s.file + ' (' + (s.kind === 'internal_link_target' ? s.from + ' -> ' + s.to : s.kind) + ')').join('; ') : 'None.') + '\n';
}
md += '\nDeliberately NOT auto-fixed: all legal, licensing, border, insurance, technical-specification, business-policy, price, travel-rule and safety claims; any ambiguous broken target; stale review content (flagged only).\n';
fs.mkdirSync(path.dirname(REPORT_MD), { recursive: true });
fs.writeFileSync(REPORT_MD, md);

fs.writeFileSync(REPORT_JSON, JSON.stringify({
  result,
  timestamp: now.toISOString(),
  sha: mainSha(),
  articleCount: arts.length,
  baselineArticleCount: baseline.articleCount,
  clusters: Object.keys(perCluster).length,
  perCluster,
  blocking: blocking.map(f => ({ severity: f.severity, area: f.area, detail: f.detail })),
  reviewItems: reviewItems.map(f => ({ severity: f.severity, area: f.area, detail: f.detail })),
  toolSeverityTotals,
  toolReviewCounts: Object.fromEntries(Object.entries(toolReview).map(([t, fs2]) => [t, fs2.length])),
  assistant: { ok: assistantOK, summary: assistantSummary },
  brokenLinks: ilData.brokenLinks !== undefined ? ilData.brokenLinks : null,
  orphans: ilData.orphans !== undefined ? ilData.orphans : null,
  reviewRequired: reviewRequired.map(a => a.name.replace(/\.md$/, '')),
  safeFixesAvailable: FIX ? [] : safeFixes,
  fixesApplied: FIX ? fixedFiles : []
}, null, 1));

console.log(md);
console.log('RESULT: ' + result + ' — report written to reports/maintenance-latest.md');
process.exit(blocking.length ? 1 : 0);
