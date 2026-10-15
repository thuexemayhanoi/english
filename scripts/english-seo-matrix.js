#!/usr/bin/env node
// ENGLISH SEO MASTER MATRIX — per-URL audit state for every indexable page.
//
// Consumes (never duplicates) the existing engines: reports/*.json written by
// the QA toolkit (run `node scripts/build-report.js` first), the content
// planning matrix docs/matrix/master-matrix.csv, article front matter, and the
// hand-authored keyword ownership map docs/seo/keyword-targets.json.
//
// Writes:
//   docs/seo/english-seo-master-matrix.csv   full matrix (one row per URL)
//   docs/seo/english-seo-master-matrix.json  same rows + summary, machine-readable
//   docs/seo/english-seo-master-matrix.md    summary + P0/P1/P2 rows in full, P3 compact
//   docs/seo/english-keyword-clusters.md     keyword groups -> owner URLs, cluster map,
//                                            cannibalization watchlist, gaps
//
// Rules: deterministic, read-only against the site (never rewrites content),
// never invents metrics. Search-volume/ranking figures appear only when a
// recorded evidence file (docs/seo/keyword-evidence.json) exists; otherwise the
// Evidence column states that no English Search Console export is available
// (docs/SOURCE-MAP.md). Per-URL status is maintained by humans/agents in
// docs/seo/matrix-status.json and merged in, never guessed.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const OUT_DIR = path.join(L.ROOT, 'docs', 'seo');
const TODAY = new Date().toISOString().slice(0, 10);
const TITLE_MAX = 65;   // same thresholds as scripts/seo-audit.js
const DESC_MAX = 165;

// ---------- helpers ----------
function readJSON(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return fallback; }
}
function parseCsv(text) {
  const rows = []; let row = []; let field = ''; let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length > 1 || (r[0] || '').trim() !== '');
}
const csvCell = v => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const mdCell = v => String(v == null ? '' : v).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const normTitle = s => String(s || '').toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const stem = w => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '').replace(/(ing|ers|er|ed|es|al)$/, '').replace(/^vietnamese$/, 'vietnam');
const KW_STOP = new Set(['a', 'an', 'the', 'in', 'of', 'for', 'to', 'and', 'with', 'by', 'on', 'at']);
function keywordCoverage(keyword, text) {
  const norm = s => String(s).toLowerCase().replace(/licen[cs]e/g, 'license').replace(/motorcycle/g, 'motorbike');
  const toks = norm(keyword).split(/\s+/).filter(t => t && !KW_STOP.has(t)).map(stem);
  const hay = new Set(norm(text).split(/[^a-z0-9]+/).filter(Boolean).map(stem));
  const hit = toks.filter(t => hay.has(t)).length;
  if (!toks.length) return 'n/a';
  if (hit === toks.length) return 'full';
  if (hit >= Math.ceil(toks.length / 2)) return 'partial';
  return 'weak';
}
const words = body => L.stripLiquid(body).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const firstParagraph = body => {
  const paras = L.stripLiquid(body).replace(/<[^>]+>/g, ' ').split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('<'));
  return paras[0] || '';
};
// Prose references to another guide that are not hyperlinks (README "see our guide" class).
// A reference counts as unlinked only when the words that name the other guide
// are plain prose. Existing links are replaced by a marker first, so
// "covered in our [brakes guide](...)" or "(see our [IDP guide](...))" never count.
const LINK_MARK = '\u00a7LINK\u00a7';
const UNLINKED_REF_PATTERNS = [
  /see our guide (?:to|on) [a-z]/i,
  /\bthe (?![a-z \-]*\bthis (?:article|guide)\b)[a-z][a-z \-]{2,40} (?:article|guide) (?:lists|covers|explains|walks|goes|shows|has|describes)\b/i,
  /(?<!\u00a7[^.]{0,30})\b(?:our|the) (?:separate|dedicated|companion|full) (?:guide|article)\b/i,
  /covered in (?:our|the|a separate) (?![^.]{0,40}\u00a7)[a-z]/i,
  /\(see (?:(?!\u00a7)[^)]){3,80}\)/i
];
function unlinkedRefs(body) {
  const text = L.stripLiquid(body);
  // Replace existing markdown/html links by a marker so linked references are not counted.
  const noLinks = text.replace(/\[[^\]]*\]\([^)]*\)/g, ' ' + LINK_MARK + ' ').replace(/<a [^>]*>[\s\S]*?<\/a>/gi, ' ' + LINK_MARK + ' ');
  let n = 0;
  for (const re of UNLINKED_REF_PATTERNS) { const m = noLinks.match(new RegExp(re.source, re.flags + 'g')); if (m) n += m.length; }
  return n;
}

// ---------- inputs ----------
const articles = L.loadArticles();
const pages = L.loadPages().filter(p => !p.file.startsWith('_') && !/^(404\.html|README\.md|AGENTS\.md)$/.test(p.file));
const reports = {};
for (const t of ['seo-audit', 'content-duplicate-check', 'internal-link-audit', 'frontmatter-check', 'schema-check', 'sitemap-check', 'rendered-site-audit']) {
  reports[t] = readJSON(path.join(L.ROOT, 'reports', t + '.json'), null);
}
const missingReports = Object.keys(reports).filter(t => !reports[t] && t !== 'rendered-site-audit');
if (missingReports.length) console.warn('english-seo-matrix: missing reports (run node scripts/build-report.js first): ' + missingReports.join(', '));

const findingsByUrl = {};
for (const [tool, rep] of Object.entries(reports)) {
  if (!rep || !Array.isArray(rep.findings)) continue;
  for (const f of rep.findings) {
    if (!f.url || f.url === '-') continue;
    (findingsByUrl[f.url] = findingsByUrl[f.url] || []).push(Object.assign({ tool }, f));
  }
}

// Planning matrix (docs/matrix/master-matrix.csv, no header row; schema in docs/MASTER-MATRIX.md).
const planRows = parseCsv(fs.existsSync(path.join(L.ROOT, 'docs', 'matrix', 'master-matrix.csv')) ? fs.readFileSync(path.join(L.ROOT, 'docs', 'matrix', 'master-matrix.csv'), 'utf8') : '');
const planByTitle = {};
for (const r of planRows) {
  // 36 cluster-7 rows (MM-0755..MM-0793) were recorded without the topic column
  // (title, primary query, subcluster, intent, cluster, ...). Detect that layout by
  // shape so the primary query is never read from the subcluster column.
  const shifted = /^\d+\.\d+ /.test(r[3] || '') && /^\d+-/.test(r[5] || '');
  const row = shifted
    ? { id: r[0], topic: '', title: r[1], primaryQuery: r[2], intent: r[4], cluster: r[5], subcluster: r[3], contentType: r[6], audience: r[7], sourceBasis: r[9], closest: r[11], differentiation: r[12], status: r[15] }
    : { id: r[0], topic: r[1], title: r[2], primaryQuery: r[3], intent: r[4], cluster: r[5], subcluster: r[6], contentType: r[7], audience: r[8], sourceBasis: r[9], closest: r[12], differentiation: r[13], status: r[15] };
  if (row.title) planByTitle[normTitle(row.title)] = row;
  if (row.topic) planByTitle[normTitle(row.topic)] = planByTitle[normTitle(row.topic)] || row;
}

// Keyword ownership map.
const kwTargets = readJSON(path.join(OUT_DIR, 'keyword-targets.json'), { groups: [] });
const ownerMap = {};   // url -> { primary: [], variants: [], supporting: [], notes: [], gaps: [] }
const allKeywords = [];
for (const g of kwTargets.groups || []) {
  for (const k of g.keywords || []) {
    const rec = Object.assign({ group: g.group }, k);
    allKeywords.push(rec);
    const o = ownerMap[k.owner] = ownerMap[k.owner] || { primary: [], variants: [], supporting: [], notes: [], gaps: [] };
    // Variants and gap keywords are served, not owned: they never make a URL P1 on their own.
    if (k.variant_of || k.gap || k.tracked) o.variants.push(k.keyword); else o.primary.push(k.keyword);
    if (k.note) o.notes.push(k.note);
    if (k.gap) o.gaps.push(k.keyword);
    for (const s of k.supporting || []) {
      const so = ownerMap[s] = ownerMap[s] || { primary: [], variants: [], supporting: [], notes: [], gaps: [] };
      so.supporting.push(k.keyword);
    }
  }
}
// Owner resolver (shared by the rank tracker, the keyword universe and the content gap register)
const { classify: classifyKeyword, OTHER_PLACE } = require('./seo-research-ingest.js');
const GAP_STOP = new Set('a an the of for to in on and or with your you our this that is are how what when where why which who do does can at by from vs versus i my it its be need needed want get'.split(' '));
// A trailing "e" is dropped after the suffix so singular and plural share one stem
// (motorbike/motorbikes -> motorbik, licence/licenses -> licens, bike/bikes -> bik).
// "used" (second-hand) is kept whole so it never collides with "use"; on two wheels
// "drive" and "ride" ask the same question, so they share one stem.
const gapStem = w => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^used$/, 'secondhand').replace(/(ing|ers|er|ed|es|s)$/, '').replace(/e$/, '').replace(/licenc/, 'licens').replace(/motorcycl/, 'motorbik').replace(/^rental$/, 'rent').replace(/^hir$/, 'hire').replace(/^vietnames$/, 'vietnam').replace(/^driv$/, 'rid');
const gapSig = s => [...new Set(String(s).toLowerCase().replace(/\bair[\s-]+blade\b/g, 'airblade').split(/[^a-z0-9]+/).filter(w => w && !GAP_STOP.has(w)).map(gapStem).filter(w => w.length > 1))];
// Generic words (the site's own subject) never count as the distinguishing
// match; a question is served only when its distinctive words are found.
const GAP_GENERIC = new Set(['motorbik', 'rental', 'rent', 'hanoi', 'vietnam', 'scoot', 'bik', 'bike', 'rid', 'ride', 'hire', 'vietnames']);
// Hand-authored owners (keyword-targets.json) answer a query first, in the keyword
// universe and in the content gap register alike: the exact declared keyword; then the
// same stemmed word set (owners sharing one set, "Motorbike Vietnam" for the travel
// pillar and "Vietnamese motorbikes" for the motorcycles pillar, have different SERPs
// recorded in keyword-evidence.json, so the exact keyword decides and otherwise the first
// declared owner serves); then an owner whose words the query contains with only the
// site's generic subject words added. A declared GAP keyword is served weakly.
const ownerSigs = allKeywords.map(k => ({ sig: gapSig(k.keyword), owner: k.owner, keyword: k.keyword, gap: !!k.gap, supporting: k.supporting || [], exact: String(k.keyword).toLowerCase().replace(/\s+/g, ' ').trim() }));
function ownerResolve(query) {
  const sig = gapSig(query); if (!sig.length) return null;
  const setEq = (a, b) => a.length === b.length && a.every(w => b.includes(w));
  const exact = String(query).toLowerCase().replace(/[?!.]+$/, '').replace(/\s+/g, ' ').trim();
  let o = ownerSigs.find(x => x.exact === exact);
  if (!o) o = ownerSigs.find(x => setEq(x.sig, sig));
  if (!o) o = ownerSigs.filter(x => x.sig.every(w => sig.includes(w)) && sig.every(w => x.sig.includes(w) || GAP_GENERIC.has(w))).sort((a, b) => b.sig.length - a.sig.length)[0];
  if (o && o.gap) return { url: o.owner, how: 'declared GAP keyword (' + o.keyword + '): nearest existing URL, no dedicated page', strength: 'partial', keyword: o.keyword, supporting: o.supporting };
  if (o) return { url: o.owner, how: 'keyword-targets owner (' + o.keyword + ')', strength: 'owner', keyword: o.keyword, supporting: o.supporting };
  return null;
}
const statusMap = readJSON(path.join(OUT_DIR, 'matrix-status.json'), {});
const evidenceMap = readJSON(path.join(OUT_DIR, 'keyword-evidence.json'), null);
// Rank-tracker snapshot (third-party, measured, dated; docs/seo/keyword-evidence.json _tracking.rank_snapshots,
// ingested by scripts/seo-research-ingest.js): which URL Google serves for each tracked keyword, compared
// with the hand-declared owner in keyword-targets.json. Positions only: no clicks, impressions or traffic.
const rankSnap = L.latestRankSnapshot(evidenceMap);
const rankByUrl = {}; const rankTable = []; const rankMismatchByUrl = {};
if (rankSnap) for (const r of rankSnap.rows) {
  const res = ownerResolve(r.keyword); const own = res && res.strength === 'owner' ? res : null;
  let match = 'no owner declared';
  if (r.position == null || !r.url) match = r.status === 'unstable' ? 'unstable (tool)' : 'not in the top 100';
  else if (own) match = own.url === r.url ? 'owner' : (own.supporting || []).includes(r.url) ? 'supporting page' : 'different URL';
  if (r.position != null && r.url) (rankByUrl[r.url] = rankByUrl[r.url] || []).push({ keyword: r.keyword, position: r.position });
  rankTable.push({ keyword: r.keyword, position: r.position, url: r.url, previous: r.previous_position, owner: own ? own.url : '', match });
  if (match === 'different URL' && r.position <= 20) {
    (rankMismatchByUrl[own.url] = rankMismatchByUrl[own.url] || []).push('rank tracker: ' + r.url + ' ranks #' + r.position + ' for "' + r.keyword + '" instead of this declared owner');
    (rankMismatchByUrl[r.url] = rankMismatchByUrl[r.url] || []).push('rank tracker: this URL ranks #' + r.position + ' for "' + r.keyword + '", declared for ' + own.url);
  }
}
// scripts/link-bare-slugs.js --apply records which articles had bare slug
// references converted into contextual links; that becomes the default status
// for those URLs unless matrix-status.json says something more specific.
const linkRepair = readJSON(path.join(L.ROOT, 'reports', 'link-bare-slugs.json'), null);
const linkRepairByFile = {};
if (linkRepair && linkRepair.mode === 'apply') for (const f of linkRepair.perFile || []) linkRepairByFile[f.file] = { links: f.links, date: String(linkRepair.generated || '').slice(0, 10) };
// docs/seo/optimization-log.json records verified optimisation batches:
// [{ date, batch, note, urls: [...] }]. A URL in one or more batches shows
// OPTIMIZED with every batch note, unless matrix-status.json overrides it.
const optLog = readJSON(path.join(OUT_DIR, 'optimization-log.json'), []);
const optByUrl = {};
for (const b of Array.isArray(optLog) ? optLog : []) for (const u of b.urls || []) (optByUrl[u] = optByUrl[u] || []).push({ date: b.date, note: b.note || b.batch, rank: !!b.rank_work });
// A URL worked on for its rank signal (optimization-log batch with rank_work: true) after the rank
// snapshot date is not raised again from that snapshot: the next snapshot decides whether the work
// moved the position (signal -> work -> re-measure). Unrelated edits never silence the signal.
const workedSinceRank = url => !!rankSnap && (optByUrl[url] || []).some(o => o.rank && String(o.date) > String(rankSnap.date));
// AI-answer checks (third-party tool, dated): which engines cite which pages of this site for the tracked prompts.
// Evidence only: a citation is a source link shown with an AI answer, never a ranking, click or traffic figure.
const aiSnaps = (evidenceMap && evidenceMap._tracking && Array.isArray(evidenceMap._tracking.ai_visibility_snapshots) ? evidenceMap._tracking.ai_visibility_snapshots : []).filter(x => x && x.date)
  .sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.tool).localeCompare(String(b.tool)));
const aiBrandSnap = aiSnaps.filter(x => x.brand).pop() || null;      // brand-visibility shape: providers, brand, name variants
const aiEngineSnap = aiSnaps.filter(x => x.by_engine).pop() || null; // prompt x engine shape: own citations, cited domains
const aiCitedByUrl = {}; if (aiEngineSnap) for (const pg of aiEngineSnap.own_cited_pages || []) aiCitedByUrl[pg.url] = pg;

// Site config (homepage falls back to site title/description).
const cfg = fs.readFileSync(path.join(L.ROOT, '_config.yml'), 'utf8');
const siteTitle = (cfg.match(/^title:\s*(.+)$/m) || [, 'Hanoi Motorbike Guide'])[1].trim();
const siteDesc = (cfg.match(/^description:\s*(.+)$/m) || [, ''])[1].trim();

// Link graph from front matter (related cards) — the only explicit inter-article links today.
const bySlug = {}; for (const a of articles) bySlug[a.fm.slug] = a;
const relatedIn = {}; const relatedOut = {};
for (const a of articles) {
  const targets = String(a.fm.internal_link_targets || '').split(',').map(s => s.trim()).filter(Boolean);
  relatedOut[a.fm.slug] = targets;
  for (const t of targets) relatedIn[t] = (relatedIn[t] || 0) + 1;
}
// Explicit body links from any source page to articles/hubs.
const bodyIn = {};
for (const src of articles.concat(pages)) {
  for (const href of L.extractLinks(src.body)) {
    const t = href.split('#')[0].split('?')[0];
    if (t.startsWith('/')) bodyIn[t] = (bodyIn[t] || 0) + 1;
  }
}

// ---------- row assembly ----------
const rows = [];

function qualityBucket(m) {
  let s = 0;
  if (m.words >= 450) s += 2; else if (m.words >= 300) s += 1;
  if (m.h2 >= 3) s += 1;
  if (m.tables > 0) s += 1;
  if (m.sources > 0) s += 1;
  if (m.leadWords >= 20 && m.leadWords <= 70) s += 1; // concise direct-answer opening
  if (m.bodyLinks > 0) s += 1;
  const label = s >= 5 ? 'strong' : s >= 3 ? 'adequate' : 'thin';
  return label + ' (' + s + '/7)';
}

function describeIssues(x) {
  const issues = [];
  const own = ownerMap[x.url] || { primary: [], variants: [], supporting: [], notes: [], gaps: [] };
  const fl = findingsByUrl[x.url] || [];
  for (const f of fl) {
    if (/near-duplicate title/.test(f.issue)) continue; // reported via cannibalization column
    issues.push(f.severity + ' ' + f.issue + ' [' + f.tool + ']');
  }
  if (x.type === 'article') {
    if (x.m.bodyLinks === 0) issues.push('no contextual in-body links (related cards only)');
    if (x.m.unlinkedRefs > 0) issues.push(x.m.unlinkedRefs + ' unlinked guide reference(s) in prose');
    if ((relatedIn[x.slug] || 0) === 0 && (bodyIn[x.url] || 0) === 0) issues.push('zero explicit inbound links (hub listing only)');
    if (x.m.words < 300) issues.push('short body (' + x.m.words + ' words)');
  }
  if (x.type === 'hub') {
    if (x.m.bodyLinks < 3) issues.push('hub lists guides dynamically but curates no start-here links (' + x.m.bodyLinks + ' body links)');
    if (x.m.words < 80) issues.push('thin hub intro (' + x.m.words + ' words)');
  }
  for (const k of own.primary) {
    const cov = keywordCoverage(k, x.title + ' ' + x.description);
    if (cov !== 'full') issues.push('keyword "' + k + '" only ' + cov + 'ly covered by title+description');
  }
  for (const k of own.variants) {
    const cov = keywordCoverage(k, x.title + ' ' + x.description);
    if (cov === 'weak') issues.push('served keyword "' + k + '" weakly covered by title+description (variant/gap: informational signal)');
  }
  const rs = L.rankSignal(rankByUrl[x.url]);
  if (rs.quickWin && !workedSinceRank(x.url)) issues.push('ranks #' + rs.best.position + ' for "' + rs.best.keyword + '" (' + rankSnap.date + '): quick win, the page already earns the impression');
  return issues;
}

function cannibalization(x) {
  const out = [];
  const fl = findingsByUrl[x.url] || [];
  for (const f of fl) {
    const m = f.issue.match(/near-duplicate title \(similarity ([\d.]+)\) vs _articles\/([^.]+)\.md/);
    if (m) out.push('near-duplicate title vs /articles/' + m[2] + '/ (sim ' + m[1] + ')');
  }
  // reverse direction (the report attributes the pair to the later file only)
  for (const [url, fl2] of Object.entries(findingsByUrl)) {
    for (const f of fl2) {
      const m = f.issue.match(/near-duplicate title \(similarity ([\d.]+)\) vs _articles\/([^.]+)\.md/);
      if (m && '/articles/' + m[2] + '/' === x.url) out.push('near-duplicate title vs ' + url + ' (sim ' + m[1] + ')');
    }
  }
  if (!workedSinceRank(x.url)) for (const n of rankMismatchByUrl[x.url] || []) out.push(n);
  return out;
}

function recommend(x, issues, cann, own) {
  const acts = [];
  if (x.reviewRequired) acts.push('Owner re-verification against primary sources, then VERIFIED with a new last_reviewed');
  if (x.titleLen > TITLE_MAX) acts.push('Trim title to <=' + TITLE_MAX + ' chars, primary keyword first, same URL');
  if (x.descLen > DESC_MAX) acts.push('Tighten meta description to 120-160 chars with the primary keyword and a direct answer');
  if (x.type === 'article' && x.m.bodyLinks === 0) acts.push('Add 2-4 contextual in-body links (topic hub + supporting guides)');
  if (x.type === 'article' && x.m.unlinkedRefs > 0) acts.push('Convert the ' + x.m.unlinkedRefs + ' unlinked guide reference(s) into real links');
  const rs = L.rankSignal(rankByUrl[x.url]);
  if (rs.quickWin && !workedSinceRank(x.url)) acts.push('Quick win (rank tracker, ' + rankSnap.date + '): ranks #' + rs.best.position + ' for "' + rs.best.keyword + '"; sharpen the title, description and lead for that query and add 2-3 contextual links from related guides, never changing the URL');
  if ((rankMismatchByUrl[x.url] || []).length && !workedSinceRank(x.url)) acts.push('Rank tracker shows Google serving a different URL than the declared owner for a tracked keyword: link the pair with natural anchor text and keep their angles apart; do not move or merge content');
  if (cann.length) acts.push('Differentiate angle (audience/question/use case) in title, description and H2s; cross-link the pair');
  if (issues.some(i => /zero explicit inbound/.test(i))) acts.push('Add this slug to internal_link_targets of 2-3 related guides');
  if (x.type === 'hub') acts.push('Pillar page: direct-answer intro + curated start-here links to the commercial and core guides');
  if (own.gaps.length) acts.push('Serve gap keyword(s) ' + own.gaps.join('; ') + ' honestly from this URL; do NOT create a new article');
  if (issues.some(i => /only (partial|weak)ly covered/.test(i))) acts.push('Work the owned keyword naturally into title or description without stuffing');
  if (!acts.length) acts.push('Monitor; no action required');
  return acts.join('. ') + '.';
}

function priority(x, issues, cann, own) {
  const fl = findingsByUrl[x.url] || [];
  if (fl.some(L.isBlocking)) return 'P0';
  const coreOwner = own.primary.length > 0;
  const hardIssues = issues.filter(i => !/^served keyword|^ranks #/.test(i));
  if ((coreOwner || x.type === 'hub') && hardIssues.length) return 'P1';
  if (x.reviewRequired) return 'P1';
  if (cann.some(c => /sim (0\.9|1\.0)/.test(c))) return 'P1';
  const commercial = /commercial|transactional/.test(x.intent);
  // Soft signals never drive a priority on their own: an article with related
  // cards, a hub kicker and breadcrumbs is already well linked, and a short
  // body is never lengthened to hit a quota. They still drive P2 on the money
  // pages (commercial intent in the rental clusters), where a contextual link
  // from the prose to the hub or the price/booking guides is worth hand work.
  const soft = i => /no contextual in-body links|short body/.test(i);
  const driving = issues.filter(i => !soft(i) && !/^served keyword|^ranks #/.test(i));
  const moneyPage = commercial && /^(rental|monthly-rental)$/.test(String(x.cluster));
  if ((commercial && driving.length) || (moneyPage && issues.some(i => /no contextual in-body links/.test(i))) || cann.length || (L.rankSignal(rankByUrl[x.url]).quickWin && !workedSinceRank(x.url)) || issues.some(i => /zero explicit inbound|unlinked guide reference/.test(i))) return 'P2';
  return 'P3';
}

function evidence(x, own) {
  const parts = [];
  parts.push('title_len=' + x.titleLen + '; desc_len=' + x.descLen);
  if (x.type !== 'page') parts.push('words=' + x.m.words + '; h2=' + x.m.h2 + '; tables=' + x.m.tables + '; sources=' + x.m.sources + '; body_links=' + x.m.bodyLinks);
  if (x.type === 'article') parts.push('related_out=' + (relatedOut[x.slug] || []).length + '; related_in=' + (relatedIn[x.slug] || 0) + '; body_in=' + (bodyIn[x.url] || 0));
  if (x.type === 'hub') parts.push('guides_listed=' + x.m.listed);
  const fl = findingsByUrl[x.url] || [];
  if (fl.length) parts.push(fl.map(f => f.tool + ': ' + f.issue.replace(/ vs _articles\/.*$/, '')).join(' | '));
  if (x.plan) parts.push('plan ' + x.plan.id + ' (' + x.plan.sourceBasis + ')' + (x.plan.differentiation ? ': ' + x.plan.differentiation : ''));
  if (own.notes.length) parts.push('ownership note: ' + own.notes.join(' / '));
  if (rankByUrl[x.url]) parts.push('rank tracker (' + rankSnap.tool + ', ' + rankSnap.market + ' ' + rankSnap.device + ', ' + rankSnap.date + '): ' + rankByUrl[x.url].map(r => '#' + r.position + ' "' + r.keyword + '"').join(', ') + (workedSinceRank(x.url) ? ' (worked on since: re-evaluate at the next snapshot)' : ''));
  if (aiCitedByUrl[x.url]) { const c = aiCitedByUrl[x.url]; parts.push('AI answers (' + aiEngineSnap.tool + ', ' + aiEngineSnap.market + ', ' + aiEngineSnap.date + '): cited as a source in ' + c.answers + ' answer(s) for ' + c.prompts + ' prompt(s) (' + c.engines.join(', ') + '); keep its facts and answer-first text accurate and stable'); }
  const ev = evidenceMap && (evidenceMap[x.url] || null);
  parts.push(ev ? 'recorded metrics: ' + JSON.stringify(ev) : 'GSC(EN): no export available (docs/SOURCE-MAP.md); no third-party metrics recorded');
  return parts.join(' || ');
}

function buildRow(x) {
  const own = ownerMap[x.url] || { primary: [], variants: [], supporting: [], notes: [], gaps: [] };
  const issues = describeIssues(x);
  const cann = cannibalization(x);
  const plan = x.plan;
  let primary = own.primary[0] || (plan && plan.primaryQuery) || '';
  if (!primary) {
    primary = String(x.title).split(/[:?(]/)[0].toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const secondary = [];
  for (const k of own.primary.slice(1).concat(own.variants, own.supporting)) if (!secondary.includes(k) && k !== primary) secondary.push(k);
  for (const t of (Array.isArray(x.tags) ? x.tags : [])) if (secondary.length < 10 && !secondary.includes(t)) secondary.push(t);
  const st = statusMap[x.url] || statusMap[x.slug];
  const repair = x.file ? linkRepairByFile[x.file] : null;
  const opts = optByUrl[x.url] || [];
  const optText = opts.length ? 'OPTIMIZED ' + opts[opts.length - 1].date + ' - ' + opts.map(o => o.note).join('; ') : '';
  const repairText = repair ? repair.links + ' bare slug reference(s) converted to contextual links' : '';
  const status = st ? (st.status + (st.date ? ' ' + st.date : '') + (st.note ? ' - ' + st.note : ''))
    : x.reviewRequired ? 'REVIEW_REQUIRED (awaiting owner re-verification)' + (optText ? '; ' + optText.toLowerCase() : '')
    : optText ? optText + (repairText ? '; ' + repairText : '')
    : repair ? 'LINKS_REPAIRED ' + repair.date + ' - ' + repairText + ' (scripts/link-bare-slugs.js)'
    : 'AUDITED ' + TODAY;
  const linkSummary = x.type === 'article'
    ? 'out: ' + x.m.bodyLinks + ' body + ' + (relatedOut[x.slug] || []).length + ' related cards; in: ' + (relatedIn[x.slug] || 0) + ' related + ' + (bodyIn[x.url] || 0) + ' body + hub listing'
    : x.type === 'hub' ? 'out: ' + x.m.bodyLinks + ' curated + ' + x.m.listed + ' dynamic cards; in: nav/footer/home + ' + (bodyIn[x.url] || 0) + ' body'
    : 'out: ' + x.m.bodyLinks + ' body; in: nav/footer + ' + (bodyIn[x.url] || 0) + ' body';
  return {
    url: x.url,
    type: x.type,
    current_title: x.title,
    primary_keyword: primary,
    secondary_keywords: secondary.join('; '),
    search_intent: x.intent,
    topic_cluster: x.cluster + (x.subcluster ? ' / ' + x.subcluster : ''),
    content_quality: x.type === 'page' ? 'n/a (utility page)' : qualityBucket(x.m),
    cannibalization: cann.length ? cann.join('; ') : 'none detected',
    internal_links: linkSummary,
    seo_issues: issues.length ? issues.join('; ') : 'none',
    priority: priority(x, issues, cann, own),
    recommended_action: recommend(x, issues, cann, own),
    status,
    evidence: evidence(x, own),
    _issueCount: issues.length,
    _owned: own.primary.concat(own.variants)
  };
}

// Articles
for (const a of articles) {
  const url = L.articleUrl(a);
  const body = a.body;
  const m = {
    words: words(body),
    h2: (body.match(/^##\s/gm) || []).length,
    tables: (body.match(/^\|/gm) || []).length ? 1 : 0,
    sources: Array.isArray(a.fm.sources) ? a.fm.sources.length : 0,
    bodyLinks: L.extractLinks(body).filter(h => h.startsWith('/')).length,
    leadWords: firstParagraph(body).split(/\s+/).filter(Boolean).length,
    unlinkedRefs: unlinkedRefs(body)
  };
  rows.push(buildRow({
    type: 'article', url, slug: a.fm.slug, file: a.file, title: String(a.fm.title || ''), description: String(a.fm.description || ''),
    titleLen: String(a.fm.title || '').length, descLen: String(a.fm.description || '').length,
    intent: String(a.fm.search_intent || ''), cluster: String(a.fm.topic_cluster || ''), subcluster: String(a.fm.subcluster || ''),
    tags: a.fm.tags, reviewRequired: String(a.fm.review_status || '').toUpperCase() === 'REVIEW_REQUIRED',
    plan: planByTitle[normTitle(a.fm.title)] || null, m
  }));
}
// Hubs + pages
const HUB_INTENT = { rental: 'commercial', 'monthly-rental': 'commercial' };
const PAGE_INTENT = { '/': 'navigational + commercial', '/articles/': 'navigational', '/about/': 'trust / navigational', '/contact/': 'transactional', '/faq/': 'informational', '/search/': 'navigational', '/privacy/': 'legal / trust', '/terms/': 'legal / trust' };
for (const p of pages) {
  const url = L.pageUrl(p);
  const isHub = p.file.startsWith('topics/');
  const title = p.fm.title ? String(p.fm.title) : (url === '/' ? siteTitle : '');
  const description = p.fm.description ? String(p.fm.description) : (url === '/' ? siteDesc : '');
  const m = {
    words: words(p.body), h2: (p.body.match(/<h2|^##\s/gm) || []).length, tables: 0, sources: 0,
    bodyLinks: L.extractLinks(p.body).filter(h => h.startsWith('/') || /relative_url/.test(h)).length + (L.stripLiquid(p.body).match(/'\/(articles|topics)\/[^']+'\s*\|\s*relative_url/g) || []).length,
    leadWords: firstParagraph(p.body).split(/\s+/).filter(Boolean).length, unlinkedRefs: 0,
    listed: isHub ? articles.filter(a => a.fm.topic_cluster === p.fm.topic_cluster).length : 0
  };
  // Liquid-filtered links are stripped by extractLinks; count them separately.
  m.bodyLinks = (p.body.match(/'\/(?:articles|topics|faq|contact|about)\/[^']*'\s*\|\s*relative_url/g) || []).length + L.extractLinks(p.body).filter(h => h.startsWith('/')).length;
  rows.push(buildRow({
    type: isHub ? 'hub' : 'page', url, slug: null, title, description, titleLen: title.length, descLen: description.length,
    intent: isHub ? (HUB_INTENT[p.fm.topic_cluster] || 'informational') : (PAGE_INTENT[url] || 'navigational'),
    cluster: isHub ? String(p.fm.topic_cluster) : 'site', subcluster: isHub ? 'hub (pillar)' : 'utility', tags: [], reviewRequired: false, plan: null, m
  }));
}

// Shared primary keyword after fallback = cannibalization signal.
const byPrimary = {};
for (const r of rows) (byPrimary[r.primary_keyword] = byPrimary[r.primary_keyword] || []).push(r.url);
for (const r of rows) {
  const others = (byPrimary[r.primary_keyword] || []).filter(u => u !== r.url);
  if (others.length) {
    const note = 'shares primary keyword "' + r.primary_keyword + '" with ' + others.join(', ');
    r.cannibalization = r.cannibalization === 'none detected' ? note : r.cannibalization + '; ' + note;
    if (r.priority === 'P3') r.priority = 'P2';
  }
}

const PRIO = { P0: 0, P1: 1, P2: 2, P3: 3 };
rows.sort((a, b) => PRIO[a.priority] - PRIO[b.priority] || (a.type === 'hub' ? -1 : 0) - (b.type === 'hub' ? -1 : 0) || a.url.localeCompare(b.url));

// ---------- summary ----------
// DATA-DRIVEN mode: when a Google Search Console export exists at docs/seo/gsc-performance.csv
// (or $GSC_CSV), measured clicks, impressions and positions are attached to every row as
// evidence and two deterministic bands can raise a P3 row to P2 (quick win, low CTR).
// Nothing is estimated; the file is read as exported. Until it exists the matrix stays in
// ZERO-DATA mode on public evidence only.
const GSC_PATH = process.env.GSC_CSV || path.join(OUT_DIR, 'gsc-performance.csv');
let gsc = null; const gscPages = {}; const gscQueries = [];
if (fs.existsSync(GSC_PATH)) {
  gsc = L.parseGscCsv(fs.readFileSync(GSC_PATH, 'utf8'));
  for (const r of gsc.rows) {
    if (r.page) { const p = gscPages[r.page] = gscPages[r.page] || { clicks: 0, impressions: 0, posW: 0, w: 0, queries: [] }; p.clicks += r.clicks || 0; p.impressions += r.impressions || 0; if (r.position != null) { const w = r.impressions || 1; p.posW += r.position * w; p.w += w; } if (r.query) p.queries.push(r.query); }
    if (r.query) gscQueries.push(r);
  }
  for (const row of rows) {
    const m = gscPages[row.url]; if (!m) continue;
    const pos = m.w ? m.posW / m.w : null;
    const sig = L.gscSignal({ clicks: m.clicks, impressions: m.impressions, position: pos, ctr: m.impressions ? m.clicks / m.impressions : null });
    row.evidence = (row.evidence && row.evidence !== 'none' ? row.evidence + '; ' : '') + 'GSC: ' + m.clicks + ' clicks, ' + m.impressions + ' impressions' + (pos != null ? ', avg position ' + pos.toFixed(1) : '') + (sig.kind !== 'measured' ? ' [' + sig.kind + ']' : '');
    if ((sig.kind === 'quick-win' || sig.kind === 'low-ctr') && row.priority === 'P3') {
      row.priority = 'P2';
      row.recommended_action = (sig.kind === 'quick-win' ? 'Quick win (measured): ' : 'Low CTR (measured): ') + sig.note + (row.recommended_action && row.recommended_action !== 'none' ? '; ' + row.recommended_action : '');
    }
  }
}
const summary = {
  mode: gsc ? 'DATA-DRIVEN' : 'ZERO-DATA',
  gsc: gsc ? { file: path.relative(L.ROOT, GSC_PATH), kind: gsc.kind, rows: gsc.rows.length, pagesMatched: rows.filter(r => gscPages[r.url]).length, pagesInExport: Object.keys(gscPages).length } : null,
  generated: TODAY,
  urls: rows.length,
  articles: rows.filter(r => r.type === 'article').length,
  hubs: rows.filter(r => r.type === 'hub').length,
  pages: rows.filter(r => r.type === 'page').length,
  byPriority: { P0: 0, P1: 0, P2: 0, P3: 0 },
  byStatus: {},
  issueFrequency: {},
  cannibalizationPairs: 0,
  keywordOwnership: allKeywords.map(k => {
    const row = rows.find(r => r.url === k.owner);
    return { group: k.group, keyword: k.keyword, owner: k.owner, ownerTitle: row ? row.current_title : '(missing URL)', coverage: row ? keywordCoverage(k.keyword, row.current_title + ' ' + (row.evidence || '')) : 'missing', variantOf: k.variant_of || '', gap: !!k.gap, intent: k.intent, ownerPriority: row ? row.priority : '-' };
  }),
  reportsUsed: Object.keys(reports).filter(t => reports[t]),
  dataLimitations: gsc ? ['DATA-DRIVEN MODE: ' + path.relative(L.ROOT, GSC_PATH) + ' (' + gsc.kind + ' export, ' + gsc.rows.length + ' rows) supplies measured clicks, impressions and positions; ' + Object.keys(gscPages).length + ' exported pages, matched to ' + rows.filter(r => gscPages[r.url]).length + ' matrix rows. Pages absent from the export have no measured evidence and keep their on-site priority.', 'Third-party demand estimates in docs/seo/keyword-universe.json remain for comparison only; measured Search Console data wins wherever both exist.'] : [(rankSnap ? 'ZERO-DATA MODE: no English Google Search Console or GA4 export exists yet (docs/SOURCE-MAP.md); the only measured position data is the third-party rank-tracker snapshot of ' + rankSnap.date + ' (' + rankSnap.tracked + ' tracked keywords, ' + rankSnap.ranking + ' ranking: positions only, no clicks, impressions or traffic); priorities use on-site evidence, that snapshot, the public SERP snapshots, competitor data and third-party demand estimates recorded in docs/seo/keyword-evidence.json and docs/seo/keyword-universe.json (tool and date on every number).' : 'ZERO-DATA MODE: no English Google Search Console, GA4 or rank-tracking export exists yet (docs/SOURCE-MAP.md); priorities use on-site evidence plus the public SERP snapshots, competitor data and third-party demand estimates recorded in docs/seo/keyword-evidence.json and docs/seo/keyword-universe.json (tool and date on every number).'), 'DATA-DRIVEN MODE starts automatically when docs/seo/gsc-performance.csv (a Search Console performance export) exists; until then no measured clicks, impressions or positions are claimed.']
};
for (const r of rows) {
  summary.byPriority[r.priority]++;
  const s = r.status.split(' ')[0]; summary.byStatus[s] = (summary.byStatus[s] || 0) + 1;
  if (r.cannibalization !== 'none detected') summary.cannibalizationPairs++;
  for (const i of r.seo_issues === 'none' ? [] : r.seo_issues.split('; ')) {
    const key = i.replace(/\d+/g, 'N').replace(/"[^"]+"/g, '"…"').replace(/\[[^\]]+\]/g, '').trim();
    summary.issueFrequency[key] = (summary.issueFrequency[key] || 0) + 1;
  }
}
// Keyword coverage uses title+description, not evidence; recompute cleanly.
for (const k of summary.keywordOwnership) {
  const row = rows.find(r => r.url === k.owner);
  const a = articles.find(x => L.articleUrl(x) === k.owner); const p = pages.find(x => L.pageUrl(x) === k.owner);
  const desc = a ? String(a.fm.description || '') : p ? String(p.fm.description || '') : '';
  k.coverage = row ? keywordCoverage(k.keyword, row.current_title + ' ' + desc) : 'missing';
}

// Content gap register: every People-also-ask question and related search
// recorded in keyword-evidence.json is resolved to the URL that serves it
// (a Common-questions entry, or a title/keyword match). Unserved ones are
// listed as gaps for the owner (the production plan is complete: no new
// articles are created by tooling; a gap is served by an existing URL or left).
const faqIndex = [];
for (const src of [...articles.map(a => ({ url: L.articleUrl(a), raw: a.raw })), ...pages.map(p => ({ url: L.pageUrl(p), raw: p.raw }))]) {
  const fmEnd = src.raw.indexOf('\n---', 3); const fmText = fmEnd > 0 ? src.raw.slice(0, fmEnd) : '';
  for (const q of fmText.matchAll(/^\s+- q: "([^"]+)"/gm)) faqIndex.push({ url: src.url, q: q[1], sig: gapSig(q[1]) });
}
const titleIndex = rows.map(r => ({ url: r.url, sig: gapSig(r.current_title + ' ' + (r.primary_keyword || '')) }));
function resolveGap(question) {
  if (/\bnear me\b/i.test(question) && rows.some(r => r.url === '/contact/')) return { url: '/contact/', how: 'local-intent query: address, map and hours on the contact page (the map pack itself is a Google Business Profile matter for the owner)', dHit: 0, tHit: 0 };
  const sigAll = gapSig(question); if (sigAll.length < 2) return null;
  const sigDistinct = sigAll.filter(w => !GAP_GENERIC.has(w));
  // A rental question goes to a page about renting before a buying guide; only when no
  // rental page qualifies does the best other page answer it (a route guide that covers
  // where to rent, for example).
  const wantsRent = sigAll.includes('rent') || sigAll.includes('hire');
  let best = null, bestRent = null;
  const consider = (e, how) => {
    const isRent = e.sig.includes('rent') || e.sig.includes('hire');
    const dHit = sigDistinct.filter(w => e.sig.includes(w)).length;
    const tHit = sigAll.filter(w => e.sig.includes(w)).length;
    // A title answers a question only when it carries all of the question's distinctive
    // words or two of them; a Common-questions entry may match on one (it is a question
    // the site already answers in its own words).
    const titleOk = how !== 'title/keyword match' || dHit >= Math.min(2, sigDistinct.length);
    const ok = sigDistinct.length === 0 ? tHit >= 2 : (dHit >= 1 && titleOk && dHit * 2 >= sigDistinct.length && tHit * 2 >= sigAll.length);
    if (!ok) return;
    if (!best || dHit > best.dHit || (dHit === best.dHit && tHit > best.tHit)) best = { url: e.url, how, dHit, tHit };
    if (isRent && (!bestRent || dHit > bestRent.dHit || (dHit === bestRent.dHit && tHit > bestRent.tHit))) bestRent = { url: e.url, how, dHit, tHit };
  };
  for (const e of faqIndex) consider(e, 'Common-questions entry: ' + e.q);
  for (const e of titleIndex) consider(e, 'title/keyword match');
  return (wantsRent && bestRent) || best;
}
// Every recorded SERP block in keyword-evidence.json feeds the register: a single
// snapshot (_serp_snapshot) or a block with a queries[] array (_serp_snapshot_hubs,
// _serp_snapshot_commercial, any future _serp_snapshot_* block).
const gapSources = [];
const seenGapQueries = new Set();
const pushGapSource = (q, market) => {
  const mk = String(q && (q.market || market) || '');
  const key = q && q.query ? (q.query + '|' + mk).toLowerCase() : '';
  if (!key || seenGapQueries.has(key)) return;
  seenGapQueries.add(key);
  gapSources.push({ query: q.query, market: mk, paa: q.people_also_ask || [], related: q.related_searches || [] });
};
if (evidenceMap) for (const key of Object.keys(evidenceMap).filter(k => k.startsWith('_serp_snapshot')).sort()) {
  const block = evidenceMap[key];
  if (!block || typeof block !== 'object') continue;
  if (Array.isArray(block.queries)) block.queries.forEach(q => pushGapSource(q, block.market)); else pushGapSource(block, block.market);
}
summary.contentGaps = [];
for (const gs of gapSources) {
  for (const [kind, list] of [['People also ask', gs.paa], ['Related search', gs.related]]) for (const q of list) {
    if (/reddit|quora|facebook/i.test(q)) { summary.contentGaps.push({ question: q, kind, serp: gs.query + (gs.market && !/united states/i.test(gs.market) ? ' [' + gs.market + ']' : ''), servedBy: '', how: 'community-platform query, not a content gap', gap: false }); continue; }
    if (OTHER_PLACE.test(q)) { summary.contentGaps.push({ question: q, kind, serp: gs.query + (gs.market && !/united states/i.test(gs.market) ? ' [' + gs.market + ']' : ''), servedBy: '', how: 'query about a place outside Vietnam, not a content gap', gap: false }); continue; }
    if (classifyKeyword(q) === 'competitor-brand') { summary.contentGaps.push({ question: q, kind, serp: gs.query + (gs.market && !/united states/i.test(gs.market) ? ' [' + gs.market + ']' : ''), servedBy: '', how: 'competitor brand name: never a target, not a content gap', gap: false }); continue; }
    if (classifyKeyword(q) === null && /for sale|\bsales?\b|cost of liv|hostel|hotel/i.test(q)) { summary.contentGaps.push({ question: q, kind, serp: gs.query + (gs.market && !/united states/i.test(gs.market) ? ' [' + gs.market + ']' : ''), servedBy: '', how: 'off-topic for this site (marketplace, lodging or living costs), not a content gap', gap: false }); continue; }
    const r = ownerResolve(q) || resolveGap(q);
    summary.contentGaps.push({ question: q, kind, serp: gs.query + (gs.market && !/united states/i.test(gs.market) ? ' [' + gs.market + ']' : ''), servedBy: r ? r.url : '', how: r ? r.how : 'no serving URL found', gap: !r });
  }
}
summary.contentGapCount = summary.contentGaps.filter(g => g.gap).length;

// Rank snapshot summary (third-party rank tracker): measured positions of the tracked keywords.
const aiSnap = aiBrandSnap;
summary.rankTracking = rankSnap ? {
  tool: rankSnap.tool, date: rankSnap.date, market: rankSnap.market, device: rankSnap.device, next_update: rankSnap.next_update || '',
  tracked: rankSnap.tracked, ranking: rankSnap.ranking, bands: rankSnap.bands,
  quickWins: Object.entries(rankByUrl).filter(([u, l]) => L.rankSignal(l).quickWin).map(([u, l]) => ({ url: u, keyword: L.rankSignal(l).best.keyword, position: L.rankSignal(l).best.position, workedSince: workedSinceRank(u) })).sort((a, b) => a.position - b.position || a.url.localeCompare(b.url)),
  mismatches: rankTable.filter(r => r.match === 'different URL').map(r => ({ keyword: r.keyword, position: r.position, rankingUrl: r.url, declaredOwner: r.owner })),
  undeclared: rankTable.filter(r => r.match === 'no owner declared').map(r => r.keyword),
  table: rankTable,
  ai: aiSnap ? { date: aiSnap.date, providers: aiSnap.providers, prompts: aiSnap.total_prompts, brand: aiSnap.brand, nameVariants: aiSnap.name_variants_seen } : null
} : null;

summary.aiVisibility = aiEngineSnap ? {
  tool: aiEngineSnap.tool, date: aiEngineSnap.date, market: aiEngineSnap.market, language: aiEngineSnap.language, engines: aiEngineSnap.engines,
  prompts: aiEngineSnap.prompts, observations: aiEngineSnap.observations, answered: aiEngineSnap.answered,
  ownCitedAnswers: aiEngineSnap.own_cited_answers, ownMentionedAnswers: aiEngineSnap.own_mentioned_answers, byEngine: aiEngineSnap.by_engine,
  promptRows: aiEngineSnap.prompt_rows, ownPages: aiEngineSnap.own_cited_pages, citedDomains: aiEngineSnap.cited_domains, citedDomainsTotal: aiEngineSnap.cited_domains_total
} : null;

// Keyword universe coverage (zero-data mode): every on-topic keyword recorded in
// docs/seo/keyword-universe.json (third-party demand estimates with tool, market and
// date) is mapped to the URL that serves it: the hand-authored owner in
// keyword-targets.json first, then the Common-questions / title resolver. A core
// keyword without a serving URL is a gap for the owner to serve inside an existing
// URL; the production plan is complete, so no new article is created by tooling.
const kwUniverse = readJSON(path.join(OUT_DIR, 'keyword-universe.json'), null);
summary.keywordUniverse = null;
if (kwUniverse && Array.isArray(kwUniverse.rows)) {
  const maxVol = r => Math.max(0, ...Object.values(r.volume || {}).map(v => v || 0));
  // Resolution order: (1) hand-authored owner whose keyword has the same stemmed word
  // set, or differs only by the site's own generic subject words; (2) a title or primary
  // keyword containing every word (hubs before pages before articles, closest first);
  // (3) a Common-questions entry containing every word; (4) the partial resolver of the
  // content gap register, reported as weak. "near me" queries are local intent.
  const kwIndex = rows.map(r => ({ url: r.url, type: r.type, sig: gapSig(r.current_title + ' ' + (r.primary_keyword || '')), pk: gapSig(r.primary_keyword || '') }));
  const typeRank = { hub: 0, page: 1, article: 2 };
  // A community-platform modifier ("... reddit") asks for first-hand answers to the same
  // question; it is resolved on the rest of the query and the modifier is noted.
  const PLATFORM = /\b(reddit|quora|tripadvisor|facebook|forums?)\b/gi;
  const resolveKeyword = kwIn => {
    const res = resolveKeywordCore(String(kwIn).replace(PLATFORM, ' ').replace(/\s+/g, ' ').trim());
    if (res && PLATFORM.test(String(kwIn))) res.how += ' (community-platform modifier ignored)';
    PLATFORM.lastIndex = 0;
    return res;
  };
  const resolveKeywordCore = kw => {
    if (/\bnear me\b/i.test(kw) && rows.some(r => r.url === '/contact/')) return { url: '/contact/', how: 'local-intent query: contact page (address, map, hours)', strength: 'local' };
    const sig = gapSig(kw); if (!sig.length) return null;
    const own = ownerResolve(kw);
    if (own) return own;
    const full = kwIndex.filter(e => sig.every(w => e.sig.includes(w)));
    if (full.length) {
      // A keyword made only of the site's own subject words belongs to a pillar (hub) before
      // any article; otherwise the closest primary keyword wins, then hubs, then shortest title.
      const allGeneric = sig.every(w => GAP_GENERIC.has(w));
      const pkFull = e => Number(sig.every(w => e.pk.includes(w)));
      full.sort((a, b) => (allGeneric ? (typeRank[a.type] - typeRank[b.type]) || (pkFull(b) - pkFull(a)) : (pkFull(b) - pkFull(a)) || (typeRank[a.type] - typeRank[b.type])) || (a.sig.length - b.sig.length) || a.url.localeCompare(b.url));
      return { url: full[0].url, how: 'title/keyword match', strength: 'title' };
    }
    const faq = faqIndex.find(e => sig.every(w => e.sig.includes(w)));
    if (faq) return { url: faq.url, how: 'Common-questions entry: ' + faq.q, strength: 'faq' };
    // Every distinctive word (brand, model, topic) in a title or primary keyword, only the
    // site's own subject words (motorbike, Vietnam, rental...) implied: the same rule the
    // owner match applies. A rental query stays with rental pages; then the closest primary
    // keyword, the most query words, a guide or review before a head-to-head comparison,
    // hubs, and the shortest title.
    const distinct = sig.filter(w => !GAP_GENERIC.has(w));
    const dFull = distinct.length ? kwIndex.filter(e => distinct.every(w => e.sig.includes(w))) : [];
    if (dFull.length) {
      const pkD = e => Number(distinct.every(w => e.pk.includes(w)));
      const hits = e => sig.filter(w => e.sig.includes(w)).length;
      const vs = e => Number(/-vs-/.test(e.url));
      const wantsRent = sig.includes('rent') || sig.includes('hire');
      const intentOk = e => Number(!wantsRent || e.sig.includes('rent') || e.sig.includes('hire'));
      dFull.sort((a, b) => (intentOk(b) - intentOk(a)) || (pkD(b) - pkD(a)) || (hits(b) - hits(a)) || (vs(a) - vs(b)) || (typeRank[a.type] - typeRank[b.type]) || (a.sig.length - b.sig.length) || a.url.localeCompare(b.url));
      return { url: dFull[0].url, how: 'title/keyword match on the distinctive words (' + distinct.join(' ') + ')', strength: 'title' };
    }
    const g = resolveGap(kw);
    return g ? { url: g.url, how: 'nearest URL (partial match): ' + g.how, strength: 'partial' } : null;
  };
  const mapped = kwUniverse.rows.map(r => {
    const res = r.relevance === 'competitor-brand' ? null : resolveKeyword(String(r.keyword));
    return Object.assign({}, r, { servedBy: res ? res.url : '', how: res ? res.how : (r.relevance === 'competitor-brand' ? 'competitor brand name: never a target' : 'no serving URL found'), strength: res ? res.strength : '', gap: !res && r.relevance === 'core', maxVolume: maxVol(r) });
  });
  summary.measuredQueries = gscQueries.length ? gscQueries.filter(q => q.query).sort((a, b) => (b.impressions || 0) - (a.impressions || 0)).slice(0, 100).map(q => { const res = resolveKeyword(q.query); return { query: q.query, clicks: q.clicks, impressions: q.impressions, position: q.position, page: q.page || '', servedBy: res ? res.url : '', how: res ? res.how : 'no serving URL found' }; }) : [];
  const byRelevance = {}; for (const r of mapped) byRelevance[r.relevance] = (byRelevance[r.relevance] || 0) + 1;
  const core = mapped.filter(r => r.relevance === 'core');
  const sumVol = (list, m) => list.reduce((n, r) => n + (r.volume && r.volume[m] ? r.volume[m] : 0), 0);
  summary.keywordUniverse = {
    generated: kwUniverse.generated || '', rows: mapped.length, byRelevance,
    coreServed: core.filter(r => r.servedBy).length, coreStrong: core.filter(r => r.servedBy && r.strength !== 'partial').length, coreWeak: core.filter(r => r.strength === 'partial').length, coreGaps: core.filter(r => r.gap).length,
    volumeByMarket: Object.fromEntries(Object.keys(kwUniverse.markets || {}).map(m => [m, { core: sumVol(core, m), coreServed: sumVol(core.filter(r => r.servedBy), m) }])),
    gaps: mapped.filter(r => r.gap).sort((a, b) => b.maxVolume - a.maxVolume).map(r => ({ keyword: r.keyword, topic: r.topic, intent: r.intent, volume: r.volume, competitors_ranking: r.competitors_ranking })),
    mapped
  };
}

// Cluster table
const clusterStats = {};
for (const a of articles) {
  const c = a.fm.topic_cluster; const cs = clusterStats[c] = clusterStats[c] || { articles: 0, commercial: 0, informational: 0, words: 0, p1: 0, p2: 0, subclusters: {} };
  cs.articles++; cs[a.fm.search_intent === 'commercial' ? 'commercial' : 'informational']++; cs.words += words(a.body);
  const sc = String(a.fm.subcluster || '(none)'); cs.subclusters[sc] = (cs.subclusters[sc] || 0) + 1;
}
for (const r of rows) if (r.type === 'article') { const c = r.topic_cluster.split(' / ')[0]; if (clusterStats[c]) { if (r.priority === 'P1') clusterStats[c].p1++; if (r.priority === 'P2') clusterStats[c].p2++; } }

// ---------- write outputs ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
const HEAD = ['URL', 'Current Title', 'Primary Keyword', 'Secondary Keywords', 'Search Intent', 'Topic Cluster', 'Content Quality', 'Cannibalization', 'Internal Links', 'SEO Issues', 'Priority', 'Recommended Action', 'Status', 'Evidence'];
const KEYS = ['url', 'current_title', 'primary_keyword', 'secondary_keywords', 'search_intent', 'topic_cluster', 'content_quality', 'cannibalization', 'internal_links', 'seo_issues', 'priority', 'recommended_action', 'status', 'evidence'];
const publicRows = rows.map(r => { const o = {}; for (const k of KEYS) o[k] = r[k]; o.type = r.type; return o; });

fs.writeFileSync(path.join(OUT_DIR, 'english-seo-master-matrix.csv'), [HEAD.map(csvCell).join(',')].concat(publicRows.map(r => KEYS.map(k => csvCell(r[k])).join(','))).join('\n') + '\n');
fs.writeFileSync(path.join(OUT_DIR, 'english-seo-master-matrix.json'), JSON.stringify({ summary, rows: publicRows }, null, 1) + '\n');

let md = '# English SEO Master Matrix\n\n';
md += 'Generated ' + TODAY + ' by `scripts/english-seo-matrix.js` from the QA tool reports (' + summary.reportsUsed.join(', ') + '), `docs/matrix/master-matrix.csv`, article front matter and `docs/seo/keyword-targets.json`. ';
md += '**Mode: ' + summary.mode + '.** ' + (summary.gsc ? 'Measured Search Console data from `' + summary.gsc.file + '` (' + summary.gsc.kind + ', ' + summary.gsc.rows + ' rows, ' + summary.gsc.pagesMatched + ' matrix rows matched) is attached as evidence and drives the quick-win and low-CTR bands. ' : (rankSnap ? 'No Search Console or analytics data exists yet; the only measured data is the third-party rank-tracker snapshot of ' + rankSnap.date + ' (positions only), and priorities rest on on-site evidence, that snapshot and the public research recorded in `docs/seo/keyword-evidence.json` and `docs/seo/keyword-universe.json`. Drop a Search Console export at `docs/seo/gsc-performance.csv` to switch to DATA-DRIVEN mode. ' : 'No Search Console, analytics or rank data exists yet; priorities rest on on-site evidence and the public research recorded in `docs/seo/keyword-evidence.json` and `docs/seo/keyword-universe.json`. Drop a Search Console export at `docs/seo/gsc-performance.csv` to switch to DATA-DRIVEN mode. '));
md += 'Full row set: `english-seo-master-matrix.csv` / `.json` (' + rows.length + ' URLs). This file shows every P0-P2 row in full and the P3 rows compactly.\n\n';
if (summary.keywordUniverse) {
  const u = summary.keywordUniverse;
  md += '## Keyword universe coverage (zero-data mode)\n\n';
  md += u.rows + ' on-topic keywords recorded in `docs/seo/keyword-universe.json` (third-party demand estimates, generated ' + u.generated + '): ' + Object.entries(u.byRelevance).map(([k, v]) => v + ' ' + k).join(', ') + '. Core keywords served by an existing URL: ' + u.coreServed + '; core gaps: ' + u.coreGaps + '. Estimated monthly demand covered (core served / core total): ' + Object.entries(u.volumeByMarket).map(([m, v]) => m.toUpperCase() + ' ' + v.coreServed + '/' + v.core).join(', ') + '. Full mapping: `docs/seo/keyword-universe.md`; silo-level view with demand per cluster and link-integrity recommendations: `docs/seo/topical-map.md` (scripts/topical-map.js).\n\n';
  if (u.gaps.length) {
    md += '| Gap keyword | Topic | Intent | Volume by market | Competitor ranking |\n|---|---|---|---|---|\n';
    for (const g of u.gaps) md += '| ' + mdCell(g.keyword) + ' | ' + g.topic + ' | ' + g.intent + ' | ' + Object.entries(g.volume || {}).map(([m, v]) => m + ' ' + v).join(', ') + ' | ' + mdCell((g.competitors_ranking || []).map(c => c.domain + ' #' + c.position).join(', ')) + ' |\n';
    md += '\n';
  }
}
if (summary.rankTracking) {
  const rt = summary.rankTracking; const b = rt.bands;
  md += '## Tracked rankings (third-party rank tracker, ' + rt.date + ')\n\n';
  md += mdCell(rt.tool) + ', ' + rt.market + ', ' + rt.device + ': ' + rt.tracked + ' keywords tracked, ' + rt.ranking + ' in the top 100 (top 3: ' + b.top3 + ', 4-10: ' + b.page1 + ', 11-20: ' + b.striking + ', 21-100: ' + b.deep + '; not ranking: ' + b.not_ranking + ', unstable: ' + b.unstable + '). These are measured positions of the best-ranking URL of this domain, not clicks, impressions or traffic' + (rt.next_update ? '; next tracker update ' + rt.next_update : '') + '. Positions 4-20 are the quick-win band: the page already ranks, so title, description, lead and internal links are worth hand work (a URL worked on since the snapshot, optimization-log batch with rank_work, waits for the next snapshot). A different URL ranking than the declared owner is a cannibalisation signal: link the pair with natural anchor text, never move content.\n\n';
  md += '| Keyword | Position | Ranking URL | Declared owner | Match |\n|---|---|---|---|---|\n';
  for (const r of rt.table.slice().sort((a, c) => (a.position == null) - (c.position == null) || a.position - c.position || a.keyword.localeCompare(c.keyword))) md += '| ' + mdCell(r.keyword) + ' | ' + (r.position == null ? '-' : r.position) + (r.previous != null && r.position != null && r.previous !== r.position ? ' (was ' + r.previous + ')' : '') + ' | ' + (r.url || '-') + ' | ' + (r.owner || '-') + ' | ' + r.match + ' |\n';
  if (rt.ai) md += '\nAI answers (' + (rt.ai.providers || []).join(', ') + ', ' + rt.ai.prompts + ' tracked prompts, ' + rt.ai.date + '): brand "' + mdCell((rt.ai.brand || {}).name) + '" mentioned ' + ((rt.ai.brand || {}).total_mentions == null ? '?' : rt.ai.brand.total_mentions) + ' time(s)' + ((rt.ai.nameVariants || []).length ? '; a spelling variant of the business name ("' + mdCell(rt.ai.nameVariants.map(v => v.name + '", average rank ' + v.average_rank).join('; "')) + ') was mentioned by the tool as a separate brand' : '') + '. Competitor mentions and per-prompt answers are in docs/seo/keyword-evidence.json (_tracking.ai_visibility_snapshots).\n';
  md += '\n';
}
if (summary.aiVisibility) {
  const av = summary.aiVisibility; const ENG = { chatgpt: 'ChatGPT', gemini: 'Gemini', google_ai_overview: 'Google AI Overviews', claude: 'Claude', perplexity: 'Perplexity' };
  md += '## AI answers and citations (third-party AI-answer check, ' + av.date + ')\n\n';
  md += mdCell(av.tool) + ', ' + av.market + ' (' + av.language + '): ' + av.prompts + ' prompts x ' + av.engines.length + ' engines = ' + av.observations + ' answers requested, ' + av.answered + ' collected. This domain was cited as a source in ' + av.ownCitedAnswers + ' answer(s) and its brand name was mentioned in ' + av.ownMentionedAnswers + '. By engine: ' + av.engines.map(e => (ENG[e] || e) + ' ' + av.byEngine[e].own_cited + ' cited of ' + av.byEngine[e].answered + ' answered' + (av.byEngine[e].failed ? ' (' + av.byEngine[e].failed + ' failed upstream)' : '')).join('; ') + '. One answer per prompt and engine is a sample, not a rate, and a citation is not a ranking, click or traffic figure. Raw rows: `docs/seo/keyword-evidence.json` (_tracking.ai_visibility_snapshots).\n\n';
  md += '| Prompt | ' + av.engines.map(e => ENG[e] || e).join(' | ') + ' |\n|---|' + av.engines.map(() => '---').join('|') + '|\n';
  for (const pr of av.promptRows) md += '| ' + mdCell(pr.prompt) + ' | ' + av.engines.map(e => { const c = pr.engines[e]; return !c ? '-' : !c.answered ? (c.status || 'no answer') : (c.own_cited ? 'cited' : 'not cited') + (c.own_mentioned ? ', named' : ''); }).join(' | ') + ' |\n';
  md += '\n';
  if (av.ownPages.length) { md += 'Pages of this site cited by AI answers (keep their facts and answer-first text accurate and stable):\n\n| Page | Answers | Prompts | Engines |\n|---|---|---|---|\n'; for (const pg of av.ownPages) md += '| ' + pg.url + ' | ' + pg.answers + ' | ' + pg.prompts + ' | ' + mdCell(pg.engines.join(', ')) + ' |\n'; md += '\n'; }
  md += 'Most-cited domains across these answers (' + av.citedDomainsTotal + ' distinct domains; the top ' + Math.min(15, av.citedDomains.length) + ' are shown). They show where the engines look for these topics; any off-site mention, profile or review work is owner-only (`docs/seo/link-prospects.md`).\n\n| Domain | Ownership | Answers | Prompts | Engines |\n|---|---|---|---|---|\n';
  for (const d of av.citedDomains.slice(0, 15)) md += '| ' + mdCell(d.domain) + ' | ' + d.ownership + ' | ' + d.answers + ' | ' + d.prompts + ' | ' + mdCell(d.engines.join(', ')) + ' |\n';
  md += '\n';
}
md += '## Data limitations (recorded, not blockers)\n\n' + summary.dataLimitations.map(l => '- ' + l).join('\n') + '\n\n';
md += '## Summary\n\n| Metric | Value |\n|---|---|\n';
md += '| URLs audited | ' + summary.urls + ' (' + summary.articles + ' articles, ' + summary.hubs + ' topic hubs, ' + summary.pages + ' site pages) |\n';
for (const p of ['P0', 'P1', 'P2', 'P3']) md += '| ' + p + ' | ' + summary.byPriority[p] + ' |\n';
md += '| URLs with a cannibalization signal | ' + summary.cannibalizationPairs + ' |\n';
md += '| Status | ' + Object.entries(summary.byStatus).map(([k, v]) => k + ' ' + v).join(', ') + ' |\n\n';
md += '### Issue frequency\n\n| Issue (normalised) | URLs |\n|---|---|\n';
for (const [k, v] of Object.entries(summary.issueFrequency).sort((a, b) => b[1] - a[1])) md += '| ' + mdCell(k) + ' | ' + v + ' |\n';
md += '\n### Cluster overview\n\n| Cluster | Hub | Articles | Commercial | Informational | Avg words | P1 | P2 |\n|---|---|---|---|---|---|---|---|\n';
for (const c of L.CLUSTERS) { const s = clusterStats[c]; if (!s) continue; md += '| ' + c + ' | /topics/' + c + '/ | ' + s.articles + ' | ' + s.commercial + ' | ' + s.informational + ' | ' + Math.round(s.words / s.articles) + ' | ' + s.p1 + ' | ' + s.p2 + ' |\n'; }
md += '\n### Core keyword ownership\n\n| Group | Keyword | Owner URL | Owner title | Title+description coverage | Owner priority |\n|---|---|---|---|---|---|\n';
for (const k of summary.keywordOwnership) md += '| ' + mdCell(k.group) + ' | ' + mdCell(k.keyword) + (k.variantOf ? ' (variant of ' + mdCell(k.variantOf) + ')' : '') + (k.gap ? ' GAP' : '') + ' | ' + k.owner + ' | ' + mdCell(k.ownerTitle) + ' | ' + k.coverage + ' | ' + k.ownerPriority + ' |\n';
md += '\n### Content gap register (People-also-ask and related searches, from keyword-evidence.json)\n\n' + summary.contentGaps.length + ' recorded questions, ' + summary.contentGapCount + ' without a serving URL. No new articles are created by tooling; a gap is a decision for the owner.\n\n| Question / search | Kind | From SERP of | Served by | How | Gap |\n|---|---|---|---|---|---|\n';
for (const g of summary.contentGaps) md += '| ' + mdCell(g.question) + ' | ' + g.kind + ' | ' + mdCell(g.serp) + ' | ' + (g.servedBy || '—') + ' | ' + mdCell(g.how) + ' | ' + (g.gap ? 'GAP' : 'no') + ' |\n';

function fullTable(list) {
  let t = '| ' + HEAD.join(' | ') + ' |\n|' + HEAD.map(() => '---').join('|') + '|\n';
  for (const r of list) t += '| ' + KEYS.map(k => mdCell(r[k])).join(' | ') + ' |\n';
  return t;
}
for (const p of ['P0', 'P1']) {
  const list = rows.filter(r => r.priority === p);
  md += '\n## ' + p + ' rows (' + list.length + ')\n\n' + (list.length ? fullTable(list) : '_None._\n');
}
const p2 = rows.filter(r => r.priority === 'P2');
md += '\n## P2 rows (' + p2.length + ') — batch work queue\n\nCompact view; the Internal Links and Evidence columns for these rows are in the CSV/JSON.\n\n| URL | Current Title | Primary Keyword | Search Intent | Content Quality | Cannibalization | SEO Issues | Recommended Action | Status |\n|---|---|---|---|---|---|---|---|---|\n';
for (const r of p2) md += '| ' + ['url', 'current_title', 'primary_keyword', 'search_intent', 'content_quality', 'cannibalization', 'seo_issues', 'recommended_action', 'status'].map(k => mdCell(r[k])).join(' | ') + ' |\n';
const p3 = rows.filter(r => r.priority === 'P3');
md += '\n## P3 rows (' + p3.length + ') — monitor only\n\n| URL | Primary Keyword | Content Quality | Status |\n|---|---|---|---|\n';
for (const r of p3) md += '| ' + r.url + ' | ' + mdCell(r.primary_keyword) + ' | ' + mdCell(r.content_quality) + ' | ' + mdCell(r.status) + ' |\n';
fs.writeFileSync(path.join(OUT_DIR, 'english-seo-master-matrix.md'), md);

// Keyword clusters document
let kc = '# English Keyword Clusters\n\n';
kc += 'Generated ' + TODAY + ' by `scripts/english-seo-matrix.js`. Keyword ownership is defined in `docs/seo/keyword-targets.json` (hand-authored, one owner URL per keyword family); the 14 topic clusters are the implemented site taxonomy (`docs/TAXONOMY.md`, `_data/navigation.yml`). No search volumes are stated: no English Search Console export exists yet (docs/SOURCE-MAP.md), and volumes are never invented.\n\n';
kc += '## Rules\n\n- Every URL has exactly ONE primary search intent and ONE primary keyword; variants and secondary keywords are listed on the owner, never spread across competing URLs.\n- Topic hubs (`/topics/<cluster>/`) are the pillar pages; commercial rental intents live in `rental` and `monthly-rental` and link outward to the vehicle, legal, safety and travel clusters.\n- Cannibalization is avoided by differentiating audience, question, location, vehicle type, comparison or use case — never by creating keyword-variant articles. The production plan is complete; gaps are served by the nearest existing URL.\n- Only services actually offered are targeted (docs/OWNER-FACTS.md): daily/weekly/monthly rental, Hanoi delivery by arrangement, WhatsApp/Zalo/phone/walk-in booking. No app, no online payment, no insurance, no promotions.\n\n';
kc += '## Core keyword groups -> owner URLs\n\n';
for (const g of kwTargets.groups || []) {
  kc += '### ' + g.group + '\n\n| Keyword | Intent | Owner URL | Owner title | Coverage | Supporting URLs | Note |\n|---|---|---|---|---|---|---|\n';
  for (const k of g.keywords || []) {
    const ko = summary.keywordOwnership.find(x => x.keyword === k.keyword && x.owner === k.owner);
    kc += '| ' + mdCell(k.keyword) + (k.variant_of ? ' _(variant of ' + mdCell(k.variant_of) + ')_' : '') + (k.tracked ? ' _(rank-tracked)_' : '') + (k.gap ? ' **GAP**' : '') + ' | ' + k.intent + ' | ' + k.owner + ' | ' + mdCell(ko ? ko.ownerTitle : '') + ' | ' + (ko ? ko.coverage : '') + ' | ' + mdCell((k.supporting || []).join(', ')) + ' | ' + mdCell(k.note || '') + ' |\n';
  }
  kc += '\n';
}
kc += '## Topic cluster map (14 clusters, ' + articles.length + ' articles)\n\n| # | Cluster | Hub (pillar) | Articles | Commercial | Informational | Avg words | Subclusters |\n|---|---|---|---|---|---|---|---|\n';
L.CLUSTERS.forEach((c, i) => { const s = clusterStats[c]; if (!s) return; kc += '| ' + (i + 1) + ' | ' + c + ' | /topics/' + c + '/ | ' + s.articles + ' | ' + s.commercial + ' | ' + s.informational + ' | ' + Math.round(s.words / s.articles) + ' | ' + Object.keys(s.subclusters).length + ' |\n'; });
kc += '\n### Subclusters\n\n';
for (const c of L.CLUSTERS) {
  const s = clusterStats[c]; if (!s) continue;
  kc += '**' + c + '**\n\n| Subcluster | Articles | Example URLs |\n|---|---|---|\n';
  for (const [sc, n] of Object.entries(s.subclusters).sort()) {
    const ex = articles.filter(a => a.fm.topic_cluster === c && String(a.fm.subcluster || '(none)') === sc).slice(0, 3).map(a => L.articleUrl(a));
    kc += '| ' + mdCell(sc) + ' | ' + n + ' | ' + ex.join(', ') + ' |\n';
  }
  kc += '\n';
}
kc += '## Cannibalization watchlist\n\n| URL | Signal | Recommended differentiation |\n|---|---|---|\n';
for (const r of rows.filter(r => r.cannibalization !== 'none detected')) kc += '| ' + r.url + ' | ' + mdCell(r.cannibalization) + ' | ' + mdCell(r.recommended_action) + ' |\n';
kc += '\n## Gaps (no dedicated URL; served by nearest existing URL — no new articles)\n\n| Keyword | Served by | Why |\n|---|---|---|\n';
for (const k of allKeywords.filter(k => k.gap)) kc += '| ' + mdCell(k.keyword) + ' | ' + k.owner + ' | ' + mdCell(k.note || '') + ' |\n';
fs.writeFileSync(path.join(OUT_DIR, 'english-keyword-clusters.md'), kc);

// ---------- zero-data research documents ----------
// Written from docs/seo/keyword-evidence.json (SERP snapshots, competitor set,
// backlink profiles, observed content formats, analysis notes) and the keyword
// universe mapping above. Regenerated on every run so they never drift from the
// recorded evidence; maintenance.js restores them byte-for-byte when unchanged.
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return String(u || ''); } };
const serpBlocks = evidenceMap ? Object.keys(evidenceMap).filter(k => k.startsWith('_serp_snapshot')).sort().map(k => evidenceMap[k]).filter(b => b && typeof b === 'object') : [];
const serpQueries = [];
for (const b of serpBlocks) { const list = Array.isArray(b.queries) ? b.queries : [b]; for (const q of list) if (q && q.query) serpQueries.push(Object.assign({ market: b.market || q.market || '', date: b.date || '' }, q)); }
{
  let sl = '# SERP landscape (zero-data mode)\n\n';
  sl += 'Generated ' + TODAY + ' by `scripts/english-seo-matrix.js` from the live SERP snapshots, competitor discovery, backlink profiles and page-format observations recorded in `docs/seo/keyword-evidence.json` (every block names its tool and date). Nothing here is measured site traffic: the site has no Search Console or analytics data yet, so this document describes the public search landscape the site competes in.\n\n';
  sl += '## Recorded SERPs (' + serpQueries.length + ')\n\n| Query | Market | Date | Features | Local pack | PAA | Related | en.rentbikehanoi.com | Brand (Nguyen Tu) mentions |\n|---|---|---|---|---|---|---|---|---|\n';
  for (const q of serpQueries) sl += '| ' + mdCell(q.query) + ' | ' + mdCell(q.market) + ' | ' + mdCell(q.date) + ' | ' + mdCell((q.features || []).join(', ')) + ' | ' + ((q.local_pack || []).length || (q.features || []).includes('local_pack') ? (q.local_pack ? q.local_pack.length : 'yes') : 'no') + ' | ' + (q.people_also_ask || []).length + ' | ' + (q.related_searches || []).length + ' | ' + ((q.en_rentbikehanoi_positions || []).length ? '#' + q.en_rentbikehanoi_positions.join(', #') : 'not ranking') + ' | ' + mdCell((q.brand_mentions || []).join('; ') || (q.organic_top || []).filter(o => /nguyen ?tu|nguyentu/i.test(o)).join('; ') || '-') + ' |\n';
  const freq = {};
  for (const q of serpQueries) for (const o of q.organic_top || []) { const m = String(o).match(/^(\d+)\.\s+([^\s/]+)/); const d = m ? m[2] : String(o).split(' ')[0].replace(/\/.*$/, ''); const pos = m ? Number(m[1]) : null; const f = freq[d] = freq[d] || { count: 0, best: null, queries: [] }; f.count++; if (pos && (f.best === null || pos < f.best)) f.best = pos; if (!f.queries.includes(q.query)) f.queries.push(q.query); }
  sl += '\n## Organic competitor frequency\n\nHow often each domain appears in the recorded top organic results (position in brackets where recorded). Platforms (reddit, facebook, tripadvisor) are listed because they are what a searcher actually sees.\n\n| Domain | Appearances | Best position | Queries |\n|---|---|---|---|\n';
  for (const [d, f] of Object.entries(freq).sort((a, b) => b[1].count - a[1].count || (a[1].best || 99) - (b[1].best || 99))) sl += '| ' + mdCell(d) + ' | ' + f.count + ' | ' + (f.best === null ? '-' : '#' + f.best) + ' | ' + mdCell(f.queries.join('; ')) + ' |\n';
  const packs = serpQueries.filter(q => Array.isArray(q.local_pack) && q.local_pack.length);
  if (packs.length) {
    sl += '\n## Local pack entries\n\nRatings and review counts are as displayed in the pack on the fetch date (Google Business Profiles), recorded as evidence of what wins the map pack; the profile itself is an owner-side asset outside this repository.\n\n| Query | Business | Domain | Rating | Reviews |\n|---|---|---|---|---|\n';
    for (const q of packs) for (const l of q.local_pack) sl += '| ' + mdCell(q.query) + ' | ' + mdCell(l.title) + ' | ' + mdCell(l.domain) + ' | ' + (l.rating == null ? '-' : l.rating) + ' | ' + (l.reviews == null ? '-' : l.reviews) + ' |\n';
  }
  sl += '\n## Top organic results per query\n\n';
  for (const q of serpQueries) { sl += '**' + mdCell(q.query) + '** (' + mdCell(q.market) + ', ' + mdCell(q.date) + ')\n\n'; for (const o of q.organic_top || []) sl += '- ' + mdCell(o) + '\n'; if ((q.people_also_ask || []).length) sl += '\nPeople also ask: ' + q.people_also_ask.map(mdCell).join(' · ') + '\n'; if ((q.related_searches || []).length) sl += '\nRelated searches: ' + q.related_searches.map(mdCell).join(' · ') + '\n'; sl += '\n'; }
  const comp = evidenceMap && evidenceMap._competitors;
  if (comp && Array.isArray(comp.rows)) {
    sl += '## Organic competitor set\n\n' + mdCell(comp.tool) + ', ' + mdCell(comp.date) + ', market ' + mdCell(comp.market) + '. ' + mdCell(comp.note || '') + '\n\n| Domain | Shared seeds | Avg position | Median position | Visibility |\n|---|---|---|---|---|\n';
    for (const c of comp.rows) sl += '| ' + mdCell(c.domain) + ' | ' + c.shared_keywords + ' | ' + c.avg_position + ' | ' + c.median_position + ' | ' + c.visibility + ' |\n';
    const dd = comp.deep_dive;
    if (dd && dd.summary) {
      sl += '\n### Deep dive: ' + mdCell(dd.domain) + '\n\n' + mdCell(dd.tool) + ', ' + mdCell(dd.date) + ', market ' + mdCell(dd.market) + '. Indexed keywords ' + dd.summary.organic_keywords + ' (top 3: ' + dd.summary.top_3_keywords + ', top 10: ' + dd.summary.top_10_keywords + '), estimated organic visits/month ' + dd.summary.estimated_organic_traffic_per_month + '. Intent mix: ' + Object.entries(dd.intent_mix || {}).map(([k, v]) => k + ' ' + Math.round(v * 100) + '%').join(', ') + '.\n\n| Top page | Indexed keywords | Est. visits/month | Top-3 keywords |\n|---|---|---|---|\n';
      for (const p of dd.top_pages || []) sl += '| ' + mdCell(p.url) + ' | ' + p.organic_keywords + ' | ' + p.est_traffic_month + ' | ' + p.top_3_keywords + ' |\n';
      sl += '\n| Top keyword | Position | Est. monthly volume | Intent |\n|---|---|---|---|\n';
      for (const k of dd.top_keywords || []) sl += '| ' + mdCell(k.keyword) + ' | ' + k.position + ' | ' + k.monthly_volume + ' | ' + mdCell(k.intent) + ' |\n';
    }
  }
  const cf = evidenceMap && evidenceMap._content_formats;
  if (cf && Array.isArray(cf.pages)) {
    sl += '\n## What the ranking pages look like\n\n' + mdCell(cf.tool) + ', ' + mdCell(cf.date) + '. ' + mdCell(cf.note || '') + '\n\n';
    for (const p of cf.pages) sl += '- **' + mdCell(p.ranks) + '** - ' + mdCell(p.url) + '\n  - Title: ' + mdCell(p.title) + '\n  - Format: ' + mdCell(p.format) + '\n  - Sections: ' + (p.sections || []).map(mdCell).join(' · ') + '\n';
  }
  const an = evidenceMap && evidenceMap._analysis;
  if (an) {
    sl += '\n## Reading (' + mdCell(an.date) + ')\n\n' + mdCell(an.scope || '') + '\n\n### Findings\n\n' + (an.findings || []).map(f => '- ' + mdCell(f)).join('\n') + '\n\n### Implications for this repository\n\n' + (an.implications || []).map(f => '- ' + mdCell(f)).join('\n') + '\n';
  }
  fs.writeFileSync(path.join(OUT_DIR, 'serp-landscape.md'), sl);
}
if (summary.keywordUniverse) {
  const u = summary.keywordUniverse; const markets = Object.keys(kwUniverse.markets || {});
  let ku = '# Keyword universe (zero-data mode)\n\n';
  ku += 'Generated ' + TODAY + ' by `scripts/english-seo-matrix.js` from `docs/seo/keyword-universe.json` (' + u.rows + ' on-topic rows, generated ' + u.generated + '). Volumes are a third-party search index\'s monthly estimates per market, read through the OpenRush connector on the date recorded in the JSON; they are prioritisation evidence, not facts to publish, and will be replaced by Search Console data in DATA-DRIVEN mode. Markets: ' + markets.map(m => m.toUpperCase() + ' = ' + kwUniverse.markets[m]).join(', ') + '.\n\n';
  ku += '## Sources\n\n| Tool | Seed / scope | Market | Date | Returned | Available | On-topic rows kept |\n|---|---|---|---|---|---|---|\n';
  for (const sr of kwUniverse.sources || []) ku += '| ' + mdCell(sr.tool) + ' | ' + mdCell(sr.seed ? sr.mode + ' "' + sr.seed + '"' : sr.domain ? sr.domain + (sr.competitors ? ' vs ' + sr.competitors.join(', ') : '') : '') + ' | ' + mdCell(sr.market) + ' | ' + mdCell(sr.date) + ' | ' + (sr.returned == null ? '-' : sr.returned) + ' | ' + (sr.total_available == null ? '-' : sr.total_available) + ' | ' + sr.on_topic_rows + ' |\n';
  ku += '\n## Coverage\n\n' + Object.entries(u.byRelevance).map(([k, v]) => '- ' + k + ': ' + v).join('\n') + '\n- core served by an existing URL: ' + u.coreServed + ' (' + u.coreWeak + ' only by a partial match, marked _weak_); core gaps: ' + u.coreGaps + '\n- estimated monthly demand covered (core served / core total): ' + Object.entries(u.volumeByMarket).map(([m, v]) => m.toUpperCase() + ' ' + v.coreServed + '/' + v.core).join(', ') + '\n\n';
  const vol = (r, m) => (r.volume && r.volume[m] != null) ? r.volume[m] : '';
  const table = list => { let t = '| Keyword | Intent | ' + markets.map(m => m.toUpperCase()).join(' | ') + ' | Competitor ranking | Serving URL | How |\n|---|---|' + markets.map(() => '---').join('|') + '|---|---|---|\n'; for (const r of list) t += '| ' + mdCell(r.keyword) + (r.gap ? ' **GAP**' : r.strength === 'partial' ? ' _weak_' : '') + ' | ' + mdCell(r.intent) + ' | ' + markets.map(m => vol(r, m)).join(' | ') + ' | ' + mdCell((r.competitors_ranking || []).map(c => c.domain + ' #' + c.position).join(', ')) + ' | ' + (r.servedBy || '-') + ' | ' + mdCell(r.how) + ' |\n'; return t; };
  const topics = [...new Set(u.mapped.filter(r => r.relevance === 'core').map(r => r.topic))].sort();
  ku += '## Core keywords by topic\n\n';
  for (const t of topics) { const list = u.mapped.filter(r => r.relevance === 'core' && r.topic === t).sort((a, b) => b.maxVolume - a.maxVolume || a.keyword.localeCompare(b.keyword)); ku += '### ' + t + ' (' + list.length + ')\n\n' + table(list) + '\n'; }
  for (const rel of ['adjacent', 'other-city', 'competitor-brand']) { const list = u.mapped.filter(r => r.relevance === rel).sort((a, b) => b.maxVolume - a.maxVolume); if (!list.length) continue; ku += '## ' + rel + ' (' + list.length + ')\n\n' + (rel === 'competitor-brand' ? 'Recorded to understand the SERP; never targeted in titles, headings or copy.\n\n' : rel === 'other-city' ? 'Rental intent for cities the business does not serve; only Vietnam-wide informational guides may serve them.\n\n' : 'Vietnam riding context without the vehicle word; served where an existing guide fits, never counted as a gap.\n\n') + table(list) + '\n'; }
  if (summary.measuredQueries && summary.measuredQueries.length) {
    ku += '## Measured queries (Search Console, DATA-DRIVEN mode)\n\nTop queries by impressions from ' + (summary.gsc ? summary.gsc.file : 'the export') + ', mapped to the URL that serves them.\n\n| Query | Clicks | Impressions | Position | Landing page (export) | Serving URL | How |\n|---|---|---|---|---|---|---|\n';
    for (const q of summary.measuredQueries) ku += '| ' + mdCell(q.query) + ' | ' + (q.clicks == null ? '' : q.clicks) + ' | ' + (q.impressions == null ? '' : q.impressions) + ' | ' + (q.position == null ? '' : q.position) + ' | ' + mdCell(q.page) + ' | ' + (q.servedBy || '-') + ' | ' + mdCell(q.how) + ' |\n';
    ku += '\n';
  }
  fs.writeFileSync(path.join(OUT_DIR, 'keyword-universe.md'), ku);
}
{
  const cb = evidenceMap && evidenceMap._competitor_backlinks; const base = evidenceMap && evidenceMap._domain_baseline;
  let lp = '# Link prospects (zero-data mode)\n\n';
  lp += 'Generated ' + TODAY + ' by `scripts/english-seo-matrix.js` from the backlink evidence in `docs/seo/keyword-evidence.json`. Off-site work is an owner task: this list records where comparable Hanoi/Vietnam rental sites earned editorial links so outreach can start from evidence instead of guesswork. Links are never bought and competitor brand names are never used in anchor text or copy.\n\n';
  if (base) lp += '## Starting point\n\n' + Object.entries(base).filter(([k]) => !/^_|^note$|^tool$|^date$/.test(k)).map(([k, v]) => '- ' + mdCell(k) + ': ' + mdCell(typeof v === 'object' ? JSON.stringify(v) : v)).join('\n') + (base.tool || base.date ? '\n- source: ' + mdCell([base.tool, base.date].filter(Boolean).join(', ')) : '') + (summary.aiVisibility ? '\n- AI answers (' + mdCell(summary.aiVisibility.tool) + ', ' + summary.aiVisibility.market + ', ' + summary.aiVisibility.date + '): this domain was cited in ' + summary.aiVisibility.ownCitedAnswers + ' of ' + summary.aiVisibility.answered + ' collected answers (' + summary.aiVisibility.engines.map(e => e + ' ' + summary.aiVisibility.byEngine[e].own_cited + '/' + summary.aiVisibility.byEngine[e].answered).join(', ') + ') and its brand name was mentioned in ' + summary.aiVisibility.ownMentionedAnswers + '; one answer per prompt and engine is a sample' : '') + (rankSnap ? '\n- rank tracker (' + mdCell(rankSnap.tool) + ', ' + rankSnap.market + ' ' + rankSnap.device + ', ' + rankSnap.date + '): ' + rankSnap.ranking + ' of ' + rankSnap.tracked + ' tracked keywords in the top 100, ' + rankSnap.bands.top3 + ' in the top 3 (positions only; the domain overview above lags the rank tracker, so its zero organic keywords is not the current position)' : '') + '\n\n';
  if (summary.aiVisibility) {
    const av = summary.aiVisibility; const others = av.citedDomains.filter(d => d.ownership !== 'own').slice(0, 20);
    lp += '## Domains AI answers cite for these topics\n\n' + mdCell(av.tool) + ', ' + av.date + ', ' + av.market + ': the pages the engines listed as sources for ' + av.prompts + ' renter and licence questions (' + av.citedDomainsTotal + ' distinct domains; top ' + others.length + ' not owned by this site). Where the engines look is where a correct, consistent mention of the business is worth having; all of it is owner-only off-site work (a profile or mention that restates only docs/OWNER-FACTS.md, never a bought or undisclosed one).\n\n| Domain | Answers | Prompts | Engines |\n|---|---|---|---|\n';
    for (const d of others) lp += '| ' + mdCell(d.domain) + ' | ' + d.answers + ' | ' + d.prompts + ' | ' + mdCell(d.engines.join(', ')) + ' |\n';
    lp += '\n';
  }
  if (cb && cb.domains) {
    lp += '## Competitor link profiles\n\n' + mdCell(cb.tool) + ', ' + mdCell(cb.date) + '. ' + mdCell(cb.note || '') + '\n\n| Domain | Domain rank | Referring domains | Backlinks | Dofollow ratio | Spam score | Clean referring domains listed |\n|---|---|---|---|---|---|---|\n';
    for (const [d, v] of Object.entries(cb.domains)) lp += '| ' + mdCell(d) + ' | ' + v.authority.domain_rank + ' | ' + (v.referring_domains_total || v.authority.referring_domains) + ' | ' + v.authority.backlinks_total + ' | ' + v.authority.dofollow_ratio + ' | ' + v.authority.spam_score + ' | ' + v.clean_referring_domains.length + ' of ' + v.referring_domains_returned + ' returned |\n';
    const seen = {};
    const own = new Set((cb.own_properties || []).map(x => String(x).toLowerCase()));
    for (const [d, v] of Object.entries(cb.domains)) for (const r of v.clean_referring_domains) { if (own.has(String(r.domain).toLowerCase())) continue; const e = seen[r.domain] = seen[r.domain] || { linksTo: [], page_rank: 0, backlinks: 0, first_seen: r.first_seen }; e.linksTo.push(d); e.page_rank = Math.max(e.page_rank, r.page_rank); e.backlinks += r.backlinks; if (r.first_seen < e.first_seen) e.first_seen = r.first_seen; }
    lp += '\n## Prospect list (' + Object.keys(seen).length + ' domains, spam score <= 20)\n\nSorted by page-level rank of the linking page (index value, not domain authority). "Links to" shows which competitor earned the link; a domain linking to two competitors is the strongest editorial signal. The owner reviews each for fit (travel/expat editorial, directories that accept a business listing, partner pages) before any outreach.\n\n| Referring domain | Links to | Page rank | Backlinks | First seen |\n|---|---|---|---|---|\n';
    for (const [d, e] of Object.entries(seen).sort((a, b) => b[1].linksTo.length - a[1].linksTo.length || b[1].page_rank - a[1].page_rank)) lp += '| ' + mdCell(d) + ' | ' + e.linksTo.join(', ') + ' | ' + e.page_rank + ' | ' + e.backlinks + ' | ' + e.first_seen + ' |\n';
  }
  const brand = serpQueries.flatMap(q => (q.brand_mentions || []).map(b => ({ query: q.query, mention: b })));
  lp += '\n## Existing footholds (brand already visible)\n\n' + (brand.length ? '| Query | Result |\n|---|---|\n' + brand.map(b => '| ' + mdCell(b.query) + ' | ' + mdCell(b.mention) + ' |').join('\n') + '\n' : 'None recorded.\n');
  lp += '\nThese third-party pages (TripAdvisor listing, Facebook posts) already rank for commercial Hanoi queries; keeping their business details identical to docs/OWNER-FACTS.md (name, address, phone, hours) and linking them to the site is the cheapest consistency win.\n';
  fs.writeFileSync(path.join(OUT_DIR, 'link-prospects.md'), lp);
}

console.log('english-seo-matrix: ' + rows.length + ' URLs -> P0=' + summary.byPriority.P0 + ' P1=' + summary.byPriority.P1 + ' P2=' + summary.byPriority.P2 + ' P3=' + summary.byPriority.P3 + '; keyword owners=' + Object.keys(ownerMap).length + '; wrote docs/seo/english-seo-master-matrix.{csv,json,md} + english-keyword-clusters.md + serp-landscape.md + keyword-universe.md + link-prospects.md');
