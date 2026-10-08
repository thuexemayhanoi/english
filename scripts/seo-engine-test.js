#!/usr/bin/env node
// ENGINE TEST SUITE — fixture-based tests for the SEO/maintenance engines.
// Everything runs inside TEMP COPIES (os.tmpdir()); the production article
// inventory is NEVER mutated. Run: node scripts/seo-engine-test.js
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const SRC = path.resolve(__dirname);
const PROD_ROOT = path.resolve(SRC, '..');
let passed = 0, failed = 0;
function check(name, ok, detail) {
  if (ok) { passed++; console.log('PASS [+] ' + name); }
  else { failed++; console.log('FAIL [-] ' + name + (detail ? ' :: ' + detail : '')); }
}

// Realistic fixture article front matter (required fields per frontmatter-check).
function articleFm(extra) {
  return Object.entries(Object.assign({
    title: 'Untitled', slug: '', description: '', topic_cluster: 'scooters',
    content_type: 'guide', search_intent: 'informational', last_reviewed: '2026-09-01'
  }, extra)).map(([k, v]) => k + ': ' + JSON.stringify(v)).join('\n');
}

function mkFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-engine-test-'));
  fs.mkdirSync(path.join(root, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(root, '_articles'), { recursive: true });
  fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
  fs.mkdirSync(path.join(root, 'topics', 'scooters'), { recursive: true });
  fs.mkdirSync(path.join(root, 'articles'), { recursive: true });
  fs.mkdirSync(path.join(root, '_layouts'), { recursive: true });
  fs.mkdirSync(path.join(root, '_includes'), { recursive: true });
  fs.mkdirSync(path.join(root, '_data'), { recursive: true });
  fs.mkdirSync(path.join(root, 'assets', 'js'), { recursive: true });
  for (const f of ['lib.js', 'seo-audit.js', 'schema-check.js', 'sitemap-check.js', 'internal-link-audit.js', 'frontmatter-check.js', 'content-duplicate-check.js', 'seo-score.js', 'fix-matrix.js', 'seo-regression.js', 'maintenance.js', 'build-report.js', 'assistant-test.js']) {
    fs.copyFileSync(path.join(SRC, f), path.join(root, 'scripts', f));
  }
  // Assistant + layout support files needed by maintenance.js in the fixture
  for (const [src, dest] of [
    [path.join(PROD_ROOT, '_layouts', 'article.html'), path.join(root, '_layouts', 'article.html')],
    [path.join(PROD_ROOT, '_includes', 'faq-body.html'), path.join(root, '_includes', 'faq-body.html')],
    [path.join(PROD_ROOT, '_data', 'assistant-business.yml'), path.join(root, '_data', 'assistant-business.yml')],
    [path.join(PROD_ROOT, 'assets', 'js', 'assistant-core.js'), path.join(root, 'assets', 'js', 'assistant-core.js')],
    [path.join(PROD_ROOT, 'assistant-index.json'), path.join(root, 'assistant-index.json')]
  ]) if (fs.existsSync(src)) fs.copyFileSync(src, dest);

  const A = (name, fm, body) => fs.writeFileSync(path.join(root, '_articles', name), '---\n' + fm + '\n---\n' + body + '\n');
  A('valid-article.md', articleFm({ title: 'Valid Article', slug: 'valid-article', description: 'A perfectly valid fixture article.', internal_link_targets: 'valid-article' }), '# Valid\n\nBody text with an [internal link](/articles/valid-article/).');
  A('broken-link-article.md', articleFm({ title: 'Broken Link', slug: 'broken-link-article', description: 'Has a broken internal link.', internal_link_targets: 'valid-article' }), '# Broken\n\nSee [missing](/articles/does-not-exist/).');
  A('broken-link-two.md', articleFm({ title: 'Broken Link Two', slug: 'broken-link-two', description: 'Another broken internal link.', internal_link_targets: 'valid-article' }), '# Broken2\n\nSee [missing](/articles/also-missing/).');
  A('noindex-article.md', articleFm({ title: 'Noindex Case', slug: 'noindex-article', description: 'Accidental noindex.', internal_link_targets: 'valid-article', robots: 'noindex' }), '# Noindex\n\nBody.');
  A('dup-title-a.md', articleFm({ title: 'Same Title', slug: 'dup-title-a', description: 'Dup A.', internal_link_targets: 'valid-article' }), '# A\n\nBody.');
  A('dup-title-b.md', articleFm({ title: 'Same Title', slug: 'dup-title-b', description: 'Dup B.', internal_link_targets: 'valid-article' }), '# B\n\nBody.');
  A('dup-title-c.md', articleFm({ title: 'Other Title', slug: 'dup-title-c', description: 'Dup C.', internal_link_targets: 'valid-article' }), '# C\n\nBody.');
  A('dup-title-d.md', articleFm({ title: 'Other Title', slug: 'dup-title-d', description: 'Dup D.', internal_link_targets: 'valid-article' }), '# D\n\nBody.');
  A('orphan-article.md', articleFm({ title: 'Orphan', slug: 'orphan-article', description: 'Orphaned article.', topic_cluster: 'badcluster', internal_link_targets: 'valid-article' }), '# Orphan\n\nBody.');
  A('autofix-target.md', articleFm({ title: 'AutoFix Target', slug: 'autofix-target', description: 'Has a normalisable link target.', internal_link_targets: 'Valid-Article, ambiguous-thing' }), '# AutoFix\n\nBody.');
  A('business-facts.md', articleFm({ title: 'Business Facts', slug: 'business-facts', description: 'Business fact protection test.', internal_link_targets: 'valid-article', phone: '+84 942 467 674', hours: '09:00-21:00 daily' }), '# Facts\n\nAddress: 112 Nguyen Van Cu Street, Bo De, Long Bien, Hanoi, Vietnam. Phone +84 942 467 674. Prices in VND stay untouched.\n\nProse paragraph that must never be rewritten by any auto-fix.');

  fs.writeFileSync(path.join(root, 'topics', 'scooters', 'index.md'), '---\nlayout: cluster\ncluster: scooters\ntitle: Scooters\ndescription: Scooter hub.\n---\nHub body\n');
  // All 14 hubs must exist (sitemap + orphan rules), each with unique title/description.
  for (const c of ['rental', 'monthly-rental', 'motorcycles', 'manual-clutch', '50cc', 'electric', 'maintenance', 'parts-gear', 'safety', 'law-licences', 'hanoi', 'trips', 'vietnam-travel']) {
    fs.mkdirSync(path.join(root, 'topics', c), { recursive: true });
    fs.writeFileSync(path.join(root, 'topics', c, 'index.md'), '---\nlayout: cluster\ncluster: ' + c + '\ntitle: Hub ' + c + '\ndescription: Fixture hub for ' + c + '.\n---\nHub body\n');
  }
  fs.writeFileSync(path.join(root, 'articles', 'index.md'), '---\ntitle: All guides\ndescription: All guides index.\n---\n# All guides\n\nIndex body\n');
  for (const p of ['about', 'search', 'faq', 'contact', 'privacy', 'terms']) {
    fs.writeFileSync(path.join(root, p + '.md'), '---\ntitle: Page ' + p + '\ndescription: Fixture page ' + p + '.\n---\n# Page ' + p + '\n\nBody.\n');
  }
  fs.writeFileSync(path.join(root, 'index.html'), '---\nlayout: default\ntitle: Fixture Home\ndescription: Fixture home page.\n---\n# Home\n\nBody.\n');
  fs.writeFileSync(path.join(root, '404.html'), '---\npermalink: /404.html\ntitle: Not found\n---\n# Not found\n');
  fs.writeFileSync(path.join(root, 'README.md'), '# Fixture\n\n- Current state: 11 published articles across all clusters.\n');
  // Production sitemap template (covers all hubs + articles) — copied so lib.sitemapLocs renders it identically.
  fs.copyFileSync(path.join(PROD_ROOT, 'sitemap.xml'), path.join(root, 'sitemap.xml'));

  const slugs = fs.readdirSync(path.join(root, '_articles')).map(f => f.replace(/\.md$/, '')).sort();
  fs.writeFileSync(path.join(root, 'scripts', 'maintenance-baseline.json'), JSON.stringify({ generated: '2026-09-28', articleCount: slugs.length, clusters: ['scooters'], perCluster: { scooters: 10, badcluster: 1 }, reviewStatus: {}, slugs, staleAfterDays: 365 }, null, 1) + '\n');
  return root;
}

function run(root, script, args) {
  const r = spawnSync(process.execPath, [path.join(root, 'scripts', script), ...(args || [])], { encoding: 'utf8', cwd: root });
  return { status: r.status, out: (r.stdout || '') + (r.stderr || '') };
}
const readJSON = (root, p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

function runAllAudits(root) {
  return ['frontmatter-check', 'content-duplicate-check', 'internal-link-audit', 'seo-audit', 'sitemap-check', 'schema-check'].map(t => run(root, t + '.js'));
}

const issuesOf = (report, file) => report.findings.filter(f => !file || f.file === file).map(f => f.issue);
const has = (arr, re) => arr.some(i => re.test(i));

// ---------- 1. SEO audit detection on the fixture ----------
const ROOT = mkFixture();
const audits = runAllAudits(ROOT);
const seoRep = readJSON(ROOT, 'reports/seo-audit.json');
const seoIssues = issuesOf(seoRep);
check('seo-audit: broken internal link detected', has(seoIssues, /broken internal link \/articles\/does-not-exist\//));
check('seo-audit: accidental noindex detected', has(seoIssues, /accidental noindex/));
check('seo-audit: duplicate title detected', has(seoIssues, /duplicate title "Same Title"/));
check('seo-audit: blocking defects make the tool exit non-zero', audits.some(a => a.status !== 0));
check('seo-audit: unknown-cluster article flagged (orphan-equivalent)', has(seoIssues, /unknown topic_cluster badcluster/));
check('seo-audit: valid article produces no finding for itself', issuesOf(seoRep, '_articles/valid-article.md').filter(i => !/internal_link/.test(i)).length === 0, JSON.stringify(issuesOf(seoRep, '_articles/valid-article.md')));

// Sitemap-gap fixture: the defective ROOT sitemap omits one hub (deterministic P1 gap).
{
  const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').replace(/\/topics\/trips\/,/g, '').replace(/\/topics\/trips\/"/g, '"');
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm);
  const smc = run(ROOT, 'sitemap-check.js');
  const smIssues = issuesOf(readJSON(ROOT, 'reports/sitemap-check.json'));
  check('seo-audit: sitemap coverage gap detected (omitted hub)', smc.status !== 0 || has(smIssues, /missing from sitemap|omitted|gap/i), JSON.stringify(smIssues.slice(0, 2)));
}

// ---------- 2. seo-score ----------
run(ROOT, 'seo-score.js');
const score = readJSON(ROOT, 'reports/seo/score.json');
check('seo-score: blocking P1 defects invalidate the overall score', score.status === 'INVALIDATED_BY_DEFECTS' && score.blockingCount > 0, 'status=' + score.status);
check('seo-score: category scores preserved when invalidated', typeof score.categoryScores.onPageStructure === 'number');

// ---------- 3. fix matrix ----------
run(ROOT, 'fix-matrix.js');
const fmRep = readJSON(ROOT, 'reports/seo/fix-matrix.json');
const dupGroups = fmRep.findings.filter(f => f.issue.startsWith('duplicate title'));
check('fix-matrix: root-cause dedup collapses duplicate-title findings into one entry', dupGroups.length === 1, 'groups=' + dupGroups.length);
check('fix-matrix: severity mapping deterministic (group severity = worst member = P1)', dupGroups.every(f => f.severity === 'P1'));
const brokenGroups = fmRep.findings.filter(f => f.area === 'seo-audit' && f.issue.startsWith('broken internal link'));
check('fix-matrix: two distinct broken links collapse by root cause template (per tool)', brokenGroups.length === 1 && brokenGroups[0].affectedCount === 2, 'groups=' + brokenGroups.length + ' affected=' + (brokenGroups[0] || {}).affectedCount);
check('fix-matrix: unambiguous internal_link_target marked auto-fixable', fmRep.findings.some(f => f.safeToAutoFix === true && /Valid-Article/.test(f.issue)));
check('fix-matrix: ambiguous target stays review-only', fmRep.findings.filter(f => /ambiguous-thing/.test(f.issue)).every(f => f.safeToAutoFix === false));
check('fix-matrix: noindex/business findings are review-only', fmRep.findings.filter(f => /noindex|Business/.test(f.issue)).every(f => f.safeToAutoFix === false));

// ---------- 4. safe fixes on a separate COPY (fixture stays pristine) ----------
const FIXROOT = mkFixture();
const beforeFacts = fs.readFileSync(path.join(FIXROOT, '_articles', 'business-facts.md'), 'utf8');
const beforeProse = fs.readFileSync(path.join(FIXROOT, '_articles', 'valid-article.md'), 'utf8');
const fixRun = run(FIXROOT, 'maintenance.js', ['--fix']);
const fixRep = readJSON(FIXROOT, 'reports/maintenance.json');
const fixedFm = fs.readFileSync(path.join(FIXROOT, '_articles', 'autofix-target.md'), 'utf8').split('\n').filter(l => l.includes('internal_link_targets')).join('');
check('safe-fix: maintenance --fix completed and wrote a report', fixRun.status !== undefined && fixRep && typeof fixRep.result === 'string', 'out=' + fixRun.out.split('\n').slice(-3).join(' | ').slice(0, 200));
check('safe-fix: deterministic target normalised (Valid-Article -> valid-article)', /^internal_link_targets: "?valid-article, ambiguous-thing"?$/.test(fixedFm.trim()), fixedFm);
check('safe-fix: ambiguous target NOT auto-fixed', fixedFm.includes('ambiguous-thing'));
check('safe-fix: business facts untouched', fs.readFileSync(path.join(FIXROOT, '_articles', 'business-facts.md'), 'utf8') === beforeFacts);
check('safe-fix: article prose untouched', fs.readFileSync(path.join(FIXROOT, '_articles', 'valid-article.md'), 'utf8') === beforeProse);
check('safe-fix: repaired file listed in fixesApplied', (fixRep.fixesApplied || []).includes('_articles/autofix-target.md'), JSON.stringify(fixRep.fixesApplied));

// ---------- 5. regression guard ----------
const REGROOT = mkFixture();
runAllAudits(REGROOT);
const updDefect = run(REGROOT, 'seo-regression.js', ['--update-baseline', '--reason', 'test']);
check('regression: baseline update REFUSED while P0/P1 defects present', updDefect.status !== 0 && /REFUSING/.test(updDefect.out), updDefect.out.split('\n')[0]);
function writeBaseline(root, metrics, reason) {
  fs.writeFileSync(path.join(root, 'scripts', 'seo-baseline.json'), JSON.stringify({ generated: '2026-09-28', updatedReason: reason, previousUpdate: null, acceptanceCriteria: 'test', metrics }, null, 2) + '\n');
}
// equal state (mirror current report counts, computed from regression.json after a compare attempt fails is fine — compute directly)
const cur = (() => {
  const seo = readJSON(REGROOT, 'reports/seo-audit.json').findings;
  const ila = readJSON(REGROOT, 'reports/internal-link-audit.json').findings;
  const cnt = re => seo.concat(ila).filter(f => re.test(f.issue)).length;
  return {
    articleCount: 11, sitemapUrlCount: 11,
    canonicalErrors: cnt(/canonical|stale \/english baseurl|stale legacy GitHub Pages URL/), brokenInternalLinks: cnt(/broken internal link/),
    orphans: cnt(/orphan/), schemaErrors: 0, duplicateTitles: cnt(/duplicate title/),
    duplicateMeta: 0, unexpectedNoindex: cnt(/accidental noindex/), reviewRequiredCount: 0
  };
})();
writeBaseline(REGROOT, cur, 'equal-state test');
const eq = run(REGROOT, 'seo-regression.js', []);
check('regression: live defects fail the guard even on an equal baseline (defects cannot be suppressed)', eq.status !== 0 && /blocking P0\/P1/.test(eq.out), eq.out.split('\n')[0]);
// clean the defects, then verify equal/improve/regress paths on a CLEAN state
const CLEAN = mkFixture();
for (const f of ['broken-link-article.md', 'broken-link-two.md', 'noindex-article.md', 'dup-title-a.md', 'dup-title-b.md', 'dup-title-c.md', 'dup-title-d.md', 'orphan-article.md', 'autofix-target.md']) fs.rmSync(path.join(CLEAN, '_articles', f));
const slugs = fs.readdirSync(path.join(CLEAN, '_articles')).map(f => f.replace(/\.md$/, '')).sort();
fs.writeFileSync(path.join(CLEAN, 'scripts', 'maintenance-baseline.json'), JSON.stringify({ generated: '2026-09-28', articleCount: slugs.length, clusters: ['scooters'], perCluster: { scooters: slugs.length }, reviewStatus: {}, slugs, staleAfterDays: 365 }, null, 1) + '\n');
fs.writeFileSync(path.join(CLEAN, 'README.md'), '# Fixture\n\n- Current state: ' + slugs.length + ' published articles across all clusters.\n');
runAllAudits(CLEAN);
const cleanMetrics = (() => {
  const r = run(CLEAN, 'seo-regression.js', ['--update-baseline', '--reason', 'clean fixture baseline']);
  const b = JSON.parse(fs.readFileSync(path.join(CLEAN, 'scripts', 'seo-baseline.json'), 'utf8'));
  return b.metrics;
})();
check('regression: clean fixture baseline update succeeds (no defects)', cleanMetrics && cleanMetrics.articleCount === slugs.length, JSON.stringify(cleanMetrics));
const eqClean = run(CLEAN, 'seo-regression.js', []);
check('regression: equal baseline passes', eqClean.status === 0 && /PASS/.test(eqClean.out), eqClean.out.split('\n')[0]);
// worsen: inject a broken link into a clean-fixture article and re-audit
const victim = path.join(CLEAN, '_articles', 'valid-article.md');
const victimBefore = fs.readFileSync(victim, 'utf8');
fs.writeFileSync(victim, victimBefore.replace('# Valid\n', '# Valid\n\n[broken](/articles/nowhere/)\n'));
runAllAudits(CLEAN);
const worse = run(CLEAN, 'seo-regression.js', []);
check('regression: worsened metric detected (exit 1 + got-worse text)', worse.status !== 0 && /got worse|FAIL/.test(worse.out), worse.out.split('\n')[0]);
// restore the clean state, then improvements must pass
fs.writeFileSync(victim, victimBefore);
runAllAudits(CLEAN);
writeBaseline(CLEAN, Object.assign({}, cleanMetrics, { brokenInternalLinks: 99, duplicateTitles: 99, canonicalErrors: 99, schemaErrors: 99, orphans: 99, unexpectedNoindex: 99, duplicateMeta: 99 }), 'improvement test');
const better = run(CLEAN, 'seo-regression.js', []);
check('regression: improvements pass', better.status === 0 && /PASS/.test(better.out), better.out.split('\n')[0]);

// ---------- 6. production isolation ----------
check('isolation: fixture articles never leaked into production', !fs.existsSync(path.join(PROD_ROOT, '_articles', 'valid-article.md')));
const prodCount = fs.readdirSync(path.join(PROD_ROOT, '_articles')).filter(f => f.endsWith('.md')).length;
check('isolation: production article inventory intact (' + prodCount + ')', prodCount === 981, String(prodCount));

fs.rmSync(ROOT, { recursive: true, force: true });
fs.rmSync(FIXROOT, { recursive: true, force: true });
fs.rmSync(REGROOT, { recursive: true, force: true });
fs.rmSync(CLEAN, { recursive: true, force: true });
console.log('RESULT: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
