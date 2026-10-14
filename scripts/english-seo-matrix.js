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
const stem = w => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(ing|ers|er|ed|es|s|al)$/, '');
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
const UNLINKED_REF_PATTERNS = [
  /see our guide/i,
  /\bthe [a-z][a-z \-]{2,40} (?:article|guide) (?:lists|covers|explains|walks|goes|shows|has|describes)\b/i,
  /\b(?:our|the) (?:separate|dedicated|companion|full) (?:guide|article)\b/i,
  /covered in (?:our|the|a separate) /i,
  /\(see [^)]{3,80}\)/i
];
function unlinkedRefs(body) {
  const text = L.stripLiquid(body);
  // Remove existing markdown/html links so linked references are not counted.
  const noLinks = text.replace(/\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<a [^>]*>[\s\S]*?<\/a>/gi, ' ');
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
  const row = { id: r[0], topic: r[1], title: r[2], primaryQuery: r[3], intent: r[4], cluster: r[5], subcluster: r[6], contentType: r[7], audience: r[8], sourceBasis: r[9], closest: r[12], differentiation: r[13], status: r[15] };
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
    if (k.variant_of || k.gap) o.variants.push(k.keyword); else o.primary.push(k.keyword);
    if (k.note) o.notes.push(k.note);
    if (k.gap) o.gaps.push(k.keyword);
    for (const s of k.supporting || []) {
      const so = ownerMap[s] = ownerMap[s] || { primary: [], variants: [], supporting: [], notes: [], gaps: [] };
      so.supporting.push(k.keyword);
    }
  }
}
const statusMap = readJSON(path.join(OUT_DIR, 'matrix-status.json'), {});
const evidenceMap = readJSON(path.join(OUT_DIR, 'keyword-evidence.json'), null);
// scripts/link-bare-slugs.js --apply records which articles had bare slug
// references converted into contextual links; that becomes the default status
// for those URLs unless matrix-status.json says something more specific.
const linkRepair = readJSON(path.join(L.ROOT, 'reports', 'link-bare-slugs.json'), null);
const linkRepairByFile = {};
if (linkRepair && linkRepair.mode === 'apply') for (const f of linkRepair.perFile || []) linkRepairByFile[f.file] = { links: f.links, date: String(linkRepair.generated || '').slice(0, 10) };

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
  return out;
}

function recommend(x, issues, cann, own) {
  const acts = [];
  if (x.reviewRequired) acts.push('Owner re-verification against primary sources, then VERIFIED with a new last_reviewed');
  if (x.titleLen > TITLE_MAX) acts.push('Trim title to <=' + TITLE_MAX + ' chars, primary keyword first, same URL');
  if (x.descLen > DESC_MAX) acts.push('Tighten meta description to 120-160 chars with the primary keyword and a direct answer');
  if (x.type === 'article' && x.m.bodyLinks === 0) acts.push('Add 2-4 contextual in-body links (topic hub + supporting guides)');
  if (x.type === 'article' && x.m.unlinkedRefs > 0) acts.push('Convert the ' + x.m.unlinkedRefs + ' unlinked guide reference(s) into real links');
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
  const hardIssues = issues.filter(i => !/^served keyword/.test(i));
  if ((coreOwner || x.type === 'hub') && hardIssues.length) return 'P1';
  if (x.reviewRequired) return 'P1';
  if (cann.some(c => /sim (0\.9|1\.0)/.test(c))) return 'P1';
  const commercial = /commercial|transactional/.test(x.intent);
  if ((commercial && issues.length) || cann.length || issues.some(i => /zero explicit inbound|unlinked guide reference/.test(i))) return 'P2';
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
  const status = st ? (st.status + (st.date ? ' ' + st.date : '') + (st.note ? ' - ' + st.note : ''))
    : x.reviewRequired ? 'REVIEW_REQUIRED (awaiting owner re-verification)'
    : repair ? 'LINKS_REPAIRED ' + repair.date + ' - ' + repair.links + ' bare slug reference(s) converted to contextual links (scripts/link-bare-slugs.js)'
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
const summary = {
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
  dataLimitations: ['No English Google Search Console export is available (docs/SOURCE-MAP.md); priorities use on-site evidence only.', 'No search volumes or rankings are recorded unless docs/seo/keyword-evidence.json exists.']
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
md += 'Full row set: `english-seo-master-matrix.csv` / `.json` (' + rows.length + ' URLs). This file shows every P0-P2 row in full and the P3 rows compactly.\n\n';
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
    kc += '| ' + mdCell(k.keyword) + (k.variant_of ? ' _(variant of ' + mdCell(k.variant_of) + ')_' : '') + (k.gap ? ' **GAP**' : '') + ' | ' + k.intent + ' | ' + k.owner + ' | ' + mdCell(ko ? ko.ownerTitle : '') + ' | ' + (ko ? ko.coverage : '') + ' | ' + mdCell((k.supporting || []).join(', ')) + ' | ' + mdCell(k.note || '') + ' |\n';
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

console.log('english-seo-matrix: ' + rows.length + ' URLs -> P0=' + summary.byPriority.P0 + ' P1=' + summary.byPriority.P1 + ' P2=' + summary.byPriority.P2 + ' P3=' + summary.byPriority.P3 + '; keyword owners=' + Object.keys(ownerMap).length + '; wrote docs/seo/english-seo-master-matrix.{csv,json,md} + english-keyword-clusters.md');
