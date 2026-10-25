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
//   node scripts/seo-package2.js --brief <slug>    JSON brief for one article (keywords, intent, questions to serve, valid link targets)
//   node scripts/seo-package2.js --lint a,b,c      deterministic content checks for expanded articles
//   node scripts/seo-package2.js --record <batch> --slugs a,b,c --date D --qa "..." [--stamp] [--notes "..."]
//                                                  write the checkpoint, batch record and optimization-log entry
//   node scripts/seo-package2.js --review <slug> --reason "..." [--date D]    mark an article REVIEW_REQUIRED
//   node scripts/seo-package2.js --commit <batch> <sha>    record the merge commit of a published batch
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
  let head = ''; try { head = require('child_process').execFileSync('git', ['rev-parse', 'HEAD'], { cwd: L.ROOT, encoding: 'utf8' }).trim(); } catch (e) { head = ''; }
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
  // Exclusive create ('wx'): a frozen baseline is never overwritten, and there is no check-then-write race.
  try { fs.writeFileSync(BASELINE_PATH, lines + '\n', { flag: flag('force') ? 'w' : 'wx' }); } catch (e) {
    if (e.code !== 'EEXIST') throw e;
    console.error('seo-package2: ' + path.relative(L.ROOT, BASELINE_PATH) + ' already exists and is frozen (the original word counts must not be recomputed). Use --force only for a deliberate rebuild.');
    process.exit(1);
  }
  try { fs.writeFileSync(STATUS_PATH, JSON.stringify({
    _about: 'SEO Package 2 checkpoint. articles.<slug>.status is DONE (>= 1,600 words, verified batch) or REVIEW_REQUIRED (reason required); absent = PENDING. Written only after a batch passed its QA; the gate (scripts/seo-package2.js) re-measures every DONE article on each run. batches lists each published batch.',
    batches: [], articles: {}
  }, null, 1) + '\n', { flag: 'wx' }); } catch (e) { if (e.code !== 'EEXIST') throw e; }
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


// ---------- lint: deterministic checks for expanded articles ----------
// Errors block a batch; warnings and reviews are listed for the independent verifier and the
// batch report (a review item is a phrase or figure a human has to confirm against its source).
const OWNER_FACTS_PATH = path.join(L.ROOT, 'docs', 'OWNER-FACTS.md');
const FORBIDDEN = [
  [/\bfree (delivery|pick-?up|repairs?|helmets?|rescue|support|upgrade)s?\b/i, 'free-service claim'],
  [/\bno[- ]deposit\b/i, 'no-deposit claim'],
  [/\b24\s*\/\s*7\b|\b24 hours a day\b|\baround[- ]the[- ]clock\b/i, '24/7 claim'],
  [/\bguarantee[sd]?\b/i, 'guarantee wording'],
  [/\b(insurance (is |are )?(included|covered)|fully insured|comprehensive insurance)\b/i, 'insurance-included claim'],
  [/\b(best|lowest|cheapest|unbeatable|lowest-priced) (price|rate|deal)s?\b|\bcheapest\b/i, 'superlative price claim'],
  [/\b(discounts?|promotions?|promo codes?|special offers?|coupons?|vouchers?)\b/i, 'promotion/discount wording'],
  [/\b(years?|decades?) of experience\b|\bsince (19|20)\d\d\b|\bestablished in\b|\bfamily[- ]run\b/i, 'experience/history claim'],
  [/\b(thousands|hundreds|dozens) of (happy |satisfied )?(customers|renters|clients|travellers|travelers|guests)\b|\b\d[\d,]* (happy |satisfied )?(customers|renters|clients)\b/i, 'customer-number claim'],
  [/\b(our|past|previous|recent) (customers|renters|clients|guests) (say|said|tell|told|report|reported|love|loved|asked|ask)\b|\btestimonials?\b|\b(five|5)-star\b|\bcustomer reviews?\b/i, 'testimonial/review wording'],
  [/\b(we|our team|our mechanics?|i) (have |had )?(tested|rode|ridden|measured|timed|tried|inspected|checked)\b|\bin our experience\b|\bwe(’ve|'ve| have) (seen|found|noticed|learned|learnt|watched)\b|\bour (own )?(testing|test rides?|tests)\b/i, 'first-hand experience claim'],
  [/\bwe (always )?(keep|hold|take|retain) (your |the renter'?s? )?(passport|id card|identity)/i, 'document-keeping wording'],
  [/\b(credit cards?|debit cards?|visa (card|debit|credit)|mastercard|momo|paypal|apple pay|google pay)\b/i, 'payment method not approved (cash, bank transfer and QR only)'],
  [/\bfixed (delivery )?(fee|charge|price)\b|\bdelivery (is )?(free|included)\b/i, 'delivery fee claim'],
  [/\b(24-hour|roadside) (rescue|assistance|help|recovery)\b|\bnationwide (rescue|support|coverage)\b|\bunlimited support\b/i, 'rescue/support claim'],
  [/\bfleet of \d+|\b\d+ (bikes|motorbikes|scooters) (in (our|the) fleet|available)\b|\blargest fleet\b/i, 'fleet-size claim'],
  [/\b(always|guaranteed|every day) (in stock|available)\b|\bwill (always )?be available\b/i, 'availability guarantee'],
  [/\b(tigit|style motorbikes?|happy ?zip|riderly|tuan motorbikes?|james motorbikes?|the extra mile|motogo|rentalmotorbike\w*)\b/i, 'competitor brand name']
];
const normSent = t => t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const sentencesOf = text => text.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z0-9"'(‘“])/).map(x => x.trim()).filter(Boolean);
const fmLine = (raw, key) => { const m = raw.match(new RegExp('^' + key + ':[ \\t]*(.*)$', 'm')); return m ? m[1].trim() : null; };
const fmRaw = raw => { const e = raw.indexOf('\n---', 3); return e < 0 ? '' : raw.slice(4, e); };
function fmList(raw, key) {
  const lines = fmRaw(raw).split('\n'); const out = []; let on = false;
  for (const ln of lines) { if (new RegExp('^' + key + ':').test(ln)) { on = true; continue; } if (on) { if (/^\s+-\s+/.test(ln)) out.push(ln.replace(/^\s+-\s+/, '').trim()); else if (/^[A-Za-z0-9_]+:/.test(ln)) on = false; } }
  return out;
}
function originalRaw(slug, baseCommit) {
  if (!/^[0-9a-f]{7,40}$/i.test(String(baseCommit)) || !/^[a-z0-9][a-z0-9-]*$/.test(String(slug))) return null;
  try { return require('child_process').execFileSync('git', ['show', baseCommit + ':_articles/' + slug + '.md'], { cwd: L.ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 24 }); } catch (e) { return null; }
}
function allowedAmounts(extraText) {
  const set = new Set();
  let facts = ''; try { facts = fs.readFileSync(OWNER_FACTS_PATH, 'utf8'); } catch (e) { facts = ''; }
  const src = facts + '\n' + (extraText || '');
  for (const m of src.matchAll(/\d{1,3}(?:,\d{3})+/g)) set.add(m[0]);
  return set;
}
function lintArticle(slug, now, baseline) {
  const x = now[slug]; const e = (baseline.eligible || []).find(q => q.slug === slug);
  const res = { slug, words: x ? x.words : 0, errors: [], warnings: [], reviews: [], stats: {} };
  if (!x || !e) { res.errors.push('not an eligible Package 2 article'); return res; }
  const body = x.a.body, text = L.contentText(body), raw = x.a.raw;
  const E = m => res.errors.push(m), W = m => res.warnings.push(m), R = m => res.reviews.push(m);
  if (x.words < TARGET) E('only ' + x.words + ' words (target ' + TARGET + ')');
  if (x.words > 3200) W(x.words + ' words: far above the usual 1,700-2,400; check for padding');
  if (/^#\s/m.test(body.replace(/^[ \t]*(```|~~~)[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*$/gm, ''))) E('H1 in the body (the layout renders the title as the only H1)');
  const h2 = (body.match(/^##\s+\S/gm) || []).length, h3 = (body.match(/^###\s+\S/gm) || []).length;
  res.stats.h2 = h2; res.stats.h3 = h3;
  if (h2 < 5) W('only ' + h2 + ' H2 sections for a ' + x.words + '-word article');
  if (h3 === 0) W('no H3 sub-headings');
  if (/^####\s/m.test(body) && !h3) W('H4 without H3');
  const hasTable = /^\|.*\|\s*$/m.test(body) && /^\|?\s*:?-{2,}/m.test(body);
  res.stats.table = hasTable;
  const paras = body.split(/\n\s*\n/).map(p => L.contentText(p).trim()).filter(p => p && !/^\|/.test(p));
  const longParas = paras.filter(p => p.split(/\s+/).length > 130).length;
  if (longParas) W(longParas + ' paragraph(s) over 130 words (mobile readability)');
  const lead = paras.find(p => !/^#/.test(p)) || ''; const leadWords = lead.split(/\s+/).filter(Boolean).length;
  res.stats.leadWords = leadWords;
  if (leadWords < 15 || leadWords > 90) W('lead paragraph has ' + leadWords + ' words (a direct-answer lead of about 20-80 words is expected)');
  // links
  const links = L.extractLinks(body);
  const slugs = new Set(Object.keys(now));
  const internal = links.filter(h => h.startsWith('/'));
  const bad = [];
  for (const h of internal) {
    const t = h.split('#')[0].split('?')[0];
    const am = t.match(/^\/articles\/([^/]+)\/$/), tm = t.match(/^\/topics\/([^/]+)\/$/);
    if (am) { if (!slugs.has(am[1])) bad.push(t); else if (am[1] === slug) bad.push(t + ' (self link)'); }
    else if (tm) { if (!L.CLUSTERS.includes(tm[1])) bad.push(t); }
    else if (!['/', '/articles/', '/faq/', '/contact/', '/about/', '/search/', '/privacy/', '/terms/'].includes(t)) bad.push(t);
  }
  if (bad.length) E('broken or invalid internal link(s): ' + [...new Set(bad)].join(', '));
  const uniqueInternal = new Set(internal.map(h => h.split('#')[0])).size;
  res.stats.internalLinks = internal.length; res.stats.uniqueInternalTargets = uniqueInternal;
  if (uniqueInternal < 6) W('only ' + uniqueInternal + ' distinct internal link targets in the body (6-14 expected)');
  if (internal.length > 28) W(internal.length + ' internal links in the body (over-linking)');
  const dupTargets = {}; for (const h of internal) dupTargets[h.split('#')[0]] = (dupTargets[h.split('#')[0]] || 0) + 1;
  for (const [t, n] of Object.entries(dupTargets)) if (n > 3) W('link target ' + t + ' used ' + n + ' times');
  const external = links.filter(h => /^https?:/i.test(h));
  if (external.some(h => /^http:/i.test(h))) E('non-HTTPS external link');
  if (external.length > 6) W(external.length + ' external links in the body');
  // anchors
  for (const m of body.matchAll(/\[([^\]]+)\]\(/g)) if (/^(click here|here|read more|this link|link)$/i.test(m[1].trim())) { W('non-descriptive anchor text: "' + m[1] + '"'); break; }
  // repetition and padding
  const sents = sentencesOf(text).map(normSent).filter(t => t.split(' ').length >= 8);
  const seen = {}; let dupSent = 0;
  for (const t of sents) { seen[t] = (seen[t] || 0) + 1; if (seen[t] === 2) dupSent++; }
  res.stats.sentences = sents.length;
  if (dupSent >= 2) E(dupSent + ' sentences repeated verbatim inside the article'); else if (dupSent === 1) W('1 sentence repeated verbatim inside the article');
  const toks = normSent(text).split(' ').filter(Boolean); const grams = {}; let totalG = 0;
  for (let i = 0; i + 6 <= toks.length; i++) { const g = toks.slice(i, i + 6).join(' '); grams[g] = (grams[g] || 0) + 1; totalG++; }
  const repG = Object.values(grams).filter(n => n > 1).reduce((a, n) => a + n, 0); const repRate = totalG ? repG / totalG : 0;
  res.stats.repeated6gramPct = Math.round(repRate * 1000) / 10;
  if (repRate > 0.12) E('repeated 6-word phrases make up ' + res.stats.repeated6gramPct + '% of the article (padding)'); else if (repRate > 0.06) W('repeated 6-word phrases make up ' + res.stats.repeated6gramPct + '% of the article');
  const avgSent = sents.length ? toks.length / sentencesOf(text).length : 0; res.stats.avgSentenceWords = Math.round(avgSent * 10) / 10;
  if (avgSent > 28) W('average sentence length ' + res.stats.avgSentenceWords + ' words');
  // keyword density
  const kw = normSent(e.primary_keyword || '');
  if (kw && kw.split(' ').length >= 2) { const n = (normSent(text).match(new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g')) || []).length; res.stats.primaryKeywordExact = n; if (n > 10) E('primary keyword "' + kw + '" appears ' + n + ' times (keyword stuffing)'); else if (n > 6) W('primary keyword "' + kw + '" appears ' + n + ' times'); }
  // forbidden claims: only sentences that are new (not in the original article) and not negated
  // ("there is no guaranteed delivery time" is the approved wording); the verifier reads each in context.
  const orig = originalRaw(slug, baseline.base_commit);
  const origBody = orig ? L.parseFrontMatter(orig).body : '';
  const origNorm = ' ' + normSent(L.contentText(origBody)) + ' ';
  const NEGATED = /\b(no|not|never|without|cannot|can't|cant|doesn't|does not|do not|don't|nor|neither|isn't|is not|aren't|are not|won't|will not|rather than|instead of|avoid|beware|myth|scam|unlicensed)\b/i;
  const NEG_OK = new Set(['guarantee wording', 'free-service claim', '24/7 claim', 'insurance-included claim', 'delivery fee claim', 'rescue/support claim', 'availability guarantee', 'no-deposit claim', 'promotion/discount wording', 'document-keeping wording', 'fleet-size claim', 'payment method not approved (cash, bank transfer and QR only)']);
  for (const sent of sentencesOf(text)) {
    if (origNorm.includes(' ' + normSent(sent) + ' ')) continue;
    for (const [re, label] of FORBIDDEN) if (re.test(sent) && !(NEG_OK.has(label) && NEGATED.test(sent))) R(label + ': "' + sent.slice(0, 200) + '"');
  }
  // amounts: anything neither approved in OWNER-FACTS nor already in the original article needs a cited source
  const allowed = allowedAmounts(origBody);
  const amounts = new Set(); for (const m of text.matchAll(/\d{1,3}(?:,\d{3})+/g)) amounts.add(m[0]);
  for (const a of amounts) if (!allowed.has(a)) R('amount ' + a + ' is neither in docs/OWNER-FACTS.md nor in the original article: needs a cited source');
  for (const m of text.matchAll(/\b\d{1,3}\s?k\s?(?:VND|vnd|d)\b|\b\d+(?:\.\d+)?\s?(?:million|triệu)\b/gi)) if (!origNorm.includes(' ' + normSent(m[0]) + ' ')) R('abbreviated amount "' + m[0] + '": use the exact approved VND figures');
  for (const m of text.matchAll(/(?:\+?84|0)[\s.-]?9\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/g)) if (m[0].replace(/\D/g, '').replace(/^84/, '0') !== '0942467674') E('phone number ' + m[0] + ' differs from docs/OWNER-FACTS.md');
  // against the original
  if (orig) {
    const o = L.parseFrontMatter(orig); const oRaw = orig;
    for (const k of ['slug', 'category', 'content_type', 'search_intent', 'topic_cluster', 'subcluster', 'date_published', 'review_status']) if (fmLine(oRaw, k) !== fmLine(raw, k)) E('front matter "' + k + '" changed');
    for (const k of ['title', 'description']) if (fmLine(oRaw, k) !== fmLine(raw, k)) W('front matter "' + k + '" changed: needs a recorded reason');
    if (fmLine(oRaw, 'last_reviewed') !== fmLine(raw, 'last_reviewed')) W('last_reviewed changed: only after a real review (use --record --stamp)');
    const oSrc = fmList(oRaw, 'sources'), nSrc = fmList(raw, 'sources');
    for (const s of oSrc) if (!nSrc.includes(s)) E('an existing sources entry was removed or edited: ' + s.slice(0, 80));
    const oSent = sentencesOf(L.contentText(o.body)).map(normSent).filter(t => t.split(' ').length >= 6);
    const newText = ' ' + normSent(text) + ' ';
    const kept = oSent.filter(t => newText.includes(' ' + t + ' ')).length;
    const keptPct = oSent.length ? kept / oSent.length : 1; res.stats.originalSentencesKeptPct = Math.round(keptPct * 100);
    if (keptPct < 0.6) E('only ' + res.stats.originalSentencesKeptPct + '% of the original sentences remain (existing content must not be deleted)'); else if (keptPct < 0.8) W(res.stats.originalSentencesKeptPct + '% of the original sentences remain: list every removed or reworded passage in the batch notes');
    const oLinks = new Set(L.extractLinks(o.body).filter(h => h.startsWith('/')).map(h => h.split('#')[0]));
    const nLinks = new Set(internal.map(h => h.split('#')[0]));
    const lost = [...oLinks].filter(h => !nLinks.has(h)); if (lost.length) W('original internal link(s) no longer in the body: ' + lost.join(', '));
    const oExt = fmList(oRaw, 'internal_link_targets');
  } else W('original not found in git history (' + baseline.base_commit + '): comparison checks skipped');
  const itl = fmLine(raw, 'internal_link_targets');
  if (itl) for (const t of itl.replace(/^"|"$/g, '').split(',').map(v => v.trim()).filter(Boolean)) if (!slugs.has(t)) E('internal_link_targets references a missing slug: ' + t);
  return res;
}

function runLint(list, baseline) {
  const now = currentWords(); let errors = 0; const out = [];
  for (const slug of list) {
    const r = lintArticle(slug, now, baseline); out.push(r); errors += r.errors.length;
    console.log('== ' + slug + ': ' + r.words + ' words, ' + r.errors.length + ' error(s), ' + r.warnings.length + ' warning(s), ' + r.reviews.length + ' item(s) to confirm; ' + JSON.stringify(r.stats));
    for (const m of r.errors) console.log('  ERROR   ' + m);
    for (const m of r.warnings) console.log('  WARN    ' + m);
    for (const m of r.reviews) console.log('  CONFIRM ' + m);
  }
  if (flag('json')) fs.writeFileSync(path.join(L.ROOT, 'reports', 'seo-package2-lint.json'), JSON.stringify(out, null, 1));
  return errors;
}

// ---------- brief: everything a writer or verifier needs about one article ----------
const STOP = new Set(['a', 'an', 'the', 'in', 'of', 'for', 'to', 'and', 'with', 'by', 'on', 'at', 'is', 'are', 'vs', 'what', 'how', 'do', 'does', 'you', 'your', 'it', 'or', 'from', 'vietnam', 'hanoi', 'motorbike', 'motorbikes', 'guide']);
const toks = t => String(t || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)).map(w => w.replace(/(ing|es|s)$/, ''));
function brief(slug) {
  const ev = evaluate(); if (!ev) { console.error('not initialised'); process.exit(1); }
  const e = ev.baseline.eligible.find(q => q.slug === slug); if (!e) { console.error(slug + ' is not in the frozen scope'); process.exit(1); }
  const all = L.loadArticles(); const me = all.find(a => slugOf(a) === slug);
  const matrix = readJSON(MATRIX_JSON, { rows: [], summary: {} }); const row = matrix.rows.find(r => r.url === e.url) || {};
  const kt = readJSON(KEYWORD_TARGETS, { groups: [] }); const owns = [], supports = [], ownerUrls = new Set();
  for (const g of kt.groups || []) for (const k of g.keywords || []) {
    if (k.owner === e.url) owns.push(k.keyword); if ((k.supporting || []).includes(e.url)) supports.push(k.keyword);
    if (k.owner && k.owner.startsWith('/articles/')) ownerUrls.add(k.owner); for (const u of k.supporting || []) if (u.startsWith('/articles/')) ownerUrls.add(u);
  }
  const evidence = readJSON(path.join(SEO_DIR, 'keyword-evidence.json'), {}); const snap = L.latestRankSnapshot(evidence);
  const ranks = snap ? snap.rows.filter(r => r.url === e.url && r.position != null).map(r => ({ keyword: r.keyword, position: r.position, tracker_date: snap.date })) : [];
  const cited = ((matrix.summary || {}).aiVisibility || {}).ownPages || []; const aiCited = cited.find(c => c.url === e.url) || null;
  const questions = ((matrix.summary || {}).contentGaps || []).filter(g => g.servedBy === e.url).map(g => g.question);
  const kws = (((matrix.summary || {}).keywordUniverse || {}).mapped || []).filter(k => k.servedBy === e.url && k.relevance !== 'other').map(k => k.keyword);
  const myToks = new Set(toks(String(me.fm.title) + ' ' + e.primary_keyword + ' ' + (me.fm.tags || []).join(' ')));
  const score = a => toks(String(a.fm.title) + ' ' + (a.fm.tags || []).join(' ')).filter(t => myToks.has(t)).length;
  const info = a => ({ slug: slugOf(a), title: String(a.fm.title), words: L.contentWords(a.body), cluster: a.fm.topic_cluster, content_type: a.fm.content_type, review_status: String(a.fm.review_status || '') });
  const others = all.filter(a => slugOf(a) !== slug);
  const sameSub = others.filter(a => a.fm.subcluster && a.fm.subcluster === me.fm.subcluster).sort((a, b) => score(b) - score(a)).slice(0, 14).map(a => Object.assign(info(a), { why: 'same subcluster' }));
  const owners = others.filter(a => ownerUrls.has(L.articleUrl(a)) && !sameSub.some(x => x.slug === slugOf(a))).sort((a, b) => (b.fm.topic_cluster === me.fm.topic_cluster) - (a.fm.topic_cluster === me.fm.topic_cluster) || score(b) - score(a)).slice(0, 10).map(a => Object.assign(info(a), { why: 'keyword owner / money page' }));
  const taken = new Set(sameSub.concat(owners).map(x => x.slug));
  const related = others.filter(a => !taken.has(slugOf(a)) && score(a) > 0).sort((a, b) => score(b) - score(a)).slice(0, 12).map(a => Object.assign(info(a), { why: 'title/tag overlap' }));
  const legal = others.filter(a => a.fm.content_type === 'legal' && String(a.fm.review_status).toUpperCase() === 'VERIFIED').sort((a, b) => score(b) - score(a)).slice(0, 8).map(a => Object.assign(info(a), { why: 'VERIFIED legal guide (restate its facts with a link; cite its primary sources)' }));
  const out = {
    slug, url: e.url, title: String(me.fm.title), description: String(me.fm.description), hub: '/topics/' + me.fm.topic_cluster + '/',
    group: e.group, queue: e.queue, cluster: me.fm.topic_cluster, subcluster: me.fm.subcluster, content_type: me.fm.content_type, search_intent: me.fm.search_intent,
    review_status: me.fm.review_status || null, original_words: e.original_words, current_words: L.contentWords(me.body),
    primary_keyword: e.primary_keyword, secondary_keywords: row.secondary_keywords || '', matrix_priority: e.matrix_priority, seo_status: row.status || e.seo_status,
    owns_keywords: owns, supports_keywords: supports, serp_questions_to_serve: questions, related_keywords_served: kws.slice(0, 20),
    flags: { ranks_in_tracker: ranks, ai_answer_cited: aiCited ? { answers: aiCited.answers, engines: aiCited.engines } : null, has_faq_front_matter: /^faq:/m.test(fmRaw(me.raw)), existing_sources: fmList(me.raw, 'sources').length, existing_internal_link_targets: String(fmLine(me.raw, 'internal_link_targets') || '') },
    link_candidates: Object.fromEntries(Object.entries({ same_subcluster: sameSub, keyword_owners_and_money_pages: owners, related_by_title: related, verified_legal_guides: legal }).map(([k, v]) => [k, v.map(x => x.slug + ' | ' + x.title + ' | ' + x.cluster + ' | ' + x.words + ' words')]))
  };
  console.log(JSON.stringify(out, null, 1));
}

// ---------- checkpoint writers ----------
function writeJSON(p, v) { fs.writeFileSync(p, JSON.stringify(v, null, 1) + '\n'); }
function record() {
  const id = opt('record'), date = opt('date'), qa = opt('qa') || '', notes = opt('notes') || '';
  const slugList = String(opt('slugs') || '').split(',').map(v => v.trim()).filter(Boolean);
  if (!id || !date || !slugList.length) { console.error('usage: --record <batch> --slugs a,b --date YYYY-MM-DD --qa "..." [--stamp] [--notes "..."]'); process.exit(1); }
  const ev = evaluate(); if (!ev) { console.error('not initialised'); process.exit(1); }
  const status = ev.status; status.articles = status.articles || {}; status.batches = status.batches || [];
  if (status.batches.some(b => b.id === id)) { console.error('batch ' + id + ' is already recorded'); process.exit(1); }
  const errs = runLint(slugList, ev.baseline);
  if (errs) { console.error('seo-package2: lint errors, nothing recorded'); process.exit(1); }
  const now = currentWords(); let before = 0, after = 0;
  for (const slug of slugList) {
    const e = ev.baseline.eligible.find(q => q.slug === slug); const x = now[slug];
    if (status.articles[slug] && status.articles[slug].status === 'DONE') { console.error(slug + ' is already DONE'); process.exit(1); }
    before += e.original_words; after += x.words;
    status.articles[slug] = { status: 'DONE', batch: id, date, words_before: e.original_words, words: x.words, qa };
    if (flag('stamp')) {
      const fp = path.join(L.ROOT, '_articles', slug + '.md'); let raw = fs.readFileSync(fp, 'utf8');
      if (!/^last_reviewed:/m.test(raw)) { console.error(slug + ' has no last_reviewed line'); process.exit(1); }
      fs.writeFileSync(fp, raw.replace(/^last_reviewed:.*$/m, 'last_reviewed: ' + date));
    }
  }
  status.batches.push({ id, date, slugs: slugList, words_before: before, words_after: after, qa, notes, commit: '' });
  writeJSON(STATUS_PATH, status);
  // optimization log entry (package: 2 never changes the Status column; rank_work when a tracked URL is worked on)
  const logPath = path.join(SEO_DIR, 'optimization-log.json'); const log = readJSON(logPath, []);
  const evidence = readJSON(path.join(SEO_DIR, 'keyword-evidence.json'), {}); const snap = L.latestRankSnapshot(evidence);
  const urls = slugList.map(sl => '/articles/' + sl + '/');
  const ranked = snap ? urls.filter(u => snap.rows.some(r => r.url === u && r.position != null)) : [];
  log.push({ date, batch: 'package2-' + id, package: 2, note: 'SEO Package 2 content depth: ' + slugList.length + ' article(s) expanded to at least ' + TARGET + ' words (' + before + ' -> ' + after + ' words); same URL, slug and canonical' + (notes ? '; ' + notes : ''), urls, rank_work: ranked.length > 0, counts: { articles: slugList.length, wordsBefore: before, wordsAfter: after, wordsAdded: after - before, rankTrackedUrls: ranked.length } });
  writeJSON(logPath, log);
  console.log('seo-package2: batch ' + id + ' recorded: ' + slugList.length + ' article(s), ' + before + ' -> ' + after + ' words' + (ranked.length ? ' (rank work on ' + ranked.length + ' tracked URL(s))' : ''));
}
function markReview() {
  const slug = opt('review'), reason = opt('reason'), date = opt('date') || new Date().toISOString().slice(0, 10);
  const ev = evaluate(); if (!ev) { console.error('not initialised'); process.exit(1); }
  if (!ev.baseline.eligible.some(e => e.slug === slug)) { console.error(slug + ' is not in the frozen scope'); process.exit(1); }
  if (!reason) { console.error('--reason is required'); process.exit(1); }
  const status = ev.status; status.articles = status.articles || {}; status.articles[slug] = { status: 'REVIEW_REQUIRED', date, reason };
  writeJSON(STATUS_PATH, status); console.log('seo-package2: ' + slug + ' marked REVIEW_REQUIRED');
}
function recordCommit() {
  const i = args.indexOf('--commit'); const id = args[i + 1], sha = args[i + 2];
  const status = readJSON(STATUS_PATH, null); const b = status && (status.batches || []).find(x => x.id === id);
  if (!b || !sha) { console.error('usage: --commit <batch> <sha> (batch must be recorded)'); process.exit(1); }
  b.commit = sha; writeJSON(STATUS_PATH, status); console.log('seo-package2: batch ' + id + ' commit ' + sha);
}

function main() {
  if (flag('init')) return init();
  if (opt('brief')) return brief(opt('brief'));
  if (opt('record')) return record();
  if (opt('review')) return markReview();
  if (flag('commit')) return recordCommit();
  if (opt('lint')) {
    const b = readJSON(BASELINE_PATH, null); if (!b) { console.error('not initialised'); process.exit(1); }
    process.exit(runLint(String(opt('lint')).split(',').map(v => v.trim()).filter(Boolean), b) ? 1 : 0);
  }
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
