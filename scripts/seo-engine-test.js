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
  for (const f of ['lib.js', 'seo-audit.js', 'schema-check.js', 'sitemap-check.js', 'internal-link-audit.js', 'frontmatter-check.js', 'content-duplicate-check.js', 'seo-score.js', 'fix-matrix.js', 'seo-regression.js', 'maintenance.js', 'build-report.js', 'assistant-test.js', 'seo-research-ingest.js', 'topical-map.js', 'seo-package2.js']) {
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
  // Body-level near-duplicate pair (content-factory guard): same 60-word prose, different titles.
  const twinBody = Array.from({ length: 60 }, (_, i) => 'word' + i).join(' ') + '.';
  A('dup-body-a.md', articleFm({ title: 'Body Twin A', slug: 'dup-body-a', description: 'Body twin A.', internal_link_targets: 'valid-article' }), '# Twin A\n\n' + twinBody);
  A('dup-body-b.md', articleFm({ title: 'Body Twin B', slug: 'dup-body-b', description: 'Body twin B.', internal_link_targets: 'valid-article' }), '# Twin B\n\n' + twinBody);
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
// NAP guard fixture: a contact page whose phone, address and hours drift from OWNER-FACTS.
fs.writeFileSync(path.join(ROOT, 'contact.md'), '---\ntitle: Page contact\ndescription: Fixture contact page.\n---\n# Contact\n\nCall +84 942 467 675 or visit 121 Nguyen Van Cu Street. Open 08:00-22:00 daily.\n');
const audits = runAllAudits(ROOT);
const seoRep = readJSON(ROOT, 'reports/seo-audit.json');
const seoIssues = issuesOf(seoRep);
check('seo-audit: broken internal link detected', has(seoIssues, /broken internal link \/articles\/does-not-exist\//));
check('seo-audit: accidental noindex detected', has(seoIssues, /accidental noindex/));
check('seo-audit: duplicate title detected', has(seoIssues, /duplicate title "Same Title"/));
const dupRep = readJSON(ROOT, 'reports/content-duplicate-check.json');
check('content-duplicate-check: near-duplicate body (shingle similarity) detected', has(issuesOf(dupRep), /near-duplicate body \(shingle similarity/));
check('content-duplicate-check: distinct bodies are not flagged', !has(issuesOf(dupRep, '_articles/valid-article.md'), /body/));
const schemaRep = readJSON(ROOT, 'reports/schema-check.json');
check('schema-check: NAP guard flags a wrong phone number', has(issuesOf(schemaRep, 'contact.md'), /NAP mismatch \(phone/), JSON.stringify(issuesOf(schemaRep, 'contact.md')));
check('schema-check: NAP guard flags a wrong street address', has(issuesOf(schemaRep, 'contact.md'), /NAP mismatch \(address/));
check('schema-check: NAP guard flags wrong opening hours', has(issuesOf(schemaRep, 'contact.md'), /NAP mismatch \(opening hours/));
check('schema-check: NAP guard is silent on pages without business facts', !has(issuesOf(schemaRep, 'about.md'), /NAP mismatch/));
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

// ---------- 6. DATA-DRIVEN mode: Search Console export parser and bands ----------
const LIB = require(path.join(ROOT, 'scripts', 'lib.js'));
const gscPages = LIB.parseGscCsv('Top pages,Clicks,Impressions,CTR,Position\nhttps://en.rentbikehanoi.com/articles/valid-article/,12,340,3.53%,8.2\n');
check('data-driven: Search Console pages export parsed (path normalised, CTR as a fraction)', gscPages.kind === 'pages' && gscPages.rows.length === 1 && gscPages.rows[0].page === '/articles/valid-article/' && Math.abs(gscPages.rows[0].ctr - 0.0353) < 1e-6 && gscPages.rows[0].position === 8.2, JSON.stringify(gscPages));
const gscQueries = LIB.parseGscCsv('\uFEFFTop queries,Clicks,Impressions,CTR,Position\n"motorbike rental, hanoi",3,120,2.5%,11.4\n');
check('data-driven: Search Console queries export parsed (BOM and quoted comma)', gscQueries.kind === 'queries' && gscQueries.rows[0].query === 'motorbike rental, hanoi' && gscQueries.rows[0].impressions === 120, JSON.stringify(gscQueries));
check('data-driven: quick-win band is >= 50 impressions at position 4-20', LIB.gscSignal({ clicks: 12, impressions: 340, position: 8.2, ctr: 0.035 }).kind === 'quick-win' && LIB.gscSignal({ clicks: 1, impressions: 10, position: 45, ctr: 0.1 }).kind === 'measured');
check('data-driven: low-CTR band is a top-3 position under 2% CTR with real demand', LIB.gscSignal({ clicks: 2, impressions: 400, position: 2.1, ctr: 0.005 }).kind === 'low-ctr');
check('data-driven: an unknown CSV layout is rejected, never guessed', LIB.parseGscCsv('a,b\n1,2\n').kind === 'unknown');

// ---------- 7. zero-data research ingest (classification, SERP snapshot, idempotency) ----------
{
  const INBOX = path.join(ROOT, 'docs', 'seo', 'research', 'inbox'); fs.mkdirSync(INBOX, { recursive: true });
  fs.writeFileSync(path.join(INBOX, 'serp.json'), JSON.stringify({ schema_version: 'ofe/1.0', domain: 'serp', data: { query: 'motorbike rental hanoi', location: 'Vietnam', fetched_at: '2026-10-14T00:00:00Z', item_types_present: ['local_pack', 'organic'], organic: [{ position: 1, url: 'https://example.com/', title: 'Example' }, { position: 2, url: 'https://www.tripadvisor.com/x-Nguyen_Tu', title: 'Hanoi Motorbike Rental - Nguyen Tu' }], local_pack: [{ title: 'Shop', url: 'https://shop.example/', rating: { value: 4.9, votes_count: 100 } }], people_also_ask: ['Can tourists rent a motorbike in Vietnam?'], related_searches: ['motorbike rental hanoi near me'] }, coverage: { as_of: '2026-10-14T00:00:00Z', total_available: 100 } }));
  fs.writeFileSync(path.join(INBOX, 'kw.json'), JSON.stringify({ tool: 'research_keywords', input: { seed: 'motorbike rental hanoi', location: 'Vietnam' }, result: { schema_version: 'ofe/1.0', domain: 'seo', data: { seed: 'motorbike rental hanoi', location: 'Vietnam', mode: 'suggestions', keywords: [{ keyword: 'motorbike rental hanoi', monthly_volume: 2400, cpc_usd: 0.39, competition_level: 'LOW', intent: 'transactional' }, { keyword: 'vietnamese coffee near me', monthly_volume: 49500, intent: 'transactional' }, { keyword: 'tuan motorbike rental hanoi', monthly_volume: 10, intent: 'transactional' }, { keyword: 'honda crv vietnam', monthly_volume: 40, intent: 'informational' }] }, coverage: { returned: 4, total_available: 4, as_of: '2026-10-14T00:00:00Z' } } }));
  fs.writeFileSync(path.join(INBOX, 'rank.json'), JSON.stringify({ tool: 'project_position_info', input: { locId: 2704, device: 'desktop', language: 'en' }, fetched_at: '2026-10-15T03:00:00Z', result: { complete_through: '2026-10-14', next_update: '2026-10-21', keywords: [
    { keyword: 'kw b', status: 'ok', sd: 4, volume: 0, old_position: { position: null, url: null }, new_position: { position: null, url: null } },
    { keyword: 'kw a', status: 'ok', sd: 4, volume: 0, old_position: { position: 11, url: 'https://en.rentbikehanoi.com/articles/x/' }, new_position: { position: 3, url: 'https://en.rentbikehanoi.com/articles/x/' } },
    { keyword: 'kw c', status: 'unstable', sd: 4, volume: 0, old_position: null, new_position: null },
    { keyword: 'kw d', status: 'ok', sd: 9, volume: 20, old_position: { position: 40, url: 'https://en.rentbikehanoi.com/articles/y' }, new_position: { position: 14, url: 'https://en.rentbikehanoi.com/articles/y' } },
    { keyword: 'kw e', status: 'ok', sd: 9, volume: 20, old_position: { position: 37, url: 'https://rentbikehanoi.com/' }, new_position: { position: 37, url: 'https://rentbikehanoi.com/' } }], binned: {}, summary: {} } }));
  fs.writeFileSync(path.join(INBOX, 'ai.json'), JSON.stringify({ tool: 'brand_visibility_overview', input: { project_id: 'p' }, fetched_at: '2026-10-15T03:05:00Z', result: { message: JSON.stringify({ overview: { total_prompts: 2, total_answers: 2, user_brand_total_mentions: 0, user_brand_visibility_percentage: { current: 0 }, user_brand_average_rank: { current: null }, user_brand_by_provider: [{ provider: 'openai' }] }, brand_aggregations: [{ brand_name: 'Hanoi Motorbike Rental Nguyen Tu', is_user_brand: true, total_mentions: 0 }, { brand_name: 'Nguyen Tu Hanoi Motorbike Rental', is_user_brand: false, average_rank: 2, total_mentions: 1 }, { brand_name: 'Other Shop', is_user_brand: false, average_rank: 1, total_mentions: 2 }] }) } }));
  fs.writeFileSync(path.join(INBOX, 'openseo-ai.json'), JSON.stringify({ tool: 'openseo_ai_visibility', input: { projectId: 'p', runId: 'r', locationCode: 2840, languageCode: 'en' }, fetched_at: '2026-10-15T03:50:21.336Z', result: { run: { status: 'partial', trigger: 'manual', completedAt: '2026-10-15T03:50:21.336Z' }, rows: [
    { prompt: 'How much to rent a scooter?', topic: 'Rental', engine: 'chatgpt', status: 'completed', answerStatus: 'answered', citationCount: 3, brands: [{ own: true, mentioned: false, cited: true }] },
    { prompt: 'How much to rent a scooter?', topic: 'Rental', engine: 'gemini', status: 'completed', answerStatus: 'answered', citationCount: 4, brands: [{ own: true, mentioned: false, cited: false }] },
    { prompt: 'Which licence for 125cc?', topic: 'Licence', engine: 'chatgpt', status: 'completed', answerStatus: 'answered', citationCount: 2, brands: [{ own: true, mentioned: true, cited: false }] },
    { prompt: 'Which licence for 125cc?', topic: 'Licence', engine: 'gemini', status: 'failed', answerStatus: null, citationCount: 0, brands: [] }],
    sources_by_domain: [{ domain: 'a.example', ownership: 'other', answerCount: 1, promptCount: 1, engines: [{ engine: 'gemini', answerCount: 1 }] }, { domain: 'en.rentbikehanoi.com', ownership: 'own', answerCount: 1, promptCount: 1, engines: [{ engine: 'chatgpt', answerCount: 1 }] }, { domain: 'b.example', ownership: 'other', answerCount: 3, promptCount: 2, engines: [{ engine: 'chatgpt', answerCount: 2 }, { engine: 'gemini', answerCount: 1 }] }],
    sources_by_domain_total: 5,
    sources_by_url: [{ url: 'https://en.rentbikehanoi.com/articles/motorbike-rental-price-hanoi/', title: 'Price', ownership: 'own', answerCount: 1, promptCount: 1, engines: [{ engine: 'chatgpt', answerCount: 1 }] }] } }));
  const ing1 = run(ROOT, 'seo-research-ingest.js', ['--inbox', 'docs/seo/research/inbox']);
  const evPath = path.join(ROOT, 'docs', 'seo', 'keyword-evidence.json'); const unPath = path.join(ROOT, 'docs', 'seo', 'keyword-universe.json');
  const ev1 = fs.existsSync(evPath) ? fs.readFileSync(evPath, 'utf8') : ''; const un1 = fs.existsSync(unPath) ? fs.readFileSync(unPath, 'utf8') : '';
  const ev = ev1 ? JSON.parse(ev1) : {}; const un = un1 ? JSON.parse(un1) : { rows: [] };
  const q = ev._serp_snapshot_ingested && ev._serp_snapshot_ingested.queries[0];
  check('research-ingest: SERP snapshot recorded with market, brand mention and local-pack review count', ing1.status === 0 && q && q.query === 'motorbike rental hanoi' && q.market === 'Vietnam' && q.brand_mentions.length === 1 && q.local_pack[0].reviews === 100 && q.people_also_ask.length === 1, ing1.out.split('\n').slice(-2).join(' | '));
  const row = un.rows.find(r => r.keyword === 'motorbike rental hanoi');
  check('research-ingest: on-topic keyword kept with market volume, topic and source', !!row && row.relevance === 'core' && row.topic === 'rental-hanoi' && row.volume.vn === 2400 && row.sources.length === 1, JSON.stringify(row));
  check('research-ingest: competitor brand classified, never a target', (un.rows.find(r => r.keyword === 'tuan motorbike rental hanoi') || {}).relevance === 'competitor-brand');
  check('research-ingest: off-topic rows (coffee, cars) dropped', !un.rows.some(r => /coffee|crv/.test(r.keyword)));
  run(ROOT, 'seo-research-ingest.js', ['--inbox', 'docs/seo/research/inbox']);
  check('research-ingest: re-ingesting the same files changes nothing (idempotent)', fs.readFileSync(evPath, 'utf8') === ev1 && fs.readFileSync(unPath, 'utf8') === un1);
  const trk = ev._tracking || {}; const rs0 = (trk.rank_snapshots || [])[0]; const ai0 = (trk.ai_visibility_snapshots || []).find(x => x.brand); const oa0 = (trk.ai_visibility_snapshots || []).find(x => x.by_engine);
  check('research-ingest: rank-tracker export becomes a dated snapshot (site paths, bands, unstable flagged, sorted)', !!rs0 && rs0.date === '2026-10-14' && rs0.market === 'Vietnam' && rs0.tracked === 5 && rs0.ranking === 2 && rs0.bands.top3 === 1 && rs0.bands.striking === 1 && rs0.bands.deep === 0 && rs0.bands.not_ranking === 2 && rs0.bands.unstable === 1 && rs0.rows[0].keyword === 'kw a' && rs0.rows[0].url === '/articles/x/' && rs0.rows[0].previous_position === 11 && rs0.rows.find(r => r.keyword === 'kw d').url === '/articles/y/', JSON.stringify(rs0 && rs0.bands));
  check('research-ingest: a ranking URL on another domain keeps its full address and is not counted as this site', !!rs0 && rs0.host_recorded === true && rs0.rows.find(r => r.keyword === 'kw e').url === 'https://rentbikehanoi.com/', JSON.stringify(rs0 && rs0.rows.find(r => r.keyword === 'kw e')));
  check('research-ingest: AI-visibility export keeps the brand, the name variant and the other brands', !!ai0 && ai0.date === '2026-10-15' && ai0.brand.name === 'Hanoi Motorbike Rental Nguyen Tu' && ai0.brand.total_mentions === 0 && ai0.name_variants_seen.length === 1 && ai0.name_variants_seen[0].average_rank === 2 && ai0.brands_seen.length === 1 && ai0.providers[0] === 'openai', JSON.stringify(ai0));
  check('research-ingest: multi-engine AI-answer export becomes its own dated snapshot beside the brand-visibility one (counts, failed answers, own citations by engine, site paths)', (trk.ai_visibility_snapshots || []).length === 2 && !!oa0 && oa0.date === '2026-10-15' && oa0.market === 'United States' && oa0.engines.join() === 'chatgpt,gemini' && oa0.prompts === 2 && oa0.observations === 4 && oa0.answered === 3 && oa0.own_cited_answers === 1 && oa0.own_mentioned_answers === 1 && oa0.by_engine.gemini.failed === 1 && oa0.by_engine.chatgpt.own_cited === 1 && oa0.own_cited_pages.length === 1 && oa0.own_cited_pages[0].url === '/articles/motorbike-rental-price-hanoi/', JSON.stringify(oa0 && { n: (trk.ai_visibility_snapshots || []).length, by_engine: oa0.by_engine, pages: oa0.own_cited_pages }));
  check('research-ingest: cited domains sorted by answers, ownership kept, total taken from the tool when the list is a page of it', !!oa0 && oa0.cited_domains[0].domain === 'b.example' && oa0.cited_domains[0].answers === 3 && oa0.cited_domains[0].engines.join() === 'chatgpt:2,gemini:1' && oa0.cited_domains.some(d => d.ownership === 'own') && oa0.cited_domains_total === 5, JSON.stringify(oa0 && oa0.cited_domains));
  const ING0 = require(path.join(ROOT, 'scripts', 'seo-research-ingest.js'));
  const emptyAi = ING0.openseoAiSnapshot({}, {}, '');
  check('research-ingest: AI-answer snapshot builder is pure, deterministic and tolerates an empty export', JSON.stringify(emptyAi) === JSON.stringify(ING0.openseoAiSnapshot({}, {}, '')) && emptyAi.observations === 0 && emptyAi.engines.length === 0 && emptyAi.own_cited_answers === 0 && Array.isArray(emptyAi.cited_domains), JSON.stringify(emptyAi).slice(0, 200));
  const LIBT = require(path.join(ROOT, 'scripts', 'lib.js'));
  const rsig = e => LIBT.rankSignal(e).band;
  check('lib: rankSignal bands (top3 protected, 4-10 and 11-20 quick wins, deep and none are not)', rsig([{ position: 3 }]) === 'top3' && rsig([{ position: 4 }, { position: 60 }]) === 'page1' && rsig([{ position: 11 }]) === 'striking' && rsig([{ position: 20 }]) === 'striking' && rsig([{ position: 21 }]) === 'deep' && rsig([{ position: null }]) === 'none' && rsig([]) === 'none' && LIBT.rankSignal([{ position: 12 }, { position: 8, keyword: 'k' }]).best.keyword === 'k' && LIBT.rankSignal([{ position: 12 }]).quickWin === true && LIBT.rankSignal([{ position: 2 }]).quickWin === false);
  check('lib: latestRankSnapshot picks the newest dated snapshot and tolerates none', LIBT.latestRankSnapshot({ _tracking: { rank_snapshots: [{ date: '2026-10-21', market: 'Vietnam', rows: [] }, { date: '2026-10-14', market: 'Vietnam', rows: [] }] } }).date === '2026-10-21' && LIBT.latestRankSnapshot({}) === null && LIBT.latestRankSnapshot({ _tracking: {} }) === null);
  const ING = require(path.join(ROOT, 'scripts', 'seo-research-ingest.js'));
  check('research-ingest: classification rules (other-city, licence topic, adjacent)', ING.classify('scooter rental ho chi minh') === 'other-city' && ING.topicOf('vietnam motorbike license for foreigners') === 'licence-and-paperwork' && ING.classify('traffic in vietnam') === 'adjacent' && ING.classify('harley rental') === null && ING.classify('laos motorbike loop') === 'adjacent' && ING.classify('motorbike rental laos') === 'other-city' && ING.OTHER_PLACE.test('ha giang loop motorbike rental near texas'));
}

// ---------- 8. topical map (silo integrity on a dedicated fixture) ----------
{
  const MAPROOT = mkFixture();
  const AM = (name, fm, body) => fs.writeFileSync(path.join(MAPROOT, '_articles', name), '---\n' + fm + '\n---\n' + body + '\n');
  AM('silo-a.md', articleFm({ title: 'Silo A', slug: 'silo-a', description: 'Links inside its silo.', internal_link_targets: 'valid-article' }), '# Silo A\n\nRead the [valid guide](/articles/valid-article/) first.');
  AM('silo-b.md', articleFm({ title: 'Silo B', slug: 'silo-b', description: 'Links to another silo.', search_intent: 'commercial', internal_link_targets: 'valid-article' }), '# Silo B\n\nSee the [rental hub](/topics/rental/) and {{ "/articles/silo-a/" | relative_url }}.');
  const mapRun = run(MAPROOT, 'topical-map.js');
  const mapJson = path.join(MAPROOT, 'docs', 'seo', 'topical-map.json');
  const map = fs.existsSync(mapJson) ? readJSON(MAPROOT, 'docs/seo/topical-map.json') : null;
  const sc = map && map.clusters.find(c => c.cluster === 'scooters');
  check('topical-map: runs without the matrix and writes the map', mapRun.status === 0 && !!map && map.summary.missing.length === 1 && fs.existsSync(path.join(MAPROOT, 'docs', 'seo', 'topical-map.md')), mapRun.out.split('\n').slice(-2).join(' | '));
  check('topical-map: in-silo and cross-silo in-body links counted per cluster', !!sc && sc.links.inSiloBody >= 1 && sc.links.crossSiloOut >= 1, sc ? JSON.stringify(sc.links) : 'no scooters cluster');
  check('topical-map: silo orphans (no in-silo in-body inbound) and hub start-here rule reported as REVIEW_REQUIRED', !!sc && sc.links.articlesWithoutInSiloInbound >= 1 && sc.recommendations.some(r => r.rule === 'hub-start-here' && r.status === 'REVIEW_REQUIRED'), sc ? JSON.stringify(sc.recommendations.map(r => r.rule)) : '');
  check('topical-map: commercial page with too few in-silo inbound links flagged (money-page-inbound)', !!sc && sc.recommendations.some(r => r.rule === 'money-page-inbound' && /silo-b/.test(r.detail)));
  check('topical-map: cross-silo flow recorded (scooters -> rental)', !!map && map.crossSiloEdges.some(e => e.from === 'scooters' && e.to === 'rental' && e.links >= 1));
  // Split keyword families: a split whose owners' recorded SERPs share < 3 organic URLs is
  // a verified intent split (no recommendation); one with overlapping SERPs stays a split.
  const kwRow = (keyword, servedBy) => ({ keyword, relevance: 'core', servedBy, strength: 'owner', intent: 'informational', volume: { us: 10 } });
  fs.writeFileSync(path.join(MAPROOT, 'docs', 'seo', 'english-seo-master-matrix.json'), JSON.stringify({ summary: { mode: 'ZERO-DATA', contentGaps: [], keywordOwnership: [], keywordUniverse: { volumeByMarket: { us: { core: 40, coreServed: 40 } }, mapped: [kwRow('motorbike vietnam', '/topics/scooters/'), kwRow('vietnamese motorbikes', '/topics/rental/'), kwRow('hanoi motorbike rental', '/topics/scooters/'), kwRow('motorbike rental hanoi', '/articles/silo-a/')] } }, rows: [] }));
  fs.writeFileSync(path.join(MAPROOT, 'docs', 'seo', 'keyword-evidence.json'), JSON.stringify({ _serp_snapshot_ingested: { queries: [
    { query: 'motorbike vietnam', market: 'United States', organic_top: ['1. a.com /x', '2. b.com /y', '3. c.com'] },
    { query: 'vietnamese motorbikes', market: 'United States', organic_top: ['1. d.com', '2. e.com', '3. a.com /z'] },
    { query: 'hanoi motorbike rental', market: 'United States', organic_top: ['1. a.com', '2. b.com', '3. c.com'] },
    { query: 'motorbike rental hanoi', market: 'United States', organic_top: ['1. a.com', '2. b.com', '3. c.com /'] }] } }));
  const mapRun2 = run(MAPROOT, 'topical-map.js');
  const map2 = fs.existsSync(mapJson) ? readJSON(MAPROOT, 'docs/seo/topical-map.json') : null;
  check('topical-map: split family with distinct recorded SERPs is a verified intent split, not a recommendation', mapRun2.status === 0 && !!map2 && map2.serpVerifiedSplits.length === 1 && map2.serpVerifiedSplits[0].serpCheck.pairs[0].shared === 0 && !map2.recommendations.some(r => r.rule === 'split-family' && /vietnam/.test(r.detail)), mapRun2.out.split('\n').slice(-2).join(' | '));
  check('topical-map: split family with overlapping SERPs stays a split-family recommendation', !!map2 && map2.splitFamilies.length === 1 && map2.splitFamilies[0].serpCheck.pairs[0].shared === 3 && map2.recommendations.some(r => r.rule === 'split-family' && /hanoi/.test(r.detail)), map2 ? JSON.stringify(map2.splitFamilies) : '');
  fs.rmSync(MAPROOT, { recursive: true, force: true });
}

// ---------- 5c. SEO Package 2: content word counter and content-depth gate ----------
{
  const LIB = require(path.join(SRC, 'lib.js'));
  const body = ['# Heading Words', '', 'Plain **bold** paragraph with [a link]({{ \'/articles/x/\' | relative_url }}) and `inline code`.', '',
    '```js', 'const hidden = "not counted at all";', '```', '',
    '| Col A | Col B |', '|---|---|', '| cell one | cell two |', '',
    '- list item here', '1. numbered item here', '',
    '<div class="x">html text counted</div>', '', '<!-- comment words hidden -->', '{% include foo.html %}', '',
    'Visit https://example.com/path now.', '', '![alt text](img.png)'].join('\n');
  check('word counter: counts headings, prose, list items, table cells, HTML text and link text only (28)', LIB.contentWords(body) === 28, String(LIB.contentWords(body)));
  check('word counter: ignores code, comments, Liquid, URLs, image markup and bare dashes', LIB.contentWords('one - two — three\n\n```\nhidden words here\n```\n') === 3, String(LIB.contentWords('one - two — three\n\n```\nhidden words here\n```\n')));
  check('word counter: an em dash separates words and a hyphen joins them', LIB.contentWords('alpha—beta gamma well-known') === 4, String(LIB.contentWords('alpha—beta gamma well-known')));

  const P2 = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-package2-test-'));
  for (const d of ['scripts', '_articles', 'docs/seo', 'reports']) fs.mkdirSync(path.join(P2, d), { recursive: true });
  for (const f of ['lib.js', 'seo-package2.js']) fs.copyFileSync(path.join(SRC, f), path.join(P2, 'scripts', f));
  const wordsOf = n => Array.from({ length: n }, (_, i) => 'term' + (i % 50)).join(' ');
  const PA = (slug, n, fmExtra) => fs.writeFileSync(path.join(P2, '_articles', slug + '.md'), '---\n' + articleFm(Object.assign({ title: 'T ' + slug, slug, description: 'D ' + slug }, fmExtra || {})) + '\n---\n# ' + slug + '\n\n' + wordsOf(n) + '\n');
  PA('pkg-done-ok', 1700); PA('pkg-done-short', 900); PA('pkg-pending', 350); PA('pkg-outside', 700);
  const elig = ['pkg-done-ok', 'pkg-done-short', 'pkg-pending'].map((slug, i) => ({ slug, url: '/articles/' + slug + '/', original_words: 400, group: 'A', cluster: 'scooters', subcluster: '', intent: 'informational', primary_keyword: slug, matrix_priority: 'P3', seo_status: 'AUDITED', keyword_owner: false, queue: i + 1 }));
  const writeBase = (extra) => fs.writeFileSync(path.join(P2, 'docs', 'seo', 'package2-baseline.json'), JSON.stringify(Object.assign({ package: 2, target_words: 1600, frozen: '2026-10-25', article_count: 4, eligible: elig, articleWords: { 'pkg-done-ok': 400, 'pkg-done-short': 400, 'pkg-pending': 350, 'pkg-outside': 700 } }, extra || {})));
  const writeStat = (articles) => fs.writeFileSync(path.join(P2, 'docs', 'seo', 'package2-status.json'), JSON.stringify({ batches: [], articles }));
  const gate = () => { const r = run(P2, 'seo-package2.js'); return { status: r.status, out: r.out, rep: fs.existsSync(path.join(P2, 'reports', 'seo-package2.json')) ? readJSON(P2, 'reports/seo-package2.json') : null }; };
  const issues2 = g => g.rep ? g.rep.findings.map(f => f.severity + ' ' + f.issue) : [];

  const noBase = gate();
  check('package2: no baseline means not initialised and exit 0', noBase.status === 0 && /not initialised/.test(noBase.out), noBase.out);
  writeBase(); writeStat({ 'pkg-done-ok': { status: 'DONE', batch: 'p2-01', date: '2026-10-25', qa: 'pass' }, 'pkg-done-short': { status: 'DONE', batch: 'p2-01', date: '2026-10-25', qa: 'pass' } });
  const g1 = gate();
  check('package2: a DONE article below 1,600 words is a blocking P1', g1.status === 1 && issues2(g1).some(i => /^P1 package2 article marked DONE below 1600 words \(\d+\)/.test(i)), g1.out + JSON.stringify(issues2(g1)));
  check('package2: a DONE article at or above 1,600 words passes', !issues2(g1).some(i => /pkg-done-ok/.test(i)) && g1.rep.summary.done === 2, JSON.stringify(g1.rep.summary));
  writeStat({ 'pkg-done-ok': { status: 'DONE', batch: 'p2-01', date: '2026-10-25', qa: 'pass' } });
  const g2 = gate();
  check('package2: pending articles never block (P3 only) and the summary counts them', g2.status === 0 && g2.rep.summary.pending === 2 && g2.rep.summary.done === 1 && issues2(g2).some(i => /^P3 package2 pending: 2 of 3/.test(i)), g2.out + JSON.stringify(issues2(g2)));
  writeStat({ 'pkg-done-ok': { status: 'DONE', batch: 'p2-01', date: '2026-10-25', qa: 'pass' }, 'pkg-pending': { status: 'REVIEW_REQUIRED' } });
  const g3 = gate();
  check('package2: REVIEW_REQUIRED without a reason is a non-blocking P2', g3.status === 0 && issues2(g3).some(i => /^P2 package2 REVIEW_REQUIRED entry without a reason/.test(i)), g3.out + JSON.stringify(issues2(g3)));
  writeStat({ 'pkg-done-ok': { status: 'DONE' }, 'pkg-outside': { status: 'DONE' } });
  const g4 = gate();
  check('package2: a status entry outside the frozen scope is a blocking P1', g4.status === 1 && issues2(g4).some(i => /^P1 package2 status entry outside the frozen scope: pkg-outside/.test(i)), g4.out + JSON.stringify(issues2(g4)));
  writeStat({ 'pkg-done-ok': { status: 'DONE' } });
  PA('pkg-pending', 350, { slug: 'pkg-pending-renamed' });
  const g5 = gate();
  check('package2: a changed slug or URL is a blocking P1', g5.status === 1 && issues2(g5).some(i => /^P1 package2 slug or URL changed/.test(i)), g5.out + JSON.stringify(issues2(g5)));
  PA('pkg-pending', 350);
  PA('pkg-outside', 720);
  const g6 = gate();
  check('package2: scope drift of an out-of-scope article is reported as P3 and does not block', g6.status === 0 && issues2(g6).some(i => /^P3 package2 scope drift: 1 out-of-scope/.test(i)), g6.out + JSON.stringify(issues2(g6)));
  fs.unlinkSync(path.join(P2, '_articles', 'pkg-done-short.md'));
  const g7 = gate();
  check('package2: a deleted eligible article is a blocking P1', g7.status === 1 && issues2(g7).some(i => /^P1 package2 eligible article missing/.test(i)), g7.out + JSON.stringify(issues2(g7)));
  const reinit = run(P2, 'seo-package2.js', ['--init']);
  check('package2: --init refuses to overwrite the frozen baseline', reinit.status === 1 && /frozen/.test(reinit.out), reinit.out);
  fs.rmSync(P2, { recursive: true, force: true });
}

// ---------- 5d. SEO Package 2: lint and checkpoint writer ----------
{
  const P3 = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-package2-lint-'));
  for (const d of ['scripts', '_articles', 'docs/seo', 'reports']) fs.mkdirSync(path.join(P3, d), { recursive: true });
  for (const f of ['lib.js', 'seo-package2.js']) fs.copyFileSync(path.join(SRC, f), path.join(P3, 'scripts', f));
  const uniq = (n, tag) => Array.from({ length: n }, (_, i) => (tag || 'w') + i).join(' ');
  const wr = (slug, body, fmExtra) => fs.writeFileSync(path.join(P3, '_articles', slug + '.md'), '---\n' + articleFm(Object.assign({ title: 'T ' + slug, slug, description: 'D ' + slug }, fmExtra || {})) + '\nlast_reviewed: 2026-09-01\n---\n' + body + '\n');
  const good = '## One\n\nA direct answer lead that explains the point clearly in about twenty words so a reader gets it at once and moves on.\n\n' + uniq(300, 'a') + '\n\n## Two\n\n### Sub\n\n' + uniq(300, 'b') + '\n\n## Three\n\n' + uniq(300, 'c') + ' [guide]({{ \'/articles/pkg-peer/\' | relative_url }})\n\n## Four\n\n' + uniq(300, 'd') + '\n\n## Five\n\n' + uniq(300, 'e') + '\n\n## Six\n\n' + uniq(300, 'f');
  wr('pkg-good', good); wr('pkg-peer', 'Peer article body. ' + uniq(60, 'p'));
  wr('pkg-bad', '# H1 in body\n\nShort. See [gone]({{ \'/articles/does-not-exist/\' | relative_url }}). We offer free delivery to every hotel.\n\n' + uniq(400, 'z'));
  const elig3 = ['pkg-good', 'pkg-bad'].map((slug, i) => ({ slug, url: '/articles/' + slug + '/', original_words: 400, group: 'A', cluster: 'scooters', subcluster: '', intent: 'informational', primary_keyword: 'unrelated keyword phrase', matrix_priority: 'P3', seo_status: 'AUDITED', keyword_owner: false, queue: i + 1 }));
  fs.writeFileSync(path.join(P3, 'docs', 'seo', 'package2-baseline.json'), JSON.stringify({ package: 2, target_words: 1600, frozen: '2026-10-25', base_commit: 'nonexistent', article_count: 3, eligible: elig3, articleWords: { 'pkg-good': 400, 'pkg-bad': 400, 'pkg-peer': 62 } }));
  fs.writeFileSync(path.join(P3, 'docs', 'seo', 'package2-status.json'), JSON.stringify({ batches: [], articles: {} }));
  fs.writeFileSync(path.join(P3, 'docs', 'seo', 'optimization-log.json'), '[]');
  const lg = run(P3, 'seo-package2.js', ['--lint', 'pkg-bad,pkg-good']);
  const badBlock = lg.out.split('== pkg-good')[0];
  check('package2 lint: H1 in the body, short article and broken internal link are errors', lg.status === 1 && /ERROR   H1 in the body/.test(badBlock) && /ERROR   only \d+ words/.test(badBlock) && /ERROR   broken or invalid internal link\(s\): \/articles\/does-not-exist\//.test(badBlock), lg.out.slice(0, 600));
  check('package2 lint: a new free-delivery claim is listed for confirmation', /CONFIRM free-service claim: "We offer free delivery/.test(badBlock), badBlock);
  const goodBlock = 'x' + (lg.out.split('== pkg-good')[1] || '');
  check('package2 lint: a clean 1,800-word article has no errors', /, 0 error\(s\)/.test(goodBlock) && !/ERROR/.test(goodBlock), goodBlock.slice(0, 500));
  // stricter rules: unlinked guide reference, internal process wording, link-target separator
  wr('pkg-rules', good + '\n\nThe price guide covers the full rate card and (see the section above) the rest. These rates are owner-approved figures. Read https://example.org/wiki/Thing_(Hanoi) for details.', { internal_link_targets: 'pkg-peer,pkg-good' });
  const elig4 = elig3.concat([{ slug: 'pkg-rules', url: '/articles/pkg-rules/', original_words: 400, group: 'A', cluster: 'scooters', subcluster: '', intent: 'informational', primary_keyword: 'unrelated keyword phrase', matrix_priority: 'P3', seo_status: 'AUDITED', keyword_owner: false, queue: 3 }]);
  fs.writeFileSync(path.join(P3, 'docs', 'seo', 'package2-baseline.json'), JSON.stringify({ package: 2, target_words: 1600, frozen: '2026-10-25', base_commit: 'nonexistent', article_count: 4, eligible: elig4, articleWords: { 'pkg-good': 400, 'pkg-bad': 400, 'pkg-peer': 62, 'pkg-rules': 400 } }));
  const lr = run(P3, 'seo-package2.js', ['--lint', 'pkg-rules']);
  check('package2 lint: an unlinked guide reference, process wording, a bad link-target separator and a URL with a literal parenthesis are errors', lr.status === 1 && /ERROR   \d+ unlinked guide reference\(s\)/.test(lr.out) && /ERROR   internal process wording in the reader-facing text: owner-approved/.test(lr.out) && /ERROR   internal_link_targets must be separated by ", "/.test(lr.out) && /ERROR   URL with a literal parenthesis/.test(lr.out), lr.out.slice(0, 900));
  const rcBad = run(P3, 'seo-package2.js', ['--record', 'p2-t0', '--slugs', 'pkg-bad', '--date', '2026-10-25', '--qa', 'x']);
  check('package2 record: refuses a batch whose article has lint errors and writes nothing', rcBad.status === 1 && readJSON(P3, 'docs/seo/package2-status.json').batches.length === 0, rcBad.out.slice(-300));
  const rc = run(P3, 'seo-package2.js', ['--record', 'p2-t1', '--slugs', 'pkg-good', '--date', '2026-10-25', '--qa', 'fixture pass', '--stamp']);
  const st3 = readJSON(P3, 'docs/seo/package2-status.json'), log3 = readJSON(P3, 'docs/seo/optimization-log.json');
  check('package2 record: writes DONE checkpoint, batch record and a package-2 optimization-log entry', rc.status === 0 && st3.articles['pkg-good'].status === 'DONE' && st3.articles['pkg-good'].words_before === 400 && st3.batches.length === 1 && log3.length === 1 && log3[0].package === 2 && log3[0].urls[0] === '/articles/pkg-good/', rc.out.slice(-300));
  check('package2 record: --stamp sets last_reviewed to the review date only for the recorded article', /last_reviewed: 2026-10-25/.test(fs.readFileSync(path.join(P3, '_articles', 'pkg-good.md'), 'utf8')) && /last_reviewed: 2026-09-01/.test(fs.readFileSync(path.join(P3, '_articles', 'pkg-peer.md'), 'utf8')));
  const rc2 = run(P3, 'seo-package2.js', ['--record', 'p2-t2', '--slugs', 'pkg-good', '--date', '2026-10-25', '--qa', 'again']);
  check('package2 record: an article already DONE cannot be recorded twice', rc2.status === 1, rc2.out.slice(-200));
  const rv = run(P3, 'seo-package2.js', ['--review', 'pkg-bad', '--reason', 'claim could not be verified from a primary source']);
  const rcm = run(P3, 'seo-package2.js', ['--commit', 'p2-t1', 'abc1234']);
  const st4 = readJSON(P3, 'docs/seo/package2-status.json');
  check('package2: --review marks REVIEW_REQUIRED with its reason and --commit records the merge commit', rv.status === 0 && st4.articles['pkg-bad'].status === 'REVIEW_REQUIRED' && /primary source/.test(st4.articles['pkg-bad'].reason) && rcm.status === 0 && st4.batches[0].commit === 'abc1234', rv.out + rcm.out);
  const gt = run(P3, 'seo-package2.js');
  check('package2: the gate passes on the recorded fixture (DONE article at target, REVIEW_REQUIRED with reason)', gt.status === 0, gt.out);
  fs.rmSync(P3, { recursive: true, force: true });
}

// ---------- 5e. link graph metrics and llms.txt integrity (docs/seo/research/github-seo-skills.md) ----------
{
  const LG = require(path.join(SRC, 'lib.js'));
  const ring = LG.pageRank({ a: ['b'], b: ['c'], c: ['a'] });
  check('link graph: PageRank of a three-page ring is uniform and sums to 1', Math.abs(ring.a - 1 / 3) < 1e-9 && Math.abs(ring.a + ring.b + ring.c - 1) < 1e-9, JSON.stringify(ring));
  const star = LG.pageRank({ hub: ['x', 'y'], x: ['hub'], y: ['hub'], lone: [] });
  check('link graph: PageRank favours the page every other page links to, dangling mass kept', star.hub > star.x && star.x === star.y && star.lone < star.x && Math.abs(Object.values(star).reduce((n, v) => n + v, 0) - 1) < 1e-9, JSON.stringify(star));
  const depth = LG.clickDepth({ '/': ['/a/', '/b/'], '/a/': ['/c/'], '/c/': ['/'], '/orphan/': ['/'] }, '/');
  check('link graph: click depth is breadth-first and orphans stay unreached', depth['/'] === 0 && depth['/a/'] === 1 && depth['/c/'] === 2 && !('/orphan/' in depth), JSON.stringify(depth));
  const pct = LG.percentileRanks({ a: 1, b: 2, c: 3, d: 5 }, u => (u === 'd' ? 'g2' : 'g1'));
  check('link graph: percentiles are computed inside each group', pct.a === 0 && pct.b === 50 && pct.c === 100 && pct.d === 100, JSON.stringify(pct));
  const html = '<header class="site-header"><div><a href="/x/">x</a></div></header><main class="container"><div class="article-body"><div><a href="/y/">y <b>text</b></a></div></div><aside class="related"><a href="/z/">z</a></aside></main>';
  const r = LG.elementRanges(html, 'div', 'article-body');
  check('link graph: element ranges are nesting-aware', r.length === 1 && html.slice(r[0][0], r[0][1]).endsWith('</div></div>') && html.slice(r[0][1]).startsWith('<aside'), JSON.stringify(r));
  const site = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-link-graph-'));
  const page = (u, inner) => { const d = path.join(site, u); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, 'index.html'), '<html><body>' + inner + '</body></html>'); };
  page('', '<header class="site-header"><a href="/a/">A</a></header><main class="container"><p><a href="/b/">Hanoi motorbike rental guide</a></p></main>');
  page('a', '<main class="container"><div class="article-body"><a href="/b/#top">B</a><a href="https://example.com/">ext</a></div><aside class="related"><a href="/">home</a></aside></main>');
  page('b', '<main class="container"><ul class="card-list"><li><a href="/a/">A</a></li></ul></main>');
  page('orphan', '<main class="container"><p>nothing links here</p></main>');
  const g = LG.renderedLinkGraph(site);
  const zoneOf = (from, to) => (g.edges.find(e => e.from === from && e.to === to) || {}).zone;
  check('link graph: rendered edges carry their template zone and drop external links', zoneOf('/', '/a/') === 'nav' && zoneOf('/', '/b/') === 'body' && zoneOf('/a/', '/b/') === 'body' && zoneOf('/a/', '/') === 'related' && zoneOf('/b/', '/a/') === 'listing' && g.edges.length === 5, JSON.stringify(g.edges));
  check('link graph: anchor text is kept for the anchor profile', (g.edges.find(e => e.from === '/' && e.to === '/b/') || {}).anchor === 'Hanoi motorbike rental guide');
  const adj = {}; for (const u of g.pages) adj[u] = new Set(); for (const e of g.edges) adj[e.from].add(e.to);
  check('link graph: an unlinked rendered page is unreachable from the home page', !('/orphan/' in LG.clickDepth(adj, '/')));
  fs.rmSync(site, { recursive: true, force: true });
  const base = LG.SITE_URL;
  const facts = { indexable: new Set([base + '/', base + '/faq/']), extra: new Set([base + '/sitemap.xml']), articles: 981, verified: 977, topics: 14, faqAnswers: 52 };
  const good = '# Site\n\n> Summary: 981 guides across 14 topics.\n\n- [FAQ](' + base + '/faq/): 52 answers\n- [Sitemap](' + base + '/sitemap.xml)\n';
  check('llms.txt: a file whose links and counts match the site passes', LG.llmsTxtFindings(good, facts).length === 0, JSON.stringify(LG.llmsTxtFindings(good, facts)));
  const bad = '> no title. 981 verified guides across 15 topics.\n- [Gone](' + base + '/old-page/)\n';
  const issues = LG.llmsTxtFindings(bad, facts).map(f => f.severity + ' ' + f.issue);
  check('llms.txt: missing title, broken link and wrong counts are reported', issues.some(i => /^P2 llms.txt has no H1/.test(i)) && issues.some(i => /^P1 broken internal link: llms.txt/.test(i)) && issues.some(i => /"981 verified guides" but the repository has 977/.test(i)) && issues.some(i => /"15 topics" but the repository has 14/.test(i)), JSON.stringify(issues));
  check('llms.txt: a broken llms.txt link is blocking like any broken internal link', LG.isBlocking({ severity: 'P1', issue: 'broken internal link: llms.txt ' + base + '/old-page/' }));
  check('link graph: only the own site host counts as internal', LG.internalPageHref(base + '/faq/', { '/faq/': 'f' }) === '/faq/' && LG.internalPageHref(base + '.example.com/faq/', { '/faq/': 'f' }) === null && LG.ownSitePath('https://user@' + base.replace(/^https:\/\//, '') + '.example.com/') === null);
  check('llms.txt: a lookalike host is not treated as an internal link', LG.llmsTxtFindings(good + '- [X](' + base + '.example.com/old-page/)\n', facts).length === 0);
  check('English-only guard: a language switcher finding is blocking', LG.isBlocking({ severity: 'P1', issue: 'language switcher or /vi/ link in rendered page' }));
}

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
