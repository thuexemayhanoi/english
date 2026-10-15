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
  for (const f of ['lib.js', 'seo-audit.js', 'schema-check.js', 'sitemap-check.js', 'internal-link-audit.js', 'frontmatter-check.js', 'content-duplicate-check.js', 'seo-score.js', 'fix-matrix.js', 'seo-regression.js', 'maintenance.js', 'build-report.js', 'assistant-test.js', 'seo-research-ingest.js', 'topical-map.js']) {
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
    { keyword: 'kw d', status: 'ok', sd: 9, volume: 20, old_position: { position: 40, url: 'https://en.rentbikehanoi.com/articles/y' }, new_position: { position: 14, url: 'https://en.rentbikehanoi.com/articles/y' } }], binned: {}, summary: {} } }));
  fs.writeFileSync(path.join(INBOX, 'ai.json'), JSON.stringify({ tool: 'brand_visibility_overview', input: { project_id: 'p' }, fetched_at: '2026-10-15T03:05:00Z', result: { message: JSON.stringify({ overview: { total_prompts: 2, total_answers: 2, user_brand_total_mentions: 0, user_brand_visibility_percentage: { current: 0 }, user_brand_average_rank: { current: null }, user_brand_by_provider: [{ provider: 'openai' }] }, brand_aggregations: [{ brand_name: 'Hanoi Motorbike Rental Nguyen Tu', is_user_brand: true, total_mentions: 0 }, { brand_name: 'Nguyen Tu Hanoi Motorbike Rental', is_user_brand: false, average_rank: 2, total_mentions: 1 }, { brand_name: 'Other Shop', is_user_brand: false, average_rank: 1, total_mentions: 2 }] }) } }));
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
  const trk = ev._tracking || {}; const rs0 = (trk.rank_snapshots || [])[0]; const ai0 = (trk.ai_visibility_snapshots || [])[0];
  check('research-ingest: rank-tracker export becomes a dated snapshot (site paths, bands, unstable flagged, sorted)', !!rs0 && rs0.date === '2026-10-14' && rs0.market === 'Vietnam' && rs0.tracked === 4 && rs0.ranking === 2 && rs0.bands.top3 === 1 && rs0.bands.striking === 1 && rs0.bands.not_ranking === 1 && rs0.bands.unstable === 1 && rs0.rows[0].keyword === 'kw a' && rs0.rows[0].url === '/articles/x/' && rs0.rows[0].previous_position === 11 && rs0.rows.find(r => r.keyword === 'kw d').url === '/articles/y/', JSON.stringify(rs0 && rs0.bands));
  check('research-ingest: AI-visibility export keeps the brand, the name variant and the other brands', !!ai0 && ai0.date === '2026-10-15' && ai0.brand.name === 'Hanoi Motorbike Rental Nguyen Tu' && ai0.brand.total_mentions === 0 && ai0.name_variants_seen.length === 1 && ai0.name_variants_seen[0].average_rank === 2 && ai0.brands_seen.length === 1 && ai0.providers[0] === 'openai', JSON.stringify(ai0));
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
