// Shared helpers for the quality toolkit. Plain Node.js, no dependencies.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLUSTERS = ['rental','monthly-rental','scooters','motorcycles','manual-clutch','50cc','electric','maintenance','parts-gear','safety','law-licences','hanoi','trips','vietnam-travel'];
const SITE_URL = 'https://thuexemayhanoi.github.io';
const BASEURL = '/english';

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
  /^noindex URL included in sitemap/
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

function findH1s(text) {
  const out = [];
  for (const m of text.matchAll(/^#\s+(.*)$/gm)) out.push(m[1].trim());
  for (const m of text.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)) out.push(m[1].replace(/<[^>]+>/g, '').trim());
  return out.filter(Boolean);
}

function extractLinks(body) {
  const links = [];
  for (const m of stripLiquid(body).matchAll(/\]\(([^)]+)\)/g)) links.push(m[1]);
  for (const m of stripLiquid(body).matchAll(/href="([^"]+)"/g)) links.push(m[1]);
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

module.exports = { ROOT, CLUSTERS, SITE_URL, BASEURL, PRIMARY_LEGAL_DOMAINS, isPrimaryLegalSource, isBlocking, walk, parseFrontMatter, loadArticles, loadPages, articleUrl, pageUrl, stripLiquid, findH1s, extractLinks, Findings, sitemapLocs, isDynamicallyListed, expectedIndexableUrls };
