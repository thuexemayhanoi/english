// Shared helpers for the quality toolkit. Plain Node.js, no dependencies.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLUSTERS = ['rental','monthly-rental','scooters','motorcycles','manual-clutch','50cc','electric','maintenance','parts-gear','safety','law-licences','hanoi','trips','vietnam-travel'];
const SITE_URL = 'https://en.rentbikehanoi.com';
const BASEURL = '';

// Primary legal source domains (class A per docs/SOURCE-MAP.md GOVERNMENT/LEGAL).
// Everything else (thuvienphapluat.vn = B, mva.vn = C, news, blogs) is secondary.
const PRIMARY_LEGAL_DOMAINS = ['chinhphu.vn', 'vanban.chinhphu.vn', 'bocongan.gov.vn', 'gov.vn', 'moit.gov.vn', 'mot.gov.vn', 'mof.gov.vn'];

function isPrimaryLegalSource(url) {
  if (!url) return false;
  const m = String(url).match(/^https?:\/\/([^\/\s]+)/i);
  const host = m ? m[1].toLowerCase() : String(url).toLowerCase();
  return PRIMARY_LEGAL_DOMAINS.some(d => host === d || host.endsWith('.' + d));
}

// ============================================================
// CENTRAL BLOCKING RULE — used by every validator and build-report.
// P0 always blocks. P1 blocks only when clearly structural/correctness.
// Ordinary P2/P3 never block.
// ============================================================
const BLOCKING_P1_PATTERNS = [
  /^duplicate slug/,
  /^YAML parse issue/,
  /^missing required field /,
  /^unknown topic_cluster/,
  /^legal article VERIFIED without primary/,
  /^invalid date/,
  /^broken internal link/,
  /^broken (?:asset|file) link/,
  /^stale (?:legacy|\/english)/,
  /^canonical (?:is not|does not)/,
  /^public output /,
  /^missing public /,
  /^invalid public /,
  /^internal_link_targets references missing slug/,
  /^missing topic hub/,
  /doubled \/english\/english/,
  /^duplicate canonical/,
  /^accidental noindex/,
  /^noindex page included in sitemap/,
  /^indexable URL missing from sitemap/,
  /^duplicate sitemap URL/,
  /^sitemap URL with no corresponding/,
  /^excluded content in sitemap/,
  /^topic hub omitted from sitemap/,
  /^invalid JSON-LD/,
  /^BreadcrumbList without itemListElement/,
  /^broken breadcrumb/,
  /^noindex URL included in sitemap/,
  /^package2 (?:eligible article missing|slug or URL changed|article marked DONE below|status entry outside)/
];

function isBlocking(finding) {
  if (!finding) return false;
  if (finding.severity === 'P0') return true;
  if (finding.severity !== 'P1') return false;
  return BLOCKING_P1_PATTERNS.some(re => re.test(finding.issue));
}

function walk(dir, out) {
  out = out || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '_queue' || e.name === 'docs' || e.name === 'vendor' || e.name === 'reports') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

// Minimal YAML front-matter parser: handles flat scalars, quoted strings and simple lists.
function parseFrontMatter(raw) {
  if (!raw.startsWith('---')) return { fm: null, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { fm: null, body: raw };
  const yaml = raw.slice(4, end);
  const body = raw.slice(end + 4).replace(/^\s*$/, '');
  const fm = {}; const errors = [];
  let key = null; let list = null;
  for (const line of yaml.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = line.match(/^\s*-\s+(.*)$/);
    if (m && key) { const v = scalar(m[1], errors); if (list) list.push(v); else fm[key].push(v); continue; }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      key = kv[1]; list = null;
      const rest = kv[2].trim();
      if (rest === '') { fm[key] = []; list = fm[key]; }
      else if (rest.startsWith('[') && rest.endsWith(']')) {
        fm[key] = rest.slice(1, -1).split(',').map(s => scalar(s.trim(), errors)).filter(s => s !== '');
      } else { fm[key] = scalar(rest, errors); list = null; }
    }
  }
  return { fm, body, errors };
}

function scalar(s, errors) {
  s = s.trim();
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    if (s.slice(1, -1).includes('"')) errors.push('internal quote in ' + s);
    return s.slice(1, -1);
  }
  if (s.startsWith("'") && s.endsWith("'") && s.length >= 2) return s.slice(1, -1);
  return s;
}

function loadArticles() {
  const dir = path.join(ROOT, '_articles');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const { fm, body, errors } = parseFrontMatter(raw);
    return { file: '_articles/' + f, name: f, fm: fm || {}, body: body || '', raw, parseErrors: errors || [] };
  });
}

function loadPages() {
  // pages = top-level .md/.html with front matter (excluding collections/layouts/includes) + topic hub pages
  const pages = [];
  for (const f of walk(ROOT)) {
    const rel = path.relative(ROOT, f).split(path.sep).join('/');
    if (rel.startsWith('_') || rel.startsWith('assets/')) continue;
    if (!/\.(md|html)$/.test(rel)) continue;
    const raw = fs.readFileSync(f, 'utf8');
    const { fm, body, errors } = parseFrontMatter(raw);
    pages.push({ file: rel, fm: fm || {}, body: body || '', raw, parseErrors: errors || [] });
  }
  return pages;
}

function articleUrl(a) {
  const slug = (a.fm && (a.fm.slug || a.fm.title)) || a.name.replace(/\.md$/, '');
  return '/articles/' + String(slug).toLowerCase().replace(/\s+/g, '-') + '/';
}

function pageUrl(p) {
  if (p.fm && p.fm.permalink) return p.fm.permalink;
  const rel = p.file.replace(/\.(md|html)$/, '');
  return '/' + (rel === 'index' ? '' : rel + '/');
}

// Extract a Liquid-rendered approximation of body content for link/h1 extraction.
function stripLiquid(s) {
  return s.replace(/{%[\s\S]*?%}/g, '').replace(/{{[\s\S]*?}}/g, '');
}

// ---------- Content word count (SEO Package 2 — CONTENT DEPTH 1600+) ----------
// The words a reader actually reads in the Markdown body: headings, paragraphs, list items,
// table cells and link text. Not counted: YAML front matter (the caller passes the body), fenced
// and inline code, HTML tags and comments, <script>/<style>, Liquid tags and outputs, link URLs,
// image markup, reference-link definitions, kramdown attributes and bare URLs. Components the
// layouts add around the body (related cards, sources panel, Common questions rendered from
// `faq:` front matter, navigation, footer) are never in the body, so they are never counted.
// A word is a whitespace/dash-separated token with at least one letter or digit.
// Markup is removed with small scanners (indexOf loops), not tag-matching regexes: a comment may
// end with --> or --!>, a closing tag may carry spaces, and a stray "<" in prose is not a tag.
function removeBlocks(text, open, closers) {
  let out = ''; let i = 0; const low = text.toLowerCase();
  for (;;) {
    const a = low.indexOf(open, i);
    if (a < 0) { out += text.slice(i); break; }
    out += text.slice(i, a) + ' ';
    let end = -1;
    for (const c of closers) { const b = low.indexOf(c, a + open.length); if (b >= 0 && (end < 0 || b + c.length < end)) end = b + c.length; }
    if (end < 0) break;
    const gt = closers[0] === '-->' ? end : low.indexOf('>', end);
    i = gt < 0 ? text.length : (closers[0] === '-->' ? end : gt + 1);
  }
  return out;
}
function removeTags(text) {
  let out = ''; let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch === '<' && /[A-Za-z\/!]/.test(text[i + 1] || '')) {
      let j = i + 1; while (j < text.length && text[j] !== '>' && text[j] !== '\n') j++;
      if (text[j] === '>') { out += ' '; i = j + 1; continue; }
    }
    out += ch; i++;
  }
  return out;
}
function contentText(body) {
  let s = String(body == null ? '' : body).replace(/\r\n?/g, '\n');
  s = removeBlocks(s, '<!--', ['-->', '--!>']);
  s = s.replace(/^[ \t]*(```|~~~)[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*$/gm, ' ');
  s = removeBlocks(s, '<script', ['</script']);
  s = removeBlocks(s, '<style', ['</style']);
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  s = s.replace(/\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)/g, '$1 ');
  s = s.replace(/^[ \t]*\[[^\]]+\]:\s*\S+.*$/gm, ' ');
  s = s.replace(/{%[\s\S]*?%}/g, ' ').replace(/{{[\s\S]*?}}/g, ' ');
  s = s.replace(/`[^`\n]*`/g, ' ');
  s = removeTags(s);
  s = s.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&[a-z]+;|&#\d+;/gi, ' ');
  s = s.replace(/https?:\/\/\S+/g, ' ');
  s = s.replace(/\{:[^}]*\}|\{#[^}]*\}/g, ' ');
  s = s.replace(/^[ \t]*\|?[ \t]*:?-{2,}:?[ \t]*(\|[ \t]*:?-{2,}:?[ \t]*)*\|?[ \t]*$/gm, ' ');
  s = s.replace(/^[ \t]*([-*_])([ \t]*\1){2,}[ \t]*$/gm, ' ');
  s = s.replace(/^[ \t]*(#{1,6}[ \t]+|>[ \t]?|(?:[-*+]|\d+[.)])[ \t]+)+/gm, ' ');
  s = s.replace(/\|/g, ' ').replace(/[*_]{1,3}/g, ' ');
  return s;
}
function contentWords(body) {
  return contentText(body).split(/[\s–—]+/).filter(t => /[A-Za-z0-9À-ɏ]/.test(t)).length;
}

// Prose references to another guide that are not hyperlinks (README "see our guide" class); shared by the English SEO Master Matrix
// and the Package 2 lint so one rule decides what counts as an unlinked reference.
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
  const text = stripLiquid(body);
  // Replace existing markdown/html links by a marker so linked references are not counted.
  const noLinks = text.replace(/\[[^\]]*\]\([^)]*\)/g, ' ' + LINK_MARK + ' ').replace(/<a [^>]*>[\s\S]*?<\/a>/gi, ' ' + LINK_MARK + ' ');
  let n = 0;
  for (const re of UNLINKED_REF_PATTERNS) { const m = noLinks.match(new RegExp(re.source, re.flags + 'g')); if (m) n += m.length; }
  return n;
}

function findH1s(text) {
  const out = [];
  for (const m of text.matchAll(/^#\s+(.*)$/gm)) out.push(m[1].trim());
  for (const m of text.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)) out.push(m[1].replace(/<[^>]+>/g, '').trim());
  return out.filter(Boolean);
}

// Resolve the house-style Liquid URL filters to their site-root path before any
// other Liquid is stripped, so links written as
//   [text]({{ '/articles/slug/' | relative_url }})  or  href="{{ '/topics/x/' | relative_url }}"
// are audited like plain root-relative links instead of disappearing.
function resolveLiquidUrls(s) {
  return s.replace(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*(?:relative_url|absolute_url)\s*\}\}/g, '$1');
}

function extractLinks(body) {
  const links = [];
  const text = stripLiquid(resolveLiquidUrls(body));
  for (const m of text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) links.push(m[1]);
  for (const m of text.matchAll(/href="([^"]+)"/g)) links.push(m[1]);
  return links;
}

class Findings {
  constructor() { this.items = []; }
  add(severity, file, url, issue, fix) { this.items.push({ severity, file, url, issue, fix }); }
  get counts() {
    const c = { P0: 0, P1: 0, P2: 0, P3: 0 };
    for (const i of this.items) c[i.severity]++;
    return c;
  }
  get blocking() { return this.items.filter(isBlocking); }
  get hasBlocking() { return this.items.some(isBlocking); }
  has(sevs) { return this.items.some(i => sevs.includes(i.severity)); }
}

// Is this article dynamically listed by a valid hub and the all-guides index?
// cluster.html lists articles by topic_cluster; articles/index.md lists by cluster;
// index.html lists the latest six. An article with a valid cluster whose hub exists
// and whose all-guides index exists is therefore linked at render time.
function isDynamicallyListed(a) {
  if (!a.fm || !a.fm.topic_cluster || !CLUSTERS.includes(a.fm.topic_cluster)) return false;
  const hub = path.join(ROOT, 'topics', a.fm.topic_cluster, 'index.md');
  const allGuides = path.join(ROOT, 'articles', 'index.md');
  return fs.existsSync(hub) && fs.existsSync(allGuides);
}

// Render the Liquid sitemap template approximately: static paths, hub loop, article loop.
function sitemapLocs(raw, articles) {
  const abs = (u) => SITE_URL + BASEURL + u;
  let s = raw.replace(/\{\{\s*'([^']*)'\s*\|\s*absolute_url\s*\}\}/g, (m, p) => abs(p));
  const hubLoop = /\{%\s*assign hub_paths = "([^"]+)"[^%]*%\}[\s\S]*?\{%\s*endfor\s*%\}/;
  const m = s.match(hubLoop);
  if (m) {
    const hubs = m[1].split(',').filter(Boolean);
    s = s.replace(hubLoop, hubs.map(h => '  <url><loc>' + abs(h) + '</loc></url>').join('\n'));
  }
  // articles loop: {% for a in site.articles %}...{% endfor %}
  const artLoop = /\{%\s*for a in site\.articles\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/;
  const am = s.match(artLoop);
  if (am && articles) {
    const rendered = articles.map(a => '  <url><loc>' + abs(articleUrl(a)) + '</loc></url>').join('\n');
    s = s.replace(artLoop, rendered);
  }
  return [...s.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x => x[1].trim());
}

// Expected indexable URL set (absolute) for the whole site.
function expectedIndexableUrls(articles) {
  const abs = (u) => SITE_URL + BASEURL + u;
  const set = new Set([abs('/'), abs('/articles/'), abs('/about/'), abs('/search/'), abs('/faq/'), abs('/contact/'), abs('/privacy/'), abs('/terms/')]);
  for (const c of CLUSTERS) set.add(abs('/topics/' + c + '/'));
  for (const a of articles) set.add(abs(articleUrl(a)));
  return set;
}

// ---------- Search Console export (DATA-DRIVEN mode) ----------
// The matrix engine runs in ZERO-DATA mode until docs/seo/gsc-performance.csv exists.
// That file is a Google Search Console performance export (Pages table, Queries table,
// or a combined page+query export). Nothing here estimates or invents a number: rows
// are parsed as exported and aggregated per page; the only derived figure is the
// impression-weighted average position.
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  const s = String(text);
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; continue; }
    if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && s[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
function sitePath(u) {
  const v = String(u || '').trim(); if (!v) return '';
  try { const p = new URL(v, SITE_URL).pathname; return /\.[a-z0-9]+$/i.test(p) ? p : p.replace(/\/?$/, '/'); } catch (e) { return v; }
}
function parseGscCsv(text) {
  const rows = parseCsv(String(text).replace(/^\uFEFF/, ''));
  if (!rows.length) return { kind: 'empty', rows: [] };
  const head = rows[0].map(h => String(h).trim().toLowerCase());
  const idx = names => head.findIndex(h => names.includes(h));
  const iPage = idx(['top pages', 'page', 'pages', 'url', 'landing page']);
  const iQuery = idx(['top queries', 'query', 'queries', 'keyword']);
  const iClicks = idx(['clicks']), iImp = idx(['impressions']), iCtr = idx(['ctr']), iPos = idx(['position', 'average position', 'avg. position']);
  if ((iPage < 0 && iQuery < 0) || iImp < 0) return { kind: 'unknown', rows: [] };
  const num = v => { const n = parseFloat(String(v == null ? '' : v).replace(/[%,\s]/g, '')); return isNaN(n) ? null : n; };
  const out = [];
  for (const r of rows.slice(1)) {
    if (!r.length || r.every(c => !String(c).trim())) continue;
    const ctrRaw = iCtr >= 0 ? String(r[iCtr] == null ? '' : r[iCtr]) : '';
    const ctr = iCtr >= 0 ? (ctrRaw.includes('%') ? num(ctrRaw) / 100 : num(ctrRaw)) : null;
    out.push({ page: iPage >= 0 ? sitePath(r[iPage]) : null, query: iQuery >= 0 ? String(r[iQuery] == null ? '' : r[iQuery]).trim().toLowerCase() : null, clicks: iClicks >= 0 ? num(r[iClicks]) : null, impressions: num(r[iImp]), ctr: ctr == null || isNaN(ctr) ? null : ctr, position: iPos >= 0 ? num(r[iPos]) : null });
  }
  return { kind: iPage >= 0 && iQuery >= 0 ? 'page-query' : iPage >= 0 ? 'pages' : 'queries', rows: out };
}
// One deterministic reading per page. Bands are conventional and documented in the
// README: a quick win is real demand (>= 50 impressions) ranking on page 1-2 but not
// top 3; low CTR is a top-3 position that rarely gets the click.
function gscSignal(m) {
  const imp = m.impressions || 0, clicks = m.clicks || 0, pos = m.position;
  if (imp >= 50 && pos != null && pos >= 4 && pos <= 20) return { kind: 'quick-win', note: imp + ' impressions at average position ' + pos.toFixed(1) + ': sharpen title, intro and Common questions for the measured queries' };
  if (imp >= 200 && pos != null && pos < 4 && m.ctr != null && m.ctr < 0.02) return { kind: 'low-ctr', note: 'top-3 position with CTR ' + (m.ctr * 100).toFixed(1) + '%: rewrite the title and description for the click' };
  if (imp === 0 && clicks === 0) return { kind: 'no-demand', note: 'indexed but no impressions in the export window' };
  return { kind: 'measured', note: imp + ' impressions, ' + clicks + ' clicks' + (pos != null ? ', average position ' + pos.toFixed(1) : '') };
}

// Rank-tracker snapshots (docs/seo/keyword-evidence.json _tracking.rank_snapshots): measured
// third-party positions, dated, never estimated. The latest snapshot is the one the matrix uses.
function latestRankSnapshot(evidence) {
  const t = evidence && evidence._tracking;
  const list = t && Array.isArray(t.rank_snapshots) ? t.rank_snapshots.filter(x => x && Array.isArray(x.rows)) : [];
  list.sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.market).localeCompare(String(b.market)));
  return list.length ? list[list.length - 1] : null;
}
// Band of the best tracked position of one URL: top3 (1-3), page1 (4-10), striking (11-20), deep (21-100).
// page1 and striking are the quick-win bands: the page already ranks, so title, description,
// lead and internal links are worth hand work; top3 is protected, deep needs authority first.
function rankSignal(entries) {
  const ranked = (entries || []).filter(e => e && e.position != null && Number(e.position) > 0);
  if (!ranked.length) return { band: 'none', best: null, quickWin: false };
  const best = ranked.reduce((a, b) => (Number(b.position) < Number(a.position) ? b : a));
  const p = Number(best.position);
  const band = p <= 3 ? 'top3' : p <= 10 ? 'page1' : p <= 20 ? 'striking' : 'deep';
  return { band, best, quickWin: band === 'page1' || band === 'striking' };
}

module.exports = { ROOT, CLUSTERS, SITE_URL, BASEURL, PRIMARY_LEGAL_DOMAINS, isPrimaryLegalSource, isBlocking, walk, parseFrontMatter, loadArticles, loadPages, articleUrl, pageUrl, stripLiquid, contentText, contentWords, unlinkedRefs, UNLINKED_REF_PATTERNS, findH1s, extractLinks, Findings, sitemapLocs, isDynamicallyListed, expectedIndexableUrls, parseCsv, parseGscCsv, gscSignal, sitePath, latestRankSnapshot, rankSignal };
