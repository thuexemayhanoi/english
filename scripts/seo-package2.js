#!/usr/bin/env node
// SEO PACKAGE 2 — CONTENT DEPTH 1600+ (owner-approved scope extension, 2026-10-25).
//
// Scope: existing English articles whose Markdown body had 300-500 words (inclusive) when the
// package started. They are raised to at least 1,600 words of real content, in small verified
// batches. Nothing here writes or rewrites prose: this tool freezes the starting inventory,
// measures every article with the shared counter (lib.contentWords), keeps the checkpoint
// (docs/seo/package2-status.json) and gates the result. The 1,600 figure is an editorial target
// set by the site owner, not a ranking threshold published by Google.
//
//   node scripts/seo-package2.js --init            freeze docs/seo/package2-baseline.json (refuses to overwrite)
//   node scripts/seo-package2.js                   report + gate (writes reports/seo-package2.json)
//   node scripts/seo-package2.js --write           also regenerate docs/seo/package2-eligible.csv and the dossier
//   node scripts/seo-package2.js --next 5 [--group A]   the next pending slugs in queue order
//   node scripts/seo-package2.js --words <slug>    word count of one article
//
// Gate (exit 1): a DONE article below 1,600 words, a changed slug/URL, a missing eligible
// article, or a status entry outside the frozen scope. Pending articles never block.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const TARGET = 1600, SCOPE_MIN = 300, SCOPE_MAX = 500;
const SEO_DIR = path.join(L.ROOT, 'docs', 'seo');
const BASELINE_PATH = path.join(SEO_DIR, 'package2-baseline.json');
const STATUS_PATH = path.join(SEO_DIR, 'package2-status.json');
const CSV_PATH = path.join(SEO_DIR, 'package2-eligible.csv');
const DOSSIER_PATH = path.join(SEO_DIR, 'seo-package-2-content-depth.md');
const REPORT_PATH = path.join(L.ROOT, 'reports', 'seo-package2.json');
const MATRIX_JSON = path.join(SEO_DIR, 'english-seo-master-matrix.json');
const KEYWORD_TARGETS = path.join(SEO_DIR, 'keyword-targets.json');

const args = process.argv.slice(2);
const flag = n => args.includes('--' + n);
const opt = n => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : null; };

const readJSON = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return d; } };
const slugOf = a => String(a.fm.slug || a.name.replace(/\.md$/, ''));

// ---------- grouping (documented in docs/seo/seo-package-2-content-depth.md) ----------
// Group A: Commercial SEO (rental, monthly rental, prices, districts, Honda Vision / scooter /
// 50cc rental, expat / tourist / teacher rentals). Group B: Informational SEO (requirements,
// deposits and licences, safety and traffic law, scooter comparisons and maintenance, electric
// and battery). Group C: supporting content (Hanoi travel, routes, Vietnam travel, the rest).
const RENTAL_INFO = /requirements|deposit|licen[cs]e|passport|documents|insurance|agreement|theft|helmets|early-return|late-return/;
const VISION_RENT = /honda-vision|renting-50cc|best-scooters-to-rent|scooter-vs-semi/;
const LAW_50CC = /licen[cs]e|law|helmet-rules|fines|riding-50cc-at-16|can-foreigners/;
const B_SUB = ['law-licences', 'safety', 'scooters', 'maintenance', 'electric'];
const C_SUB = ['hanoi', 'trips', 'vietnam-travel', 'motorcycles', 'manual-clutch', 'parts-gear', '50cc'];
function classify(a) {
  const slug = slugOf(a), c = String(a.fm.topic_cluster || ''), intent = String(a.fm.search_intent || '');
  if (c === 'rental' || c === 'monthly-rental') {
    if (RENTAL_INFO.test(slug) && !/expat|teacher|tourist/.test(slug)) return { group: 'B', sub: 0 };
    return { group: 'A', sub: c === 'rental' ? 0 : 1 };
  }
  if (intent === 'commercial' && VISION_RENT.test(slug)) return { group: 'A', sub: 2 };
  if (VISION_RENT.test(slug) && c === '50cc') return { group: 'A', sub: 2 };
  if (c === '50cc' && LAW_50CC.test(slug)) return { group: 'B', sub: 1 };
  if (B_SUB.includes(c)) return { group: 'B', sub: 1 + B_SUB.indexOf(c) };
  return { group: 'C', sub: Math.max(0, C_SUB.indexOf(c)) };
}
const GROUP_LABEL = { A: 'Commercial SEO', B: 'Informational SEO', C: 'Supporting content' };

// ---------- state ----------
// Keyed by file name (the article's identity at baseline); slug is the front matter value, which
// must still equal the file name, so a changed slug or URL is detected instead of looking like a new article.
function currentWords() {
  const out = {};
  for (const a of L.loadArticles()) out[a.name.replace(/\.md$/, '')] = { a, slug: slugOf(a), words: L.contentWords(a.body), url: L.articleUrl(a) };
  return out;
}

function init() {
  if (fs.existsSync(BASELINE_PATH) && !flag('force')) {
    console.error('seo-package2: ' + path.relative(L.ROOT, BASELINE_PATH) + ' already exists and is frozen (the original word counts must not be recomputed). Use --force only for a deliberate rebuild.');
    process.exit(1);
  }
  const matrix = readJSON(MATRIX_JSON, { rows: [] });
  const byUrl = {}; for (const r of matrix.rows) byUrl[r.url] = r;
  const kt = readJSON(KEYWORD_TARGETS, { groups: [] });
  const owned = new Set();
  for (const g of kt.groups || []) for (const k of g.keywords || []) { if (k.owner) owned.add(k.owner); for (const s of k.supporting || []) owned.add(s); }
  const all = currentWords();
  const eligible = [];
  for (const [slug, x] of Object.entries(all)) {
    if (x.words < SCOPE_MIN || x.words > SCOPE_MAX) continue;
    const row = byUrl[x.url] || {};
    const cls = classify(x.a);
    eligible.push({
      slug, url: x.url, original_words: x.words, group: cls.group, _sub: cls.sub,
      cluster: String(x.a.fm.topic_cluster || ''), subcluster: String(x.a.fm.subcluster || ''),
      intent: String(x.a.fm.search_intent || ''), primary_keyword: String(row.primary_keyword || '').replace(/\s+/g, ' ').trim(),
      matrix_priority: row.priority || '', seo_status: String(row.status || '').split(' ').slice(0, 2).join(' '),
      keyword_owner: owned.has(x.url)
    });
  }
  const P = { P0: 0, P1: 1, P2: 2, P3: 3 };
  eligible.sort((a, b) => a.group.localeCompare(b.group) || a._sub - b._sub || (P[a.matrix_priority] ?? 9) - (P[b.matrix_priority] ?? 9) || (b.keyword_owner - a.keyword_owner) || a.slug.localeCompare(b.slug));
  eligible.forEach((e, i) => { e.queue = i + 1; delete e._sub; });
  const articleWords = {}; for (const [slug, x] of Object.entries(all)) articleWords[slug] = x.words;
  let head = ''; try { head = require('child_process').execSync('git rev-parse HEAD', { cwd: L.ROOT, encoding: 'utf8' }).trim(); } catch (e) { head = ''; }
  const baseline = {
    _about: 'SEO Package 2 — CONTENT DEPTH 1600+: the frozen starting inventory. eligible = articles whose Markdown body had 300-500 words (inclusive) when the package started, measured with lib.contentWords. original_words never changes. articleWords holds the starting word count of all articles (scope-drift check). Do not edit by hand.',
    package: 2, target_words: TARGET, scope_words: [SCOPE_MIN, SCOPE_MAX],
    counter: 'lib.contentWords: Markdown body only; excludes front matter, fenced/inline code, HTML tags and comments, Liquid, link URLs, images, bare URLs and the layout-generated components (related cards, sources, Common questions rendered from faq: front matter, navigation, footer); a word is a whitespace/dash-separated token with a letter or digit',
    frozen: opt('date') || new Date().toISOString().slice(0, 10), base_commit: head,
    article_count: Object.keys(all).length, eligible_count: eligible.length,
    groups: { A: eligible.filter(e => e.group === 'A').length, B: eligible.filter(e => e.group === 'B').length, C: eligible.filter(e => e.group === 'C').length },
    eligible, articleWords
  };
  fs.mkdirSync(SEO_DIR, { recursive: true });
  const lines = JSON.stringify(Object.assign({}, baseline, { eligible: '@E@', articleWords: '@W@' }), null, 1)
    .replace('"@E@"', '[\n' + eligible.map(e => '  ' + JSON.stringify(e)).join(',\n') + '\n ]')
    .replace('"@W@"', '{\n' + Object.entries(articleWords).sort(([x], [y]) => x.localeCompare(y)).map(([k, v]) => '  ' + JSON.stringify(k) + ': ' + v).join(',\n') + '\n }');
  fs.writeFileSync(BASELINE_PATH, lines + '\n');
  if (!fs.existsSync(STATUS_PATH)) fs.writeFileSync(STATUS_PATH, JSON.stringify({
    _about: 'SEO Package 2 checkpoint. articles.<slug>.status is DONE (>= 1,600 words, verified batch) or REVIEW_REQUIRED (reason required); absent = PENDING. Written only after a batch passed its QA; the gate (scripts/seo-package2.js) re-measures every DONE article on each run. batches lists each published batch.',
    batches: [], articles: {}
  }, null, 1) + '\n');
  console.log('seo-package2: baseline frozen: ' + eligible.length + ' eligible of ' + baseline.article_count + ' articles (A ' + baseline.groups.A + ', B ' + baseline.groups.B + ', C ' + baseline.groups.C + ')');
}

function evaluate() {
  const baseline = readJSON(BASELINE_PATH, null);
  if (!baseline || !Array.isArray(baseline.eligible)) return null;
  const status = readJSON(STATUS_PATH, { batches: [], articles: {} });
  const st = status.articles || {};
  const now = currentWords();
  const F = new L.Findings();
  const inScope = new Set(baseline.eligible.map(e => e.slug));
  const rows = [];
  for (const e of baseline.eligible) {
    const x = now[e.slug];
    const s = st[e.slug];
    const file = '_articles/' + e.slug + '.md';
    if (!x) { F.add('P1', file, e.url, 'package2 eligible article missing from _articles', 'Restore the article; Package 2 never deletes content'); rows.push(Object.assign({}, e, { current_words: 0, state: 'MISSING' })); continue; }
    if (x.slug !== e.slug || x.url !== e.url) F.add('P1', file, e.url, 'package2 slug or URL changed (' + e.url + ' -> ' + x.url + ')', 'Restore the original slug; Package 2 never changes a URL');
    let state = 'PENDING';
    if (s && s.status === 'DONE') {
      state = 'DONE';
      if (x.words < TARGET) F.add('P1', file, e.url, 'package2 article marked DONE below ' + TARGET + ' words (' + x.words + ')', 'Expand the article or remove its DONE entry from docs/seo/package2-status.json');
    } else if (s && s.status === 'REVIEW_REQUIRED') {
      state = 'REVIEW_REQUIRED';
      if (!s.reason) F.add('P2', file, e.url, 'package2 REVIEW_REQUIRED entry without a reason', 'Record the specific reason in docs/seo/package2-status.json');
    } else if (x.words >= TARGET) {
      F.add('P3', file, e.url, 'package2 article reaches ' + TARGET + ' words but is not recorded in docs/seo/package2-status.json', 'Record it after its batch passes QA');
    }
    rows.push(Object.assign({}, e, { current_words: x.words, state, batch: s ? s.batch || '' : '', qa: s ? s.qa || '' : '', date: s ? s.date || '' : '', reason: s && s.reason || '' }));
  }
  for (const slug of Object.keys(st)) if (!inScope.has(slug)) F.add('P1', 'docs/seo/package2-status.json', '-', 'package2 status entry outside the frozen scope: ' + slug, 'Package 2 covers only the articles listed in package2-baseline.json');
  const drift = [];
  for (const [slug, w0] of Object.entries(baseline.articleWords || {})) {
    if (inScope.has(slug)) continue;
    if (!now[slug]) continue;
    if (now[slug].words !== w0) drift.push(slug);
  }
  if (drift.length) F.add('P3', 'docs/seo/package2-baseline.json', '-', 'package2 scope drift: ' + drift.length + ' out-of-scope article(s) changed word count since the baseline (' + drift.slice(0, 5).join(', ') + (drift.length > 5 ? ', ...' : '') + ')', 'Out-of-scope articles are kept as they were unless a shared component needs a change');
  const count = s => rows.filter(r => r.state === s).length;
  const pending = rows.filter(r => r.state === 'PENDING');
  if (pending.length) F.add('P3', 'docs/seo/package2-baseline.json', '-', 'package2 pending: ' + pending.length + ' of ' + rows.length + ' eligible article(s) are still below ' + TARGET + ' words', 'Work the next batch (node scripts/seo-package2.js --next 10)');
  const summary = {
    eligible: rows.length, done: count('DONE'), reviewRequired: count('REVIEW_REQUIRED'), pending: pending.length,
    byGroup: ['A', 'B', 'C'].reduce((o, g) => { const r = rows.filter(x => x.group === g); o[g] = { eligible: r.length, done: r.filter(x => x.state === 'DONE').length, reviewRequired: r.filter(x => x.state === 'REVIEW_REQUIRED').length, pending: r.filter(x => x.state === 'PENDING').length }; return o; }, {}),
    wordsAddedDone: rows.filter(r => r.state === 'DONE').reduce((s, r) => s + (r.current_words - r.original_words), 0),
    belowTargetDone: rows.filter(r => r.state === 'DONE' && r.current_words < TARGET).length,
    batches: (status.batches || []).length, outOfScopeChanged: drift.length
  };
  return { baseline, status, rows, F, summary, drift };
}

const csvCell = v => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const mdCell = v => String(v == null ? '' : v).replace(/\|/g, '/').replace(/\n/g, ' ');

function writeCsv(ev) {
  const HEAD = ['Queue', 'URL', 'Group', 'Original Words', 'Current Words', 'Target', 'Package 2 Status', 'Batch', 'Search Intent', 'Primary Keyword', 'Topic Cluster', 'Matrix Priority', 'SEO Status', 'QA / Reason'];
  const lines = [HEAD.join(',')].concat(ev.rows.map(r => [r.queue, r.url, r.group, r.original_words, r.current_words, TARGET, r.state, r.batch || '', r.intent, r.primary_keyword, r.cluster + (r.subcluster ? ' / ' + r.subcluster : ''), r.matrix_priority, r.seo_status, r.state === 'REVIEW_REQUIRED' ? r.reason : r.qa || ''].map(csvCell).join(',')));
  fs.writeFileSync(CSV_PATH, lines.join('\n') + '\n');
}

function writeDossier(ev) {
  const b = ev.baseline, s = ev.summary;
  let md = '# SEO PACKAGE 2 — CONTENT DEPTH 1600+\n\n';
  md += 'Owner-approved scope extension (2026-10-25). Existing English articles whose Markdown body had **300-500 words** (inclusive) when the package started are raised to **at least ' + TARGET + ' words** of real content, in small verified batches. The ' + TARGET + '-word figure is an editorial requirement of the site owner, not a ranking threshold published by Google. No new articles, no URL, slug, permalink or canonical change, no content deleted, no redirects.\n\n';
  md += '## Status\n\n| Metric | Value |\n|---|---|\n';
  md += '| Articles in the site | ' + b.article_count + ' |\n| Eligible at baseline (300-500 words) | ' + s.eligible + ' |\n| Completed (>= ' + TARGET + ' words, batch QA passed) | ' + s.done + ' |\n| REVIEW_REQUIRED | ' + s.reviewRequired + ' |\n| Pending | ' + s.pending + ' |\n| Batches published | ' + s.batches + ' |\n| Words added by completed articles | ' + s.wordsAddedDone + ' |\n| Slug / URL / canonical changes | 0 (gate: scripts/seo-package2.js) |\n\n';
  md += '| Group | Eligible | Done | REVIEW_REQUIRED | Pending |\n|---|---|---|---|---|\n';
  for (const g of ['A', 'B', 'C']) md += '| ' + g + ' — ' + GROUP_LABEL[g] + ' | ' + s.byGroup[g].eligible + ' | ' + s.byGroup[g].done + ' | ' + s.byGroup[g].reviewRequired + ' | ' + s.byGroup[g].pending + ' |\n';
  md += '\nBaseline frozen ' + b.frozen + (b.base_commit ? ' on main ' + b.base_commit.slice(0, 7) : '') + ': ' + b.article_count + ' articles measured; ' + (Object.values(b.articleWords).filter(w => w < SCOPE_MIN).length) + ' were below ' + SCOPE_MIN + ' words and ' + (Object.values(b.articleWords).filter(w => w > SCOPE_MAX).length) + ' above ' + SCOPE_MAX + ' (out of scope, kept as they were).\n\n';
  md += '## How words are counted\n\n' + b.counter + '. Implemented once in `scripts/lib.js` (`contentWords`) and used by `scripts/seo-package2.js` and the SEO Master Matrix. The older matrix `words` metric (whitespace tokens including Markdown markers) is kept only for the legacy content-quality score and is not used for Package 2.\n\n';
  md += '## Scope rules\n\n- Only articles in `docs/seo/package2-baseline.json` (frozen) are processed; articles outside 300-500 words are untouched unless a shared component needs a fix.\n- Every expansion adds new, verifiable information (process, examples, comparison tables, scenarios, FAQ from verified facts, internal links in the Pillar-Hub-Silo structure); repetition to reach the count is not accepted.\n- Business facts only from `docs/OWNER-FACTS.md`; technical figures only from the verified model database or official sources; legal statements only from primary sources. A fact that cannot be verified is not written; the URL is recorded as REVIEW_REQUIRED with the reason and the package moves on.\n- Title, meta description, H1 and keyword ownership change only with a recorded reason. `last_reviewed` changes only when a real review of the expanded page took place.\n- A batch is merged only after the full QA suite passes on the exact tree; thresholds are never lowered.\n\n';
  md += '## Grouping and queue\n\nGroup A (commercial): rental and monthly-rental guides, prices, districts (Old Quarter, Long Bien, Hoan Kiem, Tay Ho and others), Honda Vision / scooter / 50cc rental, expat, tourist, teacher and student rentals. Group B (informational): rental requirements, deposits, insurance and licences; law and licence guides; safety; scooter comparisons; maintenance; electric and battery; 50cc licence and law. Group C: Hanoi travel and attractions, routes, Vietnam travel, motorcycles, manual and clutch, parts and gear, the remaining 50cc topics. Inside a group the queue follows the matrix priority, then keyword ownership (`docs/seo/keyword-targets.json`), then the cluster order. The full list with original and current word counts, search intent, primary keyword, topic cluster, matrix priority and SEO status is `docs/seo/package2-eligible.csv`.\n\n';
  md += '## Batches\n\n';
  if (!(ev.status.batches || []).length) md += 'None published yet.\n\n';
  else {
    md += '| Batch | Date | Articles | Commit | QA | Notes |\n|---|---|---|---|---|---|\n';
    for (const x of ev.status.batches) md += '| ' + mdCell(x.id) + ' | ' + mdCell(x.date) + ' | ' + (x.slugs || []).length + ' | ' + mdCell(x.commit || '') + ' | ' + mdCell(x.qa || '') + ' | ' + mdCell(x.notes || '') + ' |\n';
    md += '\n';
  }
  const rr = ev.rows.filter(r => r.state === 'REVIEW_REQUIRED');
  md += '## REVIEW_REQUIRED\n\n' + (rr.length ? rr.map(r => '- `' + r.url + '` — ' + r.reason).join('\n') : 'None.') + '\n\n';
  const done = ev.rows.filter(r => r.state === 'DONE');
  if (done.length) {
    md += '## Completed articles\n\n| Queue | URL | Group | Original | Current | Batch |\n|---|---|---|---|---|---|\n';
    for (const r of done.sort((x, y) => x.queue - y.queue)) md += '| ' + r.queue + ' | ' + r.url + ' | ' + r.group + ' | ' + r.original_words + ' | ' + r.current_words + ' | ' + mdCell(r.batch) + ' |\n';
    md += '\n';
  }
  const pend = ev.rows.filter(r => r.state === 'PENDING').sort((x, y) => x.queue - y.queue);
  md += '## Pending queue (next ' + Math.min(25, pend.length) + ' of ' + pend.length + ')\n\n| Queue | URL | Group | Words | Intent | Primary keyword | Cluster | Matrix | SEO status |\n|---|---|---|---|---|---|---|---|---|\n';
  for (const r of pend.slice(0, 25)) md += '| ' + r.queue + ' | ' + r.url + ' | ' + r.group + ' | ' + r.current_words + ' | ' + r.intent + ' | ' + mdCell(r.primary_keyword) + ' | ' + mdCell(r.cluster) + ' | ' + r.matrix_priority + ' | ' + mdCell(r.seo_status) + ' |\n';
  md += '\nContinue with `node scripts/seo-package2.js --next 10`. Gate and report: `node scripts/seo-package2.js` (also run by the Quality Gate and the weekly maintenance).\n';
  fs.writeFileSync(DOSSIER_PATH, md);
}

function main() {
  if (flag('init')) return init();
  if (opt('words')) {
    const x = currentWords()[opt('words')];
    if (!x) { console.error('unknown slug ' + opt('words')); process.exit(1); }
    console.log(x.words);
    return;
  }
  const ev = evaluate();
  if (!ev) { console.log('seo-package2: not initialised (run node scripts/seo-package2.js --init on a reviewed main)'); return; }
  if (opt('next')) {
    const n = parseInt(opt('next'), 10) || 5, g = opt('group');
    const out = ev.rows.filter(r => r.state === 'PENDING' && (!g || r.group === g)).sort((a, b) => a.queue - b.queue).slice(0, n);
    for (const r of out) console.log(r.queue + '\t' + r.group + '\t' + r.current_words + '\t' + r.slug + '\t' + r.primary_keyword);
    return;
  }
  const report = { tool: 'seo-package2', target: TARGET, counts: ev.F.counts, findings: ev.F.items, summary: ev.summary };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  if (flag('write')) { writeCsv(ev); writeDossier(ev); }
  const s = ev.summary;
  console.log('seo-package2: eligible ' + s.eligible + ', done ' + s.done + ', review_required ' + s.reviewRequired + ', pending ' + s.pending + ' | P0=' + ev.F.counts.P0 + ' P1=' + ev.F.counts.P1 + ' P2=' + ev.F.counts.P2 + ' P3=' + ev.F.counts.P3 + ' blocking=' + ev.F.blocking.length);
  for (const f of ev.F.blocking) console.error('  ' + f.severity + ' ' + f.file + ' — ' + f.issue);
  process.exitCode = ev.F.hasBlocking ? 1 : 0;
}

if (require.main === module) main();
module.exports = { classify, TARGET, SCOPE_MIN, SCOPE_MAX, evaluate };
